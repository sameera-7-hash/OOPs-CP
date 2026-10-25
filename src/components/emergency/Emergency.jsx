import React, { createContext, useCallback, useContext, useState } from "react";
import { Copy, Phone, Siren } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { buttonVariants, Button } from "@/components/ui/button";
import { EMERGENCY_NUMBERS, GUIDANCE_DISCLAIMER } from "@/lib/emergency";
import { cn } from "@/lib/utils";

const EmergencyContext = createContext({ openEmergency: () => {} });

// Lets any menu (e.g. the mobile Sheet) open the same emergency dialog.
export const useEmergency = () => useContext(EmergencyContext);

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API blocked (insecure origin, permissions): fall back.
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

// One row per number: a large tap-to-call link (never auto-dialled) and a
// copy button for desktops where tel: does nothing.
export function EmergencyNumbers({ className }) {
  const notify = useToast();
  const { t } = useTranslation();

  const copy = async (entry) => {
    const ok = await copyText(entry.number);
    const vars = { label: t(entry.label), number: entry.number };
    notify(
      ok
        ? { message: t("{{label}} number {{number}} copied.", vars) }
        : { tone: "error", message: t("Couldn't copy. The {{label}} number is {{number}}.", vars) }
    );
  };

  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {EMERGENCY_NUMBERS.map((entry) => (
        <li key={entry.number} className="flex items-stretch gap-2">
          {/* Number first and large so it is never truncated at 360px. */}
          <a
            href={`tel:${entry.number}`}
            aria-label={t("Call {{label}}, {{number}}", { label: t(entry.label), number: entry.number })}
            className={cn(
              buttonVariants({ variant: "destructive", size: "lg" }),
              "h-auto min-h-16 min-w-0 flex-1 justify-start gap-3 whitespace-normal py-2 text-left no-underline hover:text-destructive-foreground [&_svg]:size-5"
            )}
          >
            <Phone aria-hidden="true" />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-2xl font-bold tabular-nums">{entry.number}</span>
              <span className="text-sm font-medium">{t("Call {{label}}", { label: t(entry.label) })}</span>
            </span>
          </a>
          <Button
            variant="outline"
            size="lg"
            className="h-auto min-h-16 shrink-0 px-4"
            onClick={() => copy(entry)}
            aria-label={t("Copy {{label}} number {{number}}", { label: t(entry.label), number: entry.number })}
          >
            <Copy aria-hidden="true" />
            <span className="hidden sm:inline">{t("Copy")}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
}

function EmergencyDialog({ open, onOpenChange }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Siren aria-hidden="true" className="h-6 w-6 text-destructive" />
            {t("Emergency contacts")}
          </DialogTitle>
          <DialogDescription>{t("Tap a number to call it, or copy it to dial from your phone.")}</DialogDescription>
        </DialogHeader>
        <EmergencyNumbers />
        <p className="mt-5 text-xs text-muted-foreground">{t(GUIDANCE_DISCLAIMER)}</p>
      </DialogContent>
    </Dialog>
  );
}

// Mounted once at the app root: a fixed Emergency pill on every page
// (public and dashboard alike, except the landing splash) plus the dialog
// it opens. It needs no login and calls no API, so it works even when the
// backend is down.
export function EmergencyProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openEmergency = useCallback(() => setOpen(true), []);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <EmergencyContext.Provider value={{ openEmergency }}>
      {children}
      {/* Pages reserve room for this with the .pill-clearance padding. */}
      {pathname !== "/" && (
        <button
          type="button"
          onClick={openEmergency}
          aria-haspopup="dialog"
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-destructive px-5 text-sm font-semibold text-destructive-foreground shadow-2xl transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98] sm:right-6"
        >
          <Siren aria-hidden="true" className="h-5 w-5" />
          {t("Emergency")}
        </button>
      )}
      <EmergencyDialog open={open} onOpenChange={setOpen} />
    </EmergencyContext.Provider>
  );
}
