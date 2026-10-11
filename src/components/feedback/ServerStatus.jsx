import React, { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, RefreshCw, WifiOff } from "lucide-react";
import { checkHealth } from "@/Services/api";
import { Button } from "@/components/ui/button";

// The backend may run on a free tier that cold-starts. If /api/health
// hasn't answered within 2s we show a friendly "waking" banner and keep
// retrying with backoff; after the last retry we offer a manual retry.
const SLOW_AFTER_MS = 2000;
const RETRY_DELAYS_MS = [2000, 4000, 8000, 15000, 30000];

function ServerStatus() {
  const [status, setStatus] = useState("checking"); // checking | waking | online | offline
  const run = useRef(0);

  const check = useCallback(async () => {
    const id = ++run.current;
    const stale = () => id !== run.current;
    setStatus("checking");
    const slow = window.setTimeout(() => !stale() && setStatus("waking"), SLOW_AFTER_MS);

    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      try {
        await checkHealth();
        window.clearTimeout(slow);
        if (!stale()) setStatus("online");
        return;
      } catch {
        if (stale()) return;
        if (attempt === RETRY_DELAYS_MS.length) break;
        setStatus("waking");
        await new Promise((resolve) => window.setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
        if (stale()) return;
      }
    }
    window.clearTimeout(slow);
    if (!stale()) setStatus("offline");
  }, []);

  useEffect(() => {
    check();
    return () => {
      run.current++;
    };
  }, [check]);

  if (status !== "waking" && status !== "offline") return null;

  return (
    // Floats above the page so it never shifts the layout (the dashboard
    // sidebar is sticky and full-height).
    <div
      role="status"
      className="fixed left-1/2 top-3 z-[60] w-max max-w-[calc(100%-32px)] -translate-x-1/2 animate-in rounded-2xl border border-border bg-card px-4 py-2 text-sm shadow-md"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        {status === "waking" ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-primary motion-reduce:animate-none" />
            <span>Waking the clinic server. This can take up to a minute on first load.</span>
          </>
        ) : (
          <>
            <WifiOff aria-hidden="true" className="h-4 w-4 text-destructive" />
            <span>We can&apos;t reach the clinic server right now.</span>
            <Button size="sm" variant="outline" onClick={check} className="h-8">
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ServerStatus;
