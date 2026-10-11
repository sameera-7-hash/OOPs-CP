import React, { createContext, useCallback, useContext, useState } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DISMISS_AFTER_MS = 5000;
const ToastContext = createContext(() => {});

// notify({ tone: "success" | "error", message }). Replaces window.alert()
// so feedback doesn't block the page and is announced to screen readers.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const notify = useCallback(
    ({ tone = "success", message }) => {
      if (!message) return;
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((all) => [...all.slice(-2), { id, tone, message }]);
      window.setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 sm:left-auto sm:right-6 sm:w-96"
      >
        {toasts.map((t) => {
          const isError = t.tone === "error";
          const Icon = isError ? CircleAlert : CircleCheck;
          return (
            <div
              key={t.id}
              role={isError ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex animate-toast items-start gap-3 rounded-lg border border-border border-l-4 bg-card p-4 shadow-2xl",
                isError ? "border-l-destructive" : "border-l-primary"
              )}
            >
              <Icon aria-hidden="true" className={cn("mt-0.5 h-5 w-5 shrink-0", isError ? "text-destructive" : "text-primary")} />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="-m-1 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
