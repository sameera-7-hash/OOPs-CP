import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// A gradient "badge" for a lucide-react icon, replacing the emoji-in-a-box
// pattern the old CSS used everywhere. `animate` picks the motion: "hover"
// (scale + tilt on hover, the default), "float" (continuous gentle bob) or
// "pulse" (continuous soft glow pulse).
const gradients = {
  green: "from-brand-green to-brand-sage",
  sage: "from-brand-sage to-brand-green",
  deep: "from-brand-primary to-brand-deep",
  amber: "from-brand-primary to-brand-deep",
  rose: "from-brand-sage to-brand-green",
};

const sizes = {
  xs: "h-7 w-7 rounded-lg [&>svg]:h-3.5 [&>svg]:w-3.5",
  sm: "h-9 w-9 rounded-xl [&>svg]:h-4 [&>svg]:w-4",
  md: "h-12 w-12 rounded-2xl [&>svg]:h-6 [&>svg]:w-6",
  lg: "h-16 w-16 rounded-2xl [&>svg]:h-8 [&>svg]:w-8",
};

export function AnimatedIcon({ icon: Icon, gradient = "green", size = "md", animate = "hover", className }) {
  const foreground = gradient === "deep" || gradient === "amber"
    ? "text-brand-light"
    : "text-brand-deep";
  const floatAnim =
    animate === "float"
      ? { y: [0, -6, 0] }
      : animate === "pulse"
      ? { scale: [1, 1.06, 1] }
      : undefined;

  return (
    <motion.span
      className={cn(
        "inline-flex flex-shrink-0 items-center justify-center bg-gradient-to-br shadow-md shadow-black/10",
        foreground,
        gradients[gradient],
        sizes[size],
        className
      )}
      animate={floatAnim}
      transition={floatAnim ? { duration: animate === "float" ? 3.2 : 2.2, repeat: Infinity, ease: "easeInOut" } : undefined}
      whileHover={animate === "hover" ? { scale: 1.1, rotate: -6 } : undefined}
    >
      <Icon strokeWidth={2.25} />
    </motion.span>
  );
}
