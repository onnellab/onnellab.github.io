import { expect, test } from '@playwright/test';

const routes = [
  {url:'/ko/', target:'.homepage .product-card'},
  {url:'/apps/ko/', target:'.app-card'},
  {url:'/apps/tagweaver/ko/', target:'.screens-band summary'},
  {url:'/blog/ko/', target:'.post-card'}
];

for (const {url, target} of routes) {
  test(`reduced motion preserves ${url} without unnecessary animated transitions`, async ({page}) => {
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(url);
    const duration = await page.locator(target).first().evaluate((element) => {
      const style = getComputedStyle(element);
      return {animation:style.animationDuration,transition:style.transitionDuration};
    });
    const values = duration.transition.split(',').map((value) => parseFloat(value));
    expect(Math.max(...values)).toBeLessThanOrEqual(.001);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
      .toBeLessThanOrEqual(1);
  });
}

test('language selection has a 44px minimum touch target on compact phones', async ({page}) => {
  await page.setViewportSize({width:320,height:800});
  for (const url of ['/ko/', '/apps/ko/', '/blog/ko/', '/about/de/']) {
    await page.goto(url);
    const hit = await page.locator('[data-site-header] .locale-menu summary').boundingBox();
    expect(hit?.height, url).toBeGreaterThanOrEqual(44);
    expect(hit?.width, url).toBeGreaterThanOrEqual(44);
    const menu = page.locator('[data-site-header] .locale-menu');
    await menu.locator('summary').click();
    await expect(menu.locator('a[data-locale-choice]')).toHaveCount(9);
  }
});
