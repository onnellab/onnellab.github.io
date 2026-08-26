import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const stage = process.argv[2];

const abs = (relativePath) => path.join(ROOT, relativePath);
const read = (relativePath) => fs.readFileSync(abs(relativePath), 'utf8');
const write = (relativePath, content) => {
  fs.mkdirSync(path.dirname(abs(relativePath)), { recursive: true });
  fs.writeFileSync(abs(relativePath), content, 'utf8');
};
const exists = (relativePath) => fs.existsSync(abs(relativePath));
const walk = (directory, extensions = null) => {
  if (!exists(directory)) return [];
  const results = [];
  for (const entry of fs.readdirSync(abs(directory), { withFileTypes: true })) {
    const relativePath = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...walk(relativePath, extensions));
    else if (!extensions || extensions.some((extension) => entry.name.endsWith(extension))) results.push(relativePath);
  }
  return results;
};
const replaceOptional = (relativePath, from, to) => {
  const source = read(relativePath);
  if (!source.includes(from)) return 0;
  const count = source.split(from).length - 1;
  write(relativePath, source.split(from).join(to));
  console.log(`${relativePath}: ${count} replacement(s) for ${JSON.stringify(from)}`);
  return count;
};
const replaceAcross = (directory, from, to, extensions = ['.astro', '.ts', '.md']) => {
  let count = 0;
  for (const relativePath of walk(directory, extensions)) count += replaceOptional(relativePath, from, to);
  return count;
};
const insertUiLabelsImport = (relativePath, source) => {
  const importLine = "import { uiLabels } from '../lib/ui-labels';";
  if (source.includes(importLine)) return source;
  const marker = "import BaseLayout from '../layouts/BaseLayout.astro';";
  if (!source.includes(marker)) throw new Error(`${relativePath}: missing BaseLayout import anchor`);
  return source.replace(marker, `${marker}\n${importLine}`);
};
const ensureWorkflowTest = (testPath) => {
  const workflowPath = '.github/workflows/i18n-smoke.yml';
  let source = read(workflowPath);
  if (!source.includes(testPath)) {
    source = source.replace('          tests/site-i18n.spec.ts\n', `          tests/site-i18n.spec.ts\n          ${testPath}\n`);
  }
  write(workflowPath, source);
};

function applyAccessibility() {
  const labels = `import type { AllSiteLocale } from './extended-site-i18n';

export type UiLabels = {
  navigation: string;
  platforms: string;
  blogNavigation: string;
  articleNavigation: string;
  articleMetadata: string;
  articleImage: string;
  close: string;
  privacyPolicy: string;
  terms: string;
};

export const uiLabels: Record<AllSiteLocale, UiLabels> = {
  en: { navigation: 'Navigation', platforms: 'Platforms', blogNavigation: 'Blog navigation', articleNavigation: 'Article navigation', articleMetadata: 'Article metadata', articleImage: 'Article image', close: 'Close', privacyPolicy: 'Privacy Policy', terms: 'Terms of Use' },
  ko: { navigation: '탐색', platforms: '플랫폼', blogNavigation: '블로그 탐색', articleNavigation: '글 탐색', articleMetadata: '글 정보', articleImage: '글 이미지', close: '닫기', privacyPolicy: '개인정보 처리방침', terms: '이용약관' },
  ja: { navigation: 'ナビゲーション', platforms: '対応プラットフォーム', blogNavigation: 'ブログナビゲーション', articleNavigation: '記事ナビゲーション', articleMetadata: '記事情報', articleImage: '記事画像', close: '閉じる', privacyPolicy: 'プライバシーポリシー', terms: '利用規約' },
  'zh-Hans': { navigation: '导航', platforms: '支持平台', blogNavigation: '博客导航', articleNavigation: '文章导航', articleMetadata: '文章信息', articleImage: '文章图片', close: '关闭', privacyPolicy: '隐私政策', terms: '使用条款' },
  'zh-Hant': { navigation: '導覽', platforms: '支援平台', blogNavigation: '部落格導覽', articleNavigation: '文章導覽', articleMetadata: '文章資訊', articleImage: '文章圖片', close: '關閉', privacyPolicy: '隱私權政策', terms: '使用條款' },
  'pt-BR': { navigation: 'Navegação', platforms: 'Plataformas', blogNavigation: 'Navegação do blog', articleNavigation: 'Navegação do artigo', articleMetadata: 'Informações do artigo', articleImage: 'Imagem do artigo', close: 'Fechar', privacyPolicy: 'Política de Privacidade', terms: 'Termos de Uso' },
  de: { navigation: 'Navigation', platforms: 'Plattformen', blogNavigation: 'Blog-Navigation', articleNavigation: 'Artikel-Navigation', articleMetadata: 'Artikelinformationen', articleImage: 'Artikelbild', close: 'Schließen', privacyPolicy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen' },
  fr: { navigation: 'Navigation', platforms: 'Plateformes', blogNavigation: 'Navigation du blog', articleNavigation: 'Navigation de l’article', articleMetadata: 'Informations sur l’article', articleImage: 'Image de l’article', close: 'Fermer', privacyPolicy: 'Politique de confidentialité', terms: 'Conditions d’utilisation' },
  es: { navigation: 'Navegación', platforms: 'Plataformas', blogNavigation: 'Navegación del blog', articleNavigation: 'Navegación del artículo', articleMetadata: 'Información del artículo', articleImage: 'Imagen del artículo', close: 'Cerrar', privacyPolicy: 'Política de privacidad', terms: 'Términos de uso' }
};
`;
  write('src/lib/ui-labels.ts', labels);

  const hardcoded = [
    ['aria-label="Navigation"', 'aria-label={uiLabels[locale].navigation}'],
    ['aria-label="Platforms"', 'aria-label={uiLabels[locale].platforms}'],
    ['aria-label="Blog navigation"', 'aria-label={uiLabels[locale].blogNavigation}'],
    ['aria-label="Article navigation"', 'aria-label={uiLabels[locale].articleNavigation}'],
    ['aria-label="Article metadata"', 'aria-label={uiLabels[locale].articleMetadata}'],
    ['aria-label="Article image"', 'aria-label={uiLabels[locale].articleImage}'],
    ['aria-label="Close"', 'aria-label={uiLabels[locale].close}']
  ];

  for (const relativePath of walk('src/components', ['.astro'])) {
    let source = read(relativePath);
    if (!hardcoded.some(([from]) => source.includes(from))) continue;
    source = insertUiLabelsImport(relativePath, source);
    if (relativePath === 'src/components/LegalPage.astro') {
      source = source.replaceAll('aria-label="Navigation"', 'aria-label={uiLabels[lang].navigation}');
    } else {
      for (const [from, to] of hardcoded) source = source.replaceAll(from, to);
    }
    write(relativePath, source);
  }

  let extendedArticle = read('src/components/ExtendedBlogArticle.astro');
  extendedArticle = insertUiLabelsImport('src/components/ExtendedBlogArticle.astro', extendedArticle);
  extendedArticle = extendedArticle.replace(
    '<div class="meta">',
    '<div class="meta" aria-label={uiLabels[locale].articleMetadata}>'
  );
  write('src/components/ExtendedBlogArticle.astro', extendedArticle);

  const testSource = `import { expect, test } from '@playwright/test';

import { blogIndexPathFor, blogPostPathFor } from '../src/lib/blog-i18n';
import {
  allLocaleDefinitions,
  allRouteFor,
  allSiteLocales
} from '../src/lib/extended-site-i18n';
import { uiLabels } from '../src/lib/ui-labels';

const oauthPathFor = (locale: (typeof allSiteLocales)[number]) => {
  const segment = allLocaleDefinitions[locale].pathSegment;
  return segment ? \`/oauth/x/callback/\${segment}/\` : '/oauth/x/callback/';
};

for (const locale of allSiteLocales) {
  test(\`\${locale} exposes localized navigation and platform labels\`, async ({ page }) => {
    await page.goto(allRouteFor('apps', locale));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('.platform-badges').first()).toHaveAttribute('aria-label', uiLabels[locale].platforms);

    await page.goto(allRouteFor('privacy', locale));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('.platform-badges').first()).toHaveAttribute('aria-label', uiLabels[locale].platforms);

    await page.goto(oauthPathFor(locale));
    await expect(page.locator('nav.topbar')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('footer a').nth(0)).toHaveText(uiLabels[locale].privacyPolicy);
    await expect(page.locator('footer a').nth(1)).toHaveText(uiLabels[locale].terms);
  });

  test(\`\${locale} blog labels follow the page language\`, async ({ page }) => {
    await page.goto(blogIndexPathFor(locale));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].blogNavigation);

    await page.goto(blogPostPathFor(locale, 'txt-vs-epub-for-long-reading'));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].articleNavigation);
    const metadata = locale === 'en' || locale === 'ko' ? page.locator('.meta-grid') : page.locator('.meta');
    await expect(metadata).toHaveAttribute('aria-label', uiLabels[locale].articleMetadata);

    const viewer = page.locator('.article-image-viewer');
    if (await viewer.count()) {
      await expect(viewer).toHaveAttribute('aria-label', uiLabels[locale].articleImage);
      await expect(page.locator('[data-article-image-close]')).toHaveAttribute('aria-label', uiLabels[locale].close);
    }
  });
}
`;
  write('tests/accessibility-i18n.spec.ts', testSource);
  ensureWorkflowTest('tests/accessibility-i18n.spec.ts');
}

function applyCorrections() {
  const appPrivacy = 'src/lib/app-privacy-localizations.ts';
  replaceOptional(appPrivacy, '商店提供的產品、交易與權益資訊可能用於驗證與回復購買。', '商店提供的產品、交易與權益資訊可能用於驗證並恢復購買。');
  replaceOptional(appPrivacy, 'Anonymer, vom Server ausgegebener Subjektbezeichner', 'Anonyme, vom Server vergebene Benutzerkennung');

  const localizedPrivacyPage = 'src/components/LocalizedAppPrivacyPage.astro';
  replaceOptional(
    localizedPrivacyPage,
    `const payment = locale === 'zh-Hant'\n  ? details.payment.replace('驗證與回復購買', '驗證並恢復購買')\n  : details.payment;\nconst serverItems = locale === 'de' && slug === 'melivra'\n  ? details.serverItems?.map((item) =>\n      item.replace('Anonymer, vom Server ausgegebener Subjektbezeichner', 'Anonyme, vom Server vergebene Benutzerkennung')\n    )\n  : details.serverItems;\n`,
    ''
  );
  replaceOptional(localizedPrivacyPage, '{serverItems && <ul>{serverItems.map((item) => <li>{item}</li>)}</ul>}', '{details.serverItems && <ul>{details.serverItems.map((item) => <li>{item}</li>)}</ul>}');
  replaceOptional(localizedPrivacyPage, '<p>{payment}</p>', '<p>{details.payment}</p>');

  const papiraPrivacy = 'src/components/PapiraPrivacyPage.astro';
  replaceOptional(papiraPrivacy, "heading: 'Datenschutzerklärung', opening: 'Papira schützt Ihre Privatsphäre.'", "heading: 'Datenschutzerklärung', opening: 'Papira respektiert Ihre Privatsphäre.'");
  replaceOptional(papiraPrivacy, 'Vom App verwaltete Projekte, Einstellungen, letzte Einträge, Vorschauen und Caches', 'Von der App verwaltete Projekte, Einstellungen, letzte Einträge, Vorschauen und Caches');
  replaceOptional(papiraPrivacy, 'Wenn sich Papira-Funktionen oder gesetzliche beziehungsweise Anforderungen der Stores ändern', 'Wenn sich Papira-Funktionen, gesetzliche Anforderungen oder Anforderungen der App-Stores ändern');

  const germanArticle = 'src/content/blog/de/large-text-file-slow-to-open.md';
  replaceOptional(germanArticle, 'Warum große Textdateien langsam öffnen', 'Warum das Öffnen großer Textdateien lange dauert');
  replaceOptional(germanArticle, 'Warum sich große Textdateien langsam öffnen', 'Warum das Öffnen großer Textdateien lange dauert');
  replaceOptional(germanArticle, 'Warum große Textdateien langsam öffnen können', 'Warum das Öffnen großer Textdateien lange dauern kann');
  replaceOptional(germanArticle, 'Warum sich große Textdateien langsam öffnen können', 'Warum das Öffnen großer Textdateien lange dauern kann');

  replaceOptional('src/content/blog/ja/txt-vs-epub-for-long-reading.md', '一つをSoTにして再生成します。', '一つを正本（Source of Truth）と定め、そこから再生成します。');
  replaceOptional('src/components/ExtendedSitePage.astro', "{ title: 'Calmo por padrão', body:", "{ title: 'Calma por padrão', body:");
  replaceOptional('src/components/ExtendedSitePage.astro', "{ title: 'Enfocado', body:", "{ title: 'Enfoque', body:");
  replaceOptional('src/components/ExtendedSitePage.astro', "{ title: 'Tranquilo', body:", "{ title: 'Calma', body:");
  replaceOptional('src/components/ExtendedSitePage.astro', "{ title: 'Respetuoso', body:", "{ title: 'Respeto', body:");
  replaceAcross('src/content/blog/pt-BR', 'arte do álbum', 'capa do álbum', ['.md']);
  replaceOptional('src/content/blog/zh-Hans/clean-up-mp3-metadata-before-organizing-music.md', 'feat. 表记', 'feat. 的标注方式');
  replaceOptional('src/content/blog/zh-Hant/clean-up-mp3-metadata-before-organizing-music.md', 'feat. 表記', 'feat. 的標記方式');
  replaceOptional(
    'src/content/blog/ko/txt-vs-epub-for-long-reading.md',
    'image_specs: "Workflow diagram for 긴 글 TXT EPUB 비교|Comparison diagram for practical options|Screenshot requirements for related applications"',
    'image_specs: "긴 글 TXT·EPUB 비교 작업 흐름도|실용적인 선택지 비교 도표|관련 앱 화면 이미지 요구사항"'
  );
  replaceAcross('src', 'Aucune connexion', 'Aucun compte requis');
}

function applyLegal() {
  const privacyIndex = 'src/components/PrivacyIndex.astro';
  for (const [from, to] of [
    ["updated: 'Policy date'", "updated: 'Last updated'"],
    ["updated: '작성 날짜'", "updated: '최종 업데이트'"],
    ["updated: 'ポリシー日付'", "updated: '最終更新日'"],
    ["updated: '政策日期'", "updated: '最后更新'"],
    ["updated: '政策日期'", "updated: '最後更新'"]
  ]) replaceOptional(privacyIndex, from, to);

  const extended = 'src/components/ExtendedSitePage.astro';
  for (const [from, to] of [
    ["updated: 'Data da política'", "updated: 'Última atualização'"],
    ["updated: 'Stand der Richtlinie'", "updated: 'Zuletzt aktualisiert'"],
    ["updated: 'Date de la politique'", "updated: 'Dernière mise à jour'"],
    ["updated: 'Fecha de la política'", "updated: 'Última actualización'"]
  ]) replaceOptional(extended, from, to);

  for (const [from, to] of [
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
  ]) replaceAcross('src', from, to);
}

function applyReleaseNotes() {
  replaceOptional(
    'src/lib/releaseNotes.ts',
    `    changes: [\n      'Improved stability for the public iOS 2.2 release.',\n      'Kept the notes scoped to App Store-visible stability fixes.',\n      'Excluded private-test-only and local build metadata changes from the public notes.'\n    ],\n    changesKo: [\n      '공개 iOS 2.2 릴리즈의 안정성을 개선했습니다.',\n      'App Store에 공개된 안정성 수정 범위로 릴리즈 노트를 한정했습니다.',\n      '비공개 테스트 전용 변경과 로컬 빌드 메타데이터 변경은 공개 노트에서 제외했습니다.'\n    ]`,
    `    changes: [\n      'Improved overall stability on iOS.',\n      'Made everyday tag editing more reliable.'\n    ],\n    changesKo: [\n      'iOS 전반의 안정성을 개선했습니다.',\n      '일상적인 태그 편집이 더 안정적으로 동작하도록 다듬었습니다.'\n    ]`
  );

  const extended = 'src/lib/extended-release-localizations.ts';
  const replacements = [
    ["'tagweaver/2.2': { summary: 'TagWeaver 2.2 の公開 iOS ストアアップデートです。', changes: ['公開 iOS 2.2 リリースの安定性を改善しました。','リリースノートを App Store に公開される安定性修正の範囲に限定しました。','非公開テスト専用の変更とローカルビルドのメタデータ変更は公開ノートから除外しました。'] }", "'tagweaver/2.2': { summary: 'TagWeaver 2.2 の公開 iOS ストアアップデートです。', changes: ['iOS 全体の安定性を改善しました。','日常的なタグ編集をより安定して行えるよう調整しました。'] }"],
    ["'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公开 iOS 商店更新。', changes: ['提升了公开 iOS 2.2 版本的稳定性。','发布说明仅保留 App Store 可见的稳定性修复。','公开说明不包含仅用于私有测试的更改和本地构建元数据更改。'] }", "'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公开 iOS 商店更新。', changes: ['提升了 iOS 版的整体稳定性。','让日常标签编辑更加稳定可靠。'] }"],
    ["'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公開 iOS 商店更新。', changes: ['提升公開 iOS 2.2 版本的穩定性。','版本說明僅保留 App Store 可見的穩定性修正。','公開說明不包含僅用於私人測試的變更與本機建置中繼資料變更。'] }", "'tagweaver/2.2': { summary: 'TagWeaver 2.2 的公開 iOS 商店更新。', changes: ['提升 iOS 版的整體穩定性。','讓日常標籤編輯更加穩定可靠。'] }"],
    ["'tagweaver/2.2': { summary: 'Atualização pública do TagWeaver 2.2 na App Store para iOS.', changes: ['Melhoramos a estabilidade da versão pública 2.2 para iOS.','Mantivemos as notas restritas às correções de estabilidade visíveis na App Store.','Alterações exclusivas de testes privados e metadados de build local não foram incluídos nas notas públicas.'] }", "'tagweaver/2.2': { summary: 'Atualização pública do TagWeaver 2.2 na App Store para iOS.', changes: ['Melhoramos a estabilidade geral no iOS.','Deixamos a edição cotidiana de tags mais estável e confiável.'] }"],
    ["'tagweaver/2.2': { summary: 'Öffentliches iOS-Store-Update für TagWeaver 2.2.', changes: ['Die Stabilität der öffentlichen iOS-Version 2.2 wurde verbessert.','Die Versionshinweise bleiben auf öffentlich sichtbare App-Store-Stabilitätskorrekturen beschränkt.','Änderungen nur für private Tests und lokale Build-Metadaten wurden aus den öffentlichen Hinweisen ausgeschlossen.'] }", "'tagweaver/2.2': { summary: 'Öffentliches iOS-Store-Update für TagWeaver 2.2.', changes: ['Die allgemeine Stabilität unter iOS wurde verbessert.','Die tägliche Tag-Bearbeitung wurde zuverlässiger gemacht.'] }"],
    ["'tagweaver/2.2': { summary: 'Mise à jour publique iOS de TagWeaver 2.2 sur l’App Store.', changes: ['Amélioration de la stabilité de la version publique iOS 2.2.','Les notes restent limitées aux correctifs de stabilité visibles sur l’App Store.','Les changements réservés aux tests privés et les métadonnées de build local sont exclus des notes publiques.'] }", "'tagweaver/2.2': { summary: 'Mise à jour publique iOS de TagWeaver 2.2 sur l’App Store.', changes: ['Amélioration de la stabilité générale sur iOS.','L’édition courante des tags est désormais plus fiable.'] }"],
    ["'tagweaver/2.2': { summary: 'Actualización pública de TagWeaver 2.2 para iOS en la App Store.', changes: ['Mejoramos la estabilidad de la versión pública 2.2 para iOS.','Limitamos las notas a las correcciones de estabilidad visibles en la App Store.','Los cambios exclusivos de pruebas privadas y los metadatos de compilación local no se incluyen en las notas públicas.'] }", "'tagweaver/2.2': { summary: 'Actualización pública de TagWeaver 2.2 para iOS en la App Store.', changes: ['Mejoramos la estabilidad general en iOS.','Hicimos más fiable la edición habitual de etiquetas.'] }"
  ];
  for (const [from, to] of replacements) replaceOptional(extended, from, to);
}

function applyTerminology() {
  for (const [from, to] of [
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
  ]) replaceAcross('src', from, to);

  const perLocale = {
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
      ['recovery keys', 'chaves de recuperação'], ['clipboard', 'área de transferência']
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
  for (const [locale, replacements] of Object.entries(perLocale)) {
    for (const [from, to] of replacements) replaceAcross(`src/content/blog/${locale}`, from, to, ['.md']);
  }

  const oauth = 'src/components/OAuthCallbackPage.astro';
  for (const [from, to] of [
    ['소유자 승인 OAuth 흐름', 'ONNELLAB 계정 소유자가 승인한 OAuth 흐름'],
    ['所有者承認済みOAuthフロー', 'ONNELLABアカウントの所有者が承認したOAuthフロー'],
    ['经所有者授权的 X OAuth 流程', '经 ONNELLAB 账号所有者授权的 X OAuth 流程'],
    ['經擁有者授權的 X OAuth 流程', '經 ONNELLAB 帳號擁有者授權的 X OAuth 流程'],
    ['autorizado pelo proprietário', 'autorizado pelo titular da conta ONNELLAB'],
    ['vom Eigentümer autorisierten', 'vom Inhaber des ONNELLAB-Kontos autorisierten'],
    ['autorisé par le propriétaire', 'autorisé par le titulaire du compte ONNELLAB'],
    ['autorizado por el propietario', 'autorizado por el titular de la cuenta ONNELLAB'],
    ['onnellab.app@gmail.com 으로', 'onnellab.app@gmail.com으로']
  ]) replaceOptional(oauth, from, to);

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
  'aria-label="Navigation"', 'aria-label="Platforms"', 'aria-label="Blog navigation"',
  'aria-label="Article navigation"', 'aria-label="Article metadata"',
  'aria-label="Article image"', 'aria-label="Close"',
  '驗證與回復購買', 'Vom App verwaltete', 'gesetzliche beziehungsweise Anforderungen',
  'Warum große Textdateien langsam öffnen', 'Warum sich große Textdateien langsam öffnen',
  '一つをSoTにして', 'feat. 表记', 'feat. 表記', 'Workflow diagram for 긴 글',
  'Calmo por padrão', "title: 'Enfocado'", "title: 'Tranquilo'", "title: 'Respetuoso'",
  'Aucune connexion', 'Subjektbezeichner', "updated: 'Policy date'", "updated: 'ポリシー日付'",
  "updated: '政策日期'", "updated: 'Data da política'", "updated: 'Stand der Richtlinie'",
  "updated: 'Date de la politique'", "updated: 'Fecha de la política'",
  'direito de compra', 'droit d’achat', 'Kaufberechtigung',
  'Kept the notes scoped to App Store-visible stability fixes.',
  'Excluded private-test-only and local build metadata changes from the public notes.',
  'App Store에 공개된 안정성 수정 범위로 릴리즈 노트를 한정했습니다.'
];
const violations = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const phrase of banned) if (source.includes(phrase)) violations.push(`${path.relative(root, file)}: banned localization phrase ${JSON.stringify(phrase)}`);
}
if (violations.length) {
  console.error(violations.join('\n'));
  process.exit(1);
}
console.log(`Localization quality check passed for ${files.length} source files.`);
`;
  write('scripts/check-localization-quality.mjs', qualityScript);

  const packageJson = JSON.parse(read('package.json'));
  packageJson.scripts['check:i18n-quality'] = 'node scripts/check-localization-quality.mjs';
  write('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

  const workflowPath = '.github/workflows/i18n-smoke.yml';
  let workflow = read(workflowPath);
  if (!workflow.includes("      - 'scripts/check-localization-quality.mjs'")) {
    workflow = workflow.replace("      - 'package.json'\n", "      - 'package.json'\n      - 'scripts/check-localization-quality.mjs'\n");
    workflow = workflow.replace("      - 'package.json'\n", "      - 'package.json'\n      - 'scripts/check-localization-quality.mjs'\n");
  }
  if (!workflow.includes('name: Check localization copy quality')) {
    workflow = workflow.replace(
      '      - name: Build site\n        run: npm run build\n',
      '      - name: Check localization copy quality\n        run: npm run check:i18n-quality\n\n      - name: Build site\n        run: npm run build\n'
    );
  }
  write(workflowPath, workflow);
  ensureWorkflowTest('tests/accessibility-i18n.spec.ts');
}

const handlers = {
  accessibility: applyAccessibility,
  corrections: applyCorrections,
  legal: applyLegal,
  release: applyReleaseNotes,
  terminology: applyTerminology
};
if (!handlers[stage]) throw new Error(`Unknown stage: ${stage}`);
handlers[stage]();
console.log(`Completed localization review stage: ${stage}`);
