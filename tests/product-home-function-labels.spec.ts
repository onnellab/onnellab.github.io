import { expect, test } from '@playwright/test';
import { getProductPageData, landingSubtitle } from '../src/lib/products';

const locales = [
  { segment: '', code: 'en' },
  { segment: 'ko/', code: 'ko' },
  { segment: 'ja/', code: 'ja' },
  { segment: 'zh-hans/', code: 'zh-Hans' },
  { segment: 'zh-hant/', code: 'zh-Hant' },
  { segment: 'pt-br/', code: 'pt-BR' },
  { segment: 'de/', code: 'de' },
  { segment: 'fr/', code: 'fr' },
  { segment: 'es/', code: 'es' }
] as const;
const showcases = ['tagweaver', 'quivra', 'melivra', 'papira'] as const;

test('product detail hero shows the same short functional category as the homepage and apps catalogue in nine locales', async ({ page }) => {
  for (const { segment } of locales) {
    await page.goto('/' + segment);
    const labels: Record<string, string> = {
      tagweaver: (await page.locator('[data-hero-product="tagweaver"] .hero-slide-identity small').innerText()).trim()
    };
    for (const slug of showcases.filter(slug => slug !== 'tagweaver')) {
      const card = page.locator('.collection-section .product-card[href*="/apps/' + slug + '/"]');
      labels[slug] = (await card.locator('.product-category').innerText()).trim();
    }
    if (segment === 'ko/') {
      expect(labels).toEqual({
        tagweaver: '음악 태그 편집',
        quivra: '미디어 파일 변환',
        melivra: '로컬 음악 플레이어',
        papira: '전자책 만들기'
      });
    }

    await page.goto('/apps/' + segment);
    for (const slug of showcases) {
      const route = '/apps/' + slug + '/' + segment;
      const card = page.locator('a.app-card[href="' + route + '"], a.app-row[href="' + route + '"]');
      await expect(card.locator('p').first()).toHaveText(labels[slug]);
      await page.goto(route);

      await expect(page.locator('main[data-product-slug]')).toHaveAttribute('data-product-slug', slug);
      await expect(page.locator('.hero h1')).toHaveText(new RegExp('^' + ({
        tagweaver: 'TagWeaver', quivra: 'Quivra',
        melivra: 'Melivra', papira: 'Papira'
      }[slug]) + '$'));
      await expect(page.locator('.hero .intro')).toHaveText(labels[slug]);
      await expect(page.locator('main .hero .support-links a')).toHaveCount(2);
      const pageCopy = await page.locator('meta[name="description"]').getAttribute('content');
      expect(pageCopy?.length).toBeGreaterThan(labels[slug].length);
      expect(await page.locator('main').innerText()).toContain(labels[slug]);
      await page.goto('/apps/' + segment);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
      .toBeLessThanOrEqual(1);
  }
});

test('unfeatured product detail heroes retain their original localized subtitles', async ({ page }) => {
  for (const { segment, code } of locales) {
    for (const slug of ['aligna', 'clipnest', 'lunary', 'meriq', 'segra', 'vaultxt']) {
      const original = landingSubtitle(getProductPageData(slug, code).copy);
      await page.goto('/apps/' + slug + '/' + segment);
      if (original) {
        await expect(page.locator('.hero .intro')).toHaveText(original);
      } else {
        await expect(page.locator('.hero .intro')).toHaveCount(0);
      }
    }
  }
});

test('short functional description and intact product detail keep mobile layout usable', async ({ page }) => {
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/apps/melivra/ko/');
    await expect(page.locator('.hero .intro')).toHaveText('로컬 음악 플레이어');
    await expect(page.locator('.hero .store-actions')).toBeVisible();
    await expect(page.locator('.screens-band')).toBeVisible();
    await expect(page.locator('.faq-band')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
      .toBeLessThanOrEqual(1);
  }
});
