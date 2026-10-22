import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const viewport = vi.hoisted(() => ({ mobile: false }));
vi.mock("@/hooks/use-mobile", () => ({ useIsMobile: () => viewport.mobile }));

function State() {
  const { state, openMobile } = useSidebar();
  return (
    <output data-testid="sidebar-state">
      {state}:{String(openMobile)}
    </output>
  );
}

beforeEach(() => {
  viewport.mobile = false;
  document.cookie = "sidebar_state=; path=/; max-age=0";
});
afterEach(() => vi.restoreAllMocks());

describe("sidebar public components", () => {
  it("requires a provider for context consumers", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<State />)).toThrow("useSidebar must be used within a SidebarProvider");
  });

  it("composes the public exports and toggles desktop state with a persisted preference", async () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Navigation</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Company</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <a href="/products">Products</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
        <State />
      </SidebarProvider>,
    );
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("data-active", "true");
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded:false");
    await userEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("collapsed:false");
    expect(document.cookie).toContain("sidebar_state=false");
  });

  it("notifies controlled owners without changing their state behind their back", async () => {
    const onChange = vi.fn();
    const view = render(
      <SidebarProvider open onOpenChange={onChange}>
        <SidebarTrigger />
        <State />
      </SidebarProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded:false");
    view.rerender(
      <SidebarProvider open={false} onOpenChange={onChange}>
        <SidebarTrigger />
        <State />
      </SidebarProvider>,
    );
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("collapsed:false");
  });

  it("responds to the keyboard shortcut and removes its listener on unmount", () => {
    const removeListener = vi.spyOn(window, "removeEventListener");
    const view = render(
      <SidebarProvider defaultOpen={false}>
        <State />
      </SidebarProvider>,
    );
    fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded:false");
    fireEvent.keyDown(window, { key: "b", metaKey: true });
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("collapsed:false");
    view.unmount();
    expect(removeListener).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("opens and closes the mobile panel without collapsing the desktop preference", async () => {
    viewport.mobile = true;
    function MobileExample() {
      const [open, setOpen] = useState(true);
      return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
          <Sidebar>Mobile navigation</Sidebar>
          <SidebarTrigger />
          <State />
        </SidebarProvider>
      );
    }
    render(<MobileExample />);
    await userEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Mobile navigation");
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded:true");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded:false");
  });
});
