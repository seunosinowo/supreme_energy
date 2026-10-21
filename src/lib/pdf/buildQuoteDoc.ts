import { PRICE_LAST_UPDATED, products } from "@/data/products";
import { company } from "@/lib/site";
import type { Line, Fields } from "@/lib/quote";

export async function buildQuoteDoc(lines: Line[], fields: Fields, total: number) {
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
    { maxWidth: 180 },
  );
  doc.text(`Delivery: ${fields.city}, ${fields.state}`, 16, 80, { maxWidth: 180 });
  doc.text(`Issued: ${new Date().toLocaleDateString("en-GB")}  •  Valid for 48 hours`, 16, 92);
  doc.text(`Price list updated: ${PRICE_LAST_UPDATED}`, 16, 98);
  let y = 114;
  doc.setFillColor(239, 243, 248);
  doc.rect(14, y - 7, 182, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("PRODUCT", 17, y);
  doc.text("QTY", 86, y);
  doc.text("RATE", 118, y);
  doc.text("AMOUNT", 194, y, { align: "right" });
  y += 12;
  lines.forEach((l) => {
    if (y > 235) {
      doc.addPage();
      y = 24;
    }
    const p = products.find((x) => x.id === l.productId);
    if (!p) return;
    doc.setFont("helvetica", "bold");
    doc.text(p.shortName, 17, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${l.quantity.toLocaleString()} ${p.unit}${l.quantity === 1 ? "" : "s"}`, 86, y);
    doc.text(pdfMoney(p.price), 118, y);
    doc.text(pdfMoney(p.price * l.quantity), 194, y, { align: "right" });
    y += 6;
    doc.setFontSize(7.5);
    doc.setTextColor(90, 97, 108);
    doc.text(`Density: ${p.density}  |  Flash point: ${p.flashPoint}`, 17, y);
    doc.setTextColor(28, 33, 42);
    doc.setFontSize(9);
    y += 11;
  });
  if (y > 220) {
    doc.addPage();
    y = 24;
  }
  doc.setDrawColor(210, 215, 223);
  doc.line(14, y, 196, y);
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("ESTIMATED TOTAL", 76, y);
  doc.setTextColor(...blue);
  doc.text(pdfMoney(total), 194, y, { align: "right" });
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
  y += 36;
  const customerDetails = [
    `Customer contact: ${fields.phone} | ${fields.email}`,
    ...(fields.notes ? [`Delivery notes: ${fields.notes}`] : []),
  ];
  for (const detail of customerDetails) {
    const wrapped: string[] = doc.splitTextToSize(detail, 178);
    for (const text of wrapped) {
      if (y > 275) {
        doc.addPage();
        y = 24;
      }
      doc.text(text, 16, y);
      y += 5;
    }
  }
  const pdfBlob = doc.output("blob");
  const pdfName = `Supreme-Energy-Quote-${Date.now()}.pdf`;
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = pdfName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { pdfName };
}
