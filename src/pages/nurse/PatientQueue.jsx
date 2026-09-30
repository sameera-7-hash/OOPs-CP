import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nurseMenu } from "@/lib/nav";

const PRIORITY_TONE = {
  critical: "bg-destructive/15 text-destructive",
  high: "bg-warning/20 text-warning",
  medium: "bg-warning/15 text-warning",
  normal: "bg-success/15 text-success",
};

function PatientQueue() {
  const [queue, setQueue] = useState([
    { id: "P101", name: "Amit Sharma", priority: "Critical", room: "Room 204" },
    { id: "P104", name: "Neha Verma", priority: "High", room: "Room 108" },
    { id: "P110", name: "Ravi Patel", priority: "Medium", room: "Room 312" },
    { id: "P115", name: "Sneha Iyer", priority: "Normal", room: "Room 305" },
  ]);

  const nextPatient = () => {
    if (queue.length === 0) return;
    const next = queue[0];
    setQueue(queue.slice(1));
    alert(`${next.name} is now being attended.`);
  };

  const addPatient = () => {
    setQueue([...queue, { id: `P${120 + queue.length}`, name: "New Patient", priority: "Normal", room: "Room 310" }]);
  };

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Patient Queue">
      <PageHeading eyebrow="Nurse Portal" title="Patient Queue" description="Manage patients waiting for consultation." />

      <Panel>
        <div className="flex items-center gap-3 overflow-x-auto py-2">
          <strong className="flex-shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">FRONT</strong>

          <AnimatePresence initial={false}>
            {queue.map((patient, index) => (
              <React.Fragment key={patient.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex min-w-32 flex-shrink-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 text-xs"
                >
                  <strong>{patient.id}</strong>
                  <span className="truncate">{patient.name}</span>
                  <span className={cn("w-fit rounded-full px-2 py-0.5 text-[10px] font-bold", PRIORITY_TONE[patient.priority.toLowerCase()])}>
                    {patient.priority}
                  </span>
                  <small className="text-muted-foreground">{patient.room}</small>
                </motion.div>

                {index < queue.length - 1 && <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
              </React.Fragment>
            ))}
          </AnimatePresence>

          <strong className="flex-shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">REAR</strong>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={addPatient}>
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
        <Button onClick={nextPatient}>
          <ArrowRight className="h-4 w-4" />
          Next Patient
        </Button>
      </div>

      <p className="mt-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
        📚 Queue follows FIFO — First In, First Out.
      </p>
    </DashboardShell>
  );
}

export default PatientQueue;
