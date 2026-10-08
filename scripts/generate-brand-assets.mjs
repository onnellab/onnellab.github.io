import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const brandDir = path.join(root, 'public', 'brand');
const baseSource = await fs.readFile(path.join(brandDir, 'mark-charcoal.svg'), 'utf8');
const match = baseSource.match(/<path\s+d="([^"]+)"\s+fill="#282723"\s*\/>/);
if (!match) throw new Error('Approved ONNELLAB master logo path is missing');
const markPath = match[1];
const charcoal = '#282723';
const colors = {
  charcoal, white: '#FFFFFF', ivory: '#FAF8F5',
  lilac: '#C8B6E2', 'soft-peach': '#F4C6B7', 'baby-blue': '#B9D7EA',
};

function svgFor({ fill = charcoal, background = null }) {
  const bg = background ? `<rect width="1254" height="1254" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 1254 1254" role="img" aria-label="ONNELLAB"><title>ONNELLAB</title>${bg}<path d="${markPath}" fill="${fill}"/></svg>\n`;
}

async function svgAndPng(name, svg) {
  await fs.writeFile(path.join(brandDir, name + '.svg'), svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(brandDir, name + '.png'));
}

for (const [name, fill] of Object.entries(colors)) {
  if (name === 'charcoal') {
    await sharp(Buffer.from(baseSource)).png().toFile(path.join(brandDir, 'mark-charcoal.png'));
  } else {
    await svgAndPng('mark-' + name, svgFor({ fill }));
  }
}
const transparentMark = svgFor({ fill: charcoal });
const ivoryIcon = svgFor({ fill: charcoal, background: colors.ivory });
await fs.writeFile(path.join(root, 'public', 'favicon.svg'), transparentMark);
await sharp(Buffer.from(transparentMark)).resize(32, 32).png().toFile(path.join(root, 'public/favicon-32x32.png'));
// iOS home-screen and the internal Ops app intentionally retain an ivory tile.
for (const [filepath, size] of [
  ['public/apple-touch-icon.png', 180],
  ['public/ops/icon-180.png', 180],
  ['public/ops/icon-192.png', 192],
  ['public/ops/icon-512.png', 512]
]) {
  await sharp(Buffer.from(ivoryIcon)).resize(size, size).png().toFile(path.join(root, filepath));
}

const socialPath = path.join(root, 'public', 'social-card.svg');
let social = await fs.readFile(socialPath, 'utf8');
const comment = '    <!-- ONNELLAB approved monogram -->';
const replacement = `${comment}\n    <svg x="0" y="0" width="352" height="352" viewBox="0 0 1254 1254">\n      <path d="${markPath}" fill="${charcoal}"/>\n    </svg>\n`;
let start = social.indexOf(comment);
let end = -1;
if (start >= 0) {
  const close = social.indexOf('    </svg>', start);
  if (close < 0) throw new Error('No closing social-card logo SVG');
  end = social.indexOf('\n', close) + 1;
} else {
  const old = social.indexOf('    <circle cx="172" cy="181"');
  const last = social.indexOf('    <circle cx="259" cy="105"', old);
  if (old < 0 || last < 0) throw new Error('Unknown legacy social-card artwork');
  start = old;
  end = social.indexOf('\n', last) + 1;
}
if (end <= start) throw new Error('Invalid social-card logo boundary');
social = social.slice(0, start) + replacement + social.slice(end);
await fs.writeFile(socialPath, social);
await sharp(Buffer.from(social)).png().toFile(path.join(root, 'public', 'social-card.png'));
let legacyPages = 0;
async function updateStaticFaviconVersion(dir) {
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const filename = path.join(dir, item.name);
    if (item.isDirectory()) {
      await updateStaticFaviconVersion(filename);
    } else if (item.isFile() && filename.endsWith('.html')) {
      const before = await fs.readFile(filename, 'utf8');
      const after = before.replaceAll('20260712-ol-transparent-v2', '20261008-open-monogram-v1');
      if (after !== before) {
        await fs.writeFile(filename, after);
        legacyPages++;
      }
    }
  }
}
await updateStaticFaviconVersion(path.join(root, 'public'));

console.log(`ONNELLAB approved logo: variants, favicon, touch, Ops, social-card; ${legacyPages} legacy static pages refreshed`);
