import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/site/QuoteForm";
import { SiteShell, Meta, PageIntro } from "@/components/site/SiteShell";
import { company } from "@/lib/site";
import { images } from "@/lib/images";

export default function Quote() {
  const router = useRouter();
  const product = router.query.product as string | undefined;
  const hero = images.loadingGantry;
  return (
    <SiteShell>
      <Head>
        <title>{Meta.quote.title}</title>
        <meta name="description" content={Meta.quote.description} />
        <meta property="og:title" content={Meta.quote.title} />
        <meta property="og:description" content={Meta.quote.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PageIntro
        eyebrow="Instant quote"
        title="Build your branded estimate."
        text="Pick your products, quantity and destination. Submit the form to send it straight to our team — a professional Supreme Energy PDF estimate also downloads for your records."
        image={hero}
        imageAlt="Petroleum tanker at a loading gantry"
      >
        <Link
          href="/products"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary-foreground"
        >
          <ArrowLeft className="size-4" />
          Review product prices first
        </Link>
      </PageIntro>

      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <QuoteForm initialProduct={product} />
        </div>

        <div className="mt-16 grid gap-6 border-t border-border pt-12 sm:grid-cols-3">
          <a
            href={`tel:${company.phoneHref}`}
            className="flex gap-4 rounded-md border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <Phone className="shrink-0 text-accent" />
            <span>
              <small className="block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">
                Call
              </small>
              <strong className="mt-2 block font-display text-2xl text-primary">
                {company.phone}
              </strong>
            </span>
          </a>
          <a
            href={`mailto:${company.email}`}
            className="flex gap-4 rounded-md border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <Mail className="shrink-0 text-accent" />
            <span>
              <small className="block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">
                Email
              </small>
              <strong className="mt-2 block break-all font-display text-2xl text-primary">
                {company.email}
              </strong>
            </span>
          </a>
          <div className="flex gap-4 rounded-md border border-border bg-card p-6">
            <MapPin className="shrink-0 text-accent" />
            <span>
              <small className="block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">
                Head office
              </small>
              <strong className="mt-2 block leading-7 font-display text-2xl text-primary">
                {company.address}
              </strong>
            </span>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
