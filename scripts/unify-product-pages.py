from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(".")


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, text: str) -> None:
    (ROOT / path).write_text(text, encoding="utf-8")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new)


def sub_once(text: str, pattern: str, repl: str, label: str, flags: int = re.S) -> str:
    out, count = re.subn(pattern, repl, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 regex match, found {count}")
    return out


# ---------------------------------------------------------------------------
# Product data model: one locale type for all nine languages; no price schema.
# ---------------------------------------------------------------------------
path = "src/lib/products.ts"
text = read(path)
text = replace_once(
    text,
    """import {
  productLocaleAlternates,
  productRouteFor,
  siteLocales,
  type SiteLocale
} from './site-i18n';
import { getLocalizedProductContent } from './product-localizations';
""",
    """import { type SiteLocale } from './site-i18n';
import {
  allProductLocaleAlternates,
  allProductRouteFor,
  allSiteLocales,
  isExtendedSiteLocale,
  type AllSiteLocale
} from './extended-site-i18n';
import { getLocalizedProductContent } from './product-localizations';
import { getExtendedProductCopy } from './extended-product-localizations';
""",
    "products imports",
)
text = replace_once(text, "export type Locale = SiteLocale;", "export type Locale = AllSiteLocale;", "products Locale")
for line in (
    "  pricing?: string;\n",
    "  price?: number;\n",
    "  priceCurrency?: string;\n",
):
    text = replace_once(text, line, "", f"remove ProductMeta {line.strip()}")
text = text.replace("productRouteFor(source.slug, locale)", "allProductRouteFor(source.slug, locale)")
text = text.replace("productLocaleAlternates(source.slug)", "allProductLocaleAlternates(source.slug)")
text = text.replace("href: productRouteFor(source.slug, locale),", "href: allProductRouteFor(source.slug, locale),")
text = replace_once(
    text,
    """export function getAllProductPages(): ProductPageData[] {
  return getProductSources().flatMap((source) =>
    siteLocales.map((locale) => getProductPageData(source.slug, locale))
  );
}
""",
    """export function getAllProductPages(): ProductPageData[] {
  return getProductSources().flatMap((source) =>
    allSiteLocales.map((locale) => getProductPageData(source.slug, locale))
  );
}
""",
    "all product pages",
)
text = replace_once(
    text,
    "function getScreenshotRoutePaths(source: ProductSource, locale: Locale): string[] {",
    "export function getScreenshotRoutePaths(source: ProductSource, locale: Locale): string[] {",
    "export screenshot routes",
)
text = sub_once(
    text,
    r"""function getScreenshotAssets\(\): Array<\{ routePath: string; filePath: string \}> \{
.*?
\}
""",
    """function getScreenshotAssets(): Array<{ routePath: string; filePath: string }> {
  const assets = new Map<string, string>();
  for (const source of getProductSources()) {
    for (const locale of allSiteLocales) {
      for (const routePath of getScreenshotRoutePaths(source, locale)) {
        const normalizedRoute = routePath.replace(/^\\/+/, '');
        assets.set(
          normalizedRoute,
          path.resolve(source.contentDir, routePath.replace(`/app-assets/${source.slug}/`, ''))
        );
      }
    }
  }
  return [...assets.entries()].map(([routePath, filePath]) => ({ routePath, filePath }));
}
""",
    "screenshot asset registry",
)
for line in (
    "    pricing: values.get('pricing'),\n",
    "    price: optionalNumber(values.get('price')),\n",
    "    priceCurrency: values.get('priceCurrency'),\n",
):
    text = replace_once(text, line, "", f"remove metadata parser {line.strip()}")
text = replace_once(
    text,
    """function readProductCopy(contentDir: string, locale: Locale): ProductCopy {
  if (locale !== 'en' && locale !== 'ko') {
""",
    """function readProductCopy(contentDir: string, locale: Locale): ProductCopy {
  if (isExtendedSiteLocale(locale)) {
    const slug = path.basename(contentDir);
    const localized = getExtendedProductCopy(slug, locale);
    const platform = {
      name: localized.subtitle,
      landingSubtitle: localized.subtitle,
      landingDescription: localized.body,
      description: localized.body,
      faq: {
        title: localized.faqTitle,
        items: localized.faq
      }
    };
    return { locale, android: platform, ios: platform };
  }
  if (locale !== 'en' && locale !== 'ko') {
""",
    "extended product copy adapter",
)
text = replace_once(
    text,
    """  if (copy.locale === 'zh-Hant') {
    return `${source.meta.title} 是適用於 ${platforms} 的${category}。${summary}`;
  }
  return `${source.meta.title} is ${indefiniteArticle(category)} ${category} for ${platforms}. ${summary}`;
""",
    """  if (copy.locale === 'zh-Hant') {
    return `${source.meta.title} 是適用於 ${platforms} 的${category}。${summary}`;
  }
  if (copy.locale === 'pt-BR') {
    return `${source.meta.title} é ${category} para ${platforms}. ${summary}`;
  }
  if (copy.locale === 'de') {
    return `${source.meta.title} ist ${category} für ${platforms}. ${summary}`;
  }
  if (copy.locale === 'fr') {
    return `${source.meta.title} est ${category} pour ${platforms}. ${summary}`;
  }
  if (copy.locale === 'es') {
    return `${source.meta.title} es ${category} para ${platforms}. ${summary}`;
  }
  return `${source.meta.title} is ${indefiniteArticle(category)} ${category} for ${platforms}. ${summary}`;
""",
    "extended SEO descriptions",
)
text = replace_once(
    text,
    "function parseFaqField(value: string | undefined, locale: Locale): ProductFaq | undefined {",
    "function parseFaqField(value: string | undefined, locale: SiteLocale): ProductFaq | undefined {",
    "FAQ parser locale",
)
text = sub_once(
    text,
    r"""\nfunction optionalNumber\(value: string \| undefined\): number \| undefined \{
.*?
\}
""",
    "",
    "remove optionalNumber",
)
write(path, text)

# ---------------------------------------------------------------------------
# Papira: same ProductPageData contract for the four extended locales.
# ---------------------------------------------------------------------------
path = "src/lib/papira.ts"
text = read(path)
text = replace_once(
    text,
    """import type { SiteLocale } from './site-i18n';
import { routeFor } from './site-i18n';
import type { ProductCopy, ProductPageData } from './products';
""",
    """import type { SiteLocale } from './site-i18n';
import {
  allProductLocaleAlternates,
  allRouteFor,
  isExtendedSiteLocale,
  type AllSiteLocale,
  type ExtendedSiteLocale
} from './extended-site-i18n';
import { getExtendedProductCopy } from './extended-product-localizations';
import { renderBlocks, type ProductCopy, type ProductPageData } from './products';
""",
    "papira imports",
)
papira_function = r"""const extendedPapiraStatus: Record<ExtendedSiteLocale, string> = {
  'pt-BR': 'Em preparação',
  de: 'In Vorbereitung',
  fr: 'En préparation',
  es: 'En preparación'
};

const extendedPapiraScreenshotAlts: Record<ExtendedSiteLocale, [string, string, string]> = {
  'pt-BR': [
    'Tela inicial do Papira para iniciar um projeto de livro ou criar um EPUB rápido',
    'Tela do Papira para escolher o tipo de obra e configurar a capa',
    'Tela do Papira para revisar os metadados do livro e criar o EPUB'
  ],
  de: [
    'Papira-Startseite zum Starten eines Buchprojekts oder Erstellen eines schnellen EPUB',
    'Papira-Seite zur Auswahl des Werktyps und Einrichtung des Covers',
    'Papira-Seite zum Prüfen der Buchmetadaten und Erstellen des EPUB'
  ],
  fr: [
    'Écran d’accueil de Papira pour démarrer un projet de livre ou créer rapidement un EPUB',
    'Écran Papira pour choisir le type d’œuvre et configurer la couverture',
    'Écran Papira pour vérifier les métadonnées du livre et créer l’EPUB'
  ],
  es: [
    'Pantalla de inicio de Papira para comenzar un proyecto de libro o crear un EPUB rápido',
    'Pantalla de Papira para elegir el tipo de obra y configurar la portada',
    'Pantalla de Papira para revisar los metadatos del libro y crear el EPUB'
  ]
};

export function getPapiraProductPageData(locale: AllSiteLocale): ProductPageData {
  if (isExtendedSiteLocale(locale)) {
    const text = getExtendedProductCopy('papira', locale);
    const platformCopy = {
      name: text.subtitle,
      landingSubtitle: text.subtitle,
      landingDescription: text.body,
      description: text.body,
      faq: { title: text.faqTitle, items: text.faq }
    };
    const copy: ProductCopy = { locale, android: platformCopy, ios: platformCopy };
    const meta = {
      title: 'Papira',
      status: extendedPapiraStatus[locale],
      platforms: ['iOS', 'Android'],
      privacy: allRouteFor('papiraPrivacy', locale),
      supportEmail: 'onnellab.app@gmail.com',
      icon: 'assets/icon/Papira.png'
    };
    const featureList =
      (renderBlocks(text.body).find((block) => block.type === 'ul')?.value as string[] | undefined) ?? [];
    return {
      locale,
      source: { slug: 'papira', contentDir: '', meta },
      meta,
      copy,
      canonicalPath: allRouteFor('papira', locale),
      alternates: allProductLocaleAlternates('papira'),
      seoTitle: `Papira - ${text.subtitle}`,
      seoDescription: text.body.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ?? text.subtitle,
      iconPath: '/app-assets/papira/icon.png',
      socialImagePath: '/app-assets/papira/social-card.png',
      screenshotPaths: ['01', '02', '03'].map(
        (name) => `/app-assets/papira/assets/screenshots/en/${name}.png`
      ),
      screenshotAlts: extendedPapiraScreenshotAlts[locale],
      screenshotDimensions: { width: 1080, height: 2168 },
      schemaFeatureList: featureList,
      accent: { border: '#d7cfdb', background: '#f4eff5', text: '#614f68' }
    };
  }

  const baseLocale = locale as SiteLocale;
  const text = papiraCopy[baseLocale];
  const description = [
    text.lead,
    '',
    `## ${text.modesTitle}`,
    '',
    ...text.modes.flatMap((mode, index) => [`### ${index + 1}. ${mode.title}`, '', mode.body, '']),
    `## ${text.featuresTitle}`,
    '',
    ...text.features.map((feature) => `- ${feature}`),
    '',
    `## ${text.privacyTitle}`,
    '',
    ...text.privacyItems.map((item) => `- ${item}`)
  ].join('\n');
  const platformCopy = {
    name: text.tagline,
    landingSubtitle: text.tagline,
    landingDescription: description,
    description,
    faq: { title: text.faqTitle, items: text.faqs }
  };
  const copy: ProductCopy = { locale: baseLocale, android: platformCopy, ios: platformCopy };
  const meta = {
    title: 'Papira',
    status: text.statusValue,
    platforms: ['iOS', 'Android'],
    privacy: allRouteFor('papiraPrivacy', baseLocale),
    supportEmail: 'onnellab.app@gmail.com',
    icon: 'assets/icon/Papira.png'
  };
  return {
    locale: baseLocale,
    source: { slug: 'papira', contentDir: '', meta },
    meta,
    copy,
    canonicalPath: allRouteFor('papira', baseLocale),
    alternates: allProductLocaleAlternates('papira'),
    seoTitle: text.seoTitle,
    seoDescription: text.seoDescription,
    iconPath: '/app-assets/papira/icon.png',
    socialImagePath: '/app-assets/papira/social-card.png',
    eyebrow: text.eyebrow,
    heroSignals: text.heroSignals,
    screenshotPaths: ['01', '02', '03'].map(
      (name) => `/app-assets/papira/assets/screenshots/${baseLocale}/${name}.png`
    ),
    screenshotAlts: text.screenshotAlts,
    screenshotDimensions: { width: 1080, height: 2168 },
    schemaFeatureList: text.features,
    accent: { border: '#d7cfdb', background: '#f4eff5', text: '#614f68' }
  };
}
"""
text = sub_once(
    text,
    r"""export function getPapiraProductPageData\(locale: SiteLocale\): ProductPageData \{
.*?
\}

export const papiraCopy""",
    papira_function + "\nexport const papiraCopy",
    "Papira unified page data",
)
write(path, text)

# ---------------------------------------------------------------------------
# Footer: same navigation contract for all nine locales.
# ---------------------------------------------------------------------------
write(
    "src/components/SiteFooter.astro",
    """---
import { allRouteFor, type AllSiteLocale } from '../lib/extended-site-i18n';

type Props = {
  locale: AllSiteLocale;
  privacyHref?: string;
};

const { locale, privacyHref = allRouteFor('privacy', locale) } = Astro.props;
const labels: Record<AllSiteLocale, { privacy: string; terms: string }> = {
  en: { privacy: 'Privacy Policy', terms: 'Terms' },
  ko: { privacy: '개인정보 처리방침', terms: '이용약관' },
  ja: { privacy: 'プライバシーポリシー', terms: '利用規約' },
  'zh-Hans': { privacy: '隐私政策', terms: '使用条款' },
  'zh-Hant': { privacy: '隱私權政策', terms: '使用條款' },
  'pt-BR': { privacy: 'Política de Privacidade', terms: 'Termos' },
  de: { privacy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen' },
  fr: { privacy: 'Politique de confidentialité', terms: 'Conditions d’utilisation' },
  es: { privacy: 'Política de privacidad', terms: 'Términos de uso' }
};
---

<footer class="site-footer">
  <a href={privacyHref}>{labels[locale].privacy}</a>
  <a href={allRouteFor('terms', locale)}>{labels[locale].terms}</a>
  <a href="mailto:onnellab.app@gmail.com">onnellab.app@gmail.com</a>
  <span>© ONNELLAB</span>
</footer>

<style>
  .site-footer.site-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 9px 20px;
    margin-top: 58px;
    border-top: 1px solid #ded6ca;
    padding-top: 28px;
    color: #786f65;
    font-size: 12px;
    line-height: 1.5;
  }

  .site-footer.site-footer a {
    color: #686259;
    font-size: inherit;
    font-weight: 620;
    text-decoration: none;
  }

  .site-footer.site-footer a:hover {
    color: #2f2d29;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .site-footer.site-footer a:focus-visible {
    outline: 2px solid #827d72;
    outline-offset: 3px;
  }

  .site-footer.site-footer span {
    white-space: nowrap;
  }
</style>
""",
)

# ---------------------------------------------------------------------------
# Product template: all nine locales, one SEO/AEO contract, no price/review data.
# ---------------------------------------------------------------------------
path = "src/components/ProductTemplate.astro"
text = read(path)
text = replace_once(
    text,
    """import { latestReleaseNoteForApp, releaseNoteKoPath, releaseNotePath } from '../lib/releaseNotes';
import { localeDefinitions, routeFor, type SiteLocale } from '../lib/site-i18n';
""",
    """import { latestReleaseNoteForApp, releaseNoteKoPath, releaseNotePath } from '../lib/releaseNotes';
import { releaseNoteLocalePath, type ReleaseLocale } from '../lib/extended-release-notes';
import {
  allAppPrivacyRouteFor,
  allLocaleDefinitions,
  allRouteFor,
  type AllSiteLocale
} from '../lib/extended-site-i18n';
""",
    "ProductTemplate imports",
)
labels_block = r"""const localizedLabels: Record<AllSiteLocale, {
  platforms: string;
  appStore: string;
  googlePlay: string;
  privacy: string;
  releaseNotes: string;
  latestRelease: string;
  support: string;
  apps: string;
  allApps: string;
  download: string;
  screens: string;
  stores: string;
  released: string;
  preparing: string;
  icon: string;
  previousScreenshot: string;
  nextScreenshot: string;
  close: string;
  previous: string;
  next: string;
}> = {
  en: { platforms:'Platforms', appStore:'App Store', googlePlay:'Google Play', privacy:'Privacy Policy', releaseNotes:'Release Notes', latestRelease:'Latest release', support:'Contact', apps:'Apps', allApps:'All apps', download:'Download', screens:'Screenshots', stores:'Stores', released:'Released', preparing:'Preparing for release', icon:'app icon', previousScreenshot:'Previous screenshot', nextScreenshot:'Next screenshot', close:'Close', previous:'Previous', next:'Next' },
  ko: { platforms:'지원 플랫폼', appStore:'App Store', googlePlay:'Google Play', privacy:'개인정보 처리방침', releaseNotes:'릴리즈 노트', latestRelease:'최신 릴리즈', support:'문의하기', apps:'앱', allApps:'모든 앱', download:'다운로드', screens:'스크린샷', stores:'스토어', released:'출시됨', preparing:'출시 준비 중', icon:'앱 아이콘', previousScreenshot:'이전 스크린샷', nextScreenshot:'다음 스크린샷', close:'닫기', previous:'이전', next:'다음' },
  ja: { platforms:'対応プラットフォーム', appStore:'App Store', googlePlay:'Google Play', privacy:'プライバシーポリシー', releaseNotes:'リリースノート', latestRelease:'最新リリース', support:'お問い合わせ', apps:'アプリ', allApps:'すべてのアプリ', download:'ダウンロード', screens:'スクリーンショット', stores:'ストア', released:'公開中', preparing:'リリース準備中', icon:'アプリアイコン', previousScreenshot:'前のスクリーンショット', nextScreenshot:'次のスクリーンショット', close:'閉じる', previous:'前へ', next:'次へ' },
  'zh-Hans': { platforms:'支持平台', appStore:'App Store', googlePlay:'Google Play', privacy:'隐私政策', releaseNotes:'版本说明', latestRelease:'最新版本', support:'联系我们', apps:'应用', allApps:'全部应用', download:'下载', screens:'屏幕截图', stores:'应用商店', released:'已发布', preparing:'准备发布', icon:'应用图标', previousScreenshot:'上一张屏幕截图', nextScreenshot:'下一张屏幕截图', close:'关闭', previous:'上一张', next:'下一张' },
  'zh-Hant': { platforms:'支援平台', appStore:'App Store', googlePlay:'Google Play', privacy:'隱私權政策', releaseNotes:'版本說明', latestRelease:'最新版本', support:'聯絡我們', apps:'應用程式', allApps:'全部應用程式', download:'下載', screens:'螢幕截圖', stores:'應用程式商店', released:'已發布', preparing:'準備發布', icon:'應用程式圖示', previousScreenshot:'上一張螢幕截圖', nextScreenshot:'下一張螢幕截圖', close:'關閉', previous:'上一張', next:'下一張' },
  'pt-BR': { platforms:'Plataformas', appStore:'App Store', googlePlay:'Google Play', privacy:'Política de Privacidade', releaseNotes:'Notas da versão', latestRelease:'Versão mais recente', support:'Contato', apps:'Aplicativos', allApps:'Todos os aplicativos', download:'Download', screens:'Capturas de tela', stores:'Lojas', released:'Disponível', preparing:'Em preparação', icon:'ícone do app', previousScreenshot:'Captura de tela anterior', nextScreenshot:'Próxima captura de tela', close:'Fechar', previous:'Anterior', next:'Próxima' },
  de: { platforms:'Plattformen', appStore:'App Store', googlePlay:'Google Play', privacy:'Datenschutzerklärung', releaseNotes:'Versionshinweise', latestRelease:'Neueste Version', support:'Kontakt', apps:'Apps', allApps:'Alle Apps', download:'Download', screens:'Screenshots', stores:'Stores', released:'Veröffentlicht', preparing:'In Vorbereitung', icon:'App-Symbol', previousScreenshot:'Vorheriger Screenshot', nextScreenshot:'Nächster Screenshot', close:'Schließen', previous:'Zurück', next:'Weiter' },
  fr: { platforms:'Plateformes', appStore:'App Store', googlePlay:'Google Play', privacy:'Politique de confidentialité', releaseNotes:'Notes de version', latestRelease:'Dernière version', support:'Contact', apps:'Applications', allApps:'Toutes les applications', download:'Télécharger', screens:'Captures d’écran', stores:'Boutiques', released:'Disponible', preparing:'En préparation', icon:'icône de l’application', previousScreenshot:'Capture précédente', nextScreenshot:'Capture suivante', close:'Fermer', previous:'Précédent', next:'Suivant' },
  es: { platforms:'Plataformas', appStore:'App Store', googlePlay:'Google Play', privacy:'Política de privacidad', releaseNotes:'Notas de la versión', latestRelease:'Versión más reciente', support:'Contacto', apps:'Aplicaciones', allApps:'Todas las aplicaciones', download:'Descargar', screens:'Capturas de pantalla', stores:'Tiendas', released:'Disponible', preparing:'En preparación', icon:'icono de la aplicación', previousScreenshot:'Captura anterior', nextScreenshot:'Captura siguiente', close:'Cerrar', previous:'Anterior', next:'Siguiente' }
};
const labels = localizedLabels[data.locale];
const localizedStatus =
  meta.status === 'Released'
    ? labels.released
    : meta.status === 'Preparing for release'
      ? labels.preparing
      : meta.status;"""
text = sub_once(
    text,
    r"""const localizedLabels: Record<SiteLocale, \{
.*?
\};
const labels = localizedLabels\[data\.locale\];""",
    labels_block,
    "nine-language product labels",
)
text = replace_once(text, "const homePath = routeFor('home', data.locale);", "const homePath = allRouteFor('home', data.locale);", "home route")
text = replace_once(text, "const appsPath = routeFor('apps', data.locale);", "const appsPath = allRouteFor('apps', data.locale);", "apps route")
text = replace_once(text, "const offerPriceCurrency = meta.priceCurrency ?? (meta.price === 0 ? 'USD' : undefined);\n", "", "offer currency")
text = sub_once(
    text,
    r"""const localizedAppStoreUrl = \(url: string \| undefined, locale: ProductPageData\['locale'\]\) => \{
.*?
\};
const localizedGooglePlayUrl""",
    """const localizedAppStoreUrl = (url: string | undefined, locale: ProductPageData['locale']) => {
  if (!url) return undefined;
  const storeLocale = {
    en: { country: 'us', language: 'en-US' },
    ko: { country: 'kr', language: 'ko' },
    ja: { country: 'jp', language: 'ja' },
    'zh-Hans': { country: 'cn', language: 'zh-Hans-CN' },
    'zh-Hant': { country: 'tw', language: 'zh-Hant-TW' },
    'pt-BR': { country: 'br', language: 'pt-BR' },
    de: { country: 'de', language: 'de-DE' },
    fr: { country: 'fr', language: 'fr-FR' },
    es: { country: 'es', language: 'es-ES' }
  }[locale];
  const appStoreUrl = new URL(url);
  appStoreUrl.pathname = appStoreUrl.pathname.replace(/^\\/(?:[a-z]{2}\\/)?app\\//, `/${storeLocale.country}/app/`);
  appStoreUrl.searchParams.set('l', storeLocale.language);
  return appStoreUrl.toString();
};
const localizedGooglePlayUrl""",
    "App Store locale mapping",
)
text = sub_once(
    text,
    r"""const localizedGooglePlayUrl = \(url: string \| undefined, locale: ProductPageData\['locale'\]\) => \{
.*?
\};
const localizedPrivacyUrl""",
    """const localizedGooglePlayUrl = (url: string | undefined, locale: ProductPageData['locale']) => {
  if (!url) return undefined;
  const storeLocale = {
    en: { language: 'en', country: 'US' },
    ko: { language: 'ko', country: 'KR' },
    ja: { language: 'ja', country: 'JP' },
    'zh-Hans': { language: 'zh-CN', country: 'CN' },
    'zh-Hant': { language: 'zh-TW', country: 'TW' },
    'pt-BR': { language: 'pt-BR', country: 'BR' },
    de: { language: 'de', country: 'DE' },
    fr: { language: 'fr', country: 'FR' },
    es: { language: 'es', country: 'ES' }
  }[locale];
  const playStoreUrl = new URL(url);
  playStoreUrl.searchParams.set('hl', storeLocale.language);
  playStoreUrl.searchParams.set('gl', storeLocale.country);
  return playStoreUrl.toString();
};
const localizedPrivacyUrl""",
    "Google Play locale mapping",
)
text = sub_once(
    text,
    r"""const localizedPrivacyUrl = \(url: string, locale: ProductPageData\['locale'\]\) => \{
.*?
\};
const appStoreUrl""",
    """const privacyPath =
  data.source.slug === 'papira'
    ? allRouteFor('papiraPrivacy', data.locale)
    : allAppPrivacyRouteFor(data.source.slug, data.locale);
const privacyUrl = new URL(privacyPath, Astro.site).toString();
const appStoreUrl""",
    "privacy routing",
)
text = replace_once(text, "const privacyUrl = localizedPrivacyUrl(meta.privacy, data.locale);\n", "", "old privacy url")
text = sub_once(
    text,
    r"""const releaseNotesUrl = latestReleaseNote
.*?
  : undefined;""",
    """const releaseNotesUrl = latestReleaseNote
  ? data.locale === 'en'
    ? releaseNotePath(latestReleaseNote)
    : data.locale === 'ko'
      ? releaseNoteKoPath(latestReleaseNote)
      : releaseNoteLocalePath(latestReleaseNote, data.locale as ReleaseLocale)
  : undefined;""",
    "release-note routing",
)
text = sub_once(
    text,
    r"""const tagweaverUseCases: Record<SiteLocale, \{ title: string; items: string\[\] \}> = \{
.*?
const useCaseContent = data\.source\.slug === 'tagweaver' \? tagweaverUseCases\[data\.locale\] : undefined;
""",
    "",
    "remove TagWeaver-only section data",
)
text = replace_once(text, "  ...(meta.price !== undefined ? { isAccessibleForFree: meta.price === 0 } : {}),\n", "", "remove free-price schema")
text = sub_once(
    text,
    r"""\n  \.\.\.\(meta\.price !== undefined
    \? \{
        offers: \{
.*?
      \}
    : \{\}\),""",
    "",
    "remove Offer schema",
)
text = replace_once(text, "  inLanguage: data.locale,", "  inLanguage: allLocaleDefinitions[data.locale].hreflang,", "schema language")
text = replace_once(text, "  lang={data.locale}", "  lang={allLocaleDefinitions[data.locale].htmlLang}", "html language")
text = replace_once(text, 'alt={`${meta.title} icon`}', 'alt={`${meta.title} ${labels.icon}`}', "localized icon alt")
text = replace_once(text, 'aria-label="Contact links"', 'aria-label={labels.support}', "support aria")
text = replace_once(text, '<p class="release-note-inline">{meta.status}</p>', '<p class="release-note-inline">{localizedStatus}</p>', "localized release status")
text = sub_once(
    text,
    r"""\n    \{useCaseContent && \(
      <section class="use-cases-band".*?
    \)\}
""",
    "",
    "remove TagWeaver-only section markup",
)
for old, new, label in (
    ('aria-label="Previous screenshot"', 'aria-label={labels.previousScreenshot}', "previous screenshot aria"),
    ('aria-label="Next screenshot"', 'aria-label={labels.nextScreenshot}', "next screenshot aria"),
    ('aria-label="Close"', 'aria-label={labels.close}', "close aria"),
    ('aria-label="Previous"', 'aria-label={labels.previous}', "previous aria"),
    ('aria-label="Next"', 'aria-label={labels.next}', "next aria"),
):
    text = replace_once(text, old, new, label)
write(path, text)

# ---------------------------------------------------------------------------
# Product route: language no longer selects a different template.
# ---------------------------------------------------------------------------
write(
    "src/pages/apps/[app]/[locale].astro",
    """---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import ProductTemplate from '../../../components/ProductTemplate.astro';
import { getPapiraProductPageData } from '../../../lib/papira';
import { getProductPageData, getProductSources } from '../../../lib/products';
import { localeDefinitions, siteLocales, type SiteLocale } from '../../../lib/site-i18n';
import {
  allLocaleDefinitions,
  extendedSiteLocales,
  type AllSiteLocale
} from '../../../lib/extended-site-i18n';

export function getStaticPaths() {
  const detailLocales = siteLocales.filter((locale) => locale !== 'en');
  const standard = getProductSources().flatMap((source) =>
    detailLocales.map((locale) => ({
      params: { app: source.slug, locale: localeDefinitions[locale].pathSegment },
      props: { locale }
    }))
  );
  const extended = [...getProductSources().map((source) => source.slug), 'papira'].flatMap((app) =>
    extendedSiteLocales.map((locale) => ({
      params: { app, locale: allLocaleDefinitions[locale].pathSegment },
      props: { locale }
    }))
  );
  return [
    ...standard,
    ...extended,
    { params: { app: 'ko', locale: 'ko' }, props: { locale: 'ko' as SiteLocale } }
  ];
}

const app = Astro.params.app as string;
const { locale } = Astro.props as { locale: AllSiteLocale };
const targetPath = '/apps/ko/';
const data =
  app === 'ko'
    ? undefined
    : app === 'papira'
      ? getPapiraProductPageData(locale)
      : getProductPageData(app, locale);
---

{
  data ? (
    <ProductTemplate data={data} />
  ) : (
    <BaseLayout
      title="ONNELLAB 앱"
      description="ONNELLAB이 만든 조용하고 가벼운 앱을 한곳에서 살펴보세요."
      canonicalPath={targetPath}
      lang="ko"
      alternates={[
        { lang: 'en', path: '/apps/' },
        { lang: 'ko', path: targetPath },
        { lang: 'x-default', path: '/apps/' }
      ]}
    >
      <meta http-equiv="refresh" content={`0; url=${targetPath}`} slot="head" />
      <script is:inline define:vars={{ targetPath }}>
        window.location.replace(targetPath);
      </script>
      <main>
        <p><a href={targetPath}>앱 페이지로 이동</a></p>
      </main>
    </BaseLayout>
  )
}
""",
)

# ---------------------------------------------------------------------------
# Sitemap should track the unified template, not a deleted extended component.
# ---------------------------------------------------------------------------
path = "src/pages/sitemap.xml.ts"
text = read(path)
text = text.replace("'src/components/ExtendedProductPage.astro'", "'src/components/ProductTemplate.astro'")
write(path, text)

# ---------------------------------------------------------------------------
# Existing extended test: same component now means same selectors.
# ---------------------------------------------------------------------------
path = "tests/extended-i18n.spec.ts"
text = read(path)
text = replace_once(
    text,
    "page.locator('.side-card').getByRole('link', { name: /privacy|privacidade|datenschutz|confidentialité|privacidad/i })",
    "page.locator('.support-links').getByRole('link', { name: /privacy|privacidade|datenschutz|confidentialité|privacidad/i })",
    "extended privacy selector",
)
write(path, text)

# ---------------------------------------------------------------------------
# Product contract: 9 apps x 9 languages, same HTML/SEO/AEO structure.
# ---------------------------------------------------------------------------
write(
    "tests/product-contract.spec.ts",
    r"""import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const apps = ['aligna', 'clipnest', 'melivra', 'meriq', 'papira', 'quivra', 'segra', 'tagweaver', 'vaultxt'] as const;
const locales = [
  { code: 'en', segment: '' },
  { code: 'ko', segment: 'ko' },
  { code: 'ja', segment: 'ja' },
  { code: 'zh-Hans', segment: 'zh-hans' },
  { code: 'zh-Hant', segment: 'zh-hant' },
  { code: 'pt-BR', segment: 'pt-br' },
  { code: 'de', segment: 'de' },
  { code: 'fr', segment: 'fr' },
  { code: 'es', segment: 'es' }
] as const;

const canonical = (route: string) => `https://onnellab.github.io${route}`;
const routeFor = (app: string, segment: string) =>
  segment ? `/apps/${app}/${segment}/` : `/apps/${app}/`;

async function schemas(page: import('@playwright/test').Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.flatMap((script) => {
      const parsed = JSON.parse(script.textContent ?? 'null');
      return Array.isArray(parsed) ? parsed : [parsed];
    })
  );
}

for (const app of apps) {
  test(`${app} uses one nine-language product contract`, async ({ page }) => {
    for (const locale of locales) {
      const route = routeFor(app, locale.segment);
      await page.goto(route);

      await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
      await expect(page.locator('main[data-product-slug]')).toHaveAttribute('data-product-slug', app);
      await expect(page.locator('main[data-product-locale]')).toHaveAttribute('data-product-locale', locale.code);
      await expect(page.locator('h1#product-title')).toHaveCount(1);
      await expect(page.locator('.hero')).toHaveCount(1);
      await expect(page.locator('.content-band')).toHaveCount(1);
      await expect(page.locator('.faq-band')).toHaveCount(1);
      await expect(page.locator('.download-band')).toHaveCount(1);
      await expect(page.locator('.site-footer')).toHaveCount(1);
      await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(10);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical(route));

      const allSchemas = await schemas(page);
      const software = allSchemas.find((entry) => entry?.['@type'] === 'SoftwareApplication');
      const breadcrumb = allSchemas.find((entry) => entry?.['@type'] === 'BreadcrumbList');
      const faq = allSchemas.find((entry) => entry?.['@type'] === 'FAQPage');

      expect(software).toBeTruthy();
      expect(breadcrumb).toBeTruthy();
      expect(faq).toBeTruthy();
      expect(software.url).toBe(canonical(route));
      expect(software.mainEntityOfPage).toBe(canonical(route));
      expect(software.publisher?.name).toBe('ONNELLAB');
      expect(software.featureList?.length ?? 0).toBeGreaterThan(0);
      expect(software).not.toHaveProperty('offers');
      expect(software).not.toHaveProperty('aggregateRating');
      expect(software).not.toHaveProperty('review');
      expect(software).not.toHaveProperty('isAccessibleForFree');
      expect(faq.mainEntity?.length ?? 0).toBeGreaterThanOrEqual(3);

      const screenshots = page.locator('.screenshot-row img');
      const screenshotCount = await screenshots.count();
      for (let index = 0; index < screenshotCount; index += 1) {
        const image = screenshots.nth(index);
        await expect(image).toHaveAttribute('alt', /\S+/);
        await expect(image).toHaveAttribute('width', /\d+/);
        await expect(image).toHaveAttribute('height', /\d+/);
      }
    }
  });
}

test('product sources permanently exclude price, rating, and review commerce metadata', () => {
  const appsDir = path.resolve(process.cwd(), 'src/content/apps');
  for (const app of fs.readdirSync(appsDir)) {
    const appMeta = path.join(appsDir, app, 'app.md');
    if (!fs.existsSync(appMeta)) continue;
    const source = fs.readFileSync(appMeta, 'utf8');
    expect(source).not.toMatch(/^(?:pricing|price|priceCurrency)\s*:/m);
  }

  const productsSource = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/products.ts'), 'utf8');
  const templateSource = fs.readFileSync(path.resolve(process.cwd(), 'src/components/ProductTemplate.astro'), 'utf8');
  const routeSource = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/apps/[app]/[locale].astro'), 'utf8');

  expect(productsSource).not.toMatch(/\bpricing\??\s*:/);
  expect(productsSource).not.toMatch(/\bpriceCurrency\??\s*:/);
  expect(productsSource).not.toMatch(/\bprice\??\s*:/);
  expect(templateSource).not.toMatch(/\boffers\s*:/);
  expect(templateSource).not.toMatch(/\baggregateRating\s*:/);
  expect(templateSource).not.toMatch(/\breview\s*:/);
  expect(templateSource).not.toMatch(/\bisAccessibleForFree\s*:/);
  expect(routeSource).not.toContain('ExtendedProductPage');
  expect(fs.existsSync(path.resolve(process.cwd(), 'src/components/ExtendedProductPage.astro'))).toBe(false);
});
""",
)

# ---------------------------------------------------------------------------
# Papira test: remove obsolete five-language menu assumptions.
# Product-contract now covers all nine product pages.
# ---------------------------------------------------------------------------
path = "tests/papira-i18n.spec.ts"
text = read(path)
text = text.replace("test.describe('Papira five-language launch surface'", "test.describe('Papira nine-language launch surface'")
text = re.sub(
    r"""const alternateUrls = \{
.*?
\} as const;""",
    """const alternateUrls = {
  en: 'https://onnellab.github.io/apps/papira/',
  ko: 'https://onnellab.github.io/apps/papira/ko/',
  ja: 'https://onnellab.github.io/apps/papira/ja/',
  'zh-Hans': 'https://onnellab.github.io/apps/papira/zh-hans/',
  'zh-Hant': 'https://onnellab.github.io/apps/papira/zh-hant/',
  'pt-BR': 'https://onnellab.github.io/apps/papira/pt-br/',
  de: 'https://onnellab.github.io/apps/papira/de/',
  fr: 'https://onnellab.github.io/apps/papira/fr/',
  es: 'https://onnellab.github.io/apps/papira/es/',
  'x-default': 'https://onnellab.github.io/apps/papira/'
} as const;""",
    text,
    count=1,
    flags=re.S,
)
text = text.replace("await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);", "await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);")
text = text.replace("test('general site pages keep the established five-language locale menu'", "test('general site pages expose the nine-language locale menu'")
text = text.replace("await expect(page.locator('.locale-menu-panel a')).toHaveCount(5);", "await expect(page.locator('.locale-menu-panel a')).toHaveCount(9);")
text = text.replace(
    "expect(sitemapSource).toContain('sourceLastmod(corePageSources[page])');",
    "expect(sitemapSource).toContain('latestLastmod(sourceLastmod, [corePageSources[page]');"
)
write(path, text)

# ---------------------------------------------------------------------------
# CI: make the product contract a permanent release gate.
# ---------------------------------------------------------------------------
path = ".github/workflows/i18n-smoke.yml"
text = read(path)
text = replace_once(
    text,
    """          tests/extended-i18n.spec.ts
          tests/papira-i18n.spec.ts
          tests/site-visual.spec.ts
""",
    """          tests/extended-i18n.spec.ts
          tests/papira-i18n.spec.ts
          tests/product-contract.spec.ts
          tests/site-visual.spec.ts
""",
    "CI product contract",
)
write(path, text)

# ---------------------------------------------------------------------------
# Remove product price metadata from every app source.
# Keep product functionality text (e.g. audio rating metadata editing) intact.
# ---------------------------------------------------------------------------
for app_meta in sorted((ROOT / "src/content/apps").glob("*/app.md")):
    source = app_meta.read_text(encoding="utf-8")
    source = re.sub(r"(?m)^(?:pricing|price|priceCurrency):[^\r\n]*(?:\r?\n)?", "", source)
    source = re.sub(r"\n{3,}", "\n\n", source)
    app_meta.write_text(source, encoding="utf-8")

# Extended template is now obsolete.
extended_component = ROOT / "src/components/ExtendedProductPage.astro"
if not extended_component.exists():
    raise SystemExit("ExtendedProductPage.astro already missing before migration")
extended_component.unlink()

# Migration tooling is one-shot and must not remain on main.
for cleanup in (
    ROOT / "scripts/unify-product-pages.py",
    ROOT / ".github/workflows/unify-product-pages-once.yml",
):
    if cleanup.exists():
        cleanup.unlink()

# Source-level invariants before build.
for forbidden in ("pricing?:", "price?:", "priceCurrency?:", "offers:", "aggregateRating:", "isAccessibleForFree:"):
    haystacks = read("src/lib/products.ts") + "\n" + read("src/components/ProductTemplate.astro")
    if forbidden in haystacks:
        raise SystemExit(f"forbidden product commerce/rating metadata remains: {forbidden}")
if "ExtendedProductPage" in read("src/pages/apps/[app]/[locale].astro"):
    raise SystemExit("route still references ExtendedProductPage")
