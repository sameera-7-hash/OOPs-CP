import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
import { BedDouble, ListChecks, ListOrdered, ShieldAlert, TriangleAlert, Users } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import DashboardShell from "@/components/layout/DashboardShell";
import WelcomeBanner from "@/components/layout/WelcomeBanner";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import PriorityBadge from "@/components/feedback/PriorityBadge";
import { Button } from "@/components/ui/button";
import { nurseMenu } from "@/lib/nav";

// SAMPLE DATA: the queue, tasks and counts on this screen are hard-coded
// placeholders. The backend has no nursing queue/task endpoints yet.
const QUEUE_PREVIEW = [
  { id: "P101", name: "Amit Sharma", priority: "Critical", position: "1st" },
  { id: "P104", name: "Neha Verma", priority: "High", position: "2nd" },
  { id: "P110", name: "Ravi Patel", priority: "Medium", position: "3rd" },
  { id: "P115", name: "Sneha Iyer", priority: "Normal", position: "4th" },
];

const TASKS_PREVIEW = [
  { text: msg("Check vitals - Room 204"), done: true },
  { text: msg("Medicine rounds"), done: true },
  { text: msg("Update care notes"), done: false },
  { text: msg("Assist in consultation"), done: false },
  { text: msg("Discharge summary"), done: false },
];

function NurseDashboard() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title={t("Nurse Dashboard")}>
      <WelcomeBanner
        photo="nurse"
        eyebrow={t("Overview")}
        title={t("Hello, {{name}}", { name: user ? user.name : t("Nurse") })}
        description={t("Patient flow, care tasks and the queue.")}
        sample={t("The queue, tasks and counts here are placeholders. Patient records and reports are live.")}
      />

      <div className="stagger mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard tone="teal" icon={Users} label={t("Waiting patients")} value="7" sample />
        <StatCard tone="rose" icon={ShieldAlert} label={t("Critical patients")} value="2" sample />
        <StatCard tone="amber" icon={ListChecks} label={t("Tasks today")} value="14" sample />
        <StatCard tone="green" icon={BedDouble} label={t("Available beds")} value="6" sample />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title={t("Patient queue")}
          action={<Button size="sm" variant="outline" onClick={() => navigate("/nurse/queue")}>{t("Open queue")}</Button>}
        >
          <ol className="flex flex-col">
            {QUEUE_PREVIEW.map((p) => (
              <li key={p.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-border py-3 text-sm first:pt-0 last:border-0 last:pb-0">
                <strong>{p.id}</strong>
                <span className="truncate">{p.name}</span>
                <PriorityBadge priority={p.priority} />
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title={t("Today's tasks")}>
          <ul className="flex flex-col gap-3">
            {TASKS_PREVIEW.map((task) => (
              <li key={task.text} className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={task.done} readOnly aria-label={t(task.text)} className="h-4 w-4 accent-primary" />
                <span className={task.done ? "text-muted-foreground line-through" : ""}>{t(task.text)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Notice
        tone="danger"
        icon={TriangleAlert}
        className="mb-6"
        action={<Button size="sm" variant="outline" onClick={() => navigate("/nurse/alerts")}>{t("View details")}</Button>}
      >
        {t("{{id}} ({{name}}) needs immediate attention.", { id: "P101", name: "Amit Sharma" })}
      </Notice>

      <Notice icon={ListOrdered}>{t("The queue is FIFO (first in, first out), with critical patients seen first.")}</Notice>
    </DashboardShell>
  );
}

export default NurseDashboard;
