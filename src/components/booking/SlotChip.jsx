import React from "react";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// A selectable time chip. It is a real radio input (so arrow keys move
// between slots); the clock icon swaps to a check when selected.
function SlotChip({ name, value, checked, onChange }) {
  return (
    <label
      className={cn(
        "relative flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary"
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span aria-hidden="true" className="relative h-4 w-4">
        <Clock className={cn("absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-200", checked ? "scale-50 opacity-0" : "opacity-100")} />
        <Check className={cn("absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-200", checked ? "opacity-100" : "scale-50 opacity-0")} />
      </span>
      {value}
    </label>
  );
}

export default SlotChip;
