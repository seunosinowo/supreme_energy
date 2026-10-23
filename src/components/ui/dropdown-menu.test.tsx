import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./dropdown-menu";

describe("dropdown menu", () => {
  it("preserves forwarded refs, keyboard selection, disabled items and Escape focus", async () => {
    const user = userEvent.setup(),
      selected = vi.fn(),
      ref = createRef<HTMLDivElement>();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>Quote</DropdownMenuLabel>
          <DropdownMenuItem ref={ref} inset onSelect={selected}>
            Download
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.tab();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Download" })).toHaveFocus());
    expect(ref.current).toBe(screen.getByRole("menuitem", { name: "Download" }));
    expect(screen.getByRole("menuitem", { name: "Unavailable" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.keyboard("{Enter}");
    expect(selected).toHaveBeenCalledOnce();
    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it("keeps checkbox and radio selection semantics", async () => {
    const user = userEvent.setup(),
      checked = vi.fn(),
      unit = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={false} onCheckedChange={checked}>
            Notes
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="litre" onValueChange={unit}>
            <DropdownMenuRadioItem value="litre">Litres</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="kg">Kilograms</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Options" });
    await user.click(trigger);
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Notes" }));
    expect(checked).toHaveBeenCalledWith(true);
    await user.click(trigger);
    await user.click(screen.getByRole("menuitemradio", { name: "Kilograms" }));
    expect(unit).toHaveBeenCalledWith("kg");
  });
});
