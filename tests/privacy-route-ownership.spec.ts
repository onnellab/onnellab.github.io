import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';
import {
  allPrivacyAppSlugs,
  getPrivacyPolicyDocument,
  type PolicyDocument
} from '../src/lib/privacy-policy-documents';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const pagesDir = path.join(root, 'src/pages');
const siteUrl = 'https://onnellab.com';
const locales = [
  { code: 'en', suffix: '' }, { code: 'ko', suffix: 'ko/' },
  { code: 'ja', suffix: 'ja/' }, { code: 'zh-Hans', suffix: 'zh-hans/' },
  { code: 'zh-Hant', suffix: 'zh-hant/' }, { code: 'pt-BR', suffix: 'pt-br/' },
  { code: 'de', suffix: 'de/' }, { code: 'fr', suffix: 'fr/' },
  { code: 'es', suffix: 'es/' }
] as const;

// Official canonical HTML immediately before the shared-template migration:
// onnellab.github.io@18ba64c40390c7949ccca52ca454ebb831f439ce.
// Its unchanged bytes remain published at both compatibility aliases.
const originalPolicyBlobs = {
  en: '4ace764afc07b03e382ae6dfbf153d04920338e0',
  ko: '9df1a6b3944c02c45205d668934b2f5204966534'
} as const;

type PolicyElement = { tag: string; text: string };
function policyElements(document: PolicyDocument): PolicyElement[] {
  return document.sections.flatMap(section => [
    { tag: 'H3', text: section.title },
    ...section.blocks.flatMap((block): PolicyElement[] => block.kind === 'paragraph'
      ? [{ tag: 'P', text: block.value }]
      : block.items.map(text => ({ tag: 'LI', text })))
  ]);
}

function staticPages(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('_') || entry.name.includes('[')) return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? staticPages(file) : /\.(astro|md|mdx|html)$/.test(entry.name) ? [file] : [];
  });
}

test('static page routes do not compete with public HTML', () => {
  // This site's build.format is directory. Dynamic routes are checked by the built-page tests.
  const conflicts = staticPages(pagesDir).flatMap(file => {
    const stem = path.relative(pagesDir, file).replace(/\.(astro|md|mdx|html)$/, '');
    const output = stem === 'index' || stem.endsWith(`${path.sep}index`)
      ? `${stem}.html` : path.join(stem, 'index.html');
    return fs.existsSync(path.join(publicDir, output)) ? [output] : [];
  });
  expect(conflicts, 'A URL must have one publishing source; public HTML shadows Astro routes.').toEqual([]);
});

test('dynamic app privacy canonical routes have one Astro publishing source', () => {
  for (const entry of ['privacy/[app]/index.astro', 'privacy/[app]/[locale]/index.astro']) {
    expect(fs.existsSync(path.join(pagesDir, entry)), entry).toBe(true);
  }
  const conflicts = allPrivacyAppSlugs.flatMap(app => locales.flatMap(({ suffix }) => {
    const relative = `privacy/${app}/${suffix}index.html`;
    return fs.existsSync(path.join(publicDir, relative)) ? [relative] : [];
  }));
  expect(conflicts, 'Public HTML must not shadow shared dynamic app privacy routes.').toEqual([]);
});

for (const { code, suffix } of locales) {
  const canonical = `/privacy/segra/${suffix}`;
  test(`Segra ${code}: generated canonical preserves its policy source and nine-language contract`, async ({ page, request }) => {
    // EN/KO use preserved JSON; the other seven use the existing localized copy.
    const policy = getPrivacyPolicyDocument('segra', code);
    const relative = `${canonical.slice(1)}index.html`;
    expect(fs.existsSync(path.join(publicDir, relative))).toBe(false);
    const built = fs.readFileSync(path.join(root, 'dist', relative));
    const response = await request.get(canonical);
    expect(response.status()).toBe(200);
    expect(await response.body()).toEqual(built);

    await page.goto(canonical);
    const main = page.locator('main.privacy-shell');
    await expect(main).toHaveAttribute('data-app-privacy', 'segra');
    await expect(main).toHaveAttribute('data-policy-locale', code);
    await expect(page.locator('html')).toHaveAttribute('lang', code);
    await expect(page).toHaveTitle(policy.title);
    await expect(main.locator('header h1')).toHaveText(policy.title);
    await expect(main.locator('header .intro')).toHaveText(policy.intro);
    expect(policy.updatedAt).toBe('2026-07-30');
    await expect(main.locator('header time')).toHaveAttribute('datetime', policy.updatedAt);
    await expect(main.locator('header time')).toHaveText(policy.updatedAt);
    await expect(main.locator('h2')).toHaveText(policy.heading);
    await expect(main.locator('.opening')).toHaveText(policy.opening);
    await expect(main.locator('section')).toHaveCount(8);
    const displayed = await main.locator('section h3, section p, section li').evaluateAll(nodes =>
      nodes.map(node => ({ tag: node.tagName, text: node.textContent ?? '' }))
    );
    expect(displayed).toEqual(policyElements(policy));

    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', policy.description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${siteUrl}${canonical}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteUrl}${canonical}`);
    const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(nodes =>
      nodes.map(node => ({ lang: node.getAttribute('hreflang'), href: node.getAttribute('href') }))
    );
    expect(alternates).toEqual([
      ...locales.map(locale => ({ lang: locale.code, href: `${siteUrl}/privacy/segra/${locale.suffix}` })),
      { lang: 'x-default', href: `${siteUrl}/privacy/segra/` }
    ]);
    await expect(main.locator('[data-locale-choice]')).toHaveCount(9);
    for (const locale of locales) {
      const link = main.locator(`[data-locale-choice="${locale.code}"]`);
      await expect(link).toHaveAttribute('href', `/privacy/segra/${locale.suffix}`);
      await expect(link).toHaveAttribute('hreflang', locale.code);
    }
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.status()).toBe(200);
    const sitemap = await sitemapResponse.text();
    expect(sitemap.split(`<loc>${siteUrl}${canonical}</loc>`)).toHaveLength(2);
  });
}

for (const locale of ['en', 'ko'] as const) {
  const suffix = locale === 'ko' ? 'ko/' : '';
  const canonical = `/privacy/segra/${suffix}`;
  test(`Segra ${locale}: both static aliases retain official bytes and all 21 canonical legal elements`, async ({ page, request }) => {
    const policy = JSON.parse(fs.readFileSync(
      path.join(root, 'src/content/privacy-policies', locale, 'segra.json'), 'utf8'
    )) as PolicyDocument;
    const expectedElements = policyElements(policy);
    expect(expectedElements).toHaveLength(21);
    for (const route of [`/apps/segra/privacy/${suffix}`, `/segra/privacy/${suffix}`]) {
      const relative = `${route.slice(1)}index.html`;
      const source = fs.readFileSync(path.join(publicDir, relative));
      const blob = createHash('sha1').update(`blob ${source.length}\0`).update(source).digest('hex');
      expect(blob, `${route} must preserve the official pre-migration policy bytes`).toBe(originalPolicyBlobs[locale]);
      expect(fs.readFileSync(path.join(root, 'dist', relative))).toEqual(source);
      const response = await request.get(route);
      expect(response.status()).toBe(200);
      expect(await response.body()).toEqual(source);

      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveText(policy.title);
      await expect(page.locator('main')).toContainText('2026-07-30');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteUrl}${canonical}`);
      const originalElements = await page.locator('main h3, main p, main li').evaluateAll(nodes => {
        const firstSection = nodes.findIndex(node => node.tagName === 'H3');
        return nodes.slice(firstSection).map(node => ({ tag: node.tagName, text: node.textContent ?? '' }));
      });
      expect(originalElements).toHaveLength(21);
      expect(originalElements).toEqual(expectedElements);
      const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(nodes =>
        nodes.map(node => ({ lang: node.getAttribute('hreflang'), href: node.getAttribute('href') }))
      );
      expect(alternates).toEqual([
        { lang: 'en', href: `${siteUrl}/privacy/segra/` },
        { lang: 'ko', href: `${siteUrl}/privacy/segra/ko/` },
        { lang: 'x-default', href: `${siteUrl}/privacy/segra/` }
      ]);
      const languageLink = page.locator('a.language-link');
      await expect(languageLink).toHaveCount(1);
      await expect(languageLink).toHaveText(locale === 'en' ? '한국어' : 'English');
      await expect(languageLink).toHaveAttribute('href', `${siteUrl}/privacy/segra/${locale === 'en' ? 'ko/' : ''}`);

      await page.goto(canonical);
      const canonicalElements = await page.locator('main.privacy-shell section h3, main.privacy-shell section p, main.privacy-shell section li')
        .evaluateAll(nodes => nodes.map(node => ({ tag: node.tagName, text: node.textContent ?? '' })));
      expect(canonicalElements).toEqual(originalElements);
      const sitemap = await (await request.get('/sitemap.xml')).text();
      expect(sitemap).not.toContain(`<loc>${siteUrl}${route}</loc>`);
    }
  });
}
