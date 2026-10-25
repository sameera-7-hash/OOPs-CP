import React from "react";
import { ArrowDownWideNarrow } from "lucide-react";
import { useTranslation } from "react-i18next";
import FadeIn from "@/components/FadeIn";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import Panel from "@/components/layout/Panel";
import Notice from "@/components/feedback/Notice";
import PriorityBadge from "@/components/feedback/PriorityBadge";
import { nurseMenu } from "@/lib/nav";

// SAMPLE DATA: a demonstration of a priority queue, not backend data.
// `room` is the room number.
const PATIENTS = [
  { priority: "Critical", id: "P101", name: "Amit Sharma", room: "204" },
  { priority: "Critical", id: "P118", name: null, room: "210" },
  { priority: "High", id: "P104", name: "Neha Verma", room: "108" },
  { priority: "Medium", id: "P110", name: "Ravi Patel", room: "312" },
  { priority: "Normal", id: "P115", name: "Sneha Iyer", room: "305" },
];

function PriorityQueue() {
  const { t } = useTranslation();
  return (
    <DashboardShell role="Nurse" menu={nurseMenu} title={t("Priority Queue")}>
      <PageHeading
        eyebrow={t("Nurse portal")}
        title={t("Emergency priority queue")}
        description={t("Patients ordered by priority, highest first.")}
        sample={t("A demonstration of a priority queue. These patients aren't loaded from the backend.")}
      />

      <Panel>
        <ol className="flex flex-col gap-2">
          {PATIENTS.map((patient, index) => (
            <FadeIn as="li" key={patient.id} delay={index * 0.06}>
              <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-card p-4 text-sm sm:grid-cols-[110px_64px_1fr_auto]">
                <PriorityBadge priority={patient.priority} />
                <strong className="sm:order-none">{patient.id}</strong>
                <span className="truncate">{patient.name || t("Patient")}</span>
                <span className="text-muted-foreground">{t("Room {{number}}", { number: patient.room })}</span>
              </div>
            </FadeIn>
          ))}
        </ol>
      </Panel>

      <Notice icon={ArrowDownWideNarrow}>
        {t("A priority queue (heap) always serves the highest-priority patient first.")}
      </Notice>
    </DashboardShell>
  );
}

export default PriorityQueue;
