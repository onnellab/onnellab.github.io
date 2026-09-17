# Dependency security assessment — 2026-09-17

## Scope and conclusion

Repository: `onnellab/onnellab.github.io`. This assessment covers the npm dependency warnings in the website build, not the Flutter apps or a historical incident investigation.

The original locked dependency tree reported **7 vulnerable packages (6 high, 1 critical)**. This is a package count, not a count of distinct exploitable endpoints or CVEs. The complete patched lockfile, including development and optional dependencies, reported **zero known vulnerabilities** at the time of verification. A clean audit does not prove the absence of undisclosed vulnerabilities.

No public-request path to the reported vulnerable processing functions was found in the current static deployment. The vulnerable tools were nevertheless upgraded: build-time inputs and future feature changes must not be assumed permanently trusted.

## Evidence and reproducibility

- Baseline audit: [Actions run 35175997641](https://github.com/onnellab/onnellab.github.io/actions/runs/35175997641).
- Successful remediation and baseline comparison: [Actions run 35176569662](https://github.com/onnellab/onnellab.github.io/actions/runs/35176569662).
- Dependency patch: [`393b3c6bba1dc12ed2af3e6516d848f3b7772fe0`](https://github.com/onnellab/onnellab.github.io/commit/393b3c6bba1dc12ed2af3e6516d848f3b7772fe0).
- Audit JSON and before/after blog-test logs are retained as workflow artifacts for 14 days. Package versions remain reproducible from the committed lockfile.

Verification commands included:

```sh
npm audit --package-lock-only --include=dev --audit-level=low --json
npm ci
npm ls astro js-yaml nanoid postcss sharp smol-toml svgo @playwright/test
npm run check:i18n-quality
npm run build
npx playwright test tests/meriq-copy.spec.ts tests/product-contract.spec.ts tests/extended-i18n.spec.ts tests/site-i18n.spec.ts tests/accessibility-i18n.spec.ts --project=desktop --workers=2 --reporter=line
git diff --check
```

The audited candidate passed the clean installation, localization check, static build, selected Playwright suites, and package-only change-scope check before its dependency commit. Production sources, translations, icons, routes, and existing test assertions were not changed by the dependency update.

## Reachability assessment

### Public deployment

`astro.config.mjs` selects `output: 'static'`; the deployment workflow publishes `dist` to GitHub Pages rather than starting an Astro/Node server. The production build generated 368 pages. The remediation check confirmed that `dist/server` was absent.

`src/pages/app-assets/[...asset].ts` enumerates repository assets with `getStaticPaths()` and copies their bytes with `fs.readFileSync(props.filePath)` during static generation. It does not optimize images from visitor requests.

A source scan of `src`, `scripts`, the Astro config and the Playwright config found no use of `astro/assets`, Astro view transitions, `transition:animate`, `removeScripts`, or a `prerender = false` route. There were no tracked AVIF, HEIF/HEIC, GIF, TIFF, VIPS or TOML inputs. Existing SVGs are repository-owned public assets; their presence alone is not evidence of a sanitization bypass.

This is a reachability assessment for these advisories, not a claim that static HTML can never contain XSS.

### Package findings

| Package | Previous lock | Patched lock | Reported risk and relevance here |
| --- | --- | --- | --- |
| Astro | 7.0.4 | 7.3.3 | The critical AVIF advisory requires processing an attacker-controlled AVIF through the default Sharp image service. No such image service/input path was found in this static site. Other Astro rendering advisories likewise require specific vulnerable input paths; not all apply merely because Astro is installed. |
| sharp | 0.34.5 | 0.35.4 | Native image-decoder vulnerabilities matter when malformed images reach processing. The current app-asset route copies bytes, and no Astro image-service use was found. Upgraded together with Astro instead of overriding its dependency contract. |
| js-yaml | 4.3.0 | 4.3.2 | Crafted YAML merges can exhaust CPU. Installed through Astro's build/content dependency tree; no visitor-facing YAML parser exists in this deployment. Untrusted build content would require renewed assessment. |
| smol-toml | 1.7.0 | 1.8.0 | Malformed TOML can hang its parser. It is a build/content dependency, with no tracked TOML input or public parsing service found. |
| postcss | 8.5.16 | 8.5.28 | Attacker-influenced CSS source-map references can cause local file reads/disclosure under the advisory's conditions. Used through Vite during the build; no public CSS processing service or application-level `sourceMappingURL` input path was found. |
| nanoid | 3.3.15 | 3.3.19 | Invalid generator sizes can cause infinite loops. It is reached through PostCSS; no application-level call accepting a visitor-supplied size was found. |
| svgo | 4.0.1 | 4.1.0 | Script-removal bypasses matter when an application relies on the opt-in removal plugin for untrusted SVGs and serves the result in an executable context. No such pipeline was found. SVGO must not be treated as a comprehensive sanitizer, including after this update. |

`@playwright/test` remains at 1.61.1. The project did not add vulnerable transitive packages as new direct dependencies, introduce overrides, switch Astro major versions, or use `npm audit fix --force`. `package.json` now sets the verified Astro floor to `^7.3.3`, and `package-lock.json` fixes the resolved tree.

## Durable controls

- **Deployment is blocked on high/critical dependency findings**, including build and test dependencies. The lockfile audit runs before `npm ci` can execute package lifecycle scripts. An audit service/error failure also stops the build rather than silently accepting it.
- The localization workflow uses the same pre-install audit gate.
- Normal build/test jobs have only `contents: read` and do not persist checkout credentials. Pages write/OIDC permissions are confined to the deployment job; commit-status write permissions are confined to separate reporting jobs.
- `.github/workflows/dependency-security.yml` audits on dependency changes, manual dispatch and weekly. Weekly checks detect newly published advisories even when the lockfile has not changed; they do not auto-upgrade or auto-commit packages.
- `npm run audit:security` provides the same full-lockfile high/critical gate for local work. Lower-severity findings remain visible for review; none were present in the verified snapshot.
- The one-time write-enabled repair workflow was removed after committing the verified patch.

These controls reduce known dependency exposure and credential privileges. They are not a guarantee against supply-chain compromise; build output still depends on the packages that are deliberately installed.

## Known unrelated test failure

`npm run test:blog-template` has **two pre-existing failures**. The test writes an English-only temporary `template-contract.md`, but the sitemap requires its localized counterpart, first failing at `src/content/blog/ko/template-contract.md`.

The same two failures and missing-source cause were reproduced with the original Astro 7.0.4 lockfile and with the patched dependency tree. The baseline comparison is evidence of an existing fixture/locale-contract mismatch, **not a passing blog-template test**. Its assertions and the production sitemap were not weakened or rewritten to make this security change pass. The cleanup rebuild and clean production build succeed. Repairing that test's complete locale fixtures remains a separate test-maintenance task.

## Updating safely

Start from a clean `main` and pull the latest changes. Review the actual dependency path and advisory conditions. Prefer compatible upstream fixes; update the manifest floor when necessary and commit the generated lockfile together. Run the full audit, clean installation, localization/build checks and affected browser tests before pushing. Do not omit development packages to conceal build-tool warnings, suppress findings as a substitute for fixes, or deploy a major upgrade without compatibility testing.

Reassess reachability before introducing server rendering, uploads, remote-image optimization, untrusted SVG processing, or externally authored YAML/TOML/CSS. Keep development/preview servers on loopback unless deliberately secured. Do not execute untrusted contributor code with deployment or write credentials.

## Advisory references

The following are selected primary advisories behind the assessment, not a claim that every advisory is independently reachable here:

- [Astro AVIF remote code execution — GHSA-26w7-cxv4-gfx2](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2): upstream fix Astro 7.2.8 requiring Sharp 0.35.4; this patch uses the later verified Astro 7.3.3.
- [Sharp inherited decoder vulnerabilities — GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj).
- [js-yaml empty merge-source CPU exhaustion — GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh).
- [smol-toml malformed-document denial of service — GHSA-7w5x-hrqm-74c2](https://github.com/advisories/GHSA-7w5x-hrqm-74c2).
- [PostCSS source-map path disclosure — GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp).
- [Nano ID invalid-size denial of service — GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv).
- [SVGO script-removal bypass — GHSA-w27v-7q3p-w38r](https://github.com/advisories/GHSA-w27v-7q3p-w38r).
