import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
import { CircleAlert, ShieldCheck } from "lucide-react";
import { addPatient } from "@/Services/api";
import { useToast } from "@/context/ToastContext";
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

// Notes and error messages are English i18n keys, translated on render.
const ALGORITHMS = [
  ["AES-256", msg("Recommended encryption algorithm")],
  ["DES", msg("Legacy cipher, for comparison")],
];

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = msg("Enter the patient's full name.");
  const age = Number(form.age);
  if (!String(form.age).trim()) errors.age = msg("Enter the patient's age.");
  else if (!Number.isInteger(age) || age < 0 || age > 150) errors.age = msg("Age must be a whole number, e.g. 34.");
  if (!form.gender) errors.gender = msg("Select a gender.");
  return errors;
}

function FieldError({ id, message }) {
  const { t } = useTranslation();
  if (!message) return null;
  return (
    <p id={id} className="flex items-center gap-1 text-sm font-medium text-destructive">
      <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
      {t(message)}
    </p>
  );
}

function AddPatient() {
  const navigate = useNavigate();
  const notify = useToast();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    admissionDate: "",
    diagnosis: "",
    algorithm: "AES-256",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`patient-${Object.keys(found)[0]}`)?.focus();
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
      notify({ message: t("Patient added.") });
      navigate("/doctor/patients");
    } catch (err) {
      notify({ tone: "error", message: t("Could not add patient: {{error}}", { error: err.message }) });
    } finally {
      setSubmitting(false);
    }
  };

  const invalid = (field) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `patient-${field}-error` : undefined,
  });

  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title={t("Add New Patient")}>
      <PageHeading eyebrow={t("Doctor portal")} title={t("Add a patient")} description={t("The record is encrypted before it is stored.")} />

      <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel className="mb-0">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="patient-name">{t("Full name")} <span aria-hidden="true">*</span></Label>
                <Input id="patient-name" autoComplete="off" required value={form.name} onChange={(e) => update("name", e.target.value)} {...invalid("name")} />
                <FieldError id="patient-name-error" message={errors.name} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="patient-age">{t("Age")} <span aria-hidden="true">*</span></Label>
                <Input id="patient-age" type="number" inputMode="numeric" min="0" required value={form.age} onChange={(e) => update("age", e.target.value)} {...invalid("age")} />
                <FieldError id="patient-age-error" message={errors.age} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="patient-gender">{t("Gender")} <span aria-hidden="true">*</span></Label>
                <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger id="patient-gender" {...invalid("gender")}>
                    <SelectValue placeholder={t("Select gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">{t("Male")}</SelectItem>
                    <SelectItem value="Female">{t("Female")}</SelectItem>
                    <SelectItem value="Other">{t("Other")}</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError id="patient-gender-error" message={errors.gender} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="patient-contact">{t("Contact number")}</Label>
                <Input id="patient-contact" type="tel" value={form.contact} onChange={(e) => update("contact", e.target.value)} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="patient-admission">{t("Admission date")}</Label>
                <Input id="patient-admission" type="date" value={form.admissionDate} onChange={(e) => update("admissionDate", e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="patient-diagnosis">{t("Diagnosis / notes")}</Label>
              <Textarea id="patient-diagnosis" value={form.diagnosis} onChange={(e) => update("diagnosis", e.target.value)} />
            </div>

            <p className="text-sm text-muted-foreground">{t("Fields marked * are required.")}</p>

            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? t("Adding…") : t("Add patient")}
            </Button>
          </div>
        </Panel>

        <Panel title={t("Encryption")} className="mb-0">
          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">{t("Encryption algorithm")}</legend>
            {ALGORITHMS.map(([value, note]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer flex-col rounded-lg border p-4 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                  form.algorithm === value ? "border-primary bg-secondary" : "border-border hover:border-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="algorithm"
                    value={value}
                    checked={form.algorithm === value}
                    onChange={() => update("algorithm", value)}
                    className="h-4 w-4 accent-primary"
                  />
                  {value}
                </span>
                <small className="mt-1 pl-6 text-sm text-muted-foreground">{t(note)}</small>
              </label>
            ))}
          </fieldset>

          <div className="mt-4 flex items-start gap-3 rounded-lg bg-muted p-4 text-sm text-foreground/90">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>
              {t("The record is encrypted at rest and added to the hash chain, so later tampering can be detected.")}
            </span>
          </div>
        </Panel>
      </form>
    </DashboardShell>
  );
}

export default AddPatient;
