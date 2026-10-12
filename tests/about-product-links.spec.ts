import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'] as const;
const released = ['tagweaver','quivra','vaultxt','clipnest','aligna','segra','papira','melivra'];

for (const suffix of locales) {
  test(`About ${suffix || 'en'} links to actual released products in the same locale`, async ({page}) => {
    await page.setViewportSize({width:390,height:844});
    await page.goto('/about/'+suffix);
    const browse = page.locator('a.studio-browse-link');
    await expect(browse).toBeVisible();
    await expect(browse).toHaveAttribute('href', '/apps/'+suffix);
    const timeline = page.locator('.timeline');
    await expect(timeline.locator('li')).toHaveCount(released.length);
    const links = await timeline.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute('href') ?? '')
    );
    expect(links).toHaveLength(released.length);
    expect(links.sort()).toEqual(released.map((slug) => '/apps/'+slug+'/'+suffix).sort());
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
      .toBeLessThanOrEqual(1);
  });
}
