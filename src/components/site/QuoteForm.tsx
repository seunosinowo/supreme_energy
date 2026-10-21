import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Download, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRICE_LAST_UPDATED, products } from "@/data/products";
import { quoteSchema, calculateQuoteTotal, type Line, type Fields } from "@/lib/quote";
import { buildQuoteDoc } from "@/lib/pdf/buildQuoteDoc";

const emptyFields: Fields = {
  name: "",
  companyName: "",
  phone: "",
  email: "",
  state: "Lagos",
  city: "",
  notes: "",
};

export function QuoteForm({ initialProduct }: { initialProduct?: string | undefined }) {
  const [lines, setLines] = useState<Line[]>([
    {
      productId: products.some((p) => p.id === initialProduct) ? String(initialProduct) : "ago",
      quantity: 1000,
    },
  ]);
  const [fields, setFields] = useState(emptyFields);
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const total = useMemo(() => {
    try {
      return calculateQuoteTotal(lines);
    } catch {
      return 0;
    }
  }, [lines]);
  const money = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);
  function setField<K extends keyof Fields>(k: K, v: Fields[K]) {
    setFields((f) => ({ ...f, [k]: v }));
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "working") return;
    setError("");
    setSuccessMessage("");
    const parsed = quoteSchema.safeParse({ fields, lines });
    if (!parsed.success) {
      setStatus("idle");
      setError(parsed.error.issues[0].message);
      return;
    }
    setStatus("working");
    try {
      await buildQuoteDoc(
        parsed.data.lines,
        parsed.data.fields,
        calculateQuoteTotal(parsed.data.lines),
      );
      setSuccessMessage(
        "Your estimate has downloaded. Email it to our team or call us to confirm availability and delivery. This form does not send your details.",
      );
      setStatus("done");
    } catch {
      setError("The PDF could not be generated. Please try again or contact our team.");
      setStatus("idle");
    }
  }
  return (
    <form
      noValidate
      onSubmit={submit}
      className="border border-border bg-card p-5 shadow-sm sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-accent">Quote builder</p>
          <h2 className="mt-2 font-display text-4xl text-primary">Download your estimate</h2>
        </div>
        <span className="text-right text-xs text-muted-foreground">
          Prices updated
          <br />
          {PRICE_LAST_UPDATED}
        </span>
      </div>
      <div className="mt-8 grid gap-4">
        {lines.map((line, i) => (
          <div
            key={`${line.productId}-${i}`}
            className="grid gap-3 border border-border bg-background p-4 sm:grid-cols-[1fr_160px_44px] sm:items-end"
          >
            <label className="text-xs font-bold uppercase tracking-[.1em] text-muted-foreground">
              Product
              <select
                value={line.productId}
                onChange={(e) =>
                  setLines((ls) =>
                    ls.map((x, j) => (j === i ? { ...x, productId: e.target.value } : x)),
                  )
                }
                className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.shortName} — ₦{p.price.toLocaleString()}/{p.unit}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold uppercase tracking-[.1em] text-muted-foreground">
              Quantity
              <Input
                className="mt-2 h-11"
                min="1"
                max="10000000"
                type="number"
                step="any"
                value={line.quantity}
                onChange={(e) =>
                  setLines((ls) =>
                    ls.map((x, j) => (j === i ? { ...x, quantity: Number(e.target.value) } : x)),
                  )
                }
              />
            </label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={lines.length === 1}
              onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}
              aria-label="Remove product"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        className="mt-3"
        disabled={lines.length >= 50 || status === "working"}
        onClick={() => setLines((ls) => [...ls, { productId: "ago", quantity: 1000 }])}
      >
        <Plus />
        Add product
      </Button>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name *
          <Input
            maxLength={100}
            className="mt-2 h-11"
            value={fields.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold">
          Company
          <Input
            maxLength={120}
            className="mt-2 h-11"
            value={fields.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold">
          Phone *
          <Input
            maxLength={24}
            className="mt-2 h-11"
            type="tel"
            value={fields.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold">
          Email *
          <Input
            maxLength={255}
            className="mt-2 h-11"
            type="email"
            value={fields.email}
            onChange={(e) => setField("email", e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold">
          Delivery state *
          <Input
            maxLength={60}
            className="mt-2 h-11"
            value={fields.state}
            onChange={(e) => setField("state", e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold">
          City / delivery point *
          <Input
            maxLength={120}
            className="mt-2 h-11"
            value={fields.city}
            onChange={(e) => setField("city", e.target.value)}
          />
        </label>
      </div>
      <label className="mt-4 block text-sm font-semibold">
        Delivery notes
        <textarea
          maxLength={1000}
          className="mt-2 min-h-24 w-full border border-input bg-transparent p-3 text-sm"
          value={fields.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </label>
      <div className="mt-8 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">
            Estimated product total
          </p>
          <p className="mt-1 font-display text-4xl text-primary">{money(total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Delivery fee confirmed separately</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" variant="flame" disabled={status === "working"}>
            {status === "working" ? <Loader2 className="animate-spin" /> : <Download />}
            {status === "working" ? "Generating…" : "Download PDF"}
          </Button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}
      {status === "done" && successMessage && (
        <p
          role="status"
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-success"
        >
          <CheckCircle2 className="size-4" />
          {successMessage}
        </p>
      )}
    </form>
  );
}

export type { Line, Fields } from "@/lib/quote";
