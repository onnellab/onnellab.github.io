# Product-page presentation contract

All public product details use the same editorial structure in all nine locales:

1. Keep the product identity, common hero layout and release state. Web SEO copy is reviewed separately from store copy.
2. Introduce the app in one or two paragraphs.
3. Use the shared localized “Key features” heading and one list of five to eight features.
4. Follow with one to three short paragraphs for important processing details, constraints and purchase disclosures.
5. Provide exactly four useful, distinct FAQs in the shared disclosure layout.

Do not add a separate Pro heading or a detailed paid-feature catalogue. A brief, accurate purchase notice is sufficient. Never suggest that a paid feature is free. Melivra AI Credits must remain explicitly separate from Pro. Preserve file-modification, upload, export-format and platform limitations, including Meriq's non-editable PDF layers and VaultXT's local working copies.

FAQ count and feature-count ranges are editorial choices, not search-engine ranking rules. Do not pad simple apps with invented capabilities. Each app must cover the same functional topics in all locales; wording and sentence length may vary naturally. Korean public prose uses 해요체. Product state changes require explicit release evidence; store URLs alone do not mean an app has launched.

## Active editing sources

- Aligna, ClipNest, Meriq, Quivra, Segra and TagWeaver: the active landing/description and FAQ fields in `src/content/apps/<app>/description-{en,ko}.md`; the matching records in `src/lib/product-localizations.ts` and `src/lib/extended-product-localizations.ts` for the other locales.
- Melivra: `src/lib/melivra-product.ts`.
- Papira body: `src/lib/papira-description.ts`; FAQs: `src/lib/papira.ts` and the Papira records in `src/lib/extended-product-localizations.ts`.
- VaultXT: `landingBody` and `faq` in `src/content/apps/vaultxt/promo-copy.json`. Do not silently rewrite its separate store metadata or screenshots when editing the web page.

The shared template validates the structure at build time. `tests/product-presentation.spec.ts` checks all products and languages, visible features against structured data, FAQ behavior, locale links, and layout overflow. Existing product-specific tests still protect semantic boundaries.

Run `npm run build`, `npm run check:i18n-quality`, and `npx playwright test` before final delivery. Do not bypass failures by deleting product-safety assertions. Keep meaningful independent edits committed and pushed on `main`.

## Web search metadata

Keep an explicit, human-written web summary next to each locale's active product copy.
For Markdown sources use `SEO description:` and optional `SEO title:` inside each
platform block. TypeScript records and VaultXT web fields use `seoDescription`
and optional `seoTitle`. Keep VaultXT store fields and promotional screenshots unchanged.
Papira's web summaries live beside its web body in `papira-description.ts`; the
extended registry references that body instead of keeping another translation.

Do not build metadata by concatenating the app name, subtitle, platform label and
whole introduction. The generic fallback uses the first descriptive paragraph,
not an iOS subtitle, but every published product must have an explicit summary.
The regression suite checks all apps/locales, including newly added products.
HTML description, Open Graph, Twitter and SoftwareApplication descriptions must
match the same reviewed summary. Do not hard-truncate sentences or pad CJK text.

Google does not prescribe a fixed title or meta-description character limit.
Keep titles concise and summaries useful; numeric counts are editorial diagnostics,
not ranking rules. See https://developers.google.com/search/docs/appearance/snippet
and https://developers.google.com/search/docs/appearance/title-link.
