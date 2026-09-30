import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import { patientMenu } from "@/lib/nav";

const HISTORY = [
  { date: "02 Sep 2026", title: "General Consultation", description: "Consultation with Dr. Ananya Mehta." },
  { date: "20 Aug 2026", title: "Chest X-Ray", description: "Chest X-Ray report added to medical records." },
  { date: "15 Aug 2026", title: "Blood Pressure Check", description: "Blood pressure recorded during routine checkup." },
  { date: "02 Aug 2026", title: "General Health Checkup", description: "Routine health examination completed." },
];

function MedicalHistory() {
  return (
    <DashboardShell role="Patient" menu={patientMenu} title="Medical History">
      <PageHeading eyebrow="Medical Information" title="Medical History" description="Your previous medical information." />

      <div className="relative flex flex-col gap-4 pl-7 before:absolute before:bottom-1 before:left-[7px] before:top-1 before:w-px before:bg-border">
        {HISTORY.map((item, index) => (
          <FadeIn key={item.title} delay={index * 0.07} className="relative">
            <span className="absolute -left-7 top-5 h-3.5 w-3.5 rounded-full border-[3px] border-background bg-primary" />
            <Card className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[130px_1fr]">
              <span className="text-xs font-bold text-primary">{item.date}</span>
              <div>
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </DashboardShell>
  );
}

export default MedicalHistory;
