import React from "react";
import { DoctorLayout } from "./DoctorDashboard";

function BackupRestore({ navigate, logout }) {

  const backup = () => {
    alert("Snapshot backup created successfully.");
  };

  return (
    <DoctorLayout
      active="backup-restore"
      navigate={navigate}
      logout={logout}
      menu={doctorMenu}
    >

      <div className="page-heading">

        <h1>Backup & Restore</h1>

        <p>
          Manage database backups and verify integrity.
        </p>

      </div>

      <div className="content-grid">

        <div className="panel">

          <h3>Primary Database</h3>

          <div className="backup-file">
            <strong>patients.dat</strong>
            <span className="status green">
              ✓ Healthy
            </span>
          </div>

        </div>

        <div className="panel">

          <h3>Backup Database</h3>

          <div className="backup-file">
            <strong>patients.dat.bak</strong>
            <span className="status green">
              ✓ Available
            </span>
          </div>

        </div>

      </div>

      <div className="panel">

        <h3>Integrity Status</h3>

        <div className="integrity-box">
          ✓ Hash Chain Verified
          <p>
            All stored records are consistent and tamper-evident.
          </p>
        </div>

      </div>

      <div className="action-buttons">

        <button
          className="primary-button"
          onClick={backup}
        >
          💾 Create Snapshot
        </button>

        <button
          className="primary-button"
          onClick={() =>
            alert("Backup restoration initiated.")
          }
        >
          ↻ Restore Backup
        </button>

      </div>

    </DoctorLayout>
  );
}

const doctorMenu = [
  ["▦", "Dashboard", "doctor-dashboard"],
  ["👥", "Patients", "doctor-patients"],
  ["📅", "Appointments", "doctor-appointments"],
  ["➕", "Add Patient", "add-patient"],
  ["📊", "Analytics", "analytics"],
  ["↶", "Undo / Redo", "undo-redo"],
  ["💾", "Backup & Restore", "backup-restore"]
];

export default BackupRestore;