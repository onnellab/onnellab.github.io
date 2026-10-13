import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'];

test('trust section presents all three studio principles without app-specific links in nine languages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of locales) {
    await page.goto('/' + locale);
    const section = page.locator('.trust-section');
    const claims = section.locator('.trust-grid .trust-item');
    await expect(claims).toHaveCount(3);
    await expect(claims.locator('.trust-ordinal')).toHaveText(['01', '02', '03']);
    await expect(section.locator('h2')).toBeVisible();
    for (const claim of await claims.all()) {
      await expect(claim.locator('h3')).toBeVisible();
      await expect(claim.locator('p')).toBeVisible();
      expect((await claim.locator('p').innerText()).trim().length).toBeGreaterThan(10);
    }
    await expect(section.locator('a, button, [role="button"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);

    // Removing duplicate product-specific evidence must not remove the
    // ordinary catalogue and privacy entry points elsewhere on the site.
    const prefix = locale || '';
    await expect(page.locator('.site-footer a[href="/privacy/' + prefix + '"]')).toHaveCount(1);
    await expect(page.locator('main a[href="/apps/' + prefix + '"]').first()).toBeVisible();
  }
});

test('desktop trust cards stay aligned and have no extra calls to action', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  const section = page.locator('.trust-section');
  const claims = section.locator('.trust-item');
  await expect(claims).toHaveCount(3);
  await expect(claims.locator('a')).toHaveCount(0);
  const metrics = await claims.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width };
  }));
  expect(metrics[0].left).toBeLessThan(metrics[1].left);
  expect(metrics[1].left).toBeLessThan(metrics[2].left);
  expect(Math.abs(metrics[0].top - metrics[2].top)).toBeLessThanOrEqual(1);
  expect(metrics.every((metric) => metric.width > 100)).toBe(true);
});
