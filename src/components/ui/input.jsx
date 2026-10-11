import React from "react";
import { cn } from "@/lib/utils";

export const fieldClasses =
  "w-full rounded-lg border border-input bg-card px-4 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:opacity-50 aria-[invalid=true]:border-destructive sm:text-sm";

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return <input type={type} ref={ref} className={cn("flex h-11", fieldClasses, className)} {...props} />;
});
Input.displayName = "Input";
