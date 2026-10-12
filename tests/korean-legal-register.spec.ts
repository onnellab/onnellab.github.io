import { expect, test } from '@playwright/test';
import { allPrivacyAppSlugs } from '../src/lib/privacy-policy-documents';

const informalEnding = /(?:해요|돼요|있어요|없어요|이에요|예요|주세요|않아요|거예요|할게요|보내요)(?=[.!?\s]|$)/;

test('Korean terms and privacy text use a formal legal register across all policy pages', async ({ page }) => {
  const routes = [
    '/privacy/ko/',
    '/terms/ko/',
    '/terms/sonary/ko/',
    ...allPrivacyAppSlugs.map((slug) => '/privacy/' + slug + '/ko/')
  ];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    const content = (await page.locator('main').innerText()).trim();
    expect(content, route).not.toMatch(informalEnding);
    expect(content, route).toMatch(/(?:습니다|합니다|입니다|않습니다|됩니다|바랍니다|십시오)[.!?]/);
    expect(await page.locator('main h1').count(), route).toBe(1);
    expect(await page.locator('[data-site-header]').count(), route).toBe(1);
  }
});

test('Korean common terms clause six keeps email inside the sentence, including the closing particle', async ({ page }) => {
  await page.goto('/terms/ko/');
  const section = page.locator('.terms-prose > section').last();
  await expect(section.locator('h2')).toHaveText('6. 문의');
  const paragraph = section.locator('p');
  await expect(paragraph).toHaveText('이 약관에 관한 문의는 onnellab.app@gmail.com으로 보내실 수 있습니다.');
  const anchor = paragraph.locator('a[href="mailto:onnellab.app@gmail.com"]');
  await expect(anchor).toHaveCount(1);
  const result = await anchor.evaluate((element) => ({
    before: element.previousSibling?.textContent?.trim() ?? '',
    after: element.nextSibling?.textContent?.trim() ?? '',
    parentText: element.parentElement?.textContent?.trim() ?? ''
  }));
  expect(result.before).toBe('이 약관에 관한 문의는');
  expect(result.after).toBe('으로 보내실 수 있습니다.');
  expect(result.parentText).toBe('이 약관에 관한 문의는 onnellab.app@gmail.com으로 보내실 수 있습니다.');
  await expect(page.locator('main .updated')).toContainText('2026-10-12');
});

test('email remains inside the sentence in all five common-terms languages', async ({ page }) => {
  const routes = ['', 'ko/', 'ja/', 'zh-hans/', 'zh-hant/'];
  for (const locale of routes) {
    await page.goto('/terms/' + locale);
    const paragraph = page.locator('.terms-prose > section').last().locator('p');
    const email = paragraph.locator('a[href="mailto:onnellab.app@gmail.com"]');
    await expect(email).toHaveCount(1);
    const result = await email.evaluate((element) => ({
      before: element.previousSibling?.textContent?.trim() ?? '',
      after: element.nextSibling?.textContent?.trim() ?? '',
      inline: element.parentElement?.textContent?.trim() ?? ''
    }));
    expect(result.before.length, locale).toBeGreaterThan(4);
    expect(result.inline, locale).toContain('onnellab.app@gmail.com');
    expect(result.after.length, locale).toBeGreaterThan(0);
    expect(result.inline.endsWith('onnellab.app@gmail.com'), locale).toBe(false);
  }
});

test('non-legal Korean brand voice is unchanged', async ({ page }) => {
  await page.goto('/ko/');
  await expect(page.locator('h1')).toContainText('세심하게 만들어요.');
});
