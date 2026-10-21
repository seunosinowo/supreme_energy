# Supreme Energy

[![CI](https://github.com/seunosinowo/supreme_energy/actions/workflows/ci.yml/badge.svg)](https://github.com/seunosinowo/supreme_energy/actions/workflows/ci.yml)

Corporate website for **Supreme Energy (RC 7982142)** — a petroleum products,
engineering and logistics company based in Lagos, Nigeria.

The site focuses on **petroleum product supply & meter-dispensing peddler
truck delivery**, backed by a full range of oil & gas, engineering,
logistics, fabrication, inspection, construction and ICT services.

Tagline: _"…your satisfaction is our priority"_

---

## Tech Stack

| Layer       | Choice                                  |
| ----------- | --------------------------------------- |
| Framework   | **Next.js 16 (Pages Router)**           |
| Language    | TypeScript 5                            |
| Styling     | Tailwind CSS 4 + `@tailwindcss/postcss` |
| UI Kit      | shadcn/ui components (Radix primitives) |
| Icons       | Lucide React                            |
| Forms       | Zod quote validation                    |
| PDFs        | jsPDF                                   |
| Charts      | Recharts                                |
| Lint/Format | ESLint + Prettier                       |

### Project Layout (standard Pages Router)

```
src/
├── components/
│   ├── site/        # Domain components (SiteShell, ProductCard, QuoteForm)
│   └── ui/          # Reusable shadcn/ui primitives (button, card, input…)
├── data/
│   └── products.ts  # Product prices, density, flash point, last-updated date
├── hooks/
│   └── use-mobile.tsx
├── lib/
│   ├── site.ts      # Company info, services list
│   ├── images.ts    # Hero / section image URLs
│   └── utils.ts     # cn() and shared helpers
├── pages/
│   ├── _app.tsx     # Global layout + CSS
│   ├── _document.tsx# <html>, fonts, favicon
│   ├── _error.tsx   # 404 / not-found page
│   ├── index.tsx    # Home
│   ├── products.tsx # Petroleum products & prices
│   ├── services.tsx # Services overview
│   ├── about.tsx    # Company profile
│   ├── projects.tsx # Experience & clients
│   ├── fleet.tsx    # Fleet / peddler truck delivery
│   ├── contact.tsx  # Contact + instant quote form
│   ├── privacy.tsx  # Privacy policy
│   └── terms.tsx    # Terms of use
└── styles.css       # Tailwind entry + design tokens (theme, colors, fonts)
```

---

## Getting Started

### 1. Prerequisites

- **Node.js 24 LTS** (see `.nvmrc`).
- **npm 11**, using the committed `package-lock.json`.

### 2. Install

```bash
npm ci
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

The build output goes into the standard Next `.next/` folder.

### 5. Verify changes

```bash
npm run check          # lint, typecheck and regression tests with coverage
npm run test           # run once
npm run test:watch     # interactive watch mode
npm run test:coverage  # coverage and enforced thresholds
npm run audit         # fails on high/critical dependency advisories
npm run format        # format source
```

Tests cover quote validation, catalogue totals, form interactions, download
failures, actual PDF output and multi-page quotes. Coverage thresholds apply
to the quote schema, total calculator, form and PDF module: 90% statements,
90% lines, 90% functions and 80% branches. They do not represent whole-site
coverage. GitHub Actions runs these checks on pushes and pull requests, builds
and smoke-tests the production routes, audits dependencies and verifies Docker.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

---

## Environment Variables

No environment variables or credentials are needed to install, test, build or
run this site. Company details live in `src/lib/site.ts`.

If future integrations need credentials, put them in `.env.local`. Git and
Docker exclude `.env*` files except the public `.env.example`. Never put
secrets in `NEXT_PUBLIC_*` variables, which are visible to browsers.
See [SECURITY.md](SECURITY.md) for reporting and credential handling.

---

## Updating Product Prices

All petroleum product data lives in a single file for easy edits:

👉 **[src/data/products.ts](src/data/products.ts)**

Each entry contains:

| Field        | Purpose                                           |
| ------------ | ------------------------------------------------- |
| `id`         | Stable id, used in query strings (`?product=ago`) |
| `shortName`  | Display code (PMS, AGO, LPG…)                     |
| `name`       | Full English product name                         |
| `price`      | Current unit price in **₦ NGN**                   |
| `unit`       | `"litre"` or `"kg"`                               |
| `density`    | Reference density range (static)                  |
| `flashPoint` | Reference flash-point range (static)              |
| `note`       | Short sales description                           |

**Update the date** in `PRICE_LAST_UPDATED` whenever prices change — this
string is printed on the home page, products page and the generated PDF
quotes.

```ts
export const PRICE_LAST_UPDATED = "15 September 2026, 6:00 PM WAT";
```

---

## Quote Form & PDF Generation

The `/contact` and `/quote` pages provide a local PDF estimate builder:

1. Choose products, quantities, destination and contact details.
2. Zod validates required fields, email, phone, catalogue IDs and finite positive quantities.
3. Download a branded PDF with catalogue prices, a 48-hour validity note,
   product specifications, delivery notes and contact details.
4. Email the PDF to the company or call to confirm supply and delivery terms.

The form does not send email, call an API, queue requests or store customer
details. PDF failures show a retryable error. A quote supports up to 50 lines
and 10,000,000 units per line; fractional quantities are supported. Long quotes
flow onto additional pages. Delivery fees are confirmed separately.

Validation and totals live in [src/lib/quote.ts](src/lib/quote.ts). PDF layout
and downloading live in [src/lib/pdf/buildQuoteDoc.ts](src/lib/pdf/buildQuoteDoc.ts).
The UI lives in [QuoteForm.tsx](src/components/site/QuoteForm.tsx).

---

## Updating Company Info

Edit [src/lib/site.ts](src/lib/site.ts):

- `company` — name, RC number, address, phone, e-mail, WhatsApp number.
- `services` — cards rendered on `/services` and on the homepage grid.

Images are served locally from `public/` using `next/image`. Update the paths
in [src/lib/images.ts](src/lib/images.ts) when replacing assets. Google Fonts
are fetched by the browser; the production build does not require font downloads.

---

## Design System

- **Colors** — Deep navy primary (`--primary`) + flame orange accent
  (`--accent`) on a near-white background. All tokens are defined in
  [src/styles.css](src/styles.css) as CSS custom properties inside `@theme`.
- **Typography** — `Manrope` for body, `Barlow Condensed` for display
  (heroes, prices, service numbers).
- **Animations** — Hero uses a curtain-unveil + fade-rise combo; section
  images have a slow `image-breathe` zoom-in. A `prefers-reduced-motion`
  guard disables animations globally for users who opt out.
- **Components** — All UI primitives in [src/components/ui](src/components/ui)
  follow shadcn conventions (Radix + Tailwind). Re-use them instead of
  introducing new libraries.

---

## SEO

Every page sets `<title>` + `description` + Open Graph tags via `next/head`:
see the `Meta` export in
[SiteShell.tsx](src/components/site/SiteShell.tsx).

The homepage additionally injects a JSON-LD `Organization` schema block for
search engines.

---

## Deployment

The project is a standard Next.js app — deploy it anywhere that runs Node:

- **Vercel** (recommended): `vercel deploy` — zero config for Pages Router.
- **Self-hosted / any Node host**: `npm run build && npm start`.
- **Docker**: the included Node 24 multi-stage image runs quality checks,
  builds standalone output and serves it as a non-root user:

```bash
docker build -t supreme-energy .
docker run --rm -p 3000:3000 supreme-energy
```

Open [http://localhost:3000](http://localhost:3000). The container includes a
health check. Private environment files, Git history and local build artifacts
are excluded from the build context. No external database or email service is
required. Dependency installation still requires access to the npm registry.

---

## License & Contact

Company website — © Supreme Energy.

- Head office: 45, Imam Dauda Street, Off Eric Moore Road, Surulere, Lagos
- Phone / WhatsApp: +234 902 487 6164
- E-mail: info@supreme-energy.com.ng
- RC: 7982142
