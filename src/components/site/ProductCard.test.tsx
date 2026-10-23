import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";
import { products } from "@/data/products";

describe("product cards", () => {
  const product = products[0];
  it("shows the specification and links to a preselected quote", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.note)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Request quote" })).toHaveAttribute(
      "href",
      `/quote?product=${product.id}`,
    );
  });
  it("keeps specifications while hiding optional detail and actions in compact boards", () => {
    render(<ProductCard product={product} compact hideQuoteButton />);
    expect(screen.queryByText(product.note)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(product.density)).toBeInTheDocument();
    expect(screen.getByText(product.flashPoint)).toBeInTheDocument();
  });
});
