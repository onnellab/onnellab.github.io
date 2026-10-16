import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { reviewedSiteFixture, localeRoutes } from '../scripts/reviewed-artwork-test-fixture.mjs';

let fixture: Awaited<ReturnType<typeof reviewedSiteFixture>>;
test.beforeAll(async () => {
  fixture = await reviewedSiteFixture();
  const result = fixture.build();
  expect(result.status, result.stdout + result.stderr).toBe(0);
});
test.afterAll(() => fixture?.cleanup());

for (const width of [1440, 390]) {
  test(`home originals stay rounded and cropped while detail artwork stays complete at ${width}px in every locale`, async ({ page }, testInfo) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    // In-memory request fulfillment keeps synthetic evidence private and avoids
    // starting another server or publishing the fixture anywhere.
    await page.route('http://reviewed-artwork.test/**', async (route) => {
      const url = new URL(route.request().url());
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const file = path.resolve(fixture.dir, 'dist', relative.endsWith('/') || !relative ? relative + 'index.html' : relative);
      if (!file.startsWith(path.join(fixture.dir, 'dist') + path.sep) || !fs.existsSync(file)) {
        await route.fulfill({status:404}); return;
      }
      const contentTypes: Record<string,string> = {'.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml'};
      await route.fulfill({status:200, body:fs.readFileSync(file), contentType:contentTypes[path.extname(file)] ?? 'application/octet-stream'});
    });
    for (const [locale, segment] of Object.entries(localeRoutes)) {
      await page.goto(`http://reviewed-artwork.test/${segment ? segment + '/' : ''}`);
      await expect(page.locator('img[data-home-artwork-source="reviewed"]')).toHaveCount(0);
      await expect(page.locator('img[data-home-artwork-source="legacy"]')).toHaveCount(7);
      for (const image of await page.locator('.product-screen img').all()) {
        await image.scrollIntoViewIfNeeded();
        const geometry = await image.evaluate(async (node) => {
          const img = node as HTMLImageElement;
          await img.decode();
          const frame = img.parentElement!;
          const style = getComputedStyle(frame);
          return { locale: img.dataset.homeArtworkLocale,
            radius: parseFloat(style.borderTopLeftRadius), border: parseFloat(style.borderTopWidth),
            overflow: style.overflow, imageHeight: img.getBoundingClientRect().height,
            frameHeight: frame.getBoundingClientRect().height,
            declared: [Number(img.getAttribute('width')), Number(img.getAttribute('height'))],
            native: [img.naturalWidth, img.naturalHeight] };
        });
        expect(geometry.locale).toBe(locale);
        expect(geometry.radius).toBeGreaterThan(0);
        expect(geometry.border).toBe(2);
        expect(geometry.overflow).toBe('hidden');
        // Desktop tiles crop the lower UI; compact mobile rows retain their existing geometry.
        if (width === 1440) expect(geometry.imageHeight).toBeGreaterThan(geometry.frameHeight * 1.25);
        expect(geometry.native).toEqual(geometry.declared);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      if (locale === 'ko') {
        const screenshotPath = testInfo.outputPath(`reviewed-${width}-ko.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await testInfo.attach(`Reviewed Android and iPhone ${width}px`, { path: screenshotPath, contentType: 'image/png' });
      }
      // Rotation keeps each original screenshot attached to its product.
      const sources = await page.locator('[data-hero-slide] img').evaluateAll((nodes) => Object.fromEntries(nodes.map((node) => [node.getAttribute('data-home-artwork-slug'), node.getAttribute('src')])));
      await page.locator('[data-hero-dot][data-index="2"]').click();
      await expect(page.locator('[data-hero-slide][data-position="active"]')).toHaveAttribute('data-hero-product', 'papira');
      expect(await page.locator('[data-hero-slide] img').evaluateAll((nodes) => Object.fromEntries(nodes.map((node) => [node.getAttribute('data-home-artwork-slug'), node.getAttribute('src')])))).toEqual(sources);
      await page.goto(`http://reviewed-artwork.test/apps/papira/${segment ? segment + '/' : ''}`);
      const nativeAssets = fixture.receipts.get('papira').assets.filter((asset) => asset.locale === locale);
      expect(new Set(nativeAssets.map((asset) => asset.size.join('x'))).size).toBe(2);
      for (const asset of nativeAssets) {
        const source = `/app-assets/papira/assets/screenshots/${asset.site_path}?v=${asset.sha256}`;
        const dimensions = await page.locator('.screenshot-row img, .viewer-thumb img').evaluateAll((images, src) =>
          images.filter((image) => image.getAttribute('src') === src)
            .map((image) => [Number(image.getAttribute('width')), Number(image.getAttribute('height'))]), source);
        expect(dimensions).toEqual([asset.size, asset.size]);
      }

    }
  });
}
