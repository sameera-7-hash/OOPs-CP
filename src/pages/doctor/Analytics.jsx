import React, { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import { Users, UserPlus, ShieldAlert, CircleCheck } from "lucide-react";
import { doctorMenu } from "@/lib/nav";

// SAMPLE DATA: every number on this page is a hard-coded placeholder.
// The backend has no analytics endpoint yet.
const PRIORITY = [
  ["Critical", 8],
  ["High", 17],
  ["Medium", 39],
  ["Normal", 60],
];

const AGE_GROUPS = [
  ["0–18", 12],
  ["19–30", 28],
  ["31–50", 45],
  ["51–70", 29],
  ["70+", 10],
];

function Analytics() {
  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Analytics">
      <PageHeading
        eyebrow="Doctor portal"
        title="Analytics"
        description="Overview of patient and clinical statistics."
        sample="These figures are placeholders. The backend doesn't provide analytics yet."
      />

      <div className="stagger mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard tone="teal" icon={Users} label="Total patients" value="124" note="Current records" sample />
        <StatCard tone="blue" icon={UserPlus} label="New this week" value="12" sample />
        <StatCard tone="rose" icon={ShieldAlert} label="Critical patients" value="8" note="Needs attention" sample />
        <StatCard tone="green" icon={CircleCheck} label="Completed visits" value="96" note="This month" sample />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Patients by priority">
          <Bars rows={PRIORITY} />
        </Panel>
        <Panel title="Patients by age group">
          <Bars rows={AGE_GROUPS} />
        </Panel>
      </div>
    </DashboardShell>
  );
}

// Horizontal bars scaled to the largest value. They grow in with a
// transform (scaleX), not a width animation.
function Bars({ rows }) {
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
            <dt className="text-muted-foreground">{label}</dt>
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
