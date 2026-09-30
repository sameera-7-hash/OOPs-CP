import React from "react";

function Appointments({ navigate, logout }) {

  return (
    <DashboardPage
      title="Appointments"
      navigate={navigate}
      logout={logout}
      active="patient-appointments"
    >

      <div className="page-heading">
        <h1>Appointments</h1>
        <p>Manage your upcoming and previous appointments.</p>
      </div>

      <div className="panel">

        <h3>Upcoming Appointments</h3>

        <div className="appointment-list">

          <Appointment
            doctor="Dr. Ananya Mehta"
            type="General Physician"
            date="02 Sep 2026"
            time="04:30 PM"
            status="Scheduled"
          />

          <Appointment
            doctor="Dr. Rahul Shah"
            type="Follow-up"
            date="10 Sep 2026"
            time="11:00 AM"
            status="Scheduled"
          />

        </div>

      </div>

      <div className="panel">

        <h3>Past Appointments</h3>

        <table className="data-table">

          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Dr. Mehta</td>
              <td>20 Aug 2026</td>
              <td>10:00 AM</td>
              <td>Checkup</td>
              <td>Completed</td>
            </tr>

            <tr>
              <td>Dr. Shah</td>
              <td>12 Aug 2026</td>
              <td>11:30 AM</td>
              <td>Follow-up</td>
              <td>Completed</td>
            </tr>

          </tbody>

        </table>

      </div>

    </DashboardPage>
  );
}

function Appointment({ doctor, type, date, time, status }) {
  return (
    <div className="appointment-row">

      <div className="profile-circle">⚕</div>

      <div>
        <strong>{doctor}</strong>
        <small>{type}</small>
      </div>

      <div>
        <strong>{date}</strong>
        <small>{time}</small>
      </div>

      <span className="status green">{status}</span>

    </div>
  );
}

function DashboardPage({ children, title, navigate, logout }) {

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="sidebar-brand">
          ✚ PatientCare
        </div>

        <button
          className="sidebar-item"
          onClick={() => navigate("patient-dashboard")}
        >
          🏠 Overview
        </button>

        <button
          className="sidebar-item active"
          onClick={() => navigate("patient-appointments")}
        >
          📅 Appointments
        </button>

        <button
          className="sidebar-item"
          onClick={() => navigate("medical-records")}
        >
          📄 My Reports
        </button>

        <button
          className="sidebar-item"
          onClick={() => navigate("prescriptions")}
        >
          💊 Prescriptions
        </button>

        <button
          className="sidebar-item"
          onClick={() => navigate("medical-history")}
        >
          📋 Medical History
        </button>

        <div className="sidebar-bottom">

          <button className="sidebar-item">👤 Profile</button>

          <button className="sidebar-item">⚙ Settings</button>

          <button className="logout-button" onClick={logout}>
            ↪ Logout
          </button>

        </div>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <h2>{title}</h2>

          <div className="user-profile">
            <span>🔔</span>
            <div className="avatar">R</div>
            <div>
              <strong>Rutuja Patil</strong>
              <small>Patient</small>
            </div>
          </div>

        </header>

        <section className="dashboard-content">
          {children}
        </section>

      </main>

    </div>
  );
}

export default Appointments;