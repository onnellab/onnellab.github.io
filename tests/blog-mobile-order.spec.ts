import { expect, test } from '@playwright/test';

test('blog footer follows articles and mobile does not repeat the category introduction', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/blog/ko/');

    const index = page.locator('.blog-shell');
    await expect(index.locator('.category-preview')).toBeHidden();
    await expect(index.locator('.filter-row')).toBeVisible();
    await expect(index.locator('.post-list .post-card').first()).toBeVisible();

    const order = await index.evaluate((main) => {
      const selectors = ['.blog-header', '.filter-row', '.post-list', '.site-footer'];
      const nodes = selectors.map((selector) => main.querySelector(selector));
      return {
        dom: nodes.map((node) => node ? [...main.children].indexOf(node) : -1),
        top: nodes.map((node) => node?.getBoundingClientRect().top ?? -1),
        bottom: nodes.map((node) => node?.getBoundingClientRect().bottom ?? -1),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });
    expect(order.dom).toEqual([...order.dom].sort((a, b) => a - b));
    expect(order.bottom[0]).toBeLessThanOrEqual(order.top[1] + 1);
    expect(order.bottom[1]).toBeLessThanOrEqual(order.top[2] + 1);
    expect(order.bottom[2]).toBeLessThanOrEqual(order.top[3] + 1);
    expect(order.overflow).toBeLessThanOrEqual(1);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  await expect(page.locator('.category-preview')).toBeVisible();
  const desktop = await page.locator('.blog-shell').evaluate((main) =>
    [...main.children].map((node) => node.className)
  );
  expect(desktop).toEqual(['blog-header', 'category-preview', 'filter-row', 'post-list', 'site-footer']);
});
