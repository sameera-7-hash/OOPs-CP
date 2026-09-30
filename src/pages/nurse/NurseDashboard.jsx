import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, ShieldAlert, ListChecks, BedDouble } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nurseMenu } from "@/lib/nav";

const QUEUE_PREVIEW = [
  { id: "P101", name: "Amit Sharma", priority: "Critical", room: "Room 204", position: "1st" },
  { id: "P104", name: "Neha Verma", priority: "High", room: "Room 108", position: "2nd" },
  { id: "P110", name: "Ravi Patel", priority: "Medium", room: "Room 312", position: "3rd" },
  { id: "P115", name: "Sneha Iyer", priority: "Normal", room: "Room 305", position: "4th" },
];

const TASKS_PREVIEW = [
  { text: "Check Vitals - Room 204", done: true },
  { text: "Medicine Rounds", done: true },
  { text: "Update Care Notes", done: false },
  { text: "Assist in Consultation", done: false },
  { text: "Discharge Summary", done: false },
];

const PRIORITY_TONE = {
  critical: "bg-destructive/15 text-destructive",
  high: "bg-warning/20 text-warning",
  medium: "bg-warning/15 text-warning",
  normal: "bg-success/15 text-success",
};

function NurseDashboard() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Nurse Dashboard">
      <PageHeading eyebrow="Overview" title={`Good Morning, ${user ? user.name : "Nurse"}`} description="Monitor patient flow, care tasks and queue." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Waiting Patients" value="7" note="In consultation: 3" />
        <StatCard icon={ShieldAlert} label="Critical Patients" value="2" note="Immediate attention" noteTone="muted" />
        <StatCard icon={ListChecks} label="Tasks Today" value="14" note="✓ 5 Completed" />
        <StatCard icon={BedDouble} label="Bed Availability" value="6" note="Available beds" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Patient Queue" action={<Button size="sm" variant="outline" onClick={() => navigate("/nurse/queue")}>Next Patient</Button>}>
          <div className="flex flex-col gap-2.5">
            {QUEUE_PREVIEW.map((p) => (
              <div key={p.id} className="grid grid-cols-[50px_1fr_auto_auto] items-center gap-2.5 text-xs">
                <strong>{p.id}</strong>
                <span className="truncate">{p.name}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", PRIORITY_TONE[p.priority.toLowerCase()])}>{p.priority}</span>
                <strong className="text-muted-foreground">{p.position}</strong>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Today's Tasks">
          <div className="flex flex-col gap-2.5">
            {TASKS_PREVIEW.map((t) => (
              <label key={t.text} className="flex items-center gap-2.5 text-xs">
                <input type="checkbox" checked={t.done} readOnly className="accent-primary" />
                <span className={t.done ? "text-muted-foreground line-through" : ""}>{t.text}</span>
              </label>
            ))}
          </div>
        </Panel>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
        <span>⚠ P101 (Amit Sharma) needs immediate attention.</span>
        <Button size="sm" variant="outline" className="border-destructive/40 text-destructive" onClick={() => navigate("/nurse/alerts")}>
          View Details
        </Button>
      </div>

      <p className="mt-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
        📋 Queue follows FIFO. Critical patients are prioritized.
      </p>
    </DashboardShell>
  );
}

export default NurseDashboard;
