import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, FileText, FileType2, LoaderCircle, UploadCloud } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { useCurrentUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { getDocuments, uploadDocument, fileToBase64, documentContentUrl } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import EmptyState from "@/components/feedback/EmptyState";
import { SkeletonRows } from "@/components/feedback/Skeleton";
import { FolderCrossArt } from "@/components/art/Illustrations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatIstDate } from "@/lib/time";
import { patientMenu } from "@/lib/nav";
import { currentLocale } from "@/i18n";

const ACCEPTED_EXTENSIONS = [".txt", ".doc", ".docx", ".pdf"];

function iconFor(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (ext === "pdf" || ext === "doc" || ext === "docx") return FileType2;
  return FileText;
}

function isAccepted(file) {
  const lower = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function MedicalRecords() {
  const { user } = useCurrentUser();
  const notify = useToast();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const loadDocuments = () => {
    if (!user) return;
    setLoading(true);
    getDocuments(user.id)
      .then((data) => {
        setDocuments([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        setLoadError("");
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadDocuments, [user]);

  const uploadFiles = async (fileList) => {
    if (!user) return;
    const files = Array.from(fileList).filter(isAccepted);
    if (files.length === 0) {
      notify({ tone: "error", message: t("Only .txt, .doc, .docx and .pdf files are accepted.") });
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const dataBase64 = await fileToBase64(file);
        await uploadDocument({
          patientId: user.id,
          patientName: user.name,
          uploaderRole: "Patient",
          uploaderName: user.name,
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          dataBase64,
        });
      }
      notify({ message: files.length === 1 ? t("{{name}} uploaded.", { name: files[0].name }) : t("{{count}} files uploaded.", { count: files.length }) });
      loadDocuments();
    } catch (err) {
      notify({ tone: "error", message: t("Could not upload file: {{error}}", { error: err.message }) });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  return (
    <DashboardShell role="Patient" menu={patientMenu} title={t("My Reports")}>
      <PageHeading
        eyebrow={t("Medical records")}
        title={t("My reports")}
        description={t("Upload your own documents, and see reports your care team has shared with you.")}
      />

      <div
        className={cn(
          "mb-8 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed bg-card px-6 py-10 text-center transition-colors duration-150",
          dragOver ? "border-primary bg-secondary" : "border-border"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          id="report-file"
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => { if (e.target.files?.length) uploadFiles(e.target.files); e.target.value = ""; }}
        />
        {uploading ? (
          <LoaderCircle aria-hidden="true" className="h-10 w-10 animate-spin text-primary motion-reduce:animate-none" />
        ) : (
          <UploadCloud aria-hidden="true" className="h-10 w-10 text-primary" />
        )}
        <p className="text-base">
          <Trans i18nKey="<strong>Drag and drop</strong> a file here, or" components={{ strong: <strong /> }} />
        </p>
        <Button type="button" variant="outline" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
          {t("Choose a file")}
        </Button>
        <small className="text-sm text-muted-foreground">{t("Accepted: .txt, .doc, .docx, .pdf")}</small>
        <p aria-live="polite" className="text-sm font-medium text-primary">{uploading ? t("Uploading…") : ""}</p>
      </div>

      <h2 className="mb-4 text-lg">{t("Your documents")}</h2>

      {loading && documents.length === 0 && <SkeletonRows rows={3} label={t("Loading reports…")} />}
      {!loading && loadError && (
        <p role="alert" className="text-sm text-destructive">{t("Couldn't load your reports: {{error}}", { error: loadError })}</p>
      )}
      {!loading && !loadError && documents.length === 0 && (
        <Card>
          <EmptyState
            art={FolderCrossArt}
            title={t("No reports yet")}
            action={<Button variant="outline" onClick={() => fileInputRef.current?.click()}>{t("Upload a report")}</Button>}
          >
            {t("Upload one above, or check back after your next visit.")}
          </EmptyState>
        </Card>
      )}

      <ul className="stagger flex flex-col gap-3">
        {documents.map((doc) => {
          const Icon = iconFor(doc.filename);
          const fromNurse = doc.uploaderRole === "Nurse";
          return (
            <li key={doc.id}>
              <Card className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-lg",
                    fromNurse ? "bg-success/10 text-success" : "bg-secondary text-primary"
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base">{doc.filename}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {fromNurse ? t("From {{name}}", { name: doc.uploaderName || t("your nurse") }) : t("Uploaded by you")}
                    {" · "}
                    {formatIstDate(doc.createdAt, currentLocale())}
                  </p>
                  {doc.note && <p className="mt-1 text-sm text-foreground/90">{doc.note}</p>}
                </div>

                <Button variant="outline" size="sm" asChild>
                  <a href={documentContentUrl(doc.id)} target="_blank" rel="noreferrer">
                    <ExternalLink aria-hidden="true" />
                    {t("View")}
                    <span className="sr-only">{t("{{name}} (opens in a new tab)", { name: doc.filename })}</span>
                  </a>
                </Button>
              </Card>
            </li>
          );
        })}
      </ul>
    </DashboardShell>
  );
}

export default MedicalRecords;
