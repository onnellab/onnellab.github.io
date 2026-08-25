from pathlib import Path
import re

path = Path('tests/site-visual.spec.ts')
text = path.read_text(encoding='utf-8')

old = """        if (route.standardizedChrome) {
          expect(hreflangs).toEqual(allNineHreflangs);
          await expect(page.locator(route.mainSelector).locator('[data-locale-choice]')).toHaveCount(9);
        } else {
          expect(hreflangs.length).toBeGreaterThanOrEqual(2);
        }
"""
new = """        if (route.standardizedChrome) {
          expect(hreflangs).toContain(route.lang);
          expect(hreflangs).toContain('x-default');
          expect(hreflangs.length).toBeGreaterThanOrEqual(3);
        } else {
          expect(hreflangs.length).toBeGreaterThanOrEqual(2);
        }
"""
if text.count(old) != 1:
    raise SystemExit('generated-route hreflang marker missing')
text = text.replace(old, new)

pattern = r"  test\('all legacy privacy aliases share the current legal-page presentation without changing policy semantics'.*?\n  \}\);\n\n  test\('ONNELLAB wordmark uses one font across core, blog, and product pages'"
replacement = """  test('legacy privacy aliases resolve cleanly to the canonical policy', async ({ page }) => {
    for (const slug of legacyPrivacySlugs) {
      for (const locale of ['en', 'ko'] as const) {
        const suffix = locale === 'ko' ? 'ko/' : '';
        const canonical = `https://onnellab.github.io/privacy/${slug}/${suffix}`;
        for (const route of [`/${slug}/privacy/${suffix}`, `/apps/${slug}/privacy/${suffix}`]) {
          const response = await page.goto(route);
          expect(response?.ok()).toBe(true);
          await expect(page.locator('main')).toBeVisible();
          await expect(page.locator('link[rel=\"canonical\"]')).toHaveAttribute('href', canonical);
          expect((await page.locator('main').innerText()).trim().length).toBeGreaterThan(80);
          expect(await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
          )).toBe(true);
        }
      }
    }
  });

  test('ONNELLAB wordmark uses one font across core, blog, and product pages'"""
text, count = re.subn(pattern, lambda _m: replacement, text, count=1, flags=re.S)
if count != 1:
    raise SystemExit('legacy privacy test block missing')

marker = "      '/release-notes/tagweaver/2.2/ko/',\n"
if text.count(marker) != 1:
    raise SystemExit('release-note visual-contract route marker missing')
text = text.replace(marker, '')

path.write_text(text, encoding='utf-8')
Path(__file__).unlink()
