import React from "react";
import PatientLayout from "./PatientLayout";

function MedicalHistory({ navigate, logout }) {

  const history = [
    {
      date: "02 Sep 2026",
      title: "General Consultation",
      description:
        "Consultation with Dr. Ananya Mehta."
    },
    {
      date: "20 Aug 2026",
      title: "Chest X-Ray",
      description:
        "Chest X-Ray report added to medical records."
    },
    {
      date: "15 Aug 2026",
      title: "Blood Pressure Check",
      description:
        "Blood pressure recorded during routine checkup."
    },
    {
      date: "02 Aug 2026",
      title: "General Health Checkup",
      description:
        "Routine health examination completed."
    }
  ];

  return (
    <PatientLayout
      title="Medical History"
      active="medical-history"
      navigate={navigate}
      logout={logout}
    >

      <div className="patient-page-heading">

        <div>

          <span className="patient-eyebrow">
            MEDICAL INFORMATION
          </span>

          <h1>Medical History</h1>

          <p>
            Your previous medical information.
          </p>

        </div>

      </div>


      <section className="history-timeline">

        {history.map((item, index) => (

          <div
            className="history-item"
            key={index}
          >

            <div className="history-line">

              <div className="history-dot"></div>

            </div>


            <div className="history-card">

              <div className="history-date">
                {item.date}
              </div>

              <div className="history-details">

                <h3>{item.title}</h3>

                <p>{item.description}</p>

              </div>

            </div>

          </div>

        ))}

      </section>

    </PatientLayout>
  );
}

export default MedicalHistory;