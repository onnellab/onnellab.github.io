# Homepage screenshot source contract: Android only

All homepage screenshots (the 3 Hero screenshots, TagWeaver signature, and the 3 Selected Apps screenshots) use the **original Android UI capture** from each app's `assets` directory. Screenshot marketing compositions or iPad/iPhone captures are not used.

Source and provenance for each `public/home-assets/screenshots/android-20261012/{locale}/*.png`:

| Site name | Source inside app repository | Native size |
|---|---|---|
| tagweaver-library.png | tagweaver/assets/store_promo/raw/{locale}/android/library_selected.png | 1440×3120 |
| tagweaver-editor.png | tagweaver/assets/store_promo/raw/{locale}/android/editor.png | 1440×3120 |
| melivra.png | melivra/assets/store_promo/raw/android/{locale}/1.png | 1080×2400 |
| papira.png | papira/assets/store_promo/raw/android/{locale}/02.png | 1440×3120 |
| quivra.png | quivra/assets/store_promo/raw/{locale}/02.png (app's localized mobile UI raw source, used for Android marketing) | 1080×1920 |

Supported languages: en, ko, ja, zh-Hans, zh-Hant, pt-BR, de, fr, es. Each is a byte-for-byte copy, verified by SHA-256 at import; **no enlargement, recompression, or post-processing**. App frames are drawn by CSS, not baked into PNGs.

A new versioned directory is intentionally used, so visitors won't see cached older iOS/iPad-origin images under the previous URL. The former unversioned site assets are removed from the live build. These files are snapshots and are not automatically synced with the app repositories.

For future updates, select raw Android sources, revalidate matching locale coverage, and use a fresh versioned URL path so cached old images cannot persist.
