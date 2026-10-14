import fs from 'node:fs';
import { createHash } from 'node:crypto';

const screenshotAssets = new Map();
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

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

// Astro static paths and source filesystem paths must never contain a query.
export function screenshotAssetPath(routePath) {
  return routePath.split('?', 1)[0];
}
