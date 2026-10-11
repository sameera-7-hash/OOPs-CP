import React, { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { nurseMenu } from "@/lib/nav";

// SAMPLE DATA: tasks are local to this page; the backend has no task API.
const SAMPLE_TASKS = [
  { text: "Check vitals - Room 204", done: true },
  { text: "Medicine rounds", done: true },
  { text: "Update care notes", done: false },
  { text: "Assist in consultation", done: false },
  { text: "Discharge summary", done: false },
];

function Tasks() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);

  const toggle = (index) => {
    setTasks(tasks.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));
  };

  const completed = tasks.filter((task) => task.done).length;

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Tasks">
      <PageHeading
        eyebrow="Nurse portal"
        title="Today's tasks"
        description="Track daily nursing activities."
        sample="These tasks are placeholders and aren't saved anywhere."
      />

      <Panel title={`${completed} of ${tasks.length} tasks completed`}>
        <div
          role="progressbar"
          aria-label="Tasks completed"
          aria-valuemin={0}
          aria-valuemax={tasks.length}
          aria-valuenow={completed}
          className="mb-6 h-2 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${completed / tasks.length})` }}
          />
        </div>

        <ul className="flex flex-col">
          {tasks.map((task, index) => (
            <li key={task.text} className="border-b border-border last:border-0">
              <label className="flex min-h-12 cursor-pointer items-center gap-3 py-2 text-base">
                <input type="checkbox" checked={task.done} onChange={() => toggle(index)} className="h-5 w-5 accent-primary" />
                <span className={task.done ? "text-muted-foreground line-through" : ""}>{task.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </Panel>
    </DashboardShell>
  );
}

export default Tasks;
