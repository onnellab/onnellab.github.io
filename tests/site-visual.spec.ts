import { expect, test, type Page } from '@playwright/test';
import { getAllBlogPages, getBlogAlternatePost } from '../src/lib/blog';
import { releaseNoteKoPath, releaseNotePath, releaseNotes } from '../src/lib/releaseNotes';

const corePages = [
  '/',
  '/ko/',
  '/ja/',
  '/zh-hans/',
  '/zh-hant/',
  '/apps/',
  '/apps/ko/',
  '/apps/ja/',
  '/apps/zh-hans/',
  '/apps/zh-hant/',
  '/about/',
  '/about/ko/',
  '/about/ja/',
  '/about/zh-hans/',
  '/about/zh-hant/',
  '/privacy/',
  '/privacy/ko/',
  '/privacy/ja/',
  '/privacy/zh-hans/',
  '/privacy/zh-hant/',
  '/terms/',
  '/terms/ko/',
  '/terms/ja/',
  '/terms/zh-hans/',
  '/terms/zh-hant/'
];

const productSlugs = ['aligna', 'clipnest', 'quivra', 'segra', 'tagweaver', 'vaultxt'];
const allProductSlugs = ['aligna', 'clipnest', 'melivra', 'papira', 'quivra', 'segra', 'tagweaver', 'vaultxt'];
const productLocales = [
  { code: 'en', suffix: '' },
  { code: 'ko', suffix: 'ko/' },
  { code: 'ja', suffix: 'ja/' },
  { code: 'zh-Hans', suffix: 'zh-hans/' },
  { code: 'zh-Hant', suffix: 'zh-hant/' }
] as const;
const footerLabels = {
  en: { privacy: 'Privacy Policy', terms: 'Terms' },
  ko: { privacy: '개인정보 처리방침', terms: '이용약관' },
  ja: { privacy: 'プライバシーポリシー', terms: '利用規約' },
  'zh-Hans': { privacy: '隐私政策', terms: '使用条款' },
  'zh-Hant': { privacy: '隱私權政策', terms: '使用條款' }
} as const;
const productPages = productSlugs.flatMap((slug) => [`/apps/${slug}/`, `/apps/${slug}/ko/`]);
const privacySlugs = ['aligna', 'clipnest', 'melivra', 'papira', 'quivra', 'segra', 'tagweaver', 'vaultxt'];
const legacyPrivacySlugs = ['aligna', 'clipnest', 'melivra', 'quivra', 'segra', 'tagweaver', 'vaultxt'];
const privacyUrls = privacySlugs.map((slug) => `https://onnellab.github.io/privacy/${slug}/`);
const koreanPrivacyUrls = privacySlugs.map((slug) => `https://onnellab.github.io/privacy/${slug}/ko/`);

type PublishedRouteContract = {
  path: string;
  lang: 'en' | 'ko';
  h1: string;
  alternatePath?: string;
  alternateLocale?: 'en' | 'ko';
  mainSelector: string;
  standardizedChrome: boolean;
};

const blogArticleContracts: PublishedRouteContract[] = getAllBlogPages().map((post) => {
  const alternate = getBlogAlternatePost(post);
  return {
    path: post.href,
    lang: post.meta.language,
    h1: post.meta.title,
    alternatePath: alternate?.href,
    alternateLocale: alternate?.meta.language,
    mainSelector: 'main.article-shell',
    standardizedChrome: true
  };
});

const releaseNoteContracts: PublishedRouteContract[] = releaseNotes.flatMap((note) => [
  {
    path: releaseNotePath(note),
    lang: 'en' as const,
    h1: note.title,
    alternatePath: releaseNoteKoPath(note),
    alternateLocale: 'ko' as const,
    mainSelector: 'main.release-shell',
    standardizedChrome: true
  },
  {
    path: releaseNoteKoPath(note),
    lang: 'ko' as const,
    h1: note.title,
    alternatePath: releaseNotePath(note),
    alternateLocale: 'en' as const,
    mainSelector: 'main.release-shell',
    standardizedChrome: true
  }
]);

const remainingGeneratedPageContracts: PublishedRouteContract[] = [
  {
    path: '/blog/',
    lang: 'en',
    h1: 'Practical Workflow Guides',
    alternatePath: '/blog/ko/',
    alternateLocale: 'ko',
    mainSelector: 'main.blog-shell',
    standardizedChrome: true
  },
  {
    path: '/blog/ko/',
    lang: 'ko',
    h1: '워크플로 가이드',
    alternatePath: '/blog/',
    alternateLocale: 'en',
    mainSelector: 'main.blog-shell',
    standardizedChrome: true
  },
  {
    path: '/oauth/x/callback/',
    lang: 'en',
    h1: 'X OAuth Callback',
    alternatePath: '/oauth/x/callback/ko/',
    alternateLocale: 'ko',
    mainSelector: 'main.legal-shell',
    standardizedChrome: true
  },
  {
    path: '/oauth/x/callback/ko/',
    lang: 'ko',
    h1: 'X OAuth 콜백',
    alternatePath: '/oauth/x/callback/',
    alternateLocale: 'en',
    mainSelector: 'main.legal-shell',
    standardizedChrome: true
  },
  {
    path: '/melivra-privacy-policy/',
    lang: 'en',
    h1: 'Privacy Policy',
    alternatePath: '/melivra-privacy-policy/ko/',
    alternateLocale: 'ko',
    mainSelector: 'main.policy-page',
    standardizedChrome: false
  },
  {
    path: '/melivra-privacy-policy/ko/',
    lang: 'ko',
    h1: '개인정보 처리방침',
    alternatePath: '/melivra-privacy-policy/',
    alternateLocale: 'en',
    mainSelector: 'main.policy-page',
    standardizedChrome: false
  }
];

async function assertPageIntegrity(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  expect(horizontalOverflow).toBe(false);

  const brokenImages = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => !image.closest('details:not([open])'))
      .filter((image) => !image.closest('dialog:not([open])'))
      .filter((image) => {
        if (image.loading !== 'lazy') return true;
        const rect = image.getBoundingClientRect();
        return rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
      })
      .filter((image) => image.naturalWidth === 0 || image.naturalHeight === 0)
      .map((image) => image.getAttribute('src') ?? '')
  );
  expect(brokenImages).toEqual([]);

  const visibleText = await page.locator('main').innerText();
  expect(visibleText.trim().length).toBeGreaterThan(40);
}

async function assertVisibleImagesHealthy(page: Page) {
  const images = page.locator('main img:visible');
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((node) => ({
      complete: (node as HTMLImageElement).complete,
      naturalWidth: (node as HTMLImageElement).naturalWidth
    }))).toMatchObject({ complete: true });
    expect(await image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
}

test.describe('site layout and navigation', () => {
  test('all remaining generated HTML routes retain their supported-locale and rendering contracts', async ({ page }) => {
    expect(blogArticleContracts.length).toBeGreaterThan(0);
    expect(releaseNoteContracts.length).toBeGreaterThan(0);
    const routes = [
      ...blogArticleContracts,
      ...releaseNoteContracts,
      ...remainingGeneratedPageContracts
    ];
    expect(routes.length).toBeGreaterThan(0);
    expect(new Set(routes.map((route) => route.path)).size).toBe(routes.length);

    for (const route of routes) {
      await test.step(route.path, async () => {
        const response = await page.goto(route.path);
        expect(response?.ok()).toBe(true);
        await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          new URL(route.path, 'https://onnellab.github.io').toString()
        );
        const expectedHreflangs = route.alternatePath
          ? ['en', 'ko', 'x-default']
          : route.lang === 'en'
            ? ['en', 'x-default']
            : ['ko'];
        expect(await page.locator('link[rel="alternate"][hreflang]').evaluateAll((links) =>
          links.map((link) => link.getAttribute('hreflang'))
        )).toEqual(expectedHreflangs);

        const main = page.locator(route.mainSelector);
        await expect(main).toHaveCount(1);
        await expect(main.locator('h1')).toHaveCount(1);
        await expect(main.locator('h1')).toHaveText(route.h1);
        const languageLink = main.locator(':scope > nav [data-locale-choice]');
        await expect(languageLink).toHaveCount(route.alternatePath ? 1 : 0);
        if (route.alternatePath && route.alternateLocale) {
          await expect(languageLink).toHaveAttribute('href', route.alternatePath);
          await expect(languageLink).toHaveAttribute('data-locale-choice', route.alternateLocale);
        }
        await expect(main.locator('.locale-menu')).toHaveCount(0);

        if (route.standardizedChrome) {
          await expect(main.locator(':scope > nav.site-header')).toHaveCount(1);
          const footer = main.locator(':scope > footer.site-footer');
          await expect(footer).toHaveCount(1);
          expect(await footer.locator(':scope > a').evaluateAll((links) =>
            links.map((link) => link.getAttribute('href'))
          )).toEqual([
            route.lang === 'ko' ? '/privacy/ko/' : '/privacy/',
            route.lang === 'ko' ? '/terms/ko/' : '/terms/',
            'mailto:onnellab.app@gmail.com'
          ]);
          await expect(footer.locator(':scope > span')).toHaveText('© ONNELLAB');
        }

        await assertVisibleImagesHealthy(page);
        expect(await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
        )).toBe(true);
      });
    }
  });

  for (const path of corePages) {
    test(`${path} renders without overflow or broken visible images`, async ({ page }) => {
      await assertPageIntegrity(page, path);
    });
  }

  for (const path of ['/apps/tagweaver/', '/apps/tagweaver/ko/', '/apps/papira/', '/apps/papira/ja/']) {
    test(`${path} product page remains readable`, async ({ page }) => {
      await assertPageIntegrity(page, path);
    });
  }

  test('core language menus expose five explicit choices', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.locale-menu summary')).toHaveText('English');
    await page.locator('.locale-menu summary').click();
    await expect(page.locator('.locale-menu-panel a')).toHaveText([
      'English',
      '한국어',
      '日本語',
      '简体中文',
      '繁體中文'
    ]);

    await page.goto('/zh-hant/');
    await expect(page.locator('.locale-menu summary')).toHaveText('繁體中文');
  });

  test('browser language redirects only the root page', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko'] });
      Object.defineProperty(navigator, 'language', { get: () => 'ko-KR' });
    });

    await page.goto('/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/ko/');

    await page.goto('/apps/tagweaver/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/apps/tagweaver/');
  });

  test('manual locale choice is saved without changing unrelated routes', async ({ page }) => {
    await page.goto('/');
    await page.locator('.locale-menu summary').click();
    await page.locator('[data-locale-choice="ja"]').click();
    await expect(page).toHaveURL(/\/ja\/$/);
    expect(await page.evaluate(() => localStorage.getItem('onnellab.locale'))).toBe('ja');

    await page.goto('/apps/tagweaver/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/apps/tagweaver/');
  });

  test('home uses the full TagWeaver card as the link and keeps Papira off the homepage', async ({ page }) => {
    for (const segment of ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/']) {
      await page.goto(`/${segment}`);
      const featured = page.locator('a.featured');
      await expect(featured).toHaveAttribute('href', `/apps/tagweaver/${segment}`);
      await expect(featured.locator('h2')).toContainText('TagWeaver');
      await expect(featured.locator('a')).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText('Papira');
      await expect(page.locator('.product-card')).toHaveCount(4);
    }

    await page.goto('/apps/ko/');
    await expect(page.locator('[data-app-row]').filter({ hasText: 'Papira' })).toHaveCount(1);
  });

  test('home introduction uses the card measure and breaks between sentences', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/ko/');

    const lede = page.locator('.home-hero .lede');
    await expect(lede).toContainText('목적이 분명한 앱을 만들어요.');
    await expect(lede).toContainText('기능을 쌓아 올리거나');

    const ledeBox = await lede.boundingBox();
    const featuredBox = await page.locator('a.featured').boundingBox();
    expect(ledeBox).not.toBeNull();
    expect(featuredBox).not.toBeNull();
    if (!ledeBox || !featuredBox) return;
    expect(Math.abs(ledeBox.width - featuredBox.width)).toBeLessThan(1.5);

    const renderedText = await lede.innerText();
    expect(renderedText).toContain('만들어요.\n기능을');
  });

  test('mobile home reveals the representative app within the first viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ko/');

    const titleMetrics = await page.locator('.home-hero h1').evaluate((heading) => {
      const style = getComputedStyle(heading);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight)
      };
    });
    expect(titleMetrics.fontSize).toBeLessThanOrEqual(44.1);
    expect(titleMetrics.lineHeight).toBeGreaterThan(titleMetrics.fontSize);
    expect(await page.locator('.home-hero h1').innerText()).toBe('작은 도구를,\n차분하게 만들어요.');
    await expect(page.locator('.home-hero h1 .title-line')).toHaveCount(2);

    const mobileNavStyle = await page.locator('.top-nav').evaluate((nav) => {
      const brand = nav.querySelector('.brand');
      const links = nav.querySelector('.nav-links');
      const locale = nav.querySelector('.locale-menu summary');
      if (!(brand instanceof HTMLElement) || !(links instanceof HTMLElement) || !(locale instanceof HTMLElement)) return null;
      return {
        brandSize: Number.parseFloat(getComputedStyle(brand).fontSize),
        gap: Number.parseFloat(getComputedStyle(links).gap),
        localeHeight: locale.getBoundingClientRect().height,
        localePadding: Number.parseFloat(getComputedStyle(locale).paddingInlineStart)
      };
    });
    expect(mobileNavStyle).toEqual({ brandSize: 14, gap: 12, localeHeight: 36, localePadding: 13 });

    const featuredBox = await page.locator('a.featured').boundingBox();
    expect(featuredBox).not.toBeNull();
    if (!featuredBox) return;
    expect(featuredBox.y).toBeLessThan(844);
    await expect(page.locator('a.featured')).toContainText('TagWeaver');
  });

  test('Japanese home title breaks once after the comma', async ({ page }) => {
    await page.goto('/ja/');

    const heading = page.locator('.home-hero h1');
    await expect(heading).toHaveText('小さな道具を、 静かに。');
    expect(await heading.innerText()).toBe('小さな道具を、\n静かに。');
    await expect(heading.locator('.title-line')).toHaveText(['小さな道具を、', '静かに。']);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('Japanese and Chinese home navigation follows the established English and Korean style', async ({ page }) => {
    const routes = [
      { path: '/', family: '"SUIT Variable"', weight: '620' },
      { path: '/ko/', family: '"SUIT Variable"', weight: '620' },
      { path: '/ja/', family: '"ONNELLAB Japanese Nav"', weight: '600' },
      { path: '/zh-hans/', family: '"ONNELLAB Simplified Chinese Nav"', weight: '600' },
      { path: '/zh-hant/', family: '"ONNELLAB Traditional Chinese Nav"', weight: '600' }
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await page.evaluate(() => document.fonts.ready);

      const styles = await page.locator('.home-hero').evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>('.nav-links > a')).map((link) => {
          const style = getComputedStyle(link);
          return { fontFamily: style.fontFamily, fontWeight: style.fontWeight };
        })
      );
      expect(styles).toHaveLength(3);
      for (const style of styles) {
        expect(style.fontFamily.split(',')[0]).toBe(route.family);
        expect(style.fontWeight).toBe(route.weight);
      }
    }
  });

  test('mobile home keeps About and Blog navigation visible in every locale', async ({ page }) => {
    const routes = [
      { home: '/', about: '/about/', blog: '/blog/', title: 'More apps', all: 'View all' },
      { home: '/ko/', about: '/about/ko/', blog: '/blog/ko/', title: '다른 앱', all: '전체 보기' },
      { home: '/ja/', about: '/about/ja/', blog: '/blog/', title: 'ほかのアプリ', all: '一覧を見る' },
      { home: '/zh-hans/', about: '/about/zh-hans/', blog: '/blog/', title: '其他应用', all: '查看全部' },
      { home: '/zh-hant/', about: '/about/zh-hant/', blog: '/blog/', title: '其他應用程式', all: '查看全部' }
    ];

    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of routes) {
      await page.goto(route.home);
      await expect(page.locator(`.top-nav a[href="${route.about}"]`)).toBeVisible();
      await expect(page.locator(`.top-nav a[href="${route.blog}"]`)).toBeVisible();
      await expect(page.locator('#apps-title')).toHaveText(route.title);
      await expect(page.locator('.section-head a')).toHaveText(route.all);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    }
  });

  test('Japanese and Chinese pages wrap without horizontal mobile scrolling', async ({ page }) => {
    const locales = ['ja', 'zh-hans', 'zh-hant'];
    const slugs = ['aligna', 'clipnest', 'melivra', 'papira', 'quivra', 'segra', 'tagweaver', 'vaultxt'];
    const routes = locales.flatMap((locale) => [
      `/${locale}/`,
      `/apps/${locale}/`,
      `/about/${locale}/`,
      `/privacy/${locale}/`,
      `/terms/${locale}/`,
      ...slugs.map((slug) => `/apps/${slug}/${locale}/`)
    ]);
    const failures: string[] = [];

    await page.setViewportSize({ width: 320, height: 844 });
    for (const route of routes) {
      await page.goto(route);
      const overflow = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth <= viewportWidth + 1) return [];
        return Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .map((node) => ({ node, rect: node.getBoundingClientRect() }))
          .filter(({ rect }) => rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1))
          .sort((a, b) => b.rect.right - a.rect.right)
          .slice(0, 4)
          .map(({ node, rect }) => `${document.documentElement.scrollWidth}px right=${Math.round(rect.right)} ${node.tagName.toLowerCase()}.${node.className || '(no-class)'}: ${node.textContent?.trim().slice(0, 80)}`);
      });
      if (overflow.length > 0) failures.push(`${route}\n${overflow.join('\n')}`);
    }

    expect(failures).toEqual([]);
  });

  test('all legacy privacy aliases share the current legal-page presentation without changing policy semantics', async ({ page }) => {
    for (const slug of legacyPrivacySlugs) {
      for (const locale of ['en', 'ko'] as const) {
        const suffix = locale === 'ko' ? 'ko/' : '';
        const canonical = `https://onnellab.github.io/privacy/${slug}/${suffix}`;
        const routes = [
          `/${slug}/privacy/${suffix}`,
          `/apps/${slug}/privacy/${suffix}`,
          `/privacy/${slug}/${suffix}`
        ];
        const snapshots: Array<{ metadata: unknown; policyHtml: string }> = [];

        for (const route of routes) {
          await page.goto(route);
          await expect(page.locator('link[rel="stylesheet"][href="/legacy-privacy.css"]')).toHaveCount(1);
          await expect(page.locator('head style')).toHaveCount(0);
          const main = page.locator('main.legacy-privacy-shell');
          await expect(main).toHaveCount(1);

          const brand = main.locator(':scope > .topbar .home-link');
          const language = main.locator(':scope > .topbar .language-link');
          const brandStyle = await brand.evaluate((node) => {
            const style = getComputedStyle(node);
            return {
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              lineHeight: style.lineHeight,
              textDecorationLine: style.textDecorationLine
            };
          });
          expect(brandStyle).toEqual({
            fontSize: '14px',
            fontWeight: '560',
            lineHeight: '16.8px',
            textDecorationLine: 'none'
          });
          expect((await language.boundingBox())?.height).toBeGreaterThanOrEqual(36);

          const footer = main.locator(':scope > footer.site-footer');
          await expect(footer).toHaveCount(1);
          await expect(footer.locator(':scope > *')).toHaveCount(4);
          await expect(footer.locator(':scope > a')).toHaveText(
            locale === 'ko'
              ? ['개인정보 처리방침', '이용약관', 'onnellab.app@gmail.com']
              : ['Privacy Policy', 'Terms', 'onnellab.app@gmail.com']
          );
          expect(await footer.locator(':scope > a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(
            locale === 'ko'
              ? ['/privacy/ko/', '/terms/ko/', 'mailto:onnellab.app@gmail.com']
              : ['/privacy/', '/terms/', 'mailto:onnellab.app@gmail.com']
          );
          await expect(footer.locator(':scope > span')).toHaveText('© ONNELLAB');
          await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

          snapshots.push(await page.evaluate(() => {
            const mainNode = document.querySelector('main');
            const policyClone = mainNode?.cloneNode(true) as HTMLElement | undefined;
            policyClone?.querySelector('.topbar')?.remove();
            policyClone?.querySelector('.site-footer')?.remove();
            return {
              metadata: {
                title: document.title,
                description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
                canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
                alternates: Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((link) => [
                  link.getAttribute('hreflang'),
                  link.getAttribute('href')
                ]),
                openGraph: Array.from(document.querySelectorAll('meta[property^="og:"]')).map((meta) => [
                  meta.getAttribute('property'),
                  meta.getAttribute('content')
                ])
              },
              policyHtml: policyClone?.innerHTML.trim() ?? ''
            };
          }));
        }

        expect(snapshots[1]).toEqual(snapshots[0]);
        expect(snapshots[2]).toEqual(snapshots[0]);
      }
    }
  });

  test('ONNELLAB wordmark uses one font across core, blog, and product pages', async ({ page }) => {
    const paths = ['/ko/', '/blog/ko/', '/apps/tagweaver/ko/', '/about/ko/', '/privacy/ko/', '/apps/papira/ko/'];
    const fontFamilies: string[] = [];

    for (const path of paths) {
      await page.goto(path);
      const brand = page.locator('.brand').first();
      await expect(brand).toHaveText('ONNELLAB');
      fontFamilies.push(await brand.evaluate((node) => getComputedStyle(node).fontFamily));
    }

    expect(new Set(fontFamilies).size).toBe(1);
  });

  test('rendered page families share the brand, header, and language-control visual contract', async ({ page }) => {
    const routes = [
      '/ko/',
      '/apps/ko/',
      '/about/ko/',
      '/privacy/ko/',
      '/apps/papira/ko/',
      '/blog/ko/',
      '/blog/ko/read-large-txt-files-without-lag/',
      '/terms/ko/',
      '/release-notes/tagweaver/2.2/ko/',
      '/oauth/x/callback/ko/',
      '/privacy/papira/ko/'
    ];
    const failures: Array<{ route: string; metric: string; actual: unknown }> = [];

    for (const route of routes) {
      await page.goto(route);
      const header = page.locator('main > :is(nav, header.topbar)').first();
      const brand = header.locator('.brand');
      const languageControl = header.locator('.locale-menu summary, .language').first();
      await expect(header).toBeVisible();
      await expect(brand).toHaveText('ONNELLAB');
      await expect(languageControl).toBeVisible();

      const headerStyle = await header.evaluate((node) => {
        const style = getComputedStyle(node);
        return { alignItems: style.alignItems, minHeight: style.minHeight };
      });
      const brandStyle = await brand.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          minHeight: style.minHeight,
          textDecorationLine: style.textDecorationLine
        };
      });
      const controlStyle = await languageControl.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          minHeight: style.minHeight,
          borderStyle: style.borderStyle,
          borderColor: style.borderColor,
          borderRadius: style.borderRadius,
          paddingBlock: `${style.paddingTop} ${style.paddingBottom}`,
          paddingInline: `${style.paddingLeft} ${style.paddingRight}`,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          textDecorationLine: style.textDecorationLine
        };
      });
      await languageControl.focus();
      const focusStyle = await languageControl.evaluate((node) => {
        const style = getComputedStyle(node);
        return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineOffset: style.outlineOffset };
      });

      const expected = {
        header: { alignItems: 'center', minHeight: '36px' },
        brand: {
          fontFamily: '"Avenir Next", Avenir, "Helvetica Neue", Arial, sans-serif',
          fontSize: '14px',
          fontWeight: '560',
          lineHeight: '16.8px',
          minHeight: '36px',
          textDecorationLine: 'none'
        },
        control: {
          minHeight: '36px',
          borderStyle: 'solid',
          borderColor: 'rgb(222, 214, 202)',
          borderRadius: '999px',
          paddingBlock: '7px 7px',
          paddingInline: '13px 13px',
          fontSize: '13px',
          fontWeight: '650',
          lineHeight: '17.55px',
          textDecorationLine: 'none'
        },
        focus: { outlineStyle: 'solid', outlineWidth: '2px', outlineOffset: '3px' }
      };
      for (const [metric, actual] of Object.entries({
        header: headerStyle,
        brand: brandStyle,
        control: controlStyle,
        focus: focusStyle
      })) {
        if (JSON.stringify(actual) !== JSON.stringify(expected[metric as keyof typeof expected])) {
          failures.push({ route, metric, actual });
        }
      }
    }

    expect(failures).toEqual([]);
  });

  test('information hubs share one shell and heading geometry in every locale', async ({ page }) => {
    const localeSuffixes = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/'];
    const routes = ['apps', 'about', 'privacy'].flatMap((section) =>
      localeSuffixes.map((locale) => `/${section}/${locale}`)
    );
    const viewportWidth = page.viewportSize()?.width ?? 1440;
    const expectedShellWidth = Math.min(1040, viewportWidth - 40);
    const expectedHeadingSize = Math.min(72, Math.max(42, viewportWidth * 0.07));
    const failures: Array<{ route: string; metric: string; actual: unknown }> = [];

    for (const route of routes) {
      await page.goto(route);
      const shell = page.locator('main').first();
      const heading = shell.locator('h1').first();
      const shellBox = await shell.boundingBox();
      const headingStyle = await heading.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          fontSize: Number.parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
          lineHeight: Number.parseFloat(style.lineHeight),
          letterSpacing: Number.parseFloat(style.letterSpacing)
        };
      });
      const shellStyle = await shell.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom
        };
      });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );

      if (!shellBox || Math.abs(shellBox.width - expectedShellWidth) >= 1.5) {
        failures.push({ route, metric: 'shellWidth', actual: shellBox?.width ?? null });
      }
      if (!shellBox || Math.abs(shellBox.x - (viewportWidth - expectedShellWidth) / 2) >= 1.5) {
        failures.push({ route, metric: 'shellCenter', actual: shellBox?.x ?? null });
      }
      if (shellStyle.paddingTop !== '26px' || shellStyle.paddingBottom !== '54px') {
        failures.push({ route, metric: 'shellPadding', actual: shellStyle });
      }
      if (
        Math.abs(headingStyle.fontSize - expectedHeadingSize) >= 0.15 ||
        headingStyle.fontWeight !== '650' ||
        Math.abs(headingStyle.lineHeight - expectedHeadingSize * 1.04) >= 0.15 ||
        Math.abs(headingStyle.letterSpacing - expectedHeadingSize * -0.01) >= 0.15
      ) {
        failures.push({ route, metric: 'heading', actual: headingStyle });
      }
      if (overflow) failures.push({ route, metric: 'horizontalOverflow', actual: true });
    }

    expect(failures).toEqual([]);
  });

  test('rendered page families expose one localized semantic site footer', async ({ page }) => {
    const routes = [
      { path: '/ko/', locale: 'ko', privacy: '/privacy/ko/', terms: '/terms/ko/' },
      { path: '/apps/ja/', locale: 'ja', privacy: '/privacy/ja/', terms: '/terms/ja/' },
      { path: '/about/zh-hans/', locale: 'zh-Hans', privacy: '/privacy/zh-hans/', terms: '/terms/zh-hans/' },
      { path: '/privacy/zh-hant/', locale: 'zh-Hant', privacy: '/privacy/zh-hant/', terms: '/terms/zh-hant/' },
      { path: '/terms/', locale: 'en', privacy: '/privacy/', terms: '/terms/' },
      {
        path: '/apps/papira/ko/',
        locale: 'ko',
        privacy: 'https://onnellab.github.io/privacy/papira/ko/',
        terms: '/terms/ko/'
      },
      { path: '/blog/', locale: 'en', privacy: '/privacy/', terms: '/terms/' },
      {
        path: '/blog/ko/read-large-txt-files-without-lag/',
        locale: 'ko',
        privacy: '/privacy/ko/',
        terms: '/terms/ko/'
      },
      {
        path: '/release-notes/tagweaver/2.2/ko/',
        locale: 'ko',
        privacy: '/privacy/ko/',
        terms: '/terms/ko/'
      },
      { path: '/oauth/x/callback/', locale: 'en', privacy: '/privacy/', terms: '/terms/' },
      { path: '/privacy/papira/ja/', locale: 'ja', privacy: '/privacy/ja/', terms: '/terms/ja/' }
    ] as const;

    for (const route of routes) {
      await page.goto(route.path);
      const main = page.locator('main').first();
      const footer = main.locator(':scope > footer.site-footer');
      await expect(footer).toHaveCount(1);
      await expect(footer.locator(':scope > *')).toHaveCount(4);
      await expect(footer.locator(':scope > a')).toHaveText([
        footerLabels[route.locale].privacy,
        footerLabels[route.locale].terms,
        'onnellab.app@gmail.com'
      ]);
      expect(await footer.locator(':scope > a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
        route.privacy,
        route.terms,
        'mailto:onnellab.app@gmail.com'
      ]);
      await expect(footer.locator(':scope > span')).toHaveText('© ONNELLAB');
      const style = await footer.evaluate((node) => {
        const computed = getComputedStyle(node);
        return {
          display: computed.display,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent,
          flexWrap: computed.flexWrap,
          rowGap: computed.rowGap,
          columnGap: computed.columnGap,
          borderTopStyle: computed.borderTopStyle,
          paddingTop: computed.paddingTop,
          fontSize: computed.fontSize
        };
      });
      expect(style).toEqual({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        rowGap: '9px',
        columnGap: '20px',
        borderTopStyle: 'solid',
        paddingTop: '28px',
        fontSize: '12px'
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    }
  });

  test('homepage locale choices use native list semantics and 12px text meets contrast', async ({ page }) => {
    await page.goto('/');

    const localeMenu = page.locator('.locale-menu');
    await localeMenu.locator('summary').click();
    const localeList = localeMenu.locator('.locale-menu-panel');
    await expect(localeList).toHaveJSProperty('tagName', 'UL');
    await expect(localeList.locator(':scope > li')).toHaveCount(5);
    await expect(localeList.locator(':scope > li > a')).toHaveCount(5);

    const localeLinks = localeList.locator(':scope > li > a');
    await expect(localeLinks.first()).toHaveAttribute('href', '/');
    await expect(localeLinks.first()).toHaveAttribute('hreflang', 'en');
    await expect(localeLinks.first()).toHaveAttribute('aria-current', 'page');
    await expect(localeLinks.nth(1)).toHaveAttribute('href', '/ko/');
    await expect(localeLinks.nth(1)).toHaveAttribute('hreflang', 'ko');
    await localeLinks.nth(1).focus();
    await expect(localeLinks.nth(1)).toBeFocused();
    expect(await localeLinks.evaluateAll((links) => links.every((link) => link.getBoundingClientRect().width > 0))).toBe(true);

    const contrast = await page.evaluate(() => {
      const parseRgb = (value: string) => {
        const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
        return { r: channels[0], g: channels[1], b: channels[2], a: channels[3] ?? 1 };
      };
      const composite = (
        foreground: { r: number; g: number; b: number; a: number },
        background: { r: number; g: number; b: number; a: number }
      ) => ({
        r: foreground.r * foreground.a + background.r * (1 - foreground.a),
        g: foreground.g * foreground.a + background.g * (1 - foreground.a),
        b: foreground.b * foreground.a + background.b * (1 - foreground.a),
        a: 1
      });
      const effectiveBackground = (element: Element) => {
        let background = { r: 255, g: 255, b: 255, a: 1 };
        const ancestors: Element[] = [];
        for (let current: Element | null = element; current; current = current.parentElement) ancestors.push(current);
        for (const current of ancestors.reverse()) {
          background = composite(parseRgb(getComputedStyle(current).backgroundColor), background);
        }
        return background;
      };
      const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
        const linear = [r, g, b].map((channel) => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
      };
      const measure = (selector: string) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing contrast target: ${selector}`);
        const style = getComputedStyle(element);
        const foreground = composite(parseRgb(style.color), effectiveBackground(element));
        const foregroundLuminance = luminance(foreground);
        const backgroundLuminance = luminance(effectiveBackground(element));
        return {
          fontSize: style.fontSize,
          ratio:
            (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
            (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
        };
      };

      return {
        eyebrow: measure('.home-hero .eyebrow'),
        copyright: measure('.site-footer > span')
      };
    });

    expect(contrast.eyebrow.fontSize).toBe('12px');
    expect(contrast.copyright.fontSize).toBe('12px');
    expect(contrast.eyebrow.ratio).toBeGreaterThanOrEqual(4.5);
    expect(contrast.copyright.ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('terms retain the same five-locale legal page contract', async ({ page }) => {
    const routes = [
      { suffix: '', lang: 'en', title: 'Terms of Use', first: '1. Using ONNELLAB products', last: '6. Contact' },
      { suffix: 'ko/', lang: 'ko', title: '이용약관', first: '1. ONNELLAB 제품 이용', last: '6. 문의' },
      { suffix: 'ja/', lang: 'ja', title: '利用規約', first: '1. ONNELLAB製品の利用', last: '6. お問い合わせ' },
      { suffix: 'zh-hans/', lang: 'zh-Hans', title: '使用条款', first: '1. 使用 ONNELLAB 产品', last: '6. 联系' },
      { suffix: 'zh-hant/', lang: 'zh-Hant', title: '使用條款', first: '1. 使用 ONNELLAB 產品', last: '6. 聯絡' }
    ] as const;

    for (const route of routes) {
      await page.goto(`/terms/${route.suffix}`);
      await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://onnellab.github.io/terms/${route.suffix}`
      );
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(6);
      const main = page.locator('main.site-shell[data-core-page="terms"]');
      await expect(main).toHaveCount(1);
      await expect(main.locator(':scope > .top-nav')).toHaveCount(1);
      await expect(main.locator(':scope > .page-hero h1')).toHaveText(route.title);
      await expect(main.locator(':scope > .terms-prose > section')).toHaveCount(6);
      await expect(main.locator('.terms-prose h2').first()).toHaveText(route.first);
      await expect(main.locator('.terms-prose h2').last()).toHaveText(route.last);
      await expect(main.locator(':scope > footer.site-footer')).toHaveCount(1);
      await expect(main).toContainText('2026-08-21');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    }
  });

  test('about page wordmark has no underline', async ({ page }) => {
    await page.goto('/about/ko/');

    const decorationLine = await page.locator('.top-nav .brand').evaluate(
      (brand) => getComputedStyle(brand).textDecorationLine
    );
    expect(decorationLine).toBe('none');
  });

  test('core navigation follows the active locale', async ({ page }) => {
    await page.goto('/ja/');
    await expect(page.locator('.top-nav a[href="/apps/ja/"]')).toBeVisible();
    await expect(page.locator('.top-nav a[href="/about/ja/"]')).toBeVisible();

    await page.goto('/zh-hans/');
    await expect(page.locator('.top-nav a[href="/apps/zh-hans/"]')).toBeVisible();
    await expect(page.locator('.top-nav a[href="/about/zh-hans/"]')).toBeVisible();
  });

  test('legacy collection paths still redirect to canonical routes', async ({ page }) => {
    await page.goto('/apps/ko/ko/');
    await expect(page).toHaveURL(/\/apps\/ko\/$/);

    await page.goto('/ko/apps/');
    await expect(page).toHaveURL(/\/apps\/ko\/$/);

    await page.goto('/ko/privacy/');
    await expect(page).toHaveURL(/\/privacy\/ko\/$/);
  });
});

test.describe('app and privacy collections', () => {
  test('Papira app cards use concise noun-phrase summaries in every locale', async ({ page }) => {
    const summaries = [
      {
        path: '/apps/',
        text: 'Offline TXT-to-EPUB maker'
      },
      {
        path: '/apps/ko/',
        text: '오프라인 TXT→EPUB 제작 도구'
      },
      {
        path: '/apps/ja/',
        text: 'オフラインTXT→EPUB作成ツール'
      },
      {
        path: '/apps/zh-hans/',
        text: '离线 TXT 转 EPUB 制作工具'
      },
      {
        path: '/apps/zh-hant/',
        text: '離線 TXT 轉 EPUB 製作工具'
      }
    ];

    for (const summary of summaries) {
      await page.goto(summary.path);
      const papira = page.locator('[data-app-row]').filter({ hasText: 'Papira' });
      await expect(papira.locator('.app-copy > p')).toHaveText(summary.text);
    }
  });

  test('apps are alphabetically ordered and localized status badges are distinct', async ({ page }) => {
    await page.goto('/apps/ko/');
    await expect(page.locator('[data-app-row] h2')).toHaveText([
      'Aligna',
      'ClipNest',
      'Melivra',
      'Papira',
      'Quivra',
      'Segra',
      'TagWeaver',
      'VaultXT'
    ]);

    const melivraBadge = page.locator('[data-app-row]').filter({ hasText: 'Melivra' }).locator('.status-badge');
    const papiraBadge = page.locator('[data-app-row]').filter({ hasText: 'Papira' }).locator('.status-badge');
    const releasedBadge = page.locator('[data-app-row]').filter({ hasText: 'TagWeaver' }).locator('.status-badge');

    await expect(melivraBadge).toHaveText('출시 준비 중');
    await expect(papiraBadge).toHaveText('출시 준비 중');
    await expect(releasedBadge).toHaveText('출시됨');
    await expect(page.locator('[data-apps-page]')).not.toContainText('Released');

    const preparingStyle = await papiraBadge.evaluate((node) => {
      const style = getComputedStyle(node);
      return `${style.backgroundColor}|${style.borderColor}`;
    });
    const releasedStyle = await releasedBadge.evaluate((node) => {
      const style = getComputedStyle(node);
      return `${style.backgroundColor}|${style.borderColor}`;
    });
    expect(preparingStyle).not.toBe(releasedStyle);
  });

  test('apps search filters localized product rows', async ({ page }) => {
    await page.goto('/apps/ja/');
    await page.locator('[data-app-search]').fill('papira');
    await expect(page.locator('[data-app-row]:visible')).toHaveCount(1);
    await expect(page.locator('[data-app-row]:visible h2')).toHaveText('Papira');

    await page.locator('[data-app-search]').fill('missing-app');
    await expect(page.locator('[data-app-row]:visible')).toHaveCount(0);
    await expect(page.locator('[data-app-empty]')).toBeVisible();
  });

  test('app collection links every product to the selected locale', async ({ page }) => {
    await page.goto('/apps/zh-hant/');
    await expect(page.locator('[data-app-row]').filter({ hasText: 'Papira' })).toHaveAttribute(
      'href',
      '/apps/papira/zh-hant/'
    );
    await expect(page.locator('[data-app-row]').filter({ hasText: 'TagWeaver' })).toHaveAttribute(
      'href',
      '/apps/tagweaver/zh-hant/'
    );

    await page.goto('/apps/ko/');
    await expect(page.locator('[data-app-row]').filter({ hasText: 'TagWeaver' })).toHaveAttribute(
      'href',
      '/apps/tagweaver/ko/'
    );
  });

  test('About restores its timeline and matches the intro measure to the principles', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/about/ko/');
    await expect(page.locator('#timeline-title')).toHaveText('연표');
    await expect(page.locator('.timeline li')).toHaveCount(6);
    await expect(page.locator('.timeline')).toContainText('TagWeaver 출시');
    await expect(page.locator('.timeline')).toContainText('Segra 출시');

    const introBox = await page.locator('.intro-copy').boundingBox();
    const principlesBox = await page.locator('.principles-grid').boundingBox();
    expect(introBox).not.toBeNull();
    expect(principlesBox).not.toBeNull();
    if (!introBox || !principlesBox) return;
    expect(Math.abs(introBox.width - principlesBox.width)).toBeLessThan(1.5);
  });

  test('privacy search filters policy rows', async ({ page }) => {
    await page.goto('/privacy/ko/');
    await page.locator('[data-policy-search]').fill('papira');
    await expect(page.locator('[data-policy-row]:visible')).toHaveCount(1);
    await expect(page.locator('[data-policy-row]:visible h2')).toHaveText('Papira');

    await page.locator('[data-policy-search]').fill('missing-app');
    await expect(page.locator('[data-policy-row]:visible')).toHaveCount(0);
    await expect(page.locator('[data-policy-empty]')).toBeVisible();
  });

  test('Korean privacy contact keeps the complete sentence around its mail link', async ({ page }) => {
    await page.goto('/privacy/ko/');
    const contact = page.locator('[data-contact-notice] p');
    await expect(contact).toHaveText('개인정보 관련 문의는 onnellab.app@gmail.com으로 보내요.');
    await expect(contact.locator('a')).toHaveAttribute('href', 'mailto:onnellab.app@gmail.com');
  });

  test('privacy hub structured data and visible rows use canonical policy URLs', async ({ page }) => {
    await page.goto('/privacy/');
    const schema = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}'
    );
    expect(schema['@type']).toBe('CollectionPage');
    expect(schema.mainEntity.itemListElement.map((item) => item.url)).toEqual(privacyUrls);
    expect(
      await page.locator('[data-policy-row]').evaluateAll((rows) =>
        rows.map((row) => {
          const href = row.getAttribute('href') ?? '';
          return href.startsWith('http')
            ? href
            : new URL(href, 'https://onnellab.github.io').toString();
        })
      )
    ).toEqual(privacyUrls);

    await page.goto('/privacy/ko/');
    const koreanSchema = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}'
    );
    expect(koreanSchema.mainEntity.itemListElement.map((item) => item.url)).toEqual(
      koreanPrivacyUrls
    );
    expect(
      await page.locator('[data-policy-row]').evaluateAll((rows) =>
        rows.map((row) => {
          const href = row.getAttribute('href') ?? '';
          return href.startsWith('http')
            ? href
            : new URL(href, 'https://onnellab.github.io').toString();
        })
      )
    ).toEqual(koreanPrivacyUrls);
  });

  test('Japanese and Chinese privacy hubs localize Papira while preserving existing policy URLs', async ({ page }) => {
    for (const locale of ['ja', 'zh-hans', 'zh-hant']) {
      await page.goto(`/privacy/${locale}/`);
      await expect(page.locator('[data-policy-row]').filter({ hasText: 'Papira' })).toHaveAttribute(
        'href',
        `/privacy/papira/${locale}/`
      );
      await expect(page.locator('[data-policy-row]').filter({ hasText: 'TagWeaver' })).toHaveAttribute(
        'href',
        'https://onnellab.github.io/privacy/tagweaver/'
      );
    }
  });
});

test.describe('existing product pages', () => {
  test('all product locales keep readable prose while full-width bands retain their geometry', async ({ page }) => {
    for (const slug of allProductSlugs) {
      for (const locale of productLocales) {
        await page.goto(`/apps/${slug}/${locale.suffix}`);
        const main = page.locator('main.page-shell');
        const geometry = await main.evaluate((node) => {
          const box = (selector: string) => {
            const element = node.querySelector<HTMLElement>(selector);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return { width: rect.width, left: rect.left, borderTopStyle: getComputedStyle(element).borderTopStyle };
          };
          const shellRect = node.getBoundingClientRect();
          return {
            shell: { width: shellRect.width, left: shellRect.left },
            hero: box(':scope > .hero'),
            contentBand: box(':scope > .content-band'),
            copy: box(':scope > .content-band .copy-column'),
            faqBand: box(':scope > .faq-band'),
            faqHeading: box(':scope > .faq-band > h2'),
            faqList: box(':scope > .faq-band > .faq-list'),
            screens: box(':scope > .screens-band'),
            download: box(':scope > .download-band')
          };
        });

        expect(geometry.shell).not.toBeNull();
        const shellWidth = geometry.shell?.width ?? 0;
        const expectedMeasure = Math.min(800, shellWidth);
        for (const measure of [geometry.copy, geometry.faqHeading, geometry.faqList]) {
          expect(measure).not.toBeNull();
          expect(measure?.width ?? 0).toBeLessThanOrEqual(800.5);
          expect(Math.abs((measure?.width ?? 0) - expectedMeasure)).toBeLessThan(1.5);
        }
        for (const band of [geometry.contentBand, geometry.faqBand, geometry.screens, geometry.download]) {
          expect(band).not.toBeNull();
          expect(Math.abs((band?.width ?? 0) - shellWidth)).toBeLessThan(1.5);
          expect(band?.borderTopStyle).toBe('solid');
        }
        expect(Math.abs((geometry.hero?.width ?? 0) - shellWidth)).toBeLessThan(1.5);
        expect(await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
        )).toBe(true);

        if ((page.viewportSize()?.width ?? 0) <= 680) {
          const mobileType = await main.evaluate((node) => {
            const prose = node.querySelector<HTMLElement>('.copy-column li, .copy-column p');
            const faqAnswer = node.querySelector<HTMLElement>('.faq-list p');
            if (!prose || !faqAnswer) return null;
            const proseStyle = getComputedStyle(prose);
            const faqStyle = getComputedStyle(faqAnswer);
            return {
              proseFontSize: proseStyle.fontSize,
              proseLineHeight: proseStyle.lineHeight,
              faqFontSize: faqStyle.fontSize,
              faqLineHeight: faqStyle.lineHeight
            };
          });
          expect(mobileType).not.toBeNull();
          expect(mobileType?.faqFontSize).toBe('16px');
          expect(mobileType?.faqLineHeight).toBe('26.88px');
          expect(['16px', '17px']).toContain(mobileType?.proseFontSize);
          expect(['26.88px', '29.24px']).toContain(mobileType?.proseLineHeight);
        }
      }
    }
  });

  test('all app details and locales share the complete product template contract', async ({ page }) => {
    for (const slug of allProductSlugs) {
      for (const locale of productLocales) {
        await page.goto(`/apps/${slug}/${locale.suffix}`);
        const main = page.locator('main.page-shell');
        await expect(main).toHaveAttribute('data-product-slug', slug);
        await expect(main).toHaveAttribute('data-product-locale', locale.code);
        await expect(main.locator(':scope > .topbar')).toHaveCount(1);
        await expect(main.locator(':scope > .hero')).toHaveCount(1);
        await expect(main.locator(':scope > .content-band')).toHaveCount(1);
        await expect(main.locator(':scope > .faq-band')).toHaveCount(1);
        await expect(main.locator(':scope > .screens-band')).toHaveCount(1);
        await expect(main.locator(':scope > .download-band')).toHaveCount(1);
        const footer = main.locator(':scope > footer.site-footer');
        await expect(footer).toHaveCount(1);
        const privacyHref = slug === 'papira'
          ? `https://onnellab.github.io/privacy/${slug}/${locale.suffix}`
          : locale.code === 'ko'
            ? `https://onnellab.github.io/privacy/${slug}/ko/`
            : `https://onnellab.github.io/privacy/${slug}/`;
        expect(await footer.locator(':scope > a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
          privacyHref,
          `/terms/${locale.suffix}`,
          'mailto:onnellab.app@gmail.com'
        ]);
        await expect(footer.locator(':scope > span')).toHaveText('© ONNELLAB');
        const localeLinks = main.locator('.locale-menu-panel a[data-locale-choice]');
        await expect(localeLinks).toHaveCount(5);
        expect(await localeLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
          `/apps/${slug}/`,
          `/apps/${slug}/ko/`,
          `/apps/${slug}/ja/`,
          `/apps/${slug}/zh-hans/`,
          `/apps/${slug}/zh-hant/`
        ]);
      }
    }
  });

  for (const path of productPages) {
    test(`${path} exposes its FAQ and product schema`, async ({ page }) => {
      await page.goto(path);
      const isKo = path.endsWith('/ko/');
      await expect(page.locator('#faq-title')).toHaveText(isKo ? '자주 묻는 질문' : 'FAQ');
      await expect(page.locator('.faq-list details')).toHaveCount(3);

      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      const parsed = schemas.map((schema) => JSON.parse(schema));
      const application = parsed.find((item) => item['@type'] === 'SoftwareApplication');
      const faq = parsed.find((item) => item['@type'] === 'FAQPage');
      expect(application).toBeDefined();
      expect(faq).toBeDefined();
      expect(faq.mainEntity).toHaveLength(3);
    });
  }

  test('Papira uses the shared product-detail layout and its source icon', async ({ page }) => {
    await page.goto('/apps/papira/ko/');
    await expect(page.locator('main.page-shell')).toHaveAttribute('data-product-slug', 'papira');
    await expect(page.locator('.hero-grid')).toBeVisible();
    await expect(page.locator('.hero-actions')).toBeVisible();
    await expect(page.locator('.download-band')).toBeVisible();
    await expect(page.locator('.identity img')).toHaveAttribute('src', '/app-assets/papira/icon.png');
    await expect(page.locator('.content-band')).toHaveCount(1);
    await expect(page.locator('.download-band')).toContainText('출시 준비 중');

    await page.goto('/privacy/papira/ko/');
    const policyText = await page.locator('main').innerText();
    expect(policyText).toContain('이 개인정보 처리방침은 ONNELLAB이 제공하는 Papira 앱에 적용됩니다.');
    expect(policyText).toContain('아래와 같은 방식으로 운영됩니다.');
    expect(policyText).not.toContain('적용돼요');
    expect(policyText).not.toContain('운영돼요');
    expect(policyText).not.toContain('요구하지 않아요');
  });

  test('TagWeaver store links and privacy links match page locale', async ({ page }) => {
    await page.goto('/apps/tagweaver/');
    await expect(page.locator('.hero .button.primary').first()).toHaveAttribute(
      'href',
      /https:\/\/apps\.apple\.com\/us\/app\/id6759609875\?l=en-US/
    );
    await expect(page.locator('.support-links a').first()).toHaveAttribute(
      'href',
      'https://onnellab.github.io/privacy/tagweaver/'
    );

    await page.goto('/apps/tagweaver/ko/');
    await expect(page.locator('.hero .button.primary').first()).toHaveAttribute(
      'href',
      /https:\/\/apps\.apple\.com\/kr\/app\/id6759609875\?l=ko/
    );
    await expect(page.locator('.support-links a').first()).toHaveAttribute(
      'href',
      'https://onnellab.github.io/privacy/tagweaver/ko/'
    );
  });

  test('TagWeaver SEO metadata remains crawlable', async ({ page }) => {
    await page.goto('/apps/tagweaver/');
    await expect(page).toHaveTitle('TagWeaver - Offline MP3/FLAC Tag Editor');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://onnellab.github.io/apps/tagweaver/'
    );
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      'href',
      'https://onnellab.github.io/app-assets/tagweaver/assets/icon/tagweaver.png'
    );

    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const application = schemas
      .map((schema) => JSON.parse(schema))
      .find((item) => item['@type'] === 'SoftwareApplication');
    expect(application.name).toBe('TagWeaver');
    expect(application.privacyPolicy).toBe('https://onnellab.github.io/privacy/tagweaver/');
    expect(application.publisher.name).toBe('ONNELLAB');
  });

  test('product screenshot viewer opens, navigates, and closes', async ({ page }) => {
    await page.goto('/apps/tagweaver/');
    await page.locator('[data-screenshot-link]').first().click();

    const viewer = page.locator('.screenshot-viewer');
    await expect(viewer).toBeVisible();
    await expect(page.locator('[data-viewer-image]')).toHaveAttribute(
      'src',
      /tagweaver\/assets\/screenshots\/en\/1\.png/
    );

    await page.locator('[data-viewer-next]').click();
    await expect(page.locator('[data-viewer-image]')).toHaveAttribute(
      'src',
      /tagweaver\/assets\/screenshots\/en\/2\.png/
    );

    await page.locator('[data-viewer-close]').click();
    await expect(viewer).not.toBeVisible();
  });
});

test.describe('blog and crawl endpoints', () => {
  test('blog pages remain available in English and Korean', async ({ page }) => {
    await page.goto('/blog/');
    await expect(
      page.locator('.post-card').filter({ hasText: 'How to Read Large TXT Files Without Lag' })
    ).toHaveCount(1);
    await expect(page.locator('.top-nav a[href="/apps/"]')).toBeVisible();

    await page.goto('/blog/ko/');
    await expect(
      page.locator('.post-card').filter({ hasText: '대용량 TXT 파일을 지연 없이 읽는 방법' })
    ).toHaveCount(1);
    await expect(page.locator('.top-nav a[href="/apps/ko/"]')).toBeVisible();
  });

  test('blog article metadata remains answer-friendly', async ({ page }) => {
    await page.goto('/blog/en/read-large-txt-files-without-lag/');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const joined = jsonLd.join('\n');
    expect(joined).toContain('BlogPosting');
    expect(joined).toContain('BreadcrumbList');
    expect(joined).toContain('FAQPage');
  });

  test('robots, RSS, llms, and sitemap endpoints remain available', async ({ page }) => {
    const robots = await page.request.get('/robots.txt');
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain('Sitemap: https://onnellab.github.io/sitemap.xml');

    const rss = await page.request.get('/rss.xml');
    expect(rss.ok()).toBe(true);
    expect(await rss.text()).toContain('How to Read Large TXT Files Without Lag');

    const llms = await page.request.get('/llms.txt');
    expect(llms.ok()).toBe(true);
    const llmsText = await llms.text();
    expect(llmsText).toContain('## Blog Articles');
    expect(llmsText).toContain('## Papira');
    expect(llmsText).toContain('https://onnellab.github.io/apps/papira/zh-hant/');
    expect(llmsText).not.toContain('https://onnellab.github.io/undefined');
    expect(llmsText).toContain('https://onnellab.github.io/apps/tagweaver/ja/');
    expect(llmsText).toContain('https://onnellab.github.io/apps/tagweaver/zh-hant/');

    const sitemap = await page.request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    const text = await sitemap.text();
    expect(text).toContain('https://onnellab.github.io/apps/papira/ja/');
    expect(text).toContain('https://onnellab.github.io/privacy/papira/zh-hant/');
    expect(text).toContain('https://onnellab.github.io/apps/tagweaver/');
    expect(text).toContain('<loc>https://onnellab.github.io/apps/tagweaver/ja/</loc>');
    expect(text).toContain('<loc>https://onnellab.github.io/apps/tagweaver/zh-hant/</loc>');
  });
});
