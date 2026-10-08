import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const apps = ['aligna', 'clipnest', 'lunary', 'melivra', 'meriq', 'papira', 'quivra', 'segra', 'tagweaver', 'vaultxt'] as const;
const locales = [
  { code: 'en', segment: '' }, { code: 'ko', segment: 'ko/' },
  { code: 'ja', segment: 'ja/' }, { code: 'zh-Hans', segment: 'zh-hans/' },
  { code: 'zh-Hant', segment: 'zh-hant/' }, { code: 'pt-BR', segment: 'pt-br/' },
  { code: 'de', segment: 'de/' }, { code: 'fr', segment: 'fr/' },
  { code: 'es', segment: 'es/' }
] as const;

for (const { code, segment } of locales) {
  test(`${code}: all ten app policies use one template and retain the app-specific copy`, async ({ page }) => {
    for (const app of apps) {
      const route = `/privacy/${app}/${segment}`;
      await page.goto(route);
      const main = page.locator('main.privacy-shell');
      await expect(main).toHaveAttribute('data-app-privacy', app);
      await expect(main).toHaveAttribute('data-policy-locale', code);
      await expect(page.locator('html')).toHaveAttribute('lang', code);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://onnellab.com${route}`);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
      await expect(page.locator('[data-locale-choice]')).toHaveCount(9);
      await expect(main.locator('section h3')).toHaveCount(8);
      await expect(main.locator('header h1')).toContainText(new RegExp(app, 'i'));
      await expect(main.locator('header time')).toHaveAttribute('datetime', /^2026-\d{2}-\d{2}$/);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);

      if (app === 'melivra') {
        await expect(main).toContainText(/AI|KI|IA|\u4eba\u5de5\u667a\u80fd|\u6587\u5b57\u8d77\u3053\u3057/i);
      }
      if (app === 'lunary') {
        await expect(main).toContainText(/Google (?:Calendar|Kalender|Agenda)/i);
        await expect(page.locator('a[href="https://developers.google.com/terms/api-services-user-data-policy"]')).toBeVisible();
      }
      if (app === 'papira') await expect(main).toContainText('EPUB');
    }
  });
}

test('all 16 preserved EN/KO policies keep every original subsection and its individual data statements', async ({ page }) => {
  for (const locale of ['en', 'ko'] as const) {
    for (const app of apps.filter((slug) => slug !== 'papira' && slug !== 'lunary')) {
      const reference = JSON.parse(fs.readFileSync(
        path.join(process.cwd(), 'src', 'content', 'privacy-policies', locale, app + '.json'), 'utf8'
      )) as { title: string; sections: Array<{ title: string; blocks: Array<{kind:string; value?:string; items?:string[]}> }> };
      await page.goto(`/privacy/${app}/${locale === 'en' ? '' : 'ko/'}`);
      const headings = await page.locator('main.privacy-shell section h3').allInnerTexts();
      expect(headings).toEqual(reference.sections.map((section) => section.title));
      const displayed = await page.locator('main.privacy-shell').innerText();
      for (const section of reference.sections) {
        for (const block of section.blocks) {
          if (block.kind === 'paragraph') expect(displayed).toContain(block.value!);
          if (block.kind === 'list') for (const item of block.items!) expect(displayed).toContain(item);
        }
      }
    }
  }
});

test('legacy Melivra policy links redirect to the matching nine-language standard route', async ({ page }) => {
  for (const { code, segment } of locales) {
    const oldPath = `/melivra-privacy-policy/${segment}`;
    const newPath = `/privacy/melivra/${segment}`;
    await page.goto(oldPath);
    await expect(page).toHaveURL(new RegExp(newPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
    await expect(page.locator('main.privacy-shell')).toHaveAttribute('data-policy-locale', code);
  }
});

test('privacy directories display authoritative update dates and canonical app URLs', async ({ page }) => {
  for (const { code, segment } of locales) {
    const path = code === 'en' ? '/privacy/' : `/privacy/${segment}`;
    await page.goto(path);
    const policies = page.locator('a.policy-row');
    const melivra = policies.filter({ has: page.getByRole('heading', { name: 'Melivra' }) });
    await expect(melivra).toContainText('2026-07-30');
    await expect(melivra).toHaveAttribute('href', new RegExp(`/privacy/melivra/${segment}$`));
    const papira = policies.filter({ has: page.getByRole('heading', { name: 'Papira' }) });
    await expect(papira).toContainText('2026-08-21');
    const lunary = policies.filter({ has: page.getByRole('heading', { name: 'Lunary' }) });
    await expect(lunary).toContainText('2026-09-27');
  }
});
