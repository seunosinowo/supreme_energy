import Link from "next/link";
import { ArrowUpRight, Droplets, ThermometerSun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

export function ProductCard({
  product,
  compact = false,
  hideQuoteButton = false,
}: {
  product: Product;
  compact?: boolean;
  hideQuoteButton?: boolean;
}) {
  return (
    <article className="group border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg">
      <div className="flex items-start justify-between">
        <span className="font-display text-4xl text-primary">{product.shortName}</span>
        <ArrowUpRight className="text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <p className="mt-2 min-h-10 text-sm text-muted-foreground">{product.name}</p>
      <div className="mt-6 border-y border-border py-5">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">
          Current selling price
        </p>
        <p className="mt-2 font-display text-4xl text-foreground">
          ₦{product.price.toLocaleString()}
          <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
            /{product.unit}
          </span>
        </p>
      </div>
      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2 text-muted-foreground">
            <Droplets className="size-4 text-primary" />
            Density
          </dt>
          <dd className="font-semibold">{product.density}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2 text-muted-foreground">
            <ThermometerSun className="size-4 text-accent" />
            Flash point
          </dt>
          <dd className="font-semibold">{product.flashPoint}</dd>
        </div>
      </dl>
      {!compact && (
        <p className="mt-5 min-h-16 text-sm leading-6 text-muted-foreground">
          {product.note}
        </p>
      )}
      {!hideQuoteButton && (
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link href={`/quote?product=${product.id}`}>Request quote</Link>
        </Button>
      )}
    </article>
  );
}
