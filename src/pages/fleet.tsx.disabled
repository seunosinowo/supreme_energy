import Head from "next/head";
import Link from "next/link";
import { ArrowRight, Gauge, MapPinned, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell, Meta, PageIntro } from "@/components/site/SiteShell";
import { images } from "@/lib/images";

const fleetCapabilities = [
  {
    icon: Truck,
    title: "Road fleet",
    text: "Peddler trucks, petroleum tankers, low-bed and flat-bed support.",
  },
  {
    icon: Ship,
    title: "Marine support",
    text: "Tug boats, house boats and vessel coordination for marine operations.",
  },
  {
    icon: MapPinned,
    title: "Heavy logistics",
    text: "Swamp buggies, lifting equipment and 80–250 tonne crane support.",
  },
];

export default function Fleet() {
  const gantry = images.loadingGantry;
  const fleet = images.fleetRoad;
  return (
    <SiteShell>
      <Head>
        <title>{Meta.fleet.title}</title>
        <meta name="description" content={Meta.fleet.description} />
        <meta property="og:title" content={Meta.fleet.title} />
        <meta property="og:description" content={Meta.fleet.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PageIntro
        eyebrow="Fleet & logistics"
        title="Measured at the point of delivery."
        text="Our peddler service brings filling-station-style dispensing to your doorstep, with clear volumes for every drop."
        image={fleet}
        imageAlt="Supreme Energy tanker convoy on the road"
      />
      <section className="grid bg-primary text-primary-foreground lg:grid-cols-2">
        <img
          src={gantry}
          alt="Supreme Energy tanker loading at the gantry"
          className="h-full min-h-[520px] w-full object-cover"
        />
        <div className="flex items-center px-6 py-16 lg:px-16">
          <div>
            <Gauge className="size-10 text-accent" />
            <h2 className="mt-6 font-display text-6xl leading-none">
              Mobile dispensing, without the guesswork.
            </h2>
            <p className="mt-6 leading-7 text-primary-foreground/70">
              A meter-equipped smaller truck dispenses fuel like a station
              pump. Supply can be allocated across multiple delivery points on
              one planned route.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {["5,000 L", "10,000 L", "15,000 L"].map((x, i) => (
                <div
                  key={x}
                  className="border border-primary-foreground/20 p-4"
                >
                  <span className="eyebrow text-accent">
                    Point {String.fromCharCode(65 + i)}
                  </span>
                  <strong className="mt-2 block font-display text-2xl">
                    {x}
                  </strong>
                </div>
              ))}
            </div>
            <Button asChild variant="flame" size="lg" className="mt-8">
              <Link href="/contact?product=ago">
                Request mobile dispensing <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          {fleetCapabilities.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="border border-border p-7"
            >
              <Icon className="text-accent" />
              <h2 className="mt-8 font-display text-3xl text-primary">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
        <img
          src={fleet}
          alt="Supreme Energy tanker convoy"
          loading="lazy"
          className="mt-10 aspect-[16/7] w-full object-cover"
        />
      </section>
    </SiteShell>
  );
}
