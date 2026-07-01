import { expect, test } from '@playwright/test';

const pages = ['/', '/ko/', '/apps/', '/apps/ko/', '/apps/tagweaver/', '/apps/tagweaver/ko/'];

test.describe('site layout', () => {
  for (const path of pages) {
    test(`${path} renders without broken screenshots`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();

      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(horizontalOverflow).toBe(false);

      const brokenImages = await page.evaluate(() =>
        Array.from(document.images)
          .filter((image) => image.naturalWidth === 0 || image.naturalHeight === 0)
          .map((image) => image.getAttribute('src') ?? '')
      );
      expect(brokenImages).toEqual([]);

      const visibleText = await page.locator('main').innerText();
      expect(visibleText.trim().length).toBeGreaterThan(40);
    });
  }

  test('product preview appears before copy on product pages', async ({ page }) => {
    await page.goto('/apps/tagweaver/');
    await expect(page.locator('.hero-preview img')).toBeVisible();
    await expect(page.locator('.screenshot-row img')).toHaveCount(3);
    await expect(page.locator('.download-band .button.primary').first()).toBeVisible();
  });
});
