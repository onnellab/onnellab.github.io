# Static image-cache feature removal — 2026-10-03

## Why deployment stopped

[Deploy run 37108419131](https://github.com/onnellab/onnellab.github.io/actions/runs/37108419131) failed its pre-install dependency audit at commit `28d4228f1a5c4f2c51125f4ca3e710c71e3977d6`. The finding was [GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp), inherited by Astro from `http-cache-semantics` 4.2.0. As of this assessment, the registry's latest cache package is 4.2.0, the advisory has no patched version, and Astro 7.3.5 still depends on it. [Upstream PR 58](https://github.com/kornelski/http-cache-semantics/pull/58) remains unmerged.

An ordinary patch upgrade cannot resolve this finding. The audit's suggested Astro 2.10.9 downgrade is unsuitable. This change keeps the existing locked Astro **7.3.3**, pins it exactly, and removes an unused feature instead. It does not claim that the static production site exposed user sessions: the advisory concerns shared HTTP cache reuse, and this deployment serves prebuilt files through GitHub Pages.

## Actual implementation removal

The npm-supported [root override](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides) replaces every `http-cache-semantics` import with a private repository-owned module at `vendor/disabled-http-cache`. Its manifest identifies it honestly as `@onnellab/disabled-http-cache` 1.0.0. It contains **no upstream cache code**, header parser, storage, network access, or cache-policy implementation. Its constructor always throws without reading or retaining request/response arguments. The original registry tarball, version and integrity entry disappear from the lockfile; all other registry package resolutions remain unchanged.

This is not a patched or version-renamed upstream package, and it is not a general-purpose replacement. npm audit cannot assess repository-owned code for advisories; independent source review and executable boundary tests are required in addition to the unchanged audit gate.

## Why the image-service boundary is necessary

A throwing cache constructor or `storable() === false` alone is insufficient. The inspected Astro generator can reuse an already-fresh file, revalidate an ETag, and even copy stale bytes when revalidation throws. Its low-level remote loader also fetches before constructing a cache policy.

The configured [external image-service API](https://docs.astro.build/en/reference/image-service-reference/) prevents that pipeline from being entered:

- `getRemoteSize`, `validateOptions`, `getURL` and `getHTMLAttributes` throw unconditionally. `getRemoteSize` must throw rather than return undefined, since Astro otherwise falls back to its network probe before validating options.
- The service has **no `transform` property**. Astro therefore cannot register static transformations or execute its dev image endpoint's local-service path. The built-in passthrough service is unsuitable because it still implements `transform`.
- Configuration rejects server output, adapters, changed image service and incremental builds. Incremental builds can restore old transforms without invoking the current service.
- The project starts with a new Astro cache directory. CI restores only npm download cache, not Astro image/build cache.
- The package version and actual installed cache callsite hashes are pinned in regression tests. New consumers or changed callsites require a fresh review.

No input headers, cookies, validators or sensitive request values are retained or included in error messages. Low-level loader tests use fake fetch functions; they prove policy rejection, not prevention of those internal helpers' initial fetch. Actual public API, fixture-build and dev endpoint tests prove the configured service rejects requests before any origin access.

## Behavior before and after

| Area | Before | After |
| --- | --- | --- |
| Pages, translations, blog/Ops copy, metadata and routes | Existing site content | Unchanged |
| Existing repository/public images and app-assets route | Normal HTML image URLs and static byte copies | Unchanged |
| Astro version used in the lockfile | 7.3.3 | 7.3.3, explicitly pinned |
| Installed upstream HTTP cache implementation | 4.2.0 with new HIGH finding | Removed; independent fail-closed sentinel |
| Astro optimization through Image/Picture/getImage/inferRemoteSize | Available but unused by current site | Intentionally rejected, including local optimization |
| Server adapters and incremental builds | Not used | Explicitly rejected pending a new review |
| HIGH/CRITICAL dependency audit gate | Required before install | Unchanged, still fails closed |

Ordinary browser caching and GitHub Pages response headers are not modified. This boundary does not make SSR or a general shared cache safe. If image optimization, SSR, incremental builds or another consumer is needed later, first replace this containment with a reviewed supported implementation and remove or update these constraints together.

## Verification

The full verification commands are:

```sh
npm audit --package-lock-only --include=dev --audit-level=high
npm ci
npm ls astro http-cache-semantics
npm run test:image-boundary
npm run test:blog-template
npm run check:i18n-quality
npm run build
npx playwright test --project=desktop --workers=2 --reporter=line
```

`test:image-boundary` checks the independent sentinel, every locked consumer, actual installed resolution and callsite hashes, real Astro `getImage`, low-level load/revalidation with public/private/Set-Cookie/no-store/no-cache/max-stale/304 scenarios, early-rejected fixture builds with a nonempty cache directory (not a claimed cache-hit regression), incremental/server rejection, exported `inferRemoteSize`, and the real dev image endpoint with a private-response origin that must receive zero requests.

The deployment and localization workflows run this contract after their unchanged pre-install audit. No fixture posts or unsafe fixture output are published. Deployment completion must additionally be verified for the exact remote commit and live public assets.

### Local results before publication

- Clean installation passed with the CI versions, Node 22.23.3 and npm 10.9.9.
- Full locked-dependency audit: zero known findings, including development dependencies.
- Security-boundary tests: 13 passed; blog-template tests: 3 passed.
- Localization quality: 237 source files checked; static build: 471 pages, no server output.
- Rebuilding the unchanged site with its original image configuration and with this containment produced 1,017 files with identical SHA-256 hashes. This compares configuration behavior using the safe replacement dependency, not execution of the removed vulnerable library.
- Independent security review found no blocking issue. Its test-process cleanup correction was applied and the boundary suite rerun successfully.
- Local desktop browser tests were blocked before browser launch: the requested Playwright browser archive was invalid in the container, and the installed system Chromium could not create its required IPC socket. These are not passing browser regressions. The existing GitHub-hosted localization/browser workflow must establish those results for the published commit.
