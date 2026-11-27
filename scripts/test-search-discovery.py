import importlib.util
import json
import pathlib
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("discovery", pathlib.Path(__file__).with_name("search_discovery.py"))
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)
HOME = d.ORIGIN + "/"
APP = d.ORIGIN + "/apps/test/"
OTHER = d.ORIGIN + "/blog/en/test/"
def html(url, text="hello"):
    return f'<html><head><link rel="canonical" href="{url}"><title>Title</title></head><body><main>{text}</main></body></html>'.encode()

def sitemap(urls):
    return ('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<url><loc>{u}</loc></url>' for u in urls) + '</urlset>').encode()

class Discovery(unittest.TestCase):
    def test_scope(self):
        for u in (HOME, APP, OTHER, d.ORIGIN + "/release-notes/a/1.2.3/", d.ORIGIN + "/ondo-paper/"):
            self.assertTrue(d.eligible(u))
        for u in ("https://other.example/", "https://onnellab.com.evil/", d.ORIGIN + "/ops/", d.ORIGIN + "/oauth/x/callback/", HOME + "?token=secret", d.ORIGIN + "/apps/../ops/"):
            self.assertFalse(d.eligible(u))
        for path in ("/ondo-paper/pinterest.xml", "/ondo-paper/pins/cozy-undated-planner/", "/ondo-paper/?preview=1"):
            self.assertFalse(d.eligible(d.ORIGIN + path))
    def test_digest(self):
        self.assertIsNone(d.digest(APP, html(HOME)))
        self.assertIsNone(d.digest(APP, html(APP).replace(b"<head>", b'<head><meta name="robots" content="noindex">')))
        self.assertIsNone(d.digest(APP, html(APP), "noindex"))
        self.assertEqual(d.digest(APP, html(APP)), d.digest(APP, html(APP).replace(b"</body>", b"<script>changed</script></body>")))
        self.assertNotEqual(d.digest(APP, html(APP)), d.digest(APP, html(APP, "different")))
    def test_prepare(self):
        with tempfile.TemporaryDirectory() as directory:
            p = pathlib.Path(directory)
            (p / "sitemap.xml").write_bytes(sitemap([HOME, APP]))
            (p / "index.html").write_bytes(html(HOME))
            (p / "apps/test").mkdir(parents=True)
            (p / "apps/test/index.html").write_bytes(html(HOME))
            with patch.dict("os.environ", {"INDEXNOW_KEY": "a" * 32}):
                d.prepare(p, p / "manifest.json")
            result = d.read_json(p / "manifest.json")
            self.assertEqual(set(result["pages"]), {HOME})
            self.assertEqual(result["excluded"], [APP])
            self.assertEqual((p / ("a" * 32 + ".txt")).read_text(), "a" * 32)
    def test_only_changes_and_accepted_state(self):
        with tempfile.TemporaryDirectory() as directory:
            p = pathlib.Path(directory)
            before = {HOME: d.digest(HOME, html(HOME)), OTHER: d.digest(OTHER, html(OTHER))}
            after = {HOME: before[HOME], APP: d.digest(APP, html(APP))}
            d.write_json(p/"prev.json", {"version":1, "accepted":before})
            d.write_json(p/"manifest.json", {"version":1,"sitemap":list(after),"pages":after})
            posts = []
            def fetch(url, data=None):
                if url == d.ENDPOINT:
                    posts.extend(json.loads(data)["urlList"]); return 200,b"",{}
                if url.endswith(".txt") and url != d.ORIGIN+"/robots.txt": return 200,b"a"*32,{}
                if url.endswith("robots.txt"): return 200,b"User-agent: *\nAllow: /",{}
                if url.endswith("sitemap.xml"): return 200,sitemap(after),{}
                if url == OTHER: return 410,b"",{}
                return 200,html(url),{}
            with patch.object(d,"fetch",side_effect=fetch), patch.dict("os.environ", {"INDEXNOW_KEY":"a"*32}):
                d.notify(p/"manifest.json",p/"prev.json",p/"state.json")
            self.assertCountEqual(posts,[APP,OTHER])
            self.assertEqual(d.read_json(p/"state.json")["accepted"],after)
            posts.clear()
            with patch.object(d,"fetch",side_effect=fetch), patch.dict("os.environ", {"INDEXNOW_KEY":"a"*32}):
                d.notify(p/"manifest.json",p/"state.json",p/"next.json")
            self.assertEqual(posts,[])
    def test_failed_notification_preserves_prior_state(self):
        with tempfile.TemporaryDirectory() as directory:
            p=pathlib.Path(directory)
            after={HOME:d.digest(HOME,html(HOME))}
            d.write_json(p/"manifest",{"version":1,"sitemap":[HOME],"pages":after})
            def fetch(url,data=None):
                if url==d.ENDPOINT: return 429,b"",{}
                if url.endswith("robots.txt"): return 200,b"User-agent: *\nAllow: /",{}
                if url.endswith("sitemap.xml"): return 200,sitemap(after),{}
                if url.endswith(".txt"): return 200,b"a"*32,{}
                return 200,html(url),{}
            with patch.object(d,"fetch",side_effect=fetch),patch.dict("os.environ",{"INDEXNOW_KEY":"a"*32}):
                with self.assertRaises(ValueError): d.notify(p/"manifest",None,p/"state")
            self.assertEqual(d.read_json(p/"state")["accepted"],{})
            self.assertEqual(d.read_json(p/"state")["pending"],[HOME])

if __name__=="__main__":
    unittest.main()
