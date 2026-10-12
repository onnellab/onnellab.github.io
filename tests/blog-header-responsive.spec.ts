import { expect, test, type Page } from '@playwright/test';

const locales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'];
const labelSelector = '.top-nav > .brand, .top-nav .nav-actions > a';
async function lineCounts(page: Page) {
  return page.locator(labelSelector).evaluateAll(labels => labels.map(label => {
    const range = document.createRange();
    range.selectNodeContents(label);
    const tops = [...range.getClientRects()].map(rect => Math.round(rect.top));
    return { text: label.textContent?.trim(), lines: new Set(tops).size };
  }));
}

for (const locale of locales) for (const width of [320, 390]) {
  test(`blog navigation ${locale} preserves whole labels at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/blog/${locale.toLowerCase()}/reuse-copied-text-snippets-iphone/`);
    await page.evaluate(() => document.fonts.ready);
    const labels = await lineCounts(page);
    expect(labels).toHaveLength(3);
    expect(labels.every(label => label.lines === 1), JSON.stringify(labels)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    const control = page.locator('.blog-locale-menu > summary');
    await expect(control).toBeVisible();
    const boxes = [];
    for (const label of await page.locator(`${labelSelector}, .blog-locale-menu > summary`).all()) {
      const box = await label.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      boxes.push(box!);
    }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const overlap = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
      expect(overlap, `navigation targets ${i}/${j} overlap`).toBe(false);
    }
    await control.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.blog-locale-menu')).toHaveAttribute('open', '');
    await expect(page.locator('.blog-locale-menu a')).toHaveCount(9);
    const menu = await page.locator('.blog-locale-menu ul').boundingBox();
    expect(menu!.x).toBeGreaterThanOrEqual(0);
    expect(menu!.x + menu!.width).toBeLessThanOrEqual(width + 1);
    await page.keyboard.press('Enter');
    await expect(page.locator('.blog-locale-menu')).not.toHaveAttribute('open', '');
  });
}

test('regression detects original PT-BR squeezed-label layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/blog/pt-br/reuse-copied-text-snippets-iphone/');
  await page.evaluate(() => document.fonts.ready);
  expect((await lineCounts(page)).every(label => label.lines === 1)).toBe(true);
  // Restore only the previous computed flex/wrap values; copy and DOM stay exact.
  const previous = await page.addStyleTag({ content: `
    @media (max-width: 640px) {
      .top-nav { flex-wrap: nowrap !important; }
      .top-nav .brand { flex-shrink: 1 !important; white-space: normal !important; }
      .top-nav .nav-actions { flex-shrink: 1 !important; max-width: none !important; flex-wrap: nowrap !important; }
      .top-nav .nav-actions > a { white-space: normal !important; }
    }
  ` });
  const original = await lineCounts(page);
  expect(original.some(label => label.lines > 1), JSON.stringify(original)).toBe(true);
  await previous.evaluate(node => node.remove());
  expect((await lineCounts(page)).every(label => label.lines === 1)).toBe(true);
});
