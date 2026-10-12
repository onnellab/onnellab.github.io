import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'];

test('product availability labels retain accessible text contrast and fit narrow screens in all languages', async ({page}) => {
  await page.setViewportSize({width:320,height:800});
  for (const locale of locales) {
    await page.goto('/apps/'+locale);
    const badges = page.locator('.status-badge');
    await expect(badges).toHaveCount(10);
    const result = await badges.evaluateAll((nodes) => {
      const channel = (value:number) => {
        const scaled=value/255;
        return scaled <= .04045 ? scaled/12.92 : ((scaled+.055)/1.055)**2.4;
      };
      const luminance = (color:string) => {
        const channels=color.match(/[\d.]+/g)!.slice(0,3).map(Number);
        return .2126*channel(channels[0]) + .7152*channel(channels[1]) + .0722*channel(channels[2]);
      };
      return nodes.map((node) => {
        const style=getComputedStyle(node);
        const l1=luminance(style.color),l2=luminance(style.backgroundColor);
        const contrast=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
        const box=node.getBoundingClientRect();
        return {fontSize:parseFloat(style.fontSize),contrast,background:style.backgroundColor,
          visibleWidth:box.width,right:box.right,kind:node.getAttribute('data-status-kind')};
      });
    });
    expect(new Set(result.map((item) => item.kind))).toEqual(new Set(['released','preparing']));
    expect(new Set(result.map((item) => item.background)).size).toBeGreaterThan(1);
    for (const badge of result) {
      expect(badge.fontSize, locale).toBeGreaterThanOrEqual(12);
      expect(badge.contrast, locale).toBeGreaterThanOrEqual(4.5);
      expect(badge.visibleWidth, locale).toBeGreaterThan(0);
      expect(badge.right, locale).toBeLessThanOrEqual(321);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
      .toBeLessThanOrEqual(1);
  }
});
