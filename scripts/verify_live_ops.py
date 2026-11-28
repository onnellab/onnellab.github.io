"""Verify the deployed Pages /ops/ surface and write a version 1 evidence record."""

import argparse
from datetime import datetime, timezone
from hashlib import sha256
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from time import sleep
from urllib.parse import urljoin, urlsplit
import xml.etree.ElementTree as ET

from search_discovery import ORIGIN, fetch, sitemap_urls


HIDDEN_PATHS = ("/ops/", "/manual-publish/")
CRAWLERS = ("robots", "googlebot", "naverbot", "yeti")
REQUIRED_DIRECTIVES = {"noindex", "nofollow", "noarchive", "nosnippet", "noimageindex"}


def hidden_route(url):
    path = urlsplit(urljoin(ORIGIN + "/", url)).path.rstrip("/") + "/"
    return path.startswith(HIDDEN_PATHS)


class OpsMarkup(HTMLParser):
    def __init__(self, body):
        super().__init__()
        self.crawlers = {}
        self.hidden_link = False
        self.feed(body.decode("utf-8"))
        self.close()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and (name := (attrs.get("name") or "").lower()) in CRAWLERS:
            directives = (attrs.get("content") or "").lower().split(",")
            self.crawlers.setdefault(name, []).append({item.strip() for item in directives})
        if tag == "a" and hidden_route(attrs.get("href") or ""):
            self.hidden_link = True


def read_live_sitemap(get):
    for path in ("/sitemap.xml", "/sitemap-index.xml", "/sitemap-0.xml"):
        status, body, _ = get(ORIGIN + path)
        if status != 200:
            continue
        try:
            root = ET.fromstring(body)
            if root.tag == "{http://www.sitemaps.org/schemas/sitemap/0.9}sitemapindex":
                locations = root.findall("{*}sitemap/{*}loc")
                if not locations:
                    return status, None
                urls = set()
                for item in locations:
                    child = urljoin(ORIGIN + path, (item.text or "").strip())
                    parsed = urlsplit(child)
                    if not item.text or (parsed.scheme, parsed.netloc) != ("https", urlsplit(ORIGIN).netloc):
                        return status, None
                    child_status, child_body, _ = get(child)
                    if child_status != 200:
                        return status, None
                    urls.update(sitemap_urls(child_body))
                return status, urls
            return status, sitemap_urls(body)
        except (ET.ParseError, ValueError):
            return status, None
    return status, None


def verify(expected, get=fetch):
    ops_status, ops_body, _ = get(ORIGIN + "/ops/")
    expected_hash = sha256(expected).hexdigest()
    live_hash = sha256(ops_body).hexdigest() if ops_status == 200 else ""
    markup = OpsMarkup(ops_body)
    robots_status, robots_body, _ = get(ORIGIN + "/robots.txt")
    disallows = set(re.findall(r"^\s*Disallow:\s*([^\s#]+)", robots_body.decode("utf-8"), re.M | re.I))
    sitemap_status, urls = read_live_sitemap(get)
    hidden_urls = {urlsplit(url).path.rstrip("/") + "/" for url in urls or ()}
    home_status, home_body, _ = get(ORIGIN + "/")
    legacy_status, _, _ = get(ORIGIN + HIDDEN_PATHS[1])

    checks = {
        "ops_http_200": ops_status == 200,
        "ops_exact_deployed_bytes": live_hash == expected_hash,
        **{f"{agent}_meta": markup.crawlers.get(agent) == [REQUIRED_DIRECTIVES] for agent in CRAWLERS},
        "robots_http_200": robots_status == 200,
        "robots_disallow_ops": HIDDEN_PATHS[0] in disallows,
        "robots_disallow_legacy": HIDDEN_PATHS[1] in disallows,
        "sitemap_available": urls is not None,
        "ops_absent_from_sitemap": urls is not None and not any(url.startswith(HIDDEN_PATHS[0]) for url in hidden_urls),
        "legacy_absent_from_sitemap": urls is not None and not any(url.startswith(HIDDEN_PATHS[1]) for url in hidden_urls),
        "homepage_http_200": home_status == 200,
        "hidden_from_navigation": not OpsMarkup(home_body).hidden_link,
        "legacy_route_absent": legacy_status in (404, 410),
    }
    return {
        "state": "verified" if all(checks.values()) else "failed",
        "expected_sha256": expected_hash,
        "live_sha256": live_hash,
        "checks": checks,
        "http": {"ops": ops_status, "robots": robots_status, "sitemap": sitemap_status, "homepage": home_status, "legacy": legacy_status},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--expected", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--deployment-sha", required=True)
    parser.add_argument("--attempts", type=int, default=12)
    parser.add_argument("--interval", type=int, default=10)
    args = parser.parse_args()
    if not re.fullmatch(r"[a-f0-9]{40}", args.deployment_sha):
        parser.error("--deployment-sha must be a full Git commit SHA")
    if args.attempts < 1 or args.interval < 0:
        parser.error("attempts must be >= 1 and interval must be >= 0")

    expected = args.expected.read_bytes()
    for attempt in range(1, args.attempts + 1):
        try:
            result = verify(expected)
        except (OSError, ValueError) as error:
            result = {"state": "failed", "checks": {}, "error": f"live_ops_verification_error:{type(error).__name__}"}
        if result["state"] == "verified":
            break
        if attempt < args.attempts:
            sleep(args.interval)

    receipt = {
        "schema_version": 1,
        "kind": "onnellab_ops_live_verification",
        "checked_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "base_url": ORIGIN,
        "deployment_sha": args.deployment_sha,
        "attempt": attempt,
        **result,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"state": result["state"], "attempt": attempt, "checks": result["checks"]}))
    return 0 if result["state"] == "verified" else 2


if __name__ == "__main__":
    raise SystemExit(main())
