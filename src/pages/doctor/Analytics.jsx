import React from "react";
import { motion } from "motion/react";
import DashboardShell from "@/components/layout/DashboardShell";
import PageHeading from "@/components/layout/PageHeading";
import StatCard from "@/components/layout/StatCard";
import Panel from "@/components/layout/Panel";
import { Users, UserPlus, ShieldAlert, CheckCircle2 } from "lucide-react";
import { doctorMenu } from "@/lib/nav";

function Analytics() {
  return (
    <DashboardShell role="Doctor" menu={doctorMenu} title="Analytics">
      <PageHeading eyebrow="Doctor Portal" title="Analytics" description="Overview of patient and clinical statistics." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Patients" value="124" note="Current records" />
        <StatCard icon={UserPlus} label="New This Week" value="12" note="↑ 8%" />
        <StatCard icon={ShieldAlert} label="Critical Patients" value="8" note="Needs attention" noteTone="muted" />
        <StatCard icon={CheckCircle2} label="Completed Visits" value="96" note="This month" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Patients by Priority">
          <Bar label="Critical" value="8" width="25%" />
          <Bar label="High" value="17" width="45%" />
          <Bar label="Medium" value="39" width="70%" />
          <Bar label="Normal" value="60" width="90%" />
        </Panel>

        <Panel title="Patients by Age Group">
          <Bar label="0–18" value="12" width="25%" />
          <Bar label="19–30" value="28" width="50%" />
          <Bar label="31–50" value="45" width="80%" />
          <Bar label="51–70" value="29" width="55%" />
          <Bar label="70+" value="10" width="20%" />
        </Panel>
      </div>
    </DashboardShell>
  );
}

function Bar({ label, value, width }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default Analytics;
