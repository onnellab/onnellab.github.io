import { expect, test } from '@playwright/test';

const expectedAccents: Record<string, [string, string, string]> = {
  aligna: ['#bcd3c5', '#edf5ef', '#436253'],
  clipnest: ['#e6cbd2', '#fbf1f3', '#754f5d'],
  lunary: ['#ced3eb', '#f2f3fb', '#566387'],
  meriq: ['#dfd0b8', '#f7f2e8', '#6a5a42'],
  segra: ['#bed7d9', '#edf7f7', '#42656b'],
  vaultxt: ['#cbd9bb', '#f3f7eb', '#526244'],
  tagweaver: ['#ded2b5', '#fbf7ec', '#6a5a2e'],
  quivra: ['#d7cfdb', '#f4eff5', '#614f68'],
  melivra: ['#f1c8bb', '#fbf2ed', '#6a5148'],
  papira: ['#c2d5e9', '#edf5fd', '#385b78']
};
const props = ['--accent-border', '--accent-bg', '--accent-text'];

test('ten distinct app card colors keep the four homepage signatures unchanged', async ({ page }) => {
  for (const locale of ['', 'ko/']) {
    await page.goto('/apps/' + locale);
    const cards = await page.locator('[data-app-row]').evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return {
          slug: (element.getAttribute('href') ?? '').split('/')[2],
          colors: ['--accent-border', '--accent-bg', '--accent-text'].map((property) => style.getPropertyValue(property).trim())
        };
      })
    );
    expect(cards).toHaveLength(10);
    expect(new Set(cards.map((card) => card.colors[1])).size).toBe(10);
    for (const card of cards) {
      expect(card.colors, card.slug).toEqual(expectedAccents[card.slug]);
    }
    // The same token source drives product detail pages, not a second hardcoded palette.
    for (const slug of Object.keys(expectedAccents)) {
      await page.goto('/apps/' + slug + '/' + locale);
      const colors = await page.locator('main[data-product-slug]').evaluate((element) => {
        const style = getComputedStyle(element);
        return ['--accent-border', '--accent-bg', '--accent-text'].map((property) => style.getPropertyValue(property).trim());
      });
      expect(colors, slug).toEqual(expectedAccents[slug]);
    }
  }
});

test('the trust ordinals align with their titles in the responsive layout', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ko/');
    await expect(page.locator('.trust-ordinal')).toHaveText(['01', '02', '03']);
    await expect(page.locator('.trust-count')).toHaveCount(0);
    const measurements = await page.locator('.trust-item').evaluateAll((items) => items.map((item) => {
      const number = item.querySelector('.trust-ordinal')!.getBoundingClientRect();
      const heading = item.querySelector('h3')!.getBoundingClientRect();
      return {
        numberY: Math.round(number.top),
        numberX: Math.round(number.left),
        headingY: Math.round(heading.top),
        beside: number.right < heading.left
      };
    }));
    expect(measurements).toHaveLength(3);
    if (width <= 650) {
      expect(measurements.every((item) => item.beside)).toBe(true);
      expect(measurements.every((item) => Math.abs(item.numberY - item.headingY) <= 2)).toBe(true);
      expect(measurements[0].numberX).toBe(measurements[1].numberX);
      expect(measurements[1].numberX).toBe(measurements[2].numberX);
    } else {
      expect(new Set(measurements.map((item) => item.numberY)).size).toBe(1);
    }
    await expect(page.locator('.trust-item h3')).toHaveCount(3);
  }
});
