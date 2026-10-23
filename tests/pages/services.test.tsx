import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Services from "@/pages/services";
import { services } from "@/lib/site";
import { renderPage } from "../render-page";

describe("services page", () => {
  it("renders the service catalogue and provides a working project-enquiry destination", () => {
    renderPage(<Services />, { pathname: "/services" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "One team. Many moving parts.",
    );
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(services.length);
    for (const service of services) {
      const card = within(
        cards.find((card) => within(card).queryByRole("heading", { name: service.title }))!,
      );
      expect(card.getByText(service.text)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Discuss your project" })).toHaveAttribute(
      "href",
      "/quote",
    );
  });
});
