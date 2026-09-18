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

test('ClipNest web titles name its clipboard role in every language', () => {
  const words = ['Clipboard', '클립보드', 'クリップボード', '剪贴板', '剪貼簿', 'área de transferência', 'Zwischenablage', 'presse-papiers', 'portapapeles'];
  const locales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'] as const;
  for (const [index, locale] of locales.entries()) {
    const data = dataFor('clipnest', locale);
    expect(data.seoTitle).toContain(words[index]);
    expect(data.seoTitle).toBe(data.copy.android.seoTitle ?? data.copy.ios.seoTitle);
    expect(data.meta.title).toBe('ClipNest');
  }
});

test('VaultXT has concise authored web titles without changing its hero or store identity', () => {
  const expected = {
    en: 'VaultXT - Large Text & Log File Editor',
    'pt-BR': 'VaultXT - Editor de arquivos de texto grandes',
    de: 'VaultXT - Editor für große Textdateien',
    fr: 'VaultXT - Éditeur de fichiers texte volumineux',
    es: 'VaultXT - Editor de archivos de texto grandes'
  } as const;
  for (const locale of Object.keys(expected) as Array<keyof typeof expected>) {
    const data = dataFor('vaultxt', locale);
    expect(data.seoTitle).toBe(expected[locale]);
    expect(data.meta.title).toBe('VaultXT');
    expect(data.copy.android.landingSubtitle).not.toBe(expected[locale].slice(10));
  }
});
