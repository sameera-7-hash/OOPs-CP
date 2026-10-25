import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDownUp, ClipboardPlus, RefreshCw, Search, ShieldAlert, UserPlus, Users } from "lucide-react";
import { getPatients } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import StatCard from "@/components/layout/StatCard";
import Notice from "@/components/feedback/Notice";
import EmptyState from "@/components/feedback/EmptyState";
import { SkeletonRows } from "@/components/feedback/Skeleton";
import { ClipboardChartArt } from "@/components/art/Illustrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function PatientRecords({ role, menu }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [patients, setPatients] = useState([]);
  const [patientAccounts, setPatientAccounts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshPatients = useCallback(() => {
    getPatients()
      .then((data) => {
        setPatients(data.patients);
        setPatientAccounts(data.patientAccounts ?? 0);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshPatients();
    const interval = window.setInterval(refreshPatients, 15000);
    return () => window.clearInterval(interval);
  }, [refreshPatients]);

  const filtered = patients
    .filter((patient) => (
      !patient.ok ||
      `${patient.id} ${patient.name} ${patient.diagnosis}`.toLowerCase().includes(search.toLowerCase())
    ))
    .sort((a, b) => {
      if (!a.ok || !b.ok) return Number(a.ok) - Number(b.ok);
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "age") return a.age - b.age;
      if (sort === "id") return a.id.localeCompare(b.id);
      return 0;
    });

  const isDoctor = role === "Doctor";
  const addedManually = patients.filter((patient) => patient.ok).length;
  const columns = isDoctor ? 7 : 6;

  return (
    <DashboardShell role={role} menu={menu} title={t("Patient Records")}>
      <PageHeading
        eyebrow={isDoctor ? t("Doctor portal") : t("Nurse portal")}
        title={t("Patient records")}
        description={t("Records shared with your care team.")}
      />

      <div className="stagger mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          tone="teal"
          icon={Users}
          label={t("Total patients")}
          value={loading ? "…" : patientAccounts + addedManually}
          note={t("Accounts plus added records")}
        />
        <StatCard
          tone="blue"
          icon={UserPlus}
          label={t("Signed up as patients")}
          value={loading ? "…" : patientAccounts}
          note={t("Created on the patient side")}
        />
        <StatCard
          tone="green"
          icon={ClipboardPlus}
          label={t("Added manually")}
          value={loading ? "…" : addedManually}
          note={t("Added by care staff")}
        />
      </div>

      <Panel>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="patient-search">{t("Search")}</Label>
            <div className="relative">
              <Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="patient-search"
                type="search"
                className="pl-10"
                placeholder={t("ID, name or diagnosis")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:w-52">
            <Label htmlFor="patient-sort">{t("Sort by")}</Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger id="patient-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("Name")}</SelectItem>
                <SelectItem value="age">{t("Age")}</SelectItem>
                <SelectItem value="id">{t("Patient ID")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={refreshPatients} disabled={loading}>
            <RefreshCw aria-hidden="true" />
            {t("Refresh")}
          </Button>
        </div>

        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
          {patients.length === 1
            ? t("1 patient record. The list refreshes every 15 seconds.")
            : t("{{count}} patient records. The list refreshes every 15 seconds.", { count: patients.length })}
        </p>

        {loading && <SkeletonRows rows={4} label={t("Loading patients…")} />}
        {error && (
          <Notice tone="danger" role="alert" title={t("Couldn't load patients")} className="mb-4">{error}</Notice>
        )}

        {!loading && !error && patients.length === 0 && (
          <EmptyState
            art={ClipboardChartArt}
            title={t("No patient records yet")}
            action={isDoctor && <Button onClick={() => navigate("/doctor/add-patient")}>{t("Add a patient")}</Button>}
          >
            {isDoctor ? t("Add the first patient to get started.") : t("Records appear here once a doctor adds them.")}
          </EmptyState>
        )}

        {!loading && patients.length > 0 && (
          <div className="relative -mx-6 overflow-x-auto px-6">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("ID")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Name")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Age")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Gender")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Diagnosis")}</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">{t("Encryption")}</th>
                  {isDoctor && <th scope="col" className="py-2 pr-4 font-semibold"><span className="sr-only">{t("Action")}</span></th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={columns} className="py-6 text-center text-muted-foreground">
                      {t("No patients match “{{search}}”.", { search })}
                    </td>
                  </tr>
                )}
                {filtered.map((patient, index) => (
                  patient.ok ? (
                    <tr key={patient.id} className="border-b border-border last:border-0 hover:bg-muted/60">
                      <td className="py-3 pr-4 font-semibold">{patient.id}</td>
                      <td className="py-3 pr-4">{patient.name}</td>
                      <td className="py-3 pr-4 tabular-nums">{patient.age}</td>
                      <td className="py-3 pr-4">{t(patient.gender)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{patient.diagnosis}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={patient.algo && patient.algo.startsWith("DES") ? "warning" : "default"}>
                          {patient.algo}
                        </Badge>
                      </td>
                      {isDoctor && (
                        <td className="py-3 pr-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                            aria-label={t("View {{name}}", { name: patient.name })}
                          >
                            {t("View")}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ) : (
                    <tr key={`invalid-${index}`} className="border-b border-border last:border-0">
                      <td colSpan={columns} className="py-3 pr-4 text-destructive">
                        <span className="flex items-center gap-2">
                          <ShieldAlert aria-hidden="true" className="h-4 w-4" />
                          {t("Record could not be verified: {{problem}}", { problem: patient.problem || t("integrity check failed") })}
                        </span>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {isDoctor && (
        <Notice icon={ArrowDownUp}>
          {t("Patient ID search uses a hash map, and the list is ordered with a sorting algorithm.")}
        </Notice>
      )}
    </DashboardShell>
  );
}

export default PatientRecords;
