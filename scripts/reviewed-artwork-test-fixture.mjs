import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
export const localeRoutes = { en: '', ko: 'ko', ja: 'ja', 'zh-Hans': 'zh-hans', 'zh-Hant': 'zh-hant', 'pt-BR': 'pt-br', de: 'de', fr: 'fr', es: 'es' };
export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

// Synthetic fixture only. Never stage these receipts into a production tree.
export async function reviewedSiteFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reviewed-home-build-'));
  try {
    for (const name of ['src', 'public', 'scripts', 'vendor', 'package.json', 'astro.config.mjs', 'tsconfig.json']) {
      fs.cpSync(path.join(root, name), path.join(dir, name), { recursive: true });
    }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
    const receipts = new Map();
    for (const [slug, kind] of [['tagweaver', 'android'], ['papira', 'iphone_medium']]) {
      const receipt = { status: 'staged_not_published', app_slug: slug, version: '9.0.0+900',
        source_commit: '1'.repeat(40), candidate_sha256: '2'.repeat(64),
        source_selection: { policy: 'android-edited-then-iphone-edited', kind,
          reason: kind === 'android' ? 'android_edited_available' : 'android_edited_absent' }, assets: [] };
      const screenshotDir = path.join(dir, 'src/content/apps', slug, 'assets/screenshots');
      for (const locale of Object.keys(localeRoutes)) {
        const files = fs.readdirSync(path.join(screenshotDir, locale)).filter((file) => file.endsWith('.png')).sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));
        for (const [number, name] of files.entries()) {
          const file = path.join(screenshotDir, locale, name);
          if (kind === 'iphone_medium') {
            // Both are valid native sizes within the same iPhone display class.
            const [width, height] = number % 2 ? [1206, 2622] : [1179, 2556];
            const bytes = await sharp({ create: { width, height, channels: 3,
              background: { r: 180 + number, g: 150 + locale.length, b: 220 } } })
              .composite([{ input: Buffer.from(`<svg width="${width}" height="${height}"><rect x="8" y="8" width="${width - 16}" height="${height - 16}" fill="none" stroke="#40304e" stroke-width="16"/><text x="${width / 2}" y="100" text-anchor="middle" font-size="48">Synthetic iPhone fixture</text><text x="${width / 2}" y="${height - 80}" text-anchor="middle" font-size="48">${locale} / ${number + 1} / bottom edge</text></svg>`) }])
              .png().toBuffer();
            fs.writeFileSync(file, bytes);
          }
          const bytes = fs.readFileSync(file);
          receipt.assets.push({ locale, kind, index: number + 1, site_path: `${locale}/${name}`,
            sha256: digest(bytes), size: [bytes.readUInt32BE(16), bytes.readUInt32BE(20)] });
        }
      }
      receipts.set(slug, receipt);
      fs.mkdirSync(path.join(dir, 'public/release-artwork'), {recursive:true});
      fs.writeFileSync(path.join(dir, 'public/release-artwork', `${slug}.json`), JSON.stringify(receipt));
    }
    const build = () => spawnSync(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build', '--root', dir], {
      cwd: dir, encoding: 'utf8', timeout: 90000, env: {...process.env, ASTRO_TELEMETRY_DISABLED: '1'}
    });
    return { dir, receipts, build, cleanup: () => fs.rmSync(dir, {recursive:true, force:true}) };
  } catch (error) {
    fs.rmSync(dir, {recursive:true, force:true});
    throw error;
  }
}
