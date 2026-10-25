import React, { useState } from "react";
import { ArrowRight, ListOrdered, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
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
// not loaded from the backend. `room` is the room number.
const SAMPLE_QUEUE = [
  { id: "P101", name: "Amit Sharma", priority: "Critical", room: "204" },
  { id: "P104", name: "Neha Verma", priority: "High", room: "108" },
  { id: "P110", name: "Ravi Patel", priority: "Medium", room: "312" },
  { id: "P115", name: "Sneha Iyer", priority: "Normal", room: "305" },
];

function PatientQueue() {
  const notify = useToast();
  const [queue, setQueue] = useState(SAMPLE_QUEUE);
  const { t } = useTranslation();

  const nextPatient = () => {
    if (queue.length === 0) return;
    const next = queue[0];
    setQueue(queue.slice(1));
    notify({ message: t("{{name}} is now being attended.", { name: next.name }) });
  };

  const addPatient = () => {
    setQueue([...queue, { id: `P${120 + queue.length}`, name: t("New Patient"), priority: "Normal", room: "310" }]);
  };

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title={t("Patient Queue")}>
      <PageHeading
        eyebrow={t("Nurse portal")}
        title={t("Patient queue")}
        description={t("Patients waiting for consultation.")}
        sample={t("A local demonstration of a queue. These patients aren't loaded from the backend.")}
      />

      <Panel>
        {queue.length === 0 ? (
          <EmptyState
            art={ClipboardChartArt}
            title={t("The queue is empty")}
            action={<Button variant="outline" onClick={addPatient}><Plus aria-hidden="true" />{t("Add patient")}</Button>}
          >
            {t("Nobody is waiting right now.")}
          </EmptyState>
        ) : (
          <div className="relative flex items-center gap-3 overflow-x-auto py-2">
            <strong className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">{t("Front")}</strong>
            <ol className="flex items-center gap-3" aria-label={t("Queue, front first")}>
              {queue.map((patient, index) => (
                <li key={patient.id} className="flex items-center gap-3">
                  <div className="flex w-40 shrink-0 animate-rise flex-col gap-2 rounded-lg border border-border bg-card p-4 text-sm">
                    <strong>{patient.id}</strong>
                    <span className="truncate">{patient.name}</span>
                    <PriorityBadge priority={patient.priority} />
                    <small className="text-muted-foreground">{t("Room {{number}}", { number: patient.room })}</small>
                  </div>
                  {index < queue.length - 1 && <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </li>
              ))}
            </ol>
            <strong className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">{t("Rear")}</strong>
          </div>
        )}
      </Panel>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={addPatient}>
          <Plus aria-hidden="true" />
          {t("Add patient")}
        </Button>
        <Button onClick={nextPatient} disabled={queue.length === 0}>
          <ArrowRight aria-hidden="true" />
          {t("Next patient")}
        </Button>
      </div>

      <Notice icon={ListOrdered} className="mt-6">{t("A queue is FIFO: first in, first out.")}</Notice>
    </DashboardShell>
  );
}

export default PatientQueue;
