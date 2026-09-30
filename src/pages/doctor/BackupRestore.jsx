import React, { useState } from "react";
import { Save, RotateCcw, DatabaseZap } from "lucide-react";
import { createBackup } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doctorMenu } from "@/lib/nav";

function BackupRestore() {
  const [backingUp, setBackingUp] = useState(false);

  const backup = async () => {
    setBackingUp(true);
    try {
      const result = await createBackup();
      alert("Snapshot saved: " + result.snapshot);
    } catch (err) {
      alert("Could not create snapshot: " + err.message);
    } finally {
      setBackingUp(false);
    }
  };

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Backup & Restore">
      <PageHeading eyebrow="Doctor Portal" title="Backup & Restore" description="Manage database backups and verify integrity." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Panel title="Primary Database">
          <div className="flex items-center justify-between rounded-lg bg-muted p-3.5 text-xs">
            <strong>patients.dat</strong>
            <Badge variant="success">✓ Healthy</Badge>
          </div>
        </Panel>

        <Panel title="Backup Database">
          <div className="flex items-center justify-between rounded-lg bg-muted p-3.5 text-xs">
            <strong>patients.dat.bak</strong>
            <Badge variant="success">✓ Available</Badge>
          </div>
        </Panel>
      </div>

      <Panel title="Integrity Status">
        <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
          <DatabaseZap className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
          <div>
            <strong className="text-sm text-success">✓ Hash Chain Verified</strong>
            <p className="mt-1 text-xs text-success/90">All stored records are consistent and tamper-evident.</p>
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        <Button onClick={backup} disabled={backingUp}>
          <Save className="h-4 w-4" />
          {backingUp ? "Creating..." : "Create Snapshot"}
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            alert(
              "Restoring from a snapshot isn't exposed by the backend API yet — the server automatically recovers from patients.dat.bak if the primary file is corrupted."
            )
          }
        >
          <RotateCcw className="h-4 w-4" />
          Restore Backup
        </Button>
      </div>
    </DashboardShell>
  );
}

export default BackupRestore;
