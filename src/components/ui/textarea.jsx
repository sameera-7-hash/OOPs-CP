import React from "react";
import { cn } from "@/lib/utils";
import { fieldClasses } from "./input";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return <textarea ref={ref} className={cn("flex min-h-28 resize-y py-3", fieldClasses, className)} {...props} />;
});
Textarea.displayName = "Textarea";
