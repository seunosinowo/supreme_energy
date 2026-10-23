import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "./context-menu";

describe("context menu", () => {
  it("opens at the pointer and supports keyboard activation without enabling disabled items", async () => {
    const user = userEvent.setup(),
      selected = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>Quote actions</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel inset>Quote</ContextMenuLabel>
          <ContextMenuItem inset onSelect={selected}>
            Download
          </ContextMenuItem>
          <ContextMenuItem disabled>Unavailable</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText("Quote actions"), { clientX: 20, clientY: 30 });
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Download" })).toHaveFocus());
    expect(screen.getByRole("menuitem", { name: "Unavailable" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.keyboard("{Enter}");
    expect(selected).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
  it("preserves choice callbacks and dismisses with Escape", async () => {
    const user = userEvent.setup(),
      checked = vi.fn(),
      unit = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>Options</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked={false} onCheckedChange={checked}>
            Notes
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value="litre" onValueChange={unit}>
            <ContextMenuRadioItem value="litre">Litres</ContextMenuRadioItem>
            <ContextMenuRadioItem value="kg">Kilograms</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>,
    );
    const open = () =>
      fireEvent.contextMenu(screen.getByText("Options"), { clientX: 20, clientY: 30 });
    open();
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Notes" }));
    expect(checked).toHaveBeenCalledWith(true);
    open();
    await user.click(screen.getByRole("menuitemradio", { name: "Kilograms" }));
    expect(unit).toHaveBeenCalledWith("kg");
    open();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
