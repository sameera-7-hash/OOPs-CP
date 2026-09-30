import React, { useState } from "react";

function Vitals() {

  const [saved, setSaved] = useState(false);

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">PATIENT MONITORING</span>
          <h1>Patient Vitals</h1>
          <p>Record and monitor patient vital signs.</p>
        </div>

      </div>


      <section className="card">

        <h2>Select Patient</h2>

        <select className="patient-select">
          <option>P101 - Amit Sharma</option>
          <option>P104 - Neha Verma</option>
          <option>P110 - Ravi Patel</option>
          <option>P115 - Sneha Iyer</option>
        </select>

      </section>


      <section className="form-card">

        <div className="form-grid">

          <div className="form-group">
            <label>Blood Pressure</label>
            <input defaultValue="120 / 80" />
            <small>mmHg</small>
          </div>

          <div className="form-group">
            <label>SpO₂</label>
            <input defaultValue="98" />
            <small>%</small>
          </div>

          <div className="form-group">
            <label>Heart Rate</label>
            <input defaultValue="78" />
            <small>BPM</small>
          </div>

          <div className="form-group">
            <label>Respiratory Rate</label>
            <input defaultValue="16" />
            <small>/min</small>
          </div>

          <div className="form-group">
            <label>Temperature</label>
            <input defaultValue="98.6" />
            <small>°F</small>
          </div>

        </div>


        <button
          className="primary-btn"
          onClick={() => setSaved(true)}
        >
          Save Vitals
        </button>


        {saved && (
          <div className="success-message">
            ✓ Vitals saved successfully.
          </div>
        )}

      </section>

    </div>
  );
}

export default Vitals;