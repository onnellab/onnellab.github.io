import { expect, test } from '@playwright/test';

test('VaultXT landing keeps five localized Android screenshots and a matching viewer', async ({ page }) => {
  for (const locale of ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es']) {
    const segment = locale === 'en' ? '' : `${locale.toLowerCase()}/`;
    await page.goto(`/apps/vaultxt/${segment}`);
    const images = page.locator('.screenshot-row img');
    await expect(images).toHaveCount(5);
    for (let index = 0; index < 5; index++) {
      await expect(images.nth(index)).toHaveAttribute('src', new RegExp(`/assets/screenshots/${locale}/${index + 1}\\.png\\?v=[a-f0-9]{64}$`));
      await expect(images.nth(index)).toHaveAttribute('alt', /VaultXT — .+/);
    }
    await expect(page.locator('[data-screenshot-count]')).toContainText('/ 5');
    await page.locator('[data-screenshot-link]').first().click();
    await expect(page.locator('dialog.screenshot-viewer')).toBeVisible();
    await expect(page.locator('.viewer-thumbs img')).toHaveCount(5);
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.screenshot-viewer')).not.toBeVisible();
    if (locale === 'ko') await page.screenshot({ path: `test-results/vaultxt-android-${test.info().project.name}.png`, fullPage: true });
  }
});
