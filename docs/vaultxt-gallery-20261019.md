# VaultXT landing gallery verification — 2026-10-19

## Root cause and correction

Commit `2668d656` introduced automatic concatenation of the reviewed five-image
gallery and ten Duo images (five outer, five inner). Live English and Korean
detail pages exposed all fifteen in one carousel. These were three device
captures of the same five features, not fifteen accidental copies of one file.

The landing carousel now consumes only the reviewed Android gallery: five
localized images, in receipt order. Alt text, dimensions, counter and viewer
use that same selection. Duo source files and their existing public asset URLs
remain preserved and independently validated; invalid receipts still stop builds.
No artwork bytes, store metadata or store uploads were changed.

## Verification

- Regression reproduced against the previous implementation: 15 != 5.
- Artwork contracts: 34 PASS, including real Astro builds and all nine locales.
- Production static build: 691 pages PASS.
- New VaultXT browser regression: desktop/mobile PASS across nine locales;
  five Android images, matching localized paths/alts, counter and viewer.
- Existing VaultXT product-contract browser tests: desktop/mobile PASS across
  nine locales. Deployment contract 3 PASS; brand contract 5 PASS.
- Independent read-only caller/contract/flow and workflow review: no blocker.
- Scoped changed-content secret scan clean. Full-tree scan flagged only the
  unchanged vendored `public/ops/libsodium-wrappers.js` and its generated dist
  copy; that file is outside this patch. No blanket scan-clean claim is made.

## Public store inspection (read-only)

Locales: en, ko, ja, zh-Hans, zh-Hant, pt-BR, de, fr, es.

| Published gallery | Per locale | Total | Identical-pixel duplicates within a gallery |
| --- | ---: | ---: | ---: |
| Google Play phone | 5 | 45 | 0 |
| App Store iPhone | 5 | 45 | 0 |
| App Store iPad | 5 | 45 | 0 |

All 45 Google Play screenshots match the corresponding Android landing image
in exact decoded pixels and order. Google images are 1080×2160; published Apple
iPhone images are 1320×2868 and iPad images 2064×2752. English/Korean contact
sheets were visually inspected: editing, autosave, search, snapshots and library
are distinct intended feature states. This establishes no fifteen-image device
concatenation or identical-image duplication in these published galleries.

App Store's public page still identifies version 2.0.1. Its images do not match
the local source files in exact decoded pixels, so this report does **not** claim
the latest candidate's Apple artwork is public or verified. Pending submissions
and non-public console state are outside this public inspection. No store
replacement, submission, release, or other mutation was performed.
