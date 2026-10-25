import React from "react";
import { cn } from "@/lib/utils";

function BrandMark({ className = "" }) {
  return (
    <img
      src="/beacon-lighthouse.svg"
      alt=""
      aria-hidden="true"
      className={cn("h-9 w-9 shrink-0 object-contain", className)}
    />
  );
}

export default BrandMark;
