import { expect, test, type Page } from '@playwright/test';

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
const productPages = productSlugs.flatMap((slug) => [`/apps/${slug}/`, `/apps/${slug}/ko/`]);
const privacySlugs = ['aligna', 'clipnest', 'melivra', 'papira', 'quivra', 'segra', 'tagweaver', 'vaultxt'];
const privacyUrls = privacySlugs.map((slug) => `https://onnellab.github.io/privacy/${slug}/`);
const koreanPrivacyUrls = privacySlugs.map((slug) => `https://onnellab.github.io/privacy/${slug}/ko/`);

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

test.describe('site layout and navigation', () => {
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
    await page.goto('/ko/');
    const featured = page.locator('a.featured');
    await expect(featured).toHaveAttribute('href', '/apps/tagweaver/ko/');
    await expect(featured.locator('h2')).toContainText('TagWeaver');
    await expect(featured.locator('a')).toHaveCount(0);
    await expect(featured).not.toContainText('TagWeaver 살펴보기');
    await expect(page.locator('main')).not.toContainText('Papira');
    await expect(page.locator('.product-card')).toHaveCount(4);

    await page.goto('/ja/');
    await expect(page.locator('a.featured')).toHaveAttribute('href', '/apps/tagweaver/ja/');

    await page.goto('/zh-hans/');
    await expect(page.locator('a.featured')).toHaveAttribute('href', '/apps/tagweaver/zh-hans/');

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
    expect(mobileNavStyle).toEqual({ brandSize: 15, gap: 12, localeHeight: 32, localePadding: 10 });

    const featuredBox = await page.locator('a.featured').boundingBox();
    expect(featuredBox).not.toBeNull();
    if (!featuredBox) return;
    expect(featuredBox.y).toBeLessThan(844);
    await expect(page.locator('a.featured')).toContainText('TagWeaver');
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
        await expect(main.locator(':scope > footer')).toHaveCount(1);
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
