import { expect, test } from '@playwright/test';

for (const locale of ['ko', 'en']) {
  test(`${locale} next-reading cards show only titles while retaining navigation`, async ({ page }) => {
    await page.goto(`/blog/${locale}/trim-audio-recordings-without-full-editor/`);

    const cards = page.locator('.next-reading a.recommendation-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const card = cards.nth(i);
      await expect(card.locator('strong')).not.toBeEmpty();
      await expect(card).toHaveAttribute('href', new RegExp(`^https://onnellab\\.com/blog/${locale}/[^\\s]+/$`));
      const visibleText = await card.textContent();
      expect(visibleText).not.toMatch(/https?:\/\/|\s=>\s/);
      await expect(card.locator('small')).toHaveCount(0);
    }

    const href = await cards.first().getAttribute('href');
    await page.route('https://onnellab.com/blog/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Related article opened</h1>' })
    );
    await cards.first().click();
    await expect(page).toHaveURL(href!);
    await expect(page.getByRole('heading', { name: 'Related article opened' })).toBeVisible();
  });
}
