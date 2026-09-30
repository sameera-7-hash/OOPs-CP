import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Undo2, Redo2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { doctorMenu } from "@/lib/nav";

function UndoRedo() {
  const [undoStack, setUndoStack] = useState([
    "Add Patient P124",
    "Update Diagnosis P122",
    "Edit Patient P123",
    "Delete Patient P119",
  ]);
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
      <PageHeading eyebrow="Doctor Portal" title="Undo / Redo" description="Action history using Stack data structure." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StackPanel title="Undo Stack" items={undoStack} />
        <StackPanel title="Redo Stack" items={redoStack} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={undo} disabled={undoStack.length === 0}>
          <Undo2 className="h-4 w-4" />
          Undo
        </Button>
        <Button onClick={redo} disabled={redoStack.length === 0}>
          <Redo2 className="h-4 w-4" />
          Redo
        </Button>
      </div>

      <p className="mt-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
        📚 Stack follows LIFO — Last In, First Out. The most recent action is processed first.
      </p>
    </DashboardShell>
  );
}

function StackPanel({ title, items }) {
  const reversed = items.slice().reverse();
  return (
    <Panel title={title}>
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">TOP</div>
      <AnimatePresence initial={false}>
        {reversed.map((action, index) => (
          <motion.div
            key={action + index}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={cn(
              "mb-1.5 rounded-lg border px-3 py-2.5 text-xs",
              index === 0 ? "border-primary/40 bg-primary/10 font-bold text-primary" : "border-border bg-muted/50"
            )}
          >
            {action}
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">Stack is empty</p>}
    </Panel>
  );
}

export default UndoRedo;
