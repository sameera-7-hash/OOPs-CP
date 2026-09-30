import React from "react";
import PatientLayout from "./PatientLayout";

function Appointments({ navigate, logout }) {
  return (
    <PatientLayout
      title="Appointments"
      active="patient-appointments"
      navigate={navigate}
      logout={logout}
    >

      <div className="patient-page-heading">

        <div>
          <span className="patient-eyebrow">
            PATIENT PORTAL
          </span>

          <h1>Appointments</h1>

          <p>View and manage your appointments.</p>
        </div>

        <button className="book-appointment-btn">
          + Book Appointment
        </button>

      </div>


      <section className="appointment-section">

        <AppointmentCard
          day="02"
          date="Sep 2026"
          time="04:30 PM"
          doctor="Dr. Ananya Mehta"
          specialty="General Physician"
          status="Confirmed"
        />

        <AppointmentCard
          day="10"
          date="Sep 2026"
          time="11:00 AM"
          doctor="Dr. Rahul Shah"
          specialty="Cardiologist"
          status="Confirmed"
        />

        <AppointmentCard
          day="18"
          date="Sep 2026"
          time="03:00 PM"
          doctor="Dr. Priya Joshi"
          specialty="General Physician"
          status="Pending"
        />

      </section>

    </PatientLayout>
  );
}


function AppointmentCard({
  day,
  date,
  time,
  doctor,
  specialty,
  status
}) {
  return (
    <div className="appointment-modern-card">

      <div className="appointment-date-block">

        <strong>{day}</strong>

        <span>{date}</span>

        <small>{time}</small>

      </div>


      <div className="appointment-doctor-icon">
        ♡
      </div>


      <div className="appointment-doctor-info">

        <h3>{doctor}</h3>

        <p>{specialty}</p>

        <span
          className={
            status === "Pending"
              ? "appointment-status pending"
              : "appointment-status confirmed"
          }
        >
          {status}
        </span>

      </div>


      <button className="appointment-view-btn">
        View
      </button>

    </div>
  );
}

export default Appointments;