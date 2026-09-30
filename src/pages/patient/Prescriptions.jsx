import React from "react";
import { Pill } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FadeIn from "@/components/FadeIn";
import { patientMenu } from "@/lib/nav";

const PRESCRIPTIONS = [
  { medicine: "Paracetamol", dosage: "500 mg", frequency: "2 times daily", duration: "5 days", status: "Active" },
  { medicine: "Vitamin D3", dosage: "1000 IU", frequency: "Once daily", duration: "30 days", status: "Active" },
  { medicine: "Cetirizine", dosage: "10 mg", frequency: "Once at night", duration: "7 days", status: "Active" },
];

function Prescriptions() {
  return (
    <DashboardShell role="Patient" menu={patientMenu} title="Prescriptions">
      <PageHeading eyebrow="Medication" title="Prescriptions" description="Your active prescriptions." />

      <div className="flex flex-col gap-3">
        {PRESCRIPTIONS.map((item, index) => (
          <FadeIn key={item.medicine} delay={index * 0.06}>
            <Card className="flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Pill className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold">{item.medicine}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.dosage} · {item.frequency}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Duration: <strong className="text-foreground">{item.duration}</strong>
                </p>
              </div>

              <Badge variant="success">{item.status}</Badge>
            </Card>
          </FadeIn>
        ))}
      </div>
    </DashboardShell>
  );
}

export default Prescriptions;
