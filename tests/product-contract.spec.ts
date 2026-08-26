import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const appsDir = path.resolve(process.cwd(), 'src/content/apps');
// Discover product directories so every future app automatically inherits the nine-language contract.
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
const metaPlatformMarkers = {
  en: 'Platforms:',
  ko: '지원 플랫폼:',
  ja: '対応プラットフォーム:',
  'zh-Hans': '支持平台：',
  'zh-Hant': '支援平台：',
  'pt-BR': 'Plataformas:',
  de: 'Plattformen:',
  fr: 'Plateformes\u00A0:',
  es: 'Plataformas:'
} as const;

// Keep schema descriptive and verifiable: no commerce/review claims, only real application semantics.
const schemaClassifications: Record<string, { applicationCategory: string; applicationSubCategory: string }> = {
  aligna: { applicationCategory: 'UtilitiesApplication', applicationSubCategory: 'File Renaming Utility' },
  clipnest: { applicationCategory: 'UtilitiesApplication', applicationSubCategory: 'Clipboard Utility' },
  melivra: { applicationCategory: 'MultimediaApplication', applicationSubCategory: 'Offline Music Player' },
  meriq: { applicationCategory: 'DesignApplication', applicationSubCategory: 'Merchandise Production Tool' },
  papira: { applicationCategory: 'DesignApplication', applicationSubCategory: 'EPUB Authoring Tool' },
  quivra: { applicationCategory: 'MultimediaApplication', applicationSubCategory: 'Media Conversion Utility' },
  segra: { applicationCategory: 'MultimediaApplication', applicationSubCategory: 'Audio Editing Utility' },
  tagweaver: { applicationCategory: 'MultimediaApplication', applicationSubCategory: 'Audio Metadata Editor' },
  vaultxt: { applicationCategory: 'UtilitiesApplication', applicationSubCategory: 'Large Text File Editor' }
};

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
    if (locale.code === 'pt-BR') {
      await expect(page.locator('.download-band')).toHaveAttribute('aria-label', 'Baixar');
      await expect(page.locator('.download-band > .eyebrow')).toHaveText('Baixar');
    }
    if (locale.code === 'de') {
      const storeActions = page.locator('.download-band .actions.compact');
      if (await storeActions.count()) {
        await expect(storeActions).toHaveAttribute('aria-label', 'App-Stores');
      }
    }
    await expect(page.locator('.site-footer')).toHaveCount(1);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(route));
      await expect(page.locator('link[rel="describedby"]')).toHaveAttribute('href', 'https://onnellab.github.io/llms.txt');

      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      if (app !== 'papira') {
        expect(metaDescription).toContain(' — ');
        expect(metaDescription).toContain(metaPlatformMarkers[locale.code]);
        if (locale.code === 'ja' || locale.code === 'zh-Hans' || locale.code === 'zh-Hant') {
          expect(metaDescription).not.toMatch(/。[ \t]/u);
        }
        if (locale.code === 'fr') {
          expect(metaDescription).toContain('Plateformes\u00A0:');
          expect(metaDescription).not.toContain('Plateformes :');
        }
      }

      const allSchemas = await schemas(page);
      const software = allSchemas.find((entry) => entry?.['@type'] === 'SoftwareApplication');
      const breadcrumb = allSchemas.find((entry) => entry?.['@type'] === 'BreadcrumbList');
      const faq = allSchemas.find((entry) => entry?.['@type'] === 'FAQPage');

      expect(software).toBeTruthy();
      expect(breadcrumb).toBeTruthy();
      expect(faq).toBeFalsy();
      expect(software.url).toBe(canonical(route));
      expect(software.mainEntityOfPage).toBe(canonical(route));
      expect(software.publisher?.name).toBe('ONNELLAB');
      expect(software.featureList?.length ?? 0).toBeGreaterThan(0);
      expect(schemaClassifications[app]).toBeTruthy();
      expect(software.applicationCategory).toBe(schemaClassifications[app].applicationCategory);
      expect(software.applicationSubCategory).toBe(schemaClassifications[app].applicationSubCategory);
      expect(software).not.toHaveProperty('offers');
      expect(software).not.toHaveProperty('aggregateRating');
      expect(software).not.toHaveProperty('review');
      expect(software).not.toHaveProperty('isAccessibleForFree');
      expect(software).not.toHaveProperty('downloadUrl');
      expect(software).not.toHaveProperty('softwareHelp');
      expect(software).not.toHaveProperty('privacyPolicy');
      expect(await page.locator('.faq-band details').count()).toBeGreaterThanOrEqual(3);

      const screenshots = page.locator('.screenshot-row img');
      const screenshotCount = await screenshots.count();
      for (let index = 0; index < screenshotCount; index += 1) {
        const image = screenshots.nth(index);
        await expect(image).toHaveAttribute('alt', /\S+/);
        await expect(image).toHaveAttribute('width', /\d+/);
        await expect(image).toHaveAttribute('height', /\d+/);
        const alt = (await image.getAttribute('alt') ?? '').trim();
        expect(alt.toLowerCase()).toContain(app.toLowerCase());
        expect(alt).not.toMatch(/\s\d+$/);
      }
    }
  });
}

const papiraExtendedScope = {
  'pt-BR': [/capa/i, /capítulo/i, /sumário/i, /projeto/i],
  de: [/Cover/i, /Kapitel/i, /Inhaltsverzeichnis/i, /Buchprojekt/i],
  fr: [/couverture/i, /chapitr/i, /table des matières/i, /projet/i],
  es: [/portada/i, /capítulo/i, /tabla de contenidos/i, /proyecto/i]
} as const;

test('Papira extended locales preserve the canonical book-project scope', async ({ page }) => {
  for (const locale of locales.filter((item) => item.code in papiraExtendedScope)) {
    await page.goto(routeFor('papira', locale.segment));
    const content = await page.locator('.content-band').innerText();
    for (const term of papiraExtendedScope[locale.code as keyof typeof papiraExtendedScope]) {
      expect(content).toMatch(term);
    }
  }
});

test('AI discovery policy separates search retrieval from training and keeps the nine-language index', async ({ request }) => {
  const robotsResponse = await request.get('/robots.txt');
  expect(robotsResponse.ok()).toBe(true);
  const robots = await robotsResponse.text();
  const sectionFor = (userAgent: string) => {
    const marker = `User-agent: ${userAgent}`;
    const start = robots.indexOf(marker);
    expect(start).toBeGreaterThanOrEqual(0);
    const rest = robots.slice(start + marker.length);
    const next = rest.indexOf('User-agent:');
    return next >= 0 ? rest.slice(0, next) : rest;
  };

  for (const userAgent of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'YouBot', 'Meta-ExternalFetcher']) {
    expect(sectionFor(userAgent)).toContain('Allow: /');
  }
  for (const userAgent of ['GPTBot', 'Google-Extended', 'ClaudeBot', 'Meta-ExternalAgent']) {
    expect(sectionFor(userAgent)).toContain('Disallow: /');
  }

  const sitemapResponse = await request.get('/sitemap.xml');
  expect(sitemapResponse.ok()).toBe(true);
  const sitemap = await sitemapResponse.text();
  expect(sitemap).not.toContain('<lastmod>');

  const llmsResponse = await request.get('/llms.txt');
  expect(llmsResponse.ok()).toBe(true);
  const llms = await llmsResponse.text();
  expect(llms).toMatch(/^# ONNELLAB\n\n> /);
  expect(llms).not.toMatch(/^###\s/m);
  expect(llms).toContain('nine languages');
  expect(llms).toContain('## Apps with nine-language product pages');
  expect(llms).toContain('## Blog Articles');
  expect(llms).toContain('https://onnellab.github.io/apps/papira/es/');
  expect(llms).toContain('https://onnellab.github.io/blog/de/');
  expect(llms).not.toContain('five-language');
  expect(llms).not.toContain('- Pricing:');
  expect(llms).not.toContain('- 가격:');
});

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
  expect(templateSource).not.toMatch(/\bdownloadUrl\s*:/);
  expect(templateSource).not.toMatch(/\bsoftwareHelp\s*:/);
  expect(templateSource).not.toMatch(/\bprivacyPolicy\s*:/);
  expect(templateSource).not.toContain("'@type': 'FAQPage'");
  expect(routeSource).not.toContain('ExtendedProductPage');
  expect(fs.existsSync(path.resolve(process.cwd(), 'src/components/ExtendedProductPage.astro'))).toBe(false);
});
