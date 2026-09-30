import React, { useEffect, useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { getPatients, getDocuments, uploadDocument, fileToBase64, documentContentUrl } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
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

function Reports() {
  const { user } = useCurrentUser();

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [reportText, setReportText] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
      .then((data) => setPatientDocs([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
      .catch(() => {})
      .finally(() => setLoadingDocs(false));
  }, [patientId]);

  const selectedPatient = patients.find((p) => p.id === patientId);

  const submit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      alert("Please choose a patient.");
      return;
    }
    if (!reportText.trim() && !file) {
      alert("Write a report, attach a file, or both.");
      return;
    }

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

      alert("Report added. The patient (and their doctor) can now see it.");
      setReportText("");
      setFile(null);
      getDocuments(patientId)
        .then((data) => setPatientDocs([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
        .catch(() => {});
    } catch (err) {
      alert("Could not add report: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Patient Reports">
      <PageHeading
        eyebrow="Nurse Portal"
        title="Patient Reports"
        description="Add a care report for a patient. It becomes visible to the patient and their doctor immediately."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <Panel>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <Label>Patient *</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.id} — {p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Report</Label>
              <Textarea
                className="mt-1.5"
                placeholder="Vitals, observations, care notes..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
              />
            </div>

            <div>
              <Label>Attach a file (optional)</Label>
              <Input
                className="mt-1.5"
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? "Adding..." : "Add Report"}
            </Button>
          </form>
        </Panel>

        <Panel title={selectedPatient ? `${selectedPatient.name}'s Reports` : "Select a patient"}>
          {!patientId && <p className="text-sm text-muted-foreground">Choose a patient to see their existing reports.</p>}
          {patientId && loadingDocs && <p className="text-sm text-muted-foreground">Loading...</p>}
          {patientId && !loadingDocs && patientDocs.length === 0 && (
            <p className="text-sm text-muted-foreground">No reports for this patient yet.</p>
          )}

          <div className="flex flex-col gap-2.5">
            {patientDocs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 border-b border-border pb-2.5 last:border-0 last:pb-0">
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-muted">
                  <FileText className="h-4 w-4 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-xs">{doc.filename}</b>
                  <small className="text-[10px] text-muted-foreground">
                    {doc.uploaderRole === "Nurse" ? `From ${doc.uploaderName}` : "From patient"} · {new Date(doc.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <a href={documentContentUrl(doc.id)} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline"><ExternalLink className="h-3.5 w-3.5" /></Button>
                </a>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

export default Reports;
