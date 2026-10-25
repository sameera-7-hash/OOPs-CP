import { useEffect, useRef } from "react";

// The House of Dreamers cursor: a soft disc with a blurred halo that eases
// after the pointer (lerp 0.25), swells and fills with the brand colour over
// anything clickable, and draws a spinning ring when one is clicked. Tinted
// from the theme (--cursor-fill / --cursor-ring / --cursor-link). Mouse and
// pen only, skipped for reduced motion, and the loop stops once the disc has
// caught up, so an idle page costs nothing.
const FOLLOW = 0.25;
const SCALE_EASE = 0.12;
const SCALE_IDLE = 0.35;
const SCALE_LINK = 0.45;
const INTERACTIVE =
  'a, button, [role="button"], [role="tab"], [role="menuitem"], [role="option"], input, select, textarea, label, summary, [data-cursor]';

function CursorFollower() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduceMotion.matches) return undefined;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let scale = SCALE_IDLE;
    let targetScale = SCALE_IDLE;
    let frame = 0;
    let last = 0;
    let seen = false;

    const render = () => {
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    const tick = (now) => {
      // Frame-rate independent easing: the same feel at 60Hz and 144Hz.
      const steps = last ? (now - last) / (1000 / 60) : 1;
      last = now;
      const follow = 1 - (1 - FOLLOW) ** steps;
      const grow = 1 - (1 - SCALE_EASE) ** steps;
      pos.x += (target.x - pos.x) * follow;
      pos.y += (target.y - pos.y) * follow;
      scale += (targetScale - scale) * grow;
      render();

      const settled =
        Math.abs(target.x - pos.x) < 0.1 &&
        Math.abs(target.y - pos.y) < 0.1 &&
        Math.abs(targetScale - scale) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
      if (!frame) last = 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      if (event.pointerType === "touch") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!seen) {
        // First sighting: appear under the pointer instead of flying in from 0,0.
        seen = true;
        pos.x = target.x;
        pos.y = target.y;
        render();
      }
      cursor.dataset.visible = "true";
      wake();
    };

    const onOver = (event) => {
      const link = event.target instanceof Element && event.target.closest(INTERACTIVE);
      const isLink = Boolean(link) && !link.matches(":disabled");
      cursor.dataset.link = String(isLink);
      targetScale = isLink ? SCALE_LINK : SCALE_IDLE;
      wake();
    };

    const onLeave = () => {
      cursor.dataset.visible = "false";
    };

    const onDown = (event) => {
      if (event.pointerType === "touch") return;
      if (!(event.target instanceof Element) || !event.target.closest(INTERACTIVE)) return;
      // Restart the ring-draw animation.
      ring.classList.remove("is-drawing");
      void ring.getBoundingClientRect();
      ring.classList.add("is-drawing");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor-follower" data-link="false" data-visible="false" aria-hidden="true">
      <svg ref={ringRef} className="cursor-follower__ring" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" />
      </svg>
    </div>
  );
}

export default CursorFollower;
