import { expect, test, type Page } from '@playwright/test';

const locales = [
  { code: 'en', segment: '', hreflang: 'en', homeTitle: 'ONNELLAB - Calm, focused software' },
  { code: 'ko', segment: 'ko/', hreflang: 'ko', homeTitle: 'ONNELLAB - 차분하고 목적이 분명한 소프트웨어' },
  { code: 'ja', segment: 'ja/', hreflang: 'ja', homeTitle: 'ONNELLAB - 静かで目的の明確なソフトウェア' },
  { code: 'zh-Hans', segment: 'zh-hans/', hreflang: 'zh-Hans', homeTitle: 'ONNELLAB - 安静而专注的软件' },
  { code: 'zh-Hant', segment: 'zh-hant/', hreflang: 'zh-Hant', homeTitle: 'ONNELLAB - 安靜而專注的軟體' }
] as const;

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

test.describe('five-language core site', () => {
  for (const locale of locales) {
    test(`home ${locale.code}`, async ({ page }) => {
      const path = locale.segment ? `/${locale.segment}` : '/';
      await page.goto(path);
      await expect(page).toHaveTitle(locale.homeTitle);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
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
        await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
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
    { browserLocale: 'fr-FR', expectedPath: '/' }
  ]) {
    test(`root follows system locale ${browserLocale}`, async ({ page }) => {
      await setBrowserLocales(page, [browserLocale]);
      await page.goto('/');
      await expect.poll(() => new URL(page.url()).pathname).toBe(expectedPath);
    });
  }

  test('checks navigator languages in order and skips unsupported locales', async ({ page }) => {
    await setBrowserLocales(page, ['fr-FR', 'ja-JP'], 'ko-KR');
    await page.goto('/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/ja/');
  });

  test('falls back from navigator languages to navigator language', async ({ page }) => {
    await setBrowserLocales(page, ['fr-FR'], 'ko-KR');
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
    await page.addInitScript(() => localStorage.setItem('onnellab.locale', 'fr'));
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

  test('every app detail supports localized navigation in five languages', async ({ page }) => {
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
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
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
        await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
        await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(6);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `https://onnellab.github.io${path}`
        );
        await expect(page.locator('.support-links a').first()).toHaveAttribute(
          'href',
          `https://onnellab.github.io/privacy/${slug}/`
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
