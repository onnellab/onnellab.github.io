import { expect, test } from '@playwright/test';

const privacyDateLabels = [
  ['/privacy/', 'Last updated'],
  ['/privacy/ko/', '최종 업데이트'],
  ['/privacy/ja/', '最終更新日'],
  ['/privacy/zh-hans/', '最后更新'],
  ['/privacy/zh-hant/', '最後更新'],
  ['/privacy/pt-br/', 'Última atualização'],
  ['/privacy/de/', 'Zuletzt aktualisiert'],
  ['/privacy/fr/', 'Dernière mise à jour'],
  ['/privacy/es/', 'Última actualización']
] as const;

for (const [route, label] of privacyDateLabels) {
  test(`privacy hub uses the localized update label at ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('.policy-row').first()).toContainText(label);
  });
}

test('confirmed language-quality corrections remain visible', async ({ page }) => {
  await page.goto('/privacy/papira/de/');
  await expect(page.locator('main')).toContainText('Von der App verwaltete Projekte');
  await expect(page.locator('main')).toContainText('Papira respektiert Ihre Privatsphäre.');

  await page.goto('/blog/de/large-text-file-slow-to-open/');
  await expect(page.locator('h1')).toHaveText('Warum das Öffnen großer Textdateien lange dauert');

  await page.goto('/blog/ja/txt-vs-epub-for-long-reading/');
  await expect(page.locator('main')).toContainText('正本（Source of Truth）');

  await page.goto('/release-notes/tagweaver/2.2/ko/');
  await expect(page.locator('main')).toContainText('일상적인 태그 편집이 더 안정적으로 동작하도록 다듬었습니다.');
});
