import React, { useState } from "react";
import { Layers, Redo2, Undo2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { doctorMenu } from "@/lib/nav";

// SAMPLE DATA: a local demonstration of a stack; these actions are not
// read from (or applied to) the backend.
const SAMPLE_ACTIONS = ["Add Patient P124", "Update Diagnosis P122", "Edit Patient P123", "Delete Patient P119"];

function UndoRedo() {
  const [undoStack, setUndoStack] = useState(SAMPLE_ACTIONS);
  const [redoStack, setRedoStack] = useState([]);

  const undo = () => {
    if (undoStack.length === 0) return;
    const newUndo = [...undoStack];
    const action = newUndo.pop();
    setUndoStack(newUndo);
    setRedoStack([...redoStack, action]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const newRedo = [...redoStack];
    const action = newRedo.pop();
    setRedoStack(newRedo);
    setUndoStack([...undoStack, action]);
  };

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Undo / Redo">
      <PageHeading
        eyebrow="Doctor portal"
        title="Undo / Redo"
        description="Action history using a stack data structure."
        sample="A local demonstration of a stack. These actions aren't connected to patient records."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StackPanel title="Undo stack" items={undoStack} />
        <StackPanel title="Redo stack" items={redoStack} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={undo} disabled={undoStack.length === 0}>
          <Undo2 aria-hidden="true" />
          Undo
        </Button>
        <Button variant="outline" onClick={redo} disabled={redoStack.length === 0}>
          <Redo2 aria-hidden="true" />
          Redo
        </Button>
      </div>

      <Notice icon={Layers} className="mt-6">
        A stack is LIFO (last in, first out): the most recent action is processed first.
      </Notice>
    </DashboardShell>
  );
}

function StackPanel({ title, items }) {
  const reversed = items.slice().reverse();
  return (
    <Panel title={title}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top</p>
      <ol className="flex flex-col gap-2" aria-label={title}>
        {reversed.map((action, index) => (
          <li
            key={`${action}-${items.length - index}`}
            className={cn(
              "animate-rise rounded-lg border px-4 py-2 text-sm",
              index === 0 ? "border-primary/40 bg-secondary font-semibold text-accent-foreground" : "border-border bg-card"
            )}
          >
            {action}
          </li>
        ))}
      </ol>
      {items.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">The stack is empty.</p>}
    </Panel>
  );
}

export default UndoRedo;
