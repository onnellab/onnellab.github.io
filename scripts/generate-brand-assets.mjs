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
// Keep canonical Ops artwork outside /ops: the encrypted dashboard
// publisher atomically rebuilds that entire directory and must copy its
// three icons from these durable, versioned source assets.
for (const [filepath, size] of [
  ['public/apple-touch-icon.png', 180],
  ['public/brand/ops-mark-180.png', 180],
  ['public/brand/ops-mark-192.png', 192],
  ['public/brand/ops-mark-512.png', 512]
]) {
  await sharp(Buffer.from(ivoryIcon)).resize(size, size).png().toFile(path.join(root, filepath));
}

// Social artwork is approved composition, not a disposable generated logo.
// Only verify the current master silhouette and render the existing artwork;
// do not overwrite text or layout with a brittle old-format SVG replacement.
const socialPath = path.join(root, 'public', 'social-card.svg');
const social = await fs.readFile(socialPath, 'utf8');
if (!social.includes('<!-- ONNELLAB approved monogram -->') || !social.includes(markPath)) {
  throw new Error('Approved social-card artwork does not match master brand logo; update its composition explicitly');
}
const socialRasterPath = path.join(root, 'public', 'social-card.png');
const candidateRaster = await sharp(Buffer.from(social)).png().toBuffer();
let sameVisualPixels = false;
try {
  const [existing, generated] = await Promise.all([
    sharp(socialRasterPath).ensureAlpha().raw().toBuffer(),
    sharp(candidateRaster).ensureAlpha().raw().toBuffer()
  ]);
  sameVisualPixels = existing.equals(generated);
} catch {
  // A missing or invalid raster is rebuilt from the approved SVG.
}
if (!sameVisualPixels) await fs.writeFile(socialRasterPath, candidateRaster);
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
