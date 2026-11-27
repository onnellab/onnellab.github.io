# Search discovery deployment contract

Canonical host: https://onnellab.com/. The content engine owns the broader SEO/GEO and manual provider workflow: https://github.com/onnellab/onnel-content-engine/blob/main/docs/Search_Discovery_Runbook.md.

- A public IndexNow ownership verification text file is produced inside the static build from the repository Actions secret INDEXNOW_KEY (32 lowercase hex characters). No external API credential is needed, no key is logged or committed. The verification file is intentionally public at its required URL.
- The deploy workflow records a manifest of eligible canonical sitemap HTML with semantic content digests and excludes noncanonical/noindex pages. The sitemap excludes OAuth callbacks, which remain accessible with noindex; do not change authorization handling.
- The independent post-deploy job runs only after successful main build/deployment. It checks the live sitemap, ownership file, robots and changed live pages against their build-bound digests, then notifies the official IndexNow endpoint in bounded batches. Confirmed removed URLs (404/410) may be notified. It never submits private, query/token or noncanonical URLs. HTTP 200/202 is notification acceptance (202 may await verification), not indexing. A rejected submission or rate limit stops the current notification run; the accepted state survives partial failure.
- The accepted-state artifact is restored on subsequent deployments (90-day retention; if all artifacts have expired, the next deployment bootstraps the eligible public URLs once). It is not a ranking or conversion report. Keep the current Pages and Ops status gates independent from discovery errors; inspect the discovery job/artifact and retry only after a resolved blocker or later deployment.
- Weekly audit is read-only, checks robots policy, sitemap, live canonical sample and ownership file. It does not submit unchanged pages or alter tracker configuration.
- Brave Search manual submission is separate: https://search.brave.com/submit-url ; no unsupported API, CAPTCHA bypass or inferred success. Google/Bing/Naver sitemap ownership and search impressions need verified console access.
- Local isolated tests: python3 scripts/test-search-discovery.py. Full build/Playwright and live verification run in the existing deployment workflows.

Official IndexNow reference: https://www.indexnow.org/documentation
