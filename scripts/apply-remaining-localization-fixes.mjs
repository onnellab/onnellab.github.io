import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const phase = process.argv[2];

function file(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(file(relativePath), 'utf8');
}

function write(relativePath, content) {
  fs.mkdirSync(path.dirname(file(relativePath)), { recursive: true });
  fs.writeFileSync(file(relativePath), content, 'utf8');
}

function replace(relativePath, from, to, { required = false } = {}) {
  const source = read(relativePath);
  const count = source.split(from).length - 1;
  if (!count) {
    if (required) throw new Error(`${relativePath}: missing ${JSON.stringify(from)}`);
    console.log(`skip ${relativePath}: ${JSON.stringify(from)}`);
    return 0;
  }
  write(relativePath, source.split(from).join(to));
  console.log(`update ${relativePath}: ${count} replacement(s)`);
  return count;
}

function replaceAcross(directory, from, to, extensions = ['.astro', '.ts', '.md']) {
  let total = 0;
  for (const relativePath of walk(directory, extensions)) total += replace(relativePath, from, to);
  return total;
}

function walk(directory, extensions) {
  const absolute = file(directory);
  if (!fs.existsSync(absolute)) return [];
  const results = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const child = path.join(absolute, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(path.relative(root, child), extensions));
    } else if (extensions.some((extension) => entry.name.endsWith(extension))) {
      results.push(path.relative(root, child).replaceAll(path.sep, '/'));
    }
  }
  return results;
}

function assertAbsent(relativePath, phrases) {
  const source = read(relativePath);
  const found = phrases.filter((phrase) => source.includes(phrase));
  if (found.length) throw new Error(`${relativePath}: remaining phrases: ${found.join(' | ')}`);
}

function phaseAccessibility() {
  const articlePath = 'src/components/BlogArticle.astro';
  let article = read(articlePath);
  if (!article.includes("navLabel: '글 탐색'")) {
    article = article.replace(
      "      blog: '블로그',\n      apps: '앱',\n      summary: '요약',",
      "      blog: '블로그',\n      apps: '앱',\n      navLabel: '글 탐색',\n      metaLabel: '글 정보',\n      imageLabel: '글 이미지',\n      closeLabel: '닫기',\n      summary: '요약',"
    );
  }
  if (!article.includes("navLabel: 'Article navigation'")) {
    article = article.replace(
      "      blog: 'Blog',\n      apps: 'Apps',\n      summary: 'Summary',",
      "      blog: 'Blog',\n      apps: 'Apps',\n      navLabel: 'Article navigation',\n      metaLabel: 'Article metadata',\n      imageLabel: 'Article image',\n      closeLabel: 'Close',\n      summary: 'Summary',"
    );
  }
  article = article
    .replaceAll('aria-label="Article navigation"', 'aria-label={copy.navLabel}')
    .replaceAll('aria-label="Article metadata"', 'aria-label={copy.metaLabel}')
    .replaceAll('aria-label="Article image"', 'aria-label={copy.imageLabel}')
    .replaceAll('aria-label="Close"', 'aria-label={copy.closeLabel}');
  write(articlePath, article);

  replace(
    'src/components/LegalPage.astro',
    'aria-label="Navigation"',
    "aria-label={lang === 'ko' ? '탐색' : 'Navigation'}"
  );

  const extendedPath = 'src/components/ExtendedSitePage.astro';
  let extended = read(extendedPath);
  if (!extended.includes('const navigationLabel =')) {
    extended = extended.replace(
      "const email = 'onnellab.app@gmail.com';",
      "const email = 'onnellab.app@gmail.com';\nconst navigationLabel: Record<ExtendedSiteLocale, string> = {\n  'pt-BR': 'Navegação',\n  de: 'Navigation',\n  fr: 'Navigation',\n  es: 'Navegación'\n};"
    );
  }
  extended = extended.replaceAll('aria-label="Navigation"', 'aria-label={navigationLabel[locale]}');
  write(extendedPath, extended);

  const remaining = [];
  const patterns = [
    'aria-label="Article navigation"',
    'aria-label="Article metadata"',
    'aria-label="Article image"',
    'aria-label="Close"'
  ];
  for (const relativePath of walk('src/components', ['.astro'])) {
    const source = read(relativePath);
    for (const pattern of patterns) {
      if (source.includes(pattern)) remaining.push(`${relativePath}: ${pattern}`);
    }
  }
  if (remaining.length) throw new Error(`Unlocalized accessibility labels remain:\n${remaining.join('\n')}`);

  const accessibilityTest = `import { expect, test } from '@playwright/test';

import { allRouteFor } from '../src/lib/extended-site-i18n';

const extendedLabels = {
  'pt-BR': 'Navegação',
  de: 'Navigation',
  fr: 'Navigation',
  es: 'Navegación'
} as const;

for (const [locale, label] of Object.entries(extendedLabels)) {
  test(\`${locale} core navigation uses the page language\`, async ({ page }) => {
    await page.goto(allRouteFor('apps', locale as keyof typeof extendedLabels));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', label);
  });
}

for (const locale of ['en', 'ko'] as const) {
  test(\`${locale} article accessibility labels use the page language\`, async ({ page }) => {
    const path = locale === 'ko'
      ? '/blog/ko/txt-vs-epub-for-long-reading/'
      : '/blog/en/txt-vs-epub-for-long-reading/';
    const labels = locale === 'ko'
      ? { nav: '글 탐색', meta: '글 정보', image: '글 이미지', close: '닫기' }
      : { nav: 'Article navigation', meta: 'Article metadata', image: 'Article image', close: 'Close' };
    await page.goto(path);
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', labels.nav);
    await expect(page.locator('.meta-grid')).toHaveAttribute('aria-label', labels.meta);
    await expect(page.locator('.article-image-viewer')).toHaveAttribute('aria-label', labels.image);
    await expect(page.locator('[data-article-image-close]')).toHaveAttribute('aria-label', labels.close);
  });
}
`;
  write('tests/accessibility-i18n.spec.ts', accessibilityTest);

  const smokePath = '.github/workflows/i18n-smoke.yml';
  let smoke = read(smokePath);
  if (!smoke.includes('tests/accessibility-i18n.spec.ts')) {
    smoke = smoke.replace(
      '          tests/site-i18n.spec.ts\n',
      '          tests/site-i18n.spec.ts\n          tests/accessibility-i18n.spec.ts\n'
    );
  }
  write(smokePath, smoke);
}

function phaseCorrections() {
  replace(
    'src/lib/app-privacy-localizations.ts',
    '商店提供的產品、交易與權益資訊可能用於驗證與回復購買。',
    '商店提供的產品、交易與權益資訊可能用於驗證並恢復購買。'
  );
  replace(
    'src/lib/app-privacy-localizations.ts',
    'Anonymer, vom Server ausgegebener Subjektbezeichner',
    'Anonyme, vom Server vergebene Benutzerkennung'
  );

  const localizedPrivacyPath = 'src/components/LocalizedAppPrivacyPage.astro';
  let localizedPrivacy = read(localizedPrivacyPath);
  localizedPrivacy = localizedPrivacy.replace(
    "const payment = locale === 'zh-Hant'\n  ? details.payment.replace('驗證與回復購買', '驗證並恢復購買')\n  : details.payment;\nconst serverItems = locale === 'de' && slug === 'melivra'\n  ? details.serverItems?.map((item) =>\n      item.replace('Anonymer, vom Server ausgegebener Subjektbezeichner', 'Anonyme, vom Server vergebene Benutzerkennung')\n    )\n  : details.serverItems;\n",
    ''
  );
  localizedPrivacy = localizedPrivacy
    .replaceAll('{serverItems && <ul>{serverItems.map((item) => <li>{item}</li>)}</ul>}', '{details.serverItems && <ul>{details.serverItems.map((item) => <li>{item}</li>)}</ul>}')
    .replaceAll('<p>{payment}</p>', '<p>{details.payment}</p>');
  write(localizedPrivacyPath, localizedPrivacy);

  replace(
    'src/components/PapiraPrivacyPage.astro',
    "heading: 'Datenschutzerklärung', opening: 'Papira schützt Ihre Privatsphäre.'",
    "heading: 'Datenschutzerklärung', opening: 'Papira respektiert Ihre Privatsphäre.'"
  );
  replace(
    'src/components/PapiraPrivacyPage.astro',
    'Vom App verwaltete Projekte, Einstellungen, letzte Einträge, Vorschauen und Caches',
    'Von der App verwaltete Projekte, Einstellungen, letzte Einträge, Vorschauen und Caches'
  );
  replace(
    'src/components/PapiraPrivacyPage.astro',
    'Wenn sich Papira-Funktionen oder gesetzliche beziehungsweise Anforderungen der Stores ändern',
    'Wenn sich Papira-Funktionen, gesetzliche Anforderungen oder Anforderungen der App-Stores ändern'
  );

  replace('src/content/blog/de/large-text-file-slow-to-open.md', 'title: "Warum große Textdateien langsam öffnen"', 'title: "Warum das Öffnen großer Textdateien lange dauert"');
  replace('src/content/blog/de/large-text-file-slow-to-open.md', 'card_title: "Warum große Textdateien langsam öffnen"', 'card_title: "Warum das Öffnen großer Textdateien lange dauert"');
  replace('src/content/blog/de/large-text-file-slow-to-open.md', 'description: "Warum große Textdateien langsam öffnen können und wie', 'description: "Warum das Öffnen großer Textdateien lange dauern kann und wie');
  replace('src/content/blog/de/large-text-file-slow-to-open.md', '# Warum große Textdateien langsam öffnen', '# Warum das Öffnen großer Textdateien lange dauert');

  replace('src/content/blog/ja/txt-vs-epub-for-long-reading.md', '一つをSoTにして再生成します。', '一つを正本（Source of Truth）と定め、そこから再生成します。');

  replace('src/components/ExtendedSitePage.astro', "{ title: 'Calmo por padrão', body:", "{ title: 'Calma por padrão', body:");
  replace('src/components/ExtendedSitePage.astro', "{ title: 'Enfocado', body:", "{ title: 'Enfoque', body:");
  replace('src/components/ExtendedSitePage.astro', "{ title: 'Tranquilo', body:", "{ title: 'Calma', body:");
  replace('src/components/ExtendedSitePage.astro', "{ title: 'Respetuoso', body:", "{ title: 'Respeto', body:");

  replaceAcross('src/content/blog/pt-BR', 'arte do álbum', 'capa do álbum', ['.md']);
  replace('src/content/blog/zh-Hans/clean-up-mp3-metadata-before-organizing-music.md', 'feat. 表记', 'feat. 的标注方式');
  replace('src/content/blog/zh-Hant/clean-up-mp3-metadata-before-organizing-music.md', 'feat. 表記', 'feat. 的標記方式');
  replace(
    'src/content/blog/ko/txt-vs-epub-for-long-reading.md',
    'image_specs: "Workflow diagram for 긴 글 TXT EPUB 비교|Comparison diagram for practical options|Screenshot requirements for related applications"',
    'image_specs: "긴 글 TXT·EPUB 비교 작업 흐름도|실용적인 선택지 비교 도표|관련 앱 화면 이미지 요구사항"'
  );
  replaceAcross('src', 'Aucune connexion', 'Aucun compte requis');

  assertAbsent('src/components/PapiraPrivacyPage.astro', ['Vom App verwaltete', 'gesetzliche beziehungsweise Anforderungen']);
  assertAbsent('src/content/blog/de/large-text-file-slow-to-open.md', ['Warum große Textdateien langsam öffnen']);
}

function phaseLegal() {
  const privacyHub = [
    ["updated: 'Policy date'", "updated: 'Last updated'"],
    ["updated: '작성 날짜'", "updated: '최종 업데이트'"],
    ["updated: 'ポリシー日付'", "updated: '最終更新日'"],
    ["updated: '政策日期'", "updated: '最后更新'"]
  ];
  for (const [from, to] of privacyHub) replace('src/components/PrivacyIndex.astro', from, to);
  replace('src/components/PrivacyIndex.astro', "updated: '最后更新',\n    analyticsTitle: '網站使用分析'", "updated: '最後更新',\n    analyticsTitle: '網站使用分析'");

  const extendedDates = [
    ["updated: 'Data da política'", "updated: 'Última atualização'"],
    ["updated: 'Stand der Richtlinie'", "updated: 'Zuletzt aktualisiert'"],
    ["updated: 'Date de la politique'", "updated: 'Dernière mise à jour'"],
    ["updated: 'Fecha de la política'", "updated: 'Última actualización'"]
  ];
  for (const [from, to] of extendedDates) replace('src/components/ExtendedSitePage.astro', from, to);

  const legalTerms = [
    ['Informações de produto, transação e direito de uso fornecidas pela loja', 'Informações de produto, transação e licença fornecidas pela loja'],
    ['direito de compra', 'status da licença'],
    ['Direito de compra', 'Status da licença'],
    ['Von der Store-Plattform bereitgestellte Produkt-, Transaktions- und Berechtigungsinformationen', 'Von der Store-Plattform bereitgestellte Produkt-, Transaktions- und Lizenzinformationen'],
    ['Kaufberechtigung', 'Lizenzstatus'],
    ['Les informations de produit, de transaction et de droit fournies par la boutique', 'Les informations de produit, de transaction et de licence fournies par la boutique'],
    ['droit d’achat', 'état de la licence'],
    ['Droit d’achat', 'État de la licence'],
    ['La información de productos, transacciones y derechos proporcionada por la tienda', 'La información de productos, transacciones y licencia proporcionada por la tienda'],
    ['derecho de compra', 'estado de la licencia'],
    ['Derecho de compra', 'Estado de la licencia']
  ];
  for (const [from, to] of legalTerms) replace('src/lib/app-privacy-localizations.ts', from, to);
}

function phaseReleaseNotes() {
  replace(
    'src/lib/releaseNotes.ts',
    `    changes: [
      'Improved stability for the public iOS 2.2 release.',
      'Kept the notes scoped to App Store-visible stability fixes.',
      'Excluded private-test-only and local build metadata changes from the public notes.'
    ],
    changesKo: [
      '공개 iOS 2.2 릴리즈의 안정성을 개선했습니다.',
      'App Store에 공개된 안정성 수정 범위로 릴리즈 노트를 한정했습니다.',
      '비공개 테스트 전용 변경과 로컬 빌드 메타데이터 변경은 공개 노트에서 제외했습니다.'
    ]`,
    `    changes: [
      'Improved overall stability on iOS.',
      'Made everyday tag editing more reliable.'
    ],
    changesKo: [
      'iOS 전반의 안정성을 개선했습니다.',
      '일상적인 태그 편집이 더 안정적으로 동작하도록 다듬었습니다.'
    ]`
  );

  const blocks = [
    ["'tagweaver/2.2': { summary: 'TagWeaver 2.2 の公開 iOS ストアアップデートです。', changes: ['公開 iOS 2.2 リリースの安定性を改善しました。','リリースノートを App Store に公開される安定性修正の範囲に限定しました。','非公開テスト専用の変更とローカルビルドのメタデータ変更は公開ノートから除外しました。'] }", "'tagweaver/2.2': { summary: 'TagWeaver 2.2 の公開 iOS ストアアップデートです。', changes: ['iOS 全体の安定性を改善しました。','日常的なタグ編集をより安定して行えるよう調整しました。'] }"],
    ["'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公开 iOS 商店更新。', changes: ['提升了公开 iOS 2.2 版本的稳定性。','发布说明仅保留 App Store 可见的稳定性修复。','公开说明不包含仅用于私有测试的更改和本地构建元数据更改。'] }", "'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公开 iOS 商店更新。', changes: ['提升了 iOS 版的整体稳定性。','让日常标签编辑更加稳定可靠。'] }"],
    ["'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公開 iOS 商店更新。', changes: ['提升公開 iOS 2.2 版本的穩定性。','版本說明僅保留 App Store 可見的穩定性修正。','公開說明不包含僅用於私人測試的變更與本機建置中繼資料變更。'] }", "'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公開 iOS 商店更新。', changes: ['提升 iOS 版的整體穩定性。','讓日常標籤編輯更加穩定可靠。'] }"],
    ["'tagweaver/2.2': { summary: 'Atualização pública do TagWeaver 2.2 na App Store para iOS.', changes: ['Melhoramos a estabilidade da versão pública 2.2 para iOS.','Mantivemos as notas restritas às correções de estabilidade visíveis na App Store.','Alterações exclusivas de testes privados e metadados de build local não foram incluídos nas notas públicas.'] }", "'tagweaver/2.2': { summary: 'Atualização pública do TagWeaver 2.2 na App Store para iOS.', changes: ['Melhoramos a estabilidade geral no iOS.','Deixamos a edição cotidiana de tags mais estável e confiável.'] }"],
    ["'tagweaver/2.2': { summary: 'Öffentliches iOS-Store-Update für TagWeaver 2.2.', changes: ['Die Stabilität der öffentlichen iOS-Version 2.2 wurde verbessert.','Die Versionshinweise bleiben auf öffentlich sichtbare App-Store-Stabilitätskorrekturen beschränkt.','Änderungen nur für private Tests und lokale Build-Metadaten wurden aus den öffentlichen Hinweisen ausgeschlossen.'] }", "'tagweaver/2.2': { summary: 'Öffentliches iOS-Store-Update für TagWeaver 2.2.', changes: ['Die allgemeine Stabilität unter iOS wurde verbessert.','Die tägliche Tag-Bearbeitung wurde zuverlässiger gemacht.'] }"],
    ["'tagweaver/2.2': { summary: 'Mise à jour publique iOS de TagWeaver 2.2 sur l’App Store.', changes: ['Amélioration de la stabilité de la version publique iOS 2.2.','Les notes restent limitées aux correctifs de stabilité visibles sur l’App Store.','Les changements réservés aux tests privés et les métadonnées de build local sont exclus des notes publiques.'] }", "'tagweaver/2.2': { summary: 'Mise à jour publique iOS de TagWeaver 2.2 sur l’App Store.', changes: ['Amélioration de la stabilité générale sur iOS.','L’édition courante des tags est désormais plus fiable.'] }"],
    ["'tagweaver/2.2': { summary: 'Actualización pública de TagWeaver 2.2 para iOS en la App Store.', changes: ['Mejoramos la estabilidad de la versión pública 2.2 para iOS.','Limitamos las notas a las correcciones de estabilidad visibles en la App Store.','Los cambios exclusivos de pruebas privadas y los metadatos de compilación local no se incluyen en las notas públicas.'] }", "'tagweaver/2.2': { summary: 'Actualización pública de TagWeaver 2.2 para iOS en la App Store.', changes: ['Mejoramos la estabilidad general en iOS.','Hicimos más fiable la edición habitual de etiquetas.'] }"
  ];
  for (const [from, to] of blocks) replace('src/lib/extended-release-localizations.ts', from, to);
}

function phaseTerminology() {
  const broad = [
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
  for (const [from, to] of broad) replaceAcross('src', from, to);

  const localeTerms = {
    fr: [
      ['source of truth', 'source de référence'], ['Source of truth', 'Source de référence'],
      ['dry run', 'simulation'], ['Dry run', 'Simulation'],
      ['stream copy', 'copie directe du flux'], ['Stream copy', 'Copie directe du flux'],
      ['headroom', 'marge dynamique'], ['loudness', 'niveau sonore perçu'], ['reflowable', 'redistribuable']
    ],
    es: [
      ['source of truth', 'fuente de referencia'], ['Source of truth', 'Fuente de referencia'],
      ['dry run', 'simulación'], ['Dry run', 'Simulación'],
      ['stream copy', 'copia directa del flujo'], ['Stream copy', 'Copia directa del flujo'],
      ['headroom', 'margen dinámico'], ['reflowable', 'redistribuible']
    ],
    'pt-BR': [
      ['source of truth', 'fonte de referência'], ['Source of truth', 'Fonte de referência'],
      ['dry run', 'simulação'], ['Dry run', 'Simulação'],
      ['stream copy', 'cópia direta do fluxo'], ['Stream copy', 'Cópia direta do fluxo'],
      ['headroom', 'margem dinâmica'], ['reflowable', 'com layout adaptável'],
      ['recovery keys', 'chaves de recuperação']
    ],
    'zh-Hans': [
      ['source of truth', '唯一基准版本'], ['Source of truth', '唯一基准版本'],
      ['dry run', '模拟运行'], ['Dry run', '模拟运行'],
      ['stream copy', '直接复制音视频流'], ['headroom', '动态余量']
    ],
    'zh-Hant': [
      ['source of truth', '唯一基準版本'], ['Source of truth', '唯一基準版本'],
      ['dry run', '模擬執行'], ['Dry run', '模擬執行'],
      ['stream copy', '直接複製音訊或視訊串流'], ['headroom', '動態餘裕']
    ]
  };
  for (const [locale, replacements] of Object.entries(localeTerms)) {
    for (const [from, to] of replacements) replaceAcross(`src/content/blog/${locale}`, from, to, ['.md']);
  }

  const check = `import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\\.(astro|ts|md)$/.test(entry.name)) files.push(full);
  }
}
walk(path.join(root, 'src'));
const banned = [
  'aria-label="Article navigation"', 'aria-label="Article metadata"', 'aria-label="Article image"', 'aria-label="Close"',
  '驗證與回復購買', 'Vom App verwaltete', 'gesetzliche beziehungsweise Anforderungen',
  'Warum große Textdateien langsam öffnen', '一つをSoTにして', 'feat. 表记', 'feat. 表記',
  'Workflow diagram for 긴 글', 'Calmo por padrão', "title: 'Enfocado'", "title: 'Tranquilo'", "title: 'Respetuoso'",
  'Aucune connexion', 'Subjektbezeichner', "updated: 'Policy date'", "updated: '작성 날짜'", "updated: 'ポリシー日付'",
  "updated: '政策日期'", "updated: 'Data da política'", "updated: 'Stand der Richtlinie'", "updated: 'Date de la politique'", "updated: 'Fecha de la política'"
];
const violations = [];
for (const filename of files) {
  const source = fs.readFileSync(filename, 'utf8');
  for (const phrase of banned) if (source.includes(phrase)) violations.push(\`${path.relative(root, filename)}: \${phrase}\`);
}
if (violations.length) {
  console.error(violations.join('\\n'));
  process.exit(1);
}
console.log(\`Localization quality check passed for \${files.length} files.\`);
`;
  write('scripts/check-localization-quality.mjs', check);

  const packageJson = JSON.parse(read('package.json'));
  packageJson.scripts['check:i18n-quality'] = 'node scripts/check-localization-quality.mjs';
  write('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

  const workflowPath = '.github/workflows/i18n-smoke.yml';
  let workflow = read(workflowPath);
  if (!workflow.includes('Check localization copy quality')) {
    workflow = workflow.replace(
      '      - name: Build site\n        run: npm run build\n',
      '      - name: Check localization copy quality\n        run: npm run check:i18n-quality\n\n      - name: Build site\n        run: npm run build\n'
    );
  }
  write(workflowPath, workflow);
}

const phases = {
  accessibility: phaseAccessibility,
  corrections: phaseCorrections,
  legal: phaseLegal,
  releases: phaseReleaseNotes,
  terminology: phaseTerminology
};

if (!phases[phase]) throw new Error(`Unknown phase: ${phase}`);
phases[phase]();
console.log(`Completed phase: ${phase}`);
