import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { reviewedScreenshotGallery, homepageScreenshot } from '../src/lib/reviewed-screenshot-gallery.mjs';

function png(width, height, marker) {
  const bytes = Buffer.alloc(33);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
  bytes.writeUInt32BE(13, 8); bytes.write('IHDR', 12);
  bytes.writeUInt32BE(width, 16); bytes.writeUInt32BE(height, 20);
  return Buffer.concat([bytes, Buffer.from(marker)]);
}
function fixture(kind = 'android') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'reviewed-gallery-'));
  const content = path.join(root, 'src/content/apps/tagweaver');
  const receiptPath = path.join(root, 'public/release-artwork/tagweaver.json');
  const receipt = {
    status: 'staged_not_published', app_slug: 'tagweaver', version: '2.1.0+42',
    source_commit: 'a'.repeat(40), candidate_sha256: 'b'.repeat(64),
    source_selection: { policy: 'android-edited-then-iphone-edited', kind,
      reason: kind === 'android' ? 'android_edited_available' : 'android_edited_absent' },
    assets: []
  };
  for (const locale of ['en', 'ko']) for (const index of [1, 2]) {
    const size = kind === 'android' ? [1080, 2160] : [1179, 2556];
    // File names deliberately sort opposite to receipt index order.
    const site_path = `${locale}/${index === 1 ? 'z-first' : 'a-second'}.png`;
    const bytes = png(...size, `${locale}/${index}/${kind}`);
    const file = path.join(content, 'assets/screenshots', site_path);
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes);
    receipt.assets.unshift({ locale, kind, index, site_path, size,
      sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  const write = () => {
    fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
    fs.writeFileSync(receiptPath, JSON.stringify(receipt));
  };
  write();
  return { root, content, receiptPath, receipt, write,
    read: (locale = 'en') => reviewedScreenshotGallery(content, 'tagweaver', locale, root),
    cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}

for (const kind of ['android', 'iphone_medium']) {
  test(`${kind}: detail keeps reviewed artwork while home selects a localized original`, () => {
    const f = fixture(kind);
    try {
      for (const locale of ['en', 'ko']) {
        const gallery = f.read(locale);
        assert.deepEqual(gallery.map((image) => image.index), [1, 2]);
        assert.ok(gallery.every((image) => image.kind === kind && image.locale === locale));
        assert.equal(gallery[0].src, `/app-assets/tagweaver/assets/screenshots/${locale}/z-first.png?v=${gallery[0].sha256}`);
        assert.deepEqual([gallery[0].width, gallery[0].height], kind === 'android' ? [1080, 2160] : [1179, 2556]);
        assert.equal(gallery[0].version, '2.1.0+42'); assert.equal(gallery[0].source, 'reviewed');
        const route = `home-assets/screenshots/android-20261012/${locale}/tagweaver-editor.png`;
        const file = path.join(f.root, 'public', route);
        fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, png(1440, 3120, 'original'));
        const hero = homepageScreenshot('tagweaver', locale, gallery, 'hero', f.root);
        assert.equal(hero.source, 'legacy');
        assert.equal(hero.src, `/${route}?v=${hero.sha256}`);
        assert.deepEqual([hero.width, hero.height], [1440, 3120]);
      }
      assert.equal(homepageScreenshot('unmapped-app', 'en', f.read(), 'hero', f.root), undefined);
    } finally { f.cleanup(); }
  });
}

test('homepage originals retain real dimensions and SHA URL without a detail receipt', () => {
  const f = fixture();
  try {
    fs.unlinkSync(f.receiptPath);
    assert.equal(f.read(), undefined);
    const route = 'home-assets/screenshots/android-20261012/en/tagweaver-editor.png';
    const file = path.join(f.root, 'public', route);
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, png(1440, 3120, 'legacy'));
    const image = homepageScreenshot('tagweaver', 'en', f.read(), 'hero', f.root);
    assert.equal(image.source, 'legacy'); assert.equal(image.index, undefined);
    assert.deepEqual([image.width, image.height], [1440, 3120]);
    assert.match(image.src, /tagweaver-editor\.png\?v=[a-f0-9]{64}$/);
  } finally { f.cleanup(); }
});

const invalid = [
  ['wrong app', (r) => { r.app_slug = 'another-app'; }],
  ['wrong version', (r) => { r.version = 'old'; }],
  ['wrong source commit', (r) => { r.source_commit = 'old'; }],
  ['wrong candidate digest', (r) => { r.candidate_sha256 = 'old'; }],
  ['wrong status', (r) => { r.status = 'unreviewed'; }],
  ['missing source selection', (r) => { delete r.source_selection; }],
  ['wrong selection policy', (r) => { r.source_selection.policy = 'iphone-first'; }],
  ['wrong selection reason', (r) => { r.source_selection.reason = 'android_edited_absent'; }],
  ['mixed platform', (r) => { r.assets[0].kind = 'iphone_medium'; }],
  ['unsupported tablet platform', (r) => { r.source_selection.kind = 'ipad'; }],
  ['mixed locale path', (r) => { r.assets[0].locale = 'en'; }],
  ['path traversal', (r) => { r.assets[0].site_path = 'ko/../../secret.png'; }],
  ['duplicate path', (r) => { r.assets.push(r.assets[0]); }],
  ['duplicate index', (r) => { r.assets[0].index = 1; }],
  ['nonconsecutive index', (r) => { r.assets[0].index = 4; }],
  ['wrong SHA', (r) => { r.assets[0].sha256 = '0'.repeat(64); }],
  ['invented dimensions', (r) => { r.assets[0].size = [1080, 2400]; }],
  ['empty assets', (r) => { r.assets = []; }]
];
for (const [name, mutate] of invalid) {
  test(`present receipt fails closed: ${name}`, () => {
    const f = fixture();
    try { mutate(f.receipt); f.write(); assert.throws(() => f.read(), /Invalid reviewed artwork/); }
    finally { f.cleanup(); }
  });
}

test('missing locale cannot fall back to English or raw originals', () => {
  const f = fixture();
  try { assert.throws(() => f.read('ja'), /requested locale is missing/); }
  finally { f.cleanup(); }
});

test('every declared locale must have the same complete gallery count', () => {
  const f = fixture();
  try {
    f.receipt.assets = f.receipt.assets.filter((asset) => !(asset.locale === 'ko' && asset.index === 2));
    fs.unlinkSync(path.join(f.content, 'assets/screenshots/ko/a-second.png'));
    f.write();
    assert.throws(() => f.read(), /locale gallery counts differ/);
  } finally { f.cleanup(); }
});

test('stale unlisted files and edited bytes cannot be mixed into the candidate', () => {
  const f = fixture();
  try {
    const file = path.join(f.content, 'assets/screenshots/en/old.png');
    fs.writeFileSync(file, png(1080, 2160, 'old'));
    assert.throws(() => f.read(), /image is missing from receipt/);
    fs.unlinkSync(file);
    fs.writeFileSync(path.join(f.content, 'assets/screenshots/en/z-first.png'), png(1080, 2160, 'changed'));
    assert.throws(() => f.read(), /image bytes or dimensions differ/);
  } finally { f.cleanup(); }
});

test('malformed JSON, missing files and symlinked receipts fail closed', () => {
  const f = fixture();
  try {
    fs.writeFileSync(f.receiptPath, '{'); assert.throws(() => f.read());
    f.write();
    fs.unlinkSync(path.join(f.content, 'assets/screenshots/en/z-first.png'));
    assert.throws(() => f.read(), /ENOENT/);
    fs.renameSync(f.receiptPath, `${f.receiptPath}.original`);
    fs.symlinkSync(`${f.receiptPath}.original`, f.receiptPath);
    assert.throws(() => f.read(), /Symlink is not reviewed artwork/);
  } finally { f.cleanup(); }
});

test('homepage consumes the shared reader and exposes verification markers without hardcoded sources or sizes', () => {
  const home = fs.readFileSync(new URL('../src/components/HomePage.astro', import.meta.url), 'utf8');
  const products = fs.readFileSync(new URL('../src/lib/products.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(home, /home-assets\/screenshots|shotDimensions|sourceShot|width="1440"/);
  assert.match(home, /data-home-artwork-contract="1"/);
  assert.equal((home.match(/data-home-featured-slug=/g) ?? []).length, 3);
  assert.equal((home.match(/data-home-artwork-source=/g) ?? []).length, 3);
  assert.match(products, /if \(reviewed !== undefined\) \{\s+return reviewed\.map\(\(image\) => image\.src\);/);
  assert.match(products, /const duoScreenshots = reviewedScreenshots === undefined\s+\? duoScreenshotGallery\(source\.contentDir, source\.slug, locale\) \?\? \[\] : \[\];/);
  assert.match(products, /return \[\.\.\.legacy, \.\.\.duo\.map\(\(image\) => image\.src\)\];/);
});


test('reviewed and opt-in Duo detail dimensions are keyed to each selected image URL', () => {
  const products = fs.readFileSync(new URL('../src/lib/products.ts', import.meta.url), 'utf8');
  const template = fs.readFileSync(new URL('../src/components/ProductTemplate.astro', import.meta.url), 'utf8');
  assert.match(products, /const screenshotDimensionsByPath = reviewedScreenshots === undefined && duoScreenshots\.length === 0\s+\? undefined\s+: Object\.fromEntries\(\(\(\) => \{[\s\S]*\.\.\.reviewedScreenshots \?\? \[\], \.\.\.duoScreenshots[\s\S]*screenshotImage\(routePath, screenshotFilePath\(source, routePath\)\)/);
  assert.match(products, /\.\.\.getProductScreenshotAltsFromCopy\(source, locale, baseScreenshotCount\),\s+\.\.\.duoScreenshots\.map\(\(\{ alt \}\) => alt\)/);
  assert.match(template, /data\.screenshotDimensionsByPath\?\.\[screenshotPath\] \?\? screenshotDimensions/);
  assert.equal((template.match(/width=\{screenshotSizeFor\(screenshotPath\)\.width\}/g) ?? []).length, 2);
  assert.equal((template.match(/height=\{screenshotSizeFor\(screenshotPath\)\.height\}/g) ?? []).length, 2);
});
