"""Render only the audited 63 missing historical blog social cards.

This runs inside the existing homepage build. It cannot publish, write Git,
change article content, choose arbitrary paths, or fetch external resources.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
import tempfile
from pathlib import Path
import re
import struct
import subprocess
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = "docs/blog-workflow-localizations.json"
LOCALES = ("ja", "zh-Hans", "zh-Hant", "pt-BR", "de", "fr", "es")
SLUGS = (
    "clean-up-mp3-metadata-before-organizing-music",
    "convert-local-media-files-privately",
    "large-text-file-slow-to-open",
    "read-large-txt-files-without-lag",
    "rename-files-safely-preview-workflow",
    "reuse-copied-text-snippets-iphone",
    "trim-audio-recordings-without-full-editor",
    "txt-vs-epub-for-long-reading",
    "verify-audio-clips-before-combining",
)
SVG_NS = "{http://www.w3.org/2000/svg}"
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"
MAX_MANIFEST_BYTES = 250_000
MAX_SVG_BYTES = 30_000

def git_blob(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()

def safe_path(root, relative):
    path = root / relative
    if path.is_symlink() or any(parent.is_symlink() for parent in path.parents if parent != root):
        raise ValueError("Symlink path is forbidden")
    if not path.resolve().is_relative_to(root.resolve()):
        raise ValueError("Path escapes homepage")
    return path

def validate(root=ROOT):
    raw = safe_path(root, MANIFEST).read_bytes()
    if len(raw) > MAX_MANIFEST_BYTES:
        raise ValueError("Oversized manifest")
    manifest = json.loads(raw)
    if manifest.get("schema_version") != 1:
        raise ValueError("Unknown schema")
    if manifest.get("locales") != list(LOCALES) or manifest.get("slugs") != list(SLUGS):
        raise ValueError("Unexpected locale or article set")
    items = manifest.get("items", [])
    identities = [(item.get("locale"), item.get("slug")) for item in items]
    expected = {(locale, slug) for locale in LOCALES for slug in SLUGS}
    if len(items) != 63 or len(set(identities)) != 63 or set(identities) != expected:
        raise ValueError("Exactly 63 unique historical translation identities required")
    approved_mark = re.search(r'<path\b[^>]*\sd="([^"]+)"', (root / "public/brand/mark-charcoal.svg").read_text()).group(1)
    for item in items:
        locale, slug = item["locale"], item["slug"]
        base = f"public/blog-assets/{locale}/{slug}"
        expected_paths = {
            "article": f"src/content/blog/{locale}/{slug}.md",
            "workflow_svg": f"{base}/workflow-diagram.svg",
            "social_svg": f"{base}/social-card.svg",
            "social_png": f"{base}/social-card.png",
        }
        if any(item.get(key) != value for key, value in expected_paths.items()):
            raise ValueError("Unexpected asset or article path")
        article = safe_path(root, item["article"]).read_text()
        image = f"/blog-assets/{locale}/{slug}/workflow-diagram.svg"
        if re.findall(r'!\[[^\]]*\]\(([^\s)]+)', article) != [image]:
            raise ValueError("Article must use its exact localized workflow")
        for key in ("published_at", "canonical_url"):
            found = re.search(rf'^{key}:\s*["\']?([^"\'\n]+)', article, re.M)
            if not found or found.group(1).strip() != item[key]:
                raise ValueError("Published identity changed")
        for key in ("workflow_svg", "social_svg"):
            data = safe_path(root, item[key]).read_bytes()
            if len(data) > MAX_SVG_BYTES:
                raise ValueError("Oversized SVG")
            if git_blob(data) != item[key + "_blob"]:
                raise ValueError("SVG checksum mismatch")
            source = data.decode("utf-8")
            if "<!DOCTYPE" in source.upper() or "<!ENTITY" in source.upper():
                raise ValueError("SVG declaration forbidden")
            svg = ET.fromstring(source)
            if svg.tag != SVG_NS + "svg" or svg.attrib.get("viewBox") != "0 0 1200 675" or svg.attrib.get(XML_LANG) != locale:
                raise ValueError("Wrong SVG dimensions or locale")
            if svg.attrib.get("width") != "1200" or svg.attrib.get("height") != "675":
                raise ValueError("Wrong SVG output size")
            if svg.findtext(SVG_NS + "title") != item["title"]:
                raise ValueError("SVG title mismatch")
            if svg.findtext(SVG_NS + "desc") != " → ".join(item["steps"]):
                raise ValueError("SVG description mismatch")
            if not any(el.tag == SVG_NS + "path" and el.attrib.get("d") == approved_mark for el in svg.iter()):
                raise ValueError("Approved brand mark missing")
            allowed = {SVG_NS + tag for tag in ("svg","title","desc","rect","text","tspan","g","path")}
            for el in svg.iter():
                if el.tag not in allowed:
                    raise ValueError("Active or unknown SVG element")
                for key2, value in el.attrib.items():
                    if key2.lower().startswith("on") or "href" in key2.lower() or "url(" in value.lower() or key2 == "style":
                        raise ValueError("Active or external SVG attribute")
        if (root / item["workflow_svg"]).read_bytes() != (root / item["social_svg"]).read_bytes():
            raise ValueError("Workflow and social SVG must be byte-identical")
        safe_path(root, item["social_png"])
    return manifest

def render(root=ROOT, evidence=None):
    manifest = validate(root)
    records = []
    for item in manifest["items"]:
        svg = safe_path(root, item["workflow_svg"])
        png = safe_path(root, item["social_png"])
        # Own a unique temporary file; never overwrite or delete a pre-existing path.
        fd, temporary_name = tempfile.mkstemp(prefix=".blog-social-", suffix=".png", dir=png.parent)
        os.close(fd)
        temporary = Path(temporary_name)
        try:
            subprocess.run(["rsvg-convert", "-w", "1200", "-h", "675", str(svg), "-o", str(temporary)], check=True, timeout=30)
            data = temporary.read_bytes()
            if data[:8] != b"\x89PNG\r\n\x1a\n" or struct.unpack(">II", data[16:24]) != (1200, 675):
                raise ValueError("Renderer did not produce a 1200x675 PNG")
            temporary.replace(png)
        finally:
            temporary.unlink(missing_ok=True)
        records.append({"locale":item["locale"], "slug":item["slug"], "svg_sha256":hashlib.sha256(svg.read_bytes()).hexdigest(), "png_sha256":hashlib.sha256(png.read_bytes()).hexdigest()})
    result = {"count": len(records), "renderer": "rsvg-convert", "png_source": "workflow_svg; byte-identical to social_svg", "size":[1200,675], "manifest_sha256":hashlib.sha256((root/MANIFEST).read_bytes()).hexdigest(), "items":records}
    if evidence:
        evidence.parent.mkdir(parents=True, exist_ok=True)
        evidence.write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n")
    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--evidence", type=Path)
    args = parser.parse_args()
    if args.validate_only:
        print(f'Validated {len(validate()["items"])} exact localized workflow assets')
    else:
        result = render(evidence=args.evidence)
        print(f'Rendered {result["count"]} localized social cards')
