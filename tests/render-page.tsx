import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import type { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { vi } from "vitest";

export function renderPage(
  page: ReactElement,
  { pathname = "/", query = {} }: { pathname?: string; query?: NextRouter["query"] } = {},
) {
  const router: NextRouter = {
    basePath: "",
    pathname,
    route: pathname,
    asPath: pathname,
    query,
    push: vi.fn(async () => true),
    replace: vi.fn(async () => true),
    reload: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(async () => {}),
    beforePopState: vi.fn(),
    events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
    isFallback: false,
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
  };
  return {
    router,
    ...render(<RouterContext.Provider value={router}>{page}</RouterContext.Provider>),
  };
}
