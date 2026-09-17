# Supreme Energy

Corporate website for **Supreme Energy (RC 7982142)** — a petroleum products,
engineering and logistics company based in Lagos, Nigeria.

The site focuses on **petroleum product supply & meter-dispensing peddler
truck delivery**, backed by a full range of oil & gas, engineering,
logistics, fabrication, inspection, construction and ICT services.

Tagline: _"…your satisfaction is our priority"_

---

## Tech Stack

| Layer      | Choice                                     |
| ---------- | ------------------------------------------ |
| Framework  | **Next.js 15 (Pages Router)**              |
| Language   | TypeScript 5                               |
| Styling    | Tailwind CSS 4 + `@tailwindcss/postcss`    |
| UI Kit     | shadcn/ui components (Radix primitives)    |
| Icons      | Lucide React                               |
| Forms      | React Hook Form + Zod (reserved)           |
| PDFs       | jsPDF                                      |
| Charts     | Recharts                                   |
| Lint/Format| ESLint + Prettier                          |

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

- **Node.js 20.10+** (or any LTS compatible with Next 15 / React 19).
- **npm** (recommended; pnpm and yarn also work).

### 2. Install

```bash
npm install
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

### 5. Lint / format

```bash
npm run lint
npm run format
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values as needed. At the
moment the site generates PDF quotes **client-side** (no server e-mail
delivery), so no environment variables are required for local development.

If you later wire the contact form to an e-mail provider (Resend, SendGrid,
Nodemailer), add the relevant keys here.

```
# Example
NEXT_PUBLIC_SITE_URL=http://localhost:3000
COMPANY_EMAIL=info@supreme-energy.com.ng
COMPANY_PHONE=+2349024876164
```

---

## Updating Product Prices

All petroleum product data lives in a single file for easy edits:

👉 **[src/data/products.ts](src/data/products.ts)**

Each entry contains:

| Field         | Purpose                                            |
| ------------- | -------------------------------------------------- |
| `id`          | Stable id, used in query strings (`?product=ago`)  |
| `shortName`   | Display code (PMS, AGO, LPG…)                      |
| `name`        | Full English product name                          |
| `price`       | Current unit price in **₦ NGN**                    |
| `unit`        | `"litre"` or `"kg"`                                |
| `density`     | Reference density range (static)                   |
| `flashPoint`  | Reference flash-point range (static)               |
| `note`        | Short sales description                            |

**Update the date** in `PRICE_LAST_UPDATED` whenever prices change — this
string is printed on the home page, products page and the generated PDF
quotes.

```ts
export const PRICE_LAST_UPDATED = "15 September 2026, 6:00 PM WAT";
```

---

## Quote Form & PDF Generation

The `/contact` page ships with a **Quote builder** (`QuoteForm.tsx`):

1. Visitor picks product(s), quantities, state, city, contact details.
2. Estimated total updates live.
3. On submit → a branded `Supreme-Energy-Quote-<timestamp>.pdf` downloads.
4. The PDF includes the price list date, validity (48 h), density / flash
   point per line and the company contact block.

Until an e-mail sender is configured, the on-screen copy reads:
> _"Email delivery is activated after Supreme Energy's sender domain is
> verified…"_

To enable real e-mail delivery, swap the `submit()` handler in
[QuoteForm.tsx](src/components/site/QuoteForm.tsx) to call an API route
(e.g. `/pages/api/send-quote.ts`) that uses Resend / Nodemailer.

---

## Updating Company Info

Edit [src/lib/site.ts](src/lib/site.ts):

- `company` — name, RC number, address, phone, e-mail, WhatsApp number.
- `services` — cards rendered on `/services` and on the homepage grid.

Update [src/lib/images.ts](src/lib/images.ts) to replace the stock AI-image
URLs with your own hosted images (CDN, S3, or anything reachable over
`https://`). Then swap the imported strings in the page files.

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

