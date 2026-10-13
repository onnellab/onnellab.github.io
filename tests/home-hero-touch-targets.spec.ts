import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'];

test('all hero controls have reliable minimum 44px pointer targets on 320px phones', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  for (const locale of locales) {
    await page.goto('/' + locale);
    const measurements = await page.locator('.hero-carousel-controls').evaluate((region) => {
      const controls = [...region.querySelectorAll<HTMLButtonElement>('button')];
      const rectangles = controls.map(control => {
        const bounds = control.getBoundingClientRect();
        return { left: bounds.left, top: bounds.top, right: bounds.right,
          bottom: bounds.bottom, width: bounds.width, height: bounds.height };
      });
      const group = region.getBoundingClientRect();
      return {
        boxes: rectangles, groupLeft: group.left, groupRight: group.right,
        documentOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(measurements.boxes).toHaveLength(5);
    for (const bounds of measurements.boxes) {
      expect(bounds.width, locale || 'en').toBeGreaterThanOrEqual(44);
      expect(bounds.height, locale || 'en').toBeGreaterThanOrEqual(44);
      expect(bounds.left, locale || 'en').toBeGreaterThanOrEqual(measurements.groupLeft - 1);
      expect(bounds.right, locale || 'en').toBeLessThanOrEqual(measurements.groupRight + 1);
    }
    const ordered = [...measurements.boxes].sort((a, b) => a.left - b.left);
    for (let index = 1; index < ordered.length; index++) {
      expect(ordered[index].left, 'control hit regions must not overlap')
        .toBeGreaterThanOrEqual(ordered[index - 1].right - 0.5);
    }
    expect(measurements.documentOverflow, locale || 'en').toBeLessThanOrEqual(1);
    await page.locator('[data-hero-next]').click();
    await expect(page.locator('[data-hero-counter]')).toHaveText('02 / 03');
    await page.locator('[data-hero-dot][data-index="0"]').click();
    await expect(page.locator('[data-hero-counter]')).toHaveText('01 / 03');
  }
});

test('desktop and tablet controls keep the original minimalist artwork', async ({ page }) => {
  for (const width of [390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    await expect(page.locator('[data-hero-dot]')).toHaveCount(3);
    await expect(page.locator('[data-hero-previous]')).toBeVisible();
    await expect(page.locator('[data-hero-next]')).toBeVisible();
    const controls = page.locator('.hero-carousel-controls button');
    expect(await controls.evaluateAll(nodes => nodes.every(node => {
      const rect = node.getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44;
    }))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});
