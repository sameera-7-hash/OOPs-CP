import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx builds a conditional className string; twMerge then resolves any
// conflicting Tailwind utilities (e.g. a caller's "px-6" overriding a
// component's default "px-4") by keeping only the last one that applies.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
