import { expect, test } from '@playwright/test';

const locales = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/', 'pt-br/', 'de/', 'fr/', 'es/'] as const;
const showcased = ['tagweaver', 'quivra', 'melivra', 'papira'] as const;

test('apps catalogue reuses the exact short homepage function labels in all nine languages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of locales) {
    await page.goto('/' + locale);

    const oneLiners: Record<string, string> = {
      tagweaver: (await page.locator('[data-hero-product="tagweaver"] .hero-slide-identity small').innerText()).trim()
    };
    const oldLongCopy: Record<string, string> = {
      tagweaver: (await page.locator('.signature-section #signature-title').innerText()).trim()
    };
    for (const slug of showcased.filter((item) => item !== 'tagweaver')) {
      const card = page.locator('.collection-section .product-card[href*="/apps/' + slug + '/"]');
      await expect(card).toHaveCount(1);
      oneLiners[slug] = (await card.locator('.product-category').innerText()).trim();
      oldLongCopy[slug] =
        (await card.locator('.product-card-body > p:not(.product-category)').innerText()).trim();
    }
    expect(Object.values(oneLiners).every((value) => value.trim().length > 0)).toBe(true);
    if (locale === 'ko/') {
      expect(oneLiners).toEqual({
        tagweaver: '음악 태그 편집',
        quivra: '미디어 파일 변환',
        melivra: '로컬 음악 플레이어',
        papira: '전자책 만들기'
      });
    }

    await page.goto('/apps/' + locale);
    const prefix = locale ? locale : '';
    for (const slug of showcased) {
      const href = '/apps/' + slug + '/' + prefix;
      const card = page.locator('.app-card[href="' + href + '"], .app-row[href="' + href + '"]');
      await expect(card).toHaveCount(1);
      await expect(card.locator('p').first()).toHaveText(oneLiners[slug]);
      const index = await card.getAttribute('data-app-search-text') ??
        await card.getAttribute('data-search-text') ?? '';
      expect(index, locale + slug).toContain(oneLiners[slug].normalize('NFKC').toLocaleLowerCase());
      // Keep the long homepage sentence searchable without displaying it.
      expect(index, locale + slug).toContain(oldLongCopy[slug].normalize('NFKC').toLocaleLowerCase());
    }

    // Apps without a homepage marketing line retain their ordinary localized
    // catalogue descriptions rather than receiving invented substitutes.
    const cards = page.locator('.app-card, .app-row');
    await expect(cards).toHaveCount(10);
    for (const slug of ['aligna', 'clipnest', 'lunary', 'meriq', 'segra', 'vaultxt']) {
      const card = cards.filter({ has: page.locator('h2', { hasText: new RegExp('^' + {
        aligna: 'Aligna', clipnest: 'ClipNest', lunary: 'Lunary',
        meriq: 'Meriq', segra: 'Segra', vaultxt: 'VaultXT'
      }[slug] + '$') }) });
      await expect(card).toHaveCount(1);
      expect((await card.locator('p').first().innerText()).trim().length).toBeGreaterThan(4);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
      .toBeLessThanOrEqual(1);
  }
});

test('existing search keywords still discover apps after their catalogue descriptions change', async ({ page }) => {
  for (const example of [
    { locale: 'ko/', keyword: 'MP3/FLAC' },
    { locale: '', keyword: 'MP3/FLAC' },
    { locale: 'de/', keyword: 'Offline-Editor' }
  ]) {
    await page.goto('/apps/' + example.locale);
    const search = page.locator('[data-app-search], [data-search]');
    await search.fill(example.keyword);
    const card = page.locator('.app-card[href*="/apps/tagweaver/"], .app-row[href*="/apps/tagweaver/"]');
    await expect(card).toBeVisible();
    await search.fill('');
    await expect(page.locator('.app-card:visible, .app-row:visible')).toHaveCount(10);
  }
});

test('product detail hero and SEO remain independent of homepage catalogue one-liners', async ({ page }) => {
  await page.goto('/apps/tagweaver/ko/');
  await expect(page.locator('main[data-product-slug="tagweaver"]')).toHaveCount(1);
  await expect(page.locator('.hero h1')).toHaveText('TagWeaver');
  await expect(page.locator('.hero .intro')).toBeVisible();
});
