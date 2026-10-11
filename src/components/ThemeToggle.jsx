import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
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

// Light/dark switch for the top bar. Applies data-theme to <html> so it
// takes effect regardless of which page/layout is currently mounted.
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
      aria-label="Dark mode"
      className="relative inline-flex h-8 w-16 shrink-0 items-center justify-between rounded-full border border-border bg-muted p-1"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 h-6 w-6 rounded-full bg-card shadow-sm transition-transform duration-200 ease-out",
          isDark && "translate-x-8"
        )}
      />
      <span className="relative z-10 grid h-6 w-6 place-items-center">
        <Sun aria-hidden="true" className={cn("h-4 w-4", isDark ? "text-muted-foreground" : "text-warning")} />
      </span>
      <span className="relative z-10 grid h-6 w-6 place-items-center">
        <Moon aria-hidden="true" className={cn("h-4 w-4", isDark ? "text-primary" : "text-muted-foreground")} />
      </span>
    </button>
  );
}

export default ThemeToggle;
