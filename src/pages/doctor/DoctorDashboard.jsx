import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, ShieldAlert, ShieldCheck, UserPlus, Search, Undo2, Redo2 } from "lucide-react";
import { getPatients } from "@/Services/api";
import { useCurrentUser } from "@/context/UserContext";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doctorMenu } from "@/lib/nav";

function DoctorDashboard() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [chainIntact, setChainIntact] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getPatients()
      .then((data) => {
        if (cancelled) return;
        setPatients(data.patients);
        setChainIntact(data.chainIntact);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const okPatients = patients.filter((p) => p.ok);
  const recent = okPatients.slice(-5).reverse();

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Doctor Dashboard">
      <PageHeading eyebrow="Overview" title={`Good Morning, ${user ? user.name : "Doctor"}`} description="Here's today's clinical overview." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Patients" value={loading ? "…" : String(okPatients.length)} note="Live from backend" />
        <StatCard icon={CalendarDays} label="Today's Appointments" value="12" note="View schedule" />
        <StatCard
          icon={ShieldAlert}
          label="Legacy (DES) Records"
          value={loading ? "…" : String(okPatients.filter((p) => p.algo === "DES").length)}
          note="Recommend re-encrypting"
          noteTone="muted"
        />
        <StatCard
          icon={ShieldCheck}
          label="Integrity Status"
          value={loading ? "…" : chainIntact ? "OK" : "BROKEN"}
          note={chainIntact ? "All records secure" : "Tampering detected"}
        />
      </div>

      <Panel
        title="Recent Patients"
        action={<Button variant="outline" size="sm" onClick={() => navigate("/doctor/patients")}>View All</Button>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase text-muted-foreground">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Age / Gender</th>
                <th className="py-2 pr-3">Diagnosis</th>
                <th className="py-2 pr-3">Encryption</th>
                <th className="py-2 pr-3">Integrity</th>
              </tr>
            </thead>
            <tbody>
              {!loading && recent.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-muted-foreground">No patients yet.</td></tr>
              )}
              {recent.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-3 font-semibold">{p.id}</td>
                  <td className="py-2.5 pr-3">{p.name}</td>
                  <td className="py-2.5 pr-3">{p.age} Y / {p.gender}</td>
                  <td className="py-2.5 pr-3">{p.diagnosis}</td>
                  <td className="py-2.5 pr-3">{p.algo}</td>
                  <td className="py-2.5 pr-3">
                    <Badge variant={p.ok ? "success" : "danger"}>{p.ok ? "OK" : "Failed"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Recent Actions">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <QuickAction icon={UserPlus} label="Add Patient" note="New patient record" onClick={() => navigate("/doctor/add-patient")} />
          <QuickAction icon={Search} label="Search Patient" note="Find patient quickly" onClick={() => navigate("/doctor/patients")} />
          <QuickAction icon={Undo2} label="Undo" note="Undo last action" onClick={() => navigate("/doctor/undo-redo")} />
          <QuickAction icon={Redo2} label="Redo" note="Redo last action" onClick={() => navigate("/doctor/undo-redo")} />
        </div>
      </Panel>

      <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
        🛡 AES-256 / DES Encryption &nbsp;|&nbsp; 💾 Backup Available &nbsp;|&nbsp;{" "}
        {chainIntact ? "✓ Integrity Verified" : "⚠ Integrity BROKEN"}
      </p>
    </DashboardShell>
  );
}

function QuickAction({ icon: Icon, label, note, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 text-left transition-colors hover:border-primary/40 hover:bg-muted"
    >
      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <strong className="block text-xs">{label}</strong>
        <small className="text-[11px] text-muted-foreground">{note}</small>
      </span>
    </button>
  );
}

export default DoctorDashboard;
