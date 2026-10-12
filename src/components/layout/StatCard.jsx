import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import SampleTag from "@/components/feedback/SampleTag";
import IconTile from "@/components/IconTile";
import { cn } from "@/lib/utils";

const COUNT_MS = 600;

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Counts a numeric value up from 0 once, when the card scrolls into view.
// Non-numeric values ("OK", "…") are shown as-is.
function useCountUp(value) {
  const ref = useRef(null);
  const numeric = typeof value === "number" || /^\d+$/.test(String(value));
  const target = numeric ? Number(value) : 0;
  const [shown, setShown] = useState(numeric ? 0 : value);
  const started = useRef(false);

  useEffect(() => {
    if (!numeric) {
      setShown(value);
      return undefined;
    }
    const node = ref.current;
    let frame;
    const run = () => {
      if (reducedMotion() || target === 0 || started.current) {
        setShown(target);
        return;
      }
      started.current = true;
      const begin = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - begin) / COUNT_MS);
        setShown(Math.round(target * (1 - (1 - t) ** 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    if (!node || !("IntersectionObserver" in window)) {
      run();
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        run();
      }
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [numeric, target, value]);

  return [ref, shown];
}

// `sample` marks a value that is hard-coded rather than from the backend.
// `tone` picks the icon tile's hue (teal, blue, amber, green, rose).
function StatCard({ label, value, note, icon, tone = "teal", noteTone = "muted", sample = false }) {
  const [ref, shown] = useCountUp(value);

  return (
    <Card ref={ref} className="card-lift p-4 sm:p-6">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-snug text-muted-foreground">{label}</span>
        {icon && <IconTile icon={icon} tone={tone} className="h-9 w-9 sm:h-11 sm:w-11" />}
      </div>
      <strong className="mt-3 block text-3xl font-semibold tracking-tight tabular-nums text-foreground sm:text-4xl">{shown}</strong>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {note && (
          <small className={cn("text-sm", noteTone === "success" ? "text-success" : "text-muted-foreground")}>
            {note}
          </small>
        )}
        {sample && <SampleTag />}
      </div>
    </Card>
  );
}

export default StatCard;
