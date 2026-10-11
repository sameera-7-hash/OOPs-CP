import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "status-badge inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-secondary text-accent-foreground",
        success: "border-success/25 bg-success/10 text-success",
        warning: "border-warning/25 bg-warning/10 text-warning",
        info: "border-info/25 bg-info/10 text-info",
        danger: "border-destructive/25 bg-destructive/10 text-destructive",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ variant, className, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
