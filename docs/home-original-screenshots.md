# Homepage screenshot source contract: Android only

All homepage screenshots (the 3 Hero screenshots, TagWeaver signature, and the 3 Selected Apps screenshots) use the **original Android UI capture** from each app's `assets` directory. Screenshot marketing compositions or iPad/iPhone captures are not used.

Source and provenance for each `public/home-assets/screenshots/android-20261012/{locale}/*.png`:

| Site name | Source inside app repository | Native size |
|---|---|---|
| tagweaver-cover.png (kept for cached older pages) | tagweaver/assets/store_promo/raw/{locale}/android/cover.png | 1440×3120 |
| tagweaver-library.png (featured product section) | tagweaver/assets/store_promo/raw/{locale}/android/library_selected.png | 1440×3120 |
| tagweaver-editor.png (Hero) | tagweaver/assets/store_promo/raw/{locale}/android/editor.png | 1440×3120 |
| melivra.png | melivra/assets/store_promo/raw/android/{locale}/1.png | 1080×2400 |
| papira.png | papira/assets/store_promo/raw/android/{locale}/02.png | 1440×3120 |
| papira-hero.png (Hero) | papira/assets/store_promo/raw/android/{locale}/04.png | 1440×3120 |
| quivra.png | quivra/assets/store_promo/raw/{locale}/02.png (app's localized mobile UI raw source, used for Android marketing) | 1080×1920 |

Supported languages: en, ko, ja, zh-Hans, zh-Hant, pt-BR, de, fr, es. Each is a byte-for-byte copy, verified by SHA-256 at import; **no enlargement, recompression, or post-processing**. App frames are drawn by CSS, not baked into PNGs.

A new versioned directory is intentionally used, so visitors won't see cached older iOS/iPad-origin images under the previous URL. The former unversioned site assets are removed from the live build. These files are snapshots and are not automatically synced with the app repositories.

For future updates, select raw Android sources, revalidate matching locale coverage, and use a fresh versioned URL path so cached old images cannot persist.

## Hero image choice

- TagWeaver: the Hero shows the actual metadata editing form (title, artist, album, year, tags, and cover controls), replacing the large logo-focused cover image. The featured product section instead shows the original library/file selection screen, so visitors see two distinct app workflows.
- Melivra: keep Android 1.png, the four-cover music selection home; its color is easy to distinguish at thumbnail scale.
- Papira: use Android 04.png in the Hero so the book preview is more prominent than in 02.png, while retaining 02.png for the separate selected-product card.
- Hero uses native Android PNGs as-is. The file names are unique to prevent browsers reusing prior cached captures. The older TagWeaver cover PNG remains at its original URL for cached older HTML; the current homepage references the editor and library originals instead. Do not delete any of the three source captures.
