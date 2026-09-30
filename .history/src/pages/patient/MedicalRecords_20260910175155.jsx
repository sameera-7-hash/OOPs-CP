import React from "react";
import PatientLayout from "./PatientLayout";

function MedicalRecords({ navigate, logout }) {

  const records = [
    {
      name: "Blood Test Report",
      type: "Laboratory",
      date: "02 Sep 2026",
      icon: "▤",
      style: "blue"
    },
    {
      name: "X-Ray Chest",
      type: "Radiology",
      date: "20 Aug 2026",
      icon: "▤",
      style: "blue"
    },
    {
      name: "Blood Pressure Report",
      type: "Vitals",
      date: "15 Aug 2026",
      icon: "▤",
      style: "yellow"
    },
    {
      name: "Diabetes Test",
      type: "Laboratory",
      date: "10 Aug 2026",
      icon: "▤",
      style: "green"
    },
    {
      name: "General Checkup",
      type: "Consultation",
      date: "02 Aug 2026",
      icon: "▤",
      style: "green"
    }
  ];

  return (
    <PatientLayout
      title="My Reports"
      active="medical-records"
      navigate={navigate}
      logout={logout}
    >

      <div className="patient-page-heading">

        <div>

          <span className="patient-eyebrow">
            MEDICAL RECORDS
          </span>

          <h1>My Reports</h1>

          <p>
            Access your medical reports and documents.
          </p>

        </div>

      </div>


      <section className="reports-modern-list">

        {records.map((record, index) => (

          <div
            className="report-modern-card"
            key={index}
          >

            <div
              className={`report-icon ${record.style}`}
            >
              {record.icon}
            </div>


            <div className="report-main-info">

              <h3>{record.name}</h3>

              <p>
                {record.type}
                <span>•</span>
                Uploaded on {record.date}
              </p>

            </div>


            <button className="report-view-btn">
              View Report
            </button>

          </div>

        ))}

      </section>

    </PatientLayout>
  );
}

export default MedicalRecords;