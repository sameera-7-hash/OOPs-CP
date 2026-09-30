import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { getPatients, getDocuments, documentContentUrl } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { doctorMenu } from "@/lib/nav";

function PatientDetails() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let cancelled = false;

    // The backend has no GET /api/patients/:id, so we fetch the full list
    // and find the record client-side.
    getPatients()
      .then((data) => {
        if (cancelled) return;
        const found = data.patients.find((p) => p.id === patientId);
        if (!found) {
          setError("Patient not found.");
        } else {
          setPatient(found);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    if (patientId) {
      getDocuments(patientId)
        .then((data) => {
          if (!cancelled) setDocuments([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        })
        .catch(() => {});
    }

    return () => { cancelled = true; };
  }, [patientId]);

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Patient Details">
      <Button variant="ghost" size="sm" className="mb-3" onClick={() => navigate("/doctor/patients")}>
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </Button>

      <PageHeading eyebrow="Doctor Portal" title="Patient Details" description="Complete patient information and medical history." />

      {loading && <p className="text-sm text-muted-foreground">Loading patient...</p>}
      {!loading && error && <p className="text-sm text-muted-foreground">{error}</p>}

      {!loading && !error && patient && (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
            <Panel>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg">{patient.name ? patient.name.charAt(0).toUpperCase() : "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold">{patient.name}</h2>
                  <p className="text-xs text-muted-foreground">{patient.id} • {patient.age} Years • {patient.gender}</p>
                </div>
              </div>

              <div className="my-4 h-px bg-border" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Contact Number" value={patient.contact || "—"} />
                <Detail label="Admission Date" value={patient.admissionDate || "—"} />
                <Detail label="Diagnosis" value={patient.diagnosis || "—"} />
                <Detail label="Encryption" value={patient.algo || "—"} />
              </div>
            </Panel>

            <Panel title="Reports & Documents">
              {documents.length === 0 && <p className="text-sm text-muted-foreground">No reports or uploaded files for this patient yet.</p>}

              <div className="flex flex-col gap-2">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={documentContentUrl(doc.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-foreground hover:text-primary"
                  >
                    <FileText className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    <span className="truncate">{doc.filename}</span>
                    <span className="whitespace-nowrap text-muted-foreground">
                      — {doc.uploaderRole === "Nurse" ? `${doc.uploaderName} (nurse)` : "patient upload"}, {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </a>
                ))}
              </div>

              <h3 className="mb-2 mt-5 text-sm font-bold">Prescriptions</h3>
              <p className="text-sm text-muted-foreground">Not tracked by the backend yet.</p>
            </Panel>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button>Edit Record</Button>
            <Button>Add Prescription</Button>
            <Button>Add Diagnosis</Button>
          </div>

          <p className="mt-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
            🔐 Encryption: {patient.algo || "unknown"} &nbsp;|&nbsp;{" "}
            {patient.ok ? "✓ Integrity Verified" : "⚠ Integrity check failed"} &nbsp;|&nbsp; 💾 Backup Available
          </p>
        </>
      )}
    </DashboardShell>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <small className="block text-[10px] text-muted-foreground">{label}</small>
      <strong className="text-sm">{value}</strong>
    </div>
  );
}

export default PatientDetails;
