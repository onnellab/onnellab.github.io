import { expect, test } from '@playwright/test';
import { allLocaleDefinitions, allRouteFor, allSiteLocales } from '../src/lib/extended-site-i18n';
import { blogIndexPathFor } from '../src/lib/blog-i18n';
import { uiLabels } from '../src/lib/ui-labels';

test('all public page families use one identical, sticky site header', async ({ page }) => {
  const paths = [
    '/ko/', '/apps/ko/', '/apps/papira/ko/', '/about/ko/',
    '/blog/ko/', '/blog/ko/txt-vs-epub-for-long-reading/',
    '/privacy/ko/', '/privacy/papira/ko/', '/terms/ko/',
    '/release-notes/tagweaver/2.5.3/ko/',
    '/oauth/x/callback/ko/', '/youtube-manager/'
  ];
  let baseline: unknown = null;
  for (const path of paths) {
    await page.goto(path);
    const header = page.locator('[data-site-header]');
    await expect(header).toHaveCount(1);
    await expect(header.locator('.brand .brand-symbol')).toBeVisible();
    await expect(header.locator('.brand span')).toHaveText('ONNELLAB');
    await expect(header.locator('.nav-links > a')).toHaveCount(3);
    await expect(header.locator('.locale-menu-panel > li > a')).toHaveCount(9);
    await expect(page.locator('main nav.site-header, main .header-wrap, main header.topbar')).toHaveCount(0);
    const style = await header.evaluate((element) => {
      const brand = element.querySelector('.brand')!;
      return {
        sticky: getComputedStyle(element).position,
        height: Math.round(element.getBoundingClientRect().height),
        background: getComputedStyle(element).backgroundColor,
        brandColor: getComputedStyle(brand).color,
        brandSize: getComputedStyle(brand).fontSize,
        links: [...element.querySelectorAll('.nav-links > a')].map((link) => getComputedStyle(link).fontSize)
      };
    });
    expect(style.sticky).toBe('sticky');
    const viewportWidth = page.viewportSize()?.width ?? 1440;
    expect(style.height).toBe(viewportWidth <= 650 ? 61 : viewportWidth <= 820 ? 69 : 77);
    expect(style.brandColor).toBe('rgb(52, 50, 58)');
    expect(style.brandSize).toBe(viewportWidth <= 355 ? '14px' : viewportWidth <= 650 ? '16px' : '18px');
    if (baseline) expect(style, path).toEqual(baseline);
    else baseline = style;
  }
});

test('shared header remains fixed on scroll and mobile menu has all primary routes', async ({ page }) => {
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 880 });
    await page.goto('/apps/papira/ko/');
    const header = page.locator('[data-site-header]');
    const height = await header.evaluate((node) => Math.round(node.getBoundingClientRect().height));
    expect(height).toBe(width <= 650 ? 61 : width <= 820 ? 69 : 77);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
      .toBeLessThanOrEqual(1);
    await page.evaluate(() => window.scrollTo(0, 1100));
    await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
    if (width <= 650) {
      await header.locator('.mobile-menu summary').click();
      await expect(header.locator('.mobile-menu-panel > a')).toHaveCount(3);
      await expect(header.locator('.mobile-menu-panel a[href="/apps/ko/"]')).toBeVisible();
      await expect(header.locator('.mobile-menu-panel a[href="/about/ko/"]')).toBeVisible();
      await expect(header.locator('.mobile-menu-panel a[href="/blog/ko/"]')).toBeVisible();
    } else {
      await expect(header.locator('.mobile-menu summary')).toBeHidden();
      await expect(header.locator('.nav-links > a')).toHaveCount(3);
    }
  }
});

test('language switcher preserves product, blog and release note context', async ({ page }) => {
  const paths = [
    { path: '/apps/papira/ko/', locale: 'ja', expected: '/apps/papira/ja/' },
    { path: '/release-notes/tagweaver/2.5.3/ko/', locale: 'fr', expected: '/release-notes/tagweaver/2.5.3/fr/' },
    { path: '/blog/ko/txt-vs-epub-for-long-reading/', locale: 'ja', expected: '/blog/ja/txt-vs-epub-for-long-reading/' },
    { path: '/oauth/x/callback/ko/', locale: 'de', expected: '/oauth/x/callback/de/' },
    { path: '/privacy/papira/ko/', locale: 'en', expected: '/privacy/papira/' }
  ];
  for (const item of paths) {
    await page.goto(item.path);
    const href = await page.locator('[data-site-header] .locale-menu-panel a[data-locale-choice="' + item.locale + '"]')
      .getAttribute('href');
    expect(href, item.path).toBe(item.expected);
  }
});

test('nine languages share the same navigation, with no duplicate footer directory', async ({ page }) => {
  for (const locale of allSiteLocales) {
    await page.goto(allRouteFor('home', locale));
    const header = page.locator('[data-site-header]');
    await expect(header.locator('.nav-links a')).toHaveCount(3);
    const navUrls = await header.locator('.nav-links a').evaluateAll(
      (anchors) => anchors.map((anchor) => anchor.getAttribute('href'))
    );
    expect(navUrls).toEqual([allRouteFor('apps', locale), allRouteFor('about', locale), blogIndexPathFor(locale)]);
    await expect(header.locator('.locale-menu-panel a[aria-current="page"]')).toHaveAttribute('data-locale-choice', locale);
    await expect(page.locator('.footer-directory')).toHaveCount(0);
    await expect(header.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
  }
});
