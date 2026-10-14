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
  test(`reviewed Android and iPhone artwork remains complete at ${width}px in every locale`, async ({ page }, testInfo) => {
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
      const reviewed = page.locator('img[data-home-artwork-source="reviewed"]');
      await expect(reviewed).toHaveCount(4);
      await expect(page.locator('img[data-home-artwork-source="legacy"]')).toHaveCount(3);
      for (const image of await reviewed.all()) {
        await image.scrollIntoViewIfNeeded();
        const geometry = await image.evaluate(async (node) => {
          const img = node as HTMLImageElement;
          await img.decode();
          const rect = img.getBoundingClientRect();
          const parentNode = img.parentElement!;
          const parent = parentNode.getBoundingClientRect();
          const parentStyle = getComputedStyle(parentNode);
          return { locale:img.dataset.homeArtworkLocale, index:img.dataset.homeArtworkIndex,
            radii:[parentStyle.borderTopLeftRadius,parentStyle.borderTopRightRadius,parentStyle.borderBottomLeftRadius,parentStyle.borderBottomRightRadius],
            fit:getComputedStyle(img).objectFit, native:[img.naturalWidth,img.naturalHeight],
            declared:[Number(img.getAttribute('width')),Number(img.getAttribute('height'))],
            image:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom},
            frame:{left:parent.left,right:parent.right,top:parent.top,bottom:parent.bottom} };
        });
        expect(geometry.locale).toBe(locale);
        expect(['1','2']).toContain(geometry.index);
        expect(geometry.fit).toBe('contain');
        expect(geometry.radii).toEqual(['0px','0px','0px','0px']);
        expect(geometry.native).toEqual(geometry.declared);
        expect(geometry.image.left).toBeGreaterThanOrEqual(geometry.frame.left - 1);
        expect(geometry.image.right).toBeLessThanOrEqual(geometry.frame.right + 1);
        expect(geometry.image.top).toBeGreaterThanOrEqual(geometry.frame.top - 1);
        expect(geometry.image.bottom).toBeLessThanOrEqual(geometry.frame.bottom + 1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      if (locale === 'ko') {
        const screenshotPath = testInfo.outputPath(`reviewed-${width}-ko.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await testInfo.attach(`Reviewed Android and iPhone ${width}px`, { path: screenshotPath, contentType: 'image/png' });
      }
      // Rotation keeps the exact reviewed source attached to its product.
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
