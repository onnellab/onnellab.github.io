export const siteLocales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant'] as const;

export type SiteLocale = (typeof siteLocales)[number];
export const papiraPrivacyLocales = [
  ...siteLocales,
  'pt-BR',
  'de',
  'fr',
  'es'
] as const;
export type PapiraPrivacyLocale = (typeof papiraPrivacyLocales)[number];
export type LocalizedPage = 'home' | 'apps' | 'about' | 'privacy' | 'terms' | 'papira' | 'papiraPrivacy';

export type LocaleDefinition = {
  code: string;
  pathSegment: string;
  label: string;
  htmlLang: string;
  hreflang: string;
};

export const localeDefinitions: Record<SiteLocale, LocaleDefinition> = {
  en: {
    code: 'en',
    pathSegment: '',
    label: 'English',
    htmlLang: 'en',
    hreflang: 'en'
  },
  ko: {
    code: 'ko',
    pathSegment: 'ko',
    label: '한국어',
    htmlLang: 'ko',
    hreflang: 'ko'
  },
  ja: {
    code: 'ja',
    pathSegment: 'ja',
    label: '日本語',
    htmlLang: 'ja',
    hreflang: 'ja'
  },
  'zh-Hans': {
    code: 'zh-Hans',
    pathSegment: 'zh-hans',
    label: '简体中文',
    htmlLang: 'zh-Hans',
    hreflang: 'zh-Hans'
  },
  'zh-Hant': {
    code: 'zh-Hant',
    pathSegment: 'zh-hant',
    label: '繁體中文',
    htmlLang: 'zh-Hant',
    hreflang: 'zh-Hant'
  }
};

export const papiraPrivacyLocaleDefinitions: Record<PapiraPrivacyLocale, LocaleDefinition> = {
  ...localeDefinitions,
  'pt-BR': { code: 'pt-BR', pathSegment: 'pt-br', label: 'Português (Brasil)', htmlLang: 'pt-BR', hreflang: 'pt-BR' },
  de: { code: 'de', pathSegment: 'de', label: 'Deutsch', htmlLang: 'de', hreflang: 'de' },
  fr: { code: 'fr', pathSegment: 'fr', label: 'Français', htmlLang: 'fr', hreflang: 'fr' },
  es: { code: 'es', pathSegment: 'es', label: 'Español', htmlLang: 'es', hreflang: 'es' }
};

const basePaths: Record<LocalizedPage, string> = {
  home: '/',
  apps: '/apps/',
  about: '/about/',
  privacy: '/privacy/',
  terms: '/terms/',
  papira: '/apps/papira/',
  papiraPrivacy: '/privacy/papira/'
};

export function routeFor(page: LocalizedPage, locale: SiteLocale): string {
  const basePath = basePaths[page];
  const segment = localeDefinitions[locale].pathSegment;
  if (!segment) return basePath;
  if (page === 'home') return `/${segment}/`;
  return `${basePath}${segment}/`;
}

export function papiraPrivacyRouteFor(locale: PapiraPrivacyLocale): string {
  const segment = papiraPrivacyLocaleDefinitions[locale].pathSegment;
  return segment ? `${basePaths.papiraPrivacy}${segment}/` : basePaths.papiraPrivacy;
}

export function localeAlternates(
  page: LocalizedPage,
  supported: readonly SiteLocale[] = siteLocales
): Array<{ lang: string; path: string }> {
  const alternates = supported.map((locale) => ({
    lang: localeDefinitions[locale].hreflang,
    path: routeFor(page, locale)
  }));
  if (supported.includes('en')) {
    alternates.push({ lang: 'x-default', path: routeFor(page, 'en') });
  }
  return alternates;
}

export function papiraPrivacyLocaleAlternates(): Array<{ lang: string; path: string }> {
  return [
    ...papiraPrivacyLocales.map((locale) => ({
      lang: papiraPrivacyLocaleDefinitions[locale].hreflang,
      path: papiraPrivacyRouteFor(locale)
    })),
    { lang: 'x-default', path: papiraPrivacyRouteFor('en') }
  ];
}

export function productRouteFor(slug: string, locale: SiteLocale): string {
  const segment = localeDefinitions[locale].pathSegment;
  return segment ? `/apps/${slug}/${segment}/` : `/apps/${slug}/`;
}

export function productLocaleAlternates(slug: string) {
  return [
    ...siteLocales.map((locale) => ({
      lang: localeDefinitions[locale].hreflang,
      path: productRouteFor(slug, locale)
    })),
    { lang: 'x-default', path: productRouteFor(slug, 'en') }
  ];
}

export function contentLocale(locale: SiteLocale): SiteLocale {
  return locale;
}

export function localeFromPathSegment(segment: string | undefined): SiteLocale {
  if (!segment) return 'en';
  const match = siteLocales.find((locale) => localeDefinitions[locale].pathSegment === segment.toLowerCase());
  return match ?? 'en';
}

export function isSiteLocale(value: string): value is SiteLocale {
  return (siteLocales as readonly string[]).includes(value);
}
