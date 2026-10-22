import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useReveal";

// Moves the element at a fraction of the scroll speed (translate3d only),
// relative to its parent's position in the viewport. Marketing pages only.
// Does nothing under prefers-reduced-motion. Give the element some
// overscan (e.g. inset -8% 0) inside an overflow-hidden parent so its
// edges never show.
export function useParallax(speed = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const parent = node.parentElement || node;
      const r = parent.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      node.style.transform = "";
    };
  }, [speed]);

  return ref;
}
