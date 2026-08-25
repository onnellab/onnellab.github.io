import { papiraPrivacyLocaleDefinitions, routeFor, type LocalizedPage, type PapiraPrivacyLocale } from './site-i18n';

export const extendedSiteLocales = ['pt-BR', 'de', 'fr', 'es'] as const;
export type ExtendedSiteLocale = (typeof extendedSiteLocales)[number];
export type AllSiteLocale = PapiraPrivacyLocale;

export const allSiteLocales = [
  'en',
  'ko',
  'ja',
  'zh-Hans',
  'zh-Hant',
  ...extendedSiteLocales
] as const satisfies readonly AllSiteLocale[];

export const allLocaleDefinitions = papiraPrivacyLocaleDefinitions;

export function allRouteFor(page: LocalizedPage, locale: AllSiteLocale): string {
  if (locale === 'en' || locale === 'ko' || locale === 'ja' || locale === 'zh-Hans' || locale === 'zh-Hant') {
    return routeFor(page, locale);
  }
  const segment = allLocaleDefinitions[locale].pathSegment;
  const base = {
    home: '/',
    apps: '/apps/',
    about: '/about/',
    privacy: '/privacy/',
    terms: '/terms/',
    papira: '/apps/papira/',
    papiraPrivacy: '/privacy/papira/'
  }[page];
  return page === 'home' ? `/${segment}/` : `${base}${segment}/`;
}

export function allProductRouteFor(slug: string, locale: AllSiteLocale): string {
  const segment = allLocaleDefinitions[locale].pathSegment;
  return segment ? `/apps/${slug}/${segment}/` : `/apps/${slug}/`;
}

export function allAppPrivacyRouteFor(slug: string, locale: AllSiteLocale): string {
  const segment = allLocaleDefinitions[locale].pathSegment;
  return segment ? `/privacy/${slug}/${segment}/` : `/privacy/${slug}/`;
}

export function allLocaleAlternates(page: LocalizedPage) {
  return [
    ...allSiteLocales.map((locale) => ({ lang: allLocaleDefinitions[locale].hreflang, path: allRouteFor(page, locale) })),
    { lang: 'x-default', path: allRouteFor(page, 'en') }
  ];
}

export function allProductLocaleAlternates(slug: string) {
  return [
    ...allSiteLocales.map((locale) => ({ lang: allLocaleDefinitions[locale].hreflang, path: allProductRouteFor(slug, locale) })),
    { lang: 'x-default', path: allProductRouteFor(slug, 'en') }
  ];
}

export function isExtendedSiteLocale(value: string): value is ExtendedSiteLocale {
  return (extendedSiteLocales as readonly string[]).includes(value);
}
