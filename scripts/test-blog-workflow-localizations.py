import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("render-blog-workflow-localizations.py")
spec = importlib.util.spec_from_file_location("workflow_renderer", SCRIPT)
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)

class LocalizationBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.manifest = json.loads((renderer.ROOT / renderer.MANIFEST).read_text())
        paths = [renderer.MANIFEST, "public/brand/mark-charcoal.svg"]
        for item in self.manifest["items"]:
            paths.extend(item[key] for key in ("article","workflow_svg","social_svg"))
        for name in paths:
            target = self.root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes((renderer.ROOT / name).read_bytes())

    def tearDown(self):
        self.temp.cleanup()

    def save(self):
        (self.root / renderer.MANIFEST).write_text(json.dumps(self.manifest, ensure_ascii=False))

    def test_exact_63_and_original_identity(self):
        self.assertEqual(len(renderer.validate(self.root)["items"]), 63)
        for item in self.manifest["items"]:
            for locale in ("en", "ko"):
                original = renderer.ROOT / "src/content/blog" / locale / (item["slug"] + ".md")
                source = original.read_text()
                self.assertIn(item["published_at"], source)
        self.assertNotIn("en", renderer.LOCALES)
        self.assertNotIn("ko", renderer.LOCALES)

    def test_missing_rejected(self):
        self.manifest["items"].pop()
        self.save()
        with self.assertRaisesRegex(ValueError, "63"):
            renderer.validate(self.root)

    def test_duplicate_rejected(self):
        self.manifest["items"][-1] = copy.deepcopy(self.manifest["items"][0])
        self.save()
        with self.assertRaisesRegex(ValueError, "63"):
            renderer.validate(self.root)

    def test_unexpected_path_rejected(self):
        self.manifest["items"][0]["social_png"] = "public/brand/mark-charcoal.svg"
        self.save()
        with self.assertRaisesRegex(ValueError, "Unexpected"):
            renderer.validate(self.root)

    def test_oversized_svg_rejected(self):
        (self.root / self.manifest["items"][0]["workflow_svg"]).write_bytes(b"x" * (renderer.MAX_SVG_BYTES + 1))
        with self.assertRaisesRegex(ValueError, "Oversized"):
            renderer.validate(self.root)

    def test_oversized_manifest_rejected(self):
        (self.root / renderer.MANIFEST).write_bytes(b" " * (renderer.MAX_MANIFEST_BYTES + 1))
        with self.assertRaisesRegex(ValueError, "Oversized"):
            renderer.validate(self.root)

    def test_modified_svg_rejected(self):
        target = self.root / self.manifest["items"][0]["workflow_svg"]
        target.write_text(target.read_text() + " ")
        with self.assertRaisesRegex(ValueError, "checksum"):
            renderer.validate(self.root)

    def test_english_asset_fallback_rejected(self):
        item = self.manifest["items"][0]
        target = self.root / item["article"]
        target.write_text(target.read_text().replace(f'/blog-assets/{item["locale"]}/', '/blog-assets/en/'))
        with self.assertRaisesRegex(ValueError, "localized"):
            renderer.validate(self.root)

    def test_date_change_rejected(self):
        item = self.manifest["items"][0]
        target = self.root / item["article"]
        target.write_text(target.read_text().replace(item["published_at"], "2099-01-01"))
        with self.assertRaisesRegex(ValueError, "identity"):
            renderer.validate(self.root)

    def test_different_social_svg_rejected(self):
        item = self.manifest["items"][0]
        target = self.root / item["social_svg"]
        target.write_text(target.read_text() + " ")
        item["social_svg_blob"] = renderer.git_blob(target.read_bytes())
        self.save()
        with self.assertRaisesRegex(ValueError, "byte-identical"):
            renderer.validate(self.root)

    def test_active_svg_rejected(self):
        item = self.manifest["items"][0]
        target = self.root / item["workflow_svg"]
        target.write_text(target.read_text().replace("</svg>", "<script>alert(1)</script></svg>", 1))
        item["workflow_svg_blob"] = renderer.git_blob(target.read_bytes())
        self.save()
        with self.assertRaisesRegex(ValueError, "unknown SVG"):
            renderer.validate(self.root)

if __name__ == "__main__":
    unittest.main()
