# Architecture and decisions

## Scope
Phase 1 + minimal Phase 2. Fully prerendered Japanese site, no adapter/server/API/authentication/database. GitHub Pages serves `dist/`. No third-party runtime services, fonts, analytics or CDNs. Images are local SVG assets. Core reading and answer disclosures work without JavaScript; menu, theme and font enhancements use small browser scripts.

## Data boundaries
- Curriculum: `src/data/curriculum.json`, 26 chapters / 130 stable topic IDs. Prerequisites are a directed acyclic graph; related links may be cyclic. `order` defines display sequence independently from prerequisites.
- Lesson body: trusted MDX in `src/content/lessons`, loaded by Content Collections. Zod schema is shared by collection and standalone validation. `generateId` uses metadata ID, not mutable title.
- Questions: separate `src/data/questions.json`, validated by a Zod discriminated union in Phase 1 with manually disclosed answers. Phase 3 extends the schema and adds scoring. Types: choice, exact-fill, correction, ordering, translation-to-Japanese, translation-to-English, structure. Only unambiguous formats receive automatic grading. Free translations remain self/teacher-evaluated; exact-string grading must never masquerade as semantic grading.
- Learning history: absent in Phase 1. Phase 4 will use `ega:learning` with `schemaVersion`, topic-ID keyed records, per-question attempts and timestamps. Validate unknown input, migrate supported old versions, reject future versions without overwriting, back up corrupt data before reset, and surface recovery errors. JSON import must validate size, shape and IDs before any write. No external transmission.
- Display preferences: only `ega:theme` (`light`/`dark`) and `ega:font` (`normal`/`large`). A closed string vocabulary is validated on read. Try/catch protects denied/quota-limited storage. These are not learner history.

## Publication boundary (decision 01)
Accuracy overrides having three samples visible on the public site. All generated samples are `in-review`. Public build exposes **zero** sample lesson routes until a human reviews them. Local `REVIEW_PREVIEW=1` explicitly exposes unreviewed content with a banner and noindex; no sitemap is created. `npm run build` fails if a preview artifact is accidentally present. Both build commands clean the generated dist first, preventing stale sitemap or lesson artifacts when switching modes. CI reconstructs the public dist after E2E and uploads only that output.

`getLessons()` is the only UI entry point to lesson collections. It applies `isVisible` before cards, routes, prerequisite links, related links and previous/next navigation. Known unpublished relationships are retained in source but filtered out in UI. Standalone validation catches unknown IDs, cycles, metadata drift and explicit unpublished source links. Built-output verification checks every internal href/src, language, canonical, preview leakage and sample route exclusion. Search is not yet installed: future Pagefind must run **after public route filtering**, index lesson bodies only, include chapter/level metadata, and be audited for unreviewed content.

A schema can require review metadata but cannot prove a human performed a review. Maintainer process and PR evidence enforce that boundary. Public GitHub source contains the drafts; `noindex` is also no access-control mechanism. Do not put confidential drafts in this repository.

## Versions and dependencies (decision 02)
Exact versions and package-lock, installed via npm ci. As implemented: Astro 7.4.2, MDX 8.1.1, Tailwind 4.3.3, Zod 4.6.7, TypeScript 6.0.3. TypeScript 7 is currently outside @astrojs/check 0.9.12's declared peer range, so 6.0.3 is intentionally selected. Node 24.19.0 / npm 11. React, Pagefind and KaTeX are deferred until used, to avoid needless dependencies and download costs. YAML is a direct development dependency for reproducible frontmatter validation rather than relying on transitive imports.

## Static paths and SEO (decision 03)
Owner/repository from `GITHUB_REPOSITORY`; overridable `SITE_URL` and `BASE_PATH`. Default local base `/grammer`. `href()` handles root and subpath consistently. Static build-time robots endpoint is not a server API. `@astrojs/sitemap` discovers only generated public routes. Layout sets lang=ja, unique title/description, canonical, local icon, OG URL/description/image. SVG OGP is supplied as a local initial asset; some social platforms need a raster image, to be added before promotional launch. No current share-card compatibility guarantee.

## UI/accessibility (decision 04)
Editorial atlas: warm off-white, forest green, restrained serif headings, readable Japanese body with system fonts. Header, chapter rail, cards and lesson figures are shared. Desktop rail and page TOC; native details navigation on small screens. Responsive layout, skip link, visible focus, logical landmarks/headings, reduced-motion preferences, theme and font controls with aria-pressed. S/V/O/C/M are textual labels and underline patterns, not color-only coding. `SentenceStructure` accepts author-labelled parts. `ClauseStructure` describes explicit clause scopes, modifier/antecedent relations and omitted elements; no NLP inference is performed. Complex recursive trees and a knowledge graph are deferred.

Target WCAG 2.2 AA; keyboard/mobile smoke tests do not constitute a full conformance audit. Mobile E2E currently emulates Chromium at an iPhone viewport, not actual iOS WebKit.

## CI/CD and security (decision 05)
PR/push CI: install, Astro diagnostics, content validation, unit tests, review build, Chromium desktop/mobile E2E against an explicitly IPv4-bound local server, then clean public build and output validation. `main` deploy depends on check job. CI contents:read, no secrets in PR; deploy job alone adds pages:write and id-token:write, environment github-pages. Actions are pinned to verified full commit SHAs (release major noted in comments); npm dependencies are exact with lockfile. Future updates must refresh reviewed SHAs and lockfile together. No `pull_request_target` and no untrusted input interpolated into shell scripts. Pages settings are owner-controlled and must not be changed without confirmation.

## Official references checked during implementation
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro TypeScript](https://docs.astro.build/en/guides/typescript/)
- [Astro MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Astro GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Astro sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Tailwind Astro Vite integration](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [Zod basic usage](https://zod.dev/basics)
- [Vitest guide](https://vitest.dev/guide/)
- [Playwright installation](https://playwright.dev/docs/intro)
- [YAML](https://eemeli.org/yaml/)

Commands and package metadata were also inspected locally to verify actual compatibility. Documentation URLs alone are not evidence that a build passed; see `docs/verification.md` for executed checks.
