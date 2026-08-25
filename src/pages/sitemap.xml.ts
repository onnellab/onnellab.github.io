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
  lastmod: string;
  alternates?: Array<{ lang: string; path: string }>;
};

const siteUrl = 'https://onnellab.github.io';
const corePages: LocalizedPage[] = ['home', 'apps', 'about', 'privacy', 'terms'];
const corePageSources: Record<(typeof corePages)[number], string> = {
  home: 'src/components/HomePage.astro',
  apps: 'src/components/AppsIndex.astro',
  about: 'src/components/AboutPage.astro',
  privacy: 'src/components/PrivacyIndex.astro',
  terms: 'src/components/CorePage.astro'
};

export function GET() {
  const sourceLastmod = sourceFileLastmod();
  const entries: SitemapEntry[] = [
    ...corePages.flatMap((page) =>
      allLocalizedEntries(
        page,
        latestLastmod(sourceLastmod, [corePageSources[page], 'src/components/ExtendedSitePage.astro'])
      )
    ),
    ...allLocalizedEntries(
      'papira',
      latestLastmod(sourceLastmod, ['src/lib/papira.ts', 'src/components/ExtendedProductPage.astro'])
    ),
    ...papiraPrivacyEntries(sourceLastmod('src/components/PapiraPrivacyPage.astro')),
    ...productPrivacyEntries(sourceLastmod),
    ...blogEntries(sourceLastmod),
    ...oauthEntries(
      latestLastmod(sourceLastmod, [
        'src/components/OAuthCallbackPage.astro',
        'src/pages/oauth/x/callback/index.astro',
        'src/pages/oauth/x/callback/ko.astro'
      ])
    ),
    ...releaseNoteEntries(sourceLastmod),
    ...productEntries(sourceLastmod)
  ];

  const uniqueEntries = entries.filter(
    (entry, index, all) => all.findIndex((candidate) => candidate.path === entry.path) === index
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${uniqueEntries.map(renderEntry).join('\n')}\n</urlset>\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}

function allLocalizedEntries(page: LocalizedPage, lastmod: string): SitemapEntry[] {
  const alternates = pageAlternates(page);
  return allSiteLocales.map((locale) => ({
    path: allRouteFor(page, locale),
    lastmod,
    alternates
  }));
}

function papiraPrivacyEntries(lastmod: string): SitemapEntry[] {
  const alternates = pageAlternates('papiraPrivacy');
  return allSiteLocales.map((locale) => ({
    path: allRouteFor('papiraPrivacy', locale),
    lastmod,
    alternates
  }));
}

function productEntries(sourceLastmod: (sourcePath: string) => string): SitemapEntry[] {
  return getProductSources().flatMap((source) => {
    const lastmod = latestLastmod(sourceLastmod, [
      source.contentDir,
      'src/lib/product-localizations.ts',
      'src/lib/extended-product-localizations.ts'
    ]);
    const alternates = productAlternates(source.slug);
    return allSiteLocales.map((locale) => ({
      path: allProductRouteFor(source.slug, locale),
      lastmod,
      alternates
    }));
  });
}

function productPrivacyEntries(sourceLastmod: (sourcePath: string) => string): SitemapEntry[] {
  return privacyAppSlugs.flatMap((slug) => {
    const enSourcePath = `public/privacy/${slug}/index.html`;
    const koSourcePath = `public/privacy/${slug}/ko/index.html`;
    for (const sourcePath of [enSourcePath, koSourcePath]) assertExists(sourcePath);
    const lastmod = latestLastmod(sourceLastmod, [
      enSourcePath,
      koSourcePath,
      'src/lib/app-privacy-localizations.ts'
    ]);
    const alternates = appPrivacyAlternates(slug);
    return allSiteLocales.map((locale) => ({
      path: allAppPrivacyRouteFor(slug, locale),
      lastmod,
      alternates
    }));
  });
}

function blogEntries(sourceLastmod: (sourcePath: string) => string): SitemapEntry[] {
  const indexLastmod = latestLastmod(sourceLastmod, [
    'src/components/BlogIndex.astro',
    'src/components/ExtendedBlogIndex.astro',
    'src/content/blog'
  ]);
  const indexAlternates = blogIndexAlternates();
  const indexEntries = allSiteLocales.map((locale) => ({
    path: blogIndexPath(locale),
    lastmod: indexLastmod,
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
        lastmod: sourceLastmod(sourcePath),
        alternates
      };
    });
  });

  for (const locale of translatedPrivacyLocales) getExtendedBlogPosts(locale);

  return [...indexEntries, ...articleEntries];
}

function oauthEntries(lastmod: string): SitemapEntry[] {
  const alternates = allAlternates((locale) => oauthPath(locale));
  return allSiteLocales.map((locale) => ({ path: oauthPath(locale), lastmod, alternates }));
}

function releaseNoteEntries(sourceLastmod: (sourcePath: string) => string): SitemapEntry[] {
  const lastmod = latestLastmod(sourceLastmod, [
    'src/lib/releaseNotes.ts',
    'src/lib/extended-release-notes.ts'
  ]);
  return releaseNotes.flatMap((note) => {
    const alternates = allAlternates((locale) => releaseNotePathFor(note.appSlug, note.version, locale));
    return allSiteLocales.map((locale) => ({
      path: releaseNotePathFor(note.appSlug, note.version, locale),
      lastmod,
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

function latestLastmod(sourceLastmod: (sourcePath: string) => string, sourcePaths: string[]): string {
  return sourcePaths.map(sourceLastmod).sort().at(-1) as string;
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
  return `  <url>\n    <loc>${new URL(entry.path, siteUrl).toString()}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n${links}\n  </url>`;
}

function sourceFileLastmod() {
  const cache = new Map<string, string>();
  return (sourcePath: string): string => {
    const absolutePath = path.isAbsolute(sourcePath) ? sourcePath : path.resolve(process.cwd(), sourcePath);
    if (cache.has(absolutePath)) return cache.get(absolutePath) as string;
    const stat = fs.statSync(absolutePath);
    const newest = stat.isDirectory() ? newestFileMtime(absolutePath) : stat.mtime;
    const value = newest.toISOString().slice(0, 10);
    cache.set(absolutePath, value);
    return value;
  };
}

function newestFileMtime(dir: string): Date {
  let newest = fs.statSync(dir).mtime;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    const mtime = entry.isDirectory() ? newestFileMtime(entryPath) : fs.statSync(entryPath).mtime;
    if (mtime > newest) newest = mtime;
  }
  return newest;
}
