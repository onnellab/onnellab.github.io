import { expect, test } from '@playwright/test';

test('the real app gallery follows the hero and precedes the long description and FAQ', async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['ko', 'de']) {
      await page.goto('/apps/tagweaver/' + locale + '/');
      const nodes = page.locator('main.page-shell > .hero, main.page-shell > .screens-band, main.page-shell > .content-band, main.page-shell > .faq-band, main.page-shell > .download-band');
      await expect(nodes).toHaveCount(5);
      const order = await nodes.evaluateAll((elements) => elements.map((node) => node.className));
      expect(order).toEqual(['hero', 'screens-band', 'content-band', 'faq-band', 'download-band']);
      await expect(page.locator('.screens-band .screenshot-link')).toHaveCount(6);
      await expect(page.locator('.screens-band')).toHaveAttribute('open', '');
      const measures = await page.evaluate(() => {
        const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
        const hero = rect('.hero'), screens = rect('.screens-band'), copy = rect('.content-band');
        return { heroBottom: hero.bottom, screensTop: screens.top, screensBottom: screens.bottom,
          copyTop: copy.top, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      expect(measures.heroBottom).toBeLessThanOrEqual(measures.screensTop + 1);
      expect(measures.screensBottom).toBeLessThanOrEqual(measures.copyTop + 1);
      expect(measures.overflow).toBeLessThanOrEqual(1);
    }
  }

  await page.setViewportSize({width:390,height:844});
  await page.goto('/apps/tagweaver/ko/');
  await page.locator('.screens-band').scrollIntoViewIfNeeded();
  await page.locator('.screenshot-link').first().click();
  await expect(page.locator('.screenshot-viewer')).toHaveJSProperty('open', true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.screenshot-viewer')).toHaveJSProperty('open', false);
});

test('unreleased app keeps preparation status and no misleading install links', async ({page}) => {
  await page.goto('/apps/lunary/ko/');
  await expect(page.locator('[data-release-status]')).toContainText('출시 준비 중');
  await expect(page.locator('[data-store-link]')).toHaveCount(0);
});
