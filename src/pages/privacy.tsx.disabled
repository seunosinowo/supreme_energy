import Head from "next/head";
import { SiteShell, Meta, PageIntro } from "@/components/site/SiteShell";

export default function Privacy() {
  return (
    <SiteShell>
      <Head>
        <title>{Meta.privacy.title}</title>
        <meta name="description" content={Meta.privacy.description} />
        <meta property="og:title" content={Meta.privacy.title} />
        <meta property="og:description" content={Meta.privacy.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PageIntro
        eyebrow="Legal"
        title="Privacy policy"
        text="How we handle information you submit through this website."
      />
      <article className="prose mx-auto max-w-3xl px-5 py-16 text-muted-foreground">
        <h2 className="font-display text-3xl text-primary">
          Information we collect
        </h2>
        <p>
          We collect contact, company, product, quantity and delivery
          information you voluntarily provide when requesting a quote or
          contacting us.
        </p>
        <h2 className="mt-10 font-display text-3xl text-primary">
          How it is used
        </h2>
        <p>
          Information is used to prepare and respond to your inquiry,
          coordinate supply or services, maintain necessary business records
          and meet legal obligations. We do not sell personal information.
        </p>
        <h2 className="mt-10 font-display text-3xl text-primary">Contact</h2>
        <p>For privacy questions, email info@supreme-energy.com.ng.</p>
      </article>
    </SiteShell>
  );
}
