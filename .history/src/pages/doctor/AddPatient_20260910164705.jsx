import React, { useState } from "react";

function AddPatient({ navigate }) {

  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="section-page">

      <div className="section-header">
        <div>
          <span className="eyebrow">PATIENT MANAGEMENT</span>
          <h1>Add New Patient</h1>
          <p>Create a new patient record.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("doctor-patients")}
        >
          ← Back to Patients
        </button>
      </div>


      <section className="form-card">

        <h2>Patient Information</h2>

        <form onSubmit={submit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Patient ID</label>
              <input placeholder="Enter patient ID" />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Enter full name" />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input type="number" placeholder="Enter age" />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select>
                <option>Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input placeholder="Enter phone number" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter email" />
            </div>

            <div className="form-group full">
              <label>Address</label>
              <textarea placeholder="Enter address"></textarea>
            </div>

            <div className="form-group">
              <label>Diagnosis</label>
              <input placeholder="Enter diagnosis" />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select>
                <option>Normal</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("doctor-patients")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Save Patient
            </button>

          </div>

          {saved && (
            <div className="success-message">
              ✓ Patient record created successfully.
            </div>
          )}

        </form>

      </section>

    </div>
  );
}

export default AddPatient;