import React, { useEffect, useState } from "react";
import { arrival } from "@/lib/pageTransition";

// A warm disc of light centred on (x, y): white-gold at the core, the page
// background further out, soft at the rim. The landing grows it from the
// lighthouse lamp to fill the screen ("in"); Home opens under the same
// fully grown light and fades it away ("out").
export function LightBloom({ x, y, phase }) {
  return <div className={`light-bloom light-bloom--${phase}`} style={{ left: x, top: y }} aria-hidden="true" />;
}

// Mounted by Home: if we just came through the landing's light, start
// covered by it and let it fade.
export function ArrivalLight() {
  const [from] = useState(() => (arrival.fromLanding ? arrival.lamp : null));
  const [done, setDone] = useState(false);

  useEffect(() => {
    arrival.fromLanding = false;
  }, []);

  if (!from || done) return null;
  return (
    <div onAnimationEnd={() => setDone(true)}>
      <LightBloom x={from.x} y={from.y} phase="out" />
    </div>
  );
}
