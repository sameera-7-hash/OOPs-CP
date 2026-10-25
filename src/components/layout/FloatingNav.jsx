import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollHeader } from "@/hooks/useScrollHeader";
import BrandMark from "@/components/BrandMark";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

// Floating, translucent pill navbar for the public pages. It is fixed near
// the top and centred; page content scrolls underneath it (pages add top
// padding to clear it). `links` are in-page or route links shown from the
// sm breakpoint up; `children` go on the right (usually the main action).
function FloatingNav({ links = [], children }) {
  // Firms up once scrolled; slides away while scrolling down and returns
  // on scroll up. Never hides while it holds keyboard focus.
  const { scrolled, hidden } = useScrollHeader();
  const [hasFocus, setHasFocus] = useState(false);
  const { t } = useTranslation();

  return (
    <header
      onFocus={() => setHasFocus(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHasFocus(false)}
      className={cn("nav-shell pointer-events-none fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6", hidden && !hasFocus && "is-hidden")}
    >
      <div
        className={cn(
          "nav-pill pointer-events-auto mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full pl-3 pr-2 sm:pl-4",
          scrolled && "is-scrolled"
        )}
      >
        <Link to="/" className="flex items-center gap-2 rounded-full text-foreground no-underline hover:text-foreground">
          <BrandMark className="h-8 w-8" />
          <span className="text-base font-semibold">Beacon</span>
        </Link>

        <nav aria-label={t("Main")} className="flex items-center gap-1">
          {links.map(({ href, to, label }) => {
            const className =
              "link-underline hidden h-10 items-center rounded-full px-4 text-sm font-medium text-muted-foreground no-underline transition-colors duration-150 hover:bg-secondary hover:text-accent-foreground sm:inline-flex";
            return to ? (
              <Link key={label} to={to} className={className}>
                {label}
              </Link>
            ) : (
              <a key={label} href={href} className={className}>
                {label}
              </a>
            );
          })}
          <LanguageSwitcher className="rounded-full" />
          {children && <div className="ml-1 flex items-center gap-2">{children}</div>}
        </nav>
      </div>
    </header>
  );
}

export default FloatingNav;
