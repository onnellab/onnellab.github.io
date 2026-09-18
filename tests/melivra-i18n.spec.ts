import { expect, test } from '@playwright/test';

const locales = [
  { path: '', lang: 'en', title: 'Melivra - Offline Music Player', subtitle: 'Offline Music Player', credit: 'AI Credits' },
  { path: 'ko/', lang: 'ko', title: 'Melivra - 오프라인 음악 플레이어', subtitle: '오프라인 음악 플레이어', credit: 'AI 크레딧' },
  { path: 'ja/', lang: 'ja', title: 'Melivra - オフライン音楽プレーヤー', subtitle: 'オフライン音楽プレーヤー', credit: 'AIクレジット' },
  { path: 'zh-hans/', lang: 'zh-Hans', title: 'Melivra - 离线音乐播放器', subtitle: '离线音乐播放器', credit: 'AI 积分' },
  { path: 'zh-hant/', lang: 'zh-Hant', title: 'Melivra - 離線音樂播放器', subtitle: '離線音樂播放器', credit: 'AI 點數' },
  { path: 'pt-br/', lang: 'pt-BR', title: 'Melivra - Player de música offline', subtitle: 'Player de música offline', credit: 'Créditos de IA' },
  { path: 'de/', lang: 'de', title: 'Melivra - Offline-Musikplayer', subtitle: 'Offline-Musikplayer', credit: 'KI-Credits' },
  { path: 'fr/', lang: 'fr', title: 'Melivra - Lecteur de musique hors ligne', subtitle: 'Lecteur de musique hors ligne', credit: 'crédits IA' },
  { path: 'es/', lang: 'es', title: 'Melivra - Reproductor de música sin conexión', subtitle: 'Reproductor de música sin conexión', credit: 'créditos de IA' }
] as const;

for (const locale of locales) {
  test(`Melivra ${locale.lang} publishes the complete localized product scope`, async ({ page }) => {
    await page.goto(`/apps/melivra/${locale.path}`);

    await expect(page).toHaveTitle(locale.title);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
    await expect(page.locator('.hero .intro')).toHaveText(locale.subtitle);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://onnellab.github.io/apps/melivra/${locale.path}`
    );
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);

    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription?.length ?? 0).toBeGreaterThanOrEqual(70);
    expect(metaDescription?.length ?? 999).toBeLessThanOrEqual(170);
    expect(metaDescription).not.toMatch(/Platforms:|지원 플랫폼:|対応プラットフォーム:|支持平台：|支援平台：|Plataformas:|Plattformen:|Plateformes\s*:|Plataformas:/u);

    const body = await page.locator('main').innerText();
    expect(body).toContain('ReplayGain');
    expect(body).toContain('M3U/M3U8');
    expect(body).toContain('TXT');
    expect(body).toContain('SRT');
    expect(body).toContain('LRC');
    expect(body).toContain('JSON');
    expect(body).toContain('CSV');
    expect(body.toLocaleLowerCase()).toContain(locale.credit.toLocaleLowerCase());
    expect(body).not.toContain('AI Tokens');
    expect(body).not.toContain('AI Token');
    expect(body).not.toContain('AI 대본');

    await expect(page.locator('.copy-column h2')).toHaveCount(2);
    await expect(page.locator('.copy-column li')).toHaveCount(12);
    await expect(page.locator('.faq-band details')).toHaveCount(4);

    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.flatMap((script) => {
        const parsed = JSON.parse(script.textContent ?? 'null');
        return Array.isArray(parsed) ? parsed : [parsed];
      })
    );
    const software = schemas.find((entry) => entry?.['@type'] === 'SoftwareApplication');
    expect(software?.description).toBe(metaDescription);
    expect(software?.applicationSubCategory).toBe('Offline Music Player');
    expect(software?.featureList).toHaveLength(7);
    expect(software?.featureList.join(' ')).toContain('ReplayGain');
    expect(software?.featureList.join(' ')).toContain('M3U/M3U8');
  });
}

test('Melivra llms.txt uses the current offline-player and AI Credits vocabulary', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.ok()).toBe(true);
  const text = await response.text();
  const line = text.split('\n').find((value) => value.startsWith('- [Melivra]')) ?? '';
  expect(line).toContain('offline MP3 and FLAC music player');
  expect(line).toContain('AI transcription and translation');
  expect(line).not.toContain('Local Audio Library Player');
  expect(line).not.toContain('AI Token');
});
