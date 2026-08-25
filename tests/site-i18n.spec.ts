import { expect, test, type Page } from '@playwright/test';

const locales = [
  {
    code: 'en',
    segment: '',
    hreflang: 'en',
    homeTitle: 'ONNELLAB - Focused apps for files and creative work',
    homeDescription: 'ONNELLAB makes focused apps for managing files, media, creative work, and everyday tasks.',
    homeHeading: 'Small tools. Calmly made.',
    featuredTitle: 'Organize music tags with TagWeaver.',
    featuredBody: 'Save MP3 and FLAC metadata, artwork, and lyrics to local files, and update multiple tracks at once.',
    navLabel: 'Navigation',
    platformsLabel: 'Platforms',
    featuredIconAlt: 'TagWeaver app icon',
    blogHref: '/blog/',
    blogText: 'Blog',
    languageMenuLabel: 'Language: English',
    currentLanguage: 'English'
  },
  {
    code: 'ko',
    segment: 'ko/',
    hreflang: 'ko',
    homeTitle: 'ONNELLAB - 파일과 창작 작업을 위한 앱',
    homeDescription: 'ONNELLAB은 파일과 미디어를 관리하고 창작 작업과 일상의 일을 돕는 목적이 분명한 앱을 만들어요.',
    homeHeading: '작은 도구를, 차분하게 만들어요.',
    featuredTitle: 'TagWeaver로 음악 태그를 직접 정리해요.',
    featuredBody: 'MP3·FLAC의 정보와 커버, 가사를 파일에 저장하고 여러 곡을 한 번에 수정해요.',
    navLabel: '탐색',
    platformsLabel: '플랫폼',
    featuredIconAlt: 'TagWeaver 앱 아이콘',
    blogHref: '/blog/ko/',
    blogText: '블로그',
    languageMenuLabel: '언어: 한국어',
    currentLanguage: '한국어'
  },
  {
    code: 'ja',
    segment: 'ja/',
    hreflang: 'ja',
    homeTitle: 'ONNELLAB - ファイルと創作作業のためのアプリ',
    homeDescription: 'ONNELLABは、ファイルやメディアの管理、創作、日々の作業に役立つ、目的の明確なアプリをつくります。',
    homeHeading: '小さな道具を、 静かに。',
    featuredTitle: 'TagWeaverで音楽タグを整理。',
    featuredBody: 'MP3・FLACの情報、ジャケット、歌詞をローカルファイルに保存し、複数曲をまとめて編集できます。',
    navLabel: 'ナビゲーション',
    platformsLabel: '対応プラットフォーム',
    featuredIconAlt: 'TagWeaverアプリアイコン',
    blogHref: '/blog/ja/',
    blogText: 'ブログ',
    languageMenuLabel: '言語: 日本語',
    currentLanguage: '日本語'
  },
  {
    code: 'zh-Hans',
    segment: 'zh-hans/',
    hreflang: 'zh-Hans',
    homeTitle: 'ONNELLAB - 专注于文件与创作的应用',
    homeDescription: 'ONNELLAB 打造用途明确的应用，帮助你管理文件与媒体，完成创作和日常任务。',
    homeHeading: '把小工具，安静地做好。',
    featuredTitle: '用 TagWeaver 整理音乐标签。',
    featuredBody: '将 MP3 与 FLAC 信息、封面和歌词保存到本地文件，并批量编辑多首歌曲。',
    navLabel: '导航',
    platformsLabel: '支持平台',
    featuredIconAlt: 'TagWeaver 应用图标',
    blogHref: '/blog/zh-hans/',
    blogText: '博客',
    languageMenuLabel: '语言：简体中文',
    currentLanguage: '简体中文'
  },
  {
    code: 'zh-Hant',
    segment: 'zh-hant/',
    hreflang: 'zh-Hant',
    homeTitle: 'ONNELLAB - 專注於檔案與創作的應用程式',
    homeDescription: 'ONNELLAB 打造用途明確的應用程式，幫助你管理檔案與媒體，完成創作與日常工作。',
    homeHeading: '把小工具，安靜地做好。',
    featuredTitle: '用 TagWeaver 整理音樂標籤。',
    featuredBody: '將 MP3 與 FLAC 資訊、封面與歌詞儲存到本機檔案，並批次編輯多首歌曲。',
    navLabel: '導覽',
    platformsLabel: '支援平台',
    featuredIconAlt: 'TagWeaver 應用程式圖示',
    blogHref: '/blog/zh-hant/',
    blogText: '部落格',
    languageMenuLabel: '語言：繁體中文',
    currentLanguage: '繁體中文'
  }
] as const;

const homeSemanticTerms = {
  en: {
    seo: { file: /files?/i, creative: /creative/i, app: /apps?/i },
    featured: {
      brand: /TagWeaver/,
      mp3: /MP3/,
      flac: /FLAC/,
      localFile: /local files?/i,
      multiTrack: /multiple tracks?/i
    }
  },
  ko: {
    seo: { file: /파일/, creative: /창작/, app: /앱/ },
    featured: { brand: /TagWeaver/, mp3: /MP3/, flac: /FLAC/, localFile: /파일에 저장/, multiTrack: /여러 곡.*한 번에/ }
  },
  ja: {
    seo: { file: /ファイル/, creative: /創作/, app: /アプリ/ },
    featured: { brand: /TagWeaver/, mp3: /MP3/, flac: /FLAC/, localFile: /ローカルファイルに保存/, multiTrack: /複数(?:の)?曲.*まとめて/ }
  },
  'zh-Hans': {
    seo: { file: /文件/, creative: /创作/, app: /应用/ },
    featured: { brand: /TagWeaver/, mp3: /MP3/, flac: /FLAC/, localFile: /本地文件/, multiTrack: /批量.*多首歌曲/ }
  },
  'zh-Hant': {
    seo: { file: /檔案/, creative: /創作/, app: /應用程式/ },
    featured: { brand: /TagWeaver/, mp3: /MP3/, flac: /FLAC/, localFile: /本機檔案/, multiTrack: /批次.*多首歌曲/ }
  }
} as const;

const localizedPath = (base: string, segment: string) => (segment ? `${base}${segment}` : base);

async function setBrowserLocales(
  page: Page,
  languages: string[],
  language = languages[0] ?? ''
) {
  await page.addInitScript(
    ({ languages, language }) => {
      Object.defineProperty(navigator, 'languages', { get: () => languages });
      Object.defineProperty(navigator, 'language', { get: () => language });
    },
    { languages, language }
  );
}

test.describe('nine-language site core regression', () => {
  test('home pages publish shared large social preview metadata', async ({ page }) => {
    for (const locale of locales) {
      const path = locale.segment ? `/${locale.segment}` : '/';
      await page.goto(path);

      await expect.soft(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        'https://onnellab.github.io/social-card.png'
      );
      await expect.soft(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        'https://onnellab.github.io/social-card.png'
      );
      await expect.soft(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image'
      );
      await expect.soft(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io${path}`
      );
      await expect.soft(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/favicon.svg?v=20260713-ol-classic-v2'
      );
    }
  });

  test('home social preview asset is a 1200 by 675 PNG', async ({ request }) => {
    const response = await request.get('/social-card.png');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');

    const png = await response.body();
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(675);
  });

  test('product pages keep their product-specific social preview metadata', async ({ page }) => {
    await page.goto('/apps/tagweaver/');
    const productImage = 'https://onnellab.github.io/app-assets/tagweaver/assets/icon/tagweaver.png';
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', productImage);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', productImage);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  for (const locale of locales) {
    test(`home ${locale.code}`, async ({ page }) => {
      const path = locale.segment ? `/${locale.segment}` : '/';
      await page.goto(path);
      await expect(page).toHaveTitle(locale.homeTitle);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', locale.homeDescription);
      const semanticTerms = homeSemanticTerms[locale.code];
      const renderedTitle = await page.title();
      const renderedDescription = await page.locator('meta[name="description"]').getAttribute('content');
      for (const term of Object.values(semanticTerms.seo)) {
        expect(renderedTitle).toMatch(term);
        expect(renderedDescription).toMatch(term);
      }
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('.home-hero h1')).toHaveText(locale.homeHeading);
      const navigation = page.getByRole('navigation', { name: locale.navLabel, exact: true });
      await expect(navigation).toHaveCount(1);
      const blog = navigation.getByRole('link', { name: locale.blogText, exact: true });
      await expect(blog).toHaveAttribute('href', locale.blogHref);
      await expect(blog).toHaveText(locale.blogText);
      await expect(blog).toHaveAccessibleName(locale.blogText);
      const languageMenu = page.locator('.locale-menu summary');
      await expect(languageMenu).toHaveAccessibleName(locale.languageMenuLabel);
      await expect(languageMenu).toHaveText(locale.currentLanguage);
      const featured = page.locator('a.featured');
      await expect(featured).toHaveAttribute('href', `/apps/tagweaver/${locale.segment}`);
      await expect(featured.locator('h2')).toHaveText(locale.featuredTitle);
      await expect(featured.locator('.featured-copy > p')).toHaveText(locale.featuredBody);
      await expect(featured.getByRole('img', { name: locale.featuredIconAlt, exact: true })).toHaveCount(1);
      await expect(page.getByRole('group', { name: locale.platformsLabel, exact: true })).toHaveCount(5);
      const renderedFeaturedTitle = await featured.locator('h2').innerText();
      const renderedFeaturedBody = await featured.locator('.featured-copy > p').innerText();
      const renderedFeaturedCopy = `${renderedFeaturedTitle}\n${renderedFeaturedBody}`;
      for (const term of Object.values(semanticTerms.featured)) {
        expect(renderedFeaturedCopy).toMatch(term);
      }
      const websiteSchema = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
        scripts
          .flatMap((script) => {
            const value = JSON.parse(script.textContent ?? 'null');
            return Array.isArray(value) ? value : [value];
          })
          .find((entry) => entry?.['@type'] === 'WebSite')
      );
      expect(websiteSchema?.description).toBe(locale.homeDescription);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io${path}`
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/zh-hant/'
      );
    });

    for (const section of ['apps', 'about', 'privacy', 'terms'] as const) {
      test(`${section} ${locale.code}`, async ({ page }) => {
        const path = localizedPath(`/${section}/`, locale.segment);
        await page.goto(path);
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `https://onnellab.github.io${path}`
        );
        await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
      });
    }
  }

  for (const { browserLocale, expectedPath } of [
    { browserLocale: 'ko-KR', expectedPath: '/ko/' },
    { browserLocale: 'ja-JP', expectedPath: '/ja/' },
    { browserLocale: 'zh-CN', expectedPath: '/zh-hans/' },
    { browserLocale: 'zh-Hans', expectedPath: '/zh-hans/' },
    { browserLocale: 'zh-TW', expectedPath: '/zh-hant/' },
    { browserLocale: 'zh-Hant', expectedPath: '/zh-hant/' },
    { browserLocale: 'en-US', expectedPath: '/' },
    { browserLocale: 'pt-BR', expectedPath: '/pt-br/' },
    { browserLocale: 'de-DE', expectedPath: '/de/' },
    { browserLocale: 'fr-FR', expectedPath: '/fr/' },
    { browserLocale: 'es-ES', expectedPath: '/es/' }
  ]) {
    test(`root follows system locale ${browserLocale}`, async ({ page }) => {
      await setBrowserLocales(page, [browserLocale]);
      await page.goto('/');
      await expect.poll(() => new URL(page.url()).pathname).toBe(expectedPath);
    });
  }

  test('checks navigator languages in order and skips unsupported locales', async ({ page }) => {
    await setBrowserLocales(page, ['it-IT', 'ja-JP'], 'ko-KR');
    await page.goto('/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/ja/');
  });

  test('falls back from navigator languages to navigator language', async ({ page }) => {
    await setBrowserLocales(page, ['it-IT'], 'ko-KR');
    await page.goto('/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/ko/');
  });

  test('normalizes browser locale case and underscores', async ({ page }) => {
    await setBrowserLocales(page, ['ZH_hAnT']);
    await page.goto('/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/zh-hant/');
  });

  for (const { storedLocale, expectedPath } of [
    { storedLocale: 'ja', expectedPath: '/ja/' },
    { storedLocale: 'en', expectedPath: '/' }
  ]) {
    test(`valid stored ${storedLocale} overrides Korean system locale`, async ({ page }) => {
      await setBrowserLocales(page, ['ko-KR']);
      await page.addInitScript((locale) => localStorage.setItem('onnellab.locale', locale), storedLocale);
      await page.goto('/');
      await expect.poll(() => new URL(page.url()).pathname).toBe(expectedPath);
    });
  }

  test('invalid stored locale falls back to the system locale', async ({ page }) => {
    await setBrowserLocales(page, ['ko-KR']);
    await page.addInitScript(() => localStorage.setItem('onnellab.locale', 'it'));
    await page.goto('/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/ko/');
  });

  test('root stays hidden while its localized redirect is loading', async ({ page }) => {
    await setBrowserLocales(page, ['ko-KR']);
    let releaseLocalizedResponse = () => {};
    const localizedResponseReleased = new Promise<void>((resolve) => {
      releaseLocalizedResponse = resolve;
    });
    let signalLocalizedRequest = () => {};
    const localizedRequestStarted = new Promise<void>((resolve) => {
      signalLocalizedRequest = resolve;
    });
    await page.route('**/ko/', async (route) => {
      signalLocalizedRequest();
      await localizedResponseReleased;
      await route.continue();
    });

    await page.goto('/about/');
    await page.evaluate(() => {
      const frame = document.createElement('iframe');
      frame.src = '/';
      document.body.append(frame);
    });
    await localizedRequestStarted;
    const visibility = await page.evaluate(() => {
      const frame = document.querySelector('iframe');
      if (!frame?.contentDocument) return null;
      return getComputedStyle(frame.contentDocument.documentElement).visibility;
    });
    releaseLocalizedResponse();
    expect(visibility).toBe('hidden');
    await expect.poll(() => page.frames().some((frame) => new URL(frame.url()).pathname === '/ko/')).toBe(true);
    const localizedFrame = page.frames().find((frame) => new URL(frame.url()).pathname === '/ko/');
    expect(await localizedFrame?.locator('html').getAttribute('lang')).toBe('ko');
    expect(await localizedFrame?.locator('html').isVisible()).toBe(true);
  });

  test('direct non-root routes never redirect for browser or stored locale', async ({ page }) => {
    await setBrowserLocales(page, ['ko-KR']);
    await page.addInitScript(() => localStorage.setItem('onnellab.locale', 'ja'));
    await page.goto('/apps/tagweaver/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/apps/tagweaver/');
  });

  test('manual language choice is remembered', async ({ page }) => {
    await page.goto('/');
    await page.locator('.locale-menu summary').click();
    await page.locator('.locale-menu-panel a[data-locale-choice="ja"]').click();
    await expect(page).toHaveURL(/\/ja\/$/);
    expect(await page.evaluate(() => localStorage.getItem('onnellab.locale'))).toBe('ja');
  });

  test('every core app detail keeps content while exposing nine-language navigation', async ({ page }) => {
    const cases = [
      { segment: '', lang: 'en', allApps: 'All apps', subtitle: 'Offline MP3/FLAC Tag Editor' },
      { segment: 'ko/', lang: 'ko', allApps: '모든 앱', subtitle: 'MP3/FLAC 오프라인 태그 편집기' },
      { segment: 'ja/', lang: 'ja', allApps: 'すべてのアプリ', subtitle: 'オフラインMP3/FLACタグエディター' },
      { segment: 'zh-hans/', lang: 'zh-Hans', allApps: '全部应用', subtitle: '离线 MP3/FLAC 标签编辑器' },
      { segment: 'zh-hant/', lang: 'zh-Hant', allApps: '全部應用程式', subtitle: '離線 MP3/FLAC 標籤編輯器' }
    ] as const;

    for (const item of cases) {
      const path = `/apps/tagweaver/${item.segment}`;
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', item.lang);
      await expect(page.locator('.apps-link')).toHaveText(item.allApps);
      await expect(page.locator('.apps-link')).toHaveAttribute('href', `/apps/${item.segment}`);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
      await expect(page.locator('.intro')).toHaveText(item.subtitle);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io${path}`
      );
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
        'href',
        'https://onnellab.github.io/apps/tagweaver/zh-hant/'
      );
    }
  });

  test('Japanese product prose remains paragraphs instead of becoming section headings', async ({ page }) => {
    const cases = [
      {
        path: '/apps/segra/ja/',
        sentence: 'ログイン、アカウント作成、ファイルのアップロード、広告、追跡はありません。'
      },
      {
        path: '/apps/vaultxt/ja/',
        sentence: 'VaultXTは、大容量ファイル向けに設計された高速で軽量なテキストエディターです。'
      }
    ];

    for (const item of cases) {
      await page.goto(item.path);
      await expect(page.locator('.copy-column p').filter({ hasText: item.sentence })).toHaveCount(1);
      await expect(page.locator('.copy-column h2').filter({ hasText: item.sentence })).toHaveCount(0);
    }
  });

  test('all legacy apps publish complete Japanese and Chinese detail routes', async ({ page }) => {
    const localizedSubtitles = {
      ja: {
        aligna: 'ファイル名一括変更ツール',
        clipnest: 'キーボード貼り付け・定型文',
        melivra: 'ローカル音源ライブラリプレーヤー',
        quivra: 'メディア変換ツール',
        segra: '音声カット・結合ツール',
        tagweaver: 'オフラインMP3/FLACタグエディター',
        vaultxt: '大容量TXTエディター'
      },
      'zh-hans': {
        aligna: '批量文件重命名工具',
        clipnest: '键盘粘贴与常用文本',
        melivra: '本地音频库播放器',
        quivra: '媒体转换器',
        segra: '音频剪切与合并工具',
        tagweaver: '离线 MP3/FLAC 标签编辑器',
        vaultxt: '大文件 TXT 编辑器'
      },
      'zh-hant': {
        aligna: '批次檔案重新命名工具',
        clipnest: '鍵盤貼上與常用文字',
        melivra: '本機音訊資料庫播放器',
        quivra: '媒體轉換工具',
        segra: '音訊剪輯與合併工具',
        tagweaver: '離線 MP3/FLAC 標籤編輯器',
        vaultxt: '大型 TXT 編輯器'
      }
    } as const;
    const htmlLang = { ja: 'ja', 'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant' } as const;

    for (const [segment, apps] of Object.entries(localizedSubtitles)) {
      for (const [slug, subtitle] of Object.entries(apps)) {
        const path = `/apps/${slug}/${segment}/`;
        await page.goto(path);
        await expect(page.locator('html')).toHaveAttribute('lang', htmlLang[segment as keyof typeof htmlLang]);
        await expect(page.locator('.intro')).toHaveText(subtitle);
        await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
        await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `https://onnellab.github.io${path}`
        );
        await expect(page.locator('.support-links a').first()).toHaveAttribute(
          'href',
          `https://onnellab.github.io/privacy/${slug}/${segment}`
        );
        const screenshot = page.locator('.screenshot-link img').first();
        if (await screenshot.count()) {
          await expect(screenshot).toHaveAttribute('src', new RegExp(`/app-assets/${slug}/assets/screenshots/en/`));
        }
      }
    }
  });

  test('sitemap contains all common locale routes', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    const sitemap = await response.text();
    for (const locale of locales) {
      const homeUrl = `https://onnellab.github.io/${locale.segment}`;
      expect(sitemap.split(`<loc>${homeUrl}</loc>`).length - 1).toBe(1);
      for (const section of ['apps', 'about', 'privacy', 'terms']) {
        const url = `https://onnellab.github.io/${section}/${locale.segment}`;
        expect(sitemap.split(`<loc>${url}</loc>`).length - 1).toBe(1);
      }
    }
  });
});
