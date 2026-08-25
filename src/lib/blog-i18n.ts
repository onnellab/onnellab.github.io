import {
  allLocaleDefinitions,
  allSiteLocales,
  type AllSiteLocale
} from './extended-site-i18n';

export function blogIndexPathFor(locale: AllSiteLocale): string {
  if (locale === 'en') return '/blog/';
  return `/blog/${allLocaleDefinitions[locale].pathSegment}/`;
}

export function blogPostPathFor(locale: AllSiteLocale, slug: string): string {
  if (locale === 'en') return `/blog/en/${slug}/`;
  return `/blog/${allLocaleDefinitions[locale].pathSegment}/${slug}/`;
}

export function blogIndexAlternates() {
  return [
    ...allSiteLocales.map((locale) => ({
      lang: allLocaleDefinitions[locale].hreflang,
      path: blogIndexPathFor(locale)
    })),
    { lang: 'x-default', path: blogIndexPathFor('en') }
  ];
}

export function blogPostAlternates(slug: string) {
  return [
    ...allSiteLocales.map((locale) => ({
      lang: allLocaleDefinitions[locale].hreflang,
      path: blogPostPathFor(locale, slug)
    })),
    { lang: 'x-default', path: blogPostPathFor('en', slug) }
  ];
}
