import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({ className, sideOffset = 8, align = "end", ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 max-h-96 w-72 overflow-y-auto rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl data-[state=open]:animate-in",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "block w-full cursor-pointer rounded-md px-3 py-2 text-left text-xs text-foreground outline-none transition-colors data-[highlighted]:bg-muted",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, ...props }) {
  return (
    <div
      className={cn("px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return <DropdownMenuPrimitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} />;
}
