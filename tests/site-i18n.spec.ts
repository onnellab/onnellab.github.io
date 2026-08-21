import { expect, test } from '@playwright/test';

const locales = [
  { code: 'en', segment: '', hreflang: 'en', homeTitle: 'ONNELLAB - Calm, focused software' },
  { code: 'ko', segment: 'ko/', hreflang: 'ko', homeTitle: 'ONNELLAB - 차분하고 목적이 분명한 소프트웨어' },
  { code: 'ja', segment: 'ja/', hreflang: 'ja', homeTitle: 'ONNELLAB - 静かで目的の明確なソフトウェア' },
  { code: 'zh-Hans', segment: 'zh-hans/', hreflang: 'zh-Hans', homeTitle: 'ONNELLAB - 安静而专注的软件' },
  { code: 'zh-Hant', segment: 'zh-hant/', hreflang: 'zh-Hant', homeTitle: 'ONNELLAB - 安靜而專注的軟體' }
] as const;

const localizedPath = (base: string, segment: string) => (segment ? `${base}${segment}` : base);

test.describe('five-language core site', () => {
  for (const locale of locales) {
    test(`home ${locale.code}`, async ({ page }) => {
      const path = locale.segment ? `/${locale.segment}` : '/';
      await page.goto(path);
      await expect(page).toHaveTitle(locale.homeTitle);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io${path}`
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/zh-hant/'
      );
    });

    for (const section of ['apps', 'about', 'privacy', 'terms'] as const) {
      test(`${section} ${locale.code}`, async ({ page }) => {
        const path = localizedPath(`/${section}/`, locale.segment);
        await page.goto(path);
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `https://onnellab.github.io${path}`
        );
        await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
      });
    }
  }

  test('browser language no longer forces a redirect', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko'] });
      Object.defineProperty(navigator, 'language', { get: () => 'ko-KR' });
    });
    await page.goto('/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/');
  });

  test('manual language choice is remembered', async ({ page }) => {
    await page.goto('/');
    await page.locator('.locale-menu summary').click();
    await page.locator('.locale-menu-panel a[data-locale-choice="ja"]').click();
    await expect(page).toHaveURL(/\/ja\/$/);
    expect(await page.evaluate(() => localStorage.getItem('onnellab.locale'))).toBe('ja');
  });

  test('non-Papira app details remain on their English and Korean routes', async ({ page }) => {
    await page.goto('/apps/ja/');
    await expect(page.locator('[data-app-row]').filter({ hasText: 'Papira' })).toHaveAttribute(
      'href',
      '/apps/papira/ja/'
    );
    await expect(page.locator('[data-app-row]').filter({ hasText: 'TagWeaver' })).toHaveAttribute(
      'href',
      '/apps/tagweaver/'
    );

    await page.goto('/apps/zh-hant/');
    await expect(page.locator('[data-app-row]').filter({ hasText: 'Papira' })).toHaveAttribute(
      'href',
      '/apps/papira/zh-hant/'
    );
    await expect(page.locator('[data-app-row]').filter({ hasText: 'TagWeaver' })).toHaveAttribute(
      'href',
      '/apps/tagweaver/'
    );
  });

  test('sitemap contains all common locale routes', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    const sitemap = await response.text();
    for (const locale of locales) {
      const homeUrl = `https://onnellab.github.io/${locale.segment}`;
      expect(sitemap.split(`<loc>${homeUrl}</loc>`).length - 1).toBe(1);
      for (const section of ['apps', 'about', 'privacy', 'terms']) {
        const url = `https://onnellab.github.io/${section}/${locale.segment}`;
        expect(sitemap.split(`<loc>${url}</loc>`).length - 1).toBe(1);
      }
    }
  });
});
