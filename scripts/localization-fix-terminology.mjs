import {
  read,
  replaceAcrossOptional,
  replaceExact,
  write
} from './utils.mjs';

const exactGlobal = [
  ['적은 방해로 작업을 앞에 둬요.', '방해를 줄여 작업에 집중할 수 있게 해요.'],
  ['少ない中断で作業を前に置きます。', '中断を減らし、作業に集中できるようにします。'],
  ['접근성 의미 구조', '접근성을 위한 의미 구조'],
  ['アクセシビリティ意味情報', 'アクセシビリティに必要な意味構造'],
  ['비공개로 변환', '기기 안에서 변환'],
  ['プライベートに変換', '端末内で変換'],
  ['더 차분한 첫 단계', '부담이 적은 첫 단계'],
  ['落ち着いた第一候補', '負担の少ない最初の選択肢'],
  ['Backup-zuerst-Workflow', 'Arbeitsablauf mit vorheriger Sicherung'],
  ['Barrierefreiheits-Semantiken', 'semantische Informationen für Barrierefreiheit'],
  ['Android-Tag-Speicherleistung', 'Leistung beim Speichern von Tags unter Android'],
  ['Android-Schreibzeitprüfungen', 'Prüfungen der Schreibdauer unter Android'],
  ['Local-first-Workflows', 'lokale Arbeitsabläufe']
];
for (const [from, to] of exactGlobal) replaceAcrossOptional('src', from, to);

const perLocale = {
  fr: [
    ['source of truth', 'source de référence'],
    ['Source of truth', 'Source de référence'],
    ['dry run', 'simulation'],
    ['Dry run', 'Simulation'],
    ['stream copy', 'copie directe du flux'],
    ['Stream copy', 'Copie directe du flux'],
    ['headroom', 'marge dynamique'],
    ['loudness', 'niveau sonore perçu'],
    ['reflowable', 'redistribuable']
  ],
  es: [
    ['source of truth', 'fuente de referencia'],
    ['Source of truth', 'Fuente de referencia'],
    ['dry run', 'simulación'],
    ['Dry run', 'Simulación'],
    ['stream copy', 'copia directa del flujo'],
    ['Stream copy', 'Copia directa del flujo'],
    ['headroom', 'margen dinámico'],
    ['reflowable', 'redistribuible']
  ],
  'pt-BR': [
    ['source of truth', 'fonte de referência'],
    ['Source of truth', 'Fonte de referência'],
    ['dry run', 'simulação'],
    ['Dry run', 'Simulação'],
    ['stream copy', 'cópia direta do fluxo'],
    ['Stream copy', 'Cópia direta do fluxo'],
    ['headroom', 'margem dinâmica'],
    ['reflowable', 'com layout adaptável'],
    ['recovery keys', 'chaves de recuperação'],
    ['clipboard', 'área de transferência']
  ],
  'zh-Hans': [
    ['source of truth', '唯一基准版本'],
    ['Source of truth', '唯一基准版本'],
    ['dry run', '模拟运行'],
    ['Dry run', '模拟运行'],
    ['stream copy', '直接复制音视频流'],
    ['headroom', '动态余量']
  ],
  'zh-Hant': [
    ['source of truth', '唯一基準版本'],
    ['Source of truth', '唯一基準版本'],
    ['dry run', '模擬執行'],
    ['Dry run', '模擬執行'],
    ['stream copy', '直接複製音訊或視訊串流'],
    ['headroom', '動態餘裕']
  ]
};
for (const [locale, replacements] of Object.entries(perLocale)) {
  for (const [from, to] of replacements) {
    replaceAcrossOptional(`src/content/blog/${locale}`, from, to, { extensions: ['.md'] });
  }
}

const qualityScript = `import fs from 'node:fs';
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
  "updated: 'ポリシー日付'",
  "updated: '政策日期'",
  "updated: 'Data da política'",
  "updated: 'Stand der Richtlinie'",
  "updated: 'Date de la politique'",
  "updated: 'Fecha de la política'",
  'direito de compra',
  'droit d’achat',
  'Kaufberechtigung'
];

const violations = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const phrase of banned) {
    if (source.includes(phrase)) {
      violations.push(\`\${path.relative(root, file)}: banned localization phrase \${JSON.stringify(phrase)}\`);
    }
  }
}

if (violations.length) {
  console.error(violations.join('\\n'));
  process.exit(1);
}

console.log(\`Localization quality check passed for \${files.length} source files.\`);
`;
write('scripts/check-localization-quality.mjs', qualityScript);

const packageJson = JSON.parse(read('package.json'));
packageJson.scripts['check:i18n-quality'] = 'node scripts/check-localization-quality.mjs';
write('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

replaceExact(
  '.github/workflows/i18n-smoke.yml',
  '      - name: Build site\n        run: npm run build\n',
  '      - name: Check localization copy quality\n        run: npm run check:i18n-quality\n\n      - name: Build site\n        run: npm run build\n',
  { max: 1 }
);
