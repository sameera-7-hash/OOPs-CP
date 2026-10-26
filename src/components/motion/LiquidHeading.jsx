import React, { useEffect, useId, useRef } from "react";

// A heading that ripples like water around the pointer. An SVG filter
// bends the text with drifting fractal noise, masked to a soft spot under
// the cursor; moving faster stirs it harder, and it settles back to crisp
// text when the pointer stops or leaves. The text stays real text. Mouse
// and pen only, skipped for reduced motion, and the filter is detached
// whenever it's calm so idle text is never resampled.
const SPOT = 280; // diameter of the rippling area, px
const IDLE_SCALE = 5; // gentle ripple while merely hovering
const MAX_ENERGY = 30;

// White at the centre fading to black: where the noise is let through.
const SPOT_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SPOT}" height="${SPOT}"><defs><radialGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient></defs><circle cx="${SPOT / 2}" cy="${SPOT / 2}" r="${SPOT / 2}" fill="url(#g)"/></svg>`
)}`;

function LiquidHeading({ as: Tag = "h1", className, children }) {
  const filterId = `liquid-${useId().replace(/:/g, "")}`;
  const headingRef = useRef(null);
  const turbulenceRef = useRef(null);
  const spotRef = useRef(null);
  const displaceRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduceMotion.matches) return undefined;

    const heading = headingRef.current;
    let hovering = false;
    let energy = 0;
    let scale = 0;
    let last = null;
    let frame = 0;

    const tick = (now) => {
      energy *= 0.93;
      const target = (hovering ? IDLE_SCALE : 0) + energy;
      scale += (target - scale) * 0.18;
      displaceRef.current.setAttribute("scale", scale.toFixed(2));
      // Drifting frequencies keep the surface flowing rather than frozen.
      turbulenceRef.current.setAttribute(
        "baseFrequency",
        `${(0.008 + 0.002 * Math.sin(now / 700)).toFixed(4)} ${(0.016 + 0.004 * Math.cos(now / 900)).toFixed(4)}`
      );

      // Below ~0.3px the ripple is invisible; drop the filter for crisp text.
      if (!hovering && scale < 0.3) {
        heading.style.filter = "";
        frame = 0;
        return;
      }
      heading.style.filter = `url(#${filterId})`;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      if (event.pointerType === "touch") return;
      const rect = heading.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      spotRef.current.setAttribute("x", x - SPOT / 2);
      spotRef.current.setAttribute("y", y - SPOT / 2);
      if (last) energy = Math.min(MAX_ENERGY, energy + Math.hypot(x - last.x, y - last.y) * 0.3);
      last = { x, y };
      hovering = true;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      hovering = false;
      last = null;
    };

    heading.addEventListener("pointermove", onMove, { passive: true });
    heading.addEventListener("pointerleave", onLeave);
    return () => {
      heading.removeEventListener("pointermove", onMove);
      heading.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      heading.style.filter = "";
    };
  }, [filterId]);

  // The filter's <svg> sits inside the heading (zero-size, hidden from
  // assistive tech) so the heading stays a single element in the layout.
  return (
    <Tag ref={headingRef} className={className}>
      {children}
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        {/* Displacement treats 0.5 as "no shift", so outside the spot the
            map is held at 0.5: map = noise * spot + 0.5 * (1 - spot). */}
        <filter id={filterId} x="-10%" y="-25%" width="120%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0.008 0.016" numOctaves="1" seed="3" result="noiseRaw" />
          <feColorMatrix in="noiseRaw" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1" result="noise" />
          <feFlood floodColor="#000" result="black" />
          <feImage ref={spotRef} href={SPOT_IMAGE} x="-9999" y="-9999" width={SPOT} height={SPOT} preserveAspectRatio="none" result="spotRaw" />
          <feMerge result="spot">
            <feMergeNode in="black" />
            <feMergeNode in="spotRaw" />
          </feMerge>
          <feComposite in="noise" in2="spot" operator="arithmetic" k1="1" k2="0" k3="-0.5" k4="0.5" result="map" />
          <feDisplacementMap ref={displaceRef} in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </Tag>
  );
}

export default LiquidHeading;
