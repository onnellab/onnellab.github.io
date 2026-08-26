import { expect, test } from '@playwright/test';

import {
  allLocaleDefinitions,
  allSiteLocales,
  type AllSiteLocale
} from '../src/lib/extended-site-i18n';
import {
  getExtendedReleaseCopy,
  releaseNoteLocalePath,
  type ReleaseLocale
} from '../src/lib/extended-release-notes';
import {
  releaseNoteKoPath,
  releaseNotePath,
  releaseNotes,
  type ReleaseNote
} from '../src/lib/releaseNotes';

const canonical = (path: string) => `https://onnellab.github.io${path}`;

function releasePathFor(note: ReleaseNote, locale: AllSiteLocale): string {
  if (locale === 'en') return releaseNotePath(note);
  if (locale === 'ko') return releaseNoteKoPath(note);
  return releaseNoteLocalePath(note, locale as ReleaseLocale);
}

function localizedCopy(note: ReleaseNote, locale: AllSiteLocale) {
  if (locale === 'en') {
    return { summary: note.summary, changes: note.changes };
  }
  if (locale === 'ko') {
    return { summary: note.summaryKo, changes: note.changesKo };
  }
  return getExtendedReleaseCopy(note, locale as ReleaseLocale);
}

test('every published release note has complete copy in all nine languages', () => {
  expect(releaseNotes.length).toBeGreaterThan(0);

  for (const note of releaseNotes) {
    for (const locale of allSiteLocales) {
      const copy = localizedCopy(note, locale);
      expect(copy.summary.trim(), `${note.appSlug}/${note.version}/${locale} summary`).not.toBe('');
      expect(copy.changes.length, `${note.appSlug}/${note.version}/${locale} changes`).toBeGreaterThan(0);
      for (const change of copy.changes) {
        expect(change.trim(), `${note.appSlug}/${note.version}/${locale} change`).not.toBe('');
      }
    }
  }
});

test('every published release note exposes the same nine-language page contract', async ({ page }) => {
  for (const note of releaseNotes) {
    for (const locale of allSiteLocales) {
      const definition = allLocaleDefinitions[locale];
      const path = releasePathFor(note, locale);
      const copy = localizedCopy(note, locale);
      const context = `${note.appSlug}/${note.version}/${locale}`;

      await page.goto(path);
      await expect.soft(page.locator('html'), `${context} html lang`).toHaveAttribute(
        'lang',
        definition.htmlLang
      );
      await expect.soft(page.locator('link[rel="canonical"]'), `${context} canonical`).toHaveAttribute(
        'href',
        canonical(path)
      );
      await expect.soft(page.locator('.locale-menu-panel a'), `${context} locale menu`).toHaveCount(9);
      await expect.soft(
        page.locator('link[rel="alternate"][hreflang]'),
        `${context} alternate links`
      ).toHaveCount(10);
      await expect.soft(
        page.locator('.locale-menu-panel a[aria-current="page"]'),
        `${context} current locale`
      ).toHaveAttribute('href', path);
      await expect.soft(page.locator('.summary'), `${context} summary`).toHaveText(copy.summary);
      await expect.soft(
        page.locator('.release-note section').first().locator('li'),
        `${context} changes`
      ).toHaveText(copy.changes);

      const techArticle = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
        scripts
          .flatMap((script) => {
            const value = JSON.parse(script.textContent ?? 'null');
            return Array.isArray(value) ? value : [value];
          })
          .find((entry) => entry?.['@type'] === 'TechArticle')
      );
      expect.soft(techArticle?.inLanguage, `${context} schema language`).toBe(definition.htmlLang);
      expect.soft(techArticle?.mainEntityOfPage, `${context} schema canonical`).toBe(canonical(path));
    }
  }
});
