import { expect, test, type Page } from '@playwright/test';

const stage = '[data-hero-track]';
const center = '[data-hero-slot="active"] .hero-slide';
// The numeric counter and arrow buttons are intentionally not visible.
const activeDot = (index: number) => '[data-hero-dot][data-index="' + index + '"]';
async function clickHeroDotRelative(page: Page, direction: number) {
  const index = Number(await page.locator('[data-hero-dot][aria-current="true"]').getAttribute('data-index'));
  await page.locator(activeDot((index + direction + 3) % 3)).click();
}
const nextDot = (page: Page) => clickHeroDotRelative(page, 1);
const previousDot = (page: Page) => clickHeroDotRelative(page, -1);

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
  await expect(page.locator(activeDot(1))).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-hero-dot][data-index="1"]')).toHaveAttribute('aria-current', 'true');
  await waitSettled(page);
  expect(new URL(page.url()).pathname).toBe('/ko/');

  await dragCurrent(page, 92);
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');
  await waitSettled(page);

  await dragCurrent(page, 95);
  await expect(page.locator(center + ' strong')).toHaveText('Papira');
  await expect(page.locator(activeDot(2))).toHaveAttribute('aria-current', 'true');
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

test('cards move independently toward their destination before mouseup', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  const positions = () => page.locator(stage).evaluate((root) =>
    Array.from(root.querySelectorAll<HTMLElement>('[data-hero-slide]'))
      .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index))
      .map((slide) => {
        const rect = slide.getBoundingClientRect();
        return {
          x: rect.x + rect.width / 2, width: rect.width,
          transform: getComputedStyle(slide).transform,
          opacity: Number(getComputedStyle(slide).opacity)
        };
      })
  );
  const baseline = await positions();
  const rect = await page.locator(center + ' .hero-slide-screen').boundingBox();
  const x = rect!.x + rect!.width / 2;
  const y = rect!.y + rect!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 100, y, { steps: 15 });

  const progress = await positions();
  await expect(page.locator(stage)).toHaveAttribute('data-dragging', 'true');
  // The centered TagWeaver moves left and shrinks while incoming Melivra
  // moves toward the center and grows, even though the pointer is still down.
  expect(progress[0].x).toBeLessThan(baseline[0].x - 18);
  expect(progress[1].x).toBeLessThan(baseline[1].x - 18);
  expect(progress[0].width).toBeLessThan(baseline[0].width);
  expect(progress[1].width).toBeGreaterThan(baseline[1].width);
  const tagMove = progress[0].x - baseline[0].x;
  const melMove = progress[1].x - baseline[1].x;
  expect(Math.abs(tagMove - melMove)).toBeGreaterThan(5);
  expect(progress[2].opacity).toBeLessThan(1);
  // The incoming Melivra caption follows its visible position even before
  // the user lets go. The committed center/dot selection changes only at settle.
  await expect(page.locator(stage)).toHaveAttribute('data-drag-preview', 'next');
  await expect(page.locator('[data-hero-slot="active"] .hero-slide-label')).toBeHidden();
  await expect(page.locator('[data-hero-slot="next"] .hero-slide-label')).toBeVisible();
  await expect(page.locator('[data-hero-slot="next"] .hero-slide-label strong')).toHaveText('Melivra');
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');
  await page.mouse.up();
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await waitSettled(page);
  await expect(page.locator(stage)).not.toHaveAttribute('data-drag-preview', 'next');
  await expect(page.locator('[data-hero-slot="active"] .hero-slide-label')).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/ko/');
});

test('dragging follows the pointer, short drags snap back, and pagination animates', async ({ page }) => {
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
  const midDrag = await page.locator(stage).evaluate((root) => {
    const read = (index: string) => {
      const element = root.querySelector<HTMLElement>('[data-hero-slide][data-index="' + index + '"]')!;
      const style = getComputedStyle(element);
      return { transform: style.transform, opacity: Number(style.opacity) };
    };
    return { tagweaver: read('0'), melivra: read('1'), papira: read('2') };
  });
  // Distinct animated paths (not one shared translate applied to all cards).
  expect(midDrag.tagweaver.transform).not.toBe('none');
  expect(midDrag.melivra.transform).not.toBe(midDrag.tagweaver.transform);
  expect(midDrag.papira.opacity).toBeLessThan(1);
  await page.mouse.up();
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');
  await expect(page.locator(stage)).not.toHaveAttribute('data-dragging', 'true');
  expect(new URL(page.url()).pathname).toBe('/ko/');

  await nextDot(page);
  await expect(page.locator(stage)).toHaveAttribute('data-animating', 'true');
  const inMotion = await page.locator(center).evaluate((slide) =>
    slide.getAnimations().some((animation) => animation.playState === 'running')
  );
  expect(inMotion).toBe(true);
  await waitSettled(page);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');

  await page.locator('[data-hero-dot][data-index="2"]').click();
  await previousDot(page);
  await waitSettled(page);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await expect(page.locator(activeDot(1))).toHaveAttribute('aria-current', 'true');
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

test('nine localized heroes retain the same swipe behavior and selected dot', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/']) {
    await page.goto('/' + locale);
    await dragCurrent(page, -85);
    await expect(page.locator(center + ' strong')).toHaveText('Melivra');
    await expect(page.locator(activeDot(1))).toHaveAttribute('aria-current', 'true');
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

test('drag right previews only the previous card and updates its caption before release', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  const frame = await page.locator(center + ' .hero-slide-screen').boundingBox();
  const x = frame!.x + frame!.width / 2, y = frame!.y + frame!.height / 2;
  const papira = page.locator('[data-hero-slide][data-index="2"]');
  const initial = await papira.boundingBox();

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 105, y, { steps: 12 });
  const moving = await papira.boundingBox();
  expect(moving!.x).toBeGreaterThan(initial!.x + 20);
  expect(moving!.width).toBeGreaterThan(initial!.width);
  await expect(page.locator(stage)).toHaveAttribute('data-drag-preview', 'previous');
  await expect(page.locator('[data-hero-slot="previous"] .hero-slide-label')).toBeVisible();
  await expect(page.locator('[data-hero-slot="previous"] .hero-slide-label strong')).toHaveText('Papira');
  await expect(page.locator('[data-hero-slot="active"] .hero-slide-label')).toBeHidden();
  await page.mouse.up();
  await expect(page.locator(center + ' strong')).toHaveText('Papira');
  await waitSettled(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('dragging back and forth cancels the preview without changing the selected app', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ko/');
  const frame = await page.locator(center + ' .hero-slide-screen').boundingBox();
  const x = frame!.x + frame!.width / 2, y = frame!.y + frame!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 95, y, { steps: 8 });
  await expect(page.locator(stage)).toHaveAttribute('data-drag-preview', 'next');
  await page.mouse.move(x + 95, y, { steps: 12 });
  await expect(page.locator(stage)).toHaveAttribute('data-drag-preview', 'previous');
  await page.mouse.move(x + 2, y, { steps: 10 });
  await expect(page.locator(stage)).not.toHaveAttribute('data-drag-preview', 'next');
  await page.mouse.up();
  await waitSettled(page);
  await expect(page.locator(center + ' strong')).toHaveText('TagWeaver');
  await expect(page.locator(activeDot(0))).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-hero-slot="active"] .hero-slide-label')).toBeVisible();
  await expect(page.locator('[data-hero-slot="next"] .hero-slide-label')).toBeHidden();
  await expect(page.locator('[data-hero-slot="previous"] .hero-slide-label')).toBeHidden();
});

test('clicking a center app immediately after rotation is not swallowed by gesture handling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.goto('/ko/');
    await nextDot(page);
    await expect(page.locator(center + ' strong')).toHaveText('Melivra');
    // Direct pointer clicks stay valid during the deliberate FLIP transition.
    await page.locator(center).click({ force: true });
    await expect(page).toHaveURL(new RegExp('/apps/melivra/ko/$'));
  }
});

test('weighted pointer tracking continues to ease toward the held cursor position', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  const current = page.locator(center);
  const screenshot = await current.locator('.hero-slide-screen').boundingBox();
  const x = screenshot!.x + screenshot!.width / 2;
  const y = screenshot!.y + screenshot!.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 108, y, { steps: 1 });
  // One animation frame after the pointer moves is deliberately *not* the
  // final dragged pose: the card follows with gently damped inertia.
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  const early = await current.boundingBox();
  await page.waitForTimeout(90);
  const later = await current.boundingBox();
  await expect(page.locator(stage)).toHaveAttribute('data-dragging', 'true');
  expect(later!.x, 'card keeps gliding while the mouse is held still').toBeLessThan(early!.x - 5);
  expect(later!.width, 'outgoing card scales gradually').toBeLessThan(early!.width);
  await page.mouse.up();

  await expect(page.locator(stage)).toHaveAttribute('data-animating', 'true');
  const duration = await page.locator(center).evaluate((slide) =>
    slide.getAnimations().map((animation) => animation.effect?.getTiming().duration)
  );
  expect(duration).toContain(555);
  await waitSettled(page);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
  await expect(page.locator(stage)).not.toHaveAttribute('data-dragging', 'true');
});

test('pagination rotation uses a deliberate long ease and hides the wrapping card midway', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  await nextDot(page);
  await expect(page.locator(stage)).toHaveAttribute('data-animating', 'true');
  const timings = await page.locator(center).evaluate((slide) =>
    slide.getAnimations().map((animation) => ({
      duration: animation.effect?.getTiming().duration,
      easing: animation.effect?.getTiming().easing
    }))
  );
  expect(timings.some((t) => t.duration === 625 &&
    t.easing === 'cubic-bezier(0.4, 0.06, 0.24, 1)')).toBe(true);

  // Papira wraps from the previous preview behind the carousel to the next.
  const wrapping = await page.locator('[data-hero-slide][data-index="2"]').evaluate((slide) =>
    slide.getAnimations().flatMap((animation) => {
      const effect = animation.effect as KeyframeEffect | null;
      return effect?.getKeyframes() ?? [];
    })
  );
  // Web Animations serializes numeric opacity as a string in getKeyframes().
  expect(wrapping.some((keyframe) =>
    keyframe.opacity !== undefined && Number(keyframe.opacity) === 0
  )).toBe(true);
  await waitSettled(page);
  await expect(page.locator(center + ' strong')).toHaveText('Melivra');
});
