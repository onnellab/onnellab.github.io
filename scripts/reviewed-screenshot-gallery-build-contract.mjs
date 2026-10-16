import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { homepageScreenshot } from '../src/lib/reviewed-screenshot-gallery.mjs';
import { reviewedSiteFixture, localeRoutes, digest } from './reviewed-artwork-test-fixture.mjs';

const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));

test('real Astro build separates homepage originals from native-sized reviewed detail and thumbnails in all nine locales', { timeout: 120000 }, async () => {
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
      assert.equal(reviewed.length, 0, locale);
      for (const [slug, receipt] of receipts) {
        const selected = images.filter((image) => image['data-home-artwork-slug'] === slug);
        assert.equal(selected.length, 2);
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

        for (const [index, image] of selected.entries()) {
          const expected = homepageScreenshot(slug, locale, undefined, index === 0 ? 'hero' : 'supporting', dir);
          assert.equal(image['data-home-artwork-locale'], locale);
          assert.equal(image['data-home-artwork-source'], 'legacy');
          assert.equal(image.src, expected.src);
          assert.deepEqual([Number(image.width), Number(image.height)], [expected.width, expected.height]);
          assert.equal(digest(fs.readFileSync(path.join(dir, 'dist', expected.src.split('?')[0]))), expected.sha256);
          assert.ok(!detail.includes(image.src), `${slug}/${locale} detail keeps its edited source`);
        }
      }
      assert.equal(images.filter((image) => image['data-home-artwork-source'] === 'legacy').length, 7);
    }
    // A receipt remaining after accidental file replacement stops publication.
    fs.appendFileSync(path.join(dir, 'src/content/apps/tagweaver/assets/screenshots/en/1.png'), 'changed');
    const invalid = build();
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stdout + invalid.stderr, /image bytes or dimensions differ/);
  } finally { fixture.cleanup(); }
});
