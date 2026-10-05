import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Search } from "lucide-react";
import { getPatients } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function PatientRecords({ role, menu }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshPatients = useCallback(() => {
    getPatients()
      .then((data) => {
        setPatients(data.patients);
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

  return (
    <DashboardShell role={role} menu={menu} title="Patient Records">
      <PageHeading
        eyebrow={`${role} Portal`}
        title="Patient Records"
        description="View patient records shared with your care team."
      />

      <Panel>
        <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by ID, name or diagnosis..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="age">Sort by Age</SelectItem>
              <SelectItem value="id">Sort by Patient ID</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={refreshPatients} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <p className="mb-2 text-xs text-muted-foreground">
          {patients.length} patient record(s); list refreshes automatically every 15 seconds.
        </p>
        {loading && <p className="text-sm text-muted-foreground">Loading patients...</p>}
        {error && <p role="alert" className="text-sm text-destructive">Could not load patients: {error}</p>}

        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase text-muted-foreground">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Age</th>
                  <th className="py-2 pr-3">Gender</th>
                  <th className="py-2 pr-3">Diagnosis</th>
                  <th className="py-2 pr-3">Encryption</th>
                  {isDoctor && <th className="py-2 pr-3">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && !error && (
                  <tr>
                    <td colSpan={isDoctor ? 7 : 6} className="py-4 text-muted-foreground">
                      No patients yet.
                    </td>
                  </tr>
                )}
                {filtered.map((patient, index) => (
                  patient.ok ? (
                    <tr key={patient.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-3 font-semibold">{patient.id}</td>
                      <td className="py-2.5 pr-3">{patient.name}</td>
                      <td className="py-2.5 pr-3">{patient.age}</td>
                      <td className="py-2.5 pr-3">{patient.gender}</td>
                      <td className="py-2.5 pr-3">{patient.diagnosis}</td>
                      <td className="py-2.5 pr-3">
                        <Badge variant={patient.algo && patient.algo.startsWith("DES") ? "warning" : "default"}>
                          {patient.algo}
                        </Badge>
                      </td>
                      {isDoctor && (
                        <td className="py-2.5 pr-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      )}
                    </tr>
                  ) : (
                    <tr key={`invalid-${index}`} className="border-b border-border last:border-0">
                      <td colSpan={isDoctor ? 7 : 6} className="py-2.5 pr-3 text-destructive">
                        Record could not be verified: {patient.problem || "integrity check failed"}
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
        <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
          🔎 Patient ID Search → Hash Map concept &nbsp;|&nbsp; ↕ Sorting → Sorting algorithm
        </p>
      )}
    </DashboardShell>
  );
}

export default PatientRecords;
