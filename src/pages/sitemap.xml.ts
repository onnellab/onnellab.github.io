import fs from 'node:fs';
import path from 'node:path';

import { getBlogPosts } from '../lib/blog';
import { getExtendedBlogPosts } from '../lib/extended-blog';
import {
  allAppPrivacyRouteFor,
  allLocaleDefinitions,
  allProductRouteFor,
  allRouteFor,
  allSiteLocales,
  type AllSiteLocale
} from '../lib/extended-site-i18n';
import { privacyAppSlugs, translatedPrivacyLocales } from '../lib/app-privacy-localizations';
import { getProductSources } from '../lib/products';
import { releaseNotes } from '../lib/releaseNotes';
import type { LocalizedPage } from '../lib/site-i18n';

type SitemapEntry = {
  path: string;
  alternates?: Array<{ lang: string; path: string }>;
};

// Deliberately omit per-URL modification dates until they come from authoritative content metadata rather than build-time filesystem mtimes.
const siteUrl = 'https://onnellab.github.io';
const corePages: LocalizedPage[] = ['home', 'apps', 'about', 'privacy', 'terms'];

export function GET() {
  const entries: SitemapEntry[] = [
    ...corePages.flatMap((page) => allLocalizedEntries(page)),
    ...allLocalizedEntries('papira'),
    ...papiraPrivacyEntries(),
    ...productPrivacyEntries(),
    ...blogEntries(),
    ...oauthEntries(),
    ...releaseNoteEntries(),
    ...productEntries()
  ];

  const uniqueEntries = entries.filter(
    (entry, index, all) => all.findIndex((candidate) => candidate.path === entry.path) === index
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${uniqueEntries.map(renderEntry).join('\n')}\n</urlset>\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}

function allLocalizedEntries(page: LocalizedPage): SitemapEntry[] {
  const alternates = pageAlternates(page);
  return allSiteLocales.map((locale) => ({
    path: allRouteFor(page, locale),
    alternates
  }));
}

function papiraPrivacyEntries(): SitemapEntry[] {
  const alternates = pageAlternates('papiraPrivacy');
  return allSiteLocales.map((locale) => ({
    path: allRouteFor('papiraPrivacy', locale),
    alternates
  }));
}

function productEntries(): SitemapEntry[] {
  return getProductSources().flatMap((source) => {
    const alternates = productAlternates(source.slug);
    return allSiteLocales.map((locale) => ({
      path: allProductRouteFor(source.slug, locale),
      alternates
    }));
  });
}

function productPrivacyEntries(): SitemapEntry[] {
  return privacyAppSlugs.flatMap((slug) => {
    const enSourcePath = `public/privacy/${slug}/index.html`;
    const koSourcePath = `public/privacy/${slug}/ko/index.html`;
    for (const sourcePath of [enSourcePath, koSourcePath]) assertExists(sourcePath);
    const alternates = appPrivacyAlternates(slug);
    return allSiteLocales.map((locale) => ({
      path: allAppPrivacyRouteFor(slug, locale),
      alternates
    }));
  });
}

function blogEntries(): SitemapEntry[] {
  const indexAlternates = blogIndexAlternates();
  const indexEntries = allSiteLocales.map((locale) => ({
    path: blogIndexPath(locale),
    alternates: indexAlternates
  }));

  const englishPosts = getBlogPosts('en');
  const articleEntries = englishPosts.flatMap((englishPost) => {
    const alternates = blogPostAlternates(englishPost.meta.slug);
    return allSiteLocales.map((locale) => {
      const sourcePath = blogSourcePath(locale, englishPost.meta.slug);
      assertExists(sourcePath);
      return {
        path: blogPostPath(locale, englishPost.meta.slug),
        alternates
      };
    });
  });

  for (const locale of translatedPrivacyLocales) getExtendedBlogPosts(locale);

  return [...indexEntries, ...articleEntries];
}

function oauthEntries(): SitemapEntry[] {
  const alternates = allAlternates((locale) => oauthPath(locale));
  return allSiteLocales.map((locale) => ({ path: oauthPath(locale), alternates }));
}

function releaseNoteEntries(): SitemapEntry[] {
  return releaseNotes.flatMap((note) => {
    const alternates = allAlternates((locale) => releaseNotePathFor(note.appSlug, note.version, locale));
    return allSiteLocales.map((locale) => ({
      path: releaseNotePathFor(note.appSlug, note.version, locale),
      alternates
    }));
  });
}

function pageAlternates(page: LocalizedPage) {
  return allAlternates((locale) => allRouteFor(page, locale));
}

function productAlternates(slug: string) {
  return allAlternates((locale) => allProductRouteFor(slug, locale));
}

function appPrivacyAlternates(slug: string) {
  return allAlternates((locale) => allAppPrivacyRouteFor(slug, locale));
}

function blogIndexAlternates() {
  return allAlternates(blogIndexPath);
}

function blogPostAlternates(slug: string) {
  return allAlternates((locale) => blogPostPath(locale, slug));
}

function allAlternates(pathFor: (locale: AllSiteLocale) => string) {
  return [
    ...allSiteLocales.map((locale) => ({
      lang: allLocaleDefinitions[locale].hreflang,
      path: pathFor(locale)
    })),
    { lang: 'x-default', path: pathFor('en') }
  ];
}

function blogIndexPath(locale: AllSiteLocale): string {
  if (locale === 'en') return '/blog/';
  return `/blog/${allLocaleDefinitions[locale].pathSegment}/`;
}

function blogPostPath(locale: AllSiteLocale, slug: string): string {
  if (locale === 'en') return `/blog/en/${slug}/`;
  return `/blog/${allLocaleDefinitions[locale].pathSegment}/${slug}/`;
}

function blogSourcePath(locale: AllSiteLocale, slug: string): string {
  return `src/content/blog/${locale}/${slug}.md`;
}

function oauthPath(locale: AllSiteLocale): string {
  if (locale === 'en') return '/oauth/x/callback/';
  return `/oauth/x/callback/${allLocaleDefinitions[locale].pathSegment}/`;
}

function releaseNotePathFor(appSlug: string, version: string, locale: AllSiteLocale): string {
  const base = `/release-notes/${appSlug}/${version}/`;
  if (locale === 'en') return base;
  return `${base}${allLocaleDefinitions[locale].pathSegment}/`;
}

function assertExists(sourcePath: string) {
  if (!fs.existsSync(path.resolve(process.cwd(), sourcePath))) {
    throw new Error(`Missing localized source: ${sourcePath}`);
  }
}

function renderEntry(entry: SitemapEntry): string {
  const links =
    entry.alternates
      ?.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${new URL(alternate.path, siteUrl).toString()}" />`
      )
      .join('\n') ?? '';
  return `  <url>\n    <loc>${new URL(entry.path, siteUrl).toString()}</loc>\n${links}\n  </url>`;
}
