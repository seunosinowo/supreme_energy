import Head from "next/head";
import { Building2, CheckCircle2 } from "lucide-react";
import { SiteShell, Meta, PageIntro } from "@/components/site/SiteShell";
import { images } from "@/lib/images";

const names = [
  "Belema Oil",
  "Chevron",
  "SPDC",
  "NLNG",
  "ExxonMobil",
  "Shell",
  "Total",
  "Pivot GIS",
  "Saipem",
];
const work = [
  "Petroleum product supply and bulk delivery",
  "Engineering, piping and structural support",
  "Marine and project logistics",
  "Inspection and non-destructive testing",
  "Procurement and safety equipment supply",
  "Civil, fabrication and construction support",
];

export default function Projects() {
  const industry = images.stationDay;
  return (
    <SiteShell>
      <Head>
        <title>{Meta.projects.title}</title>
        <meta name="description" content={Meta.projects.description} />
        <meta property="og:title" content={Meta.projects.title} />
        <meta property="og:description" content={Meta.projects.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PageIntro
        eyebrow="Experience & relationships"
        title="Trusted in demanding environments."
        text="Our profile reflects experience and working relationships across leading operators, contractors and industrial organizations."
        image={industry}
        imageAlt="Supreme Energy station operations"
      />
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="eyebrow text-accent">Project experience</p>
          <div className="mt-7 grid gap-3">
            {work.map((x) => (
              <div
                key={x}
                className="flex items-center gap-3 border-b border-border py-4"
              >
                <CheckCircle2 className="size-5 text-accent" />
                <span className="font-semibold">{x}</span>
              </div>
            ))}
          </div>
        </div>
        <img
          src={industry}
          alt="Supreme Energy retail and petroleum operations"
          loading="lazy"
          className="h-full min-h-[390px] w-full object-cover"
        />
      </section>
      <section className="bg-secondary">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
          <p className="eyebrow text-accent">Clients & industry partners</p>
          <h2 className="mt-4 max-w-3xl font-display text-5xl text-primary">
            Names represented in our company experience.
          </h2>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {names.map((n) => (
              <div
                key={n}
                className="flex min-h-28 items-center gap-4 bg-background p-6"
              >
                <Building2 className="text-accent" />
                <span className="font-display text-2xl text-primary">{n}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            Company names are presented as profile references; they do not
            imply endorsement. Detailed scopes and references are available
            during commercial discussions.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
