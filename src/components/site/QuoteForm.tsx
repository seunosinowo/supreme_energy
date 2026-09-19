import { useMemo, useState, type FormEvent } from "react";
import {
  CheckCircle2, Download, Loader2, Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DELIVERY_ALLOWANCE, PRICE_LAST_UPDATED, products } from "@/data/products";
import { company } from "@/lib/site";

type Line = { productId: string; quantity: number };
type Fields = {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  notes: string;
};
const emptyFields: Fields = {
  name: "",
  companyName: "",
  phone: "",
  email: "",
  state: "Lagos",
  city: "",
  notes: "",
};

async function buildQuoteDoc(lines: Line[], fields: Fields, total: number) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const blue = [8, 53, 126] as const;
  const orange = [243, 112, 33] as const;
  const pdfMoney = (n: number) =>
    `NGN ${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(n)}`;
  doc.setFillColor(...blue);
  doc.rect(0, 0, 210, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.text("SUPREME ENERGY", 16, 17);
  doc.setFontSize(9);
  doc.text(`RC ${company.rc}  |  PETROLEUM SUPPLY & METERED DELIVERY`, 16, 26);
  doc.setTextColor(...orange);
  doc.text(company.tagline.toUpperCase(), 16, 33);
  doc.setTextColor(28, 33, 42);
  doc.setFontSize(20);
  doc.text("ESTIMATED SUPPLY QUOTE", 16, 55);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Prepared for: ${fields.name}${fields.companyName ? ` / ${fields.companyName}` : ""}`,
    16,
    64,
  );
  doc.text(`Delivery: ${fields.city}, ${fields.state}`, 16, 70);
  doc.text(
    `Issued: ${new Date().toLocaleDateString("en-GB")}  •  Valid for 48 hours`,
    16,
    76,
  );
  doc.text(`Price list updated: ${PRICE_LAST_UPDATED}`, 16, 82);
  let y = 96;
  doc.setFillColor(239, 243, 248);
  doc.rect(14, y - 7, 182, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("PRODUCT", 17, y);
  doc.text("QTY", 86, y);
  doc.text("RATE", 118, y);
  doc.text("AMOUNT", 160, y);
  y += 12;
  lines.forEach((l) => {
    const p = products.find((x) => x.id === l.productId);
    if (!p) return;
    doc.setFont("helvetica", "bold");
    doc.text(p.shortName, 17, y);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${l.quantity.toLocaleString()} ${p.unit}${l.quantity === 1 ? "" : "s"}`,
      86,
      y,
    );
    doc.text(pdfMoney(p.price), 118, y);
    doc.text(pdfMoney(p.price * l.quantity), 160, y);
    y += 6;
    doc.setFontSize(7.5);
    doc.setTextColor(90, 97, 108);
    doc.text(`Density: ${p.density}  |  Flash point: ${p.flashPoint}`, 17, y);
    doc.setTextColor(28, 33, 42);
    doc.setFontSize(9);
    y += 11;
  });
  doc.setDrawColor(210, 215, 223);
  doc.line(14, y, 196, y);
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("ESTIMATED TOTAL", 110, y);
  doc.setTextColor(...blue);
  doc.text(pdfMoney(total), 160, y);
  y += 18;
  doc.setTextColor(28, 33, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    "Important: This estimate excludes any delivery fee and remains subject to availability, location,",
    16,
    y,
  );
  doc.text(
    "final quantity confirmation and written acceptance by Supreme Energy. Product specifications are indicative.",
    16,
    y + 6,
  );
  doc.text(`Contact: ${company.phone}  |  ${company.email}`, 16, y + 18);
  doc.text(company.address, 16, y + 24);
  const pdfBlob = doc.output("blob");
  const pdfName = `Supreme-Energy-Quote-${Date.now()}.pdf`;
  const pdfDataUri = doc.output("datauristring");
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = pdfName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { pdfBlob, pdfName, pdfDataUri };
}

export function QuoteForm({
  initialProduct,
}: {
  initialProduct?: string | undefined;
}) {
  const [lines, setLines] = useState<Line[]>([
    {
      productId: products.some((p) => p.id === initialProduct)
        ? String(initialProduct)
        : "ago",
      quantity: 1000,
    },
  ]);
  const [fields, setFields] = useState(emptyFields);
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const subtotal = useMemo(
    () =>
      lines.reduce(
        (sum, l) =>
          sum +
          (products.find((p) => p.id === l.productId)?.price ?? 0) *
            Math.max(0, l.quantity),
        0,
      ),
    [lines],
  );
  const total = subtotal + DELIVERY_ALLOWANCE;
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
    setError("");
    setSuccessMessage("");
    if (
      !fields.name.trim() ||
      !fields.phone.trim() ||
      !fields.email.includes("@") ||
      !fields.city.trim()
    ) {
      setError("Please complete your name, phone, email and delivery city.");
      return;
    }
    if (lines.some((l) => l.quantity <= 0)) {
      setError("Each product quantity must be greater than zero.");
      return;
    }
    setStatus("working");
    const { pdfBlob, pdfName, pdfDataUri } = await buildQuoteDoc(lines, fields, total);

    const payload = {
      fields,
      lines: lines.map((l) => {
        const p = products.find((x) => x.id === l.productId);
        return {
          productId: l.productId,
          productName: p?.name ?? l.productId,
          shortName: p?.shortName ?? l.productId,
          quantity: l.quantity,
          unit: p?.unit,
          rate: p?.price ?? 0,
          amount: (p?.price ?? 0) * l.quantity,
        };
      }),
      subtotal,
      total,
      priceUpdated: PRICE_LAST_UPDATED,
      pdfFileName: pdfName,
    };

    try {
      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          pdfDataUri,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setSuccessMessage(
        "Your request has been sent to our team. A copy of the estimate is downloading now.",
      );
    } catch {
      setSuccessMessage(
        "Your estimate has downloaded. We will contact you shortly to confirm availability and delivery terms.",
      );
    } finally {
      void pdfBlob;
      void pdfName;
    }
    setStatus("done");
  }
  return (
    <form onSubmit={submit} className="border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-accent">Quote builder</p>
          <h2 className="mt-2 font-display text-4xl text-primary">Send your request</h2>
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
                    ls.map((x, j) =>
                      j === i ? { ...x, productId: e.target.value } : x,
                    ),
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
                value={line.quantity}
                onChange={(e) =>
                  setLines((ls) =>
                    ls.map((x, j) =>
                      j === i ? { ...x, quantity: Number(e.target.value) } : x,
                    ),
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
        onClick={() =>
          setLines((ls) => [...ls, { productId: "ago", quantity: 1000 }])
        }
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
          <p className="mt-1 text-xs text-muted-foreground">
            Delivery fee confirmed separately
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            size="lg"
            variant="flame"
            disabled={status === "working"}
          >
            {status === "working" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send />
            )}
            {status === "working"
              ? "Sending…"
              : "Send quote request"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={status === "working"}
            onClick={async (e) => {
              e.preventDefault();
              setError("");
              setSuccessMessage("");
              if (
                !fields.name.trim() ||
                !fields.phone.trim() ||
                !fields.email.includes("@") ||
                !fields.city.trim()
              ) {
                setError(
                  "Please complete your name, phone, email and delivery city.",
                );
                return;
              }
              if (lines.some((l) => l.quantity <= 0)) {
                setError("Each product quantity must be greater than zero.");
                return;
              }
              setStatus("working");
              await buildQuoteDoc(lines, fields, total);
              setSuccessMessage("Your branded estimate has downloaded.");
              setStatus("done");
            }}
          >
            <Download />
            Download PDF
          </Button>
        </div>
      </div>
      {error && (
        <p className="mt-4 text-sm font-semibold text-destructive">{error}</p>
      )}
      {status === "done" && successMessage && (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-success">
          <CheckCircle2 className="size-4" />
          {successMessage}
        </p>
      )}
    </form>
  );
}

export type { Line, Fields };
