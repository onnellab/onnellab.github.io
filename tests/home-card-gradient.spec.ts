import { expect, test } from '@playwright/test';

test('home featured and selected cards use the same product-specific ambient gradient as catalogue cards', async ({page}) => {
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/ko/');
    const cards = page.locator('.featured, .collection-grid .product-card');
    await expect(cards).toHaveCount(4);
    for (const slug of ['tagweaver','quivra','melivra','papira']) {
      const card = page.locator('.homepage a.featured[href*="/apps/'+slug+'/"], .homepage a.product-card[href*="/apps/'+slug+'/"]');
      await expect(card).toHaveCount(1);
      const homeStyles = await card.evaluate((el) => {
        const style = getComputedStyle(el);
        const picture = el.querySelector('.featured-image-stage, .product-picture');
        return {background:style.backgroundImage,accent:style.getPropertyValue('--accent-bg').trim(),
          pictureBackground:picture ? getComputedStyle(picture).backgroundColor : undefined,
          width:el.getBoundingClientRect().width};
      });
      expect(homeStyles.background).toContain('linear-gradient(135deg');
      expect(homeStyles.pictureBackground).toBe('rgba(0, 0, 0, 0)');
      expect(homeStyles.width).toBeGreaterThan(100);
      await page.goto('/apps/ko/');
      const listing = page.locator('.app-card[href="/apps/'+slug+'/ko/"]');
      await expect(listing).toHaveCount(1);
      const listed = await listing.evaluate((el) => {
        const style=getComputedStyle(el);
        return {background:style.backgroundImage,accent:style.getPropertyValue('--accent-bg').trim()};
      });
      expect(homeStyles.accent).toBe(listed.accent);
      expect(homeStyles.background).toBe(listed.background);
      await page.goto('/ko/');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
});
