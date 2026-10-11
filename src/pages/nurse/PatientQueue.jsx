import React, { useState } from "react";
import { ArrowRight, ListOrdered, Plus } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import EmptyState from "@/components/feedback/EmptyState";
import PriorityBadge from "@/components/feedback/PriorityBadge";
import { ClipboardChartArt } from "@/components/art/Illustrations";
import { Button } from "@/components/ui/button";
import { nurseMenu } from "@/lib/nav";

// SAMPLE DATA: a local demonstration of a FIFO queue. These patients are
// not loaded from the backend.
const SAMPLE_QUEUE = [
  { id: "P101", name: "Amit Sharma", priority: "Critical", room: "Room 204" },
  { id: "P104", name: "Neha Verma", priority: "High", room: "Room 108" },
  { id: "P110", name: "Ravi Patel", priority: "Medium", room: "Room 312" },
  { id: "P115", name: "Sneha Iyer", priority: "Normal", room: "Room 305" },
];

function PatientQueue() {
  const notify = useToast();
  const [queue, setQueue] = useState(SAMPLE_QUEUE);

  const nextPatient = () => {
    if (queue.length === 0) return;
    const next = queue[0];
    setQueue(queue.slice(1));
    notify({ message: `${next.name} is now being attended.` });
  };

  const addPatient = () => {
    setQueue([...queue, { id: `P${120 + queue.length}`, name: "New Patient", priority: "Normal", room: "Room 310" }]);
  };

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Patient Queue">
      <PageHeading
        eyebrow="Nurse portal"
        title="Patient queue"
        description="Patients waiting for consultation."
        sample="A local demonstration of a queue. These patients aren't loaded from the backend."
      />

      <Panel>
        {queue.length === 0 ? (
          <EmptyState
            art={ClipboardChartArt}
            title="The queue is empty"
            action={<Button variant="outline" onClick={addPatient}><Plus aria-hidden="true" />Add patient</Button>}
          >
            Nobody is waiting right now.
          </EmptyState>
        ) : (
          <div className="relative flex items-center gap-3 overflow-x-auto py-2">
            <strong className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">Front</strong>
            <ol className="flex items-center gap-3" aria-label="Queue, front first">
              {queue.map((patient, index) => (
                <li key={patient.id} className="flex items-center gap-3">
                  <div className="flex w-40 shrink-0 animate-rise flex-col gap-2 rounded-lg border border-border bg-card p-4 text-sm">
                    <strong>{patient.id}</strong>
                    <span className="truncate">{patient.name}</span>
                    <PriorityBadge priority={patient.priority} />
                    <small className="text-muted-foreground">{patient.room}</small>
                  </div>
                  {index < queue.length - 1 && <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </li>
              ))}
            </ol>
            <strong className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">Rear</strong>
          </div>
        )}
      </Panel>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={addPatient}>
          <Plus aria-hidden="true" />
          Add patient
        </Button>
        <Button onClick={nextPatient} disabled={queue.length === 0}>
          <ArrowRight aria-hidden="true" />
          Next patient
        </Button>
      </div>

      <Notice icon={ListOrdered} className="mt-6">A queue is FIFO: first in, first out.</Notice>
    </DashboardShell>
  );
}

export default PatientQueue;
