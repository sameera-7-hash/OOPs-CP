import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function readStoredTheme() {
  try {
    return localStorage.getItem("pc_theme_v2") || "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("pc_theme_v2", theme);
  } catch {
    // Private browsing / blocked storage -- theme just won't persist.
  }
}

// Light/dark switch for the top bar: a small sun shape and moon shape
// (lucide vector icons, not emoji) sit at either end of a pill track, and
// a sliding knob shows which one is active. Applies data-theme to <html>
// so it takes effect regardless of which page/layout is currently
// mounted.
function ThemeToggle() {
  const [theme, setTheme] = useState(readStoredTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex h-7 w-14 flex-shrink-0 items-center justify-between rounded-full border border-border bg-muted p-0.5 transition-colors"
    >
      <motion.span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-card shadow-sm shadow-black/10"
        animate={{ x: isDark ? 28 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />

      <span className="relative z-10 grid h-6 w-6 place-items-center">
        <Sun className={cn("h-3.5 w-3.5 transition-colors", !isDark ? "text-warning" : "text-muted-foreground/40")} />
      </span>

      <span className="relative z-10 grid h-6 w-6 place-items-center">
        <Moon className={cn("h-3.5 w-3.5 transition-colors", isDark ? "text-primary" : "text-muted-foreground/40")} />
      </span>
    </button>
  );
}

export default ThemeToggle;
