import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
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
    title: msg("Critical patient"),
    line: "P101 — Amit Sharma",
    note: msg("Room 204 · Needs immediate attention"),
    path: "/nurse/queue",
  },
  {
    tone: "warning",
    icon: HeartPulse,
    title: msg("Vitals alert"),
    line: msg("P118 — Patient"),
    note: msg("Vitals require attention"),
    path: "/nurse/vitals",
  },
];

function Alerts() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title={t("Alerts")}>
      <PageHeading
        eyebrow={t("Nurse portal")}
        title={t("Alerts")}
        description={t("Important patient and care notifications.")}
        sample={t("These alerts are placeholders. The backend doesn't generate alerts yet.")}
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
                  <span className="sr-only">{tone === "critical" ? t("Critical:") : t("Warning:")} </span>
                  {t(title)}
                </h2>
                <p className="mt-0.5 text-sm">{t(line)}</p>
                <small className="text-sm text-muted-foreground">{t(note)}</small>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate(path)}>{t("View details")}</Button>
            </Card>
          </li>
        ))}
      </ul>
    </DashboardShell>
  );
}

export default Alerts;
