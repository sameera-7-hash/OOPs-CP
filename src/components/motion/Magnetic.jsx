import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useReveal";

// Wraps one control so it drifts slightly toward the pointer on hover.
// Only on devices with a fine, hovering pointer and without reduced
// motion; otherwise it is an inert wrapper. Marketing pages only.
function Magnetic({ children, strength = 0.25, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion() || !window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }
    const onMove = (e) => {
      const r = node.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    const onLeave = () => {
      node.style.transform = "";
    };
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      node.style.transform = "";
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic inline-flex ${className || ""}`}>
      {children}
    </span>
  );
}

export default Magnetic;
