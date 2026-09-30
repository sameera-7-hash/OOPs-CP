import React, { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { nurseMenu } from "@/lib/nav";

const VITALS = [
  { label: "Blood Pressure", value: "120 / 80", unit: "mmHg" },
  { label: "SpO₂", value: "98", unit: "%" },
  { label: "Heart Rate", value: "78", unit: "BPM" },
  { label: "Respiratory Rate", value: "16", unit: "/min" },
  { label: "Temperature", value: "98.6", unit: "°F" },
];

function Vitals() {
  const [patient, setPatient] = useState("P101");
  const [saved, setSaved] = useState(false);

  const saveVitals = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title="Vitals">
      <PageHeading eyebrow="Nurse Portal" title="Patient Vitals" description="Record and monitor patient vital signs." />

      <Panel title="Patient">
        <Select value={patient} onValueChange={setPatient}>
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="P101">P101 - Amit Sharma</SelectItem>
            <SelectItem value="P104">P104 - Neha Verma</SelectItem>
            <SelectItem value="P110">P110 - Ravi Patel</SelectItem>
          </SelectContent>
        </Select>
      </Panel>

      <Panel>
        <form onSubmit={saveVitals} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {VITALS.map((v) => (
              <div key={v.label}>
                <Label>{v.label}</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Input defaultValue={v.value} />
                  <span className="text-xs text-muted-foreground">{v.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="self-start">Save Vitals</Button>
        </form>
      </Panel>

      {saved && (
        <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-xs font-medium text-success">
          ✓ Vitals recorded successfully.
        </p>
      )}
    </DashboardShell>
  );
}

export default Vitals;
