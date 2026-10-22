import { useEffect, useRef, useState } from "react";

// Header state from the scroll position, for the public pages' floating
// nav: `scrolled` past a few pixels, and `hidden` while scrolling down past
// `hideAfter` (it comes back as soon as the user scrolls up). One passive
// listener, throttled to animation frames, removed on unmount.
export function useScrollHeader({ scrolledAfter = 8, hideAfter = 400 } = {}) {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const scrolled = y > scrolledAfter;
      const hidden = y > hideAfter && y > lastY.current;
      lastY.current = y;
      setState((prev) => (prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden }));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [scrolledAfter, hideAfter]);

  return state;
}
