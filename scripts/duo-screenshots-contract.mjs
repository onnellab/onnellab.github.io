import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { duoScreenshotGallery } from '../src/lib/screenshot-versions.mjs';

const locales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'];
const commit = 'a'.repeat(40);

function png(width, height) {
  const bytes = Buffer.alloc(33);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write('IHDR', 12, 'ascii');
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
}

function createFixture() {
  const contentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vaultxt-duo-gallery-'));
  const localeRecords = {};
  for (const locale of locales) {
    localeRecords[locale] = {};
    for (const slot of ['outer', 'inner']) {
      const size = slot === 'outer' ? [1398, 2034] : [2007, 2853];
      localeRecords[locale][slot] = [];
      for (let index = 1; index <= 5; index += 1) {
        const relative = `assets/duo-screenshots/${locale}/${slot}/${String(index).padStart(2, '0')}.png`;
        const filePath = path.join(contentDir, relative);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        const bytes = png(...size);
        fs.writeFileSync(filePath, bytes);
        localeRecords[locale][slot].push({
          index,
          alt: `${locale} ${slot} screen ${index}`,
          sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
          size
        });
      }
    }
  }
  const receipt = {
    schema_version: 1,
    app_slug: 'vaultxt',
    version: '2.0.2+67',
    source_commit: commit,
    locales: localeRecords
  };
  const receiptPath = path.join(contentDir, 'duo-screenshots.json');
  const write = () => fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  write();
  return { contentDir, receipt, write };
}

test('Duo gallery preserves per-image bytes, dimensions, order, and fails closed on invalid receipts', (t) => {
  const fixture = createFixture();
  t.after(() => fs.rmSync(fixture.contentDir, { recursive: true, force: true }));

  const gallery = duoScreenshotGallery(fixture.contentDir, 'vaultxt', 'en');
  assert.equal(gallery.length, 10);
  assert.deepEqual(gallery.slice(0, 5).map(({ slot, index }) => [slot, index]),
    Array.from({ length: 5 }, (_, offset) => ['outer', offset + 1]));
  assert.deepEqual(gallery.slice(5).map(({ slot, index }) => [slot, index]),
    Array.from({ length: 5 }, (_, offset) => ['inner', offset + 1]));
  assert.deepEqual(gallery.map(({ width, height }) => [width, height]), [
    ...Array.from({ length: 5 }, () => [1398, 2034]),
    ...Array.from({ length: 5 }, () => [2007, 2853])
  ]);
  assert.match(gallery[0].src, new RegExp(`\\?v=${gallery[0].sha256}$`));
  assert.equal(gallery[0].alt, 'en outer screen 1');
  assert.equal(duoScreenshotGallery(fixture.contentDir, 'another-app', 'en'), undefined);

  fs.renameSync(path.join(fixture.contentDir, 'duo-screenshots.json'), path.join(fixture.contentDir, 'receipt.saved'));
  assert.equal(duoScreenshotGallery(fixture.contentDir, 'vaultxt', 'en'), undefined,
    'an absent optional receipt leaves the legacy gallery in control');
  fs.renameSync(path.join(fixture.contentDir, 'receipt.saved'), path.join(fixture.contentDir, 'duo-screenshots.json'));

  const invalid = (mutate, message) => {
    const original = structuredClone(fixture.receipt);
    mutate(fixture.receipt);
    fixture.write();
    assert.throws(() => duoScreenshotGallery(fixture.contentDir, 'vaultxt', 'en'), /Invalid VaultXT Duo screenshots/,
      message);
    Object.assign(fixture.receipt, original);
    fixture.write();
  };
  invalid((receipt) => { delete receipt.locales.es; }, 'requires every approved locale');
  invalid((receipt) => { receipt.locales.en.outer[0].path = '../../outside.png'; }, 'rejects caller-supplied paths');
  invalid((receipt) => { receipt.locales.en.outer[0].index = 2; }, 'rejects duplicate or reordered indices');
  invalid((receipt) => { receipt.locales.en.outer[0].size = [1080, 2160]; }, 'rejects wrong physical dimensions');
  invalid((receipt) => { receipt.locales.en.inner[0].alt = '  '; }, 'rejects empty localized alt text');
  invalid((receipt) => { receipt.locales.en.outer[0].sha256 = '0'.repeat(64); }, 'rejects changed image bytes');
  invalid((receipt) => { delete receipt.locales.en.inner; }, 'rejects missing foldable-display gallery');
});
