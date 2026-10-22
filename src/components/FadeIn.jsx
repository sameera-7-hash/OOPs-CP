import React from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

// Reveals children the first time they scroll into view (the <Reveal>
// wrapper). `variant`: "fade-up" (default), "fade", "fade-left", "scale",
// or "clip" (a bottom-to-top curtain for images, with a slight zoom-out).
// `delay` is in seconds so siblings can stagger (multiples of 0.06 match
// the design's 60ms stagger). `as` picks the tag. Motion is CSS-only
// (.reveal in index.css) and skipped under prefers-reduced-motion.
function FadeIn({ children, delay = 0, className, as: Tag = "div", y = 16, variant = "fade-up", style, ...rest }) {
  const [ref, visible] = useReveal();

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ "--reveal-delay": `${Math.round(delay * 1000)}ms`, "--reveal-y": `${y}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default FadeIn;
export { FadeIn as Reveal };
