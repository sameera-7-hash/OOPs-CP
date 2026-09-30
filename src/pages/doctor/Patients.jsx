import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { getPatients } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { doctorMenu } from "@/lib/nav";

function Patients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getPatients()
      .then((data) => {
        if (cancelled) return;
        setPatients(data.patients.filter((p) => p.ok));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filtered = patients
    .filter((p) => `${p.id} ${p.name} ${p.diagnosis}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "age") return a.age - b.age;
      if (sort === "id") return a.id.localeCompare(b.id);
      return 0;
    });

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Patient Records">
      <PageHeading eyebrow="Doctor Portal" title="Patient Records" description="Search, sort and manage patient information." />

      <Panel>
        <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by ID, name or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading patients...</p>}
        {error && <p className="text-sm text-muted-foreground">Could not load patients: {error}</p>}

        {!loading && !error && (
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
                  <th className="py-2 pr-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-4 text-muted-foreground">No patients yet. Add the first one from &quot;Add Patient&quot;.</td></tr>
                )}
                {filtered.map((patient) => (
                  <tr key={patient.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-3 font-semibold">{patient.id}</td>
                    <td className="py-2.5 pr-3">{patient.name}</td>
                    <td className="py-2.5 pr-3">{patient.age}</td>
                    <td className="py-2.5 pr-3">{patient.gender}</td>
                    <td className="py-2.5 pr-3">{patient.diagnosis}</td>
                    <td className="py-2.5 pr-3">
                      <Badge variant={patient.algo && patient.algo.startsWith("DES") ? "warning" : "default"}>{patient.algo}</Badge>
                    </td>
                    <td className="py-2.5 pr-3">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/doctor/patients/${patient.id}`)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
        🔎 Patient ID Search → Hash Map concept &nbsp;|&nbsp; ↕ Sorting → Sorting algorithm
      </p>
    </DashboardShell>
  );
}

export default Patients;
