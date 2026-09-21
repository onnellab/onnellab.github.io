import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const pagesDir = path.join(root, 'src/pages');

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

for (const locale of ['en', 'ko'] as const) {
  const suffix = locale === 'ko' ? 'ko/' : '';
  const canonical = `/privacy/segra/${suffix}`;
  test(`Segra ${locale}: preserve the public policy, canonical URL and language links`, async ({ page, request }) => {
    for (const route of [canonical, `/apps/segra/privacy/${suffix}`, `/segra/privacy/${suffix}`]) {
      const relative = `${route.slice(1)}index.html`;
      const source = fs.readFileSync(path.join(publicDir, relative), 'utf8');
      expect(fs.readFileSync(path.join(root, 'dist', relative), 'utf8')).toBe(source);
      const response = await request.get(route);
      expect(response.status()).toBe(200);
      expect(await response.text()).toBe(source);
    }
    await page.goto(canonical);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toContainText('Segra');
    await expect(page.locator('main')).toContainText('2026-07-30');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://onnellab.com${canonical}`);
    const languages = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(nodes =>
      nodes.map(node => node.getAttribute('hreflang')).sort()
    );
    expect(languages).toEqual(['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es', 'x-default'].sort());
    await expect(page.locator('[data-locale-choice]')).toHaveCount(9);
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap.split(`<loc>https://onnellab.com${canonical}</loc>`)).toHaveLength(2);
  });
}
