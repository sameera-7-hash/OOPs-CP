import React from "react";
import { Pill } from "lucide-react";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FadeIn from "@/components/FadeIn";
import { PillArt } from "@/components/art/Illustrations";
import { patientMenu } from "@/lib/nav";

// SAMPLE DATA: prescriptions aren't tracked by the backend yet.
const PRESCRIPTIONS = [
  { medicine: "Paracetamol", dosage: "500 mg", frequency: msg("2 times daily"), duration: msg("5 days"), status: msg("Active") },
  { medicine: "Vitamin D3", dosage: "1000 IU", frequency: msg("Once daily"), duration: msg("30 days"), status: msg("Active") },
  { medicine: "Cetirizine", dosage: "10 mg", frequency: msg("Once at night"), duration: msg("7 days"), status: msg("Active") },
];

function Prescriptions() {
  const { t } = useTranslation();
  return (
    <DashboardShell role="Patient" menu={patientMenu} title={t("Prescriptions")}>
      <PageHeading
        eyebrow={t("Medication")}
        title={t("Prescriptions")}
        description={t("Your active prescriptions.")}
        action={<PillArt className="hidden h-16 w-16 sm:block" />}
        sample={t("These prescriptions are placeholders. The backend doesn't track prescriptions yet.")}
      />

      <ul className="flex flex-col gap-3">
        {PRESCRIPTIONS.map((item, index) => (
          <FadeIn as="li" key={item.medicine} delay={index * 0.06}>
            <Card className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                <Pill aria-hidden="true" className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="text-base">{item.medicine}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.dosage} · {t(item.frequency)} · {t("for {{duration}}", { duration: t(item.duration) })}
                </p>
              </div>

              <Badge variant="success">{t(item.status)}</Badge>
            </Card>
          </FadeIn>
        ))}
      </ul>
    </DashboardShell>
  );
}

export default Prescriptions;
