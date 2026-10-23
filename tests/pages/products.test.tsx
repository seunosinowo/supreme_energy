import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Products from "@/pages/products";
import { products, PRICE_LAST_UPDATED } from "@/data/products";
import { renderPage } from "../render-page";

describe("products page", () => {
  it("publishes current catalogue prices, specifications and product-specific quote links", () => {
    renderPage(<Products />, { pathname: "/products" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Quality products. Clear pricing.",
    );
    expect(screen.getByText(`Last updated ${PRICE_LAST_UPDATED}`)).toBeInTheDocument();
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(products.length);
    for (const product of products) {
      const card = within(cards.find((card) => within(card).queryByText(product.name))!);
      expect(card.getByText(`₦${product.price.toLocaleString()}`)).toBeInTheDocument();
      expect(card.getByText(`/${product.unit}`)).toBeInTheDocument();
      expect(card.getByText(product.density)).toBeInTheDocument();
      expect(card.getByText(product.flashPoint)).toBeInTheDocument();
      expect(card.getByRole("link", { name: "Request quote" })).toHaveAttribute(
        "href",
        `/quote?product=${product.id}`,
      );
    }
    expect(screen.getByText(/Final quote depends on quantity/)).toBeInTheDocument();
  });
});
