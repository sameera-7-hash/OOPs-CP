import React from "react";
import { cn } from "@/lib/utils";

// A rounded icon tile in one of the palette's hues. Different hues help
// cards read apart at a glance; the label next to the tile carries the
// meaning, so colour is never the only signal.
export const TONES = {
  teal: "bg-secondary text-primary",
  blue: "bg-info/10 text-info",
  amber: "bg-warning/10 text-warning",
  green: "bg-success/10 text-success",
  rose: "bg-destructive/10 text-destructive",
};

export const TONE_CYCLE = ["teal", "blue", "amber", "green"];

function IconTile({ icon: Icon, tone = "teal", size = "md", className }) {
  return (
    <span
      className={cn(
        "icon-tile grid shrink-0 place-items-center rounded-lg",
        size === "lg" ? "h-12 w-12" : "h-10 w-10",
        TONES[tone] || TONES.teal,
        className
      )}
    >
      <Icon aria-hidden="true" className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
    </span>
  );
}

export default IconTile;
