import React from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  info: { icon: Info, className: "border-primary/20 bg-secondary text-foreground", iconClass: "text-primary" },
  success: { icon: CircleCheck, className: "border-success/25 bg-success/10 text-foreground", iconClass: "text-success" },
  warning: { icon: TriangleAlert, className: "border-warning/25 bg-warning/10 text-foreground", iconClass: "text-warning" },
  danger: { icon: CircleAlert, className: "border-destructive/25 bg-destructive/10 text-foreground", iconClass: "text-destructive" },
};

// An inline callout with an icon. Replaces the old emoji-prefixed notes.
function Notice({ tone = "info", icon, title, children, action, className, role }) {
  const t = TONES[tone] || TONES.info;
  const Icon = icon || t.icon;
  return (
    <div role={role} className={cn("flex flex-wrap items-start gap-3 rounded-xl border px-4 py-3 text-sm", t.className, className)}>
      <Icon aria-hidden="true" className={cn("mt-0.5 h-5 w-5 shrink-0", t.iconClass)} />
      <div className="min-w-0 flex-1">
        {title && <strong className="block font-semibold">{title}</strong>}
        {children && <div className={cn(title && "mt-0.5", "text-foreground/90")}>{children}</div>}
      </div>
      {action}
    </div>
  );
}

export default Notice;
