import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { versionedScreenshotPath, screenshotAssetPath, screenshotGalleryDimensions } from '../src/lib/screenshot-versions.mjs';

test('immutable gallery URL changes exactly when image bytes change', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshot-version-'));
  try {
    const file = path.join(dir, '01.png');
    const route = '/app-assets/example/assets/screenshots/en/01.png';
    fs.writeFileSync(file, 'reviewed image one');
    const first = versionedScreenshotPath(route, file);
    assert.equal(first, `${route}?v=${createHash('sha256').update('reviewed image one').digest('hex')}`);
    assert.equal(versionedScreenshotPath(route, file), first);
    fs.writeFileSync(file, 'reviewed image two');
    assert.notEqual(versionedScreenshotPath(route, file), first);
    assert.equal(screenshotAssetPath(first), route);
    assert.equal(screenshotAssetPath(route), route);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('product gallery uses versioned URLs and unversioned static output paths', () => {
  const source = fs.readFileSync(new URL('../src/lib/products.ts', import.meta.url), 'utf8');
  assert.match(source, /versionedScreenshotPath\(/);
  assert.match(source, /const assetPath = screenshotAssetPath\(routePath\)/);
  assert.match(source, /path\.resolve\(source\.contentDir, assetPath\.replace/);
});

function pngHeader(width, height, marker = '') {
  const bytes = Buffer.alloc(33);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
  bytes.writeUInt32BE(13, 8);
  bytes.write('IHDR', 12);
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  bytes[24] = 8;
  bytes[25] = 2;
  return Buffer.concat([bytes, Buffer.from(marker)]);
}

test('actual PNG dimensions and digest refresh together when image bytes change', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshot-dimensions-'));
  try {
    const file = path.join(dir, '01.png');
    const route = '/app-assets/example/assets/screenshots/en/01.png';
    fs.writeFileSync(file, pngHeader(1080, 2168, 'old'));
    const oldURL = versionedScreenshotPath(route, file);
    assert.deepEqual(screenshotGalleryDimensions([file]), { width: 1080, height: 2168 });
    // Same byte length, different dimensions: the shared metadata cache refreshes.
    fs.writeFileSync(file, pngHeader(1080, 2160, 'new'));
    assert.deepEqual(screenshotGalleryDimensions([file]), { width: 1080, height: 2160 });
    const resizedURL = versionedScreenshotPath(route, file);
    assert.notEqual(resizedURL, oldURL);
    fs.writeFileSync(file, pngHeader(1080, 2160, 'new-content'));
    assert.deepEqual(screenshotGalleryDimensions([file]), { width: 1080, height: 2160 });
    assert.notEqual(versionedScreenshotPath(route, file), resizedURL);
    fs.writeFileSync(file, pngHeader(1179, 2556, 'native'));
    assert.deepEqual(screenshotGalleryDimensions([file]), { width: 1179, height: 2556 });
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('gallery dimensions use only selected locale files, with safe mixed/legacy fallback', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshot-locales-'));
  try {
    const en = path.join(dir, 'en.png');
    const ko = path.join(dir, 'ko.png');
    const legacy = path.join(dir, 'legacy.webp');
    fs.writeFileSync(en, pngHeader(1080, 2160));
    fs.writeFileSync(ko, pngHeader(1179, 2556));
    fs.writeFileSync(legacy, 'legacy non-PNG bytes');
    assert.deepEqual(screenshotGalleryDimensions([en]), { width: 1080, height: 2160 });
    assert.deepEqual(screenshotGalleryDimensions([ko]), { width: 1179, height: 2556 });
    assert.equal(screenshotGalleryDimensions([en, ko]), undefined);
    assert.equal(screenshotGalleryDimensions([en, legacy]), undefined);
    assert.equal(screenshotGalleryDimensions([legacy]), undefined);
    assert.equal(screenshotGalleryDimensions([]), undefined);
    fs.writeFileSync(ko, pngHeader(1080, 2160));
    assert.deepEqual(screenshotGalleryDimensions([en, ko]), { width: 1080, height: 2160 });
    fs.writeFileSync(en, pngHeader(0, 2160));
    assert.equal(screenshotGalleryDimensions([en]), undefined);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('all app dimensions resolve the selected gallery, without app-specific overrides', () => {
  const source = fs.readFileSync(new URL('../src/lib/products.ts', import.meta.url), 'utf8');
  assert.match(source, /screenshotDimensions: screenshotGalleryDimensions\(\s*screenshotPaths\.map\(\(routePath\) => screenshotFilePath\(source, routePath\)\)/);
  assert.doesNotMatch(source, /2168/);
  assert.doesNotMatch(source, /screenshotDimensions: source\.slug/);
  assert.match(source, /function screenshotFilePath\(source: ProductSource, routePath: string\)/);
  assert.match(source, /assets\.set\(\s*normalizedRoute,\s*screenshotFilePath\(source, routePath\)/);
});
