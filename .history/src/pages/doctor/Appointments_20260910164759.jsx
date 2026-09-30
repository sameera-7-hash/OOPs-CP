import React from "react";

function Appointments() {

  const appointments = [
    ["04:30 PM", "Amit Sharma", "P124", "General Consultation", "Confirmed"],
    ["05:00 PM", "Neha Verma", "P123", "Fracture Follow-up", "Confirmed"],
    ["05:30 PM", "Ravi Patel", "P122", "Diabetes Checkup", "Pending"],
    ["06:00 PM", "Sneha Iyer", "P121", "Regular Checkup", "Confirmed"]
  ];

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">SCHEDULE</span>
          <h1>Appointments</h1>
          <p>Manage today's consultations.</p>
        </div>

        <span className="available-badge">
          12 Appointments
        </span>

      </div>


      <section className="card">

        <div className="appointment-list">

          {appointments.map((a, index) => (

            <div className="appointment-list-item" key={index}>

              <div className="time-box">
                <b>{a[0]}</b>
              </div>

              <div>
                <h3>{a[1]}</h3>
                <p>{a[2]} • {a[3]}</p>
              </div>

              <span className="status-badge">
                {a[4]}
              </span>

              <button className="small-primary-btn">
                View
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Appointments;