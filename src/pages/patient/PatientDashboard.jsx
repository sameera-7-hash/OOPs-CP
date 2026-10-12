import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { patientMenu } from "@/lib/nav";

function PatientDashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useCurrentUser();
  const navigate = useNavigate();

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
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments
    .filter((a) => a.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];

  const recentDocuments = [...documents]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "P";

  return (
    <DashboardShell role="Patient" menu={patientMenu} title="Patient Portal">
      <WelcomeBanner
        photo="consultation"
        eyebrow="Patient portal"
        title={`Welcome, ${user?.name || "Patient"}`}
        description="Your appointments and reports at a glance."
        action={
          <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)}>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{initial}</AvatarFallback>
            </Avatar>
            My profile
          </Button>
        }
      />

      <div className="stagger mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard tone="teal"
          icon={CalendarCheck}
          label="Upcoming appointment"
          value={loadingAppointments ? "…" : upcoming ? 1 : 0}
          note={upcoming ? `${upcoming.date}, ${upcoming.time}` : "None scheduled"}
        />
        <StatCard tone="blue" icon={FileText} label="Reports" value={loadingDocuments ? "…" : documents.length} note="Available to you" />
        <StatCard tone="amber" icon={Pill} label="Prescriptions" value={0} note="Not tracked yet" sample />
        <StatCard tone="green" icon={HeartPulse} label="Health status" value="Good" sample />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Panel
          title="Upcoming appointment"
          description="Your next scheduled consultation"
          action={upcoming && <StatusBadge status={upcoming.status} />}
        >
          {loadingAppointments ? (
            <div role="status" className="flex items-center gap-4 rounded-lg border border-border p-4">
              <span className="sr-only">Loading appointments…</span>
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
                <p className="text-sm text-muted-foreground">{upcoming.reason || "Consultation"}</p>
              </div>
              <div className="text-right">
                <b className="block text-sm">{upcoming.date}</b>
                <span className="text-sm font-medium text-primary">{upcoming.time}</span>
              </div>
            </div>
          ) : (
            <EmptyState art={CalendarCheckArt} className="py-4">
              You have no upcoming appointments.
            </EmptyState>
          )}

          <Button className="mt-4 w-full" onClick={() => navigate("/patient/appointments")}>
            {upcoming ? "View appointments" : "Book an appointment"}
          </Button>
        </Panel>

        <Panel
          title="Recent reports"
          description="Your latest medical documents"
          action={
            <Button variant="link" size="sm" className="px-0" onClick={() => navigate("/patient/reports")}>
              View all
            </Button>
          }
        >
          {loadingDocuments && <SkeletonRows rows={2} label="Loading reports…" />}
          {!loadingDocuments && recentDocuments.length === 0 && (
            <EmptyState
              art={FolderCrossArt}
              className="py-4"
              action={<Button variant="outline" size="sm" onClick={() => navigate("/patient/reports")}>Upload a report</Button>}
            >
              No reports yet.
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
                    {doc.uploaderRole === "Nurse" ? "From your nurse" : "You uploaded"} · {new Date(doc.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <Button size="icon" variant="outline" asChild>
                  <a href={documentContentUrl(doc.id)} target="_blank" rel="noreferrer" aria-label={`Open ${doc.filename} in a new tab`}>
                    <FileDown aria-hidden="true" />
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Notice icon={ShieldCheck}>Patient records are stored encrypted on the clinic server.</Notice>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="text-center">
          <DialogHeader className="items-center pr-0 text-center">
            <Avatar className="mx-auto mb-2 h-16 w-16">
              <AvatarFallback className="text-xl">{initial}</AvatarFallback>
            </Avatar>
            <DialogTitle>{user?.name || "Patient"}</DialogTitle>
            <p className="text-sm text-muted-foreground">Patient</p>
          </DialogHeader>

          <dl className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <ProfileItem label="Name" value={user?.name || "—"} />
            <ProfileItem label="Email" value={user?.email || "—"} />
            <ProfileItem label="Reports" value={`${documents.length} available`} />
            <ProfileItem label="Health status" value={<span className="flex items-center gap-2">Good <SampleTag /></span>} />
          </dl>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-semibold">{value}</dd>
    </div>
  );
}

export default PatientDashboard;
