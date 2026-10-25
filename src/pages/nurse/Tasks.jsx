import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { nurseMenu } from "@/lib/nav";

// SAMPLE DATA: tasks are local to this page; the backend has no task API.
const SAMPLE_TASKS = [
  { text: msg("Check vitals - Room 204"), done: true },
  { text: msg("Medicine rounds"), done: true },
  { text: msg("Update care notes"), done: false },
  { text: msg("Assist in consultation"), done: false },
  { text: msg("Discharge summary"), done: false },
];

function Tasks() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const { t } = useTranslation();

  const toggle = (index) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, done: !task.done } : task)));
  };

  const completed = tasks.filter((task) => task.done).length;

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title={t("Tasks")}>
      <PageHeading
        eyebrow={t("Nurse portal")}
        title={t("Today's tasks")}
        description={t("Track daily nursing activities.")}
        sample={t("These tasks are placeholders and aren't saved anywhere.")}
      />

      <Panel title={t("{{done}} of {{total}} tasks completed", { done: completed, total: tasks.length })}>
        <div
          role="progressbar"
          aria-label={t("Tasks completed")}
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
                <span className={task.done ? "text-muted-foreground line-through" : ""}>{t(task.text)}</span>
              </label>
            </li>
          ))}
        </ul>
      </Panel>
    </DashboardShell>
  );
}

export default Tasks;
