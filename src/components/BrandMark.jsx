import React from "react";
import { cn } from "@/lib/utils";

// Lighthouse logo with a softly breathing lamp halo (.brand-glow).
// `className` sizes the mark, as before.
function BrandMark({ className = "" }) {
  return (
    <span aria-hidden="true" className={cn("brand-glow h-9 w-9", className)}>
      <img src="/beacon-lighthouse.svg" alt="" className="h-full w-full object-contain" />
    </span>
  );
}

export default BrandMark;
