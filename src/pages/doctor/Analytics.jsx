import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import { Users, UserPlus, ShieldAlert, CircleCheck } from "lucide-react";
import { doctorMenu } from "@/lib/nav";

// SAMPLE DATA: every number on this page is a hard-coded placeholder.
// The backend has no analytics endpoint yet.
const PRIORITY = [
  [msg("Critical"), 8],
  [msg("High"), 17],
  [msg("Medium"), 39],
  [msg("Normal"), 60],
];

const AGE_GROUPS = [
  ["0–18", 12],
  ["19–30", 28],
  ["31–50", 45],
  ["51–70", 29],
  ["70+", 10],
];

function Analytics() {
  const { t } = useTranslation();
  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title={t("Analytics")}>
      <PageHeading
        eyebrow={t("Doctor portal")}
        title={t("Analytics")}
        description={t("Overview of patient and clinical statistics.")}
        sample={t("These figures are placeholders. The backend doesn't provide analytics yet.")}
      />

      <div className="stagger mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard tone="teal" icon={Users} label={t("Total patients")} value="124" note={t("Current records")} sample />
        <StatCard tone="blue" icon={UserPlus} label={t("New this week")} value="12" sample />
        <StatCard tone="rose" icon={ShieldAlert} label={t("Critical patients")} value="8" note={t("Needs attention")} sample />
        <StatCard tone="green" icon={CircleCheck} label={t("Completed visits")} value="96" note={t("This month")} sample />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title={t("Patients by priority")}>
          <Bars rows={PRIORITY} />
        </Panel>
        <Panel title={t("Patients by age group")}>
          <Bars rows={AGE_GROUPS} />
        </Panel>
      </div>
    </DashboardShell>
  );
}

// Horizontal bars scaled to the largest value. They grow in with a
// transform (scaleX), not a width animation.
function Bars({ rows }) {
  const { t } = useTranslation();
  const max = Math.max(...rows.map(([, v]) => v));
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <dl className="flex flex-col gap-4">
      {rows.map(([label, value]) => (
        <div key={label}>
          <div className="mb-2 flex justify-between text-sm">
            <dt className="text-muted-foreground">{t(label)}</dt>
            <dd className="font-semibold tabular-nums">{value}</dd>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full origin-left rounded-full bg-primary transition-transform duration-500 ease-out"
              style={{ transform: `scaleX(${grown ? value / max : 0})` }}
            />
          </div>
        </div>
      ))}
    </dl>
  );
}

export default Analytics;
