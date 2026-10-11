import { expect, test } from '@playwright/test';
const locales = [
  ['en', ''], ['ko', 'ko/'], ['ja', 'ja/'], ['zh-Hans', 'zh-hans/'],
  ['zh-Hant', 'zh-hant/'], ['pt-BR', 'pt-br/'], ['de', 'de/'], ['fr', 'fr/'], ['es', 'es/']
] as const;
for (const [locale, segment] of locales) {
  test(`${locale}: Sonary legal navigation and launch copy`, async ({ page, request }) => {
    for (const kind of ['privacy', 'terms']) {
      const route = `/${kind}/sonary/${segment}`;
      await page.goto(route);
      const main = page.locator('main.privacy-shell');
      await expect(main).toHaveAttribute(`data-app-${kind}`, 'sonary');
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://onnellab.com${route}`);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
      await expect(main.locator('section h3')).toHaveCount(8);
      await expect(main.locator('header time')).toHaveAttribute('datetime', '2026-10-12');
      await expect(page.locator(`a[href="/${kind === 'privacy' ? 'terms' : 'privacy'}/sonary/${segment}"]`)).toBeVisible();
      await expect(page.locator('.external-policy-links').locator(`a[href="/terms/${segment}"]`)).toBeVisible();
      const text = await main.innerText();
      expect(text).not.toMatch(/not yet available|not yet on sale|まだ提供していません|아직 제공되지|尚未开放|尚未開放|noch nicht verfügbar|ainda não estão disponíveis|ne sont pas encore disponibles|aún no están disponibles/);
      if (kind === 'privacy') {
        expect(text).toContain('OpenAI'); expect(text).toContain('Modal');
        expect(text).toMatch(/30/); expect(text).toMatch(/7/);
        await expect(main.locator('section a[href="mailto:onnellab.app@gmail.com"]')).toBeVisible();
      } else { expect(text).toMatch(/60/); expect(text).toMatch(/120/); expect(text).toMatch(/30/); expect(text).toMatch(/1/); }
      // Keyboard-operated language selector must keep navigation within this document family.
      const summary = page.locator('.locale-menu summary');
      await summary.focus(); await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-locale-choice="en"]')).toBeFocused();
      for (const [, target] of locales) await expect(page.locator(`[data-locale-choice][href="/${kind}/sonary/${target}"]`)).toHaveCount(1);
      await summary.click();
      await page.setViewportSize({ width: 320, height: 720 });
      await page.addStyleTag({ content: '.privacy-shell p, .privacy-shell li { font-size: 32px !important; }' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
    await page.goto(`/privacy/${segment}`);
    await expect(page.locator(`a.policy-row[href="/privacy/sonary/${segment}"]`)).toHaveCount(1);
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain(`https://onnellab.com/privacy/sonary/${segment}`);
    expect(sitemap).toContain(`https://onnellab.com/terms/sonary/${segment}`);
  });
}
