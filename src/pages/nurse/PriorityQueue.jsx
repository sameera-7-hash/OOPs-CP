import React from "react";
import { ArrowDownWideNarrow } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import PriorityBadge from "@/components/feedback/PriorityBadge";
import { nurseMenu } from "@/lib/nav";

// SAMPLE DATA: a demonstration of a priority queue, not backend data.
const PATIENTS = [
  { priority: "Critical", id: "P101", name: "Amit Sharma", room: "Room 204" },
  { priority: "Critical", id: "P118", name: "Patient", room: "Room 210" },
  { priority: "High", id: "P104", name: "Neha Verma", room: "Room 108" },
  { priority: "Medium", id: "P110", name: "Ravi Patel", room: "Room 312" },
  { priority: "Normal", id: "P115", name: "Sneha Iyer", room: "Room 305" },
];

function PriorityQueue() {
  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Priority Queue">
      <PageHeading
        eyebrow="Nurse portal"
        title="Emergency priority queue"
        description="Patients ordered by priority, highest first."
        sample="A demonstration of a priority queue. These patients aren't loaded from the backend."
      />

      <Panel>
        <ol className="flex flex-col gap-2">
          {PATIENTS.map((patient, index) => (
            <FadeIn as="li" key={patient.id} delay={index * 0.06}>
              <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-card p-4 text-sm sm:grid-cols-[110px_64px_1fr_auto]">
                <PriorityBadge priority={patient.priority} />
                <strong className="sm:order-none">{patient.id}</strong>
                <span className="truncate">{patient.name}</span>
                <span className="text-muted-foreground">{patient.room}</span>
              </div>
            </FadeIn>
          ))}
        </ol>
      </Panel>

      <Notice icon={ArrowDownWideNarrow}>
        A priority queue (heap) always serves the highest-priority patient first.
      </Notice>
    </DashboardShell>
  );
}

export default PriorityQueue;
