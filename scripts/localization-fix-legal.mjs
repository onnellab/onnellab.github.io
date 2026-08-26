import {
  replaceAcrossOptional,
  replaceExact
} from './utils.mjs';

const privacyIndexReplacements = [
  ["updated: 'Policy date'", "updated: 'Last updated'"],
  ["updated: '작성 날짜'", "updated: '최종 업데이트'"],
  ["updated: 'ポリシー日付'", "updated: '最終更新日'"],
  ["empty: '没有匹配的应用。',\n    updated: '政策日期',", "empty: '没有匹配的应用。',\n    updated: '最后更新',"],
  ["empty: '沒有符合的應用程式。',\n    updated: '政策日期',", "empty: '沒有符合的應用程式。',\n    updated: '最後更新',"]
];
for (const [from, to] of privacyIndexReplacements) {
  replaceExact('src/components/PrivacyIndex.astro', from, to, { max: 1 });
}

const extendedDateReplacements = [
  ["updated: 'Data da política'", "updated: 'Última atualização'"],
  ["updated: 'Stand der Richtlinie'", "updated: 'Zuletzt aktualisiert'"],
  ["updated: 'Date de la politique'", "updated: 'Dernière mise à jour'"],
  ["updated: 'Fecha de la política'", "updated: 'Última actualización'"]
];
for (const [from, to] of extendedDateReplacements) {
  replaceExact('src/components/ExtendedSitePage.astro', from, to);
}

const terminology = [
  ['Informações de produto, transação e direito de uso fornecidas pela loja', 'Informações de produto, transação e licença fornecidas pela loja'],
  ['direito de compra', 'status da licença'],
  ['Direito de compra', 'Status da licença'],
  ['Von der Store-Plattform bereitgestellte Produkt-, Transaktions- und Berechtigungsinformationen', 'Von der Store-Plattform bereitgestellte Produkt-, Transaktions- und Lizenzinformationen'],
  ['Kaufberechtigung', 'Lizenzstatus'],
  ['Les informations de produit, de transaction et de droit fournies par la boutique', 'Les informations de produit, de transaction et de licence fournies par la boutique'],
  ['droit d’achat', 'état de la licence'],
  ['Droit d’achat', 'État de la licence'],
  ['La información de productos, transacciones y derechos proporcionada por la tienda', 'La información de productos, transacciones y licencia proporcionada por la tienda'],
  ['derecho de compra', 'estado de la licencia'],
  ['Derecho de compra', 'Estado de la licencia']
];
for (const [from, to] of terminology) {
  replaceAcrossOptional('src', from, to, { extensions: ['.astro', '.ts', '.md'] });
}
