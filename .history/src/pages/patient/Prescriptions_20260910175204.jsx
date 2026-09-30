import React from "react";
import PatientLayout from "./PatientLayout";

function Prescriptions({ navigate, logout }) {

  const prescriptions = [
    {
      medicine: "Paracetamol",
      dosage: "500 mg",
      frequency: "2 times daily",
      duration: "5 days",
      status: "Active"
    },
    {
      medicine: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      duration: "30 days",
      status: "Active"
    },
    {
      medicine: "Cetirizine",
      dosage: "10 mg",
      frequency: "Once at night",
      duration: "7 days",
      status: "Active"
    }
  ];

  return (
    <PatientLayout
      title="Prescriptions"
      active="prescriptions"
      navigate={navigate}
      logout={logout}
    >

      <div className="patient-page-heading">

        <div>

          <span className="patient-eyebrow">
            MEDICATION
          </span>

          <h1>Prescriptions</h1>

          <p>
            Your active prescriptions.
          </p>

        </div>

      </div>


      <section className="prescription-list">

        {prescriptions.map((item, index) => (

          <div
            className="prescription-modern-card"
            key={index}
          >

            <div className="medicine-icon">
              💊
            </div>


            <div className="medicine-info">

              <h3>{item.medicine}</h3>

              <p>
                {item.dosage}
                <span>•</span>
                {item.frequency}
              </p>

              <p>
                Duration:
                <strong>{item.duration}</strong>
              </p>

            </div>


            <span className="prescription-status">
              {item.status}
            </span>

          </div>

        ))}

      </section>

    </PatientLayout>
  );
}

export default Prescriptions;