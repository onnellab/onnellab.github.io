import { expect, test, type Page } from '@playwright/test';

const stage = '[data-hero-track]';
const center = '[data-hero-slot="active"] .hero-slide';
const counter = '[data-hero-counter]';

async function dragCurrent(page: Page, dx: number, dy = 0) {
  const screenshot = page.locator(center + ' .hero-slide-screen');
  const bounds = await screenshot.boundingBox();
  expect(bounds).not.toBeNull();
  const x = bounds!.x + bounds!.width / 2;
  const y = bounds!.y + bounds!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 9 });
  await page.mouse.up();
}

async function waitSettled(page: Page) {
  await expect(page.locator(stage)).not.toHaveAttribute('data-animating', 'true');
}

test('mouse drags rotate both ways, wrap around, and never navigate by mistake', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ko/');
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');

  await dragCurrent(page, -92);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await expect(page.locator(counter)).toHaveText('02 / 03');
  await expect(page.locator('[data-hero-dot][data-index="1"]')).toHaveAttribute('aria-current', 'true');
  await waitSettled(page);
  expect(new URL(page.url()).pathname).toBe('/ko/');

  await dragCurrent(page, 92);
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');
  await waitSettled(page);

  await dragCurrent(page, 95);
  await expect(page.locator(center + ' strong')).toHaveText('Papira');
  await expect(page.locator(counter)).toHaveText('03 / 03');
  await waitSettled(page);

  await dragCurrent(page, -95);
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');
  await waitSettled(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
    .toBeLessThanOrEqual(1);

  // A normal click still opens the real app page.
  await page.locator(center).click();
  await expect(page).toHaveURL(/\/apps\/tagweaver\/ko\/$/);
});

test('dragging follows the pointer, short drags snap back, and arrows animate', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  const screenshot = page.locator(center + ' .hero-slide-screen');
  const bounds = await screenshot.boundingBox();
  const x = bounds!.x + bounds!.width / 2;
  const y = bounds!.y + bounds!.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 28, y, { steps: 6 });
  await expect(page.locator(stage)).toHaveAttribute('data-dragging', 'true');
  const offset = await page.locator(center).evaluate((slide) => getComputedStyle(slide).translate);
  expect(offset).toContain('-28px');
  await page.mouse.up();
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');
  await expect(page.locator(stage)).not.toHaveAttribute('data-dragging', 'true');
  expect(new URL(page.url()).pathname).toBe('/ko/');

  await page.locator('[data-hero-next]').click();
  await expect(page.locator(stage)).toHaveAttribute('data-animating', 'true');
  const inMotion = await page.locator(center).evaluate((slide) =>
    slide.getAnimations().some((animation) => animation.playState === 'running')
  );
  expect(inMotion).toBe(true);
  await waitSettled(page);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');

  await page.locator('[data-hero-dot][data-index="2"]').click();
  await page.locator('[data-hero-previous]').click();
  await waitSettled(page);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await expect(page.locator(counter)).toHaveText('02 / 03');
});

test('reduced motion skips FLIP animation but keeps swipe, buttons, and links functional', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ko/');
  await dragCurrent(page, -85);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await expect(page.locator(stage)).not.toHaveAttribute('data-animating', 'true');
  expect(await page.locator(center).evaluate((slide) => slide.getAnimations().length)).toBe(0);

  await page.locator(stage).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');
  await expect(page.locator(stage)).not.toHaveAttribute('data-animating', 'true');
});

test('touch swiping works and a vertical gesture remains a page scroll', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP touch input is Chromium-specific');
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto('/ko/');
  const rect = await page.locator(center + ' .hero-slide-screen').boundingBox();
  const x = Math.round(rect!.x + rect!.width / 2);
  const y = Math.round(rect!.y + rect!.height / 2);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });

  const send = async (type: 'touchStart' | 'touchMove' | 'touchEnd', px: number, py: number) =>
    cdp.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: type === 'touchEnd' ? [] : [{ x: px, y: py }]
    });

  await send('touchStart', x, y);
  for (let i = 1; i <= 6; i++) await send('touchMove', x - i * 15, y);
  await send('touchEnd', x - 90, y);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await waitSettled(page);

  const initialScroll = await page.evaluate(() => scrollY);
  await send('touchStart', x, y);
  for (let i = 1; i <= 6; i++) await send('touchMove', x + 1, y - i * 17);
  await send('touchEnd', x + 1, y - 102);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialScroll);
  await cdp.detach();
});

test('nine localized heroes retain the same swipe behavior and counter', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/']) {
    await page.goto('/' + locale);
    await dragCurrent(page, -85);
    await expect(page.locator(center + ' strong')).toHaveText('Melivra');
    await expect(page.locator(counter)).toHaveText('02 / 03');
    await waitSettled(page);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, locale || 'en').toBeLessThanOrEqual(1);
  }
});

test('keyboard movement preserves focus on the same product link', async ({ page }) => {
  await page.goto('/ko/');
  const tagLink = page.locator('[data-hero-slide][data-index="0"]');
  await tagLink.focus();
  await expect(tagLink).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await expect(tagLink).toBeFocused();
  await waitSettled(page);
  await expect(tagLink).toHaveAttribute('data-position', 'previous');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/apps\/tagweaver\/ko\/$/);
});
