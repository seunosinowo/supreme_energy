import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "@/pages/index";
import { renderPage } from "../render-page";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("home page slideshow", () => {
  it("wraps navigation, supports direct selection and keeps hidden calls to action out of the tab order", () => {
    renderPage(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ENERGY.");
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LOADED.");
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ENERGY.");
    fireEvent.click(screen.getByRole("button", { name: "Go to slide 2" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BULK STORAGE.");
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const hero = screen.getByRole("region", { name: "Supreme Energy hero slideshow" });
    expect(
      within(hero)
        .getAllByRole("link", { hidden: true })
        .map((link) => link.tabIndex),
    ).toEqual([-1, 0, -1]);
    expect(screen.getByRole("link", { name: "View all products" })).toHaveAttribute(
      "href",
      "/products",
    );
  });
  it("advances automatically and supports explicit pause and resume", () => {
    vi.useFakeTimers();
    renderPage(<Home />);
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BULK STORAGE.");
    fireEvent.click(screen.getByRole("button", { name: "Pause slideshow" }));
    act(() => vi.advanceTimersByTime(12000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BULK STORAGE.");
    fireEvent.click(screen.getByRole("button", { name: "Resume slideshow" }));
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LOADED.");
  });
  it("suspends automatic rotation while hovered or keyboard-focused", () => {
    vi.useFakeTimers();
    renderPage(<Home />);
    const hero = screen.getByRole("region", { name: "Supreme Energy hero slideshow" });
    fireEvent.mouseEnter(hero);
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ENERGY.");
    fireEvent.mouseLeave(hero);
    fireEvent.focus(screen.getByRole("button", { name: "Next slide" }));
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ENERGY.");
    fireEvent.blur(hero, { relatedTarget: document.body });
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BULK STORAGE.");
  });
  it("honours reduced-motion preferences and removes its preference listener", () => {
    vi.useFakeTimers();
    const removeEventListener = vi.fn();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener }),
    );
    const view = renderPage(<Home />);
    act(() => vi.advanceTimersByTime(18000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ENERGY.");
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BULK STORAGE.");
    view.unmount();
    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
