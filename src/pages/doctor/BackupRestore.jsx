import React, { useState } from "react";
import { Database, DatabaseZap, RotateCcw, Save } from "lucide-react";
import { createBackup } from "@/Services/api";
import { useToast } from "@/context/ToastContext";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import SampleTag from "@/components/feedback/SampleTag";
import { Button } from "@/components/ui/button";
import { doctorMenu } from "@/lib/nav";

function BackupRestore() {
  const notify = useToast();
  const [backingUp, setBackingUp] = useState(false);

  const backup = async () => {
    setBackingUp(true);
    try {
      const result = await createBackup();
      notify({ message: `Snapshot saved: ${result.snapshot}` });
    } catch (err) {
      notify({ tone: "error", message: `Could not create snapshot: ${err.message}` });
    } finally {
      setBackingUp(false);
    }
  };

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Backup & Restore">
      <PageHeading eyebrow="Doctor portal" title="Backup & restore" description="Create database snapshots." />

      {/* The file names and statuses below are static labels: the backend
          has no endpoint that reports database or backup health. */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Panel title="Primary database" action={<SampleTag />}>
          <FileRow name="patients.dat" />
        </Panel>
        <Panel title="Backup database" action={<SampleTag />}>
          <FileRow name="patients.dat.bak" />
        </Panel>
      </div>

      <Notice icon={DatabaseZap} title="Hash-chain integrity" className="mb-6">
        The live integrity result for each record is shown on the patient list and dashboard, where the backend
        reports it.
      </Notice>

      <div className="flex flex-wrap gap-2">
        <Button onClick={backup} disabled={backingUp}>
          <Save aria-hidden="true" />
          {backingUp ? "Creating…" : "Create snapshot"}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            notify({
              tone: "error",
              message:
                "Restoring from a snapshot isn't exposed by the backend API yet. The server recovers from patients.dat.bak automatically if the primary file is corrupted.",
            })
          }
        >
          <RotateCcw aria-hidden="true" />
          Restore backup
        </Button>
      </div>
    </DashboardShell>
  );
}

function FileRow({ name }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3 text-sm">
      <Database aria-hidden="true" className="h-4 w-4 text-primary" />
      <strong className="font-semibold">{name}</strong>
    </div>
  );
}

export default BackupRestore;
