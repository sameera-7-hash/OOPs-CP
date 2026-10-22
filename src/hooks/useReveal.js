import { useEffect, useRef, useState } from "react";

// True once the element has scrolled into view (and stays true). Without
// IntersectionObserver it reports visible straight away, so content is
// never left hidden. The hidden "before" state only exists while
// <html class="motion-ok"> is set (main.jsx), so if scripts are slow or
// fail, everything renders in place.
export function useReveal({ threshold = 0.15, rootMargin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
