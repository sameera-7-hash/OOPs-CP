import React from "react";
import { cn } from "@/lib/utils";

// A rounded icon tile in one of the palette's hues. "solid" tiles (the
// default) are filled with the hue and carry a white icon; "soft" tiles
// are a pale tint. The label next to the tile carries the meaning, so
// colour is never the only signal. Every solid hue clears AA with white.
export const TONES = {
  teal: "bg-secondary text-primary",
  blue: "bg-info/10 text-info",
  amber: "bg-warning/10 text-warning",
  green: "bg-success/10 text-success",
  rose: "bg-destructive/10 text-destructive",
};

const SOLID = {
  teal: "bg-primary-gradient bg-primary text-primary-foreground shadow-primary",
  blue: "bg-info text-card",
  amber: "bg-warning text-card",
  green: "bg-success text-card",
  rose: "bg-destructive text-card",
};

export const TONE_CYCLE = ["teal", "blue", "amber", "green"];

function IconTile({ icon: Icon, tone = "teal", variant = "solid", size = "md", className }) {
  const palette = variant === "soft" ? TONES : SOLID;
  return (
    <span
      className={cn(
        "icon-tile grid shrink-0 place-items-center rounded-xl",
        size === "lg" ? "h-12 w-12" : "h-11 w-11",
        variant === "solid" && "shadow-sm",
        palette[tone] || palette.teal,
        className
      )}
    >
      <Icon aria-hidden="true" className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
    </span>
  );
}

export default IconTile;
