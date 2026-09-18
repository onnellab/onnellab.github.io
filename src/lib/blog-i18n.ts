import fs from 'node:fs';
import path from 'node:path';

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

export function availableBlogLocales(slug: string): AllSiteLocale[] {
  const root = path.resolve(process.cwd(), 'src/content/blog');
  return allSiteLocales.filter((locale) => fs.existsSync(path.join(root, locale, `${slug}.md`)));
}

export function blogPostAlternates(slug: string) {
  const locales = availableBlogLocales(slug);
  const defaultLocale = locales.includes('en') ? 'en' : locales[0];
  return [
    ...locales.map((locale) => ({
      lang: allLocaleDefinitions[locale].hreflang,
      path: blogPostPathFor(locale, slug)
    })),
    ...(defaultLocale ? [{ lang: 'x-default', path: blogPostPathFor(defaultLocale, slug) }] : [])
  ];
}
