import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'];
const expectedProducts = ['TagWeaver', 'Melivra', 'Papira'];

test('the centered hero identifies each app function in all nine localized homepages', async ({ page }) => {
  for (const locale of locales) {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/' + locale);
    const stage = page.locator('[data-hero-track]');
    const dots = page.locator('[data-hero-dot]');
    const captions = page.locator('.hero-slide-label');
    await expect(captions).toHaveCount(3);
    for (const [index, app] of expectedProducts.entries()) {
      await dots.nth(index).click();
      await expect(stage).not.toHaveAttribute('data-animating', 'true');
      const active = page.locator('[data-hero-slot="active"] .hero-slide');
      const title = active.locator('.hero-slide-identity strong');
      const purpose = active.locator('.hero-slide-identity small');
      await expect(title).toHaveText(app);
      await expect(purpose).toBeVisible();
      const accessibleText = await active.getAttribute('aria-label');
      expect(accessibleText).toBe(app + ' · ' + await purpose.innerText());
      const rects = await active.evaluate((link) => {
        const frame = link.querySelector('.hero-slide-screen')!.getBoundingClientRect();
        const category = link.querySelector('.hero-slide-identity small')!.getBoundingClientRect();
        return { categoryBelowImage: category.top > frame.bottom, height: category.height, width: category.width };
      });
      expect(rects.categoryBelowImage).toBe(true);
      expect(rects.height).toBeGreaterThan(10);
      expect(rects.width).toBeGreaterThan(0);
      await expect(page.locator('[data-hero-slot="previous"] .hero-slide-label')).toBeHidden();
      await expect(page.locator('[data-hero-slot="next"] .hero-slide-label')).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});

test('the category caption keeps physical card heights stable at desktop and mobile widths', async ({ page }) => {
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    const stage = page.locator('[data-hero-track]');
    const box = () => stage.evaluate((root) => {
      const labels = [...root.querySelectorAll('.hero-slot')].map(el =>
        Number(el.querySelector('.hero-slide-label')!.getBoundingClientRect().height.toFixed(2)));
      return { stageHeight: Number(root.getBoundingClientRect().height.toFixed(2)), labels };
    });
    const initial = await box();
    for (const index of [1, 2, 0]) {
      await page.locator('[data-hero-dot][data-index="' + index + '"]').click();
      await expect(stage).not.toHaveAttribute('data-animating', 'true');
      expect(await box()).toEqual(initial);
    }
  }
});
