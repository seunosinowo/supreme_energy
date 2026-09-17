import Head from "next/head";
import { ProductCard } from "@/components/site/ProductCard";
import { SiteShell, Meta, PageIntro } from "@/components/site/SiteShell";
import { PRICE_LAST_UPDATED, products } from "@/data/products";
import { images } from "@/lib/images";

export default function Products() {
  const productsImage = images.lpgOperations;
  return (
    <SiteShell>
      <Head>
        <title>{Meta.products.title}</title>
        <meta name="description" content={Meta.products.description} />
        <meta property="og:title" content={Meta.products.title} />
        <meta property="og:description" content={Meta.products.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PageIntro
        eyebrow="Petroleum products"
        title="Quality products. Clear pricing."
        text="Five essential petroleum products supplied with disciplined quality control, transparent specifications and dependable delivery."
        image={productsImage}
        imageAlt="Supreme Energy LPG operations"
      />
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Indicative prices in Nigerian Naira. Final quote depends on
            quantity, availability and destination.
          </p>
          <p className="eyebrow text-primary">Last updated {PRICE_LAST_UPDATED}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="grid bg-primary text-primary-foreground lg:grid-cols-2">
        <img
          src={productsImage}
          alt="Supreme Energy LPG operations"
          loading="lazy"
          className="h-full min-h-[420px] w-full object-cover"
        />
        <div className="flex items-center px-6 py-16 lg:px-16">
          <div>
            <p className="eyebrow text-accent">Quality note</p>
            <h2 className="mt-4 font-display text-5xl">
              Specifications that travel with the product.
            </h2>
            <p className="mt-6 leading-7 text-primary-foreground/70">
              Density and flash-point ranges are reference specifications.
              Every commercial offer remains subject to current supply
              documentation, applicable standards and agreed handling
              conditions.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
