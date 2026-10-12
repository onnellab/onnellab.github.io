# ONNELLAB Website Design References

> Scope: a curated **internal reference catalogue for the public Astro website**. See [site-design-guidelines.md](./site-design-guidelines.md) for the rules that govern any application.
>
> Selection date: 2026-10-13. Links and examples change; inspect the **specific live example** when using it. This catalogue does not license, download, install, or incorporate any external source code or asset.

## How references rank

1. **Actual ONNELLAB product and website behavior**: verified app capabilities, release state, localization, approved brand assets, real screenshots, existing website structure, and regression tests.
2. **Observed, functioning published website flows**: useful evidence of interaction/organization, but not proof of conversion performance or universal accessibility.
3. **Interactive component demonstrations**: useful for feedback, state continuity, and affordance; not evidence the pattern belongs in this website.
4. **Curated design showcases**: visual inspiration only, not proof of performance, business results, production readiness, accessibility, or a valid license.

Examples must not override the current product-page contract, original app screenshot rules, approved ONNELLAB logo, nine-locale content, or legal and accessibility requirements. Do not mix unrelated inspirations into one generic AI-designed page.

## Priority references: public app and studio website composition

| Source | Primary research job | Good targets here | Do not take from it |
| --- | --- | --- | --- |
| **[One Page Love — App websites](https://onepagelove.com/genre/app)** | Compare real app-product landing pages, value proposition hierarchy, authentic screenshot placement, and clear store/download actions | Homepage hero, featured apps, individual app detail pages | Product claims, brand treatments, whole-page cloning, conversion promises |
| **[Lapa Ninja](https://www.lapa.ninja/)** | Compare complete landing-page section order, content density, spacing rhythm, editorial hierarchy, and responsive storytelling | Homepage section balance, product-detail flow, app catalogue entry points | Generic SaaS dashboard sections, overly long marketing funnels, paid templates/assets |
| **[Siteinspire](https://www.siteinspire.com/)** | Explore understated independent-studio visual identity, typography, grids, and editorial composition | Studio/About area, long-form sections, brand-wide visual polish | Fashion/agency novelty that hides the apps, experimental interactions without a practical task |

These are **discovery libraries**. Open the shortlisted example itself, verify it has a viewable live design, and document the precise design decision before using it. Do not treat the gallery site's description as a usability audit.

## Secondary references: website interaction behavior

| Source | Research job | Website-specific limit |
| --- | --- | --- |
| **[Transitions.dev](https://transitions.dev/)** | Short continuity transitions for menu/panel reveal, carousel navigation, or shared-element state changes | Preserve current site navigation and keyboard interactions; implement restrained CSS/TypeScript motion with `prefers-reduced-motion` support |
| **[beUI](https://beui.dev/)** | Modal, tab, sheet, toast, and state-morph examples | React/Next.js demonstrations are **not** drop-in Astro components; focus trapping, semantic buttons, dismissal, and reduced motion must work with the site's existing stack |

Use interaction references only after the page task and information hierarchy are settled. Do not add motion to static text, legal disclosures, FAQs, or article sections just to signal polish.

## Situational references, not site-wide defaults

| Source | Only when | Avoid |
| --- | --- | --- |
| **[Arc UI](https://uiarc.dev/)** | A real website input, search/filter, editable form, or settings-like interaction needs state/focus/validation study | Adding forms, React runtime, or a generic settings page without a product requirement |
| **[Kobra](https://kobra.systems/)** | A concrete button/input/loading/selection/confirmation problem needs interactive feedback examples | Overengineering ordinary links, buttons, or messages into animated components |

These are supplemental examples, not automatically higher authority than an already functioning accessible ONNELLAB control.

## Deliberately excluded from the public site defaults

| Source | Decision | Reason |
| --- | --- | --- |
| [BoardUI](https://www.boardui.com/components) | **Not default for `onnellab.github.io`** | Dashboard tables, metrics, sidebars, and dense admin layouts suit internal ONNELLAB content-engine/Ops workflows, not the public app showroom. Re-evaluate only if a real public data-heavy page is approved. |
| [Evil Charts](https://evilcharts.com/) | **Not default** | The present studio showcase and product pages are not analytics products. Reference it only for an approved data-visualization page with real verified data. |
| [affectUI](https://affectui.com/) | **Deferred** | AI-agent/task interfaces overlap other component examples and are not a current public-site requirement; inspect individual demos and license before admission. |

These exclusions are about **current product fit**, not judgements that the libraries are poor.

## Page-to-source starting map

| Existing page/flow | Start with | Question to answer |
| --- | --- | --- |
| Homepage studio introduction / product hero | One Page Love + Siteinspire | Can visitors recognize ONNELLAB and the main app value at a glance without losing genuine product screenshots? |
| Homepage sections / selected apps | One Page Love + Lapa Ninja | Are featured products and the full app catalogue discoverable without card clutter or redundant copy? |
| Apps catalogue/search | Lapa Ninja; add Kobra only for a concrete interaction issue | Are searching, release-state distinctions, and product destinations clear on small screens? |
| Individual app detail / download | One Page Love + Lapa Ninja | Are features, real limitations, screenshots, verified availability, FAQs, and store actions in the right order? |
| About / studio identity | Siteinspire + Lapa Ninja | Is the composition distinctive and legible without agency-style excess? |
| Blog / editorial content | Siteinspire, only for typography and rhythm | Does the article remain easier to read and navigate, including headings, metadata, and related posts? |
| Carousel / menus / overlays | Transitions.dev or beUI, only for relevant state changes | Does motion preserve continuity while keyboard/touch/dismissal/reduced-motion behavior remains equivalent? |
| Privacy / legal / release notes | Existing site contracts, not an inspiration gallery | Is every disclosure accessible, complete, and consistent with the approved source? |

This map is a **lookup aid**, not permission to redesign every mapped page. Prefer **one or two** sources per actual task.

## Required adoption note for each proposed change

Record the following in the implementation plan, review, or commit message:

1. **Current page and user job:** e.g., product-detail download decision, not a generic "make premium" goal.
2. **Direct link to the inspected individual example**, its date, and what was actually observed (not inferred from the gallery title).
3. **One bounded idea to retain:** e.g., stronger screenshot-to-copy proportions, clearer link hierarchy, focus-safe panel closing.
4. **What to reject:** copyrighted assets, other brand colors, fake app screens, SaaS pricing sections, animation packages, unsupported platform claims.
5. **Astro-native implementation plan:** reuse current CSS, components, tokens, copy, and content sources; justify any new dependency.
6. **Validation:** mobile/desktop, nine locales, keyboard, screen reader where relevant, reduced motion, performance, product facts, tests actually run.

When an example is inaccessible, say so and select a different inspectable source; do not invent its visual details or bypass access controls.

## License and reuse policy

Reference URLs are for **study, not source import**. Before copying any source, explicitly verify the license of the *specific component, code, image, icon, illustration, typeface, or template*. Free-to-view is not necessarily free-to-reuse or free-to-redistribute. Paid source and distinctive third-party brand assets must not be copied into the public site or the ONNELLAB repository without documented permission.

Always preserve the studio's authorized mark, product copy, authentic screenshots, current technical stack, privacy boundaries, and semantic accessibility. Refer to [site-design-guidelines.md](./site-design-guidelines.md) and the page-specific source contracts before proposing a change.

**This catalogue is design guidance only; adding it changes no runtime UI.**
