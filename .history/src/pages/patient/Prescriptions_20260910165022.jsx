import React from "react";

function Prescriptions() {

  const medicines = [
    ["Paracetamol", "500 mg", "2 times daily", "5 days"],
    ["Vitamin D3", "1000 IU", "Once daily", "30 days"],
    ["Cetirizine", "10 mg", "Once at night", "7 days"]
  ];

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">MEDICATION</span>
          <h1>Prescriptions</h1>
          <p>Your active prescriptions.</p>
        </div>

      </div>


      <section className="card">

        <div className="prescription-list">

          {medicines.map((m, index) => (

            <div
              className="prescription-item"
              key={index}
            >

              <div className="medicine-icon">
                💊
              </div>

              <div>
                <h3>{m[0]}</h3>
                <p>{m[1]} • {m[2]}</p>
              </div>

              <div>
                <span>Duration</span>
                <b>{m[3]}</b>
              </div>

              <span className="status-badge">
                Active
              </span>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Prescriptions;