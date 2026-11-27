"""Post-deploy IndexNow notifications for the public ONNELLAB site only.

State is an accepted-content digest map, not a search-index or conversion report.
The only outbound POST is to the official IndexNow endpoint.
"""
import argparse
import concurrent.futures
import hashlib
import json
import os
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

HOST = "onnellab.com"
ORIGIN = "https://" + HOST
ENDPOINT = "https://api.indexnow.org/indexnow"
LOCALES = {"ko", "ja", "zh-hans", "zh-hant", "pt-br", "de", "fr", "es", "en"}
PUBLIC = LOCALES | {"apps", "about", "blog", "release-notes", "privacy", "terms"}
MAX_BYTES = 8 * 1024 * 1024
TIMEOUT = 8
BATCH = 100

def eligible(url):
    p = urllib.parse.urlsplit(url)
    parts = p.path.strip("/").split("/") if p.path != "/" else []
    return (p.scheme == "https" and p.netloc == HOST and not p.query and not p.fragment
            and p.path.startswith("/") and p.path.endswith("/")
            and all(re.fullmatch(r"[A-Za-z0-9_.-]+", x) and x not in (".", "..") for x in parts)
            and (not parts or parts[0] in PUBLIC))

def sitemap_urls(data):
    root = ET.fromstring(data)
    if root.tag != "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset":
        raise ValueError("Expected canonical sitemap urlset")
    return {n.text.strip() for n in root.findall("{*}url/{*}loc") if n.text}

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonical = []
        self.noindex = False
        self.tokens = []
        self.skip = None
        self.in_main = False
        self.main = []
        self.body = []
        self.in_body = False
        self.jsonld = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script" and a.get("type") == "application/ld+json":
            self.jsonld = []
        if tag in ("script", "style", "noscript", "template"):
            self.skip = tag
            return
        if self.skip:
            return
        if tag == "body":
            self.in_body = True
        if tag == "main":
            self.in_main = True
        if tag == "meta":
            name = (a.get("name") or "").lower()
            if name in ("robots", "bingbot") and "noindex" in (a.get("content") or "").lower():
                self.noindex = True
            if name == "description":
                self.tokens.append(("description", a.get("content", "")))
        if tag == "link":
            rel = (a.get("rel") or "").lower().split()
            if "canonical" in rel:
                self.canonical.append(a.get("href"))
            if "alternate" in rel and a.get("hreflang"):
                self.tokens.append(("alternate", a.get("hreflang"), a.get("href")))
        if self.in_main and tag in ("a", "img"):
            self.main.append((tag, a.get("href", ""), a.get("alt", "")))

    def handle_endtag(self, tag):
        if self.skip == tag:
            self.skip = None
            if tag == "script" and self.jsonld is not None:
                try:
                    self.tokens.append(("jsonld", json.loads("".join(self.jsonld))))
                except (ValueError, TypeError):
                    self.tokens.append(("jsonld-invalid",))
                self.jsonld = None
            return
        if tag == "main":
            self.in_main = False
        if tag == "body":
            self.in_body = False

    def handle_data(self, data):
        if self.jsonld is not None:
            self.jsonld.append(data)
        if self.skip:
            return
        s = " ".join(data.split())
        if not s:
            return
        if self.in_main:
            self.main.append(s)
        if self.in_body:
            self.body.append(s)
        else:
            self.tokens.append(s)

def digest(url, html, robots_header=""):
    page = Page()
    page.feed(html.decode("utf-8", errors="strict"))
    if page.canonical != [url] or page.noindex or "noindex" in robots_header.lower():
        return None
    value = json.dumps([page.tokens, page.main or page.body], ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(value.encode()).hexdigest()

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

OPENER = urllib.request.build_opener(NoRedirect())

def fetch(url, data=None):
    req = urllib.request.Request(url, data=data, headers={
        "User-Agent": "ONNELLAB-Search-Discovery/1.0",
        "Content-Type": "application/json; charset=utf-8",
    })
    try:
        with OPENER.open(req, timeout=TIMEOUT) as response:
            body = response.read(MAX_BYTES + 1)
            if len(body) > MAX_BYTES:
                raise ValueError("response too large")
            return response.status, body, response.headers
    except urllib.error.HTTPError as exc:
        return exc.code, b"", exc.headers

def read_json(path):
    return json.loads(pathlib.Path(path).read_text())

def write_json(path, data):
    p = pathlib.Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")
    tmp.replace(p)

def key_value(required=True):
    key = os.environ.get("INDEXNOW_KEY", "")
    if not re.fullmatch(r"[a-f0-9]{32}", key):
        if required:
            raise ValueError("IndexNow ownership key missing or invalid")
        return None
    return key

def verify_key(key):
    status, body, _ = fetch(ORIGIN + "/" + key + ".txt")
    if status != 200 or body.strip() != key.encode():
        raise ValueError("IndexNow public ownership key not deployed")

def prepare(dist, out):
    dist = pathlib.Path(dist)
    urls = sitemap_urls((dist / "sitemap.xml").read_bytes())
    if not urls or any(not eligible(url) for url in urls):
        raise ValueError("Sitemap contains invalid or non-public URLs")
    pages = {}
    excluded = []
    for url in sorted(urls):
        rel = urllib.parse.urlsplit(url).path.strip("/")
        path = dist / rel / "index.html"
        try:
            value = digest(url, path.read_bytes())
        except (OSError, UnicodeError, ValueError):
            value = None
        if value:
            pages[url] = value
        else:
            excluded.append(url)
    if ORIGIN + "/" not in pages:
        raise ValueError("Canonical homepage missing from built manifest")
    key = key_value(False)
    if key:
        (dist / (key + ".txt")).write_text(key)
    write_json(out, {"version": 1, "sitemap": sorted(urls), "pages": pages, "excluded": excluded})
    print(f"Built discovery manifest: {len(pages)} indexable, {len(excluded)} excluded")

def checked_manifest(value):
    if value.get("version") != 1:
        raise ValueError("Unknown discovery manifest version")
    urls, pages = value["sitemap"], value["pages"]
    if not urls or not all(eligible(u) for u in urls):
        raise ValueError("Invalid manifest sitemap")
    if not all(u in urls and re.fullmatch(r"[a-f0-9]{64}", d) for u, d in pages.items()):
        raise ValueError("Invalid manifest page digest")
    return pages

def check_page(item):
    url, expected = item
    try:
        code, body, headers = fetch(url)
        if expected is None:
            return url, code in (404, 410), code
        ok = (code == 200 and digest(url, body, headers.get("X-Robots-Tag", "")) == expected)
        return url, ok, code
    except (OSError, ValueError, UnicodeError):
        return url, False, 0

def priority(url):
    path = urllib.parse.urlsplit(url).path
    return (0 if path == "/" else 1 if path.startswith("/apps/") else 2 if path.startswith("/blog/") else 3, url)

def notify(manifest, previous, out):
    current = read_json(manifest)
    pages = checked_manifest(current)
    old = {}
    if previous:
        value = read_json(previous)
        if value.get("version") != 1 or not isinstance(value.get("accepted"), dict):
            raise ValueError("Invalid prior accepted state; refuse bootstrap")
        old = value["accepted"]
        if any(not eligible(u) or not re.fullmatch(r"[a-f0-9]{64}", d) for u, d in old.items()):
            raise ValueError("Invalid prior state")
    accepted = old.copy()
    report = {"version": 1, "accepted": accepted, "attempted": [], "pending": []}
    write_json(out, report)
    key = key_value()
    verify_key(key)
    code, body, _ = fetch(ORIGIN + "/sitemap.xml")
    if code != 200 or sitemap_urls(body) != set(current["sitemap"]):
        raise ValueError("Live sitemap does not match deployed manifest")
    code, robots, _ = fetch(ORIGIN + "/robots.txt")
    if code != 200:
        raise ValueError("Live robots.txt unavailable")
    rp = urllib.robotparser.RobotFileParser()
    rp.parse(robots.decode().splitlines())
    changes = {u: d for u, d in pages.items() if old.get(u) != d}
    changes.update({u: None for u in old if u not in current["sitemap"]})
    candidates = sorted(changes, key=priority)
    # Check only new/changed/removed pages, never blindly submit the full sitemap each run.
    for start in range(0, len(candidates), BATCH):
        batch = candidates[start:start + BATCH]
        allowed = [u for u in batch if changes[u] is None or rp.can_fetch("Bingbot", u)]
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            checked = list(pool.map(check_page, [(u, changes[u]) for u in allowed]))
        if any(code == 429 for _, _, code in checked):
            report["pending"].extend(candidates[start:])
            write_json(out, report)
            raise ValueError("Live site rate limited; stop")
        ready = [u for u, ok, _ in checked if ok]
        report["pending"].extend(u for u in batch if u not in ready)
        if not ready:
            write_json(out, report)
            continue
        payload = json.dumps({"host": HOST, "key": key, "keyLocation": ORIGIN + "/" + key + ".txt", "urlList": ready}).encode()
        try:
            code, _, _ = fetch(ENDPOINT, payload)
        except (OSError, ValueError):
            code = 0
        report["attempted"].append({"status": code, "count": len(ready)})
        if code not in (200, 202):
            report["pending"].extend(ready + candidates[start + BATCH:])
            write_json(out, report)
            raise ValueError(f"IndexNow returned HTTP {code}; no immediate retry")
        for u in ready:
            if changes[u] is None:
                accepted.pop(u, None)
            else:
                accepted[u] = changes[u]
        write_json(out, report)
    print(f"IndexNow notification: {sum(x['count'] for x in report['attempted'] if x['status'] in (200, 202))} accepted, {len(report['pending'])} pending; indexing not verified")
    if report["pending"]:
        raise ValueError("Some candidate URLs not verified; retry after later deployment")

def audit():
    status, raw, _ = fetch(ORIGIN + "/sitemap.xml")
    if status != 200:
        raise ValueError("Sitemap unavailable")
    urls = sitemap_urls(raw)
    if not urls or any(not eligible(u) for u in urls):
        raise ValueError("Sitemap contains invalid or non-public URLs")
    status, robots, _ = fetch(ORIGIN + "/robots.txt")
    if status != 200 or (ORIGIN + "/sitemap.xml").encode() not in robots:
        raise ValueError("robots.txt or sitemap declaration missing")
    rp = urllib.robotparser.RobotFileParser()
    rp.parse(robots.decode().splitlines())
    for bot in ("Googlebot", "Bingbot", "OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"):
        if not rp.can_fetch(bot, ORIGIN + "/"):
            raise ValueError(f"Search crawler blocked: {bot}")
    for bot in ("GPTBot", "ClaudeBot", "Google-Extended"):
        if rp.can_fetch(bot, ORIGIN + "/"):
            raise ValueError(f"Training crawler unexpectedly allowed: {bot}")
    sample = [ORIGIN + "/"] + [ORIGIN + "/" + x + "/" for x in sorted(LOCALES - {"en"})]
    for prefix in ("/apps/", "/blog/", "/release-notes/"):
        sample += sorted(u for u in urls if urllib.parse.urlsplit(u).path.startswith(prefix))[:3]
    for u in set(sample):
        code, body, headers = fetch(u)
        if u not in urls or code != 200 or not digest(u, body, headers.get("X-Robots-Tag", "")):
            raise ValueError("Sample page unavailable or not canonical: " + u)
    key = key_value(False)
    if key:
        verify_key(key)
    print(f"Audit OK: {len(urls)} public sitemap URLs, {len(set(sample))} live canonical samples; IndexNow key {'verified' if key else 'not configured'}")

def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="action", required=True)
    p = sub.add_parser("prepare")
    p.add_argument("--dist", required=True)
    p.add_argument("--out", required=True)
    p = sub.add_parser("notify")
    p.add_argument("--manifest", required=True)
    p.add_argument("--previous")
    p.add_argument("--out", required=True)
    sub.add_parser("audit")
    args = parser.parse_args()
    try:
        if args.action == "prepare":
            prepare(args.dist, args.out)
        elif args.action == "notify":
            notify(args.manifest, args.previous, args.out)
        else:
            audit()
    except (ValueError, OSError, ET.ParseError, KeyError) as exc:
        # Avoid printing network request URLs: they can contain the public ownership key.
        print("Search discovery failed: " + (str(exc) if isinstance(exc, ValueError) else type(exc).__name__), file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
