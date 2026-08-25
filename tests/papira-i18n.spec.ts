import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const locales = [
  { path: '', hreflang: 'en', title: 'Papira - Offline TXT to EPUB Maker' },
  { path: 'ko/', hreflang: 'ko', title: 'Papira - 오프라인 TXT EPUB 제작 도구' },
  { path: 'ja/', hreflang: 'ja', title: 'Papira - オフラインTXT・EPUB作成ツール' },
  { path: 'zh-hans/', hreflang: 'zh-Hans', title: 'Papira - 离线 TXT 转 EPUB 制作工具' },
  { path: 'zh-hant/', hreflang: 'zh-Hant', title: 'Papira - 離線 TXT 轉 EPUB 製作工具' }
] as const;

const privacyLocales = [
  { path: '', hreflang: 'en', htmlLang: 'en', keyPhrases: ['Papira values your privacy.', 'App store services and payment information', 'Privacy questions or deletion requests:'] },
  { path: 'ko/', hreflang: 'ko', htmlLang: 'ko', keyPhrases: ['Papira는 사용자의 개인정보를 중요하게 생각하며', '앱 스토어 서비스 및 결제 정보', '개인정보 관련 문의 또는 삭제 요청:'] },
  { path: 'ja/', hreflang: 'ja', htmlLang: 'ja', keyPhrases: ['Papiraはユーザーのプライバシーを大切にしています。', 'App Storeサービスと決済情報', 'プライバシーに関するお問い合わせまたは削除依頼：'] },
  { path: 'zh-hans/', hreflang: 'zh-Hans', htmlLang: 'zh-Hans', keyPhrases: ['Papira 重视你的隐私。', '应用商店服务与支付信息', '隐私问题或删除请求：'] },
  { path: 'zh-hant/', hreflang: 'zh-Hant', htmlLang: 'zh-Hant', keyPhrases: ['Papira 重視你的隱私。', 'App Store 服務與支付資訊', '隱私問題或刪除請求：'] },
  { path: 'pt-br/', hreflang: 'pt-BR', htmlLang: 'pt-BR', keyPhrases: ['O Papira valoriza a sua privacidade.', 'Serviços da loja de aplicativos e informações de pagamento', 'Perguntas sobre privacidade ou solicitações de exclusão:'] },
  { path: 'de/', hreflang: 'de', htmlLang: 'de', keyPhrases: ['Papira schützt Ihre Privatsphäre.', 'App-Store-Dienste und Zahlungsinformationen', 'Fragen zum Datenschutz oder Löschanträge:'] },
  { path: 'fr/', hreflang: 'fr', htmlLang: 'fr', keyPhrases: ['Papira respecte votre vie privée.', 'Services des boutiques d’applications et informations de paiement', 'Questions relatives à la vie privée ou demandes de suppression :'] },
  { path: 'es/', hreflang: 'es', htmlLang: 'es', keyPhrases: ['Papira respeta tu privacidad.', 'Servicios de las tiendas de aplicaciones e información de pago', 'Preguntas sobre privacidad o solicitudes de eliminación:'] }
] as const;

const alternateUrls = {
  en: 'https://onnellab.github.io/apps/papira/',
  ko: 'https://onnellab.github.io/apps/papira/ko/',
  ja: 'https://onnellab.github.io/apps/papira/ja/',
  'zh-Hans': 'https://onnellab.github.io/apps/papira/zh-hans/',
  'zh-Hant': 'https://onnellab.github.io/apps/papira/zh-hant/',
  'x-default': 'https://onnellab.github.io/apps/papira/'
} as const;

const privacyAlternateUrls = Object.fromEntries(
  privacyLocales.map((locale) => [locale.hreflang, `https://onnellab.github.io/privacy/papira/${locale.path}`])
) as Record<string, string>;
privacyAlternateUrls['x-default'] = privacyAlternateUrls.en;

const screenshotAlts = {
  en: [
    'Papira home screen with options to start a full book project or create a quick EPUB',
    'Papira screen for selecting a work type and configuring the cover',
    'Papira screen for reviewing book metadata and creating the EPUB'
  ],
  ko: [
    '책 프로젝트를 시작하거나 빠르게 EPUB을 만들 수 있는 Papira 홈 화면',
    '작품 유형을 선택하고 표지를 설정하는 Papira 화면',
    '책 정보를 검토하고 EPUB을 만드는 Papira 화면'
  ],
  ja: [
    '本格的な本のプロジェクトまたはクイックEPUBを選ぶPapiraのホーム画面',
    '作品タイプを選択し、表紙を設定するPapiraの画面',
    '書誌情報を確認してEPUBを作成するPapiraの画面'
  ],
  'zh-Hans': [
    '可选择完整图书项目或快速制作 EPUB 的 Papira 首页',
    '选择作品类型并配置封面的 Papira 页面',
    '检查图书元数据并创建 EPUB 的 Papira 页面'
  ],
  'zh-Hant': [
    '可選擇完整書籍專案或快速製作 EPUB 的 Papira 首頁',
    '選擇作品類型並設定封面的 Papira 頁面',
    '檢查書籍中繼資料並建立 EPUB 的 Papira 頁面'
  ]
} as const;

async function jsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? 'null'))
  );
}

test.describe('Papira five-language launch surface', () => {
  test('Papira routes and sitemap depend only on active shared page sources', () => {
    const obsoleteComponent = ['Papira', 'Page.astro'].join('');
    const obsoletePage = path.resolve(process.cwd(), 'src/components', obsoleteComponent);
    expect(fs.existsSync(obsoletePage)).toBe(false);

    const sitemapSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/pages/sitemap.xml.ts'),
      'utf8'
    );
    const workflowSource = fs.readFileSync(
      path.resolve(process.cwd(), '.github/workflows/i18n-smoke.yml'),
      'utf8'
    );
    expect(sitemapSource).not.toContain(obsoleteComponent);
    expect(workflowSource).not.toContain(obsoleteComponent);
    for (const activeSource of [
      'src/components/HomePage.astro',
      'src/components/AppsIndex.astro',
      'src/components/AboutPage.astro',
      'src/components/PrivacyIndex.astro',
      'src/components/CorePage.astro',
      'src/lib/papira.ts',
      'src/components/ProductTemplate.astro'
    ]) {
      expect(sitemapSource).toContain(activeSource);
    }
    expect(sitemapSource).toContain('sourceLastmod(corePageSources[page])');
    expect(sitemapSource).not.toContain('commonLastmod');

    const papiraRoutes = [
      'src/pages/apps/papira/index.astro',
      'src/pages/apps/papira/ko/index.astro',
      'src/pages/apps/papira/ja/index.astro',
      'src/pages/apps/papira/zh-hans/index.astro',
      'src/pages/apps/papira/zh-hant/index.astro'
    ];
    for (const route of papiraRoutes) {
      const source = fs.readFileSync(path.resolve(process.cwd(), route), 'utf8');
      expect(source).toContain('ProductTemplate');
      expect(source).not.toContain(obsoleteComponent.replace('.astro', ''));
    }
  });

  for (const locale of locales) {
    test(`Papira product page ${locale.hreflang}`, async ({ page }) => {
      await page.goto(`/apps/papira/${locale.path}`);
      await expect(page).toHaveTitle(locale.title);
      await expect(page.locator('h1')).toHaveText('Papira');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io/apps/papira/${locale.path}`
      );
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/papira/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="ja"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/papira/ja/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hans"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/papira/zh-hans/'
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/papira/zh-hant/'
      );
      for (const [hreflang, href] of Object.entries(alternateUrls)) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveAttribute(
          'href',
          href
        );
      }
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
    });

  }

  for (const locale of privacyLocales) {
    test(`Papira privacy page ${locale.hreflang} publishes the nine-language contract`, async ({ page }) => {
      await page.goto(`/privacy/papira/${locale.path}`);
      await expect(page.locator('main')).toContainText('Papira');
      await expect(page.locator('html')).toHaveAttribute('lang', locale.htmlLang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io/privacy/papira/${locale.path}`
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

  test('general site pages keep the established five-language locale menu', async ({ page }) => {
    for (const route of ['/', '/apps/', '/about/', '/privacy/', '/terms/']) {
      await page.goto(route);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
    }
  });

  test('localized privacy hubs expose Papira', async ({ page }) => {
    for (const path of ['/privacy/ja/', '/privacy/zh-hans/', '/privacy/zh-hant/']) {
      await page.goto(path);
      await expect(page.locator('[data-policy-row]').filter({ hasText: 'Papira' })).toHaveCount(1);
    }
  });

  test('English and Korean product copy renders Markdown structure as semantic HTML', async ({ page }) => {
    const expectations = [
      {
        path: '/apps/papira/',
        h2: 'Two focused ways to create',
        h3: '1. Quick EPUB',
        item:
          'Dedicated presets for fanfiction, serialized fiction, personal novels, digital zines, and TRPG scenarios, with support for other TXT content'
      },
      {
        path: '/apps/papira/ko/',
        h2: '두 가지 제작 흐름',
        h3: '1. 빠르게 만들기',
        item:
          '팬픽·연재소설·개인 창작 소설·디지털 소책자·TRPG 시나리오에 특화된 작품 유형과 그 밖의 TXT 콘텐츠 지원'
      }
    ];

    for (const expected of expectations) {
      await page.goto(expected.path);
      await expect(page.getByRole('heading', { level: 2, name: expected.h2 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 3, name: expected.h3 })).toHaveCount(1);
      await expect(page.getByRole('listitem').filter({ hasText: expected.item })).toHaveCount(1);
      const leakedMarkers = await page.locator('h2, h3').allTextContents();
      expect(leakedMarkers.filter((text) => /^(?:##|###|- )/.test(text.trim()))).toEqual([]);
    }
  });

  test('every locale numbers the two Papira creation flows in order', async ({ page }) => {
    const expectations = [
      { path: '/apps/papira/', headings: ['1. Quick EPUB', '2. Book project'] },
      { path: '/apps/papira/ko/', headings: ['1. 빠르게 만들기', '2. 책 프로젝트'] },
      { path: '/apps/papira/ja/', headings: ['1. すぐにEPUB化', '2. 作品EPUBを作成'] },
      { path: '/apps/papira/zh-hans/', headings: ['1. 快速制作', '2. 制作作品 EPUB'] },
      { path: '/apps/papira/zh-hant/', headings: ['1. 快速製作', '2. 製作作品 EPUB'] }
    ];

    for (const expected of expectations) {
      await page.goto(expected.path);
      await expect(page.locator('.copy-column h3')).toHaveText(expected.headings);
    }
  });

  test('every locale presents the named formats as specializations rather than conversion limits', async ({ page }) => {
    const expectations = [
      {
        path: '/apps/papira/',
        lead:
          'Papira assembles any finished TXT manuscript into a well-structured EPUB. It includes dedicated flows for fanfiction, serialized fiction, personal novels, digital zines, and TRPG scenarios, while other TXT content can also be converted to EPUB.',
        feature:
          'Dedicated presets for fanfiction, serialized fiction, personal novels, digital zines, and TRPG scenarios, with support for other TXT content',
        faq:
          'Any finished TXT content can be converted to EPUB. The dedicated presets simply make common creative workflows faster.'
      },
      {
        path: '/apps/papira/ko/',
        lead:
          'Papira는 완성된 TXT 원고를 정돈된 EPUB 파일로 만들어요. 팬픽·연재소설·개인 창작 소설·디지털 소책자·TRPG 시나리오에 특화된 제작 흐름을 제공하지만, 그 밖의 TXT 콘텐츠도 EPUB으로 변환할 수 있어요.',
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
      await expect(page.getByRole('listitem').filter({ hasText: expected.feature })).toHaveCount(1);
      await expect(main).toContainText(expected.faq);
    }
  });

  test('every Papira hero leads with a concise localized TXT-to-EPUB signal', async ({ page }) => {
    const expectations = [
      { path: '/apps/papira/', first: 'Finished TXT → EPUB', category: 'fanfiction' },
      { path: '/apps/papira/ko/', first: '완성된 TXT → EPUB', category: '팬픽' },
      { path: '/apps/papira/ja/', first: '完成したTXT → EPUB', category: '二次創作' },
      { path: '/apps/papira/zh-hans/', first: '完成的 TXT → EPUB', category: '同人文' },
      { path: '/apps/papira/zh-hant/', first: '完成的 TXT → EPUB', category: '同人文' }
    ];

    for (const expected of expectations) {
      await page.goto(expected.path);
      const signals = page.locator('.hero .task-preview .task-row strong');
      await expect(signals).toHaveCount(3);
      await expect(signals.first()).toHaveText(expected.first);
      await expect(page.locator('.hero .task-preview')).not.toContainText(expected.category);
      expect((await signals.first().innerText()).length).toBeLessThanOrEqual(20);
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

  test('legacy product copy keeps its established section and list rendering', async ({ page }) => {
    await page.goto('/apps/tagweaver/');
    await expect(page.getByRole('heading', { level: 2, name: 'Supported editing' })).toHaveCount(1);
    await expect(page.getByRole('listitem').filter({ hasText: 'Edit tag fields' })).toHaveCount(1);
    await expect(page.locator('.hero .task-row strong')).toHaveText([
      'Edit tag fields',
      'Manage album artwork',
      'Add or edit lyrics'
    ]);
  });

  test('Korean Papira links and schema use the canonical privacy URL exactly once', async ({ page }) => {
    const privacyUrl = 'https://onnellab.github.io/privacy/papira/ko/';
    await page.goto('/apps/papira/ko/');
    const privacyLinks = page.getByRole('link', { name: '개인정보 처리방침' });
    await expect(privacyLinks).toHaveCount(2);
    for (const link of await privacyLinks.all()) {
      await expect(link).toHaveAttribute('href', privacyUrl);
    }

    const schemas = await jsonLd(page);
    const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
    expect(software?.privacyPolicy).toBe(privacyUrl);
    expect(JSON.stringify(schemas)).not.toContain('/ko/ko/');
  });

  test('unknown Papira commerce data is omitted from SoftwareApplication schema', async ({ page }) => {
    await page.goto('/apps/papira/');
    const schemas = await jsonLd(page);
    const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
    expect(software).toBeTruthy();
    for (const key of ['isAccessibleForFree', 'downloadUrl', 'installUrl', 'sameAs', 'offers']) {
      expect(software).not.toHaveProperty(key);
    }
  });

  test('Papira icon is served from a repository-contained public asset', async ({ page }) => {
    const iconPath = '/app-assets/papira/icon.png';
    await page.goto('/apps/papira/');
    await expect(page.locator('.identity img')).toHaveAttribute('src', iconPath);
    expect(fs.existsSync(path.resolve(process.cwd(), 'public', iconPath.replace(/^\//, '')))).toBe(true);
  });

  test('every Papira locale publishes the large PNG social card while schema keeps the square icon', async ({ page }) => {
    const socialImageUrl = 'https://onnellab.github.io/app-assets/papira/social-card.png';
    const iconUrl = 'https://onnellab.github.io/app-assets/papira/icon.png';

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
      await expect(screenshots).toHaveCount(3);
      expect(await screenshots.evaluateAll((images) => images.map((image) => image.getAttribute('alt'))))
        .toEqual([...screenshotAlts[screenshotLocale]]);
      expect(await page.locator('.viewer-thumb img').evaluateAll((images) =>
        images.map((image) => image.getAttribute('alt'))
      )).toEqual(['', '', '']);
      for (let index = 0; index < 3; index += 1) {
        const source = `/app-assets/papira/assets/screenshots/${screenshotLocale}/0${index + 1}.png`;
        await expect(screenshots.nth(index)).toHaveAttribute('src', source);
        await expect(screenshots.nth(index)).toHaveAttribute('width', '1080');
        await expect(screenshots.nth(index)).toHaveAttribute('height', '2168');
        expect(fs.existsSync(path.resolve(process.cwd(), 'public', source.replace(/^\//, '')))).toBe(true);
        await expect
          .poll(() =>
            screenshots.nth(index).evaluate((image: HTMLImageElement) => ({
              complete: image.complete,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
            }))
          )
          .toEqual({ complete: true, naturalWidth: 1080, naturalHeight: 2168 });
      }
    }
  });

  test('non-Papira products retain icon social metadata and generic screenshot alt fallback', async ({ page }) => {
    await page.goto('/apps/tagweaver/');

    const iconUrl = 'https://onnellab.github.io/app-assets/tagweaver/assets/icon/tagweaver.png';
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', iconUrl);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', iconUrl);
    await expect(page.locator('.screenshot-link img').first()).toHaveAttribute(
      'alt',
      'TagWeaver Screenshots 1'
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

  test('Japanese and Chinese pages publish complete product, breadcrumb, and FAQ schema', async ({ page }) => {
    for (const locale of locales.slice(2)) {
      const canonical = `https://onnellab.github.io/apps/papira/${locale.path}`;
      await page.goto(`/apps/papira/${locale.path}`);
      const schemas = await jsonLd(page);
      const software = schemas.find((item) => item['@type'] === 'SoftwareApplication');
      expect(software).toMatchObject({
        mainEntityOfPage: canonical,
        privacyPolicy: `https://onnellab.github.io/privacy/papira/${locale.path}`,
        softwareHelp: 'mailto:onnellab.app@gmail.com',
        publisher: {
          '@type': 'Organization',
          name: 'ONNELLAB',
          url: 'https://onnellab.github.io/'
        }
      });
      expect(software?.featureList).toHaveLength(5);
      expect(schemas.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true);
      expect(schemas.some((item) => item['@type'] === 'FAQPage')).toBe(true);
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
        includes: ['面向创作者', '两种简洁的制作方式', '原创小说', '数字小册子', '联系我们']
      },
      {
        path: '/apps/papira/zh-hant/',
        includes: ['面向創作者', '兩種簡潔的製作方式', '原創小說', '數位小冊子', '聯絡我們']
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
      const productUrl = `https://onnellab.github.io/apps/papira/${locale.path}`;
      const privacyUrl = `https://onnellab.github.io/privacy/papira/${locale.path}`;
      expect(sitemap.split(`<loc>${productUrl}</loc>`).length - 1).toBe(1);
      expect(sitemap.split(`<loc>${privacyUrl}</loc>`).length - 1).toBe(1);
    }

    const papiraSourceFiles = [
      'src/lib/papira.ts',
      'src/components/ProductTemplate.astro'
    ];
    const expectedLastmod = papiraSourceFiles
      .map((source) => fs.statSync(path.resolve(process.cwd(), source)).mtime)
      .sort((left, right) => left.getTime() - right.getTime())
      .at(-1)
      ?.toISOString()
      .slice(0, 10);
    expect(expectedLastmod).toBeTruthy();
    for (const locale of locales) {
      const productUrl = `https://onnellab.github.io/apps/papira/${locale.path}`;
      const entry = sitemap.match(new RegExp(`<loc>${productUrl}</loc>\\s*<lastmod>([^<]+)</lastmod>`));
      expect(entry?.[1]).toBe(expectedLastmod);
    }
  });
});
