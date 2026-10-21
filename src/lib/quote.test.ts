import { describe, expect, it } from "vitest";
import { products, DELIVERY_ALLOWANCE } from "@/data/products";
import { calculateQuoteTotal, quoteSchema } from "./quote";

const valid = {
  fields: {
    name: " Ada ",
    companyName: "",
    phone: "+234 902 487 6164",
    email: "ada@example.com",
    state: "Lagos",
    city: "Surulere",
    notes: "",
  },
  lines: [{ productId: "ago", quantity: 1000 }],
};

describe("quote validation", () => {
  it("accepts a valid quote and trims contact fields", () => {
    expect(quoteSchema.parse(valid).fields.name).toBe("Ada");
  });
  it.each([
    ["name", "  "],
    ["email", "a@"],
    ["phone", "abcdefghi"],
    ["phone", "123"],
    ["state", ""],
    ["city", " "],
    ["name", "a".repeat(101)],
    ["companyName", "a".repeat(121)],
    ["notes", "a".repeat(1001)],
  ])("rejects invalid %s", (field, value) => {
    expect(
      quoteSchema.safeParse({ ...valid, fields: { ...valid.fields, [field]: value } }).success,
    ).toBe(false);
  });
  it.each([0, -1, NaN, Infinity, 10_000_001])("rejects quantity %s", (quantity) => {
    expect(
      quoteSchema.safeParse({ ...valid, lines: [{ productId: "ago", quantity }] }).success,
    ).toBe(false);
  });
  it("rejects missing, unknown and excessive products", () => {
    for (const lines of [
      [],
      [{ productId: "unknown", quantity: 1 }],
      Array(51).fill(valid.lines[0]),
    ]) {
      expect(quoteSchema.safeParse({ ...valid, lines }).success).toBe(false);
    }
  });
  it("accepts fractional quantities and the maximum supported quote", () => {
    expect(
      quoteSchema.safeParse({
        ...valid,
        lines: Array(50).fill({ productId: "lpg", quantity: 10_000_000 }),
      }).success,
    ).toBe(true);
    expect(
      quoteSchema.safeParse({ ...valid, lines: [{ productId: "lpg", quantity: 1.5 }] }).success,
    ).toBe(true);
  });
});

describe("quote totals", () => {
  it("calculates mixed products using the current catalogue", () => {
    const lines = products.map((p, index) => ({ productId: p.id, quantity: index + 0.5 }));
    const expected = products.reduce((sum, p, i) => sum + p.price * (i + 0.5), DELIVERY_ALLOWANCE);
    expect(calculateQuoteTotal(lines)).toBe(expected);
  });
  it.each([0, -1, NaN, Infinity, 10_000_001])(
    "refuses invalid amounts rather than producing a misleading total (%s)",
    (quantity) => {
      expect(() => calculateQuoteTotal([{ productId: "ago", quantity }])).toThrow(
        "Invalid quote line",
      );
    },
  );
  it("refuses unknown product IDs", () => {
    expect(() => calculateQuoteTotal([{ productId: "missing", quantity: 1 }])).toThrow();
  });
});
