import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const locales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'].map(hreflang => ({ hreflang }));
async function jsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.map(script => JSON.parse(script.textContent ?? 'null')));
}

// Backfilled article routes retain their historical identity in every locale.
for (const locale of locales) {
  test(`Papira manuscript article: ${locale.hreflang} metadata, assets and responsive layout`, async ({ page }) => {
    const segment = locale.hreflang.toLowerCase();
    const articlePath = `/blog/${segment}/prepare-txt-manuscript-for-epub/`;
    const source = fs.readFileSync(path.join(process.cwd(), 'src/content/blog', locale.hreflang, 'prepare-txt-manuscript-for-epub.md'), 'utf8');
    const title = source.match(/^title: "(.*)"$/m)?.[1];
    expect(title).toBeTruthy();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(articlePath);
      expect(response?.status()).toBe(200);
      await expect(page.locator('article h1')).toHaveText(title!);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://onnellab.com${articlePath}`);
      await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', '2026-10-04T11:34:40+09:00');
      for (const alternative of locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${alternative.hreflang}"]`)).toHaveAttribute('href', `https://onnellab.com/blog/${alternative.hreflang.toLowerCase()}/prepare-txt-manuscript-for-epub/`);
      }
      const schemas = (await jsonLd(page)).flatMap(item => Array.isArray(item) ? item : item['@graph'] ?? [item]);
      expect(schemas.find(item => item['@type'] === 'BlogPosting')?.datePublished).toBe('2026-10-04T11:34:40+09:00');
      expect(schemas.find(item => item['@type'] === 'FAQPage')?.mainEntity.length).toBeGreaterThan(0);
      await expect(page.locator('article a[href*="play.google.com/store/apps/details?id=com.onnellab.papira"]').first()).toBeVisible();
      await page.locator('article img[src*="workflow-diagram"]').scrollIntoViewIfNeeded();
      await expect(page.locator('article img[src*="workflow-diagram"]')).toBeVisible();
      await expect.poll(() => page.locator('article img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      if (['ja', 'zh-Hans', 'zh-Hant'].includes(locale.hreflang)) {
        await expect(page.locator('.article-body')).toHaveCSS('word-break', 'normal');
        await expect(page.locator('.article-body td').first()).toHaveCSS('word-break', 'normal');
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `${locale.hreflang} article overflows at ${width}px`).toBe(false);
    }
  });
}
