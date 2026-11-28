import unittest

from search_discovery import ORIGIN
from verify_live_ops import verify


ROBOTS = "noindex,nofollow,noarchive,nosnippet,noimageindex"
SEALED_PAGE = b"<head>" + b"".join(
    f'<meta name="{agent}" content="{ROBOTS}">'.encode()
    for agent in ("robots", "googlebot", "naverbot", "yeti")
) + b"</head><body>sealed fixture</body>"
SITEMAP = b'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://onnellab.com/</loc></url></urlset>'
SITEMAP_INDEX = b'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://onnellab.com/sitemap-0.xml</loc></sitemap></sitemapindex>'


class LiveOps(unittest.TestCase):
    def setUp(self):
        self.responses = {
            "/ops/": (200, SEALED_PAGE),
            "/robots.txt": (200, b"User-agent: *\nDisallow: /ops/\nDisallow: /manual-publish/\n"),
            "/sitemap.xml": (200, SITEMAP),
            "/": (200, b'<a href="/apps/">Apps</a>'),
            "/manual-publish/": (404, b""),
        }

    def fetch(self, url):
        self.assertTrue(url.startswith(ORIGIN + "/"))
        status, body = self.responses[url[len(ORIGIN):]]
        return status, body, {}

    def result(self):
        return verify(SEALED_PAGE, self.fetch)

    def test_healthy_deploy_produces_only_checks_statuses_and_digests(self):
        result = self.result()
        self.assertEqual(result["state"], "verified")
        self.assertEqual(result["expected_sha256"], result["live_sha256"])
        self.assertEqual(len(result["checks"]), 15)
        self.assertNotIn("sealed fixture", repr(result))

    def test_stale_bytes_and_missing_crawler_directives_fail(self):
        self.responses["/ops/"] = (200, SEALED_PAGE.replace(b'name="yeti"', b'name="other"'))
        self.responses["/robots.txt"] = (200, b"# Disallow: /ops/\nDisallow: /manual-publish/\n")
        result = self.result()
        self.assertEqual(result["state"], "failed")
        self.assertFalse(result["checks"]["ops_exact_deployed_bytes"])
        self.assertFalse(result["checks"]["yeti_meta"])
        self.assertFalse(result["checks"]["robots_disallow_ops"])

    def test_linked_child_sitemap_must_be_available_and_exclude_hidden_urls(self):
        self.responses["/sitemap.xml"] = (200, SITEMAP_INDEX)
        for response in ((503, b""), (200, b"<html/>"), (200, SITEMAP.replace(b'.com/</loc>', b'.com/ops/</loc>'))):
            with self.subTest(response=response):
                self.responses["/sitemap-0.xml"] = response
                self.assertEqual(self.result()["state"], "failed")

    def test_navigation_and_legacy_redirect_fail(self):
        self.responses["/"] = (200, b'<a href="/ops/">Ops</a>')
        self.responses["/manual-publish/"] = (301, b"")
        result = self.result()
        self.assertEqual(result["state"], "failed")
        self.assertFalse(result["checks"]["hidden_from_navigation"])
        self.assertFalse(result["checks"]["legacy_route_absent"])


if __name__ == "__main__":
    unittest.main()
