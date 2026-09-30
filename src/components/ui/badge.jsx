import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary",
        success: "bg-success/15 text-success",
        warning: "bg-warning/20 text-warning",
        danger: "bg-destructive/15 text-destructive",
        outline: "border border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ variant, className, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
