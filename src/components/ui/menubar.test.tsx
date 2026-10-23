import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
} from "./menubar";

describe("menubar interactions", () => {
  it("opens from the keyboard, skips disabled actions and closes after selection", async () => {
    const user = userEvent.setup(),
      select = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Quote</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel inset>Actions</MenubarLabel>
            <MenubarItem onSelect={select}>
              Download <MenubarShortcut>Enter</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>Unavailable</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Contact</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    await user.tab();
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Download Enter" })).toHaveFocus(),
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Contact" })).toHaveFocus();
    await user.keyboard("{ArrowUp}{Enter}");
    expect(select).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
  it("preserves checkbox/radio callbacks and returns focus after Escape", async () => {
    const user = userEvent.setup(),
      checked = vi.fn(),
      unit = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Options</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={false} onCheckedChange={checked}>
              Notes
            </MenubarCheckboxItem>
            <MenubarRadioGroup value="litre" onValueChange={unit}>
              <MenubarRadioItem value="litre">Litres</MenubarRadioItem>
              <MenubarRadioItem value="kg">Kilograms</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    const trigger = screen.getByRole("menuitem", { name: "Options" });
    await user.click(trigger);
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Notes" }));
    expect(checked).toHaveBeenCalledWith(true);
    await user.click(trigger);
    await user.click(screen.getByRole("menuitemradio", { name: "Kilograms" }));
    expect(unit).toHaveBeenCalledWith("kg");
    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
