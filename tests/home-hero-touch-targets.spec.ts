import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'];

test('only three bottom pagination dots remain, with non-overlapping 44px targets on small phones', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  for (const locale of locales) {
    await page.goto('/' + locale);
    const carousel = page.locator('[data-hero-carousel]');
    await expect(carousel.locator('[data-hero-counter], [data-hero-next], [data-hero-previous], .hero-carousel-controls')).toHaveCount(0);
    const pagination = carousel.locator('.hero-carousel-pagination');
    const dots = pagination.locator('button[data-hero-dot]');
    await expect(dots).toHaveCount(3);
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
    await expect(carousel.locator('[data-hero-announcement]')).toHaveAttribute('aria-live', 'polite');

    const measurements = await pagination.evaluate((region) => {
      const buttons = [...region.querySelectorAll<HTMLButtonElement>('button')];
      const rectangles = buttons.map(control => {
        const bounds = control.getBoundingClientRect();
        const dot = control.querySelector('span')!.getBoundingClientRect();
        return {
          left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom,
          width: bounds.width, height: bounds.height, visibleDot: dot.width
        };
      });
      const group = region.getBoundingClientRect();
      const label = document.querySelector('[data-hero-slot="active"] .hero-slide-label')!.getBoundingClientRect();
      const screen = document.querySelector('[data-hero-slot="active"] .hero-slide-screen')!.getBoundingClientRect();
      return {
        boxes: rectangles, groupLeft: group.left, groupRight: group.right, top: group.top,
        labelBottom: label.bottom, screenBottom: screen.bottom,
        documentOverflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    expect(measurements.boxes).toHaveLength(3);
    for (const bounds of measurements.boxes) {
      expect(bounds.width, locale || 'en').toBeGreaterThanOrEqual(44);
      expect(bounds.height, locale || 'en').toBeGreaterThanOrEqual(44);
      expect(bounds.visibleDot).toBeLessThan(20);
      expect(bounds.left).toBeGreaterThanOrEqual(measurements.groupLeft - 1);
      expect(bounds.right).toBeLessThanOrEqual(measurements.groupRight + 1);
    }
    const ordered = [...measurements.boxes].sort((a, b) => a.left - b.left);
    for (let index = 1; index < ordered.length; index++) {
      expect(ordered[index].left, 'touch regions must not overlap')
        .toBeGreaterThanOrEqual(ordered[index - 1].right - 0.5);
    }
    expect(measurements.top).toBeGreaterThanOrEqual(measurements.labelBottom - 1);
    expect(measurements.top).toBeGreaterThan(measurements.screenBottom);
    expect(measurements.documentOverflow, locale || 'en').toBeLessThanOrEqual(1);

    await dots.nth(1).click();
    await expect(carousel.locator('[data-hero-slot="active"] strong')).toHaveText('Melivra');
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
    await dots.nth(0).click();
    await expect(carousel.locator('[data-hero-slot="active"] strong')).toHaveText('TagWeaver');
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
  }
});

test('desktop and tablet keep accessible bottom dots and keyboard navigation without arrows', async ({ page }) => {
  for (const width of [390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    const carousel = page.locator('[data-hero-carousel]');
    const dots = carousel.locator('.hero-carousel-pagination button');
    await expect(dots).toHaveCount(3);
    await expect(carousel.locator('.hero-carousel-pagination')).toHaveAttribute('role', 'group');
    expect(await dots.evaluateAll(nodes => nodes.every(node => {
      const rect = node.getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44;
    }))).toBe(true);
    await dots.nth(2).focus();
    await expect(dots.nth(2)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
    await carousel.locator('[data-hero-track]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
      .toBeLessThanOrEqual(1);
  }
});
