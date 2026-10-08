import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const locales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'].map(hreflang => ({ hreflang }));
async function jsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.map(script => JSON.parse(script.textContent ?? 'null')));
}

const approvedSvg = fs.readFileSync(path.join(process.cwd(), 'public/brand/mark-charcoal.svg'), 'utf8');
const approvedMark = approvedSvg.match(/<path\b[^>]*\sd="([^"]+)"/)?.[1];

// Backfilled article routes retain their historical identity in every locale.
for (const article of [
  { slug: 'prepare-txt-manuscript-for-epub', published: '2026-10-04T11:34:40+09:00', papira: true },
  { slug: 'keep-durable-research-reading-log', published: '2026-08-26T09:00:00+09:00', papira: false },
]) for (const locale of locales) {
  test(`${article.slug}: ${locale.hreflang} metadata, assets and responsive layout`, async ({ page }) => {
    const segment = locale.hreflang.toLowerCase();
    const articlePath = `/blog/${segment}/${article.slug}/`;
    const source = fs.readFileSync(path.join(process.cwd(), 'src/content/blog', locale.hreflang, `${article.slug}.md`), 'utf8');
    const title = source.match(/^title: "(.*)"$/m)?.[1];
    expect(title).toBeTruthy();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(articlePath);
      expect(response?.status()).toBe(200);
      await expect(page.locator('article h1')).toHaveText(title!);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://onnellab.com${articlePath}`);
      await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', article.published);
      for (const alternative of locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${alternative.hreflang}"]`)).toHaveAttribute('href', `https://onnellab.com/blog/${alternative.hreflang.toLowerCase()}/${article.slug}/`);
      }
      const schemas = (await jsonLd(page)).flatMap(item => Array.isArray(item) ? item : item['@graph'] ?? [item]);
      expect(schemas.find(item => item['@type'] === 'BlogPosting')?.datePublished).toBe(article.published);
      expect(schemas.find(item => item['@type'] === 'FAQPage')?.mainEntity.length).toBeGreaterThan(0);
      if (article.papira) await expect(page.locator('article a[href*="play.google.com/store/apps/details?id=com.onnellab.papira"]').first()).toBeVisible();
      await page.locator('article img[src*="workflow-diagram"]').scrollIntoViewIfNeeded();
      await expect(page.locator('article img[src*="workflow-diagram"]')).toBeVisible();
      await expect.poll(() => page.locator('article img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      const workflowResponse = await page.request.get(`/blog-assets/${locale.hreflang}/${article.slug}/workflow-diagram.svg`);
      expect(workflowResponse.status()).toBe(200);
      const workflowSvg = await workflowResponse.text();
      expect(approvedMark).toBeTruthy();
      expect(workflowSvg).toContain('ONNELLAB approved monogram');
      expect(workflowSvg).toContain(`d="${approvedMark}"`);
      const socialResponse = await page.request.get(`/blog-assets/${locale.hreflang}/${article.slug}/social-card.png`);
      expect(socialResponse.status()).toBe(200);
      const socialBytes = await socialResponse.body();
      expect(socialBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe(true);
      expect(socialBytes.readUInt32BE(16)).toBe(1200);
      expect(socialBytes.readUInt32BE(20)).toBe(675);
      if (['ja', 'zh-Hans', 'zh-Hant'].includes(locale.hreflang)) {
        await expect(page.locator('.article-body')).toHaveCSS('word-break', 'normal');
        await expect(page.locator('.article-body td').first()).toHaveCSS('word-break', 'normal');
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `${locale.hreflang} article overflows at ${width}px`).toBe(false);
    }
  });
}
