import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;

export function SheetContent({ className, side = "left", title, children, ...props }) {
  const { t } = useTranslation();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim data-[state=open]:animate-in" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          "fixed z-50 flex h-full w-72 max-w-[85vw] flex-col border-border bg-card p-4 text-card-foreground shadow-2xl data-[state=open]:animate-in",
          side === "left" ? "left-0 top-0 border-r" : "right-0 top-0 border-l",
          className
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">{title || t("Menu")}</DialogPrimitive.Title>
        {children}
        <DialogPrimitive.Close
          aria-label={t("Close menu")}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
