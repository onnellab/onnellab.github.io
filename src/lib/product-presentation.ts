import type { AllSiteLocale } from './extended-site-i18n';
import type { ProductFaq } from './products';

/** Editorial page structure, not a search-engine word-count requirement. */
export const productPresentationLabels: Record<AllSiteLocale, { features: string; faq: string }> = {
  en: { features: 'Key features', faq: 'Frequently asked questions' },
  ko: { features: '주요 기능', faq: '자주 묻는 질문' },
  ja: { features: '主な機能', faq: 'よくある質問' },
  'zh-Hans': { features: '主要功能', faq: '常见问题' },
  'zh-Hant': { features: '主要功能', faq: '常見問題' },
  'pt-BR': { features: 'Principais recursos', faq: 'Perguntas frequentes' },
  de: { features: 'Hauptfunktionen', faq: 'Häufige Fragen' },
  fr: { features: 'Fonctions principales', faq: 'Questions fréquentes' },
  es: { features: 'Funciones principales', faq: 'Preguntas frecuentes' }
};

type Block = { type: 'p' | 'h2' | 'h3' | 'ul'; value: string | string[] };

/** Fail the build on missing or malformed product copy instead of publishing a partial page. */
export function validateProductPresentation(
  slug: string,
  locale: AllSiteLocale,
  blocks: Block[],
  faq: ProductFaq | undefined
): void {
  const fail = (message: string): never => {
    throw new Error(`Product presentation ${slug}/${locale}: ${message}`);
  };
  const heading = blocks.findIndex((block) => block.type === 'h2');
  if (heading < 1 || heading > 2 || blocks.slice(0, heading).some((block) => block.type !== 'p')) {
    fail('use one or two introductory paragraphs before the feature heading');
  }
  if (blocks[heading].value !== productPresentationLabels[locale].features) {
    fail('use the shared localized feature heading');
  }
  const list = blocks[heading + 1];
  if (list?.type !== 'ul' || !Array.isArray(list.value)) {
    fail('put one feature list immediately after its heading');
  }
  const features = list.value as string[];
  if (features.length < 5 || features.length > 8 || features.some((value) => !value.trim())) {
    fail('provide five to eight meaningful, nonempty features');
  }
  if (new Set(features.map((value) => value.trim().toLocaleLowerCase())).size !== features.length) {
    fail('feature list must not contain duplicates');
  }
  const notes = blocks.slice(heading + 2);
  if (notes.length < 1 || notes.length > 3 || notes.some((block) => block.type !== 'p')) {
    fail('follow the list with one to three brief notes; do not add a Pro catalogue or extra headings');
  }
  if (blocks.some((block) => typeof block.value === 'string' && !block.value.trim())) {
    fail('paragraphs and headings must not be empty');
  }
  if (!faq || faq.items.length !== 4) fail('provide exactly four product-specific FAQs');
  const questions = faq!.items.map((item) => item.question.trim().toLocaleLowerCase());
  if (new Set(questions).size !== 4 || questions.some((question) => !question)) {
    fail('FAQ questions must be nonempty and distinct');
  }
  if (faq!.items.some((item) => !item.answer.trim())) fail('every FAQ needs a complete answer');
}
