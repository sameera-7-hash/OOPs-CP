import React from "react";

function MedicalRecords() {

  const records = [
    ["Blood Test Report", "02 Sep 2026", "Laboratory"],
    ["X-Ray Chest", "20 Aug 2026", "Radiology"],
    ["Blood Pressure Report", "15 Aug 2026", "Vitals"],
    ["Diabetes Test", "10 Aug 2026", "Laboratory"],
    ["General Checkup", "02 Aug 2026", "Consultation"]
  ];

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">MEDICAL RECORDS</span>
          <h1>My Reports</h1>
          <p>Access your medical reports and documents.</p>
        </div>

      </div>


      <section className="card">

        <div className="record-list">

          {records.map((r, index) => (

            <div className="record-item" key={index}>

              <div className="record-icon">
                📄
              </div>

              <div>
                <h3>{r[0]}</h3>
                <p>{r[2]} • Uploaded on {r[1]}</p>
              </div>

              <button className="small-primary-btn">
                View Report
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default MedicalRecords;