import fs from 'node:fs';
import path from 'node:path';

import { getBlogPosts } from '../lib/blog';
import { getProductSources } from '../lib/products';
import {
  localeDefinitions,
  productLocaleAlternates,
  productRouteFor,
  routeFor,
  siteLocales,
  type LocalizedPage
} from '../lib/site-i18n';
import { releaseNoteKoPath, releaseNotePath, releaseNotes } from '../lib/releaseNotes';

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
  const papiraLastmod = latestLastmod(sourceLastmod, [
    'src/lib/papira.ts',
    'src/components/ProductTemplate.astro'
  ]);
  const entries: SitemapEntry[] = [
    ...corePages.flatMap((page) => localizedEntries(page, sourceLastmod(corePageSources[page]))),
    ...localizedEntries('papira', papiraLastmod),
    ...localizedEntries('papiraPrivacy', sourceLastmod('src/components/PapiraPrivacyPage.astro')),
    ...productPrivacyEntries(sourceLastmod),
    ...blogEntries(sourceLastmod),
    ...legacyPageEntries(
      '/oauth/x/callback/',
      '/oauth/x/callback/ko/',
      sourceLastmod('src/pages/oauth/x/callback/index.astro')
    ),
    ...releaseNoteEntries(sourceLastmod),
    ...productEntries(sourceLastmod)
  ];

  const uniqueEntries = entries.filter(
    (entry, index, all) => all.findIndex((candidate) => candidate.path === entry.path) === index
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniqueEntries.map(renderEntry).join('\n')}
</urlset>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}

function latestLastmod(sourceLastmod: (sourcePath: string) => string, sourcePaths: string[]): string {
  return sourcePaths.map(sourceLastmod).sort().at(-1) as string;
}

function localizedEntries(page: LocalizedPage, lastmod: string): SitemapEntry[] {
  const alternates = [
    ...siteLocales.map((locale) => ({
      lang: localeDefinitions[locale].hreflang,
      path: routeFor(page, locale)
    })),
    { lang: 'x-default', path: routeFor(page, 'en') }
  ];
  return siteLocales.map((locale) => ({
    path: routeFor(page, locale),
    lastmod,
    alternates
  }));
}

function productEntries(sourceLastmod: (sourcePath: string) => string): SitemapEntry[] {
  return getProductSources().flatMap((source) => {
    const lastmod = sourceLastmod(source.contentDir);
    const alternates = productLocaleAlternates(source.slug);
    return siteLocales.map((locale) => ({
      path: productRouteFor(source.slug, locale),
      lastmod,
      alternates
    }));
  });
}

function productPrivacyEntries(sourceLastmod: (sourcePath: string) => string): SitemapEntry[] {
  return getProductSources().flatMap((source) => {
    const enPath = `/privacy/${source.slug}/`;
    const koPath = `/privacy/${source.slug}/ko/`;
    const expectedPrivacyUrl = new URL(enPath, siteUrl).toString();
    if (source.meta.privacy !== expectedPrivacyUrl) {
      throw new Error(`Privacy URL mismatch for ${source.slug}: expected ${expectedPrivacyUrl}`);
    }
    const enSourcePath = `public/privacy/${source.slug}/index.html`;
    const koSourcePath = `public/privacy/${source.slug}/ko/index.html`;
    for (const sourcePath of [enSourcePath, koSourcePath]) {
      if (!fs.existsSync(path.resolve(process.cwd(), sourcePath))) {
        throw new Error(`Missing privacy policy source: ${sourcePath}`);
      }
    }
    const lastmod = [sourceLastmod(enSourcePath), sourceLastmod(koSourcePath)].sort().at(-1) as string;
    const alternates = legacyAlternates(enPath, koPath);
    return [
      { path: enPath, lastmod, alternates },
      { path: koPath, lastmod, alternates }
    ];
  });
}

function blogEntries(sourceLastmod: (sourcePath: string) => string): SitemapEntry[] {
  const indexEntries = legacyPageEntries(
    '/blog/',
    '/blog/ko/',
    sourceLastmod('src/pages/blog/index.astro')
  );
  const articleEntries = getBlogPosts().map((post) => ({
    path: post.href,
    lastmod: sourceLastmod(post.sourcePath),
    alternates: blogAlternates(post)
  }));
  return [...indexEntries, ...articleEntries];
}

function releaseNoteEntries(sourceLastmod: (sourcePath: string) => string): SitemapEntry[] {
  return releaseNotes.flatMap((note) => {
    const enPath = releaseNotePath(note);
    const koPath = releaseNoteKoPath(note);
    const lastmod = sourceLastmod('src/lib/releaseNotes.ts');
    const alternates = legacyAlternates(enPath, koPath);
    return [
      { path: enPath, lastmod, alternates },
      { path: koPath, lastmod, alternates }
    ];
  });
}

function legacyPageEntries(enPath: string, koPath: string, lastmod: string): SitemapEntry[] {
  const alternates = legacyAlternates(enPath, koPath);
  return [
    { path: enPath, lastmod, alternates },
    { path: koPath, lastmod, alternates }
  ];
}

function legacyAlternates(enPath: string, koPath: string) {
  return [
    { lang: 'en', path: enPath },
    { lang: 'ko', path: koPath },
    { lang: 'x-default', path: enPath }
  ];
}

function renderEntry(entry: SitemapEntry): string {
  const links =
    entry.alternates
      ?.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${new URL(alternate.path, siteUrl).toString()}" />`
      )
      .join('\n') ?? '';
  return `  <url>
    <loc>${new URL(entry.path, siteUrl).toString()}</loc>
    <lastmod>${entry.lastmod}</lastmod>
${links}
  </url>`;
}

function sourceFileLastmod() {
  const cache = new Map<string, string>();
  return (sourcePath: string): string => {
    const absolutePath = path.resolve(process.cwd(), sourcePath);
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

function blogAlternates(post: ReturnType<typeof getBlogPosts>[number]) {
  const alternate = getBlogPosts(post.meta.language === 'ko' ? 'en' : 'ko').find(
    (item) => item.meta.slug === post.meta.slug
  );
  if (!alternate) return undefined;
  const enPath = post.meta.language === 'en' ? post.href : alternate.href;
  const koPath = post.meta.language === 'ko' ? post.href : alternate.href;
  return legacyAlternates(enPath, koPath);
}
