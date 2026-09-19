import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Gauge, MapPin, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { SiteShell, Meta } from "@/components/site/SiteShell";
import { PRICE_LAST_UPDATED, products } from "@/data/products";
import { services } from "@/lib/site";
import { images } from "@/lib/images";

const heroSlides = [
  {
    src: images.stationEvening,
    alt: "Supreme Energy filling station in Lagos at dusk",
    title: ["ENERGY.", "PRECISELY DELIVERED."],
    text: "Transparent petroleum pricing and safe, meter-dispensed delivery right where your operation needs it.",
    cta: { href: "/quote", label: "Get instant quote" },
  },
  {
    src: images.g8g,
    alt: "Supreme Energy petroleum storage and distribution facility",
    title: ["BULK STORAGE.", "READY TO MOVE."],
    text: "Dependable downstream storage and distribution capacity for consistent product availability across Lagos and Nigeria.",
    cta: { href: "/quote", label: "Get instant quote" },
  },
  {
    src: images.loadingGantry,
    alt: "Supreme Energy tanker at a petroleum loading gantry",
    title: ["LOADED.", "METERED. DELIVERED."],
    text: "Meter-equipped tankers and peddler trucks move verified volumes to your site, depot, station or construction point.",
    cta: { href: "/quote", label: "Get instant quote" },
  },
];

const deliveryFeatures = [
  { icon: Gauge, title: "Metered", text: "Transparent volume" },
  { icon: MapPin, title: "Multi-drop", text: "Points A, B & C" },
  { icon: ShieldCheck, title: "Controlled", text: "Safety-led handling" },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Supreme Energy",
  identifier: "RC 7982142",
  email: "info@supreme-energy.com.ng",
  telephone: "+2349024876164",
  address: {
    "@type": "PostalAddress",
    streetAddress: "45, Imam Dauda Street, Off Eric Moore Road",
    addressLocality: "Surulere",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
};

export default function Home() {
  const fleet = images.fleetRoad;
  const gantry = images.loadingGantry;
  const [slide, setSlide] = useState(0);
  const total = heroSlides.length;

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  const prev = () => setSlide((s) => (s - 1 + total) % total);
  const next = () => setSlide((s) => (s + 1) % total);

  return (
    <SiteShell>
      <Head>
        <title>{Meta.home.title}</title>
        <meta name="description" content={Meta.home.description} />
        <meta property="og:title" content={Meta.home.title} />
        <meta property="og:description" content={Meta.home.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <section
        className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-primary text-primary-foreground"
        aria-roledescription="carousel"
        aria-label="Supreme Energy hero slideshow"
      >
        <div className="absolute inset-0">
          {heroSlides.map((s, i) => (
            <div
              key={s.src}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                i === slide ? "hero-slide-active" : "hero-slide-inactive"
              }`}
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${total}`}
              aria-hidden={i !== slide}
            >
              <img
                src={s.src}
                alt={s.alt}
                className={`absolute inset-0 size-full object-cover ${
                  i === slide ? "lg:image-breathe" : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
            </div>
          ))}
        </div>
        <div className="hero-curtain absolute inset-y-0 left-0 z-20 hidden w-1/4 bg-primary lg:block" />
        <div className="hero-curtain absolute inset-y-0 left-1/4 z-20 hidden w-1/4 bg-primary lg:block [animation-delay:.12s]" />
        <div className="hero-curtain absolute inset-y-0 left-2/4 z-20 hidden w-1/4 bg-primary lg:block [animation-delay:.24s]" />
        <div className="hero-curtain absolute inset-y-0 left-3/4 z-20 hidden w-1/4 bg-primary lg:block [animation-delay:.36s]" />
        <div className="relative z-30 mx-auto min-h-[calc(100svh-5rem)] max-w-[1440px] px-5 py-24 sm:px-10 lg:px-10 lg:py-32 lg:hero-rise">
          {heroSlides.map((s, i) => (
            <div
              key={`content-${s.src}`}
              className={`flex min-h-[calc(100svh-5rem-6rem)] items-center transition-opacity duration-[1000ms] ease-in-out sm:min-h-[calc(100svh-5rem-12rem)] lg:min-h-0 ${
                i === slide
                  ? "pointer-events-auto hero-slide-active"
                  : "pointer-events-none absolute inset-x-0 top-0 hero-slide-inactive px-5 py-24 sm:px-10 lg:px-10 lg:py-32"
              }`}
              aria-hidden={i !== slide}
            >
              <div className="w-full">
              <h1 className="w-full max-w-4xl font-display text-5xl leading-[.96] sm:text-center sm:text-6xl lg:text-left lg:text-8xl">
                {s.title.map((line, li) => (
                  <span key={li} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <div className="mt-7 w-full max-w-2xl flex flex-col items-start gap-6 border-t border-primary-foreground/30 pt-6 sm:items-center sm:text-center lg:items-start lg:text-left">
                <p className="w-full text-base leading-7 text-primary-foreground/70 lg:text-lg">
                  {s.text}
                </p>
                <div className="flex w-full flex-wrap gap-3 sm:justify-center lg:justify-start">
                  <Button asChild size="lg" variant="flame">
                    <Link href={s.cta.href}>
                      {s.cta.label} <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-0 z-30 w-full px-5 sm:bottom-8 lg:bottom-10 lg:px-10">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-primary-foreground/25 bg-primary/40 text-primary-foreground backdrop-blur hover:bg-primary/60"
                onClick={prev}
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-primary-foreground/25 bg-primary/40 text-primary-foreground backdrop-blur hover:bg-primary/60"
                onClick={next}
                aria-label="Next slide"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === slide}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === slide
                      ? "w-8 bg-accent"
                      : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-accent">Today&apos;s supply board</p>
              <h2 className="mt-3 font-display text-5xl text-primary lg:text-7xl">
                Product prices
              </h2>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Last updated: {PRICE_LAST_UPDATED}
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} compact hideQuoteButton />
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-muted-foreground">
              Prices are indicative and may change with market conditions,
              quantity and delivery location. Final pricing is confirmed in
              your quote.
            </p>
            <p className="text-xs font-semibold uppercase tracking-[.12em] text-primary">
              <Link href="/products" className="inline-flex items-center gap-2 hover:text-accent">
                View all products <ArrowRight className="size-4" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="grid bg-primary text-primary-foreground lg:grid-cols-2">
        <div className="min-h-[420px] overflow-hidden lg:min-h-[680px]">
          <img
            src={gantry}
            alt="Supreme Energy tanker at a petroleum loading gantry"
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
        <div className="flex items-center px-6 py-16 lg:px-16">
          <div>
            <p className="eyebrow text-accent">Mobile dispensing</p>
            <h2 className="mt-5 max-w-xl font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              A filling station that comes to you.
            </h2>
            <p className="mt-7 max-w-xl leading-7 text-primary-foreground/70">
              Our meter-equipped peddler truck delivers verified quantities
              directly into your equipment or storage—ideal for estates,
              construction sites, factories, fleets and generators.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {deliveryFeatures.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="border-l-2 border-accent pl-4"
                >
                  <Icon className="size-5 text-accent" />
                  <strong className="mt-3 block">{title}</strong>
                  <span className="text-xs text-primary-foreground/60">
                    {text}
                  </span>
                </div>
              ))}
            </div>
            <Button asChild variant="flame" size="lg" className="mt-10">
              <Link href="/fleet">
                Explore mobile delivery <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="eyebrow text-accent">Beyond supply</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-primary lg:text-7xl">
              Capability across the energy value chain.
            </h2>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/services">
                View all services <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid border-t border-border md:grid-cols-2">
            {services.slice(0, 6).map((s, i) => (
              <div
                key={s.title}
                className="border-b border-border p-6 md:odd:border-r"
              >
                <span className="font-display text-2xl text-accent">
                  0{i + 1}
                </span>
                <h3 className="mt-6 font-display text-3xl text-primary">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-accent">How it works</p>
              <h2 className="mt-3 font-display text-5xl text-primary lg:text-7xl">
                From request to delivery in three steps.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/quote">
                Start step one <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Tell us what you need",
                text: "Pick your product, quantity and delivery point. Get an instant branded estimate you can download and share.",
              },
              {
                step: "02",
                title: "We confirm and schedule",
                text: "Our team confirms current pricing, availability and delivery terms—then plans your route and timing.",
              },
              {
                step: "03",
                title: "Metered at your doorstep",
                text: "Fuel arrives in our meter-equipped peddler truck and is dispensed with clear, verifiable volumes.",
              },
            ].map((s) => (
              <article key={s.step} className="bg-background p-8">
                <span className="font-display text-4xl text-accent">
                  {s.step}
                </span>
                <h3 className="mt-8 font-display text-3xl text-primary">
                  {s.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {s.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[620px] overflow-hidden">
        <img
          src={fleet}
          alt="Supreme Energy petroleum tanker fleet on the road"
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/55 to-transparent" />
        <div className="relative mx-auto flex min-h-[620px] max-w-[1440px] items-center px-5 lg:px-10">
          <div className="max-w-2xl text-primary-foreground">
            <Truck className="size-10 text-accent" />
            <h2 className="mt-6 font-display text-6xl leading-none lg:text-8xl">
              Built to keep business moving.
            </h2>
            <p className="mt-6 max-w-lg leading-7 text-primary-foreground/75">
              From a single metered drop to coordinated bulk movement, our
              logistics approach combines visibility, disciplined handling and
              dependable execution.
            </p>
            <div className="mt-8 flex gap-3">
              <Button asChild variant="flame" size="lg">
                <Link href="/quote">Request delivery</Link>
              </Button>
              <Button asChild variant="light" size="lg">
                <Link href="/projects">Our track record</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent px-5 py-14 text-accent-foreground lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2 className="mt-2 font-display text-4xl lg:text-6xl">
              Tell us what you need. We&apos;ll move.
            </h2>
          </div>
          <Button asChild variant="default" size="lg">
            <Link href="/quote">
              Start a quote <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
