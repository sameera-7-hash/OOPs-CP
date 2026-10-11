import React from "react";
import { cn } from "@/lib/utils";

// On-brand spot illustrations: 1.75px rounded line art in the primary
// colour with a soft tint fill. Decorative only (aria-hidden); the text
// next to each one carries the meaning.

function Art({ className, children, viewBox = "0 0 96 96" }) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("stroke-primary", className)}
    >
      {children}
    </svg>
  );
}

export function CalendarCheckArt({ className }) {
  return (
    <Art className={className}>
      <rect x="14" y="20" width="68" height="60" rx="8" className="fill-secondary" />
      <path d="M14 36h68" />
      <path d="M32 14v12M64 14v12" />
      <path d="M36 57l8 8 16-16" />
    </Art>
  );
}

export function FolderCrossArt({ className }) {
  return (
    <Art className={className}>
      <path
        d="M12 32a6 6 0 0 1 6-6h18l8 8h34a6 6 0 0 1 6 6v34a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z"
        className="fill-secondary"
      />
      <path d="M48 46v20M38 56h20" />
    </Art>
  );
}

export function ClipboardChartArt({ className }) {
  return (
    <Art className={className}>
      <rect x="20" y="16" width="56" height="68" rx="8" className="fill-secondary" />
      <rect x="36" y="10" width="24" height="12" rx="4" className="fill-card" />
      <path d="M30 66l12-12 10 6 14-18" />
      <path d="M30 74h36" />
    </Art>
  );
}

export function PillArt({ className }) {
  return (
    <Art className={className}>
      <g transform="rotate(-35 48 48)">
        <rect x="16" y="36" width="64" height="24" rx="12" className="fill-card" />
        <path d="M48 36h20a12 12 0 0 1 0 24H48z" className="fill-secondary" />
      </g>
    </Art>
  );
}

export function StethoscopeArt({ className }) {
  return (
    <Art className={className}>
      <path d="M28 14v4M52 14v4" />
      <path d="M28 18v16a12 12 0 0 0 24 0V18" />
      <path d="M40 46v12a16 16 0 0 0 32 0v-4" />
      <circle cx="72" cy="46" r="8" className="fill-secondary" />
      <circle cx="72" cy="46" r="2.5" />
    </Art>
  );
}

// The hero heartbeat line. It draws itself (.ecg-line), then a short
// highlight travels along it (.ecg-trace). Both paths use
// pathLength="1000" so the CSS dash values are length-independent.
const ECG_PATH =
  "M0 120H330l18-12 18 12H440l14-74 22 140 18-96 12 30h46l16-14 16 14H760l14-50 20 92 14-60 10 18h40l16-12 16 12H1200";

export function EcgLine({ className }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("stroke-primary", className)}
    >
      <path d={ECG_PATH} pathLength="1000" strokeWidth="1.75" vectorEffect="non-scaling-stroke" className="ecg-line opacity-60" />
      <path d={ECG_PATH} pathLength="1000" strokeWidth="3" vectorEffect="non-scaling-stroke" className="ecg-trace" />
    </svg>
  );
}
