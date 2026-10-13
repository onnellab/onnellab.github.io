import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'];
const expected = [
  { slug: 'tagweaver', color: 'rgb(128, 96, 22)', accent: '#6a5a2e' },
  { slug: 'melivra', color: 'rgb(152, 72, 69)', accent: '#6a5148' },
  { slug: 'papira', color: 'rgb(56, 91, 120)', accent: '#385b78' }
];

test('all nine localized heroes distinguish gold, peach and blue product titles', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of locales) {
    await page.goto('/' + locale);
    const slides = page.locator('.hero-carousel [data-hero-slide]');
    await expect(slides).toHaveCount(3);
    for (const product of expected) {
      const element = page.locator('.hero-carousel [data-hero-product="' + product.slug + '"]');
      await expect(element).toHaveCount(1);
      await expect(element.locator('.hero-slide-identity strong')).toHaveCSS('color', product.color);
      expect(await element.evaluate((node) => node.style.getPropertyValue('--accent-text').trim()))
        .toBe(product.accent);
    }

    const colors = await page.locator('.hero-carousel [data-hero-product]').evaluateAll((nodes) => {
      const surface = getComputedStyle(document.querySelector('.homepage')!).backgroundColor;
      const channels = (color: string) => (color.match(/[\d.]+/g) || []).slice(0, 3)
        .map(Number)
        .map((v) => {
          const c = v / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
      const luminance = (color: string) => {
        const [r, g, b] = channels(color);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      return nodes.map((node) => {
        const label = node.querySelector('.hero-slide-identity strong')!;
        const ink = getComputedStyle(label).color;
        const a = luminance(ink), b = luminance(surface);
        const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        return { ink, contrast };
      });
    });

    expect(new Set(colors.map(({ ink }) => ink)).size, locale || 'en').toBe(3);
    colors.forEach(({ contrast }) => expect(contrast, locale || 'en').toBeGreaterThanOrEqual(4.5));
    expect(await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    )).toBeLessThanOrEqual(1);
  }
});

test('headline colors follow the product through card navigation', async ({ page }) => {
  await page.goto('/ko/');
  for (const [index, product] of expected.entries()) {
    await page.locator('[data-hero-dot][data-index="' + index + '"]').click();
    await expect(page.locator('[data-hero-slot="active"] [data-hero-product]'))
      .toHaveAttribute('data-hero-product', product.slug);
    await expect(page.locator('[data-hero-slot="active"] .hero-slide-identity strong'))
      .toHaveCSS('color', product.color);
    await expect(page.locator('[data-hero-dot][data-index="' + index + '"]'))
      .toHaveAttribute('aria-current', 'true');
  }
});
