import React, { useState } from "react";
import { NurseLayout } from "./NurseDashboard";

function Vitals({ navigate, logout }) {

  const [saved, setSaved] = useState(false);

  const saveVitals = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <NurseLayout
      active="vitals"
      navigate={navigate}
      logout={logout}
    >

      <div className="page-heading">

        <h1>Patient Vitals</h1>

        <p>Record and monitor patient vital signs.</p>

      </div>

      <div className="panel">

        <h3>Patient</h3>

        <select className="full-input">
          <option>P101 - Amit Sharma</option>
          <option>P104 - Neha Verma</option>
          <option>P110 - Ravi Patel</option>
        </select>

      </div>

      <form className="panel" onSubmit={saveVitals}>

        <div className="form-grid">

          <VitalInput label="Blood Pressure" value="120 / 80" unit="mmHg" />

          <VitalInput label="SpO₂" value="98" unit="%" />

          <VitalInput label="Heart Rate" value="78" unit="BPM" />

          <VitalInput label="Respiratory Rate" value="16" unit="/min" />

          <VitalInput label="Temperature" value="98.6" unit="°F" />

        </div>

        <button className="primary-button" type="submit">
          Save Vitals
        </button>

      </form>

      {saved && (
        <div className="security-banner">
          ✓ Vitals recorded successfully.
        </div>
      )}

    </NurseLayout>
  );
}

function VitalInput({ label, value, unit }) {

  return (
    <div>

      <label>{label}</label>

      <div className="input-with-unit">

        <input defaultValue={value} />

        <span>{unit}</span>

      </div>

    </div>
  );
}

export default Vitals;