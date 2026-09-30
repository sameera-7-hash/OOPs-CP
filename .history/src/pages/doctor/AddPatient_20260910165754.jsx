import React, { useState } from "react";
import { DoctorLayout } from "./DoctorDashboard";

function AddPatient({ navigate, logout }) {

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    admissionDate: "",
    diagnosis: "",
    priority: "Normal",
    algorithm: "AES-256"
  });

  const update = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name || !form.age || !form.gender) {
      alert("Please fill the required fields.");
      return;
    }

    alert("Patient added successfully!");
    navigate("doctor-patients");
  };

  return (
    <DoctorLayout
      active="add-patient"
      navigate={navigate}
      logout={logout}
      menu={doctorMenu}
    >

      <div className="page-heading">

        <h1>Add New Patient</h1>

        <p>
          Enter patient information securely.
        </p>

      </div>

      <div className="form-layout">

        <form className="panel patient-form" onSubmit={submit}>

          <div className="form-grid">

            <div>
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div>
              <label>Age *</label>
              <input
                type="number"
                placeholder="Enter age"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
              />
            </div>

            <div>
              <label>Gender *</label>

              <select
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

            </div>

            <div>
              <label>Contact Number</label>

              <input
                type="text"
                placeholder="Enter contact number"
                value={form.contact}
                onChange={(e) => update("contact", e.target.value)}
              />

            </div>

            <div>
              <label>Admission Date</label>

              <input
                type="date"
                value={form.admissionDate}
                onChange={(e) =>
                  update("admissionDate", e.target.value)
                }
              />

            </div>

            <div>
              <label>Priority</label>

              <select
                value={form.priority}
                onChange={(e) => update("priority", e.target.value)}
              >
                <option>Normal</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>

            </div>

          </div>

          <label>Diagnosis / Notes</label>

          <textarea
            placeholder="Enter diagnosis or notes"
            value={form.diagnosis}
            onChange={(e) => update("diagnosis", e.target.value)}
          />

          <button className="primary-button" type="submit">
            Add Patient
          </button>

        </form>

        <div className="panel">

          <h3>Security Information</h3>

          <div className="security-option">

            <label>
              <input
                type="radio"
                checked={form.algorithm === "AES-256"}
                onChange={() => update("algorithm", "AES-256")}
              />

              AES-256
            </label>

            <small>
              Recommended encryption algorithm
            </small>

          </div>

          <div className="security-option">

            <label>
              <input
                type="radio"
                checked={form.algorithm === "DES"}
                onChange={() => update("algorithm", "DES")}
              />

              DES
            </label>

            <small>
              For demonstration purposes
            </small>

          </div>

          <div className="notice">

            🔐 Patient information will be encrypted.

            <br /><br />

            ✓ Integrity verification enabled.

            <br /><br />

            💾 Secure backup available.

          </div>

        </div>

      </div>

    </DoctorLayout>
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

export default AddPatient;