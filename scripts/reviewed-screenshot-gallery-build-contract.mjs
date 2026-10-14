import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { reviewedSiteFixture, localeRoutes, digest } from './reviewed-artwork-test-fixture.mjs';

const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));

test('real Astro build keeps Android and mixed native iPhone sizes correct on detail, thumbnails and all nine homepages', { timeout: 120000 }, async () => {
  const fixture = await reviewedSiteFixture();
  const { dir, receipts, build } = fixture;
  try {
    const result = build();
    assert.equal(result.status, 0, result.stdout + result.stderr);
    for (const [locale, segment] of Object.entries(localeRoutes)) {
      const home = fs.readFileSync(path.join(dir, 'dist', segment, 'index.html'), 'utf8');
      assert.match(home, /data-home-artwork-contract="1"/);
      assert.ok(home.includes(`data-home-locale="${locale}"`));
      const images = [...home.matchAll(/<img\s[^>]*>/g)].map((match) => attributes(match[0]));
      const reviewed = images.filter((image) => image['data-home-artwork-source'] === 'reviewed');
      assert.equal(reviewed.length, 4, locale);
      for (const [slug, receipt] of receipts) {
        const selected = reviewed.filter((image) => image['data-home-artwork-slug'] === slug);
        assert.deepEqual(selected.map((image) => Number(image['data-home-artwork-index'])).sort(), [1,2]);
        const detail = fs.readFileSync(path.join(dir, 'dist/apps', slug, segment, 'index.html'), 'utf8');
        const detailImages = [...detail.matchAll(/<img\s[^>]*>/g)].map((match) => attributes(match[0]));
        const localizedAssets = receipt.assets.filter((asset) => asset.locale === locale);
        if (slug === 'papira') assert.equal(new Set(localizedAssets.map((asset) => asset.size.join('x'))).size, 2);
        for (const asset of localizedAssets) {
          const source = `/app-assets/${slug}/assets/screenshots/${asset.site_path}?v=${asset.sha256}`;
          const galleryAndThumb = detailImages.filter((image) => image.src === source);
          assert.equal(galleryAndThumb.length, 2, `${slug}/${locale}/${asset.index}: gallery and thumbnail`);
          for (const image of galleryAndThumb) {
            assert.deepEqual([Number(image.width), Number(image.height)], asset.size);
          }
        }

        for (const image of selected) {
          const asset = receipt.assets.find((item) => item.locale === locale && String(item.index) === image['data-home-artwork-index']);
          const route = `/app-assets/${slug}/assets/screenshots/${asset.site_path}`;
          assert.equal(image['data-home-artwork-locale'], locale);
          assert.equal(image.src, `${route}?v=${asset.sha256}`);
          assert.deepEqual([Number(image.width), Number(image.height)], asset.size);
          assert.equal(digest(fs.readFileSync(path.join(dir, 'dist', route))), asset.sha256);
          assert.ok(detail.includes(image.src), `${slug}/${locale} must share the homepage source`);
        }
      }
      assert.equal(images.filter((image) => image['data-home-artwork-source'] === 'legacy').length, 3);
    }
    // A receipt remaining after accidental file replacement stops publication.
    fs.appendFileSync(path.join(dir, 'src/content/apps/tagweaver/assets/screenshots/en/1.png'), 'changed');
    const invalid = build();
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stdout + invalid.stderr, /image bytes or dimensions differ/);
  } finally { fixture.cleanup(); }
});
