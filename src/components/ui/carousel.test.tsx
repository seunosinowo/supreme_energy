import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

const engine = vi.hoisted(() => ({
  use: vi.fn(),
  api: {
    canScrollPrev: vi.fn(),
    canScrollNext: vi.fn(),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));
vi.mock("embla-carousel-react", () => ({ default: engine.use }));

beforeEach(() => {
  vi.clearAllMocks();
  engine.api.canScrollPrev.mockReturnValue(false);
  engine.api.canScrollNext.mockReturnValue(true);
  engine.use.mockReturnValue([vi.fn(), engine.api]);
});

function Example({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return (
    <Carousel orientation={orientation} aria-label="Products">
      <CarouselContent>
        <CarouselItem>Diesel</CarouselItem>
        <CarouselItem>Petrol</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <input aria-label="Quantity" />
    </Carousel>
  );
}

describe("carousel controls", () => {
  it("disables boundary controls and refreshes them after slide selection", () => {
    render(<Example />);
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(engine.api.scrollNext).toHaveBeenCalledOnce();
    engine.api.canScrollPrev.mockReturnValue(true);
    engine.api.canScrollNext.mockReturnValue(false);
    const select = engine.api.on.mock.calls.find(([name]) => name === "select")![1];
    act(() => select(engine.api));
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });
  it("uses left/right keys for a horizontal carousel", () => {
    render(<Example />);
    const carousel = screen.getByRole("region", { name: "Products" });
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    fireEvent.keyDown(carousel, { key: "ArrowLeft" });
    expect(engine.api.scrollNext).toHaveBeenCalledOnce();
    expect(engine.api.scrollPrev).toHaveBeenCalledOnce();
  });
  it("uses up/down keys for vertical carousels", () => {
    render(<Example orientation="vertical" />);
    const carousel = screen.getByRole("region", { name: "Products" });
    fireEvent.keyDown(carousel, { key: "ArrowDown" });
    fireEvent.keyDown(carousel, { key: "ArrowUp" });
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(engine.api.scrollNext).toHaveBeenCalledOnce();
    expect(engine.api.scrollPrev).toHaveBeenCalledOnce();
    expect(engine.use).toHaveBeenCalledWith(expect.objectContaining({ axis: "y" }), undefined);
  });
  it("leaves arrow keys available for editing fields inside slides", () => {
    render(<Example />);
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Quantity" }), { key: "ArrowRight" });
    expect(engine.api.scrollNext).not.toHaveBeenCalled();
  });
  it("unsubscribes from both engine events when unmounted", () => {
    const view = render(<Example />);
    const listeners = [...engine.api.on.mock.calls];
    view.unmount();
    expect(engine.api.off).toHaveBeenCalledTimes(2);
    for (const [name, listener] of listeners)
      expect(engine.api.off).toHaveBeenCalledWith(name, listener);
  });
  it("exposes the engine through setApi and stays safe before it is ready", () => {
    const setApi = vi.fn();
    const view = render(
      <Carousel setApi={setApi}>
        <CarouselNext />
      </Carousel>,
    );
    expect(setApi).toHaveBeenCalledWith(engine.api);
    view.unmount();
    engine.use.mockReturnValue([vi.fn(), undefined]);
    render(
      <Carousel>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>,
    );
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  });
  it("rejects controls rendered without a carousel provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<CarouselNext />)).toThrow(
      "useCarousel must be used within a <Carousel />",
    );
    vi.restoreAllMocks();
  });
});
