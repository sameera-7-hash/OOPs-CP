import React from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, TriangleAlert } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nurseMenu } from "@/lib/nav";

// SAMPLE DATA: the backend has no alerts endpoint yet.
const ALERTS = [
  {
    tone: "critical",
    icon: TriangleAlert,
    title: "Critical patient",
    line: "P101 — Amit Sharma",
    note: "Room 204 · Needs immediate attention",
    path: "/nurse/queue",
  },
  {
    tone: "warning",
    icon: HeartPulse,
    title: "Vitals alert",
    line: "P118 — Patient",
    note: "Vitals require attention",
    path: "/nurse/vitals",
  },
];

function Alerts() {
  const navigate = useNavigate();

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Alerts">
      <PageHeading
        eyebrow="Nurse portal"
        title="Alerts"
        description="Important patient and care notifications."
        sample="These alerts are placeholders. The backend doesn't generate alerts yet."
      />

      <ul className="flex flex-col gap-3">
        {ALERTS.map(({ tone, icon: Icon, title, line, note, path }) => (
          <li key={title}>
            <Card
              className={cn(
                "flex flex-wrap items-center gap-4 border-l-4 p-4 sm:flex-nowrap",
                tone === "critical" ? "border-l-destructive" : "border-l-warning"
              )}
            >
              <Icon aria-hidden="true" className={cn("h-6 w-6 shrink-0", tone === "critical" ? "text-destructive" : "text-warning")} />
              <div className="min-w-0 flex-1">
                <h2 className="text-base">
                  <span className="sr-only">{tone === "critical" ? "Critical: " : "Warning: "}</span>
                  {title}
                </h2>
                <p className="mt-0.5 text-sm">{line}</p>
                <small className="text-sm text-muted-foreground">{note}</small>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate(path)}>View details</Button>
            </Card>
          </li>
        ))}
      </ul>
    </DashboardShell>
  );
}

export default Alerts;
