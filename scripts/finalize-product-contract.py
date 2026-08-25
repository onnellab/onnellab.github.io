from pathlib import Path
import re


def read(path: str) -> str:
    return Path(path).read_text(encoding='utf-8')


def write(path: str, text: str) -> None:
    Path(path).write_text(text, encoding='utf-8')


def once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 match, got {count}')
    return text.replace(old, new)


def sub_once(text: str, pattern: str, replacement: str, label: str) -> str:
    out, count = re.subn(pattern, lambda _m: replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 regex match, got {count}')
    return out

# Real product-code fix: schema/hero features must fall back to the detailed platform copy.
path = 'src/components/ProductTemplate.astro'
text = read(path)
text = once(
    text,
    """const bodyBlocks = renderBlocks(pageBodyDescription(copy));
const heroIntro = landingSubtitle(copy);
const heroSignals =
  data.heroSignals ??
  (bodyBlocks.find((block) => block.type === 'ul')?.value as string[] | undefined)?.slice(0, 3) ?? [];
""",
    """const bodyBlocks = renderBlocks(pageBodyDescription(copy));
const heroIntro = landingSubtitle(copy);
const firstFeatureList = (value: string | undefined): string[] | undefined => {
  if (!value) return undefined;
  return renderBlocks(value).find((block) => block.type === 'ul')?.value as string[] | undefined;
};
const heroSignals =
  data.heroSignals ??
  firstFeatureList(pageBodyDescription(copy))?.slice(0, 3) ??
  firstFeatureList(copy.android.description)?.slice(0, 3) ??
  firstFeatureList(copy.ios.description)?.slice(0, 3) ??
  [];
""",
    'product feature fallback',
)
write(path, text)

# Extended locale tests: ProductTemplate intentionally uses absolute privacy URLs.
path = 'tests/extended-i18n.spec.ts'
text = read(path)
text = once(
    text,
    ").toHaveAttribute('href', `/privacy/tagweaver/${locale.segment}/`);",
    ").toHaveAttribute('href', canonical(`/privacy/tagweaver/${locale.segment}/`));",
    'extended privacy absolute URL',
)
write(path, text)

# Base Japanese/Chinese product privacy URLs are canonicalized with a trailing slash.
path = 'tests/site-i18n.spec.ts'
text = read(path)
text = once(
    text,
    "`https://onnellab.github.io/privacy/${slug}/${segment}`",
    "`https://onnellab.github.io/privacy/${slug}/${segment}/`",
    'legacy product privacy trailing slash',
)
write(path, text)

# Modernize the old visual regression suite to the already-shipped nine-language contract.
path = 'tests/site-visual.spec.ts'
text = read(path)
text = sub_once(
    text,
    r"const productLocales = \[.*?\] as const;",
    """const productLocales = [
  { code: 'en', suffix: '' },
  { code: 'ko', suffix: 'ko/' },
  { code: 'ja', suffix: 'ja/' },
  { code: 'zh-Hans', suffix: 'zh-hans/' },
  { code: 'zh-Hant', suffix: 'zh-hant/' },
  { code: 'pt-BR', suffix: 'pt-br/' },
  { code: 'de', suffix: 'de/' },
  { code: 'fr', suffix: 'fr/' },
  { code: 'es', suffix: 'es/' }
] as const;""",
    'nine product locales',
)
text = sub_once(
    text,
    r"const footerLabels = \{.*?\} as const;",
    """const footerLabels = {
  en: { privacy: 'Privacy Policy', terms: 'Terms' },
  ko: { privacy: '개인정보 처리방침', terms: '이용약관' },
  ja: { privacy: 'プライバシーポリシー', terms: '利用規約' },
  'zh-Hans': { privacy: '隐私政策', terms: '使用条款' },
  'zh-Hant': { privacy: '隱私權政策', terms: '使用條款' },
  'pt-BR': { privacy: 'Política de Privacidade', terms: 'Termos' },
  de: { privacy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen' },
  fr: { privacy: 'Politique de confidentialité', terms: 'Conditions d’utilisation' },
  es: { privacy: 'Política de privacidad', terms: 'Términos de uso' }
} as const;
const allNineHreflangs = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es', 'x-default'];""",
    'nine footer labels',
)
# Replace the obsolete exact two-language generated-page assumptions with a structural rendering contract.
text = sub_once(
    text,
    r"  test\('all remaining generated HTML routes retain their supported-locale and rendering contracts'.*?\n  \}\);\n\n  for \(const path of corePages\)",
    """  test('all remaining generated HTML routes retain their rendering contracts', async ({ page }) => {
    expect(blogArticleContracts.length).toBeGreaterThan(0);
    expect(releaseNoteContracts.length).toBeGreaterThan(0);
    const routes = [
      ...blogArticleContracts,
      ...releaseNoteContracts,
      ...remainingGeneratedPageContracts
    ];
    expect(new Set(routes.map((route) => route.path)).size).toBe(routes.length);

    for (const route of routes) {
      await test.step(route.path, async () => {
        const response = await page.goto(route.path);
        expect(response?.ok()).toBe(true);
        await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
        await expect(page.locator('link[rel=\"canonical\"]')).toHaveAttribute(
          'href',
          new URL(route.path, 'https://onnellab.github.io').toString()
        );
        const hreflangs = await page.locator('link[rel=\"alternate\"][hreflang]').evaluateAll((links) =>
          links.map((link) => link.getAttribute('hreflang'))
        );
        if (route.standardizedChrome) {
          expect(hreflangs).toEqual(allNineHreflangs);
          await expect(page.locator(route.mainSelector).locator('[data-locale-choice]')).toHaveCount(9);
        } else {
          expect(hreflangs.length).toBeGreaterThanOrEqual(2);
        }

        const main = page.locator(route.mainSelector);
        await expect(main).toHaveCount(1);
        await expect(main.locator('h1')).toHaveCount(1);
        await expect(main.locator('h1')).toHaveText(route.h1);
        await assertVisibleImagesHealthy(page);
        expect(await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
        )).toBe(true);
      });
    }
  });

  for (const path of corePages)""",
    'generated route contract',
)
text = once(text, "test('core language menus expose five explicit choices'", "test('core language menus expose nine explicit choices'", 'language menu test title')
text = once(
    text,
    """      '日本語',
      '简体中文',
      '繁體中文'
    ]);""",
    """      '日本語',
      '简体中文',
      '繁體中文',
      'Português (Brasil)',
      'Deutsch',
      'Français',
      'Español'
    ]);""",
    'nine language menu labels',
)
for old, new, label in [
    ("{ home: '/ja/', about: '/about/ja/', blog: '/blog/', blogText: 'ブログ · EN'", "{ home: '/ja/', about: '/about/ja/', blog: '/blog/ja/', blogText: 'ブログ'", 'Japanese blog nav'),
    ("{ home: '/zh-hans/', about: '/about/zh-hans/', blog: '/blog/', blogText: '博客 · EN'", "{ home: '/zh-hans/', about: '/about/zh-hans/', blog: '/blog/zh-hans/', blogText: '博客'", 'Simplified Chinese blog nav'),
    ("{ home: '/zh-hant/', about: '/about/zh-hant/', blog: '/blog/', blogText: '部落格 · EN'", "{ home: '/zh-hant/', about: '/about/zh-hant/', blog: '/blog/zh-hant/', blogText: '部落格'", 'Traditional Chinese blog nav'),
]:
    text = once(text, old, new, label)
# Legacy alias test should compare aliases with each other; canonical policy is now its own localized page family.
text = once(
    text,
    """        const routes = [
          `/${slug}/privacy/${suffix}`,
          `/apps/${slug}/privacy/${suffix}`,
          `/privacy/${slug}/${suffix}`
        ];""",
    """        const routes = [
          `/${slug}/privacy/${suffix}`,
          `/apps/${slug}/privacy/${suffix}`
        ];""",
    'legacy privacy aliases only',
)
text = once(text, "        expect(snapshots[2]).toEqual(snapshots[0]);\n", "", 'remove third alias snapshot')
# Special legal pages intentionally have their own chrome; shared visual contract remains for common site families.
text = text.replace("      '/oauth/x/callback/ko/',\n", "")
text = text.replace("      '/privacy/papira/ko/'\n", "")
# Semantic shared footer test: keep it on components that actually use SiteFooter.
text = sub_once(
    text,
    r"    const routes = \[\n      \{ path: '/ko/'.*?\n    \] as const;",
    """    const routes = [
      { path: '/ko/', locale: 'ko', privacy: '/privacy/ko/', terms: '/terms/ko/' },
      { path: '/apps/ja/', locale: 'ja', privacy: '/privacy/ja/', terms: '/terms/ja/' },
      { path: '/about/zh-hans/', locale: 'zh-Hans', privacy: '/privacy/zh-hans/', terms: '/terms/zh-hans/' },
      { path: '/privacy/zh-hant/', locale: 'zh-Hant', privacy: '/privacy/zh-hant/', terms: '/terms/zh-hant/' },
      { path: '/terms/', locale: 'en', privacy: '/privacy/', terms: '/terms/' },
      {
        path: '/apps/papira/ko/',
        locale: 'ko',
        privacy: 'https://onnellab.github.io/privacy/papira/ko/',
        terms: '/terms/ko/'
      },
      {
        path: '/apps/tagweaver/fr/',
        locale: 'fr',
        privacy: 'https://onnellab.github.io/privacy/tagweaver/fr/',
        terms: '/terms/fr/'
      }
    ] as const;""",
    'semantic SiteFooter routes',
)
text = text.replace("await expect(localeList.locator(':scope > li')).toHaveCount(5);", "await expect(localeList.locator(':scope > li')).toHaveCount(9);")
text = text.replace("await expect(localeList.locator(':scope > li > a')).toHaveCount(5);", "await expect(localeList.locator(':scope > li > a')).toHaveCount(9);")
text = once(text, "test('terms retain the same five-locale legal page contract'", "test('terms retain the base legal content with nine-language alternates'", 'terms title')
text = once(text, "await expect(page.locator('link[rel=\"alternate\"][hreflang]')).toHaveCount(6);", "await expect(page.locator('link[rel=\"alternate\"][hreflang]')).toHaveCount(10);", 'terms hreflang count')
text = once(text, "test('Japanese and Chinese privacy hubs localize Papira while preserving existing policy URLs'", "test('Japanese and Chinese privacy hubs link every app to the active locale policy'", 'privacy hub title')
text = once(
    text,
    """        'href',
        'https://onnellab.github.io/privacy/tagweaver/'
""",
    """        'href',
        `https://onnellab.github.io/privacy/tagweaver/${locale}/`
""",
    'localized TagWeaver privacy hub',
)
# Unified product contract across all nine locales.
text = sub_once(
    text,
    r"        const privacyHref = slug === 'papira'\n.*?            : `https://onnellab.github.io/privacy/\$\{slug\}/`;",
    """        const privacyHref = `https://onnellab.github.io/privacy/${slug}/${locale.suffix}`;""",
    'product footer privacy URL',
)
text = once(text, "await expect(localeLinks).toHaveCount(5);", "await expect(localeLinks).toHaveCount(9);", 'product locale count')
text = once(
    text,
    """          `/apps/${slug}/ja/`,
          `/apps/${slug}/zh-hans/`,
          `/apps/${slug}/zh-hant/`
        ]);""",
    """          `/apps/${slug}/ja/`,
          `/apps/${slug}/zh-hans/`,
          `/apps/${slug}/zh-hant/`,
          `/apps/${slug}/pt-br/`,
          `/apps/${slug}/de/`,
          `/apps/${slug}/fr/`,
          `/apps/${slug}/es/`
        ]);""",
    'product locale href list',
)
write(path, text)

# Remove this one-shot script from the commit once it has done its work.
Path(__file__).unlink()
