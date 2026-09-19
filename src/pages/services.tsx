import Head from "next/head";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell, Meta, PageIntro } from "@/components/site/SiteShell";
import { services } from "@/lib/site";
import { images } from "@/lib/images";

export default function Services() {
  const ops = images.operationsGrid;
  return (
    <SiteShell>
      <Head>
        <title>{Meta.services.title}</title>
        <meta name="description" content={Meta.services.description} />
        <meta property="og:title" content={Meta.services.title} />
        <meta property="og:description" content={Meta.services.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PageIntro
        eyebrow="Integrated capability"
        title="One team. Many moving parts."
        text="Practical technical, engineering and logistics support for demanding energy and industrial environments."
        image={ops}
        imageAlt="Supreme Energy operational capabilities"
      />
      <section className="mx-auto grid max-w-[1440px] gap-4 px-5 py-20 md:grid-cols-2 lg:px-10 xl:grid-cols-4">
        {services.map((s, i) => (
          <article
            key={s.title}
            className="border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <Wrench className="text-accent" />
              <span className="font-display text-2xl text-muted-foreground">
                0{i + 1}
              </span>
            </div>
            <h2 className="mt-10 font-display text-3xl text-primary">
              {s.title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {s.text}
            </p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-24 lg:grid-cols-2 lg:px-10">
        <img
          src={ops}
          alt="Supreme Energy operational capabilities"
          loading="lazy"
          className="h-full min-h-[380px] object-cover"
        />
        <div className="flex items-center">
          <div>
            <p className="eyebrow text-accent">Delivery discipline</p>
            <h2 className="mt-4 font-display text-5xl text-primary">
              Quality and safety are part of the work—not an afterthought.
            </h2>
            <p className="mt-6 leading-7 text-muted-foreground">
              Our approach brings planning, QA/QC, HSE awareness and clear
              communication into every assignment, from procurement through
              execution.
            </p>
            <Button asChild variant="flame" className="mt-8">
              <Link href="/quote">
                Discuss your project <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
