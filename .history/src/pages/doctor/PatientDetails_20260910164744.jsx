import React from "react";

function PatientDetails({ navigate }) {

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">PATIENT RECORD</span>
          <h1>Amit Sharma</h1>
          <p>Patient ID: P124</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("doctor-patients")}
        >
          ← Back
        </button>

      </div>


      <div className="details-grid">

        <section className="card">

          <h2>Personal Information</h2>

          <div className="details-list">

            <div>
              <span>Patient ID</span>
              <b>P124</b>
            </div>

            <div>
              <span>Name</span>
              <b>Amit Sharma</b>
            </div>

            <div>
              <span>Age</span>
              <b>42 Years</b>
            </div>

            <div>
              <span>Gender</span>
              <b>Male</b>
            </div>

            <div>
              <span>Room</span>
              <b>204</b>
            </div>

            <div>
              <span>Priority</span>
              <b className="danger-text">Critical</b>
            </div>

          </div>

        </section>


        <section className="card">

          <h2>Medical Information</h2>

          <div className="details-list">

            <div>
              <span>Diagnosis</span>
              <b>High Fever</b>
            </div>

            <div>
              <span>Blood Pressure</span>
              <b>120 / 80 mmHg</b>
            </div>

            <div>
              <span>SpO₂</span>
              <b>98%</b>
            </div>

            <div>
              <span>Heart Rate</span>
              <b>78 BPM</b>
            </div>

            <div>
              <span>Encryption</span>
              <b>AES-256</b>
            </div>

            <div>
              <span>Integrity</span>
              <b className="success-text">✓ Verified</b>
            </div>

          </div>

        </section>

      </div>


      <section className="card">

        <h2>Doctor Notes</h2>

        <textarea
          className="large-textarea"
          placeholder="Enter consultation notes..."
        ></textarea>

        <button className="primary-btn">
          Save Notes
        </button>

      </section>

    </div>
  );
}

export default PatientDetails;