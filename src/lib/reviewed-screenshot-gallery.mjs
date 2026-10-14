import fs from 'node:fs';
import path from 'node:path';
import { screenshotImage } from './screenshot-versions.mjs';

const locales = new Set(['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es']);
const sha256 = /^[a-f0-9]{64}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function regularPath(root, relative) {
  let current = root;
  for (const segment of relative.split('/')) {
    current = path.join(current, segment);
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink()) throw new Error(`Symlink is not reviewed artwork: ${current}`);
  }
  if (!fs.statSync(current).isFile()) throw new Error(`Artwork file is not regular: ${current}`);
  return current;
}

// One receipt describes one reviewed candidate and one platform across every
// locale. Its status records staging, not a claim that deployment succeeded.
// Missing receipts are legacy; present-but-invalid receipts always fail closed.
export function reviewedScreenshotGallery(contentDir, slug, locale, siteRoot = process.cwd()) {
  if (!slugPattern.test(slug) || !locales.has(locale)) throw new Error('Invalid artwork slug or locale');
  const receiptRelative = `public/release-artwork/${slug}.json`;
  const receiptPath = path.join(siteRoot, receiptRelative);
  try { fs.lstatSync(receiptPath); } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
  const fail = (reason) => { throw new Error(`Invalid reviewed artwork for ${slug}/${locale}: ${reason}`); };
  const receipt = JSON.parse(fs.readFileSync(regularPath(siteRoot, receiptRelative), 'utf8'));
  const selection = receipt?.source_selection;
  if (receipt?.status !== 'staged_not_published' || receipt.app_slug !== slug
      || typeof receipt.version !== 'string' || !/^\d+\.\d+\.\d+\+\d+$/.test(receipt.version)
      || !/^[a-f0-9]{40}$/.test(receipt.source_commit) || !sha256.test(receipt.candidate_sha256)
      || selection?.policy !== 'android-edited-then-iphone-edited'
      || !['android', 'iphone_medium'].includes(selection.kind)
      || selection.reason !== (selection.kind === 'android' ? 'android_edited_available' : 'android_edited_absent')
      || !Array.isArray(receipt.assets) || receipt.assets.length === 0) fail('candidate identity or source selection');

  const galleries = new Map();
  const paths = new Set();
  const screenshotRoot = path.join(contentDir, 'assets/screenshots');
  for (const asset of receipt.assets) {
    if (!asset || !locales.has(asset.locale) || asset.kind !== selection.kind
        || !Number.isSafeInteger(asset.index) || asset.index < 1 || !sha256.test(asset.sha256)
        || typeof asset.site_path !== 'string'
        || !new RegExp(`^${asset.locale}/[A-Za-z0-9_-]+\\.png$`).test(asset.site_path)
        || paths.has(asset.site_path) || !Array.isArray(asset.size) || asset.size.length !== 2
        || asset.size.some((value) => !Number.isSafeInteger(value) || value < 1)) fail('asset mapping');
    paths.add(asset.site_path);
    const image = screenshotImage(`/app-assets/${slug}/assets/screenshots/${asset.site_path}`,
      regularPath(contentDir, `assets/screenshots/${asset.site_path}`));
    if (image.sha256 !== asset.sha256 || image.width !== asset.size[0] || image.height !== asset.size[1]) {
      fail(`image bytes or dimensions differ: ${asset.site_path}`);
    }
    const gallery = galleries.get(asset.locale) ?? [];
    gallery.push(Object.freeze({ ...image, slug, locale: asset.locale, index: asset.index,
      kind: asset.kind, source: 'reviewed', version: receipt.version, candidateSha256: receipt.candidate_sha256 }));
    galleries.set(asset.locale, gallery);
  }
  // Do not silently include old files or another version beside the receipt.
  for (const entry of fs.readdirSync(screenshotRoot, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) fail('symlink in gallery');
    if (!entry.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(screenshotRoot, entry.name), { withFileTypes: true })) {
      if (file.isSymbolicLink()) fail('symlink in gallery');
      if (file.isFile() && /\.(?:png|jpg|jpeg|webp)$/i.test(file.name) && !paths.has(`${entry.name}/${file.name}`)) {
        fail(`image is missing from receipt: ${entry.name}/${file.name}`);
      }
    }
  }
  const galleryCounts = new Set([...galleries.values()].map((gallery) => gallery.length));
  if (galleryCounts.size !== 1) fail('locale gallery counts differ');
  for (const gallery of galleries.values()) {
    gallery.sort((a, b) => a.index - b.index);
    if (gallery.some((image, index) => image.index !== index + 1)) fail('non-consecutive or duplicate indices');
    Object.freeze(gallery);
  }
  if (!galleries.has(locale)) fail('requested locale is missing; locale fallback is forbidden');
  return galleries.get(locale);
}

// Existing originals remain solely for apps that have no reviewed receipt yet.
// These routes are not evidence of a newly reviewed store-artwork publication.
const legacyHomeShots = {
  tagweaver: { hero: ['android-20261012', 'tagweaver-editor'], supporting: ['android-20261012', 'tagweaver-library'] },
  melivra: { hero: ['android-20261012', 'melivra'], supporting: ['android-20261012', 'melivra'] },
  papira: { hero: ['papira-20261014', 'papira-hero'], supporting: ['papira-20261014', 'papira'] },
  quivra: { supporting: ['android-20261012', 'quivra'] }
};

export function homepageScreenshot(slug, locale, gallery, role, siteRoot = process.cwd()) {
  if (gallery !== undefined) {
    if (!gallery.length || gallery.some((image) => image.slug !== slug || image.locale !== locale || image.source !== 'reviewed')) {
      throw new Error(`Invalid homepage gallery for ${slug}/${locale}`);
    }
    // Receipt order is stable: first artwork in the hero, second in supporting
    // cards. A single-image gallery reuses the first, never another locale.
    return gallery[role === 'hero' ? 0 : Math.min(1, gallery.length - 1)];
  }
  const legacy = legacyHomeShots[slug]?.[role];
  if (!legacy) return undefined;
  const route = `/home-assets/screenshots/${legacy[0]}/${locale}/${legacy[1]}.png`;
  return Object.freeze({ ...screenshotImage(route, path.join(siteRoot, 'public', route)),
    slug, locale, source: 'legacy' });
}
