# Contributing

Use Node.js 24 and npm 11. From a fresh clone:

```sh
npm ci
npm run check
npm run build
```

No credentials or environment file are required. `npm run check` runs ESLint,
TypeScript and the regression suite with coverage thresholds. CI also
builds the production site, checks its routes, audits dependencies, and builds
and smoke-tests the Docker image.

For changes to customer journeys, run the browser suite as well:

```sh
npx playwright install chromium firefox
npm run test:e2e
```

Use `tests/e2e` for browser journeys and keep them independent of Vitest. Prefer
role/label selectors and Playwright's waiting assertions. Do not add fixed
sleeps or hide application errors. Browser reports and failure diagnostics are
available through `npm run test:e2e:report` and CI's `browser-reports` artifact.

For a behavior change, add a regression test that fails before the fix and
passes after it. Keep the behavior and its tests in the same focused commit or
pull request. Describe the customer-visible problem and the checks you ran.
Keep generated coverage, local credentials and build output out of Git.

Business code belongs in `src/components/site`, `src/lib`, and `src/data`.
Components in `src/components/ui` are shared shadcn primitives; avoid unrelated
rewrites. Catalogue prices belong in `src/data/products.ts`; update the price
date along with rates.

Coverage includes public pages, site components, domain modules, viewport
detection and exercised UI primitives. The README lists the overall, quote and
per-page gates. It does not measure every unused primitive or browser layout.
Keep page tests in `tests/pages`, outside the Next route directory. Review
visual changes at mobile and desktop widths; automated browser journeys do not
replace visual review.

Preserve genuine authorship and development history. Do not manufacture old
commits, collaborators or changes to increase a repository assessment score.
