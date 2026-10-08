# ONNELLAB blog — nine-language shared template

## One rendering path

All nine locales (`en / ko / ja / zh-Hans / zh-Hant / pt-BR / de / fr / es`)
use the same two presentation components:

- `src/components/BlogIndex.astro` — listing, category previews/filters, navigation and collection JSON-LD.
- `src/components/BlogArticle.astro` — summary, contents, Markdown, FAQ, recommendations, images and article JSON-LD.

Only the locale-specific strings live in `src/lib/blog-copy.ts`; do not add a Korean/English-only
presentation template or a translated-only alternate component. Existing route entry files
all delegate to these shared components. `src/lib/blog.ts` reads the same Markdown schema
for every locale. Every translated document is its own source of truth; absent translations
must not be fabricated or presented as published.

The language menu points to the matching translated article when it exists, or that
language's index when it does not. `blogPostAlternates()` advertises only actual
article translations for SEO. Existing canonical paths stay unchanged.

Markdown bold, links, inline code and escaping use `BlogInline.astro` on every locale.
The same user-visible recommendation card displays only the article title; the URL is
still present in the `href` for navigation.

## Validation

- `npm run build` — routes, metadata and the whole site.
- `npm run test:blog-template` — nine-language injected content and metadata contract.
- `npx playwright test tests/blog-shared-template.spec.ts tests/blog-inline.spec.ts tests/blog-related-links.spec.ts --project=desktop --project=mobile`
- `npm run check:i18n-quality` — source localization checks.
- `npm run check:blog-social-cards` — rendered blog assets.

`scripts/generate-blog-social-cards.mjs` discovers content language folders dynamically.
It does not assume blog assets exist for every locale: only existing SVGs are rendered.
`getBlogPosts()` without a locale intentionally keeps the original EN/KO RSS feed scope;
that feed policy is not a separate display template.
