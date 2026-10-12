# ONNELLAB Website Design Guidelines

> Scope: the public ONNELLAB website in `onnellab/onnellab.github.io` (Astro). This is a **website-specific** design guide, not the Flutter app design system and not the private Ops/dashboard design system.
>
> Status: design guidance for future changes. Adding this document does **not** authorize or apply a redesign, new feature, dependency, copy rewrite, release-state change, or visual effect.

## 1. Authority and source files

Follow non-waivable security, legal, privacy, data-integrity, accessibility, and platform requirements. For a website task, prefer this order:

1. The explicitly approved task and those non-waivable requirements.
2. Actual product capabilities, release evidence, brand assets, existing route/content contracts, and localization requirements.
3. Existing website implementation and its passing behavior / regression contracts.
4. These website design guidelines.
5. Selected examples in [site-design-references.md](./site-design-references.md).

An inspiration gallery is not evidence of accessibility, conversion, performance, or suitability for ONNELLAB. Preserve working flows; external design patterns never silently override product facts.

Read the relevant sources before editing:

| Concern | Existing source of truth |
| --- | --- |
| Shared typography and document foundation | `src/layouts/BaseLayout.astro` |
| Header, mobile navigation, language switcher | `src/components/GlobalSiteHeader.astro` |
| Homepage composition and visual tokens | `src/components/HomePage.astro`, `src/components/home-page.css` |
| Apps catalogue and search | `src/components/AppsIndex.astro` |
| Product detail UI | `src/components/ProductTemplate.astro`, `docs/product-page-presentation.md` |
| Blog reading patterns | `src/components/BlogIndex.astro`, `src/components/BlogArticle.astro`, `docs/blog-shared-template.md` |
| Approved studio identity | `docs/brand-assets.md` |
| Homepage screenshot provenance | `docs/home-original-screenshots.md` |
| Privacy/release-sensitive content | `docs/privacy-policy-architecture.md`, applicable product/source files |
| Regression checks | `tests/home-showcase.spec.ts`, `tests/site-visual.spec.ts`, `tests/product-presentation.spec.ts`, relevant i18n/accessibility tests |

If the established page has an approved visual direction, refine within it. Do not manufacture a new direction or clone an external landing-page template because a new reference was listed.

## 2. Purpose and overall direction

**ONNELLAB is a product studio showroom and a trustworthy route to its apps, not a generic SaaS dashboard.**

- Communicate what each app actually does, for whom, and how to get it.
- Keep ONNELLAB recognizable while giving each app its own identity and accent.
- Default to a quiet, light, contemporary editorial layout: clear hierarchy, readable typography, purposeful whitespace, and authentic product imagery.
- Let the product's content determine section proportions; avoid identical card stacks or giant hero treatments on every page.
- Prefer visible outcomes and straightforward navigation over ornamental interaction.

Do not import Flutter-specific component rules into Astro or force web pages to share the same screens as the apps.

## 3. Brand, color, typography, and surfaces

- **Logo:** use the approved open OL mark without the removed blue dot, sourced according to `docs/brand-assets.md`. Never redraw or replace its geometry from a prompt or use a different studio mark because a reference looks fashionable.
- **Canvas:** primarily White or warm Ivory; Lilac, Soft Peach, and Baby Blue remain the studio's restrained accent families. Homepage defaults are declared in `src/components/home-page.css` (currently including `--home-ivory`, `--home-lilac`, `--home-peach`, `--home-blue`, `--home-ink`, and `--home-border`). **Code is authoritative for live token values**; this document does not introduce a second palette.
- **Functional emphasis:** one clear primary action within a decision area. Product accents can distinguish different products, but do not make three unrelated pastel buttons compete as equal CTAs.
- **Surfaces:** default to clean backgrounds, separators, alignment, and quiet borders before applying shadow, glass, or glow. Do not wrap every text block in a rounded card.
- **Typography:** preserve the website's active font stack and language-specific handling in code. Use heading size, spacing, weight, and text measure for hierarchy; preserve readable long-form copy and realistic line wrapping.
- **Effects:** gradients, blur, shadows, and translucency are optional materials with a named purpose, not defaults. A soft ambient wash can support a contained hero/brand moment if the existing identity allows it; decorative effects must not carry state or reduce contrast. Do not automatically restyle the site because a reference uses glass, gradients, or oversized type.

## 4. Page-specific grammar

### Home — studio showroom

- Preserve the distinction between the concise studio introduction, genuine app demonstrations, selected products, and a route to the complete catalogue.
- The existing homepage has a three-item product showcase/carousel; do not replace its layout or motion merely because an inspiration site uses a different hero.
- Product screenshots must obey `docs/home-original-screenshots.md`: original localized Android UI captures, byte-preserved, with CSS frames rather than embellished or fabricated in-image interfaces.
- Show actual app names, release states, and outcomes. Do not invent features, usage metrics, reviews, or screenshots.

### Apps catalogue — discovery

- Prioritize finding and comparing available apps, clear labels, working search, honest release/preparation status, and obvious product destinations.
- Use repeatable card/list rhythm, semantic groups, readable status, and useful empty-search feedback.
- Avoid turning the public catalogue into a statistics dashboard, infinite effects gallery, or conversion-pressure funnel.

### Product detail — explanation and trustworthy action

- Follow `docs/product-page-presentation.md`: shared product hero/release state, succinct introduction, localized Key features list (normally five to eight real features), necessary disclosures, and exactly four distinct useful FAQs.
- Keep store links, install availability, and paid-feature statements tied to verified release and capability data. A reserved store URL is not release proof.
- Do not hide platform limitations, data handling, pricing distinctions, or other material restrictions to make a landing page look cleaner.
- Treat screenshots and download actions as explanations of the actual product, not abstract decorative placeholders.

### Blog / About / legal — reading and trust

- Preserve article hierarchy, metadata, table of contents where present, readable paragraphs, related-content navigation, and clearly attributable product links.
- Do not insert marketing animations, card stacks, or floating CTAs that interrupt reading.
- Legal/privacy and release-related pages follow their existing content and routing contracts; visual inspiration cannot weaken disclosure.

## 5. Responsive, localized, and accessible by design

- Support all nine site locales: `en`, `ko`, `ja`, `zh-Hans`, `zh-Hant`, `pt-BR`, `de`, `fr`, `es`. Korean public-facing text uses natural **-해요체**.
- Design with real translated text (including long German/French/Portuguese copy and CJK line breaking); do not truncate meaning to keep a screenshot-like composition.
- Test narrow phones (including 320px), typical phones, tablet widths, and desktop. Avoid horizontal overflow and unreachable content; allow vertical scroll instead of clipping or shrinking touch targets.
- Use semantic HTML, visible focus, keyboard operability, meaningful labels and image alternatives, and predictable Back/Close behavior.
- Target WCAG AA contrast for readable text and meaningful control boundaries; evaluate actual composited backgrounds, not color tokens alone.
- Honor `prefers-reduced-motion`; animation must never be the only indicator of state, success, error, selection, or navigation. Do not introduce autoplay motion without user control and accessibility review.
- Accessibility, localization, mobile usability, and privacy outrank reference aesthetics.

## 6. Motion, imagery, and implementation discipline

- Motion is for **continuity or feedback**: a state change, carousel navigation, an opened panel, or a completed user action. Prefer short, restrained transitions with a static/reduced-motion equivalent.
- Keep primary interactive outcomes available by click/tap and keyboard, not through swipe/hover alone; do not impair links, form submission, scroll, or focus.
- Keep Astro's existing architecture and lightweight behavior. A React/Next.js component gallery is **not** a dependency recommendation. Extract the idea and implement with existing Astro/CSS/TypeScript patterns unless the approved requirement demonstrably needs more.
- Preserve real app captures, their dimensions and localization. Respect image provenance, avoid adding heavy video or third-party scripts solely for visual polish, and protect layout stability and initial load performance.
- External examples do not grant permission to copy their paid code, branding, assets, illustrations, or wording; verify source licenses separately when actual reuse is proposed.

## 7. Change process and completion evidence

1. Identify the page family, core user action, product truth, existing styles, and relevant tests.
2. For substantial redesigns only, compare a small number of materially different task-linked directions and choose one before implementation. Small fixes do not require concept exploration.
3. Choose at most two relevant sources from [site-design-references.md](./site-design-references.md) and record *what decision* each supports. Reject a source that conflicts with the existing website identity.
4. Change only the approved page/section. Do not silently alter app state, metadata, screenshots, translations, security, or unrelated pages.
5. Inspect the actual result at mobile and desktop widths, representative locales, keyboard focus, and reduced-motion state where applicable.
6. Run `npm run build`, `npm run check:i18n-quality`, and applicable Playwright checks (including `npx playwright test` for product presentation changes, per the existing contract). A passing build alone is **not** visual approval.
7. Report the affected pages, concrete before/after UX finding, tests actually run, unverified checks, and remaining risks. Use the repository's main-branch commit/push workflow; do not create a PR by default.

**Stop** rather than silently expanding scope if an improvement requires an unapproved site redesign, a framework change, a new data claim, fabricated imagery, inaccessible interaction, or a change to product/legal authority.
