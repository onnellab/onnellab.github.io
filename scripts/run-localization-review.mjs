import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const sourcePath = path.resolve('scripts/apply-localization-review.mjs');
let source = fs.readFileSync(sourcePath, 'utf8');
const brokenTail = "'Hicimos más fiable la edición habitual de etiquetas.'] }\"\n  ];";
const fixedTail = "'Hicimos más fiable la edición habitual de etiquetas.'] }\"]\n  ];";

if (source.includes(brokenTail)) {
  source = source.replace(brokenTail, fixedTail);
}

const temporaryPath = path.join(os.tmpdir(), `apply-localization-review-${process.pid}.mjs`);
fs.writeFileSync(temporaryPath, source, 'utf8');

try {
  const result = spawnSync(process.execPath, [temporaryPath, ...process.argv.slice(2)], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  process.exitCode = result.status ?? 1;
} finally {
  fs.rmSync(temporaryPath, { force: true });
}
