import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight, Mail, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/site";

const nav = [
  ["/products", "Products"],
  ["/services", "Services"],
  ["/about", "About"],
  ["/projects", "Projects"],
  ["/fleet", "Fleet"],
  ["/contact", "Contact"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="Supreme Energy home">
            <img src="/favicon.png" alt="" className="size-11 shrink-0 object-contain" />
            <span className="font-display text-xl uppercase leading-none text-primary sm:text-2xl">
              Supreme Energy
            </span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {nav.map(([to, label]) => (
              <Link
                key={to}
                href={to}
                className={
                  router.pathname === to
                    ? "text-xs font-bold uppercase tracking-[.12em] text-accent transition-colors hover:text-accent"
                    : "text-xs font-bold uppercase tracking-[.12em] text-foreground transition-colors hover:text-accent"
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Button asChild variant="flame">
              <Link href="/quote">
                Get instant quote <ArrowRight />
              </Link>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav className="border-t border-border bg-background px-5 py-5 lg:hidden">
            {nav.map(([to, label]) => (
              <Link
                key={to}
                href={to}
                onClick={() => setOpen(false)}
                className="block border-b border-border py-3 text-sm font-bold uppercase tracking-[.12em]"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main id="main">{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-[1.3fr_.7fr_.8fr] lg:px-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Supreme Energy home"
            >
              <img
                src="/favicon.png"
                alt=""
                className="size-14 shrink-0 object-contain"
              />
              <span className="font-display text-2xl uppercase leading-none text-primary-foreground">
                Supreme Energy
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/70">
              Reliable petroleum products, metered delivery, engineering and logistics
              support—built around safety, transparency and client satisfaction.
            </p>
          </div>
          <div>
            <p className="eyebrow text-accent">Navigate</p>
            <div className="mt-4 grid gap-2">
              {nav.map(([to, label]) => (
                <Link
                  key={to}
                  href={to}
                  className="text-sm text-primary-foreground/75 hover:text-primary-foreground"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow text-accent">Head office</p>
            <p className="mt-4 text-sm leading-6 text-primary-foreground/75">
              {company.address}
            </p>
            <a
              className="mt-4 flex items-center gap-2 text-sm"
              href={`tel:${company.phoneHref}`}
            >
              <Phone className="size-4 text-accent" />
              {company.phone}
            </a>
            <a
              className="mt-2 flex items-center gap-2 text-sm"
              href={`mailto:${company.email}`}
            >
              <Mail className="size-4 text-accent" />
              {company.email}
            </a>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15 px-5 py-5 text-center text-xs text-primary-foreground/60">
          © 2026 Supreme Energy · RC {company.rc} · {company.tagline} ·{" "}
          <Link href="/privacy" className="hover:text-primary-foreground">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:text-primary-foreground">
            Terms
          </Link>
        </div>
      </footer>
      <a
        href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
          "Hello Supreme Energy, I would like to request a quote.",
        )}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-success text-success-foreground shadow-xl transition-transform hover:scale-105"
        aria-label="Chat with Supreme Energy on WhatsApp"
      >
        <Phone className="size-5" />
      </a>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  text,
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  if (!image)
    return (
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <p className="eyebrow text-accent">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[.96] sm:text-6xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-primary-foreground/70 lg:text-lg">
            {text}
          </p>
          {children}
        </div>
      </section>
    );
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <img
        src={image}
        alt={imageAlt ?? ""}
        className="image-breathe absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/75 to-primary/25" />
      <div className="relative mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-32">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[.96] sm:text-6xl lg:text-8xl">
          {title}
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-primary-foreground/70 lg:text-lg">
          {text}
        </p>
        {children}
      </div>
    </section>
  );
}

export const Meta = {
  home: {
    title: "Supreme Energy | Petroleum Products & Delivery",
    description:
      "Buy diesel, petrol, LPG and petroleum products with reliable metered delivery across Lagos and Nigeria.",
  },
  about: {
    title: "About Supreme Energy | Lagos, Nigeria",
    description:
      "Meet Supreme Energy, RC 7982142—a safety-focused petroleum supply, engineering and logistics company in Lagos.",
  },
  contact: {
    title: "Contact & Instant Quote | Supreme Energy",
    description:
      "Request a petroleum product quote, metered delivery or technical service from Supreme Energy in Lagos.",
  },
  products: {
    title: "Petroleum Products & Prices | Supreme Energy",
    description:
      "Current PMS, AGO, LPG, LPFO and Naphtha prices, specifications and bulk delivery quotes in Nigeria.",
  },
  services: {
    title: "Oil, Gas & Engineering Services | Supreme Energy",
    description:
      "Engineering, fabrication, NDT inspection, scaffolding, logistics, procurement, ICT and HSE services in Nigeria.",
  },
  fleet: {
    title: "Peddler Truck Fuel Delivery | Supreme Energy",
    description:
      "Meter-equipped peddler trucks, multi-drop fuel delivery, tankers, lifting and marine logistics across Nigeria.",
  },
  projects: {
    title: "Projects & Clients | Supreme Energy",
    description:
      "Supreme Energy experience supporting petroleum, engineering and logistics work across Nigeria's energy industry.",
  },
  privacy: {
    title: "Privacy Policy | Supreme Energy",
    description: "How Supreme Energy handles information submitted through its website.",
  },
  terms: {
    title: "Terms of Use | Supreme Energy",
    description:
      "Terms governing Supreme Energy website prices, quotes and information.",
  },
  quote: {
    title: "Instant Petroleum Quote | Supreme Energy",
    description:
      "Build and download a branded Supreme Energy estimate — petroleum products, quantities, destination and live pricing.",
  },
};
