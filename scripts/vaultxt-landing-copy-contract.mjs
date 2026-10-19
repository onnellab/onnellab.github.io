import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('all nine VaultXT landing copies omit free/Pro comparisons without claiming unlimited usage', () => {
  const copy = JSON.parse(fs.readFileSync(new URL('../src/content/apps/vaultxt/promo-copy.json', import.meta.url)));
  assert.equal(Object.keys(copy).length, 9);
  for (const [locale, item] of Object.entries(copy)) {
    assert.equal(item.faq.length, 4, `${locale}: retain the shared four-FAQ presentation contract`);
    const landing = [item.landingBody, ...item.faq.flatMap(({question, answer}) => [question, answer])].join('\n');
    assert.doesNotMatch(landing, /\bPro\b|\bfree\b|무료|無料|免费|免費|gratuit|kostenlos/iu, locale);
    assert.doesNotMatch(landing, /unlimited|무제한|無制限|无限|無限|ilimitad|unbegrenzt|illimité/iu, locale);
    // Store descriptions are a separate source field and must not be stripped.
    assert.match(item.description, /\bPro\b/, `${locale}: preserve store copy`);
  }
});
