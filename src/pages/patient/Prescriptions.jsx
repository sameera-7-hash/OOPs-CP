import React from "react";
import { Pill } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FadeIn from "@/components/FadeIn";
import { PillArt } from "@/components/art/Illustrations";
import { patientMenu } from "@/lib/nav";

// SAMPLE DATA: prescriptions aren't tracked by the backend yet.
const PRESCRIPTIONS = [
  { medicine: "Paracetamol", dosage: "500 mg", frequency: "2 times daily", duration: "5 days", status: "Active" },
  { medicine: "Vitamin D3", dosage: "1000 IU", frequency: "Once daily", duration: "30 days", status: "Active" },
  { medicine: "Cetirizine", dosage: "10 mg", frequency: "Once at night", duration: "7 days", status: "Active" },
];

function Prescriptions() {
  return (
    <DashboardShell role="Patient" menu={patientMenu} title="Prescriptions">
      <PageHeading
        eyebrow="Medication"
        title="Prescriptions"
        description="Your active prescriptions."
        action={<PillArt className="hidden h-16 w-16 sm:block" />}
        sample="These prescriptions are placeholders. The backend doesn't track prescriptions yet."
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
                  {item.dosage} · {item.frequency} · for {item.duration}
                </p>
              </div>

              <Badge variant="success">{item.status}</Badge>
            </Card>
          </FadeIn>
        ))}
      </ul>
    </DashboardShell>
  );
}

export default Prescriptions;
