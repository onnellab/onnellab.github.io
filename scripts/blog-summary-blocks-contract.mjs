import assert from 'node:assert/strict';
import { test } from 'node:test';
import { preserveShortAnswerContent as keep } from '../src/lib/blog-summary-blocks.mjs';

const h = value => ({ type: 'h2', value });
const p = value => ({ type: 'p', value });
const headings = new Set(['short answer', '핵심 답변', '短い回答']);

test('removes only an exact plain first paragraph duplicate', () => {
  assert.deepEqual(keep([h('Short Answer'), p('Answer'), h('Next')], headings, 'Answer'), [h('Next')]);
});
test('preserves unequal text and whitespace differences', () => {
  for (const value of ['Different', ' Answer', 'Answer\ncontinued']) {
    const blocks = [h('Short Answer'), p(value)];
    assert.deepEqual(keep(blocks, headings, 'Answer'), blocks);
  }
});
test('keeps remaining paragraphs and section heading without mutation', () => {
  const blocks = Object.freeze([Object.freeze(h('Short Answer')), Object.freeze(p('Answer')), Object.freeze(p('Definition')), Object.freeze(h('Next'))]);
  const before = JSON.stringify(blocks);
  assert.deepEqual(keep(blocks, headings, 'Answer'), [h('Short Answer'), p('Definition'), h('Next')]);
  assert.equal(JSON.stringify(blocks), before);
});
test('recognizes localized headings without changing body text', () => {
  for (const title of ['핵심 답변', '短い回答']) {
    assert.deepEqual(keep([h(title), p('정의')], headings, '정의'), []);
  }
});
test('only removes empty recognized sections', () => {
  assert.deepEqual(keep([h('Short Answer'), h('Unknown')], headings, 'Answer'), [h('Unknown')]);
});
test('preserves markup even when raw text equals summary', () => {
  for (const value of ['**Answer**', '[Answer](/source)', '`Answer`', '<em>Answer</em>', 'A_B']) {
    const blocks = [h('Short Answer'), p(value)];
    assert.deepEqual(keep(blocks, headings, value), blocks);
  }
});
test('preserves nonparagraph first blocks and later duplicate paragraphs', () => {
  const blocks = [h('Short Answer'), { type: 'ul', value: ['Answer'] }, p('Answer')];
  assert.deepEqual(keep(blocks, headings, 'Answer'), blocks);
});
