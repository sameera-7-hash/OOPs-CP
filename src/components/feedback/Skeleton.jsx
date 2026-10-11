import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn("skeleton h-4", className)} />;
}

// Placeholder rows shown while a list loads. The visible shimmer is
// decorative; screen readers get the label instead.
export function SkeletonRows({ rows = 3, label = "Loading…", className }) {
  return (
    <div role="status" className={cn("flex flex-col gap-3", className)}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
