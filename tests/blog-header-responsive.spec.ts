import { expect, test } from '@playwright/test';

const locales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'];

for (const locale of locales) for (const width of [320, 390]) {
  test('shared blog header ' + locale + ' stays legible at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog/' + locale.toLowerCase() + '/reuse-copied-text-snippets-iphone/');
    await page.evaluate(() => document.fonts.ready);
    const header = page.locator('[data-site-header]');
    await expect(header).toHaveCount(1);
    const brand = header.locator('.brand-lockup');
    const language = header.locator('.locale-menu > summary');
    const mobile = header.locator('.mobile-menu > summary');
    await expect(brand).toBeVisible();
    await expect(language).toBeVisible();
    await expect(mobile).toBeVisible();
    await expect(header.locator('.nav-links')).toBeHidden();
    const elements = [brand, language, mobile];
    const boxes = [];
    for (const item of elements) {
      const bounds = await item.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      boxes.push(bounds!);
    }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const overlap = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 &&
        Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
      expect(overlap, 'Header control ' + i + '/' + j + ' overlaps at ' + width).toBe(false);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    const textLayout = await header.evaluate((node) => {
      const name = node.querySelector('.brand-lockup span')!;
      const lang = node.querySelector('.locale-menu summary')!;
      return {
        brand: name.getBoundingClientRect().height,
        font: Number.parseFloat(getComputedStyle(name).lineHeight) || 19,
        language: getComputedStyle(lang).whiteSpace
      };
    });
    expect(textLayout.brand).toBeLessThan(textLayout.font * 1.5);
    expect(textLayout.language).toBe('nowrap');
    await language.focus();
    await page.keyboard.press('Enter');
    await expect(header.locator('.locale-menu')).toHaveAttribute('open', '');
    const panel = header.locator('.locale-menu-panel');
    await expect(panel.locator('a')).toHaveCount(9);
    const menu = await panel.boundingBox();
    expect(menu!.x).toBeGreaterThanOrEqual(0);
    expect(menu!.x + menu!.width).toBeLessThanOrEqual(width + 1);
    await page.keyboard.press('Enter');
    await expect(header.locator('.locale-menu')).not.toHaveAttribute('open', '');
  });
}

test('Portuguese long labels remain separate from the mobile menu at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/blog/pt-br/reuse-copied-text-snippets-iphone/');
  await expect(page.locator('.brand-lockup')).toHaveText('ONNELLAB');
  await expect(page.locator('.locale-menu .locale-label-short')).toBeVisible();
  await expect(page.locator('.locale-menu .locale-label-short')).toHaveText('PT-BR');
  await expect(page.locator('.locale-menu summary')).toHaveAttribute('aria-label', 'Idioma: Português (Brasil)');
  await page.locator('.mobile-menu summary').click();
  await expect(page.locator('.mobile-menu-panel a')).toHaveCount(3);
  await expect(page.locator('.mobile-menu-panel a[href="/blog/pt-br/"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
