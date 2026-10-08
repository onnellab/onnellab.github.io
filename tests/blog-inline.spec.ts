import { expect, test } from '@playwright/test';

const locales = ['en', 'ko', 'ja', 'zh-hans', 'zh-hant', 'pt-br', 'de', 'fr', 'es'];

test('all nine blog locales render Markdown emphasis without visible delimiter stars', async ({ page }) => {
  for (const locale of locales) {
    await page.goto(`/blog/${locale}/rename-files-safely-preview-workflow/`);
    const article = page.locator('.article-body');
    const emphasis = article.locator('strong').first();
    await expect(emphasis, `${locale}: bold markup`).toBeVisible();
    const fontWeight = await emphasis.evaluate((element) => Number.parseInt(getComputedStyle(element).fontWeight, 10));
    expect(fontWeight, `${locale}: bold font weight`).toBeGreaterThanOrEqual(600);
    const plainText = await article.evaluate((element) => {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('pre, code').forEach((node) => node.remove());
      return clone.textContent ?? '';
    });
    expect(plainText, `${locale}: no stray Markdown delimiters`).not.toContain('**');
  }
});
