import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const appsDir = path.resolve(process.cwd(), 'src/content/apps');
const apps = [
  ...fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name),
  'papira'
].sort();
const locales = [
  { code: 'en', segment: '' },
  { code: 'ko', segment: 'ko' },
  { code: 'ja', segment: 'ja' },
  { code: 'zh-Hans', segment: 'zh-hans' },
  { code: 'zh-Hant', segment: 'zh-hant' },
  { code: 'pt-BR', segment: 'pt-br' },
  { code: 'de', segment: 'de' },
  { code: 'fr', segment: 'fr' },
  { code: 'es', segment: 'es' }
] as const;

const canonical = (route: string) => `https://onnellab.github.io${route}`;
const routeFor = (app: string, segment: string) =>
  segment ? `/apps/${app}/${segment}/` : `/apps/${app}/`;

async function schemas(page: import('@playwright/test').Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.flatMap((script) => {
      const parsed = JSON.parse(script.textContent ?? 'null');
      return Array.isArray(parsed) ? parsed : [parsed];
    })
  );
}

for (const app of apps) {
  test(`${app} uses one nine-language product contract`, async ({ page }) => {
    for (const locale of locales) {
      const route = routeFor(app, locale.segment);
      await page.goto(route);

      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('main[data-product-slug]')).toHaveAttribute('data-product-slug', app);
      await expect(page.locator('main[data-product-locale]')).toHaveAttribute('data-product-locale', locale.code);
      await expect(page.locator('h1#product-title')).toHaveCount(1);
      await expect(page.locator('.hero')).toHaveCount(1);
      await expect(page.locator('.content-band')).toHaveCount(1);
      await expect(page.locator('.faq-band')).toHaveCount(1);
      await expect(page.locator('.download-band')).toHaveCount(1);
      await expect(page.locator('.site-footer')).toHaveCount(1);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(route));

      const allSchemas = await schemas(page);
      const software = allSchemas.find((entry) => entry?.['@type'] === 'SoftwareApplication');
      const breadcrumb = allSchemas.find((entry) => entry?.['@type'] === 'BreadcrumbList');
      const faq = allSchemas.find((entry) => entry?.['@type'] === 'FAQPage');

      expect(software).toBeTruthy();
      expect(breadcrumb).toBeTruthy();
      expect(faq).toBeTruthy();
      expect(software.url).toBe(canonical(route));
      expect(software.mainEntityOfPage).toBe(canonical(route));
      expect(software.publisher?.name).toBe('ONNELLAB');
      expect(software.featureList?.length ?? 0).toBeGreaterThan(0);
      expect(software).not.toHaveProperty('offers');
      expect(software).not.toHaveProperty('aggregateRating');
      expect(software).not.toHaveProperty('review');
      expect(software).not.toHaveProperty('isAccessibleForFree');
      expect(faq.mainEntity?.length ?? 0).toBeGreaterThanOrEqual(3);

      const screenshots = page.locator('.screenshot-row img');
      const screenshotCount = await screenshots.count();
      for (let index = 0; index < screenshotCount; index += 1) {
        const image = screenshots.nth(index);
        await expect(image).toHaveAttribute('alt', /\S+/);
        await expect(image).toHaveAttribute('width', /\d+/);
        await expect(image).toHaveAttribute('height', /\d+/);
      }
    }
  });
}

test('product sources permanently exclude price, rating, and review commerce metadata', () => {
  for (const app of fs.readdirSync(appsDir)) {
    const appMeta = path.join(appsDir, app, 'app.md');
    if (!fs.existsSync(appMeta)) continue;
    const source = fs.readFileSync(appMeta, 'utf8');
    expect(source).not.toMatch(/^(?:pricing|price|priceCurrency)\s*:/m);
  }

  const productsSource = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/products.ts'), 'utf8');
  const templateSource = fs.readFileSync(path.resolve(process.cwd(), 'src/components/ProductTemplate.astro'), 'utf8');
  const routeSource = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/apps/[app]/[locale].astro'), 'utf8');

  expect(productsSource).not.toMatch(/\bpricing\??\s*:/);
  expect(productsSource).not.toMatch(/\bpriceCurrency\??\s*:/);
  expect(productsSource).not.toMatch(/\bprice\??\s*:/);
  expect(templateSource).not.toMatch(/\boffers\s*:/);
  expect(templateSource).not.toMatch(/\baggregateRating\s*:/);
  expect(templateSource).not.toMatch(/\breview\s*:/);
  expect(templateSource).not.toMatch(/\bisAccessibleForFree\s*:/);
  expect(routeSource).not.toContain('ExtendedProductPage');
  expect(fs.existsSync(path.resolve(process.cwd(), 'src/components/ExtendedProductPage.astro'))).toBe(false);
});
