import Head from "next/head";
import { SiteShell, Meta, PageIntro } from "@/components/site/SiteShell";

export default function Terms() {
  return (
    <SiteShell>
      <Head>
        <title>{Meta.terms.title}</title>
        <meta name="description" content={Meta.terms.description} />
        <meta property="og:title" content={Meta.terms.title} />
        <meta property="og:description" content={Meta.terms.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PageIntro
        eyebrow="Legal"
        title="Terms of use"
        text="Important conditions for website information and estimated quotations."
      />
      <article className="mx-auto max-w-3xl px-5 py-16 text-muted-foreground">
        <h2 className="font-display text-3xl text-primary">
          Indicative information
        </h2>
        <p className="mt-3 leading-7">
          Website prices and generated estimates are indicative only. Final
          supply is subject to availability, quality documentation,
          destination, taxes, delivery costs and written commercial
          confirmation.
        </p>
        <h2 className="mt-10 font-display text-3xl text-primary">
          Product handling
        </h2>
        <p className="mt-3 leading-7">
          Petroleum products require appropriate storage, permits, safety
          controls and trained handling. Customers remain responsible for
          ensuring suitable delivery access and receiving facilities.
        </p>
        <h2 className="mt-10 font-display text-3xl text-primary">
          Use of content
        </h2>
        <p className="mt-3 leading-7">
          Site content is provided for general business information and may be
          updated without notice.
        </p>
      </article>
    </SiteShell>
  );
}
