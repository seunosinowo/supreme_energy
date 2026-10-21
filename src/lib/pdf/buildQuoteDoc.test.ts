import { afterEach, describe, expect, it, vi } from "vitest";
import { buildQuoteDoc } from "./buildQuoteDoc";
import { calculateQuoteTotal } from "@/lib/quote";

const fields = {
  name: "Ada",
  companyName: "Example Ltd",
  phone: "+2349024876164",
  email: "ada@example.com",
  city: "Surulere",
  state: "Lagos",
  notes: "",
};

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("PDF estimates", () => {
  it("downloads a real PDF with correct totals, contact details and later URL cleanup", async () => {
    vi.useFakeTimers();
    const createObjectURL = vi.fn().mockReturnValue("blob:quote");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL, revokeObjectURL }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const lines = [
      { productId: "ago", quantity: 2 },
      { productId: "lpg", quantity: 1.5 },
    ];
    const result = await buildQuoteDoc(lines, fields, calculateQuoteTotal(lines));
    expect(result.pdfName).toMatch(/^Supreme-Energy-Quote-\d+\.pdf$/);
    expect(click).toHaveBeenCalledOnce();
    expect(document.querySelector("a[download]")).toBeNull();
    vi.advanceTimersByTime(2000);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:quote");
    vi.useRealTimers();
    const pdf = await readBlob(createObjectURL.mock.calls[0][0]);
    expect(pdf).toMatch(/^%PDF-/);
    expect(pdf).toContain("SUPREME ENERGY");
    expect(pdf).toContain("Ada / Example Ltd");
    expect(pdf).toContain("NGN 2,845");
    expect(pdf).toContain("AGO");
    expect(pdf).toContain("LPG");
  });
  it("paginates large quotes instead of placing rows outside the page", async () => {
    const createObjectURL = vi.fn().mockReturnValue("blob:quote");
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() }));
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const lines = Array.from({ length: 50 }, () => ({ productId: "ago", quantity: 1 }));
    await buildQuoteDoc(
      lines,
      { ...fields, companyName: "", notes: "Delivery instructions ".repeat(45) },
      calculateQuoteTotal(lines),
    );
    const pdf = await readBlob(createObjectURL.mock.calls[0][0]);
    const pageCount = Number(pdf.match(/\/Count (\d+)/)?.[1]);
    expect(pageCount).toBeGreaterThan(1);
    expect(pdf.match(/\(AGO\)/g)).toHaveLength(50);
    expect(pdf).toContain("NGN 46,000");
    expect(pdf).toContain("Delivery notes:");
  });
});
