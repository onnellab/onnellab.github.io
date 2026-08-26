import {
  insertUiLabelsImport,
  read,
  replaceExact,
  walk,
  write
} from './utils.mjs';

const uiLabelsSource = `import type { AllSiteLocale } from './extended-site-i18n';

export type UiLabels = {
  navigation: string;
  platforms: string;
  blogNavigation: string;
  articleNavigation: string;
  articleMetadata: string;
  articleImage: string;
  close: string;
  privacyPolicy: string;
  terms: string;
};

export const uiLabels: Record<AllSiteLocale, UiLabels> = {
  en: { navigation: 'Navigation', platforms: 'Platforms', blogNavigation: 'Blog navigation', articleNavigation: 'Article navigation', articleMetadata: 'Article metadata', articleImage: 'Article image', close: 'Close', privacyPolicy: 'Privacy Policy', terms: 'Terms' },
  ko: { navigation: '탐색', platforms: '플랫폼', blogNavigation: '블로그 탐색', articleNavigation: '글 탐색', articleMetadata: '글 정보', articleImage: '글 이미지', close: '닫기', privacyPolicy: '개인정보 처리방침', terms: '이용약관' },
  ja: { navigation: 'ナビゲーション', platforms: '対応プラットフォーム', blogNavigation: 'ブログナビゲーション', articleNavigation: '記事ナビゲーション', articleMetadata: '記事情報', articleImage: '記事画像', close: '閉じる', privacyPolicy: 'プライバシーポリシー', terms: '利用規約' },
  'zh-Hans': { navigation: '导航', platforms: '支持平台', blogNavigation: '博客导航', articleNavigation: '文章导航', articleMetadata: '文章信息', articleImage: '文章图片', close: '关闭', privacyPolicy: '隐私政策', terms: '使用条款' },
  'zh-Hant': { navigation: '導覽', platforms: '支援平台', blogNavigation: '部落格導覽', articleNavigation: '文章導覽', articleMetadata: '文章資訊', articleImage: '文章圖片', close: '關閉', privacyPolicy: '隱私權政策', terms: '使用條款' },
  'pt-BR': { navigation: 'Navegação', platforms: 'Plataformas', blogNavigation: 'Navegação do blog', articleNavigation: 'Navegação do artigo', articleMetadata: 'Informações do artigo', articleImage: 'Imagem do artigo', close: 'Fechar', privacyPolicy: 'Política de Privacidade', terms: 'Termos de Uso' },
  de: { navigation: 'Navigation', platforms: 'Plattformen', blogNavigation: 'Blog-Navigation', articleNavigation: 'Artikel-Navigation', articleMetadata: 'Artikelinformationen', articleImage: 'Artikelbild', close: 'Schließen', privacyPolicy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen' },
  fr: { navigation: 'Navigation', platforms: 'Plateformes', blogNavigation: 'Navigation du blog', articleNavigation: 'Navigation de l’article', articleMetadata: 'Informations sur l’article', articleImage: 'Image de l’article', close: 'Fermer', privacyPolicy: 'Politique de confidentialité', terms: 'Conditions d’utilisation' },
  es: { navigation: 'Navegación', platforms: 'Plataformas', blogNavigation: 'Navegación del blog', articleNavigation: 'Navegación del artículo', articleMetadata: 'Información del artículo', articleImage: 'Imagen del artículo', close: 'Cerrar', privacyPolicy: 'Política de privacidad', terms: 'Términos de uso' }
};
`;
write('src/lib/ui-labels.ts', uiLabelsSource);

const hardcoded = [
  ['aria-label="Navigation"', 'aria-label={uiLabels[locale].navigation}'],
  ['aria-label="Platforms"', 'aria-label={uiLabels[locale].platforms}'],
  ['aria-label="Blog navigation"', 'aria-label={uiLabels[locale].blogNavigation}'],
  ['aria-label="Article navigation"', 'aria-label={uiLabels[locale].articleNavigation}'],
  ['aria-label="Article metadata"', 'aria-label={uiLabels[locale].articleMetadata}'],
  ['aria-label="Article image"', 'aria-label={uiLabels[locale].articleImage}'],
  ['aria-label="Close"', 'aria-label={uiLabels[locale].close}']
];

for (const relativePath of walk('src/components', ['.astro'])) {
  let source = read(relativePath);
  if (!hardcoded.some(([from]) => source.includes(from))) continue;

  if (relativePath === 'src/components/LegalPage.astro') {
    source = insertUiLabelsImport(relativePath, source);
    source = source.replaceAll('aria-label="Navigation"', 'aria-label={uiLabels[lang].navigation}');
    write(relativePath, source);
    continue;
  }

  if (!source.includes('locale')) {
    throw new Error(`${relativePath}: hardcoded label found without a locale variable`);
  }
  source = insertUiLabelsImport(relativePath, source);
  for (const [from, to] of hardcoded) source = source.replaceAll(from, to);
  write(relativePath, source);
}

replaceExact(
  'src/components/PrivacyIndex.astro',
  'name: `${policy.title} Privacy Policy`,',
  'name: `${policy.title} ${uiLabels[locale].privacyPolicy}`,'
);

let oauth = read('src/components/OAuthCallbackPage.astro');
oauth = insertUiLabelsImport('src/components/OAuthCallbackPage.astro', oauth);
oauth = oauth.replace('<nav class="topbar">', '<nav class="topbar" aria-label={uiLabels[locale].navigation}>');
oauth = oauth.replace(
  '<footer><a href={allRouteFor(\'privacy\',locale)}>Privacy</a><a href={allRouteFor(\'terms\',locale)}>Terms</a>',
  '<footer><a href={allRouteFor(\'privacy\',locale)}>{uiLabels[locale].privacyPolicy}</a><a href={allRouteFor(\'terms\',locale)}>{uiLabels[locale].terms}</a>'
);
if (!oauth.includes('{uiLabels[locale].privacyPolicy}')) {
  throw new Error('OAuth footer localization replacement did not apply');
}
write('src/components/OAuthCallbackPage.astro', oauth);

const testSource = `import { expect, test } from '@playwright/test';

import {
  allLocaleDefinitions,
  allRouteFor,
  allSiteLocales
} from '../src/lib/extended-site-i18n';
import { uiLabels } from '../src/lib/ui-labels';

const oauthPathFor = (locale: (typeof allSiteLocales)[number]) => {
  const segment = allLocaleDefinitions[locale].pathSegment;
  return segment ? \`/oauth/x/callback/\${segment}/\` : '/oauth/x/callback/';
};

for (const locale of allSiteLocales) {
  test(\`\${locale} exposes localized navigation and platform labels\`, async ({ page }) => {
    await page.goto(allRouteFor('apps', locale));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('.platform-badges').first()).toHaveAttribute('aria-label', uiLabels[locale].platforms);

    await page.goto(allRouteFor('privacy', locale));
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('.platform-badges').first()).toHaveAttribute('aria-label', uiLabels[locale].platforms);

    await page.goto(oauthPathFor(locale));
    await expect(page.locator('nav.topbar')).toHaveAttribute('aria-label', uiLabels[locale].navigation);
    await expect(page.locator('footer a').nth(0)).toHaveText(uiLabels[locale].privacyPolicy);
    await expect(page.locator('footer a').nth(1)).toHaveText(uiLabels[locale].terms);
  });
}

for (const locale of ['en', 'ko'] as const) {
  test(\`\${locale} blog accessibility labels follow the page language\`, async ({ page }) => {
    await page.goto(locale === 'ko' ? '/blog/ko/' : '/blog/');
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].blogNavigation);

    await page.goto(locale === 'ko'
      ? '/blog/ko/txt-vs-epub-for-long-reading/'
      : '/blog/en/txt-vs-epub-for-long-reading/');
    await expect(page.locator('nav.site-header')).toHaveAttribute('aria-label', uiLabels[locale].articleNavigation);
    await expect(page.locator('.meta-grid')).toHaveAttribute('aria-label', uiLabels[locale].articleMetadata);
    await expect(page.locator('.article-image-viewer')).toHaveAttribute('aria-label', uiLabels[locale].articleImage);
    await expect(page.locator('[data-article-image-close]')).toHaveAttribute('aria-label', uiLabels[locale].close);
  });
}
`;
write('tests/accessibility-i18n.spec.ts', testSource);

replaceExact(
  '.github/workflows/i18n-smoke.yml',
  '          tests/site-i18n.spec.ts\n',
  '          tests/site-i18n.spec.ts\n          tests/accessibility-i18n.spec.ts\n',
  { max: 1 }
);
