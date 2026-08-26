import fs from 'node:fs';
import path from 'node:path';

export const ROOT = process.cwd();

export function abs(relativePath) {
  return path.join(ROOT, relativePath);
}

export function read(relativePath) {
  return fs.readFileSync(abs(relativePath), 'utf8');
}

export function write(relativePath, content) {
  fs.mkdirSync(path.dirname(abs(relativePath)), { recursive: true });
  fs.writeFileSync(abs(relativePath), content, 'utf8');
}

export function countOccurrences(content, needle) {
  if (!needle) return 0;
  return content.split(needle).length - 1;
}

export function replaceExact(relativePath, from, to, { min = 1, max = Number.POSITIVE_INFINITY } = {}) {
  const original = read(relativePath);
  const count = countOccurrences(original, from);
  if (count < min || count > max) {
    throw new Error(`${relativePath}: expected ${min}..${max} occurrences of ${JSON.stringify(from)}, found ${count}`);
  }
  write(relativePath, original.split(from).join(to));
  console.log(`updated ${relativePath}: ${count} replacement(s)`);
  return count;
}

export function walk(directory, extensions = null) {
  const start = abs(directory);
  if (!fs.existsSync(start)) return [];
  const results = [];
  for (const entry of fs.readdirSync(start, { withFileTypes: true })) {
    const full = path.join(start, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(path.relative(ROOT, full), extensions));
    } else if (!extensions || extensions.some((extension) => entry.name.endsWith(extension))) {
      results.push(path.relative(ROOT, full).replaceAll(path.sep, '/'));
    }
  }
  return results;
}

export function replaceAcross(directory, from, to, { extensions = ['.astro', '.ts', '.md'], min = 1 } = {}) {
  let total = 0;
  for (const relativePath of walk(directory, extensions)) {
    const original = read(relativePath);
    const count = countOccurrences(original, from);
    if (!count) continue;
    write(relativePath, original.split(from).join(to));
    total += count;
    console.log(`updated ${relativePath}: ${count} replacement(s)`);
  }
  if (total < min) {
    throw new Error(`${directory}: expected at least ${min} occurrence(s) of ${JSON.stringify(from)}, found ${total}`);
  }
  return total;
}

export function replaceAcrossOptional(directory, from, to, { extensions = ['.astro', '.ts', '.md'] } = {}) {
  let total = 0;
  for (const relativePath of walk(directory, extensions)) {
    const original = read(relativePath);
    const count = countOccurrences(original, from);
    if (!count) continue;
    write(relativePath, original.split(from).join(to));
    total += count;
    console.log(`updated ${relativePath}: ${count} replacement(s)`);
  }
  console.log(`${directory}: ${total} optional replacement(s) for ${JSON.stringify(from)}`);
  return total;
}

export function insertUiLabelsImport(relativePath, source) {
  if (source.includes("import { uiLabels } from '../lib/ui-labels';")) return source;
  const marker = "import BaseLayout from '../layouts/BaseLayout.astro';";
  if (!source.includes(marker)) {
    throw new Error(`${relativePath}: cannot find BaseLayout import anchor`);
  }
  return source.replace(marker, `${marker}\nimport { uiLabels } from '../lib/ui-labels';`);
}
