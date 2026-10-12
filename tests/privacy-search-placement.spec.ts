import { expect, test } from '@playwright/test';

const locales = [
  {url:'/privacy/ko/', extended:false},
  {url:'/privacy/ja/', extended:false},
  {url:'/privacy/zh-hant/', extended:false},
  {url:'/privacy/de/', extended:true},
  {url:'/privacy/fr/', extended:true},
  {url:'/privacy/es/', extended:true},
  {url:'/privacy/pt-br/', extended:true}
] as const;

for (const {url, extended} of locales) {
  test(`privacy ${url} lists policies immediately after search, with notices beneath`, async ({page}) => {
    await page.setViewportSize({width:320,height:800});
    await page.goto(url);
    const search = page.locator(extended ? 'input[data-search]' : 'input[data-policy-search]');
    const list = page.locator('.policy-list');
    const notices = page.locator('.notice-grid');
    const positions = await page.evaluate(() => {
      const box = (selector:string) => document.querySelector(selector)!.getBoundingClientRect();
      const q=box('input[type="search"]'), l=box('.policy-list'), n=box('.notice-grid');
      return {searchBottom:q.bottom,listTop:l.top,listBottom:l.bottom,noticesTop:n.top,
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
    });
    expect(positions.searchBottom).toBeLessThanOrEqual(positions.listTop+1);
    expect(positions.listBottom).toBeLessThanOrEqual(positions.noticesTop+1);
    expect(positions.overflow).toBeLessThanOrEqual(1);
    await expect(notices).toContainText('ONNELLAB');
    await expect(list).toContainText('TagWeaver');

    await search.fill('TagWeaver');
    await expect(page.locator('.policy-row:visible')).toHaveCount(1);
    await search.fill('nothing-with-this-name-5713');
    await expect(page.locator('.policy-row:visible')).toHaveCount(0);
    await expect(page.locator(extended ? '[data-empty]' : '[data-policy-empty]')).toBeVisible();
    await expect(notices).toBeVisible();
  });
}
