from pathlib import Path

path = Path('src/components/ProductTemplate.astro')
text = path.read_text()

replacements = [
    (
        "import { latestReleaseNoteForApp, releaseNotePath } from '../lib/releaseNotes';",
        "import { latestReleaseNoteForApp, releaseNoteKoPath, releaseNotePath } from '../lib/releaseNotes';"
    ),
    (
        "import { routeFor, type SiteLocale } from '../lib/site-i18n';",
        "import { localeDefinitions, routeFor, type SiteLocale } from '../lib/site-i18n';"
    ),
    (
        """const localizedAppStoreUrl = (url: string | undefined, locale: ProductPageData['locale']) => {\n  if (!url) return undefined;\n  const storeCountry = locale === 'ko' ? 'kr' : 'us';\n  const language = locale === 'ko' ? 'ko' : 'en-US';\n  const appStoreUrl = new URL(url);\n  appStoreUrl.pathname = appStoreUrl.pathname.replace(/^\\/(?:[a-z]{2}\\/)?app\\//, `/${storeCountry}/app/`);\n  appStoreUrl.searchParams.set('l', language);\n  return appStoreUrl.toString();\n};""",
        """const localizedAppStoreUrl = (url: string | undefined, locale: ProductPageData['locale']) => {\n  if (!url) return undefined;\n  const storeLocale = {\n    en: { country: 'us', language: 'en-US' },\n    ko: { country: 'kr', language: 'ko' },\n    ja: { country: 'jp', language: 'ja' },\n    'zh-Hans': { country: 'cn', language: 'zh-Hans-CN' },\n    'zh-Hant': { country: 'tw', language: 'zh-Hant-TW' }\n  }[locale];\n  const appStoreUrl = new URL(url);\n  appStoreUrl.pathname = appStoreUrl.pathname.replace(/^\\/(?:[a-z]{2}\\/)?app\\//, `/${storeLocale.country}/app/`);\n  appStoreUrl.searchParams.set('l', storeLocale.language);\n  return appStoreUrl.toString();\n};"""
    ),
    (
        """const localizedGooglePlayUrl = (url: string | undefined, locale: ProductPageData['locale']) => {\n  if (!url) return undefined;\n  const playStoreUrl = new URL(url);\n  playStoreUrl.searchParams.set('hl', locale === 'ko' ? 'ko' : 'en');\n  playStoreUrl.searchParams.set('gl', locale === 'ko' ? 'KR' : 'US');\n  return playStoreUrl.toString();\n};""",
        """const localizedGooglePlayUrl = (url: string | undefined, locale: ProductPageData['locale']) => {\n  if (!url) return undefined;\n  const storeLocale = {\n    en: { language: 'en', country: 'US' },\n    ko: { language: 'ko', country: 'KR' },\n    ja: { language: 'ja', country: 'JP' },\n    'zh-Hans': { language: 'zh-CN', country: 'CN' },\n    'zh-Hant': { language: 'zh-TW', country: 'TW' }\n  }[locale];\n  const playStoreUrl = new URL(url);\n  playStoreUrl.searchParams.set('hl', storeLocale.language);\n  playStoreUrl.searchParams.set('gl', storeLocale.country);\n  return playStoreUrl.toString();\n};"""
    ),
    (
        "const releaseNotesUrl = latestReleaseNote ? releaseNotePath(latestReleaseNote) : undefined;",
        """const releaseNotesUrl = latestReleaseNote\n  ? data.locale === 'en'\n    ? releaseNotePath(latestReleaseNote)\n    : data.locale === 'ko'\n      ? releaseNoteKoPath(latestReleaseNote)\n      : `${releaseNotePath(latestReleaseNote)}${localeDefinitions[data.locale].pathSegment}/`\n  : undefined;"""
    ),
]

for old, new in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'expected one marker, found {count}: {old[:100]!r}')
    text = text.replace(old, new)

path.write_text(text)
