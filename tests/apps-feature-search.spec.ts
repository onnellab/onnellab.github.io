import { expect, test } from '@playwright/test';

const locales = [
  {path: '/apps/', extended: false},
  {path: '/apps/ko/', extended: false},
  {path: '/apps/ja/', extended: false},
  {path: '/apps/zh-hans/', extended: false},
  {path: '/apps/zh-hant/', extended: false},
  {path: '/apps/pt-br/', extended: true},
  {path: '/apps/de/', extended: true},
  {path: '/apps/fr/', extended: true},
  {path: '/apps/es/', extended: true}
] as const;

for (const {path, extended} of locales) {
  test(`catalogue ${path} searches the localized function description as well as the name`, async ({page}) => {
    await page.goto(path);
    const query = page.locator(extended ? '[data-search]' : '[data-app-search]');
    const rows = page.locator(extended ? '.app-row[data-row]' : '.app-card[data-app-row]');
    const melivra = rows.filter({has: page.locator('h2', {hasText:'Melivra'})});

    const description = (await melivra.locator('p').first().innerText()).trim();
    const term = description.split(/[^\p{L}\p{N}]+/u).find((word) =>
      word.length >= 3 && !'melivra'.includes(word.toLowerCase())
    );
    expect(term, `localized feature keyword for ${path}`).toBeTruthy();
    await query.fill(term!);
    await expect(melivra).toBeVisible();

    await query.fill('tagweaver');
    await expect(rows.filter({has:page.locator('h2', {hasText:'TagWeaver'})})).toBeVisible();

    await query.fill('no-app-has-this-function-92041');
    await expect(rows.filter({visible:true})).toHaveCount(0);
    await expect(page.locator(extended ? '[data-empty]' : '[data-app-empty]')).toBeVisible();
    await query.fill('');
    await expect(rows).toHaveCount(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}

test('Korean function-based query works without an app name', async ({page}) => {
  await page.goto('/apps/ko/');
  await page.locator('[data-app-search]').fill('음악');
  await expect(page.locator('[data-app-row]:visible').filter({has:page.locator('h2', {hasText:'Melivra'})})).toBeVisible();
});

test('extended-language privacy search hides unmatched rows rather than showing all', async ({page}) => {
  await page.goto('/privacy/de/');
  const query = page.locator('[data-search]');
  await query.fill('TagWeaver');
  await expect(page.locator('.policy-row:visible')).toHaveCount(1);
  await query.fill('does-not-exist-9921');
  await expect(page.locator('.policy-row:visible')).toHaveCount(0);
  await expect(page.locator('[data-empty]')).toBeVisible();
});
