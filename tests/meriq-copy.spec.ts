import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import {
  getProductIndexItems,
  getProductPageData,
  pageBodyDescription,
  renderBlocks
} from '../src/lib/products';

// Content/HTML assertions do not need a browser. Build the site before running.
const cases = [
  { locale: 'en', terms: ['stickers', 'acrylic keyrings', 'photo cards', 'background', 'white underprint', 'print provider'] },
  { locale: 'ko', terms: ['스티커', '아크릴 키링', '포토카드', '배경 투명화', '화이트', '인쇄소'] },
  { locale: 'ja', terms: ['ステッカー', 'アクリルキーホルダー', 'フォトカード', '背景透過', '白版', '印刷会社'] },
  { locale: 'zh-Hans', terms: ['贴纸', '亚克力钥匙扣', '小卡', '透明背景', '白墨', '印刷厂'] },
  { locale: 'zh-Hant', terms: ['貼紙', '壓克力鑰匙圈', '小卡', '去背', '白墨', '印刷業者'] },
  { locale: 'pt-BR', terms: ['adesivos', 'chaveiros de acrílico', 'photocards', 'remoção de fundo', 'tinta branca', 'gráfica'] },
  { locale: 'de', terms: ['Aufkleber', 'Acryl-Schlüsselanhänger', 'Fotokarten', 'Hintergrundentfernung', 'weiße Druckschicht', 'Druckerei'] },
  { locale: 'fr', terms: ['autocollants', 'porte-clés en acrylique', 'cartes photo', 'détourage', 'encre blanche', 'imprimeur'] },
  { locale: 'es', terms: ['pegatinas', 'llaveros acrílicos', 'tarjetas fotográficas', 'quitar el fondo', 'tinta blanca', 'imprenta'] }
] as const;

for (const { locale, terms } of cases) {
  test(`Meriq ${locale}: full localized body, export FAQ and Pro boundary`, () => {
    const data = getProductPageData('meriq', locale);
    const body = pageBodyDescription(data.copy);
    const blocks = renderBlocks(body);
    const faq = data.copy.android.faq ?? data.copy.ios.faq;
    expect(data.seoTitle).toMatch(/^Meriq - .+/);
    expect(blocks.filter((block) => block.type === 'h2')).toHaveLength(1);
    const features = blocks.find((block) => block.type === 'ul');
    expect(features?.value).toHaveLength(8);
    expect(body).not.toContain('\\n');
    for (const term of [...terms, 'PNG', 'PDF', 'ZIP', 'Pro']) {
      expect(body, `${locale}: ${term}`).toContain(term);
    }
    expect(faq?.items).toHaveLength(4);
    expect(new Set(faq?.items.map((item) => item.question)).size).toBe(4);
    const exportAnswer = faq?.items.find((item) =>
      ['PNG', 'PDF', 'ZIP'].every((format) => item.answer.includes(format))
    );
    expect(exportAnswer, `${locale}: export question must explain actual formats`).toBeDefined();
    expect(faq?.items.some((item) => item.answer.includes('Meriq Pro'))).toBe(true);
    const card = getProductIndexItems(locale).find((item) => item.slug === 'meriq');
    expect(card?.description).toBe(data.seoTitle.replace(/^Meriq - /, ''));
    expect(card?.iconPath).toBe(data.iconPath);
  });

  test(`Meriq ${locale}: built page contains localized content and metadata`, () => {
    const data = getProductPageData('meriq', locale);
    const htmlPath = path.join('dist', data.canonicalPath.replace(/^\/+/, ''), 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    expect(html).toContain('name="description"');
    expect(html).toContain('Meriq - ');
    expect(html).toContain(data.iconPath);
    for (const term of [...terms, 'PNG', 'PDF', 'ZIP', 'Pro']) {
      expect(html, `${locale}: rendered ${term}`).toContain(term);
    }
    expect((html.match(/<h2(?:\s|>)/g) ?? []).length).toBe(2);
  });
}

test('Meriq Korean copy no longer exposes internal specification wording', () => {
  const data = getProductPageData('meriq', 'ko');
  const body = pageBodyDescription(data.copy);
  for (const oldPhrase of ['오프라인 생산 준비 앱', '앱이 아닌 기능', 'system picker', '프론트·백']) {
    expect(body).not.toContain(oldPhrase);
  }
  expect(body).toContain('독립적으로 편집');
  expect(body).toContain('후가공 기능은 Pro가 필요해요');
});
