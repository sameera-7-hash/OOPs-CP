import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Fades and rises children into place the first time they scroll into
// view. `delay` is in seconds so a group of siblings can stagger
// (multiples of 0.06 match the design's 60ms stagger). `as` picks the
// element tag. Motion is CSS-only (.reveal in index.css) and is skipped
// entirely under prefers-reduced-motion.
function FadeIn({ children, delay = 0, className, as: Tag = "div", y = 16, ...rest }) {
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
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ "--reveal-delay": `${Math.round(delay * 1000)}ms`, "--reveal-y": `${y}px` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default FadeIn;
