import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const locales = [
  { path: '', hreflang: 'en', title: 'Papira - TXT to EPUB Maker' },
  { path: 'ko/', hreflang: 'ko', title: 'Papira - TXT EPUB 제작 도구' },
  { path: 'ja/', hreflang: 'ja', title: 'Papira - TXT→EPUB作成ツール' },
  { path: 'zh-hans/', hreflang: 'zh-Hans', title: 'Papira - TXT 转 EPUB 制作工具' },
  { path: 'zh-hant/', hreflang: 'zh-Hant', title: 'Papira - TXT 轉 EPUB 製作工具' },
  { path: 'pt-br/', hreflang: 'pt-BR', title: 'Papira - Criador de EPUB a partir de TXT' },
  { path: 'de/', hreflang: 'de', title: 'Papira - TXT-zu-EPUB-Ersteller' },
  { path: 'fr/', hreflang: 'fr', title: 'Papira - Créateur EPUB à partir de TXT' },
  { path: 'es/', hreflang: 'es', title: 'Papira - Creador de EPUB a partir de TXT' }
] as const;

const releaseContract = {
  en: ['us', 'en-US', 'en', 'US', 'Released'],
  ko: ['kr', 'ko', 'ko', 'KR', '출시됨'],
  ja: ['jp', 'ja', 'ja', 'JP', '公開済み'],
  'zh-Hans': ['cn', 'zh-Hans-CN', 'zh-CN', 'CN', '已发布'],
  'zh-Hant': ['tw', 'zh-Hant-TW', 'zh-TW', 'TW', '已發布'],
  'pt-BR': ['br', 'pt-BR', 'pt-BR', 'BR', 'Disponível'],
  de: ['de', 'de-DE', 'de', 'DE', 'Veröffentlicht'],
  fr: ['fr', 'fr-FR', 'fr', 'FR', 'Disponible'],
  es: ['es', 'es-ES', 'es', 'ES', 'Disponible']
} as const;

const privacyLocales = [
  { path: '', hreflang: 'en', htmlLang: 'en', keyPhrases: ['Papira values your privacy.', 'App store services and payment information', 'Privacy questions or deletion requests:'] },
  { path: 'ko/', hreflang: 'ko', htmlLang: 'ko', keyPhrases: ['Papira는 사용자의 개인정보를 중요하게 생각하며', '앱 스토어 서비스 및 결제 정보', '개인정보 관련 문의 또는 삭제 요청:'] },
  { path: 'ja/', hreflang: 'ja', htmlLang: 'ja', keyPhrases: ['Papiraはユーザーのプライバシーを大切にしています。', 'App Storeサービスと決済情報', 'プライバシーに関するお問い合わせまたは削除依頼：'] },
  { path: 'zh-hans/', hreflang: 'zh-Hans', htmlLang: 'zh-Hans', keyPhrases: ['Papira 重视你的隐私。', '应用商店服务与支付信息', '隐私问题或删除请求：'] },
  { path: 'zh-hant/', hreflang: 'zh-Hant', htmlLang: 'zh-Hant', keyPhrases: ['Papira 重視你的隱私。', 'App Store 服務與支付資訊', '隱私問題或刪除請求：'] },
  { path: 'pt-br/', hreflang: 'pt-BR', htmlLang: 'pt-BR', keyPhrases: ['O Papira valoriza a sua privacidade.', 'Serviços da loja de aplicativos e informações de pagamento', 'Perguntas sobre privacidade ou solicitações de exclusão:'] },
  { path: 'de/', hreflang: 'de', htmlLang: 'de', keyPhrases: ['Papira respektiert Ihre Privatsphäre.', 'App-Store-Dienste und Zahlungsinformationen', 'Fragen zum Datenschutz oder Löschanträge:'] },
  { path: 'fr/', hreflang: 'fr', htmlLang: 'fr', keyPhrases: ['Papira respecte votre vie privée.', 'Services des boutiques d’applications et informations de paiement', 'Questions relatives à la vie privée ou demandes de suppression :'] },
  { path: 'es/', hreflang: 'es', htmlLang: 'es', keyPhrases: ['Papira respeta tu privacidad.', 'Servicios de las tiendas de aplicaciones e información de pago', 'Preguntas sobre privacidad o solicitudes de eliminación:'] }
] as const;

const alternateUrls = {
  en: 'https://onnellab.com/apps/papira/',
  ko: 'https://onnellab.com/apps/papira/ko/',
  ja: 'https://onnellab.com/apps/papira/ja/',
  'zh-Hans': 'https://onnellab.com/apps/papira/zh-hans/',
  'zh-Hant': 'https://onnellab.com/apps/papira/zh-hant/',
  'pt-BR': 'https://onnellab.com/apps/papira/pt-br/',
  de: 'https://onnellab.com/apps/papira/de/',
  fr: 'https://onnellab.com/apps/papira/fr/',
  es: 'https://onnellab.com/apps/papira/es/',
  'x-default': 'https://onnellab.com/apps/papira/'
} as const;

const privacyAlternateUrls = Object.fromEntries(
  privacyLocales.map((locale) => [locale.hreflang, `https://onnellab.com/privacy/papira/${locale.path}`])
) as Record<string, string>;
privacyAlternateUrls['x-default'] = privacyAlternateUrls.en;

const screenshotAlts = {
  en: [
    'Papira home screen for converting TXT to EPUB',
    'Papira cover style picker with twelve cover designs',
    'Papira reading appearance preview with book mood, text size, and line spacing options',
    'Papira chapter list and table of contents preview with the # heading option',
    'Papira EPUB export screen for saving to the device'
  ],
  ko: [
    'Papira 홈 화면, TXT 원고를 EPUB으로 변환',
    'Papira 표지 스타일 선택 화면, 12가지 표지 디자인',
    'Papira 읽는 모습 미리보기, 책 분위기·글자 크기·줄 간격 설정',
    'Papira 챕터 목록과 목차 미리보기, # 제목 옵션',
    'Papira EPUB 내보내기 화면, 기기에 저장'
  ],
  ja: [
    'Papiraのホーム画面、TXT原稿をEPUBに変換',
    'Papiraで12種類の表紙デザインから選ぶ画面',
    'Papiraの本の雰囲気・文字サイズ・行間を選ぶプレビュー画面',
    'Papiraの章一覧と目次プレビュー画面、#見出しの設定',
    'PapiraでEPUBを書き出して端末に保存する画面'
  ],
  'zh-Hans': [
    'Papira 首页，将 TXT 原稿转换为 EPUB',
    'Papira 封面样式选择界面，提供 12 种封面设计',
    'Papira 阅读外观预览界面，可选择书籍氛围、字号和行距',
    'Papira 章节列表与目录预览界面，包含 # 标题选项',
    'Papira EPUB 导出界面，用于保存到设备'
  ],
  'zh-Hant': [
    'Papira 首頁，將 TXT 原稿轉換為 EPUB',
    'Papira 封面樣式選擇畫面，提供 12 種封面設計',
    'Papira 閱讀外觀預覽畫面，可選擇書籍氛圍、字級與行距',
    'Papira 章節列表與目錄預覽畫面，包含 # 標題選項',
    'Papira EPUB 匯出畫面，用於儲存到裝置'
  ],
  'pt-BR': [
    'Tela inicial do Papira para converter TXT em EPUB',
    'Tela do Papira para escolher entre doze estilos de capa',
    'Prévia da aparência de leitura no Papira com opções de clima do livro, tamanho do texto e espaçamento entre linhas',
    'Lista de capítulos e prévia do sumário no Papira com a opção de títulos com #',
    'Tela do Papira para exportar o EPUB e salvá-lo no dispositivo'
  ],
  de: [
    'Papira-Startseite zur Umwandlung von TXT in EPUB',
    'Papira-Auswahl aus zwölf Coverdesigns',
    'Papira-Vorschau des Leselayouts mit Buchstimmung, Schriftgröße und Zeilenabstand',
    'Papira-Kapitelliste und Inhaltsverzeichnis-Vorschau mit der Option für #-Überschriften',
    'Papira-EPUB-Export zum Speichern auf dem Gerät'
  ],
  fr: [
    'Écran d’accueil de Papira pour convertir un TXT en EPUB',
    'Écran Papira pour choisir parmi douze styles de couverture',
    'Aperçu de la mise en page de lecture dans Papira avec ambiance du livre, taille du texte et interligne',
    'Liste des chapitres et aperçu du sommaire dans Papira avec l’option des titres précédés de #',
    'Écran Papira d’exportation de l’EPUB vers l’appareil'
  ],
  es: [
    'Pantalla de inicio de Papira para convertir TXT a EPUB',
    'Pantalla de Papira para elegir entre doce estilos de portada',
    'Vista previa del diseño de lectura en Papira con ambiente del libro, tamaño del texto e interlineado',
    'Lista de capítulos y vista previa del índice en Papira con la opción de títulos con #',
    'Pantalla de Papira para exportar el EPUB y guardarlo en el dispositivo'
  ]
} as const;

async function jsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? 'null'))
  );
}

test.describe('Papira nine-language launch surface', () => {
  test('Papira routes and sitemap use the shared product pipeline', () => {
    const contentDir = path.resolve(process.cwd(), 'src/content/apps/papira');
    expect(fs.existsSync(path.join(contentDir, 'app.md'))).toBe(true);
    for (const locale of locales) {
      const fileName = `description-${locale.hreflang.toLowerCase()}.md`;
      expect(fs.existsSync(path.join(contentDir, fileName))).toBe(true);
    }

    for (const legacyPath of [
      'src/lib/papira.ts',
      'src/lib/papira-description.ts',
      'src/pages/apps/papira/index.astro',
      'src/pages/apps/papira/ko/index.astro',
      'src/pages/apps/papira/ja/index.astro',
      'src/pages/apps/papira/zh-hans/index.astro',
      'src/pages/apps/papira/zh-hant/index.astro'
    ]) {
      expect(fs.existsSync(path.resolve(process.cwd(), legacyPath))).toBe(false);
    }

    const englishRoute = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/apps/[app].astro'), 'utf8');
    const localizedRoute = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/apps/[app]/[locale].astro'), 'utf8');
    expect(englishRoute).toContain('getProductSources');
    expect(englishRoute).toContain('getProductPageData');
    expect(localizedRoute).toContain('getProductSources');
    expect(localizedRoute).toContain('getProductPageData');

    const sitemapSource = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/sitemap.xml.ts'), 'utf8');
    expect(sitemapSource).toContain('...productEntries()');
    expect(sitemapSource).not.toContain("allLocalizedEntries('papira')");
    expect(sitemapSource).toContain("{ lang: 'x-default', path: pathFor('en') }");
    expect(sitemapSource).not.toContain('lastmod');
  });

  for (const locale of locales) {
    test(`Papira product page ${locale.hreflang}`, async ({ page }) => {
      await page.goto(`/apps/papira/${locale.path}`);
      await expect(page).toHaveTitle(locale.title);
      await expect(page.locator('h1')).toHaveText('Papira');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.com/apps/papira/${locale.path}`
      );
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
        'href',
        'https://onnellab.com/apps/papira/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="ja"]')).toHaveAttribute(
        'href',
        'https://onnellab.com/apps/papira/ja/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hans"]')).toHaveAttribute(
        'href',
        'https://onnellab.com/apps/papira/zh-hans/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
        'href',
        'https://onnellab.com/apps/papira/zh-hant/'
      );
      for (const [hreflang, href] of Object.entries(alternateUrls)) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveAttribute(
          'href',
          href
        );
      }
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
    });

    test(`Papira release status and both stores ${locale.hreflang}`, async ({ page }) => {
      const [appCountry, appLanguage, playLanguage, playCountry, releasedLabel] = releaseContract[locale.hreflang];
      const appStore = `https://apps.apple.com/${appCountry}/app/id6803919552?l=${appLanguage}`;
      const googlePlay = `https://play.google.com/store/apps/details?id=com.onnellab.papira&hl=${playLanguage}&gl=${playCountry}`;
      await page.goto(`/apps/papira/${locale.path}`);

      for (const position of ['hero', 'download']) {
        await expect(page.locator(`[data-store="app_store"][data-store-position="${position}"]`)).toHaveAttribute('href', appStore);
        await expect(page.locator(`[data-store="google_play"][data-store-position="${position}"]`)).toHaveAttribute('href', googlePlay);
      }
      const software = (await jsonLd(page)).find((item) => item['@type'] === 'SoftwareApplication');
      expect(software.installUrl).toEqual([appStore, googlePlay]);
      expect(software.sameAs).toEqual([appStore, googlePlay]);
      expect(software.operatingSystem).toBe('iOS, Android');

      await page.goto(`/apps/${locale.path}`);
      const card = page.locator('a[data-app-title="papira"], a[data-title="papira"]');
      await expect(card).toHaveCount(1);
      await expect(card).toHaveAttribute('href', `/apps/papira/${locale.path}`);
      await expect(card.locator('.title-row > span')).toHaveText(releasedLabel);
      await expect(card.locator('.platform-badges')).toHaveText(/^iOS\s*(?:·\s*)?Android$/);
    });

  }

  for (const locale of privacyLocales) {
    test(`Papira privacy page ${locale.hreflang} publishes the nine-language contract`, async ({ page }) => {
      await page.goto(`/privacy/papira/${locale.path}`);
      await expect(page.locator('main')).toContainText('Papira');
      await expect(page.locator('html')).toHaveAttribute('lang', locale.htmlLang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.com/privacy/papira/${locale.path}`
      );
      for (const [hreflang, href] of Object.entries(privacyAlternateUrls)) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveAttribute(
          'href',
          href
        );
      }
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
      for (const phrase of locale.keyPhrases) await expect(page.locator('main')).toContainText(phrase);
    });
  }

  test('general site pages expose the nine-language locale menu', async ({ page }) => {
    for (const route of ['/', '/apps/', '/about/', '/privacy/', '/terms/']) {
      await page.goto(route);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
    }
  });

  test('localized privacy hubs expose Papira', async ({ page }) => {
    for (const path of ['/privacy/ja/', '/privacy/zh-hans/', '/privacy/zh-hant/']) {
      await page.goto(path);
      await expect(page.locator('[data-policy-row]').filter({ hasText: 'Papira' })).toHaveCount(1);
    }
  });

  test('all nine Papira descriptions use an introduction and a scannable feature list', async ({ page }, testInfo) => {
    for (const locale of locales) {
      await page.goto(`/apps/papira/${locale.path}`);
      const copy = page.locator('.copy-column');
      await expect(copy.locator('h2')).toHaveCount(1);
      await expect(copy.locator('ul')).toHaveCount(1);
      await expect(copy.locator('ul > li')).toHaveCount(7);
      await expect(page.locator('.faq-band details')).toHaveCount(4);
      const paragraphs = copy.locator(':scope > p');
      expect(await paragraphs.count()).toBeGreaterThanOrEqual(2);
      expect(await paragraphs.count()).toBeLessThanOrEqual(3);
      await expect(paragraphs.first()).toContainText('Papira');
      if (locale.hreflang === 'ko') {
        await copy.screenshot({ path: testInfo.outputPath('papira-ko-prose.png') });
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });

  test('every locale presents the named formats as specializations rather than conversion limits', async ({ page }) => {
    const expectations = [
      {
        path: '/apps/papira/',
        lead:
          'Papira assembles any finished TXT manuscript into a well-structured EPUB. It includes dedicated flows for fanfiction, serialized fiction, original novels, digital zines, and TRPG scenarios, while other TXT content can also be converted to EPUB.',
        feature:
          'Dedicated presets for fanfiction, serialized fiction, original novels, digital zines, and TRPG scenarios, with support for other TXT content',
        faq:
          'Any finished TXT content can be converted to EPUB. The dedicated presets simply make common creative workflows faster.'
      },
      {
        path: '/apps/papira/ko/',
        lead:
          'Papira는 완성된 TXT 원고를 정돈된 책 파일(EPUB)로 만들어요. 팬픽·연재소설·개인 창작 소설·디지털 소책자·TRPG 시나리오에 특화된 제작 흐름을 제공하지만, 그 밖의 TXT 콘텐츠도 EPUB으로 변환할 수 있어요.',
        feature:
          '팬픽·연재소설·개인 창작 소설·디지털 소책자·TRPG 시나리오에 특화된 작품 유형과 그 밖의 TXT 콘텐츠 지원',
        faq:
          '완성된 TXT 콘텐츠라면 EPUB으로 변환할 수 있어요. 특화된 작품 유형은 자주 쓰는 창작 흐름을 더 빠르게 시작하도록 도와줘요.'
      },
      {
        path: '/apps/papira/ja/',
        lead:
          'Papiraは完成したTXT原稿を整ったEPUBにまとめます。二次創作・連載小説・オリジナル小説・デジタル小冊子・TRPGシナリオに特化した作成フローを備えていますが、そのほかのTXTコンテンツもEPUBに変換できます。',
        feature:
          '二次創作・連載小説・オリジナル小説・デジタル小冊子・TRPGシナリオに特化した作品タイプと、そのほかのTXTコンテンツへの対応',
        faq:
          '完成したTXTコンテンツであればEPUBに変換できます。専用プリセットは、よく使う創作フローをすばやく始めるためのものです。'
      },
      {
        path: '/apps/papira/zh-hans/',
        lead:
          'Papira 可将完成的 TXT 文稿整理成结构清晰的 EPUB。它特别适合同人文、连载小说、原创小说、数字小册子与 TRPG 剧本，也能将其他 TXT 内容转换为 EPUB。',
        feature:
          '特别适合同人文、连载小说、原创小说、数字小册子与 TRPG 剧本，也支持其他 TXT 内容',
        faq:
          '任何完成的 TXT 内容都可以转换为 EPUB。专用预设只是帮助你更快开始常见的创作流程。'
      },
      {
        path: '/apps/papira/zh-hant/',
        lead:
          'Papira 可將完成的 TXT 文稿整理成結構清楚的 EPUB。它特別適合同人文、連載小說、原創小說、數位小冊子與 TRPG 劇本，也能將其他 TXT 內容轉換為 EPUB。',
        feature:
          '特別適合同人文、連載小說、原創小說、數位小冊子與 TRPG 劇本，也支援其他 TXT 內容',
        faq:
          '任何完成的 TXT 內容都可以轉換為 EPUB。專用預設只是協助你更快開始常見的創作流程。'
      }
    ];

    for (const expected of expectations) {
      await page.goto(expected.path);
      const main = page.locator('main');
      await expect(main).toContainText(expected.lead);
      await expect(page.locator('.copy-column')).toContainText('TXT');
      await expect(main).toContainText(expected.faq);
    }
  });

  test('every Papira hero uses the shared product feature source', async ({ page }) => {
    for (const locale of locales) {
      await page.goto(`/apps/papira/${locale.path}`);
      const signals = page.locator('.hero .task-preview .task-row strong');
      const features = page.locator('.copy-column ul > li');
      await expect(signals).toHaveCount(3);
      await expect(features).toHaveCount(7);
      expect(await signals.allTextContents()).toEqual((await features.allTextContents()).slice(0, 3));
    }
  });

  test('every locale keeps scope guidance positive without a standalone limitations section', async ({ page }) => {
    const expectations = [
      {
        path: '/apps/papira/',
        removedHeading: 'Papira stays deliberately small',
        removedCopy: 'publishing-agency services',
        editing:
          'Papira is for assembling a finished manuscript into EPUB. Edit the source TXT in your preferred writing tool first.'
      },
      {
        path: '/apps/papira/ko/',
        removedHeading: 'Papira가 하지 않는 일',
        removedCopy: 'ISBN 발급이나 출판 대행을 하지 않아요',
        editing:
          'Papira는 완성된 원고를 EPUB으로 조립하는 도구예요. 원문 수정은 평소 쓰는 편집기에서 먼저 해요.'
      },
      {
        path: '/apps/papira/ja/',
        removedHeading: 'Papiraが行わないこと',
        removedCopy: 'ISBN発行や出版代行は行いません',
        editing:
          'Papiraは完成原稿をEPUBにまとめるためのツールです。本文の編集は使い慣れた執筆ツールで先に行ってください。'
      },
      {
        path: '/apps/papira/zh-hans/',
        removedHeading: 'Papira 不做这些事',
        removedCopy: '不提供 ISBN 申请或出版代理服务',
        editing: 'Papira 用于把完成稿整理成 EPUB。请先在常用写作工具中完成正文编辑。'
      },
      {
        path: '/apps/papira/zh-hant/',
        removedHeading: 'Papira 不做這些事',
        removedCopy: '不提供 ISBN 申請或出版代理服務',
        editing: 'Papira 用來把完成稿整理成 EPUB。請先在慣用的寫作工具中完成正文編輯。'
      }
    ];

    for (const expected of expectations) {
      await page.goto(expected.path);
      const content = page.locator('.content-band');
      await expect(content.getByRole('heading', { name: expected.removedHeading })).toHaveCount(0);
      await expect(content).not.toContainText(expected.removedCopy);
      await expect(page.locator('.faq-band')).toContainText(expected.editing);
    }
  });

  test('other product copy uses the shared section and list rendering', async ({ page }) => {
    await page.goto('/apps/tagweaver/');
    await expect(page.getByRole('heading', { level: 2, name: 'Key features' })).toHaveCount(1);
    await expect(page.getByRole('listitem').filter({ hasText: 'Edit music tag fields' })).toHaveCount(1);
    await expect(page.locator('.hero .task-row strong')).toHaveText([
      'Edit music tag fields such as title, artist and album',
      'Edit rating metadata',
      'Manage album artwork'
    ]);
  });

  test('Korean Papira links and schema use the canonical privacy URL exactly once', async ({ page }) => {
    const privacyUrl = 'https://onnellab.com/privacy/papira/ko/';
    await page.goto('/apps/papira/ko/');
    const privacyLinks = page.getByRole('link', { name: '개인정보 처리방침' });
    await expect(privacyLinks).toHaveCount(2);
    for (const link of await privacyLinks.all()) {
      await expect(link).toHaveAttribute('href', privacyUrl);
    }

    const schemas = await jsonLd(page);
    const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
    expect(software).not.toHaveProperty('privacyPolicy');
    expect(JSON.stringify(schemas)).not.toContain('/ko/ko/');
  });

  test('released Papira exposes both verified store URLs without inventing pricing data', async ({ page }) => {
    await page.goto('/apps/papira/');
    const schemas = await jsonLd(page);
    const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
    expect(software).toBeTruthy();
    const stores = [
      'https://apps.apple.com/us/app/id6803919552?l=en-US',
      'https://play.google.com/store/apps/details?id=com.onnellab.papira&hl=en&gl=US'
    ];
    expect(software.installUrl).toEqual(stores);
    expect(software.sameAs).toEqual(stores);
    for (const key of ['isAccessibleForFree', 'downloadUrl', 'offers']) {
      expect(software).not.toHaveProperty(key);
    }
  });

  test('Papira icon is served from a repository-contained public asset', async ({ page }) => {
    const iconPath = '/app-assets/papira/icon.png';
    await page.goto('/apps/papira/');
    await expect(page.locator('.identity img')).toHaveAttribute('src', iconPath);
    expect(fs.existsSync(path.resolve(process.cwd(), 'src/content/apps/papira/icon.png'))).toBe(true);
  });

  test('every Papira locale publishes the large PNG social card while schema keeps the square icon', async ({ page }) => {
    const socialImageUrl = 'https://onnellab.com/app-assets/papira/social-card.png';
    const iconUrl = 'https://onnellab.com/app-assets/papira/icon.png';

    for (const locale of locales) {
      await page.goto(`/apps/papira/${locale.path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', socialImageUrl);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', socialImageUrl);

      const schemas = await jsonLd(page);
      const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
      expect(software?.image).toBe(iconUrl);
    }

    const response = await page.request.get('/app-assets/papira/social-card.png');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/png');
    expect(await page.evaluate(async (source) => {
      const image = new Image();
      image.src = source;
      await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    }, '/app-assets/papira/social-card.png')).toEqual({ width: 1200, height: 675 });
  });

  test('Papira product pages expose the localized promotional screenshot gallery', async ({ page }) => {
    for (const locale of locales) {
      const screenshotLocale = locale.hreflang;
      await page.goto(`/apps/papira/${locale.path}`);

      const screenshots = page.locator('.screenshot-link img');
      await expect(screenshots).toHaveCount(5);
      expect(await screenshots.evaluateAll((images) => images.map((image) => image.getAttribute('alt'))))
        .toEqual([...screenshotAlts[screenshotLocale]]);
      expect(await page.locator('.viewer-thumb img').evaluateAll((images) =>
        images.map((image) => image.getAttribute('alt'))
      )).toEqual(['', '', '', '', '']);
      for (let index = 0; index < 5; index += 1) {
        const source = `/app-assets/papira/assets/screenshots/${screenshotLocale}/0${index + 1}.png`;
        await expect(screenshots.nth(index)).toHaveAttribute('src', source);
        await expect(screenshots.nth(index)).toHaveAttribute('width', '1080');
        await expect(screenshots.nth(index)).toHaveAttribute('height', '1920');
        expect(fs.existsSync(path.resolve(process.cwd(), 'src/content/apps/papira/assets/screenshots', screenshotLocale, `0${index + 1}.png`))).toBe(true);
        // Bring each lazy-loaded image into view, including offscreen mobile carousel items.
        await screenshots.nth(index).scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            screenshots.nth(index).evaluate((image: HTMLImageElement) => ({
              complete: image.complete,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
            }))
          )
          .toEqual({ complete: true, naturalWidth: 1080, naturalHeight: 1920 });
      }
      const schemas = await jsonLd(page);
      const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
      expect(software?.screenshot).toEqual(
        Array.from(
          { length: 5 },
          (_, index) =>
            `https://onnellab.com/app-assets/papira/assets/screenshots/${screenshotLocale}/0${index + 1}.png`
        )
      );
    }
  });

  test('non-Papira products retain icon social metadata and semantic screenshot alt text', async ({ page }) => {
    await page.goto('/apps/tagweaver/');

    const iconUrl = 'https://onnellab.com/app-assets/tagweaver/assets/icon/tagweaver.png';
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', iconUrl);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', iconUrl);
    await expect(page.locator('.screenshot-link img').first()).toHaveAttribute(
      'alt',
      'TagWeaver: Tag editor showing title, artist, album, rating fields and a Save button.'
    );

    const schemas = await jsonLd(page);
    const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
    expect(software?.image).toBe(iconUrl);
  });

  test('English and Korean breadcrumb schema names the apps collection accurately', async ({ page }) => {
    for (const locale of locales.slice(0, 2)) {
      await page.goto(`/apps/papira/${locale.path}`);
      const schemas = await jsonLd(page);
      const breadcrumb = schemas.find((item) => item['@type'] === 'BreadcrumbList');
      expect(breadcrumb).toBeTruthy();
      const items = breadcrumb?.itemListElement as Array<{ name: string }>;
      expect(items[1].name).toBe(locale.hreflang === 'ko' ? '앱' : 'Apps');
    }
  });

  test('Japanese and Chinese pages publish product and breadcrumb schema while keeping visible FAQ content', async ({ page }) => {
    for (const locale of locales.slice(2)) {
      const canonical = `https://onnellab.com/apps/papira/${locale.path}`;
      await page.goto(`/apps/papira/${locale.path}`);
      const schemas = await jsonLd(page);
      const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
      expect(software).toMatchObject({
        mainEntityOfPage: canonical,
        applicationCategory: 'DesignApplication',
        applicationSubCategory: 'EPUB Authoring Tool',
        publisher: {
          '@type': 'Organization',
          name: 'ONNELLAB',
          url: 'https://onnellab.com/'
        }
      });
      expect(software?.featureList).toHaveLength(7);
      expect(software).not.toHaveProperty('downloadUrl');
      expect(software).not.toHaveProperty('softwareHelp');
      expect(software).not.toHaveProperty('privacyPolicy');
      expect(schemas.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true);
      expect(schemas.some((item) => item['@type'] === 'FAQPage')).toBe(false);
      await expect(page.locator('.faq-band details')).toHaveCount(4);
    }
  });

  test('professional product translations use the audited terminology', async ({ page }) => {
    const expectedCopy = [
      {
        path: '/apps/papira/',
        includes: ['other TXT content can also be converted to EPUB', 'finished manuscript into EPUB']
      },
      {
        path: '/apps/papira/ko/',
        includes: ['개인 창작 소설', '디지털 소책자', '책 프로젝트', '# 제목 모드']
      },
      {
        path: '/apps/papira/ja/',
        includes: ['オリジナル小説', 'デジタル小冊子', '完成したTXT原稿', '「#」見出しモード', '書誌情報']
      },
      {
        path: '/apps/papira/zh-hans/',
        includes: ['面向创作者', '原创小说', '数字小册子', '联系我们']
      },
      {
        path: '/apps/papira/zh-hant/',
        includes: ['面向創作者', '原創小說', '數位小冊子', '聯絡我們']
      }
    ];

    for (const expected of expectedCopy) {
      await page.goto(expected.path);
      for (const copy of expected.includes) await expect(page.locator('main')).toContainText(copy);
    }
  });

  test('privacy translations preserve broad payment and picker wording', async ({ page }) => {
    const expectedCopy = [
      { path: '/privacy/papira/ko/', includes: ['결제 카드 정보', '은행계좌 정보'] },
      { path: '/privacy/papira/ja/', includes: ['決済カード情報', '銀行口座情報', '本ポリシーを改定し、最終更新日も更新します。'] },
      { path: '/privacy/papira/zh-hans/', includes: ['支付卡信息', '银行账户信息', '文件或照片', '隐私问题或删除请求：'] },
      { path: '/privacy/papira/zh-hant/', includes: ['支付卡資訊', '銀行帳戶資訊', '檔案或照片', '隱私問題或刪除請求：'] }
    ];

    for (const expected of expectedCopy) {
      await page.goto(expected.path);
      for (const copy of expected.includes) await expect(page.locator('main')).toContainText(copy);
    }
  });

  test('sitemap exposes every Papira locale once', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    const sitemap = await response.text();
    for (const locale of locales) {
      const productUrl = `https://onnellab.com/apps/papira/${locale.path}`;
      const privacyUrl = `https://onnellab.com/privacy/papira/${locale.path}`;
      expect(sitemap.split(`<loc>${productUrl}</loc>`).length - 1).toBe(1);
      expect(sitemap.split(`<loc>${privacyUrl}</loc>`).length - 1).toBe(1);
    }

    expect(sitemap).not.toContain('<lastmod>');
  });
});

// Backfilled article routes retain their historical identity in every locale.
for (const locale of locales) {
  test(`Papira manuscript article: ${locale.hreflang} metadata, assets and responsive layout`, async ({ page }) => {
    const segment = locale.hreflang.toLowerCase();
    const articlePath = `/blog/${segment}/prepare-txt-manuscript-for-epub/`;
    const source = fs.readFileSync(path.join(process.cwd(), 'src/content/blog', locale.hreflang, 'prepare-txt-manuscript-for-epub.md'), 'utf8');
    const title = source.match(/^title: "(.*)"$/m)?.[1];
    expect(title).toBeTruthy();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(articlePath);
      expect(response?.status()).toBe(200);
      await expect(page.locator('article h1')).toHaveText(title!);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://onnellab.com${articlePath}`);
      await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', '2026-10-04T11:34:40+09:00');
      for (const alternative of locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${alternative.hreflang}"]`)).toHaveAttribute('href', `https://onnellab.com/blog/${alternative.hreflang.toLowerCase()}/prepare-txt-manuscript-for-epub/`);
      }
      const schemas = (await jsonLd(page)).flatMap(item => Array.isArray(item) ? item : item['@graph'] ?? [item]);
      expect(schemas.find(item => item['@type'] === 'BlogPosting')?.datePublished).toBe('2026-10-04T11:34:40+09:00');
      expect(schemas.find(item => item['@type'] === 'FAQPage')?.mainEntity.length).toBeGreaterThan(0);
      await expect(page.locator('article a[href*="play.google.com/store/apps/details?id=com.onnellab.papira"]').first()).toBeVisible();
      await expect(page.locator('article img[src*="workflow-diagram"]')).toBeVisible();
      await expect.poll(() => page.locator('article img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `${locale.hreflang} article overflows at ${width}px`).toBe(false);
    }
  });
}
