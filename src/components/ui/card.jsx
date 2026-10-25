import React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
));
Card.displayName = "Card";

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h2 className={cn("font-sans text-base font-semibold text-card-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
