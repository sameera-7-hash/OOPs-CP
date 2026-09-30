import React from "react";

function Appointments() {

  const appointments = [
    ["02 Sep 2026", "04:30 PM", "Dr. Ananya Mehta", "General Physician", "Confirmed"],
    ["10 Sep 2026", "11:00 AM", "Dr. Rahul Shah", "Cardiologist", "Confirmed"],
    ["18 Sep 2026", "03:00 PM", "Dr. Priya Joshi", "General Physician", "Pending"]
  ];

  return (
    <div className="section-page">

      <div className="section-header">
        <div>
          <span className="eyebrow">PATIENT PORTAL</span>
          <h1>Appointments</h1>
          <p>View and manage your appointments.</p>
        </div>

        <button className="primary-btn">
          + Book Appointment
        </button>
      </div>


      <section className="card">

        <div className="appointment-list">

          {appointments.map((a, index) => (

            <div
              className="appointment-list-item"
              key={index}
            >

              <div className="date-box">
                <b>{a[0]}</b>
                <span>{a[1]}</span>
              </div>

              <div>
                <h3>{a[2]}</h3>
                <p>{a[3]}</p>
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