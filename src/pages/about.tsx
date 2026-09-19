import Head from "next/head";
import { CheckCircle2 } from "lucide-react";
import { SiteShell, Meta, PageIntro } from "@/components/site/SiteShell";
import { company } from "@/lib/site";
import { images } from "@/lib/images";

const values = [
  "Integrity",
  "Safety",
  "Customer satisfaction",
  "Professionalism",
  "Quality delivery",
  "Accountability",
];

export default function About() {
  const heroImg = images.stationDay;
  return (
    <SiteShell>
      <Head>
        <title>{Meta.about.title}</title>
        <meta name="description" content={Meta.about.description} />
        <meta property="og:title" content={Meta.about.title} />
        <meta property="og:description" content={Meta.about.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PageIntro
        eyebrow={`Company profile · RC ${company.rc}`}
        title="A dependable partner in energy."
        text="Supreme Energy is a Nigerian petroleum products, engineering and logistics company built around responsible execution and long-term client confidence."
        image={heroImg}
        imageAlt="Supreme Energy station operations"
      />
      <section className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <p className="eyebrow text-accent">Our mission</p>
          <h2 className="mt-4 font-display text-5xl leading-none text-primary lg:text-7xl">
            Deliver value safely, transparently and on time.
          </h2>
          <p className="mt-7 leading-7 text-muted-foreground">
            We connect clients to petroleum products and technical services
            through responsive planning, experienced people and a firm
            commitment to satisfaction. Our work spans downstream supply,
            engineering, inspection, logistics, construction support and ICT.
          </p>
        </div>
        <img
          src={images.operationsGrid}
          alt="Supreme Energy operations and capabilities"
          loading="lazy"
          className="h-full min-h-[430px] w-full object-cover"
        />
      </section>
      <section className="bg-secondary">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
          <p className="eyebrow text-accent">Core values</p>
          <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div
                key={v}
                className="flex items-center gap-4 bg-background p-6"
              >
                <CheckCircle2 className="text-accent" />
                <span className="font-display text-2xl text-primary">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
