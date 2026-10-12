import { expect, test } from '@playwright/test';

const routes = [
  { home: '/', segment: '', title: 'Small tools. Calmly made.', apps: '/apps/', about: '/about/', blog: '/blog/' },
  { home: '/ko/', segment: 'ko/', title: '작은 도구를, 세심하게 만들어요.', apps: '/apps/ko/', about: '/about/ko/', blog: '/blog/ko/' },
  { home: '/ja/', segment: 'ja/', title: '小さな道具を、丁寧に。', apps: '/apps/ja/', about: '/about/ja/', blog: '/blog/ja/' },
  { home: '/zh-hans/', segment: 'zh-hans/', title: '小工具，用心做。', apps: '/apps/zh-hans/', about: '/about/zh-hans/', blog: '/blog/zh-hans/' },
  { home: '/zh-hant/', segment: 'zh-hant/', title: '小工具，用心做。', apps: '/apps/zh-hant/', about: '/about/zh-hant/', blog: '/blog/zh-hant/' },
  { home: '/pt-br/', segment: 'pt-br/', title: 'Ferramentas pequenas. Feitas com cuidado.', apps: '/apps/pt-br/', about: '/about/pt-br/', blog: '/blog/pt-br/' },
  { home: '/de/', segment: 'de/', title: 'Kleine Werkzeuge. Mit Sorgfalt gemacht.', apps: '/apps/de/', about: '/about/de/', blog: '/blog/de/' },
  { home: '/fr/', segment: 'fr/', title: 'De petits outils, conçus avec soin.', apps: '/apps/fr/', about: '/about/fr/', blog: '/blog/fr/' },
  { home: '/es/', segment: 'es/', title: 'Herramientas pequeñas, hechas con cuidado.', apps: '/apps/es/', about: '/about/es/', blog: '/blog/es/' }
] as const;

test('premium home keeps the existing product ecosystem and localizes all nine home routes', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.home);
    await expect(page.locator('h1')).toContainText(route.title);
    await expect(page.locator('.brand-lockup .brand-symbol')).toBeVisible();
    await expect(page.locator('.brand-lockup span')).toHaveText('ONNELLAB');
    await expect(page.locator('.nav-links a')).toHaveCount(3);
    await expect(page.locator(`.nav-links a[href="${route.apps}"]`)).toHaveCount(1);
    await expect(page.locator(`.nav-links a[href="${route.about}"]`)).toHaveCount(1);
    await expect(page.locator(`.nav-links a[href="${route.blog}"]`)).toHaveCount(1);
    await expect(page.locator('.locale-menu summary')).toHaveCount(1);
    await expect(page.locator('a.featured')).toHaveAttribute('href', `/apps/tagweaver/${route.segment}`);
    await expect(page.locator('.product-card h3')).toHaveText(['Quivra', 'Melivra', 'Papira']);
    await expect(page.locator('.trust-count')).toHaveText('8');
    await expect(page.locator('.workflow-card')).toHaveCount(2);
    await expect(page.locator('.update-row')).toHaveCount(3);
    await expect(page.locator('.home-hero .primary-link')).toHaveAttribute('href', route.apps);
    await expect(page.locator('main')).not.toContainText('여름 소리 만들기');
    await expect(page.locator('main')).not.toContainText('가상 고객 사례');
  }
});

test('the logo is cropped from the existing favicon without replacing it', async ({ page, request }) => {
  const symbol = await request.get('/brand/onnellab-symbol.svg');
  const favicon = await request.get('/favicon.svg');
  expect(symbol.ok()).toBe(true);
  expect(favicon.ok()).toBe(true);
  expect(await symbol.text()).toContain('viewBox="196 273 900 673"');
  expect(await favicon.text()).toContain('viewBox="0 0 1254 1254"');

  await page.goto('/');
  const logo = page.locator('.brand-symbol');
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test('the home shows real localized app screenshots and valid product links', async ({ page, request }) => {
  await page.goto('/ko/');
  const sources = await page.locator('.hero-stage img, .featured-screen img, .product-screen img')
    .evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).getAttribute('src')));
  expect(sources).toHaveLength(7);
  for (const src of sources) {
    expect(src).toContain('/app-assets/');
    expect(src).toContain('/screenshots/ko/');
    const response = await request.get(src!);
    expect(response.status(), src!).toBe(200);
  }
  const icon = page.locator('.product-identity img');
  await expect(icon).toHaveAttribute('src', '/home-assets/app-icons/tagweaver-96.webp');
  await expect(icon).toHaveAttribute('srcset', /tagweaver-192.webp/);
  await expect(page.locator('.featured .text-arrow')).toContainText('TagWeaver');
});

test('mobile navigation, first viewport, and nine-language layout remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route.home);
    const nav = page.locator('.top-nav');
    await expect(nav.locator('.brand-lockup')).toBeVisible();
    await expect(nav.locator('.mobile-menu summary')).toBeVisible();
    await expect(nav.locator('.locale-menu summary')).toBeVisible();
    await nav.locator('.mobile-menu summary').click();
    await expect(nav.locator(`.mobile-menu-panel a[href="${route.about}"]`)).toBeVisible();
    await nav.locator('.mobile-menu summary').click();
    const stage = await page.locator('.stage-main').boundingBox();
    expect(stage, route.home).not.toBeNull();
    expect(stage!.y, route.home).toBeLessThan(844);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route.home).toBeLessThanOrEqual(1);
  }
});

test('home remains free of horizontal overflow at small mobile widths', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const home of ['/ko/', '/ja/', '/zh-hans/', '/zh-hant/', '/pt-br/', '/de/', '/fr/', '/es/']) {
    await page.goto(home);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, home).toBeLessThanOrEqual(1);
  }
});

test('workflow icons load when the section enters the viewport', async ({ page }) => {
  await page.goto('/ko/');
  const workflowIcons = page.locator('.workflow-icons img');
  await expect(workflowIcons).toHaveCount(4);
  for (const image of await workflowIcons.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(async () => image.evaluate((element) =>
      (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0
    )).toBe(true);
  }
});
