import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const read = (p) => fs.readFile(path.join(root, p), 'utf8');
const pngDimensions = async (p) => {
  const b = await fs.readFile(path.join(root, p));
  assert.equal(b.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', p);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};
const pathFrom = (svg) => svg.match(/<path\s+d="([^"]+)"/)?.[1];

const alphaAt = async (filename, x = 0, y = 0) => {
  const {data, info} = await sharp(path.join(root, filename)).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  return data[(y * info.width + x) * info.channels + 3];
};

test('six approved color marks use the identical silhouette and transparent backgrounds', async () => {
  const original = pathFrom(await read('public/brand/mark-charcoal.svg'));
  assert.ok(original?.length > 500);
  const colors = {
    charcoal: '#282723', white: '#FFFFFF', ivory: '#FAF8F5',
    lilac: '#C8B6E2', 'soft-peach': '#F4C6B7', 'baby-blue': '#B9D7EA',
  };
  for (const [name, color] of Object.entries(colors)) {
    const base = `public/brand/mark-${name}`;
    const svg = await read(base + '.svg');
    assert.equal(pathFrom(svg), original, base);
    assert.ok(!svg.includes('<rect') && !svg.includes('<circle'), base);
    assert.ok(svg.includes(`fill="${color}"`), base);
    assert.deepEqual(await pngDimensions(base + '.png'), [512, 512]);
    assert.equal(await alphaAt(base + '.png'), 0, base);
  }
  assert.ok((await fs.readdir(path.join(root, 'public', 'brand'))).every(n => !n.startsWith('icon-')));
});

test('website favicon is transparent; Apple touch and Ops icons retain ivory backdrop', async () => {
  const original = pathFrom(await read('public/brand/mark-charcoal.svg'));
  const favicon = await read('public/favicon.svg');
  assert.equal(pathFrom(favicon), original);
  assert.ok(!favicon.includes('<rect'));
  assert.deepEqual(await pngDimensions('public/favicon-32x32.png'), [32, 32]);
  assert.equal(await alphaAt('public/favicon-32x32.png'), 0);
  assert.deepEqual(await pngDimensions('public/apple-touch-icon.png'), [180, 180]);
  assert.equal(await alphaAt('public/apple-touch-icon.png'), 255);
  for (const n of [180, 192, 512]) {
    const p = `public/ops/icon-${n}.png`;
    assert.deepEqual(await pngDimensions(p), [n, n]);
    assert.equal(await alphaAt(p), 255);
  }
});

test('no deprecated OL favicon variants remain and website refers to the new cache version', async () => {
  const entries = await fs.readdir(path.join(root, 'public'));
  assert.ok(!entries.some(e => e.startsWith('favicon-ol-') || e.startsWith('apple-touch-icon-ol-')));
  for (const file of ['src/layouts/BaseLayout.astro', 'public/site.webmanifest']) {
    assert.ok((await read(file)).includes('20261008-open-monogram-v1'));
  }
  assert.ok((await read('public/social-card.svg')).includes('ONNELLAB approved monogram'));
});

async function allSvgs(dir) {
  const out = [];
  for (const e of await fs.readdir(path.join(root, dir), { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await allSvgs(p));
    else if (p.endsWith('.svg')) out.push(p);
  }
  return out;
}

test('all blog SVGs use the current mark and published social PNGs have correct dimensions', async () => {
  const files = await allSvgs('public/blog-assets');
  assert.ok(files.length >= 65);
  const logo = pathFrom(await read('public/brand/mark-charcoal.svg'));
  let count = 0;
  for (const file of files) {
    const text = await read(file);
    assert.ok(text.includes('ONNELLAB approved monogram'), file);
    assert.ok(text.includes(logo), file);
    if (file.endsWith('workflow-diagram.svg') && (file.includes('/en/') || file.includes('/ko/'))) {
      const png = path.join(path.dirname(file), 'social-card.png');
      assert.deepEqual(await pngDimensions(png), [1200, 675], png);
      count++;
    }
  }
  assert.equal(count, 32);
});

test('all remaining static HTML pages use the approved brand cache version', async () => {
  let pages = 0;
  async function inspect(dir) {
    for (const e of await fs.readdir(path.join(root, dir), { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await inspect(p);
      else if (e.isFile() && p.endsWith('.html')) {
        pages++;
        const html = await read(p);
        // EN/KO app privacy pages are now generated via BaseLayout instead of
        // duplicated public HTML, so verify the actual remaining files.
        assert.ok(html.includes('rel="icon"') && html.includes('favicon.svg'), p);
        assert.ok(html.includes('20261008-open-monogram-v1'), p);
        assert.ok(!html.includes('20260712-ol-transparent-v2'), p);
      }
    }
  }
  await inspect('public');
  assert.ok(pages > 0, 'Expected public static HTML documents to validate');
});
