import { z } from "zod";
import { DELIVERY_ALLOWANCE, products } from "@/data/products";

export const quoteSchema = z.object({
  fields: z.object({
    name: z.string().trim().min(1, "Please enter your name.").max(100),
    companyName: z.string().trim().max(120),
    phone: z
      .string()
      .trim()
      .min(7, "Please enter a valid phone number.")
      .max(24)
      .regex(/^\+?[\d\s().-]+$/, "Please enter a valid phone number."),
    email: z.string().trim().email("Please enter a valid email address.").max(255),
    state: z.string().trim().min(1, "Please enter the delivery state.").max(60),
    city: z.string().trim().min(1, "Please enter the delivery city.").max(120),
    notes: z.string().trim().max(1000),
  }),
  lines: z
    .array(
      z.object({
        productId: z
          .string()
          .refine((id) => products.some((p) => p.id === id), "Please select a valid product."),
        quantity: z
          .number()
          .finite()
          .positive("Each product quantity must be greater than zero.")
          .max(10_000_000, "Quantity cannot exceed 10,000,000."),
      }),
    )
    .min(1, "Please add a product.")
    .max(50, "A quote can contain at most 50 products."),
});

export type Quote = z.infer<typeof quoteSchema>;
export type Fields = Quote["fields"];
export type Line = Quote["lines"][number];

export function calculateQuoteTotal(lines: Line[]) {
  return lines.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId);
    if (
      !product ||
      !Number.isFinite(line.quantity) ||
      line.quantity <= 0 ||
      line.quantity > 10_000_000
    ) {
      throw new Error("Invalid quote line");
    }
    return sum + product.price * line.quantity;
  }, DELIVERY_ALLOWANCE);
}
