"""Verify the generated ONDO PAPER feed against its landing pages and PNGs."""

import argparse
import re
import struct
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import urlopen

BASE = "https://onnellab.com/ondo-paper/"
FEED = BASE + "pinterest.xml"
MEDIA = "{http://search.yahoo.com/mrss/}content"
PRODUCT = r'https://akinstun\.gumroad\.com/l/[a-z0-9-]+'


def verify(read):
    root = ET.fromstring(read(FEED))
    channel = root.find("channel")
    assert root.get("version") == "2.0" and channel is not None
    assert channel.findtext("link") == BASE
    assert b"ONDO PAPER" in read(BASE)
    seen = set()
    for item in channel.findall("item"):
        link = item.findtext("link")
        assert link and re.fullmatch(re.escape(BASE) + r"pins/[a-z0-9-]+/", link), link
        assert link == item.findtext("guid") and link not in seen, link
        seen.add(link)
        assert 0 < len(item.findtext("title", "")) <= 100, link
        assert 0 < len(item.findtext("description", "")) <= 500, link
        assert parsedate_to_datetime(item.findtext("pubDate")) <= datetime.now(timezone.utc), link
        asset = item.find(MEDIA)
        image_url = link.rstrip("/") + ".png"
        assert asset is not None and asset.get("url") == image_url, link
        image = read(image_url)
        assert image[:8] == b"\x89PNG\r\n\x1a\n", image_url
        assert struct.unpack(">II", image[16:24]) == (1000, 1500), image_url
        page = read(link).decode()
        assert f'rel="canonical" href="{link}"' in page, link
        assert re.search(r'href="' + PRODUCT + r'"', page), link
        assert f'src="{urlsplit(image_url).path}"' in page, link
    assert seen, "The feed is empty"
    return len(seen)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--live", action="store_true", help="Read the public site instead of dist")
    parser.add_argument("--dist", type=Path, default=Path("dist"))
    args = parser.parse_args()

    def read(url):
        if args.live:
            with urlopen(url, timeout=15) as response:
                assert response.status == 200 and response.url == url, url
                return response.read()
        page = urlsplit(url).path
        file = args.dist / page.lstrip("/")
        return (file / "index.html" if page.endswith("/") else file).read_bytes()

    print(f"Verified {verify(read)} ONDO PAPER RSS items and their destinations.")


if __name__ == "__main__":
    main()
