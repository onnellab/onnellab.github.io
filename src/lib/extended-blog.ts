import fs from 'node:fs';
import path from 'node:path';

import { allLocaleDefinitions } from './extended-site-i18n';
import type { TranslatedPrivacyLocale } from './app-privacy-localizations';

export type ExtendedBlogLocale = TranslatedPrivacyLocale;

export type ExtendedBlogPost = {
  locale: ExtendedBlogLocale;
  slug: string;
  title: string;
  cardTitle: string;
  category: string;
  description: string;
  relatedApps: string[];
  publishedAt?: string;
  updatedAt?: string;
  tags: string[];
  body: string;
  href: string;
};

const root = path.resolve(process.cwd(), 'src/content/blog');

export function extendedBlogIndexPath(locale: ExtendedBlogLocale): string {
  return `/blog/${allLocaleDefinitions[locale].pathSegment}/`;
}

export function extendedBlogPostPath(locale: ExtendedBlogLocale, slug: string): string {
  return `${extendedBlogIndexPath(locale)}${slug}/`;
}

export function getExtendedBlogPosts(locale: ExtendedBlogLocale): ExtendedBlogPost[] {
  const dir = path.join(root, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => readPost(path.join(dir, entry.name), locale))
    .sort((a, b) => dateValue(b).localeCompare(dateValue(a)) || a.title.localeCompare(b.title));
}

export function getExtendedBlogPost(locale: ExtendedBlogLocale, slug: string): ExtendedBlogPost {
  const post = getExtendedBlogPosts(locale).find((item) => item.slug === slug);
  if (!post) throw new Error(`Unknown translated blog post: ${locale}/${slug}`);
  return post;
}

function readPost(filePath: string, locale: ExtendedBlogLocale): ExtendedBlogPost {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(raw);
  const slug = frontmatter.slug || path.basename(filePath, '.md');
  return {
    locale,
    slug,
    title: frontmatter.title || slug,
    cardTitle: frontmatter.card_title || frontmatter.title || slug,
    category: frontmatter.category || 'general',
    description: frontmatter.description || firstParagraph(body) || frontmatter.title || slug,
    relatedApps: splitList(frontmatter.related_apps),
    publishedAt: frontmatter.published_at || undefined,
    updatedAt: frontmatter.updated_at || undefined,
    tags: splitList(frontmatter.tags),
    body,
    href: extendedBlogPostPath(locale, slug)
  };
}

function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; body: string } {
  if (!raw.startsWith('---\n')) return { frontmatter: {}, body: raw };
  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) return { frontmatter: {}, body: raw };
  const frontmatter: Record<string, string> = {};
  for (const line of raw.slice(4, end).split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    frontmatter[key] = value;
  }
  return { frontmatter, body: raw.slice(end + 5).trim() };
}

function splitList(value?: string): string[] {
  if (!value) return [];
  return value.split(/[|,]/).map((item) => item.trim()).filter(Boolean);
}

function firstParagraph(body: string): string {
  return body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith('#'))
    ?.replace(/\s+/g, ' ') ?? '';
}

function dateValue(post: ExtendedBlogPost): string {
  return post.updatedAt || post.publishedAt || '';
}
