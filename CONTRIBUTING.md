# Contributing

Use Node.js 24 and npm 11. From a fresh clone:

```sh
npm ci
npm run check
npm run build
```

No credentials or environment file are required. `npm run check` runs ESLint,
TypeScript and the quote regression suite with coverage thresholds. CI also
builds the production site, checks its routes, audits dependencies, and builds
and smoke-tests the Docker image.

For a behavior change, add a regression test that fails before the fix and
passes after it. Keep the behavior and its tests in the same focused commit or
pull request. Describe the customer-visible problem and the checks you ran.
Keep generated coverage, local credentials and build output out of Git.

Business code belongs in `src/components/site`, `src/lib`, and `src/data`.
Components in `src/components/ui` are shared shadcn primitives; avoid unrelated
rewrites. Catalogue prices belong in `src/data/products.ts`; update the price
date along with rates.

The current automated coverage scope is the quote schema, total calculation,
form and PDF generation. It does not measure all page layouts or vendored UI
primitives. Review visual changes in a browser at mobile and desktop widths.

Preserve genuine authorship and development history. Do not manufacture old
commits, collaborators or changes to increase a repository assessment score.
