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

  test('browser language never forces a redirect', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko'] });
      Object.defineProperty(navigator, 'language', { get: () => 'ko-KR' });
    });

    await page.goto('/');
    await expect.poll(() => new URL(page.url()).pathname).toBe('/');

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

  test('home highlights Papira and keeps four existing product cards', async ({ page }) => {
    await page.goto('/ko/');
    await expect(page.locator('.featured h2')).toContainText('EPUB');
    await expect(page.locator('.featured a')).toHaveAttribute('href', '/apps/papira/ko/');
    await expect(page.locator('.product-card')).toHaveCount(4);
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
  test('apps search filters localized product rows', async ({ page }) => {
    await page.goto('/apps/ja/');
    await page.locator('[data-app-search]').fill('papira');
    await expect(page.locator('[data-app-row]:visible')).toHaveCount(1);
    await expect(page.locator('[data-app-row]:visible h2')).toHaveText('Papira');

    await page.locator('[data-app-search]').fill('missing-app');
    await expect(page.locator('[data-app-row]:visible')).toHaveCount(0);
    await expect(page.locator('[data-app-empty]')).toBeVisible();
  });

  test('non-Papira products remain English and Korean only', async ({ page }) => {
    await page.goto('/apps/zh-hant/');
    await expect(page.locator('[data-app-row]').filter({ hasText: 'Papira' })).toHaveAttribute(
      'href',
      '/apps/papira/zh-hant/'
    );
    await expect(page.locator('[data-app-row]').filter({ hasText: 'TagWeaver' })).toHaveAttribute(
      'href',
      '/apps/tagweaver/'
    );

    await page.goto('/apps/ko/');
    await expect(page.locator('[data-app-row]').filter({ hasText: 'TagWeaver' })).toHaveAttribute(
      'href',
      '/apps/tagweaver/ko/'
    );
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

    const sitemap = await page.request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    const text = await sitemap.text();
    expect(text).toContain('https://onnellab.github.io/apps/papira/ja/');
    expect(text).toContain('https://onnellab.github.io/privacy/papira/zh-hant/');
    expect(text).toContain('https://onnellab.github.io/apps/tagweaver/');
    expect(text).not.toContain('<loc>https://onnellab.github.io/apps/tagweaver/ja/</loc>');
  });
});
