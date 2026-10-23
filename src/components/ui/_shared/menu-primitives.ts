import { cn } from "@/lib/utils";

// Share visual contracts while keeping each Radix primitive's own typed ref,
// focus management, selection semantics and public component API intact.
export function menuItemClassName(className?: string, inset?: boolean) {
  return cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    inset && "pl-8",
    className,
  );
}

export function menuChoiceClassName(className?: string) {
  return cn(
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className,
  );
}

export function menuLabelClassName(className?: string, inset?: boolean) {
  return cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className);
}
