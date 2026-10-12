import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync('docs/blog-workflow-localizations.json', 'utf8'));
const locales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'];
const evidence = 'blog-localization-evidence/screenshots';

for (const item of manifest.items) {
  test(`${item.locale}/${item.slug}: localized diagram and historical page identity`, async ({ page }) => {
    const articlePath = `/blog/${item.locale.toLowerCase()}/${item.slug}/`;
    const imagePath = item.workflow_svg.replace(/^public/, '');
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(articlePath);
      expect(response?.status()).toBe(200);
      await expect(page.locator('article h1')).toHaveText(item.title);
      await expect(page.locator('html')).toHaveAttribute('lang', item.locale);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', item.canonical_url);
      await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', item.published_at);
      for (const locale of locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveAttribute('href', `https://onnellab.com/blog/${locale.toLowerCase()}/${item.slug}/`);
      }
      const articleImage = page.locator('article img[src*="workflow-diagram"]');
      await expect(articleImage).toHaveAttribute('src', imagePath);
      await expect(articleImage).toHaveAttribute('alt', item.alt);
      await articleImage.scrollIntoViewIfNeeded();
      await expect(articleImage).toBeVisible();
      await expect.poll(() => articleImage.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `https://onnellab.com${item.social_png.replace(/^public/, '')}`);
      if (item.slug === 'reuse-copied-text-snippets-iphone') {
        fs.mkdirSync(evidence, { recursive: true });
        await page.screenshot({ path: path.join(evidence, `${item.locale}-article-${width}.png`) });
      }
    }
    const pngResponse = await page.request.get(item.social_png.replace(/^public/, ''));
    expect(pngResponse.status()).toBe(200);
    const png = await pngResponse.body();
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(675);

    await page.setViewportSize({ width: 1200, height: 675 });
    const svgResponse = await page.goto(imagePath);
    expect(svgResponse?.status()).toBe(200);
    await expect(page.locator('svg').first()).toHaveAttribute('xml:lang', item.locale);
    await expect(page.locator('svg > title').first()).toHaveText(item.title);
    await expect(page.locator('svg > desc').first()).toHaveText(item.steps.join(' → '));
    const bounds = await page.locator('text').evaluateAll(texts => texts.map(text => {
      const svgText = text as SVGGraphicsElement;
      const box = svgText.getBBox();
      const group = text.parentElement;
      const maxWidth = group?.tagName.toLowerCase() === 'g' ? 172 : 1146;
      const maxHeight = group?.tagName.toLowerCase() === 'g' ? 150 : 627;
      return { text: text.textContent, x: box.x, y: box.y, width: box.width, height: box.height,
        overflow: box.x < 0 || box.y < 0 || box.x + box.width > maxWidth || box.y + box.height > maxHeight };
    }));
    fs.mkdirSync(evidence, { recursive: true });
    fs.writeFileSync(path.join(evidence, `${item.locale}-${item.slug}-bounds.json`), JSON.stringify(bounds, null, 2) + '\n');
    console.log(`SVG_BOUNDS ${item.locale}/${item.slug}: ${bounds.length} text blocks; ${bounds.filter(b => b.overflow).length} overflow`);
    expect(bounds.filter(b => b.overflow)).toEqual([]);
    const visibleSteps = await page.locator('g > text[font-size="14"]').allTextContents();
    expect(visibleSteps).toEqual(item.steps);
    await page.screenshot({ path: path.join(evidence, `${item.locale}-${item.slug}.png`) });
  });
}
