import { expect, test } from '@playwright/test';
import { allAppPrivacyRouteFor, allProductRouteFor, allRouteFor, allSiteLocales } from '../src/lib/extended-site-i18n';
import { getLunaryPrivacyCopy } from '../src/lib/lunary-privacy';
import { getLunaryProductCopy } from '../src/lib/lunary-product';


test('Korean Lunary landing and privacy policy keep their intended speech levels', () => {
  const landing = JSON.stringify(getLunaryProductCopy('ko'));
  const privacy = JSON.stringify(getLunaryPrivacyCopy('ko'));
  expect(landing).toMatch(/예요|해요|돼요|있어요|없어요|않아요|보세요|나요\?/u);
  expect(landing).not.toMatch(/합니다|됩니다|습니다|않습니다/u);
  expect(privacy).toMatch(/합니다|됩니다|습니다|않습니다/u);
  expect(privacy).not.toMatch(/예요|해요|돼요|있어요|없어요|않아요/u);
});

test('localized Lunary copy avoids reviewed translationese and internal implementation jargon', () => {
  const banned: Record<string, string[]> = {
    en: ['platform boundary', 'last-pull time', 'private mapping properties', 'memory, atmosphere, and attachment'],
    ko: ['플랫폼 경계', '마지막 가져오기 시각', '비공개 매핑 속성', '선택형 Google Calendar', '안정적인 정지 포스터'],
    ja: ['プラットフォーム境界', '最終取得時刻', '非公開マッピング属性', '感性派', '安定した静止ポスター'],
    'zh-Hans': ['最后拉取时间', '平台边界', '私有映射属性', '留恋', '稳定的静态海报'],
    'zh-Hant': ['最後擷取時間', '平台邊界', '私有對應屬性', '留戀', '穩定的靜態海報', '不運作中轉'],
    'pt-BR': ['limite da plataforma', 'propriedades privadas de mapeamento', 'horário da última busca', 'clima e carinho', 'pôster estático e estável'],
    de: ['Plattformgrenze', 'persönliche Verbundenheit', 'Cover zum Behalten', 'private Zuordnungseigenschaften'],
    fr: ['limite de la plateforme', 'propriétés privées de correspondance', 'heure de dernière récupération', 'un attachement', 'couverture à garder'],
    es: ['límite de la plataforma', 'propiedades privadas de asignación', 'hora de la última descarga', 'ambiente y apego', 'portada para guardar']
  };
  for (const locale of allSiteLocales) {
    const combined = JSON.stringify({
      product: getLunaryProductCopy(locale),
      privacy: getLunaryPrivacyCopy(locale)
    });
    for (const phrase of banned[locale]) expect(combined).not.toContain(phrase);
  }
});

test('Lunary privacy policy is authored for all public locales', () => {
  for (const locale of allSiteLocales) {
    const copy = getLunaryPrivacyCopy(locale);
    expect(copy.sections).toHaveLength(8);
    const body = JSON.stringify(copy);
    expect(body).toContain('Lunary');
    expect(body).toContain('Google');
    expect(body).toContain('Google API Services User Data Policy');
    expect(body).toContain('Limited Use');
    expect(copy.updatedValue).toBe('2026-09-24');
  }
});

test('Lunary product privacy routes are public, canonical and link the global terms', async ({ page }) => {
  for (const locale of allSiteLocales) {
    const route = allAppPrivacyRouteFor('lunary', locale);
    await page.goto(route);
    await expect(page.locator('h1')).toContainText('Lunary');
    await expect(page.locator('main')).toContainText('Google API Services User Data Policy');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://onnellab.com' + route);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
    await expect(page.locator('footer a[href*="/terms/"]').first()).toBeVisible();
  }
});

test('Lunary app detail page visibly discloses optional Google Calendar use and privacy', async ({ page }) => {
  await page.goto('/apps/lunary/');
  await expect(page.locator('h1')).toContainText('Lunary');
  await expect(page.locator('main')).toContainText('Google Calendar');
  await expect(page.locator('a[href="https://onnellab.com/privacy/lunary/"]').first()).toBeVisible();
  await expect(page.locator('footer a[href="/terms/"]')).toBeVisible();
});


test('app indexes show Lunary as preparing for release in every public locale', async ({ page }) => {
  for (const locale of allSiteLocales) {
    await page.goto(allRouteFor('apps', locale));
    const card = page.locator('a[href="' + allProductRouteFor('lunary', locale) + '"]');
    await expect(card).toBeVisible();
    await expect(card).toContainText('Lunary');
    const status = card.locator('span').first();
    await expect(status).toBeVisible();
    expect((await status.textContent())?.trim().length ?? 0).toBeGreaterThan(0);
  }
});
