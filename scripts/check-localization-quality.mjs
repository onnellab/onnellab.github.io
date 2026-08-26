import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const extensions = new Set(['.astro', '.ts', '.md']);
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
}

walk(path.join(root, 'src'));

const banned = [
  'aria-label="Navigation"',
  'aria-label="Platforms"',
  'aria-label="Blog navigation"',
  'aria-label="Article navigation"',
  'aria-label="Article metadata"',
  'aria-label="Article image"',
  'aria-label="Close"',
  '驗證與回復購買',
  'Vom App verwaltete',
  'gesetzliche beziehungsweise Anforderungen',
  'Warum große Textdateien langsam öffnen',
  'Warum sich große Textdateien langsam öffnen',
  '一つをSoTにして',
  'feat. 表记',
  'feat. 表記',
  'Workflow diagram for 긴 글',
  'Calmo por padrão',
  "title: 'Enfocado'",
  "title: 'Tranquilo'",
  "title: 'Respetuoso'",
  'Aucune connexion',
  'Subjektbezeichner',
  "updated: 'Policy date'",
  "updated: '작성 날짜'",
  "updated: 'ポリシー日付'",
  "updated: '政策日期'",
  "updated: 'Data da política'",
  "updated: 'Stand der Richtlinie'",
  "updated: 'Date de la politique'",
  "updated: 'Fecha de la política'",
  'direito de compra',
  'droit d’achat',
  'Kaufberechtigung',
  'Kept the notes scoped to App Store-visible stability fixes.',
  'Excluded private-test-only and local build metadata changes from the public notes.',
  'App Store에 공개된 안정성 수정 범위로 릴리즈 노트를 한정했습니다.'
];

const violations = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const phrase of banned) {
    if (source.includes(phrase)) {
      violations.push(`${path.relative(root, file)}: banned localization phrase ${JSON.stringify(phrase)}`);
    }
  }
}

if (violations.length) {
  console.error(violations.join('\n'));
  process.exit(1);
}

console.log(`Localization quality check passed for ${files.length} source files.`);
