import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  CircleCheck,
  CircleX,
  Redo2,
  Search,
  ShieldAlert,
  ShieldCheck,
  Undo2,
  UserPlus,
  Users,
} from "lucide-react";
import { getPatients } from "@/Services/api";
import { useCurrentUser } from "@/context/UserContext";
import DashboardShell from "@/components/layout/DashboardShell";
import WelcomeBanner from "@/components/layout/WelcomeBanner";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import EmptyState from "@/components/feedback/EmptyState";
import { SkeletonRows } from "@/components/feedback/Skeleton";
import { ClipboardChartArt } from "@/components/art/Illustrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IconTile from "@/components/IconTile";
import { doctorMenu } from "@/lib/nav";

function DoctorDashboard() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [patients, setPatients] = useState([]);
  const [chainIntact, setChainIntact] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getPatients()
      .then((data) => {
        if (cancelled) return;
        setPatients(data.patients);
        setChainIntact(data.chainIntact);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const okPatients = patients.filter((p) => p.ok);
  const recent = okPatients.slice(-5).reverse();

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title={t("Doctor Dashboard")}>
      <WelcomeBanner
        photo="doctor" eyebrow={t("Overview")} title={t("Hello, {{name}}", { name: user ? user.name : t("Doctor") })} description={t("Today's clinical overview.")} />

      <div className="stagger mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard tone="teal" icon={Users} label={t("Total patients")} value={loading ? "…" : okPatients.length} note={t("From patient records")} />
        <StatCard tone="blue" icon={CalendarDays} label={t("Today's appointments")} value="12" sample />
        <StatCard tone="amber"
          icon={ShieldAlert}
          label={t("Legacy (DES) records")}
          value={loading ? "…" : okPatients.filter((p) => p.algo === "DES").length}
          note={t("Consider re-encrypting with AES")}
        />
        <StatCard tone="green"
          icon={ShieldCheck}
          label={t("Integrity status")}
          value={loading ? "…" : chainIntact ? t("OK") : t("Broken")}
          note={chainIntact ? t("Hash chain verified") : t("Tampering detected")}
          noteTone={chainIntact ? "success" : "muted"}
        />
      </div>

      <Panel
        title={t("Recent patients")}
        action={<Button variant="outline" size="sm" onClick={() => navigate("/doctor/patients")}>{t("View all")}</Button>}
      >
        {loading && <SkeletonRows rows={3} label={t("Loading patients…")} />}
        {!loading && error && (
          <Notice tone="danger" role="alert" title={t("Couldn't load patients")}>{error}</Notice>
        )}
        {!loading && !error && recent.length === 0 && (
          <EmptyState
            art={ClipboardChartArt}
            title={t("No patients yet")}
            action={<Button onClick={() => navigate("/doctor/add-patient")}>{t("Add a patient")}</Button>}
          >
            {t("Patient records you add will appear here.")}
          </EmptyState>
        )}
        {!loading && !error && recent.length > 0 && (
          <div className="relative -mx-6 overflow-x-auto px-6">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("ID")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Name")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Age / gender")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Diagnosis")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Encryption")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Integrity")}</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-semibold">{p.id}</td>
                    <td className="py-3 pr-4">{p.name}</td>
                    <td className="py-3 pr-4">{t("{{age}} y", { age: p.age })} / {t(p.gender)}</td>
                    <td className="py-3 pr-4">{p.diagnosis}</td>
                    <td className="py-3 pr-4">{p.algo}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={p.ok ? "success" : "danger"}>
                        {p.ok ? <CircleCheck aria-hidden="true" /> : <CircleX aria-hidden="true" />}
                        {p.ok ? t("Verified") : t("Failed")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title={t("Quick actions")}>
        <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickAction tone="teal" icon={UserPlus} label={t("Add patient")} note={t("Create a new patient record")} onClick={() => navigate("/doctor/add-patient")} />
          <QuickAction tone="blue" icon={Search} label={t("Find a patient")} note={t("Search patient records")} onClick={() => navigate("/doctor/patients")} />
          <QuickAction tone="amber" icon={Undo2} label={t("Undo")} note={t("Undo / redo demo")} onClick={() => navigate("/doctor/undo-redo")} />
          <QuickAction tone="green" icon={Redo2} label={t("Redo")} note={t("Undo / redo demo")} onClick={() => navigate("/doctor/undo-redo")} />
        </div>
      </Panel>

      {!loading && !error && (
        <Notice tone={chainIntact ? "success" : "danger"} icon={chainIntact ? ShieldCheck : ShieldAlert}>
          {t("Records are encrypted with AES-256 or DES.")}{" "}
          {chainIntact ? t("Hash-chain integrity verified.") : t("Hash-chain integrity check failed.")}
        </Notice>
      )}
    </DashboardShell>
  );
}

function QuickAction({ icon, tone, label, note, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-lift flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:border-primary/40"
    >
      <IconTile icon={icon} tone={tone} />
      <span>
        <strong className="block text-sm font-semibold">{label}</strong>
        <small className="text-sm text-muted-foreground">{note}</small>
      </span>
    </button>
  );
}

export default DoctorDashboard;
