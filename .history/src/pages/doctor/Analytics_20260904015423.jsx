import React from "react";
import { DoctorLayout } from "./DoctorDashboard";

function Analytics({ navigate, logout }) {

  return (
    <DoctorLayout
      active="analytics"
      navigate={navigate}
      logout={logout}
      menu={doctorMenu}
    >

      <div className="page-heading">

        <h1>Analytics</h1>

        <p>Overview of patient and clinical statistics.</p>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Patients</span>
          <strong>124</strong>
          <small>Current records</small>
        </div>

        <div className="stat-card">
          <span>New This Week</span>
          <strong>12</strong>
          <small>↑ 8%</small>
        </div>

        <div className="stat-card">
          <span>Critical Patients</span>
          <strong>8</strong>
          <small>Needs attention</small>
        </div>

        <div className="stat-card">
          <span>Completed Visits</span>
          <strong>96</strong>
          <small>This month</small>
        </div>

      </div>

      <div className="content-grid">

        <div className="panel">

          <h3>Patients by Priority</h3>

          <Bar label="Critical" value="8" width="25%" />
          <Bar label="High" value="17" width="45%" />
          <Bar label="Medium" value="39" width="70%" />
          <Bar label="Normal" value="60" width="90%" />

        </div>

        <div className="panel">

          <h3>Patients by Age Group</h3>

          <Bar label="0–18" value="12" width="25%" />
          <Bar label="19–30" value="28" width="50%" />
          <Bar label="31–50" value="45" width="80%" />
          <Bar label="51–70" value="29" width="55%" />
          <Bar label="70+" value="10" width="20%" />

        </div>

      </div>

    </DoctorLayout>
  );
}

function Bar({ label, value, width }) {

  return (
    <div className="bar-row">

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="bar-background">
        <div
          className="bar-fill"
          style={{ width }}
        ></div>
      </div>

    </div>
  );
}

const doctorMenu = [
  ["▦", "Dashboard", "doctor-dashboard"],
  ["👥", "Patients", "doctor-patients"],
  ["📅", "Appointments", "doctor-appointments"],
  ["➕", "Add Patient", "add-patient"],
  ["💊", "Prescriptions", "doctor-dashboard"],
  ["📄", "Reports", "doctor-dashboard"],
  ["📊", "Analytics", "analytics"],
  ["↶", "Undo / Redo", "undo-redo"],
  ["💾", "Backup & Restore", "backup-restore"]
];

export default Analytics;