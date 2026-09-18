import { expect, test } from '@playwright/test';
import { getProductPageData, getProductSources } from '../src/lib/products';
import { getPapiraProductPageData } from '../src/lib/papira';
import { getPapiraDescription, getPapiraSeoDescription } from '../src/lib/papira-description';
import { getExtendedProductCopy } from '../src/lib/extended-product-localizations';
import { allSiteLocales } from '../src/lib/extended-site-i18n';

const apps = [...getProductSources().map(source => source.slug), 'papira'];
const dataFor = (app: string, locale: typeof allSiteLocales[number]) =>
  app === 'papira' ? getPapiraProductPageData(locale) : getProductPageData(app, locale);

for (const locale of allSiteLocales) {
  test(`${locale}: every product has an authored, unique web summary`, () => {
    const descriptions = apps.map(app => {
      const data = dataFor(app, locale);
      const authored = data.copy.android.seoDescription ?? data.copy.ios.seoDescription;
      expect(authored, `${app}/${locale}: provide a reviewed web summary`).toBeTruthy();
      expect(data.seoDescription).toBe(authored);
      expect(data.seoDescription.toLowerCase()).toContain(app);
      expect(data.seoDescription).not.toMatch(/Platforms:|지원 플랫폼:|対応プラットフォーム:|支持平台：|支援平台：|Plataformas:|Plattformen:|Plateformes\s*:/u);
      expect(data.seoDescription).not.toMatch(/\n|<[^>]+>|\.\.\.|…/u);
      expect(data.seoDescription).not.toContain('in seconds');
      return data.seoDescription;
    });
    expect(new Set(descriptions).size).toBe(apps.length);
  });
}

test('ClipNest summaries retain clipboard saving, pinning and keyboard reuse', () => {
  const en = dataFor('clipnest', 'en').seoDescription;
  expect(en).toMatch(/copied text.*keyboard opens.*pin.*paste/i);
  const ko = dataFor('clipnest', 'ko').seoDescription;
  for (const term of ['키보드', '저장', '고정', '붙여넣']) expect(ko).toContain(term);
});

test('Papira extended copy and metadata no longer read a stale duplicate body', () => {
  for (const locale of ['pt-BR', 'de', 'fr', 'es'] as const) {
    expect(getExtendedProductCopy('papira', locale).body).toBe(getPapiraDescription(locale));
    expect(getPapiraProductPageData(locale).seoDescription).toBe(getPapiraSeoDescription(locale));
    expect(getPapiraProductPageData(locale).seoDescription).not.toMatch(/romans personnels|novelas personales/u);
  }
});
