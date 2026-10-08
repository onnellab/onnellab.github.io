import { expect, test } from '@playwright/test';

const locales = [
  { locale: 'en', segment: 'en', index: '/blog/' },
  { locale: 'ko', segment: 'ko', index: '/blog/ko/' },
  { locale: 'ja', segment: 'ja', index: '/blog/ja/' },
  { locale: 'zh-Hans', segment: 'zh-hans', index: '/blog/zh-hans/' },
  { locale: 'zh-Hant', segment: 'zh-hant', index: '/blog/zh-hant/' },
  { locale: 'pt-BR', segment: 'pt-br', index: '/blog/pt-br/' },
  { locale: 'de', segment: 'de', index: '/blog/de/' },
  { locale: 'fr', segment: 'fr', index: '/blog/fr/' },
  { locale: 'es', segment: 'es', index: '/blog/es/' }
] as const;

const slug = 'rename-files-safely-preview-workflow';

for (const { locale, segment, index } of locales) {
  test(`${locale} uses the complete shared blog index and article templates`, async ({ page }) => {
    await page.goto(index);
    await expect(page.locator('.blog-shell h1')).toBeVisible();
    await expect(page.locator('.category-preview article')).toHaveCount(4);
    await expect(page.locator('.post-list .post-card').first()).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', `https://onnellab.com${index}`
    );
    await expect(page.locator('.blog-locale-menu a[data-locale-choice]')).toHaveCount(9);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

    const availableCategory = page.locator('.filter-row [data-blog-filter]:not([data-blog-filter="all"])').first();
    await availableCategory.click();
    await expect(availableCategory).toHaveAttribute('aria-pressed', 'true');
    const expectedCategory = await availableCategory.getAttribute('data-blog-filter');
    await expect(page.locator('.post-card:not([hidden])').first()).toHaveAttribute(
      'data-post-category', expectedCategory!
    );

    await page.goto(`/blog/${segment}/${slug}/`);
    await expect(page.locator('.article-shell .article-header h1')).toBeVisible();
    await expect(page.locator('.summary-box')).toBeVisible();
    const summary = (await page.locator('.summary-box span').innerText()).trim();
    const description = (await page.locator('.article-header .description').innerText()).trim();
    expect(summary.length).toBeGreaterThan(0);
    expect(summary).not.toBe(description);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    await expect(page.locator('.toc-box')).toBeVisible();
    await expect(page.locator('.faq-section')).toBeVisible();
    await expect(page.locator('.article-body strong').first()).toBeVisible();
    await expect(page.locator('.blog-locale-menu a[data-locale-choice]')).toHaveCount(9);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', `https://onnellab.com/blog/${segment}/${slug}/`
    );
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
    const bodyText = await page.locator('.article-body').evaluate((element) => {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('pre, code').forEach((node) => node.remove());
      return clone.textContent ?? '';
    });
    expect(bodyText).not.toContain('**');
    const faqSchema = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(faqSchema.some((text) => {
      const value = JSON.parse(text);
      return (Array.isArray(value) ? value : [value]).some((entry) => entry['@type'] === 'FAQPage');
    })).toBe(true);

    const visibleUrl = await page.locator('.next-reading').allTextContents();
    for (const text of visibleUrl) expect(text).not.toMatch(/https?:\/\/|=>/);
  });
}

test('language chooser falls back to a valid blog index when an article lacks a translation', async ({ page }) => {
  await page.goto('/blog/en/number-tracks-multi-disc-mp3-album/');
  await expect(page.locator('.blog-locale-menu a[data-locale-choice="ja"]')).toHaveAttribute('href', '/blog/ja/');
  await expect(page.locator('.blog-locale-menu a[data-locale-choice="ko"]')).toHaveAttribute(
    'href', '/blog/ko/number-tracks-multi-disc-mp3-album/'
  );
  const alternateUrls = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((nodes) =>
    nodes.map((node) => (node as HTMLLinkElement).href)
  );
  expect(alternateUrls).not.toContain('https://onnellab.com/blog/ja/number-tracks-multi-disc-mp3-album/');
});
