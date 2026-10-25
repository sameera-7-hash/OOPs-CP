import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/context/ToastContext";
import { nurseMenu } from "@/lib/nav";

// SAMPLE DATA: patients and default readings are placeholders. Saving
// stays on this page -- the backend has no vitals endpoint yet. Labels
// are English i18n keys; "SpO₂" and the units are the same in every language.
const VITALS = [
  { id: "bp", label: msg("Blood pressure"), value: "120 / 80", unit: "mmHg" },
  { id: "spo2", label: "SpO₂", value: "98", unit: "%" },
  { id: "hr", label: msg("Heart rate"), value: "78", unit: "BPM" },
  { id: "rr", label: msg("Respiratory rate"), value: "16", unit: "/min" },
  { id: "temp", label: msg("Temperature"), value: "98.6", unit: "°F" },
];

function Vitals() {
  const notify = useToast();
  const [patient, setPatient] = useState("P101");
  const { t } = useTranslation();

  const saveVitals = (e) => {
    e.preventDefault();
    notify({ message: t("Vitals recorded on this page (not saved to the backend).") });
  };

  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title={t("Vitals")}>
      <PageHeading
        eyebrow={t("Nurse portal")}
        title={t("Patient vitals")}
        description={t("Record and monitor patient vital signs.")}
        sample={t("Patients and readings here are placeholders, and saving doesn't reach the backend yet.")}
      />

      <form onSubmit={saveVitals}>
        <Panel>
          <div className="mb-6 flex max-w-xs flex-col gap-2">
            <Label htmlFor="vitals-patient">{t("Patient")}</Label>
            <Select value={patient} onValueChange={setPatient}>
              <SelectTrigger id="vitals-patient">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P101">P101 - Amit Sharma</SelectItem>
                <SelectItem value="P104">P104 - Neha Verma</SelectItem>
                <SelectItem value="P110">P110 - Ravi Patel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {VITALS.map((v) => (
              <div key={v.id} className="flex flex-col gap-2">
                <Label htmlFor={`vital-${v.id}`}>{t(v.label)}</Label>
                <div className="flex items-center gap-2">
                  <Input id={`vital-${v.id}`} defaultValue={v.value} aria-describedby={`vital-${v.id}-unit`} />
                  <span id={`vital-${v.id}-unit`} className="w-14 text-sm text-muted-foreground">{v.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="mt-6">{t("Save vitals")}</Button>
        </Panel>
      </form>
    </DashboardShell>
  );
}

export default Vitals;
