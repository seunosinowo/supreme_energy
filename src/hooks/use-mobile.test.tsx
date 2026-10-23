import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./use-mobile";

afterEach(() => vi.unstubAllGlobals());

describe("mobile viewport detection", () => {
  it.each([
    [767, true],
    [768, false],
    [1440, false],
  ])("classifies width %i as mobile=%s", (width, mobile) => {
    vi.stubGlobal("innerWidth", width);
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    );
    const { result } = renderHook(useIsMobile);
    expect(result.current).toBe(mobile);
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });
  it("updates on breakpoint changes and releases the listener", () => {
    vi.stubGlobal("innerWidth", 1024);
    const addEventListener = vi.fn(),
      removeEventListener = vi.fn();
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ addEventListener, removeEventListener }));
    const view = renderHook(useIsMobile);
    const listener = addEventListener.mock.calls[0][1];
    vi.stubGlobal("innerWidth", 600);
    act(() => listener());
    expect(view.result.current).toBe(true);
    view.unmount();
    expect(removeEventListener).toHaveBeenCalledWith("change", listener);
  });
});
