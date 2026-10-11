import React from "react";
import { cn } from "@/lib/utils";

// Small on-brand illustration, one helpful sentence, and one action.
function EmptyState({ art: Art, title, children, action, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-4 py-8 text-center", className)}>
      {Art && <Art className="mb-2 h-20 w-20" />}
      {title && <h3 className="text-base font-semibold">{title}</h3>}
      {children && <p className="max-w-sm text-sm text-muted-foreground">{children}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
