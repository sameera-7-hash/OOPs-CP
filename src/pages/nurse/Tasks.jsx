import React, { useState } from "react";
import { motion } from "motion/react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { nurseMenu } from "@/lib/nav";

function Tasks() {
  const [tasks, setTasks] = useState([
    { text: "Check Vitals - Room 204", done: true },
    { text: "Medicine Rounds", done: true },
    { text: "Update Care Notes", done: false },
    { text: "Assist in Consultation", done: false },
    { text: "Discharge Summary", done: false },
  ]);

  const toggle = (index) => {
    setTasks(tasks.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));
  };

  const completed = tasks.filter((task) => task.done).length;

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Tasks">
      <PageHeading eyebrow="Nurse Portal" title="Today's Tasks" description="Track daily nursing activities." />

      <Panel title={`${completed} of ${tasks.length} tasks completed`}>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(completed / tasks.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex flex-col gap-1">
          {tasks.map((task, index) => (
            <label
              key={task.text}
              className="flex items-center gap-3 border-b border-border py-3 text-sm last:border-0"
            >
              <input type="checkbox" checked={task.done} onChange={() => toggle(index)} className="h-4 w-4 accent-primary" />
              <span className={task.done ? "text-muted-foreground line-through" : ""}>{task.text}</span>
            </label>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}

export default Tasks;
