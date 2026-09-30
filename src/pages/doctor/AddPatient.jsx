import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { addPatient } from "@/Services/api";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { doctorMenu } from "@/lib/nav";

function AddPatient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    admissionDate: "",
    diagnosis: "",
    algorithm: "AES-256",
  });

  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.age || !form.gender) {
      alert("Please fill the required fields.");
      return;
    }

    // Backend Patient record only stores these fields (see
    // patient_dashboard/backend/include/Patient.h) and expects the short
    // cipher code ("AES"/"DES"), not the display label used in the form.
    const payload = {
      name: form.name,
      age: Number(form.age) || 0,
      gender: form.gender,
      contact: form.contact,
      admissionDate: form.admissionDate,
      diagnosis: form.diagnosis,
      algo: form.algorithm === "DES" ? "DES" : "AES",
    };

    setSubmitting(true);
    try {
      await addPatient(payload);
      alert("Patient added successfully!");
      navigate("/doctor/patients");
    } catch (err) {
      alert("Could not add patient: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Add New Patient">
      <PageHeading eyebrow="Doctor Portal" title="Add New Patient" description="Enter patient information securely." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <Panel>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Full Name *</Label>
                <Input className="mt-1.5" placeholder="Enter full name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>

              <div>
                <Label>Age *</Label>
                <Input className="mt-1.5" type="number" placeholder="Enter age" value={form.age} onChange={(e) => update("age", e.target.value)} />
              </div>

              <div>
                <Label>Gender *</Label>
                <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Contact Number</Label>
                <Input className="mt-1.5" placeholder="Enter contact number" value={form.contact} onChange={(e) => update("contact", e.target.value)} />
              </div>

              <div>
                <Label>Admission Date</Label>
                <Input className="mt-1.5" type="date" value={form.admissionDate} onChange={(e) => update("admissionDate", e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Diagnosis / Notes</Label>
              <Textarea className="mt-1.5" placeholder="Enter diagnosis or notes" value={form.diagnosis} onChange={(e) => update("diagnosis", e.target.value)} />
            </div>

            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? "Adding..." : "Add Patient"}
            </Button>
          </form>
        </Panel>

        <Panel title="Security Information">
          <div className="flex flex-col gap-3">
            {[
              ["AES-256", "Recommended encryption algorithm"],
              ["DES", "For demonstration purposes"],
            ].map(([value, note]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer flex-col rounded-lg border p-3 transition-colors",
                  form.algorithm === value ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <span className="flex items-center gap-2 text-xs font-bold">
                  <input
                    type="radio"
                    name="algorithm"
                    checked={form.algorithm === value}
                    onChange={() => update("algorithm", value)}
                    className="accent-primary"
                  />
                  {value}
                </span>
                <small className="mt-1 text-[11px] text-muted-foreground">{note}</small>
              </label>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-muted p-3.5 text-xs leading-relaxed text-foreground/80">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span>
              Patient information will be encrypted.
              <br />
              Integrity verification enabled.
              <br />
              Secure backup available.
            </span>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

export default AddPatient;
