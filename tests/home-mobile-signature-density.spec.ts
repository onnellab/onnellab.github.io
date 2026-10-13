import { expect, test } from '@playwright/test';

test('mobile signature retains all content and authentic screenshot at a more compact height', async ({ page }) => {
  const screenWidths = [
    { width: 320, maxFeatured: 575, maxSection: 710 },
    { width: 390, maxFeatured: 520, maxSection: 640 }
  ] as const;
  for (const { width, maxFeatured, maxSection } of screenWidths) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/ko/');
    const section = page.locator('.signature-section');
    const featured = section.locator('.featured');
    const screenshot = section.locator('.featured-screen img');
    const details = featured.locator('.featured-copy');
    const feature = await featured.boundingBox();
    const sectionBox = await section.boundingBox();
    expect(feature?.height, String(width)).toBeLessThanOrEqual(maxFeatured);
    expect(sectionBox?.height, String(width)).toBeLessThanOrEqual(maxSection);
    await expect(screenshot).toBeVisible();
    await expect(screenshot).toHaveAttribute('src', /tagweaver-library\.png$/);
    await expect(details.locator('.product-name')).toHaveText('TagWeaver');
    await expect(details.locator('.platform-text')).toBeVisible();
    await expect(details.locator('h2')).toBeVisible();
    await expect(details.locator('p')).toBeVisible();
    await expect(details.locator('.text-arrow')).toBeVisible();
    expect((await details.locator('p').innerText()).length).toBeGreaterThan(20);
    const positions = await featured.evaluate((card) => {
      const bounds = (s: string) => card.querySelector(s)!.getBoundingClientRect();
      const image = bounds('.featured-image-stage');
      const caption = bounds('.featured-copy');
      return { imageBottom: image.bottom, textTop: caption.top, textBottom: caption.bottom,
        viewportOverflow: document.documentElement.scrollWidth - innerWidth };
    });
    expect(positions.imageBottom).toBeLessThanOrEqual(positions.textTop + 1);
    expect(positions.textBottom).toBeGreaterThan(positions.textTop);
    expect(positions.viewportOverflow).toBeLessThanOrEqual(1);
  }
});

test('desktop signature keeps its generous editorial layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ko/');
  const card = page.locator('.signature-section .featured');
  const image = card.locator('.featured-image-stage');
  const text = card.locator('.featured-copy');
  const [imageBox, textBox, cardBox] = await Promise.all([image.boundingBox(), text.boundingBox(), card.boundingBox()]);
  expect(imageBox?.width).toBeGreaterThan(450);
  expect(textBox?.width).toBeGreaterThan(350);
  expect(cardBox?.height).toBeGreaterThanOrEqual(435);
});
