import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, FileText, FileType2, ExternalLink } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { getDocuments, uploadDocument, fileToBase64, documentContentUrl } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { patientMenu } from "@/lib/nav";

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
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const loadDocuments = () => {
    if (!user) return;
    setLoading(true);
    getDocuments(user.id)
      .then((data) => setDocuments([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadDocuments, [user]);

  const uploadFiles = async (fileList) => {
    if (!user) return;
    const files = Array.from(fileList).filter(isAccepted);
    if (files.length === 0) {
      alert("Only .txt, .doc, .docx and .pdf files are accepted.");
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
      loadDocuments();
    } catch (err) {
      alert("Could not upload file: " + err.message);
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
    <DashboardShell role="Patient" menu={patientMenu} title="My Reports">
      <PageHeading
        eyebrow="Medical Records"
        title="My Reports"
        description="Upload your own documents, and see reports your care team has shared with you."
      />

      <div
        className={cn(
          "mb-6 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-card p-10 text-center transition-colors",
          dragOver && "border-primary bg-primary/5"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) uploadFiles(e.target.files); e.target.value = ""; }}
        />
        <UploadCloud className="h-8 w-8 text-primary" />
        <p className="text-sm"><strong>Drag & drop</strong> a file here, or click to browse.</p>
        <small className="text-xs text-muted-foreground">Accepted: .txt, .doc, .docx, .pdf</small>
        {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
      </div>

      <div className="flex flex-col gap-3">
        {!loading && documents.length === 0 && (
          <p className="text-sm text-muted-foreground">No reports yet. Upload one above, or check back after your next visit.</p>
        )}

        {documents.map((doc) => {
          const Icon = iconFor(doc.filename);
          return (
            <Card key={doc.id} className="flex items-center gap-4 p-4">
              <span
                className={cn(
                  "grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl",
                  doc.uploaderRole === "Nurse" ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold">{doc.filename}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {doc.uploaderRole === "Nurse" ? `From ${doc.uploaderName || "your nurse"}` : "Uploaded by you"}
                  {" · "}
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
                {doc.note && <p className="mt-1 text-xs text-foreground/80">{doc.note}</p>}
              </div>

              <a href={documentContentUrl(doc.id)} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View
                </Button>
              </a>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}

export default MedicalRecords;
