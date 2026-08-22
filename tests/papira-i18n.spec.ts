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

const alternateUrls = {
  en: 'https://onnellab.github.io/apps/papira/',
  ko: 'https://onnellab.github.io/apps/papira/ko/',
  ja: 'https://onnellab.github.io/apps/papira/ja/',
  'zh-Hans': 'https://onnellab.github.io/apps/papira/zh-hans/',
  'zh-Hant': 'https://onnellab.github.io/apps/papira/zh-hant/',
  'x-default': 'https://onnellab.github.io/apps/papira/'
} as const;

async function jsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? 'null'))
  );
}

test.describe('Papira five-language launch surface', () => {
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

    test(`Papira privacy page ${locale.hreflang}`, async ({ page }) => {
      await page.goto(`/privacy/papira/${locale.path}`);
      await expect(page.locator('main')).toContainText('Papira');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io/privacy/papira/${locale.path}`
      );
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);
    });
  }

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
        h3: 'Quick EPUB',
        item: 'Fanfiction, serialized fiction, personal novels, digital zines, and TRPG scenario presets'
      },
      {
        path: '/apps/papira/ko/',
        h2: '두 가지 제작 흐름',
        h3: '빠르게 만들기',
        item: '팬픽·연재소설·개인 창작 소설·디지털 소책자·TRPG 시나리오 작품 유형'
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

  test('legacy product copy keeps its established section and list rendering', async ({ page }) => {
    await page.goto('/apps/tagweaver/');
    await expect(page.getByRole('heading', { level: 2, name: 'Supported editing' })).toHaveCount(1);
    await expect(page.getByRole('listitem').filter({ hasText: 'Edit tag fields' })).toHaveCount(1);
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

  test('Papira product pages expose the localized promotional screenshot gallery', async ({ page }) => {
    for (const locale of locales) {
      const screenshotLocale = locale.hreflang === 'ko' ? 'ko' : 'en';
      await page.goto(`/apps/papira/${locale.path}`);

      const screenshots = page.locator('.screenshot-link img');
      await expect(screenshots).toHaveCount(3);
      for (let index = 0; index < 3; index += 1) {
        const source = `/app-assets/papira/assets/screenshots/${screenshotLocale}/0${index + 1}.png`;
        await expect(screenshots.nth(index)).toHaveAttribute('src', source);
        await expect(screenshots.nth(index)).toHaveAttribute('width', '1080');
        await expect(screenshots.nth(index)).toHaveAttribute('height', '2168');
        expect(fs.existsSync(path.resolve(process.cwd(), 'public', source.replace(/^\//, '')))).toBe(true);
      }
    }
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
        includes: ['well-structured EPUB files', 'publishing-agency services']
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
      'src/components/ProductTemplate.astro',
      'src/components/PapiraPage.astro'
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
