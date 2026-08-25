import { expect, test } from '@playwright/test';

const locales = [
  { code: 'pt-BR', segment: 'pt-br' },
  { code: 'de', segment: 'de' },
  { code: 'fr', segment: 'fr' },
  { code: 'es', segment: 'es' }
] as const;

const canonical = (path: string) => `https://onnellab.github.io${path}`;

for (const locale of locales) {
  test.describe(locale.code, () => {
    for (const route of [
      `/${locale.segment}/`,
      `/apps/${locale.segment}/`,
      `/about/${locale.segment}/`,
      `/privacy/${locale.segment}/`,
      `/terms/${locale.segment}/`
    ]) {
      test(`core route ${route}`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(route));
        await expect(page.locator('a[data-locale-choice]')).toHaveCount(9);
        await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
      });
    }

    test('product, release note, and privacy policy stay in the selected locale', async ({ page }) => {
      const productPath = `/apps/tagweaver/${locale.segment}/`;
      await page.goto(productPath);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(productPath));
      await expect(page.locator('a[data-locale-choice]')).toHaveCount(9);
      await expect(
        page.getByRole('link', { name: /privacy|privacidade|datenschutz|confidentialité|privacidad/i })
      ).toHaveAttribute('href', `/privacy/tagweaver/${locale.segment}/`);
      await expect(page.getByRole('link', { name: 'TagWeaver v2.2' })).toHaveAttribute(
        'href',
        `/release-notes/tagweaver/2.2/${locale.segment}/`
      );

      const privacyPath = `/privacy/tagweaver/${locale.segment}/`;
      await page.goto(privacyPath);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(privacyPath));
      await expect(page.locator('a[data-locale-choice]')).toHaveCount(9);
    });

    test('legacy Melivra privacy alias resolves to localized content and preferred canonical', async ({ page }) => {
      const aliasPath = `/melivra-privacy-policy/${locale.segment}/`;
      await page.goto(aliasPath);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        canonical(`/privacy/melivra/${locale.segment}/`)
      );
      await expect(page.locator('a[data-locale-choice]')).toHaveCount(9);
    });

    test('blog index and article are localized', async ({ page }) => {
      const indexPath = `/blog/${locale.segment}/`;
      await page.goto(indexPath);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(indexPath));
      await expect(page.locator('a[data-locale-choice]')).toHaveCount(9);

      const articlePath = `/blog/${locale.segment}/read-large-txt-files-without-lag/`;
      await page.goto(articlePath);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(articlePath));
      await expect(page.locator('a[data-locale-choice]')).toHaveCount(9);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
    });

    test('release note and OAuth callback are localized', async ({ page }) => {
      const releasePath = `/release-notes/tagweaver/2.2/${locale.segment}/`;
      await page.goto(releasePath);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(releasePath));

      const oauthPath = `/oauth/x/callback/${locale.segment}/`;
      await page.goto(oauthPath);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(oauthPath));
    });
  });
}

test('sitemap exposes representative routes from all nine-language surfaces', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  for (const path of [
    '/fr/',
    '/apps/tagweaver/de/',
    '/privacy/tagweaver/es/',
    '/blog/pt-br/read-large-txt-files-without-lag/',
    '/release-notes/tagweaver/2.2/zh-hant/',
    '/oauth/x/callback/ja/'
  ]) {
    expect(xml).toContain(canonical(path));
  }
  for (const hreflang of ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es', 'x-default']) {
    expect(xml).toContain(`hreflang="${hreflang}"`);
  }
});
