import React, { useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { getPatients, getDocuments, uploadDocument, fileToBase64, documentContentUrl } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import EmptyState from "@/components/feedback/EmptyState";
import { SkeletonRows } from "@/components/feedback/Skeleton";
import { FolderCrossArt } from "@/components/art/Illustrations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { nurseMenu } from "@/lib/nav";

function textToBase64(text) {
  // btoa only handles Latin1; encodeURIComponent/unescape round-trip gets
  // arbitrary UTF-8 text into that range safely.
  return btoa(unescape(encodeURIComponent(text)));
}

const byNewest = (data) => [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

function Reports() {
  const { user } = useCurrentUser();
  const notify = useToast();

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [reportText, setReportText] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [patientDocs, setPatientDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    getPatients()
      .then((data) => setPatients(data.patients.filter((p) => p.ok)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!patientId) { setPatientDocs([]); return; }
    setLoadingDocs(true);
    getDocuments(patientId)
      .then((data) => setPatientDocs(byNewest(data)))
      .catch(() => {})
      .finally(() => setLoadingDocs(false));
  }, [patientId]);

  const selectedPatient = patients.find((p) => p.id === patientId);

  const submit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      setFormError("Choose a patient.");
      return;
    }
    if (!reportText.trim() && !file) {
      setFormError("Write a report, attach a file, or both.");
      return;
    }
    setFormError("");

    setSubmitting(true);
    try {
      if (file) {
        const dataBase64 = await fileToBase64(file);
        await uploadDocument({
          patientId,
          patientName: selectedPatient?.name || "",
          uploaderRole: "Nurse",
          uploaderName: user?.name || "Nurse",
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          dataBase64,
          note: reportText.trim(),
        });
      } else {
        const filename = `Nurse Report - ${new Date().toISOString().slice(0, 10)}.txt`;
        await uploadDocument({
          patientId,
          patientName: selectedPatient?.name || "",
          uploaderRole: "Nurse",
          uploaderName: user?.name || "Nurse",
          filename,
          contentType: "text/plain",
          dataBase64: textToBase64(reportText.trim()),
        });
      }

      notify({ message: "Report added. The patient and their doctor can now see it." });
      setReportText("");
      setFile(null);
      setFileInputKey((k) => k + 1);
      getDocuments(patientId)
        .then((data) => setPatientDocs(byNewest(data)))
        .catch(() => {});
    } catch (err) {
      notify({ tone: "error", message: `Could not add report: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Patient Reports">
      <PageHeading
        eyebrow="Nurse portal"
        title="Patient reports"
        description="Add a care report for a patient. The patient and their doctor can see it straight away."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel className="mb-0">
          <form onSubmit={submit} noValidate className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="report-patient">Patient <span aria-hidden="true">*</span></Label>
              <Select value={patientId} onValueChange={(v) => { setPatientId(v); setFormError(""); }}>
                <SelectTrigger id="report-patient">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.id} — {p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="report-text">Report</Label>
              <Textarea
                id="report-text"
                placeholder="Vitals, observations, care notes…"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="report-file">Attach a file (optional)</Label>
              <Input
                key={fileInputKey}
                id="report-file"
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                className="py-2 file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm file:font-semibold file:text-accent-foreground"
                aria-describedby="report-file-hint"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p id="report-file-hint" className="text-sm text-muted-foreground">Accepted: .txt, .doc, .docx, .pdf</p>
            </div>

            {formError && <p role="alert" className="text-sm font-medium text-destructive">{formError}</p>}

            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? "Adding…" : "Add report"}
            </Button>
          </form>
        </Panel>

        <Panel title={selectedPatient ? `${selectedPatient.name}'s reports` : "Existing reports"} className="mb-0">
          {!patientId && <p className="text-sm text-muted-foreground">Choose a patient to see their reports.</p>}
          {patientId && loadingDocs && <SkeletonRows rows={2} label="Loading reports…" />}
          {patientId && !loadingDocs && patientDocs.length === 0 && (
            <EmptyState art={FolderCrossArt} className="py-4">No reports for this patient yet.</EmptyState>
          )}

          <ul className="flex flex-col">
            {patientDocs.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 border-b border-border py-3 first:pt-0 last:border-0 last:pb-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary">
                  <FileText aria-hidden="true" className="h-4 w-4 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-sm font-semibold">{doc.filename}</b>
                  <small className="text-xs text-muted-foreground">
                    {doc.uploaderRole === "Nurse" ? `From ${doc.uploaderName}` : "From patient"} · {new Date(doc.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <Button size="icon" variant="outline" asChild>
                  <a href={documentContentUrl(doc.id)} target="_blank" rel="noreferrer" aria-label={`Open ${doc.filename} in a new tab`}>
                    <ExternalLink aria-hidden="true" />
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </DashboardShell>
  );
}

export default Reports;
