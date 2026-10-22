# English Grammar Atlas — Agent Instructions

## Purpose and priority
Build a free, fully static Japanese high-school English grammar learning platform. Prioritize grammar accuracy and coverage, clarity, accessibility, maintainability, then speed. The Phase 1 scope is infrastructure and minimal lesson browsing. Never claim unfinished features work.

## Stack
Astro static output, strict TypeScript, MDX, Content Collections, Zod, Tailwind CSS via Vite, npm, Vitest, Playwright, GitHub Actions/Pages. Add React islands only for complex interactions. Pagefind and KaTeX are future additions when a feature needs them. Consult official docs and verify peer compatibility before changing pinned versions. Use Node from `.nvmrc` and `npm ci`.

## Directories
- `src/content/lessons`: authored MDX; filename must equal immutable ID.
- `src/data/curriculum.json`: canonical chapter/topic metadata and dependency graph.
- `src/lib`: schemas, publication policy, paths, content queries.
- `src/components`, `src/layouts`: shared accessible presentation.
- `src/pages`: static routes, robots endpoint (build-time only).
- `scripts`: content and built-output integrity checks.
- `tests/unit`, `tests/e2e`: invariants and user journeys.
- `docs`: architecture, curriculum, content policy, roadmap.

## Naming and TypeScript
IDs are `ega-CC-UU`, where chapter and originally allocated unit number have two digits. Never rename/reuse an allocated ID; `order` determines presentation order independently. Components use PascalCase; other modules use descriptive kebab-case or existing project conventions. Require strict mode and no unchecked indexed access. Avoid `any`, unsafe casts, ignored diagnostics, non-null assertions without a proven invariant, and duplicate metadata sources. Model external data as unknown; validate with Zod before use.

## Content rules
Write original examples/questions in clear Japanese. Distinguish grammatical errors, pragmatic oddness, register, dialect, and alternative analyses. Explain conditions, not just rules. Include goals, prerequisites, definitions, principles, structures, translations, comparisons, errors, extensions, questions, explanations, summary, and relevant links as appropriate. Do not copy exam/commercial materials. MDX is trusted executable source: contributors must be reviewed; never import untrusted user MDX. No script tags, raw HTML injection, analytics, or external embeds in lessons.

AI-created content remains `draft` or `in-review`. Only a human may authorize `reviewed`; record reviewer, ISO date, and `method: human`. Metadata is evidence of a review assertion, not automatic proof of real review. Do not invent a reviewer or backdate a review. Publication uses the central filter, including routes, pagination and references. Preview is noindex and must not deploy. Unknown or unreviewed references are hidden in public UI; graph validation still checks IDs. Respect content and code license policies separately.

## Verification commands
- `npm ci`: exact lockfile installation.
- `npm run check`: Astro/TypeScript diagnostics.
- `npm run validate:content`: schemas, curriculum integrity and prerequisite cycles.
- `npm test`: unit invariants.
- `npm run build`: reviewed-only static output plus link/publication verification.
- `npm run dev:review`: local preview including unreviewed samples.
- `npm run build:review`: local-only review output; never deploy this dist.
- `npx playwright install --with-deps chromium` then `npm run test:e2e`: CI/local browser journeys.
- `npm run verify`: core checks, tests, public build.

## Git workflow
Read existing code first. Use a focused `feat/…`, `fix/…`, or `docs/…` branch and a reviewable PR. Never force-push, delete unrelated files, or commit generated output, credentials, runtime storage, or node_modules. Preserve user changes. Record important decisions in architecture docs. Do not enable Pages, alter permissions/settings, merge or publish without the user's authorization. Initial empty-repository bootstrapping may need a first commit before a PR can exist; do not invent existing history. No automatic agent delegation is required.

## Security and prohibitions
No backend, auth, external DB or paid API in Phase 1. No secrets or personal learner samples. Browser preferences stay local. Future learning records need schema validation/versioning/recovery before UI use. Use `href()` for internal paths, no root-relative `/lessons/` assumptions. Pin dependencies and commit the lockfile. CI gets read-only contents; only a gated deploy job gets Pages/OIDC writes. Never run untrusted PR code with privileged `pull_request_target`. Do not mark AI content reviewed, publish previews, add misleading feature controls, or report checks that were not run.
