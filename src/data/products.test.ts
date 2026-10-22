import { describe, expect, it } from "vitest";
import { z } from "zod";
import { DELIVERY_ALLOWANCE, PRICE_LAST_UPDATED, products } from "./products";

const productSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  shortName: z.string().trim().min(1),
  name: z.string().trim().min(1),
  price: z.number().finite().positive(),
  unit: z.enum(["litre", "kg"]),
  density: z.string().trim().min(1),
  flashPoint: z.string().trim().min(1),
  note: z.string().trim().min(1),
});

describe("product catalogue", () => {
  it("contains valid products with unique, stable quote identifiers", () => {
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(productSchema.safeParse(product).success, product.id).toBe(true);
    }
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    // Existing product links must continue to work when prices are edited.
    expect(products.map((p) => p.id)).toEqual(
      expect.arrayContaining(["pms", "ago", "lpg", "lpfo", "naphtha"]),
    );
  });

  it("labels LPG by mass and the liquid fuels by volume", () => {
    expect(products.find((p) => p.id === "lpg")?.unit).toBe("kg");
    for (const product of products.filter((p) => p.id !== "lpg")) {
      expect(product.unit, product.id).toBe("litre");
    }
  });

  it("publishes the price-list timestamp and a finite nonnegative delivery allowance", () => {
    expect(PRICE_LAST_UPDATED).toMatch(/^\d{1,2} [A-Za-z]+ \d{4}, \d{1,2}:\d{2} (AM|PM) WAT$/);
    expect(Number.isFinite(DELIVERY_ALLOWANCE)).toBe(true);
    expect(DELIVERY_ALLOWANCE).toBeGreaterThanOrEqual(0);
  });
});
