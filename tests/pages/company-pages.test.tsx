import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import About from "@/pages/about";
import Fleet from "@/pages/fleet";
import Projects from "@/pages/projects";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import NotFound from "@/pages/_error";
import { renderPage } from "../render-page";

describe("company and policy routes", () => {
  it.each([
    ["/about", About, "A dependable partner in energy."],
    ["/fleet", Fleet, "Measured at the point of delivery."],
    ["/projects", Projects, "Trusted in demanding environments."],
    ["/privacy", Privacy, "Privacy policy"],
    ["/terms", Terms, "Terms of use"],
  ] as const)(
    "renders %s with a main heading and reachable navigation",
    (pathname, Page, heading) => {
      renderPage(<Page />, { pathname });
      const main = screen.getByRole("main");
      expect(within(main).getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
        "href",
        "#main",
      );
      expect(main).toHaveAttribute("id", "main");
    },
  );
  it("provides a safe way home from missing routes", () => {
    renderPage(<NotFound />, { pathname: "/missing" });
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
  });
  it("links metered diesel delivery to the matching product enquiry", () => {
    renderPage(<Fleet />, { pathname: "/fleet" });
    const links = within(screen.getByRole("main")).getAllByRole("link");
    expect(links.some((link) => link.getAttribute("href") === "/contact?product=ago")).toBe(true);
  });
});
