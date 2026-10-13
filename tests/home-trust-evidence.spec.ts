import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'];

test('localized trust claims link only to published release evidence and privacy policies', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of locales) {
    await page.goto('/' + locale);
    const claims = page.locator('.trust-grid .trust-item');
    await expect(claims).toHaveCount(3);
    await expect(claims.nth(0).locator('a')).toHaveCount(0);

    const release = claims.nth(1).locator('.trust-evidence-link');
    const privacy = claims.nth(2).locator('.trust-evidence-link');
    await expect(release).toHaveCount(1);
    await expect(privacy).toHaveCount(1);
    await expect(release).toContainText('TagWeaver');
    await expect(privacy).toContainText('TagWeaver');
    const releasePath = await release.getAttribute('href');
    const privacyPath = await privacy.getAttribute('href');
    expect(releasePath).toMatch(new RegExp('^/release-notes/tagweaver/[^/]+/' + locale + '$'));
    expect(privacyPath).toBe('/privacy/tagweaver/' + locale);
    // These are real, pre-existing localized pages, not decorative or
    // speculative links to a reserved store URL or unpublished feature.
    expect((await request.get(releasePath!)).status(), releasePath!).toBe(200);
    expect((await request.get(privacyPath!)).status(), privacyPath!).toBe(200);

    const measurements = await claims.nth(2).locator('.trust-evidence-link').evaluate(node => {
      const bounds = node.getBoundingClientRect();
      return { width: bounds.width, viewportOverflow: document.documentElement.scrollWidth - innerWidth,
        fontSize: parseFloat(getComputedStyle(node).fontSize), linkIsVisible: bounds.height > 20 };
    });
    expect(measurements.viewportOverflow, locale || 'en').toBeLessThanOrEqual(1);
    expect(measurements.linkIsVisible).toBe(true);
    expect(measurements.fontSize).toBeGreaterThanOrEqual(13);
  }
});

test('evidence links remain keyboard focusable and desktop cards stay in a three-column layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  const links = page.locator('.trust-grid .trust-evidence-link');
  await expect(links).toHaveCount(2);
  const boxes = await page.locator('.trust-grid .trust-item').evaluateAll(nodes =>
    nodes.map(node => {
      const r = node.getBoundingClientRect();
      return { x: r.left, top: r.top, width: r.width };
    }));
  expect(boxes[0].x).toBeLessThan(boxes[1].x);
  expect(boxes[1].x).toBeLessThan(boxes[2].x);
  expect(Math.abs(boxes[0].top - boxes[2].top)).toBeLessThanOrEqual(1);

  await links.first().focus();
  await expect(links.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(links.nth(1)).toBeFocused();
});
