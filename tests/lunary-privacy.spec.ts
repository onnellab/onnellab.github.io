import { expect, test } from '@playwright/test';
import { allAppPrivacyRouteFor, allProductRouteFor, allRouteFor, allSiteLocales } from '../src/lib/extended-site-i18n';
import { getLunaryPrivacyCopy } from '../src/lib/lunary-privacy';

test('Lunary privacy policy is authored for all public locales', () => {
  for (const locale of allSiteLocales) {
    const copy = getLunaryPrivacyCopy(locale);
    expect(copy.sections).toHaveLength(8);
    const body = JSON.stringify(copy);
    expect(body).toContain('Lunary');
    expect(body).toContain('Google');
    expect(body).toContain('Google API Services User Data Policy');
    expect(body).toContain('Limited Use');
    expect(copy.updatedValue).toBe('2026-09-24');
  }
});

test('Lunary product privacy routes are public, canonical and link the global terms', async ({ page }) => {
  for (const locale of allSiteLocales) {
    const route = allAppPrivacyRouteFor('lunary', locale);
    await page.goto(route);
    await expect(page.locator('h1')).toContainText('Lunary');
    await expect(page.locator('main')).toContainText('Google API Services User Data Policy');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://onnellab.com' + route);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
    await expect(page.locator('footer a[href*="/terms/"]').first()).toBeVisible();
  }
});

test('Lunary app detail page visibly discloses optional Google Calendar use and privacy', async ({ page }) => {
  await page.goto('/apps/lunary/');
  await expect(page.locator('h1')).toContainText('Lunary');
  await expect(page.locator('main')).toContainText('Google Calendar');
  await expect(page.locator('a[href="https://onnellab.com/privacy/lunary/"]').first()).toBeVisible();
  await expect(page.locator('footer a[href="/terms/"]')).toBeVisible();
});


test('app indexes show Lunary as preparing for release in every public locale', async ({ page }) => {
  for (const locale of allSiteLocales) {
    await page.goto(allRouteFor('apps', locale));
    const card = page.locator('a[href="' + allProductRouteFor('lunary', locale) + '"]');
    await expect(card).toBeVisible();
    await expect(card).toContainText('Lunary');
    const status = card.locator('span').first();
    await expect(status).toBeVisible();
    expect((await status.textContent())?.trim().length ?? 0).toBeGreaterThan(0);
  }
});
