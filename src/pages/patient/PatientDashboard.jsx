import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, FileText, Pill, HeartPulse, ShieldCheck, Stethoscope, FileDown } from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import { getAppointments, getDocuments, documentContentUrl } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { patientMenu } from "@/lib/nav";

function PatientDashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useCurrentUser();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    getAppointments({ patientId: user.id })
      .then((data) => { if (!cancelled) setAppointments(data); })
      .catch(() => {});

    getDocuments(user.id)
      .then((data) => { if (!cancelled) setDocuments(data); })
      .catch(() => {});

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

  return (
    <DashboardShell role="Patient" menu={patientMenu} title="Patient Portal">
      <PageHeading
        eyebrow="Patient Portal"
        title={`Welcome, ${user?.name || "Patient"}`}
        description="Take care of your health today."
        action={
          <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)}>
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[9px]">
                {user?.name ? user.name.charAt(0).toUpperCase() : "P"}
              </AvatarFallback>
            </Avatar>
            My Profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarCheck}
          label="Upcoming Appointment"
          value={upcoming ? 1 : 0}
          note={upcoming ? `${upcoming.date}, ${upcoming.time}` : "None scheduled"}
        />
        <StatCard icon={FileText} label="Reports" value={documents.length} note="Available" />
        <StatCard icon={Pill} label="Prescriptions" value={0} note="Active prescriptions" />
        <StatCard icon={HeartPulse} label="Health Status" value="Good" note="✓ Healthy" />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Panel
          title="Upcoming Appointment"
          description="Your next scheduled consultation"
          action={upcoming && <Badge variant="success">{upcoming.status}</Badge>}
        >
          {upcoming ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3.5">
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold">{upcoming.doctorName}</h3>
                <p className="text-xs text-muted-foreground">{upcoming.reason || "Consultation"}</p>
              </div>
              <div className="text-right">
                <b className="block text-xs">{upcoming.date}</b>
                <span className="text-xs text-primary">{upcoming.time}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming appointments yet.</p>
          )}

          <Button className="mt-4 w-full" onClick={() => navigate("/patient/appointments")}>
            {upcoming ? "View Appointment Details" : "Book an Appointment"}
          </Button>
        </Panel>

        <Panel
          title="Recent Reports"
          description="Your latest medical reports"
          action={
            <Button variant="link" size="sm" onClick={() => navigate("/patient/reports")}>
              View All
            </Button>
          }
        >
          {recentDocuments.length === 0 && <p className="text-sm text-muted-foreground">No reports uploaded yet.</p>}

          <div className="flex flex-col gap-2.5">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 border-b border-border pb-2.5 last:border-0 last:pb-0">
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-muted">
                  <FileText className="h-4 w-4 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-xs">{doc.filename}</b>
                  <small className="text-[10px] text-muted-foreground">
                    {doc.uploaderRole === "Nurse" ? "From your nurse" : "You uploaded"} · {new Date(doc.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <a href={documentContentUrl(doc.id)} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline">
                    <FileDown className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
              <HeartPulse className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <b className="block text-xs">Health Status</b>
              <p className="text-[11px] text-muted-foreground">Your current health status is good.</p>
            </div>
            <strong className="text-xs text-success">✓ Healthy</strong>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <b className="block text-xs">Data Security</b>
              <p className="text-[11px] text-muted-foreground">Your health records are protected.</p>
            </div>
            <strong className="text-xs text-success">Protected</strong>
          </div>
        </Panel>
      </div>

      <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
        🔐 Your health data is encrypted and securely stored.
      </p>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="text-center">
          <DialogHeader className="items-center text-center">
            <Avatar className="mx-auto mb-2 h-16 w-16">
              <AvatarFallback className="text-xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : "P"}
              </AvatarFallback>
            </Avatar>
            <DialogTitle>{user?.name || "Patient"}</DialogTitle>
            <p className="text-xs text-muted-foreground">Patient</p>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-2.5 text-left">
            <div className="rounded-lg bg-muted p-2.5">
              <span className="block text-[10px] text-muted-foreground">Name</span>
              <b className="text-xs">{user?.name || "—"}</b>
            </div>
            <div className="rounded-lg bg-muted p-2.5">
              <span className="block text-[10px] text-muted-foreground">Email</span>
              <b className="text-xs">{user?.email || "—"}</b>
            </div>
            <div className="rounded-lg bg-muted p-2.5">
              <span className="block text-[10px] text-muted-foreground">Reports</span>
              <b className="text-xs">{documents.length} Available</b>
            </div>
            <div className="rounded-lg bg-muted p-2.5">
              <span className="block text-[10px] text-muted-foreground">Health Status</span>
              <b className="text-xs text-success">● Good</b>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

export default PatientDashboard;
