import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Quote from "@/pages/quote";
import Contact from "@/pages/contact";
import { company } from "@/lib/site";
import { renderPage } from "../render-page";

describe("quote entry routes", () => {
  it.each([
    ["/quote", Quote],
    ["/contact", Contact],
  ] as const)("preselects catalogue products on %s", (pathname, Page) => {
    renderPage(<Page />, { pathname, query: { product: "lpg" } });
    expect(screen.getByRole("combobox")).toHaveValue("lpg");
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeEnabled();
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("link", { name: new RegExp(company.email) })).toHaveAttribute(
      "href",
      `mailto:${company.email}`,
    );
  });
  it.each([undefined, "unknown"])(
    "falls back to diesel for missing or unrecognized product links (%s)",
    (product) => {
      renderPage(<Quote />, { pathname: "/quote", query: product ? { product } : {} });
      expect(screen.getByRole("combobox")).toHaveValue("ago");
    },
  );
  it("tells customers the contact form does not queue or send their request", () => {
    renderPage(<Contact />, { pathname: "/contact" });
    expect(screen.getByText(/It does not send or queue a request/)).toBeInTheDocument();
  });
});
