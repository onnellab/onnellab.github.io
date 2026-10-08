# ONNELLAB brand mark (2026-10-08)

The approved mark is the open OL monogram **without** a blue dot.
The canonical vector outline is `public/brand/mark-charcoal.svg`.
Do not recreate, simplify or replace this outline from a text prompt.

## Files

- `public/brand/mark-{charcoal,white,ivory,lilac,soft-peach,baby-blue}.{svg,png}`: **six color variants, all on transparent backgrounds**, each PNG 512x512. Only the logo color changes; all share the identical approved outline.
- No `public/brand/icon-*` full-color-background variants are maintained.
- `public/favicon.svg` and `public/favicon-32x32.png`: charcoal logo on **transparent** background.
- `public/apple-touch-icon.png`: charcoal logo on **ivory** background (180x180), retained as the sole public website touch-icon background exception for legibility.
- `public/ops/icon-{180,192,512}.png`: ivory-backed operational app icons, separate from the transparent brand logo pack.
- `public/social-card.svg` and `public/social-card.png`: updated brand graphic.
- `public/blog-assets/**/{social-card,workflow-diagram}.svg`: approved logo in the footer; corresponding blog social-card PNGs regenerated from workflow diagrams.

## Regeneration and verification

1. `node scripts/generate-brand-assets.mjs` — re-render site and color variants from the master SVG.
2. `npm run generate:blog-social-cards` — apply the brand mark idempotently to blog SVGs and render social PNGs.
3. `npm run test:brand` and `npm run check:blog-social-cards` — verify visual asset contracts.

Content diagrams and app-specific icons are not ONNELLAB corporate logos and must not be replaced during brand updates.
