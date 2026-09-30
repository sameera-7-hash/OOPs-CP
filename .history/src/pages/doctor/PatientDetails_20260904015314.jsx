import React from "react";
import { DoctorLayout } from "./DoctorDashboard";

function PatientDetails({ navigate, logout }) {

  return (
    <DoctorLayout
      active="doctor-patients"
      navigate={navigate}
      logout={logout}
      menu={doctorMenu}
    >

      <button
        className="back-link"
        onClick={() => navigate("doctor-patients")}
      >
        ← Back to Patients
      </button>

      <div className="page-heading">

        <h1>Patient Details</h1>

        <p>Complete patient information and medical history.</p>

      </div>

      <div className="content-grid">

        <div className="panel">

          <div className="patient-profile-large">

            <div className="large-avatar">
              A
            </div>

            <div>
              <h2>Amit Sharma</h2>
              <p>P124 • 42 Years • Male</p>
            </div>

          </div>

          <hr />

          <div className="details-grid">

            <Detail label="Contact Number" value="9870643210" />

            <Detail label="Admission Date" value="02 Sep 2026" />

            <Detail label="Diagnosis" value="High Fever" />

            <Detail label="Priority" value="Critical" />

          </div>

        </div>

        <div className="panel">

          <h3>Medical History</h3>

          <p>
            No known allergies. Previous history of viral fever.
          </p>

          <h3>Reports</h3>

          <p>📄 Blood Test Report — 02 Sep 2026</p>
          <p>📄 X-Ray Chest — 20 Aug 2026</p>

          <h3>Prescriptions</h3>

          <p>💊 Paracetamol — 500mg</p>
          <p>💊 Vitamin C — 1 tablet daily</p>

        </div>

      </div>

      <div className="action-buttons">

        <button className="primary-button">
          Edit Record
        </button>

        <button className="primary-button">
          Add Prescription
        </button>

        <button className="primary-button">
          Add Diagnosis
        </button>

        <button className="primary-button">
          View Reports
        </button>

      </div>

      <div className="security-banner">
        🔐 Encryption: AES-256 &nbsp; | &nbsp;
        ✓ Integrity Verified &nbsp; | &nbsp;
        💾 Backup Available
      </div>

    </DoctorLayout>
  );
}

function Detail({ label, value }) {

  return (
    <div className="detail-item">
      <small>{label}</small>
      <strong>{value}</strong>
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

export default PatientDetails;