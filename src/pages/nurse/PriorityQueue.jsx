import React from "react";
import FadeIn from "@/components/FadeIn";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { cn } from "@/lib/utils";
import { nurseMenu } from "@/lib/nav";

const PATIENTS = [
  { priority: "Critical", id: "P101", name: "Amit Sharma", room: "Room 204" },
  { priority: "Critical", id: "P118", name: "Patient", room: "Room 210" },
  { priority: "High", id: "P104", name: "Neha Verma", room: "Room 108" },
  { priority: "Medium", id: "P110", name: "Ravi Patel", room: "Room 312" },
  { priority: "Normal", id: "P115", name: "Sneha Iyer", room: "Room 305" },
];

const PRIORITY_TONE = {
  critical: "bg-destructive/15 text-destructive",
  high: "bg-warning/20 text-warning",
  medium: "bg-warning/15 text-warning",
  normal: "bg-success/15 text-success",
};

function PriorityQueue() {
  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Priority Queue">
      <PageHeading eyebrow="Nurse Portal" title="Emergency Priority Queue" description="Patients are arranged according to priority." />

      <Panel>
        <div className="flex flex-col gap-2">
          {PATIENTS.map((patient, index) => (
            <FadeIn key={patient.id} delay={index * 0.05}>
              <div className="grid grid-cols-[85px_65px_1fr_auto] items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 text-xs">
                <span className={cn("w-fit rounded-full px-2 py-0.5 text-[10px] font-bold", PRIORITY_TONE[patient.priority.toLowerCase()])}>
                  {patient.priority}
                </span>
                <strong>{patient.id}</strong>
                <span className="truncate">{patient.name}</span>
                <span className="text-muted-foreground">{patient.room}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </Panel>

      <div className="rounded-xl border border-warning/30 bg-warning/10 p-5 text-center">
        <strong className="text-xs">Highest Priority</strong>
        <div className="my-3 h-1.5 rounded-full bg-gradient-to-r from-destructive via-warning to-success" />
        <strong className="text-xs">Lowest Priority</strong>
        <p className="mt-2 text-xs text-muted-foreground">Critical patients receive higher priority when required.</p>
      </div>

      <p className="mt-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
        📚 Priority Queue / Heap → Highest-priority patient is processed first.
      </p>
    </DashboardShell>
  );
}

export default PriorityQueue;
