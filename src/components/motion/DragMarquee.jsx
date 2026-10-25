import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// An endless horizontal strip that drifts on its own and can be dragged
// back and forth (mouse, touch or pen), with a little momentum on release.
// Items are rendered twice so the loop is seamless; the copy is hidden
// from assistive tech. Hovering slows the drift so cards can be read,
// arrow keys nudge it, and with reduced motion it only moves when dragged.
function DragMarquee({ items, renderItem, speed = 40, gap = 24, label, className }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let setWidth = copyRef.current.offsetWidth;
    let offset = 0;
    let velocity = 0; // px/s left over from a drag, decays to 0
    let hovering = false;
    let drag = null; // { x, offset, lastX, lastT }
    let last = performance.now();
    let frame = 0;

    const wrap = () => {
      if (!setWidth) return;
      offset %= setWidth;
      if (offset > 0) offset -= setWidth;
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!drag) {
        const drift = reduceMotion ? 0 : speed * (hovering ? 0.25 : 1);
        offset -= drift * dt;
        offset += velocity * dt;
        velocity *= Math.pow(0.04, dt); // ~96% of momentum gone per second
        if (Math.abs(velocity) < 5) velocity = 0;
      }
      wrap();
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };

    const onDown = (e) => {
      if (e.button !== 0) return;
      viewport.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, offset, lastX: e.clientX, lastT: performance.now() };
      velocity = 0;
      viewport.classList.add("is-dragging");
    };
    const onMove = (e) => {
      if (!drag) return;
      const now = performance.now();
      offset = drag.offset + (e.clientX - drag.x);
      const dt = (now - drag.lastT) / 1000;
      if (dt > 0) velocity = (e.clientX - drag.lastX) / dt;
      drag.lastX = e.clientX;
      drag.lastT = now;
    };
    const onUp = () => {
      if (!drag) return;
      // A pause before letting go means no fling.
      if (performance.now() - drag.lastT > 80) velocity = 0;
      velocity = Math.max(-2500, Math.min(2500, velocity));
      drag = null;
      viewport.classList.remove("is-dragging");
    };
    const onKey = (e) => {
      if (e.key === "ArrowLeft") velocity += 900;
      else if (e.key === "ArrowRight") velocity -= 900;
      else return;
      e.preventDefault();
    };
    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };

    const resize = new ResizeObserver(() => {
      setWidth = copyRef.current.offsetWidth;
    });
    resize.observe(copyRef.current);

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("keydown", onKey);
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("keydown", onKey);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
    };
  }, [speed]);

  const copyStyle = { gap: `${gap}px`, paddingRight: `${gap}px` };

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      className={cn("drag-marquee", className)}
    >
      <div ref={trackRef} className="drag-marquee__track">
        <ul ref={copyRef} className="drag-marquee__set" style={copyStyle}>
          {items.map((item, i) => (
            <li key={i} className="shrink-0">{renderItem(item)}</li>
          ))}
        </ul>
        <ul className="drag-marquee__set" style={copyStyle} aria-hidden="true" inert>
          {items.map((item, i) => (
            <li key={i} className="shrink-0">{renderItem(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DragMarquee;
