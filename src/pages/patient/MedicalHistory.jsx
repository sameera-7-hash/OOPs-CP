import React from "react";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import { patientMenu } from "@/lib/nav";

// SAMPLE DATA: the backend has no medical-history endpoint yet.
const HISTORY = [
  { date: "02 Sep 2026", title: msg("General consultation"), description: msg("Consultation with a doctor.") },
  { date: "20 Aug 2026", title: msg("Chest X-ray"), description: msg("Chest X-ray report added to medical records.") },
  { date: "15 Aug 2026", title: msg("Blood pressure check"), description: msg("Blood pressure recorded during a routine check-up.") },
  { date: "02 Aug 2026", title: msg("General health check-up"), description: msg("Routine health examination completed.") },
];

function MedicalHistory() {
  const { t } = useTranslation();
  return (
    <DashboardShell role="Patient" menu={patientMenu} title={t("Medical History")}>
      <PageHeading
        eyebrow={t("Medical information")}
        title={t("Medical history")}
        description={t("Your previous visits and results.")}
        sample={t("This timeline is placeholder content. The backend doesn't provide medical history yet.")}
      />

      <ol className="relative flex flex-col gap-4 pl-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-border">
        {HISTORY.map((item, index) => (
          <FadeIn as="li" key={item.title} delay={index * 0.06} className="relative">
            <span aria-hidden="true" className="absolute -left-8 top-6 h-4 w-4 rounded-full border-4 border-background bg-primary" />
            <Card className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-[140px_1fr] sm:gap-4">
              <span className="text-sm font-semibold text-primary">{item.date}</span>
              <div>
                <h2 className="text-base">{t(item.title)}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t(item.description)}</p>
              </div>
            </Card>
          </FadeIn>
        ))}
      </ol>
    </DashboardShell>
  );
}

export default MedicalHistory;
