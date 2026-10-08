import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const brand = await fs.readFile(path.join(root, 'public/brand/mark-charcoal.svg'), 'utf8');
const match = brand.match(/<path\s+d="([^"]+)"\s+fill="#282723"\s*\/>/);
if (!match) throw new Error('Approved ONNELLAB mark missing');
const pathData = match[1];
const marker = '<!-- ONNELLAB approved monogram -->';
const logo = (x, y, size) =>
  `  ${marker}\n  <svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 1254 1254"><path fill="#282723" d="${pathData}"/></svg>\n`;

async function listSvgs(dir) {
  const files = [];
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const filename = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...await listSvgs(filename));
    else if (item.isFile() && filename.endsWith('.svg')) files.push(filename);
  }
  return files;
}

function branded(svg, filename) {
  if (svg.includes(marker)) return svg;
  if (filename.endsWith('social-card.svg')) {
    const footer = '<text x="1048" y="552"';
    if (!svg.includes(footer)) throw new Error('Blog social card footer missing: ' + filename);
    return svg.replace(footer, logo(908, 512, 66) + '<text x="1080" y="552"');
  }
  if (filename.endsWith('workflow-diagram.svg')) {
    const standard = '<text x="92" y="588"';
    if (svg.includes(standard)) return svg.replace(standard, logo(85, 548, 64) + '<text x="148" y="588"');
    const legacy = '<text x="96" y="584"';
    if (svg.includes(legacy)) return svg.replace(legacy, logo(91, 548, 62) + '<text x="149" y="584"');
    throw new Error('Blog workflow footer missing: ' + filename);
  }
  return svg;
}

let changed = 0;
let checked = 0;
for (const filename of await listSvgs(path.join(root, 'public/blog-assets'))) {
  const original = await fs.readFile(filename, 'utf8');
  const updated = branded(original, filename);
  checked++;
  if (updated !== original) {
    await fs.writeFile(filename, updated);
    changed++;
  }
}
console.log(`ONNELLAB blog SVG branding: ${changed} changed, ${checked} inspected`);
