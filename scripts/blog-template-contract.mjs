import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { after, test } from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const fixtureLocales = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'pt-BR', 'de', 'fr', 'es'];
const createdFixturePaths = new Set();
const fixturePath = path.join(root, 'src/content/blog/en/template-contract.md');
const relatedFixturePath = path.join(root, 'src/content/blog/en/template-contract-related.md');
const outputPath = path.join(root, 'dist/blog/en/template-contract/index.html');
const relatedOutputPath = path.join(root, 'dist/blog/en/template-contract-related/index.html');
const indexPath = path.join(root, 'dist/blog/en/index.html');

function writeLocalizedFixture(slug, source) {
  for (const locale of fixtureLocales) {
    const filePath = path.join(root, 'src/content/blog', locale, `${slug}.md`);
    const localizedSource = source.replace(/^language:\s*"[^"]*"/m, `language: "${locale}"`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, localizedSource, 'utf-8');
    createdFixturePaths.add(filePath);
  }
}

after(() => {
  for (const filePath of createdFixturePaths) fs.rmSync(filePath, { force: true });
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });
});

test('published blog image references have deployable source assets', () => {
  let references = 0;
  for (const locale of fixtureLocales) {
    const directory = path.join(root, 'src/content/blog', locale);
    for (const name of fs.readdirSync(directory).filter((entry) => entry.endsWith('.md'))) {
      const sourcePath = path.join(directory, name);
      if (createdFixturePaths.has(sourcePath)) continue;
      const markdown = fs.readFileSync(sourcePath, 'utf8');
      for (const match of markdown.matchAll(/!\[[^\]]*\]\((\/blog-assets\/[^\s)"']+)/g)) {
        const assetPath = path.join(root, 'public', match[1].split(/[?#]/)[0]);
        assert.ok(fs.existsSync(assetPath), `${sourcePath}: missing ${match[1]}`);
        assert.ok(fs.statSync(assetPath).isFile(), `Not a file: ${assetPath}`);
        references += 1;
      }
    }
  }
  assert.ok(references > 0, 'Expected published articles to reference blog images');
});

test('blog article template renders publishing metadata without committing sample posts', () => {
  writeLocalizedFixture(
    'template-contract',
    `---
title: "How to Keep a Very Long ONNELLAB Workflow Article Title Readable on Mobile and Desktop"
card_title: "Readable Workflow Article Title"
slug: "template-contract"
category: "productivity"
language: "en"
description: "A template contract fixture used only during tests with a deliberately long supporting sentence that checks whether the header remains readable without swallowing the article body."
short_answer: "Use a concise answer block, restrained metadata, related recommendations, readable tables, calm callouts, code examples, and image captions before the body becomes dense."
published_at: "2026-07-11"
updated_at: "2026-07-12"
tags: "workflow|template"
related_apps: "VaultXT|ClipNest"
related_articles: "How to plan offline text workflows => /blog/en/offline-text-workflows/|How to structure clipboard notes => /blog/en/clipboard-notes/"
related_guides: "Large text editing guide => /blog/en/large-text-editing/|Clipboard workflow guide => /blog/en/clipboard-workflow/"
image_specs: "Workflow diagram for the full process|Comparison diagram for tool choices"
---

# How to Keep a Very Long ONNELLAB Workflow Article Title Readable on Mobile and Desktop

## Question

How should this template organize a long article?

## Short Answer

This section should feed the summary box and should not appear again in the body.

## Recommended Workflow

Make **bold words** bold, include [**linked bold**](/apps/vaultxt/), and keep <script>alert(1)</script> inert.

- Start with the **reader problem**.
- Show the lowest-risk workflow.
- Link to the matching [ONNELLAB application](/apps/vaultxt/).

> Keep the **callout** short enough to scan before the reader reaches the detailed workflow.

| **Element** | Purpose |
| --- | --- |
| **Summary** | Answers the core question quickly |
| Related apps | Connects the workflow to a concrete ONNELLAB utility |

\`\`\`
topics.csv -> markdown draft -> image_spec.json -> published page
\`\`\`

![Workflow placeholder](/app-assets/vaultxt/assets/screenshots/en/1.png "Caption text for a future generated workflow image")

## FAQ

### Should FAQ answers be rendered as normal paragraphs?

No. FAQ questions should become **collapsible details** so long articles stay easy to scan.

### Can related recommendations include URLs?

Yes. The template should render recommendation metadata as links when a URL is provided.
`,
  );

  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const html = fs.readFileSync(outputPath, 'utf-8');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');
  assert.match(html, /How to Keep a Very Long ONNELLAB Workflow Article Title/);
  assert.ok(html.includes('href="https://onnellab.com/favicon.svg?v=20261008-open-monogram-v1"'));
  assert.ok(html.includes('href="https://onnellab.com/favicon-32x32.png?v=20261008-open-monogram-v1"'));
  assert.ok(html.includes('href="https://onnellab.com/apple-touch-icon.png?v=20261008-open-monogram-v1"'));
  assert.ok(html.includes('href="https://onnellab.com/site.webmanifest?v=20261008-open-monogram-v1"'));
  assert.match(html, /<meta name="theme-color" content="#f8f4ec">/);
  assert.match(indexHtml, /Readable Workflow Article Title/);
  assert.doesNotMatch(indexHtml, /How to Keep a Very Long ONNELLAB Workflow Article Title Readable on Mobile and Desktop/);
  assert.match(html, /Use a concise answer block/);
  assert.match(html, /Published 2026-07-11/);
  assert.match(html, /Updated 2026-07-12/);
  assert.match(html, /Next reading/);
  assert.match(html, /recommendation-card/);
  assert.match(html, /Related guides/);
  assert.doesNotMatch(html, /Image plan/);
  assert.doesNotMatch(html, /Workflow diagram for the full process/);
  assert.match(html, /<blockquote\b/);
  assert.match(html, /<table\b/);
  assert.match(html, /<details/);
  assert.match(html, /<summary[^>]*>Should FAQ answers be rendered as normal paragraphs\?/);
  assert.match(html, /href="\/blog\/en\/offline-text-workflows\/"/);
  assert.match(html, /href="\/apps\/vaultxt\/"[^>]*>ONNELLAB application/);
  assert.match(html, /article-image-viewer/);
  assert.match(html, /data-article-image-trigger/);
  assert.match(html, /topics.csv -&gt; markdown draft/);
  assert.match(html, /Caption text for a future generated workflow image/);
  assert.doesNotMatch(html, />Short Answer</);
  for (const locale of fixtureLocales) {
    const segment = { 'zh-Hans': 'zh-hans', 'zh-Hant': 'zh-hant', 'pt-BR': 'pt-br' }[locale] ?? locale;
    const rendered = fs.readFileSync(path.join(root, 'dist/blog', segment, 'template-contract/index.html'), 'utf8');
    assert.match(rendered, /<strong>bold words<\/strong>/, locale);
    assert.match(rendered, /<strong>reader problem<\/strong>/, locale);
    assert.match(rendered, /<strong>callout<\/strong>/, locale);
    assert.match(rendered, /<strong>Summary<\/strong>/, locale);
    if (locale === 'en' || locale === 'ko') {
      assert.match(rendered, /data-label="Element"/, locale);
      assert.doesNotMatch(rendered, /data-label="\*\*/, locale);
    }
    assert.match(rendered, /<strong>collapsible details<\/strong>/, locale);
    assert.match(rendered, /<a href="\/apps\/vaultxt\/"><strong>linked bold<\/strong><\/a>/, locale);
    assert.match(rendered, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/, locale);
    assert.doesNotMatch(rendered, /\*\*bold words\*\*/, locale);
  }
});

test('blog article template renders next-reading cards when a public related post exists', () => {
  writeLocalizedFixture(
    'template-contract-related',
    `---
title: "Offline Text Workflow Guide"
card_title: "Offline Text Workflow Guide"
slug: "template-contract-related"
category: "reading"
language: "en"
description: "A related fixture that behaves like a second public article."
short_answer: "Keep the article available as a public related destination."
published_at: "2026-07-10"
updated_at: "2026-07-10"
tags: "reading|workflow"
---

# Offline Text Workflow Guide

## Question

How should a second public article behave?

## Short Answer

It should be available as a link target for the next-reading card test.
`,
  );
  writeLocalizedFixture(
    'template-contract',
    `---
title: "Readable Public Article"
card_title: "Readable Public Article"
slug: "template-contract"
category: "reading"
language: "en"
description: "A fixture that verifies actual public related article cards."
short_answer: "Show a concrete next-reading card when related article metadata points at a public article."
published_at: "2026-07-11"
updated_at: "2026-07-11"
tags: "reading|workflow"
related_articles: "Offline Text Workflow Guide => https://onnellab.com/blog/en/template-contract-related/"
---

# Readable Public Article

## Question

How should related articles appear?

## Short Answer

They should appear as linked cards after the article body.
`,
  );

  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const html = fs.readFileSync(outputPath, 'utf-8');
  const relatedHtml = fs.readFileSync(relatedOutputPath, 'utf-8');
  assert.match(relatedHtml, /Offline Text Workflow Guide/);
  assert.match(html, /Next reading/);
  assert.match(html, /recommendation-card/);
  assert.match(html, /Offline Text Workflow Guide/);
  assert.match(html, /<a class="recommendation-card" href="https:\/\/onnellab\.com\/blog\/en\/template-contract-related\/"/);
  assert.doesNotMatch(html, /<small>https?:\/\//);
  assert.doesNotMatch(html, /Offline Text Workflow Guide\s*=&gt;\s*https?:\/\//);

  const commaTitleHtml = fs.readFileSync(
    path.join(root, 'dist/blog/en/turn-rough-notes-into-structured-first-draft/index.html'),
    'utf8'
  );
  assert.match(
    commaTitleHtml,
    /<a class="recommendation-card" href="https:\/\/onnellab\.com\/blog\/en\/organize-downloads-small-folder-system\/".*?<strong[^>]*>How to Organize Downloads With a Small, Durable Folder System<\/strong>/,
  );
  assert.doesNotMatch(commaTitleHtml, /<span class="recommendation-card"/);
});

test('ordered list starts survive paragraph boundaries in all nine blog locales', () => {
  const slug = 'template-contract-ordered-lists';
  // Do not replace a real article or another task's fixture.
  for (const locale of fixtureLocales) {
    assert.equal(
      fs.existsSync(path.join(root, 'src/content/blog', locale, slug + '.md')),
      false,
      locale + ': ordered-list fixture path must be unused'
    );
  }
  const steps = (separator, paragraph = false) => Array.from({ length: 6 }, (_, index) => {
    const number = index + 1;
    return paragraph
      ? number + '. **Step ' + number + '**\n\n   Explanation ' + number + '.'
      : number + '. **Step ' + number + '** Explanation ' + number + '.';
  }).join(separator);
  const source = [
    '---',
    'title: "Ordered list rendering contract"',
    'slug: "' + slug + '"',
    'category: "productivity"',
    'language: "en"',
    'description: "Temporary ordered-list regression fixture."',
    '---',
    '',
    '# Ordered list rendering contract',
    '',
    '## Tight sequence',
    '',
    steps('\n'),
    '',
    '## Blank separated sequence',
    '',
    steps('\n\n'),
    '',
    '## Paragraph separated sequence',
    '',
    steps('\n\n', true),
    '',
    '## Repeated markers',
    '',
    '1. First repeated marker',
    '1. Second repeated marker',
    '1. Third repeated marker',
    '',
    '## Nonsequential markers',
    '',
    '3. First marker defines the start',
    '9. Later markers do not override counting',
    '1. Repeated markers do not restart a tight list',
    '',
    '## Intentional restart',
    '',
    '4. Fourth item',
    '5. Fifth item',
    '',
    'A standalone paragraph ends the first block.',
    '',
    '1. First restarted item',
    '2. Second restarted item',
    '',
    '## Unordered unchanged',
    '',
    '- First bullet',
    '- Second bullet',
    '- Third bullet',
    '',
    '## Numeric bounds',
    '',
    '0. Zero is a valid start',
    '',
    '000000002. Leading zeros are decimal',
    '',
    '999999999. Largest nine-digit marker',
    '',
    '1000000000. Ten digits are not a list marker',
    '',
    '9007199254740993. Unsafe integer stays ordinary text',
    '',
    '-1. Negative marker stays ordinary text',
    '',
    '1e3. Exponent stays ordinary text',
    '',
    '+2. Signed marker stays ordinary text',
    '',
    '## Existing blocks',
    '',
    'Ordinary **bold paragraph**.',
    '',
    '> A retained quotation.',
    '',
    '| Field | Meaning |',
    '| --- | --- |',
    '| Code | Retained table |',
    '',
    String.fromCharCode(96).repeat(3),
    '8. Code is not an ordered-list marker',
    String.fromCharCode(96).repeat(3),
    '',
    '## End sentinel',
    '',
    'End of the temporary fixture.',
    ''
  ].join('\n');
  writeLocalizedFixture(slug, source);
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

  const section = (html, id) => {
    const pattern = new RegExp(
      '<h2\\b[^>]*\\bid="' + id + '"[^>]*>[\\s\\S]*?<\\/h2>([\\s\\S]*?)(?=<h2\\b)'
    );
    const match = html.match(pattern);
    assert.ok(match, 'Missing test section: ' + id);
    return match[1];
  };
  const orderedLists = (html) => Array.from(html.matchAll(/<ol\b([^>]*)>([\s\S]*?)<\/ol>/g), (match) => {
    const start = match[1].match(/\bstart="(\d+)"/);
    assert.ok(start, 'Every rendered ordered block must carry its numeric start');
    const items = Array.from(match[2].matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g));
    assert.ok(items.length > 0, 'Ordered blocks must not be empty');
    for (const item of items) {
      assert.doesNotMatch(item[1], /\bvalue=/, 'Later source markers must not override Markdown counting');
    }
    return { start: Number(start[1]), count: items.length };
  });
  const markers = (lists) => lists.flatMap(({ start, count }) =>
    Array.from({ length: count }, (_, index) => start + index)
  );

  for (const locale of fixtureLocales) {
    const segment = locale.toLowerCase();
    const html = fs.readFileSync(path.join(root, 'dist/blog', segment, slug, 'index.html'), 'utf8');
    for (const id of ['tight-sequence', 'blank-separated-sequence', 'paragraph-separated-sequence']) {
      const content = section(html, id);
      const lists = orderedLists(content);
      assert.deepEqual(markers(lists), [1, 2, 3, 4, 5, 6], locale + ': ' + id);
      assert.equal(lists.length, id === 'tight-sequence' ? 1 : 6, locale + ': retain existing block boundaries');
      assert.equal((content.match(/<strong>Step \d<\/strong>/g) || []).length, 6, locale + ': preserve inline emphasis');
      if (id === 'paragraph-separated-sequence') {
        assert.equal((content.match(/<p\b[^>]*>Explanation \d\.<\/p>/g) || []).length, 6, locale + ': preserve paragraph content');
      }
    }
    assert.deepEqual(markers(orderedLists(section(html, 'repeated-markers'))), [1, 2, 3], locale);
    assert.deepEqual(markers(orderedLists(section(html, 'nonsequential-markers'))), [3, 4, 5], locale);
    assert.deepEqual(markers(orderedLists(section(html, 'intentional-restart'))), [4, 5, 1, 2], locale);
    const unordered = section(html, 'unordered-unchanged');
    assert.equal((unordered.match(/<ul\b/g) || []).length, 1, locale);
    assert.equal((unordered.match(/<li\b/g) || []).length, 3, locale);
    assert.doesNotMatch(unordered, /<ol\b|\bstart=/, locale);
    const numeric = section(html, 'numeric-bounds');
    assert.deepEqual(orderedLists(numeric), [
      { start: 0, count: 1 },
      { start: 2, count: 1 },
      { start: 999999999, count: 1 }
    ], locale);
    for (const prefix of ['1000000000.', '9007199254740993.', '-1.', '1e3.', '+2.']) {
      assert.ok(numeric.includes(prefix), locale + ': rejected marker must retain its text');
    }
    const existing = section(html, 'existing-blocks');
    assert.match(existing, /<strong>bold paragraph<\/strong>/, locale);
    assert.match(existing, /<blockquote\b/, locale);
    assert.match(existing, /<table\b/, locale);
    assert.match(existing, /<pre\b[^>]*><code\b[^>]*>8\. Code is not an ordered-list marker<\/code><\/pre>/, locale);
    assert.doesNotMatch(existing, /<ol\b/, locale);
  }
});
