import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nurseMenu } from "@/lib/nav";

const ALERTS = [
  {
    tone: "critical",
    title: "Critical Patient",
    line: "P101 — Amit Sharma",
    note: "Room 204 • Needs immediate attention",
    path: "/nurse/queue",
  },
  {
    tone: "warning",
    title: "Vitals Alert",
    line: "P118 — Patient",
    note: "Vitals require attention",
    path: "/nurse/vitals",
  },
];

const TONE_CLASS = {
  critical: "border-l-4 border-l-destructive",
  warning: "border-l-4 border-l-warning",
};

function Alerts() {
  const navigate = useNavigate();

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Alerts">
      <PageHeading eyebrow="Nurse Portal" title="Alerts" description="Important patient and care notifications." />

      <div className="flex flex-col gap-3">
        {ALERTS.map((alert) => (
          <Card key={alert.title} className={cn("flex items-center gap-4 p-4", TONE_CLASS[alert.tone])}>
            <AlertTriangle className={cn("h-6 w-6 flex-shrink-0", alert.tone === "critical" ? "text-destructive" : "text-warning")} />
            <div className="flex-1">
              <h3 className="text-sm font-bold">{alert.title}</h3>
              <p className="mt-0.5 text-xs">{alert.line}</p>
              <small className="text-[11px] text-muted-foreground">{alert.note}</small>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(alert.path)}>View Details</Button>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

export default Alerts;
