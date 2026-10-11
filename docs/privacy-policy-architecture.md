# ONNELLAB app privacy policy architecture

## Single app template

All eleven consumer app policies (`aligna`, `clipnest`, `lunary`, `melivra`,
`meriq`, `papira`, `quivra`, `segra`, `sonary`, `tagweaver`, `vaultxt`) share
`src/components/LocalizedAppPrivacyPage.astro` for all nine locales
(`en, ko, ja, zh-Hans, zh-Hant, pt-BR, de, fr, es`).

Canonical routes:
- EN: `/privacy/{app}/`
- Other locales: `/privacy/{app}/{language-segment}/`

The two Astro entry points are `src/pages/privacy/[app]/index.astro` and
`src/pages/privacy/[app]/[locale]/index.astro`. There must not be a dedicated
Melivra, Papira, Lunary or Korean/English-only app policy template.

## Preserve substantive app-specific disclosures

`src/lib/privacy-policy-documents.ts` adapts existing, independently authored copy
into a shared display model. It is a presentation adapter, **not** a blanket policy.

- Eight apps' EN/KO copy: `src/content/privacy-policies/{en,ko}/{app}.json`,
  extracted without changing policy prose from the former published static HTML.
  The source update dates are retained. Do not replace these statements with generic
  wording unless the real app data flow has been reviewed.
- Eight apps' other seven locales: `src/lib/app-privacy-localizations.ts`
  continues to provide localized statements and Melivra's server-specific disclosures.
- Papira: `src/lib/papira-privacy-copy.ts`, preserving all nine existing versions.
- Lunary: `src/lib/lunary-privacy.ts`, preserving Google Calendar and
  Google API Services User Data Policy / Limited Use language in every locale.
- Changes to server, analytics, payments, retention, permissions and data-sharing
  disclosures require **per-product factual verification**, not mechanical mass edits.

The old `/melivra-privacy-policy/` routes have compatibility redirects implemented
by `src/pages/[...privacyLegacy].astro`, without restoring a Melivra-only page
folder. They point to the canonical app privacy routes. As this is a static website,
the redirect uses client-side navigation and a refresh fallback; HTTP 301/308
redirects require configuration at the hosting layer.

The `/privacy/youtube-manager/` policy is a separate, operator-only Google/YouTube
OAuth service (ONNELLAB Media Console), not one of the eleven consumer app policies.
Its existing specialized legal page remains independent.

App privacy hubs use the app policy source's last-updated date, not a duplicated
hard-coded map. App product detail privacy links and sitemap URLs keep canonical paths.

## Validation

- `npm run build` ensures all canonical and legacy compatibility pages exist.
- `npx playwright test tests/privacy-shared-template.spec.ts --project=desktop --project=mobile`
  checks every app/locale, date, headings, language links, overflow, preservation of
  EN/KO statements, and the nine historical Melivra URLs.
- `npx playwright test tests/papira-i18n.spec.ts tests/lunary-privacy.spec.ts tests/extended-i18n.spec.ts`
  checks product-specific privacy contracts and localized metadata.

## Sonary legal pages (2026-10-12)

Sonary has independent nine-language documents in `src/content/sonary-legal/`.
Its privacy pages use the same renderer as the other consumer apps. The Sonary
supplement at `/terms/sonary/` (and each language segment) uses that renderer too,
and links to the unchanged common ONNELLAB terms. Privacy hubs list Sonary without
creating a product listing or claiming store availability. Both document families
are in the sitemap and link to each other.

Facts were checked against Sonary's product/storage contracts and current source.
Live calls, store products, operating authentication/retention controls, provider
regions and subscription switching remain unavailable or unverified; publishing
these pages is not approval or proof that those systems are operational.

Primary sources checked: [OpenAI API data](https://developers.openai.com/api/docs/guides/your-data),
[Modal security](https://modal.com/docs/guide/security),
[Apple subscriptions](https://developer.apple.com/app-store/subscriptions/),
[Google Play cancellation](https://support.google.com/googleplay/answer/7018481?hl=en).
OpenAI's default abuse monitoring retention and Modal Functions retention are
separate from Sonary's own prohibition on durable conversation storage.

Validation: `npx playwright test tests/sonary-legal.spec.ts tests/privacy-shared-template.spec.ts --project=desktop --project=mobile`.
