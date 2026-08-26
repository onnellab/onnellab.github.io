import { expect, test } from '@playwright/test';

import { blogIndexPathFor, blogPostPathFor } from '../src/lib/blog-i18n';
import {
  allLocaleDefinitions,
  allRouteFor,
  allSiteLocales
} from '../src/lib/extended-site-i18n';
import { uiLabels } from '../src/lib/ui-labels';

const oauthPathFor = (locale: (typeof allSiteLocales)[number]) => {
  const segment = allLocaleDefinitions[locale].pathSegment;
  return segment ? `/oauth/x/callback/${segment}/` : '/oauth/x/callback/';
};

for (const locale of allSiteLocales) {
  test(`${locale} exposes localized navigation and platform labels`, async ({ page }) => {
    await page.goto(allRouteFor('apps', locale));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('.platform-badges').first()).toHaveAttribute('aria-label', uiLabels[locale].platforms);

    await page.goto(allRouteFor('privacy', locale));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('.platform-badges').first()).toHaveAttribute('aria-label', uiLabels[locale].platforms);

    await page.goto(oauthPathFor(locale));
    await expect(page.locator('nav.topbar')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('footer a').nth(0)).toHaveText(uiLabels[locale].privacyPolicy);
    await expect(page.locator('footer a').nth(1)).toHaveText(uiLabels[locale].terms);
  });

  test(`${locale} blog labels follow the page language`, async ({ page }) => {
    await page.goto(blogIndexPathFor(locale));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].blogNavigation);

    await page.goto(blogPostPathFor(locale, 'txt-vs-epub-for-long-reading'));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].articleNavigation);
    const metadata = locale === 'en' || locale === 'ko' ? page.locator('.meta-grid') : page.locator('.meta');
    await expect(metadata).toHaveAttribute('aria-label', uiLabels[locale].articleMetadata);

    const viewer = page.locator('.article-image-viewer');
    if (await viewer.count()) {
      await expect(viewer).toHaveAttribute('aria-label', uiLabels[locale].articleImage);
      await expect(page.locator('[data-article-image-close]')).toHaveAttribute('aria-label', uiLabels[locale].close);
    }
  });
}
