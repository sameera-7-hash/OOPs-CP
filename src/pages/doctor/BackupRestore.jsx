import React, { useCallback, useEffect, useRef, useState } from "react";
import { Database, DatabaseZap, RefreshCw, RotateCcw, Save, ScrollText } from "lucide-react";
import { createBackup, getLogs } from "@/Services/api";
import { useToast } from "@/context/ToastContext";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import SampleTag from "@/components/feedback/SampleTag";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { doctorMenu } from "@/lib/nav";

function BackupRestore() {
  const notify = useToast();
  const [backingUp, setBackingUp] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

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
          <FileRow name="patients.dat.bak">
            <Button size="sm" variant="outline" onClick={() => setLogsOpen(true)}>
              <ScrollText aria-hidden="true" />
              View logs
            </Button>
          </FileRow>
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

      <LogsDialog open={logsOpen} onOpenChange={setLogsOpen} />
    </DashboardShell>
  );
}

function FileRow({ name, children }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3 text-sm">
      <Database aria-hidden="true" className="h-4 w-4 text-primary" />
      <strong className="flex-1 font-semibold">{name}</strong>
      {children}
    </div>
  );
}

// Activity log for the whole site (backend logs/app.log, newest last).
// patients.dat.bak itself is encrypted records, so this shows the log
// rather than the file's bytes.
function LogsDialog({ open, onOpenChange }) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    getLogs()
      .then((data) => {
        setLog(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [log]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Activity log</DialogTitle>
          <DialogDescription>
            {log
              ? `Last ${log.lines.length} of ${log.totalLines} entries from ${log.file}.`
              : "Server events across the whole site."}
          </DialogDescription>
        </DialogHeader>

        {error && <Notice tone="danger" role="alert" title="Couldn't load the log" className="mb-3">{error}</Notice>}

        <div className="max-h-80 overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-xs leading-relaxed">
          {loading && !log && <p className="text-muted-foreground">Loading…</p>}
          {log && log.lines.length === 0 && <p className="text-muted-foreground">The log is empty.</p>}
          {log?.lines.map((line, index) => (
            <div key={index} className={logLineClass(line)}>{line}</div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" variant="outline" onClick={load} disabled={loading}>
            <RefreshCw aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function logLineClass(line) {
  if (line.includes("[ERROR]")) return "whitespace-pre-wrap break-all text-destructive";
  if (line.includes("[WARN]")) return "whitespace-pre-wrap break-all text-warning";
  return "whitespace-pre-wrap break-all text-foreground";
}

export default BackupRestore;
