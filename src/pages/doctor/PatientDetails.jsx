import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink, FileText, ShieldAlert, ShieldCheck } from "lucide-react";
import { getPatients, getDocuments, documentContentUrl } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import EmptyState from "@/components/feedback/EmptyState";
import { Skeleton } from "@/components/feedback/Skeleton";
import { FolderCrossArt } from "@/components/art/Illustrations";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { doctorMenu } from "@/lib/nav";
import { formatIstDate } from "@/lib/time";
import { currentLocale } from "@/i18n";

function PatientDetails() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          setError(t("Patient not found."));
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
    <DashboardShell role="Doctor" menu={doctorMenu} title={t("Patient Details")}>
      <Button variant="ghost" size="sm" className="-ml-3 mb-4" onClick={() => navigate("/doctor/patients")}>
        <ArrowLeft aria-hidden="true" />
        {t("Back to patients")}
      </Button>

      <PageHeading eyebrow={t("Doctor portal")} title={t("Patient details")} description={t("Patient information and shared documents.")} />

      {loading && (
        <div role="status" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <span className="sr-only">{t("Loading patient…")}</span>
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex flex-1 flex-col gap-2"><Skeleton className="w-1/2" /><Skeleton className="h-3 w-1/3" /></div>
            </div>
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-40 rounded-xl" />
        </div>
      )}

      {!loading && error && <Notice tone="danger" role="alert" title={t("Couldn't show this patient")}>{error}</Notice>}

      {!loading && !error && patient && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Panel className="mb-0">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg">{patient.name ? patient.name.charAt(0).toUpperCase() : "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl">{patient.name}</h2>
                  <p className="text-sm text-muted-foreground">{patient.id} · {t("{{age}} years", { age: patient.age })} · {t(patient.gender)}</p>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2">
                <Detail label={t("Contact number")} value={patient.contact || "—"} />
                <Detail label={t("Admission date")} value={patient.admissionDate || "—"} />
                <Detail label={t("Diagnosis")} value={patient.diagnosis || "—"} />
                <Detail label={t("Encryption")} value={patient.algo || "—"} />
              </dl>
            </Panel>

            <Panel title={t("Reports & documents")} className="mb-0">
              {documents.length === 0 ? (
                <EmptyState art={FolderCrossArt} className="py-4">
                  {t("No reports or uploaded files for this patient yet.")}
                </EmptyState>
              ) : (
                <ul className="flex flex-col gap-1">
                  {documents.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={documentContentUrl(doc.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-lg p-2 text-sm text-foreground no-underline hover:bg-muted"
                      >
                        <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{doc.filename}</span>
                          <span className="block text-xs text-muted-foreground">
                            {doc.uploaderRole === "Nurse" ? t("{{name}} (nurse)", { name: doc.uploaderName }) : t("Patient upload")} ·{" "}
                            {formatIstDate(doc.createdAt, currentLocale())}
                          </span>
                        </span>
                        <ExternalLink aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">{t("(opens in a new tab)")}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="mb-2 mt-6 text-sm font-semibold">{t("Prescriptions")}</h3>
              <p className="text-sm text-muted-foreground">{t("Not tracked by the backend yet.")}</p>
            </Panel>
          </div>

          {/* TODO(api): the backend has no update/prescription endpoints for
              these records yet, so these actions are shown disabled. */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button disabled>{t("Edit record")}</Button>
            <Button disabled variant="outline">{t("Add prescription")}</Button>
            <Button disabled variant="outline">{t("Add diagnosis")}</Button>
            <span className="text-sm text-muted-foreground">{t("Editing isn't supported by the backend yet.")}</span>
          </div>

          <Notice
            className="mt-6"
            tone={patient.ok ? "success" : "danger"}
            icon={patient.ok ? ShieldCheck : ShieldAlert}
          >
            {patient.algo ? t("Encrypted with {{algo}}.", { algo: patient.algo }) : t("Encrypted with an unknown cipher.")}{" "}
            {patient.ok ? t("Integrity verified.") : t("Integrity check failed.")}
          </Notice>
        </>
      )}
    </DashboardShell>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}

export default PatientDetails;
