import { expect, test } from '@playwright/test';
import { getProductPageData, getProductSources, pageBodyDescription, renderBlocks } from '../src/lib/products';
import { getPapiraProductPageData } from '../src/lib/papira';
import { allSiteLocales } from '../src/lib/extended-site-i18n';
import { productPresentationLabels, validateProductPresentation } from '../src/lib/product-presentation';

const featureCounts = { aligna: 7, clipnest: 6, melivra: 7, meriq: 8, papira: 7, quivra: 6, segra: 5, tagweaver: 7, vaultxt: 8 };
const dataFor = (app: string, locale: typeof allSiteLocales[number]) =>
  app === 'papira' ? getPapiraProductPageData(locale) : getProductPageData(app, locale);

// Do not let a newly added product silently escape this regression suite.
test('all active products are covered by the presentation contract', () => {
  expect([...getProductSources().map(source => source.slug), 'papira'].sort()).toEqual(Object.keys(featureCounts).sort());
  for (const app of ['melivra', 'papira']) {
    expect(dataFor(app, 'en').meta.status).toBe('Preparing for release');
  }
});

for (const [app, count] of Object.entries(featureCounts)) {
  test(`${app} keeps one presentation structure in every locale`, async ({ page }) => {
    for (const locale of allSiteLocales) {
      const data = dataFor(app, locale);
      const blocks = renderBlocks(pageBodyDescription(data.copy));
      const faq = data.copy.android.faq ?? data.copy.ios.faq;
      expect(() => validateProductPresentation(app, locale, blocks, faq)).not.toThrow();
      const features = blocks.find(block => block.type === 'ul')!.value as string[];
      expect(features).toHaveLength(count);
      await page.goto(data.canonicalPath);
      const copy = page.locator('.copy-column');
      await expect(copy.locator('h2')).toHaveText(productPresentationLabels[locale].features);
      await expect(copy.locator('h3, ol')).toHaveCount(0);
      await expect(copy.locator('ul')).toHaveCount(1);
      await expect(copy.locator('ul > li')).toHaveText(features);
      await expect(copy.locator('h2')).not.toContainText('Pro');
      await expect(page.locator('#faq-title')).toHaveText(productPresentationLabels[locale].faq);
      await expect(page.locator('.faq-band details')).toHaveCount(4);
      await expect(page.locator('.faq-band summary')).toHaveText(faq!.items.map(item => item.question));
      await expect(page.locator('.faq-band details > p')).toHaveText(faq!.items.map(item => item.answer));
      await expect(page.locator('.faq-band details[open]')).toHaveCount(0);
      await page.locator('.faq-band summary').first().click();
      await expect(page.locator('.faq-band details').first()).toHaveAttribute('open', '');
      const software = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts =>
        scripts.flatMap(script => JSON.parse(script.textContent ?? 'null')).find(item => item?.['@type'] === 'SoftwareApplication')
      );
      expect(software.featureList).toEqual(features);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://onnellab.github.io${data.canonicalPath}`);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    }
  });
}

test('presentation validator rejects missing lists, duplicate questions, and Pro catalogues', () => {
  const data = dataFor('melivra', 'en');
  const blocks = renderBlocks(pageBodyDescription(data.copy));
  const faq = data.copy.android.faq!;
  expect(() => validateProductPresentation('fixture', 'en', blocks.filter(block => block.type !== 'ul'), faq)).toThrow(/feature list/);
  expect(() => validateProductPresentation('fixture', 'en', blocks, { ...faq, items: faq.items.slice(0, 3) })).toThrow(/four/);
  expect(() => validateProductPresentation('fixture', 'en', blocks, { ...faq, items: [faq.items[0], faq.items[0], faq.items[2], faq.items[3]] })).toThrow(/distinct/);
  expect(() => validateProductPresentation('fixture', 'en', [...blocks, { type: 'h2', value: 'Pro' }], faq)).toThrow(/Pro catalogue/);
  const empty = { ...faq, items: faq.items.map((item, index) => index === 0 ? { ...item, answer: '' } : item) };
  expect(() => validateProductPresentation('fixture', 'en', blocks, empty)).toThrow(/complete answer/);
});
