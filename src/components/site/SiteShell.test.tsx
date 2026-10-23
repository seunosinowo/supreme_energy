import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SiteShell, PageIntro } from "./SiteShell";
import { renderPage } from "../../../tests/render-page";

describe("site navigation", () => {
  it("announces the active route and whether mobile navigation is expanded", async () => {
    renderPage(
      <SiteShell>
        <h1>Content</h1>
      </SiteShell>,
      { pathname: "/products" },
    );
    const desktop = within(screen.getByRole("navigation", { name: "Main navigation" }));
    expect(desktop.getByRole("link", { name: "Products" })).toHaveAttribute("aria-current", "page");
    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const mobile = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(toggle).toHaveAttribute("aria-controls", mobile.id);
    expect(within(mobile).getByRole("link", { name: "Products" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await userEvent.click(toggle);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });
  it("closes on Escape and restores keyboard focus to the toggle", async () => {
    const user = userEvent.setup();
    renderPage(<SiteShell>Content</SiteShell>);
    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    await user.click(toggle);
    const mobile = screen.getByRole("navigation", { name: "Mobile navigation" });
    within(mobile).getByRole("link", { name: "Products" }).focus();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
  it("closes the disclosure after choosing a destination", async () => {
    const user = userEvent.setup();
    renderPage(<SiteShell>Content</SiteShell>);
    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    await user.click(toggle);
    const mobile = screen.getByRole("navigation", { name: "Mobile navigation" });
    await user.click(within(mobile).getByRole("link", { name: "Services" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });
});

describe("page introductions", () => {
  it("renders text and optional actions without requiring an image", () => {
    render(
      <PageIntro eyebrow="Company" title="About us" text="Our work">
        <a href="/contact">Contact us</a>
      </PageIntro>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "About us" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("uses an empty alternative for a decorative image when no description is supplied", () => {
    render(
      <PageIntro eyebrow="Company" title="Our fleet" text="Delivery" image="/fleet-road.jpeg" />,
    );
    expect(screen.getByAltText("")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our fleet" })).toBeInTheDocument();
  });
});
