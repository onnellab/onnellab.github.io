import type { AllSiteLocale } from './extended-site-i18n';

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
  en: { navigation: 'Navigation', platforms: 'Platforms', blogNavigation: 'Blog navigation', articleNavigation: 'Article navigation', articleMetadata: 'Article metadata', articleImage: 'Article image', close: 'Close', privacyPolicy: 'Privacy Policy', terms: 'Terms of Use' },
  ko: { navigation: '탐색', platforms: '플랫폼', blogNavigation: '블로그 탐색', articleNavigation: '글 탐색', articleMetadata: '글 정보', articleImage: '글 이미지', close: '닫기', privacyPolicy: '개인정보 처리방침', terms: '이용약관' },
  ja: { navigation: 'ナビゲーション', platforms: '対応プラットフォーム', blogNavigation: 'ブログナビゲーション', articleNavigation: '記事ナビゲーション', articleMetadata: '記事情報', articleImage: '記事画像', close: '閉じる', privacyPolicy: 'プライバシーポリシー', terms: '利用規約' },
  'zh-Hans': { navigation: '导航', platforms: '支持平台', blogNavigation: '博客导航', articleNavigation: '文章导航', articleMetadata: '文章信息', articleImage: '文章图片', close: '关闭', privacyPolicy: '隐私政策', terms: '使用条款' },
  'zh-Hant': { navigation: '導覽', platforms: '支援平台', blogNavigation: '部落格導覽', articleNavigation: '文章導覽', articleMetadata: '文章資訊', articleImage: '文章圖片', close: '關閉', privacyPolicy: '隱私權政策', terms: '使用條款' },
  'pt-BR': { navigation: 'Navegação', platforms: 'Plataformas', blogNavigation: 'Navegação do blog', articleNavigation: 'Navegação do artigo', articleMetadata: 'Informações do artigo', articleImage: 'Imagem do artigo', close: 'Fechar', privacyPolicy: 'Política de Privacidade', terms: 'Termos de Uso' },
  de: { navigation: 'Navigation', platforms: 'Plattformen', blogNavigation: 'Blog-Navigation', articleNavigation: 'Artikel-Navigation', articleMetadata: 'Artikelinformationen', articleImage: 'Artikelbild', close: 'Schließen', privacyPolicy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen' },
  fr: { navigation: 'Navigation', platforms: 'Plateformes', blogNavigation: 'Navigation du blog', articleNavigation: 'Navigation de l’article', articleMetadata: 'Informations sur l’article', articleImage: 'Image de l’article', close: 'Fermer', privacyPolicy: 'Politique de confidentialité', terms: 'Conditions d’utilisation' },
  es: { navigation: 'Navegación', platforms: 'Plataformas', blogNavigation: 'Navegación del blog', articleNavigation: 'Navegación del artículo', articleMetadata: 'Información del artículo', articleImage: 'Imagen del artículo', close: 'Cerrar', privacyPolicy: 'Política de privacidad', terms: 'Términos de uso' }
};
