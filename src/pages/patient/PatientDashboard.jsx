import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarCheck, FileDown, FileText, HeartPulse, Pill, ShieldCheck, Stethoscope } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { getAppointments, getDocuments, documentContentUrl } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import WelcomeBanner from "@/components/layout/WelcomeBanner";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import StatusBadge from "@/components/feedback/StatusBadge";
import EmptyState from "@/components/feedback/EmptyState";
import SampleTag from "@/components/feedback/SampleTag";
import Notice from "@/components/feedback/Notice";
import { Skeleton, SkeletonRows } from "@/components/feedback/Skeleton";
import { CalendarCheckArt, FolderCrossArt } from "@/components/art/Illustrations";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfileDialog, { ProfileItem } from "@/components/profile/ProfileDialog";
import { patientMenu } from "@/lib/nav";
import { formatIstDate, todayIst } from "@/lib/time";
import { currentLocale } from "@/i18n";

function PatientDashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    getAppointments({ patientId: user.id })
      .then((data) => { if (!cancelled) setAppointments(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingAppointments(false); });

    getDocuments(user.id)
      .then((data) => { if (!cancelled) setDocuments(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingDocuments(false); });

    return () => { cancelled = true; };
  }, [user]);

  // Soonest appointment by date+time, today or later.
  const today = todayIst();
  const upcoming = appointments
    .filter((a) => a.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];

  const recentDocuments = [...documents]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "P";

  return (
    <DashboardShell role="Patient" menu={patientMenu} title={t("Patient Portal")}>
      <WelcomeBanner
        photo="consultation"
        eyebrow={t("Patient portal")}
        title={t("Welcome, {{name}}", { name: user?.name || t("Patient") })}
        description={t("Your appointments and reports at a glance.")}
        action={
          <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)}>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{initial}</AvatarFallback>
            </Avatar>
            {t("My profile")}
          </Button>
        }
      />

      <div className="stagger mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard tone="teal"
          icon={CalendarCheck}
          label={t("Upcoming appointment")}
          value={loadingAppointments ? "…" : upcoming ? 1 : 0}
          note={upcoming ? `${upcoming.date}, ${upcoming.time}` : t("None scheduled")}
        />
        <StatCard tone="blue" icon={FileText} label={t("Reports")} value={loadingDocuments ? "…" : documents.length} note={t("Available to you")} />
        <StatCard tone="amber" icon={Pill} label={t("Prescriptions")} value={0} note={t("Not tracked yet")} sample />
        <StatCard tone="green" icon={HeartPulse} label={t("Health status")} value={t("Good")} sample />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Panel
          title={t("Upcoming appointment")}
          description={t("Your next scheduled consultation")}
          action={upcoming && <StatusBadge status={upcoming.status} />}
        >
          {loadingAppointments ? (
            <div role="status" className="flex items-center gap-4 rounded-lg border border-border p-4">
              <span className="sr-only">{t("Loading appointments…")}</span>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-1 flex-col gap-2"><Skeleton className="w-1/2" /><Skeleton className="h-3 w-1/3" /></div>
            </div>
          ) : upcoming ? (
            <div className="flex items-center gap-4 rounded-lg border border-border bg-muted p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <Stethoscope aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base">{upcoming.doctorName}</h3>
                <p className="text-sm text-muted-foreground">{upcoming.reason || t("Consultation")}</p>
              </div>
              <div className="text-right">
                <b className="block text-sm">{upcoming.date}</b>
                <span className="text-sm font-medium text-primary">{upcoming.time}</span>
              </div>
            </div>
          ) : (
            <EmptyState art={CalendarCheckArt} className="py-4">
              {t("You have no upcoming appointments.")}
            </EmptyState>
          )}

          <Button className="mt-4 w-full" onClick={() => navigate("/patient/appointments")}>
            {upcoming ? t("View appointments") : t("Book an appointment")}
          </Button>
        </Panel>

        <Panel
          title={t("Recent reports")}
          description={t("Your latest medical documents")}
          action={
            <Button variant="link" size="sm" className="px-0" onClick={() => navigate("/patient/reports")}>
              {t("View all")}
            </Button>
          }
        >
          {loadingDocuments && <SkeletonRows rows={2} label={t("Loading reports…")} />}
          {!loadingDocuments && recentDocuments.length === 0 && (
            <EmptyState
              art={FolderCrossArt}
              className="py-4"
              action={<Button variant="outline" size="sm" onClick={() => navigate("/patient/reports")}>{t("Upload a report")}</Button>}
            >
              {t("No reports yet.")}
            </EmptyState>
          )}

          <ul className="flex flex-col">
            {recentDocuments.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 border-b border-border py-3 first:pt-0 last:border-0 last:pb-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary">
                  <FileText aria-hidden="true" className="h-4 w-4 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-sm font-semibold">{doc.filename}</b>
                  <small className="text-xs text-muted-foreground">
                    {doc.uploaderRole === "Nurse" ? t("From your nurse") : t("You uploaded")} · {formatIstDate(doc.createdAt, currentLocale())}
                  </small>
                </div>
                <Button size="icon" variant="outline" asChild>
                  <a href={documentContentUrl(doc.id)} target="_blank" rel="noreferrer" aria-label={t("Open {{name}} in a new tab", { name: doc.filename })}>
                    <FileDown aria-hidden="true" />
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Notice icon={ShieldCheck}>{t("Patient records are stored encrypted on the clinic server.")}</Notice>

      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={user}
        role="Patient"
        extra={
          <>
            <ProfileItem label={t("Reports")} value={t("{{count}} available", { count: documents.length })} />
            <ProfileItem label={t("Health status")} value={<span className="flex items-center gap-2">{t("Good")} <SampleTag /></span>} />
          </>
        }
      />
    </DashboardShell>
  );
}

export default PatientDashboard;
