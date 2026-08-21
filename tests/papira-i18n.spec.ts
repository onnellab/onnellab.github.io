import { expect, test } from '@playwright/test';

const locales = [
  { path: '', hreflang: 'en', title: 'Papira - Offline TXT to EPUB Maker' },
  { path: 'ko/', hreflang: 'ko', title: 'Papira - 오프라인 TXT EPUB 제작 도구' },
  { path: 'ja/', hreflang: 'ja', title: 'Papira - オフラインTXT・EPUB作成ツール' },
  { path: 'zh-hans/', hreflang: 'zh-Hans', title: 'Papira - 离线 TXT 转 EPUB 制作工具' },
  { path: 'zh-hant/', hreflang: 'zh-Hant', title: 'Papira - 離線 TXT 轉 EPUB 製作工具' }
] as const;

test.describe('Papira five-language launch surface', () => {
  for (const locale of locales) {
    test(`Papira product page ${locale.hreflang}`, async ({ page }) => {
      await page.goto(`/apps/papira/${locale.path}`);
      await expect(page).toHaveTitle(locale.title);
      await expect(page.locator('h1')).toHaveText('Papira');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io/apps/papira/${locale.path}`
      );
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/papira/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="ja"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/papira/ja/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hans"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/papira/zh-hans/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/papira/zh-hant/'
      );
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
    });

    test(`Papira privacy page ${locale.hreflang}`, async ({ page }) => {
      await page.goto(`/privacy/papira/${locale.path}`);
      await expect(page.locator('main')).toContainText('Papira');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io/privacy/papira/${locale.path}`
      );
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
    });
  }

  test('localized privacy hubs expose Papira', async ({ page }) => {
    for (const path of ['/privacy/ja/', '/privacy/zh-hans/', '/privacy/zh-hant/']) {
      await page.goto(path);
      await expect(page.locator('[data-policy-row]').filter({ hasText: 'Papira' })).toHaveCount(1);
    }
  });

  test('sitemap exposes every Papira locale once', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    const sitemap = await response.text();
    for (const locale of locales) {
      const productUrl = `https://onnellab.github.io/apps/papira/${locale.path}`;
      const privacyUrl = `https://onnellab.github.io/privacy/papira/${locale.path}`;
      expect(sitemap.split(`<loc>${productUrl}</loc>`).length - 1).toBe(1);
      expect(sitemap.split(`<loc>${privacyUrl}</loc>`).length - 1).toBe(1);
    }
  });
});
