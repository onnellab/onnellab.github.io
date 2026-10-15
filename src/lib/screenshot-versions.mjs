import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const screenshotAssets = new Map();
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const duoLocales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'];
const duoSha256 = /^[a-f0-9]{64}$/;

function pngDimensions(bytes) {
  if (bytes.length < 33 || !bytes.subarray(0, 8).equals(pngSignature)
      || bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', 12, 16) !== 'IHDR') {
    return undefined;
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width < 1 || height < 1 || width > 0x7fffffff || height > 0x7fffffff) return undefined;
  return Object.freeze({ width, height });
}

function screenshotAsset(filePath) {
  const stat = fs.statSync(filePath, { bigint: true });
  const fingerprint = `${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`;
  let cached = screenshotAssets.get(filePath);
  if (!cached || cached.fingerprint !== fingerprint) {
    const bytes = fs.readFileSync(filePath);
    cached = {
      fingerprint,
      sha: createHash('sha256').update(bytes).digest('hex'),
      dimensions: pngDimensions(bytes)
    };
    screenshotAssets.set(filePath, cached);
  }
  return cached;
}

// Keep the static original-image route; immutable browser caches get a new URL
// whenever reviewed screenshot bytes change. No image transformation or fetch.
export function versionedScreenshotPath(routePath, filePath) {
  return `${screenshotAssetPath(routePath)}?v=${screenshotAsset(filePath).sha}`;
}

// The URL, digest and intrinsic dimensions must describe the same bytes.
export function screenshotImage(routePath, filePath) {
  const asset = screenshotAsset(filePath);
  if (!asset.dimensions) throw new Error(`Screenshot is not a supported PNG: ${filePath}`);
  return Object.freeze({
    src: `${screenshotAssetPath(routePath)}?v=${asset.sha}`,
    sha256: asset.sha,
    ...asset.dimensions
  });
}

// A single gallery-wide width/height is safe only when every selected image is
// a PNG with matching intrinsic dimensions. Unsupported/mixed legacy galleries
// retain ProductTemplate's existing fallback instead of inventing a ratio.
// Dimensions and the URL digest are obtained from the same cached image bytes.
export function screenshotGalleryDimensions(filePaths) {
  if (filePaths.length === 0) return undefined;
  const dimensions = filePaths.map((filePath) => screenshotAsset(filePath).dimensions);
  const first = dimensions[0];
  if (!first || dimensions.some((size) => !size || size.width !== first.width || size.height !== first.height)) {
    return undefined;
  }
  return first;
}

// Duo screenshots supplement the existing five-image reviewed Android
// gallery. The optional sidecar has a deliberately closed path grammar so it
// cannot redirect static asset collection outside the VaultXT content tree.
// Missing sidecars preserve existing gallery behavior; present invalid
// sidecars fail closed.
export function duoScreenshotGallery(contentDir, slug, locale) {
  if (slug !== 'vaultxt') return undefined;
  if (!duoLocales.includes(locale)) throw new Error(`Invalid Duo screenshot locale: ${locale}`);
  const receiptPath = path.join(contentDir, 'duo-screenshots.json');
  let receiptStat;
  try {
    receiptStat = fs.lstatSync(receiptPath);
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
  const fail = (reason) => { throw new Error(`Invalid VaultXT Duo screenshots: ${reason}`); };
  if (receiptStat.isSymbolicLink() || !receiptStat.isFile()) fail('sidecar must be a regular file');
  const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  if (receipt?.schema_version !== 1 || receipt.app_slug !== 'vaultxt'
      || typeof receipt.version !== 'string' || !/^\d+\.\d+\.\d+\+\d+$/.test(receipt.version)
      || typeof receipt.source_commit !== 'string' || !/^[a-f0-9]{40}$/.test(receipt.source_commit)
      || !receipt.locales || typeof receipt.locales !== 'object' || Array.isArray(receipt.locales)
      || Object.keys(receipt.locales).length !== duoLocales.length
      || duoLocales.some((item) => !Object.hasOwn(receipt.locales, item))) fail('receipt identity or locale set');

  const selected = receipt.locales[locale];
  const gallery = [];
  if (!selected || typeof selected !== 'object' || Array.isArray(selected)
      || Object.keys(selected).length !== 2 || !Object.hasOwn(selected, 'outer') || !Object.hasOwn(selected, 'inner')) {
    fail(`${locale} slot set`);
  }
  for (const slot of ['outer', 'inner']) {
    const images = selected?.[slot];
    if (!Array.isArray(images) || images.length !== 5) fail(`${locale}/${slot} must contain five images`);
    for (let offset = 0; offset < images.length; offset += 1) {
      const index = offset + 1;
      const entry = images[offset];
      const relative = `assets/duo-screenshots/${locale}/${slot}/${String(index).padStart(2, '0')}.png`;
      const expectedSize = slot === 'outer' ? [1398, 2034] : [2007, 2853];
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)
          || Object.keys(entry).length !== 4 || !['index', 'alt', 'sha256', 'size'].every((key) => Object.hasOwn(entry, key))
          || entry.index !== index || typeof entry.alt !== 'string' || !entry.alt.trim()
          || entry.alt !== entry.alt.trim() || !duoSha256.test(entry.sha256)
          || !Array.isArray(entry.size) || entry.size.length !== 2
          || entry.size[0] !== expectedSize[0] || entry.size[1] !== expectedSize[1]) {
        fail(`${locale}/${slot}/${index} metadata`);
      }
      let current = contentDir;
      for (const segment of relative.split('/')) {
        current = path.join(current, segment);
        const stat = fs.lstatSync(current);
        if (stat.isSymbolicLink()) fail(`${locale}/${slot}/${index} contains a symlink`);
      }
      if (!fs.statSync(current).isFile()) fail(`${locale}/${slot}/${index} is not a regular file`);
      const image = screenshotImage(`/app-assets/vaultxt/${relative}`, current);
      if (image.sha256 !== entry.sha256 || image.width !== expectedSize[0] || image.height !== expectedSize[1]) {
        fail(`${locale}/${slot}/${index} bytes or dimensions differ`);
      }
      gallery.push(Object.freeze({ ...image, locale, slot, index, alt: entry.alt,
        version: receipt.version, sourceCommit: receipt.source_commit }));
    }
  }
  return Object.freeze(gallery);
}

// Astro static paths and source filesystem paths must never contain a query.
export function screenshotAssetPath(routePath) {
  return routePath.split('?', 1)[0];
}
