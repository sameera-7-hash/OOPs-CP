import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm shadow-black/[0.03]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1 p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-sm font-bold text-card-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}
