import React from "react";

function PatientDashboard({ navigate, logout }) {

  const menu = [
    ["🏠", "Overview", "patient-dashboard"],
    ["📅", "Appointments", "patient-appointments"],
    ["📄", "My Reports", "medical-records"],
    ["💊", "Prescriptions", "prescriptions"],
    ["📋", "Medical History", "medical-history"]
  ];

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="sidebar-brand">
          ✚ PatientCare
        </div>

        {menu.map((item) => (
          <button
            key={item[1]}
            className={
              item[2] === "patient-dashboard"
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => navigate(item[2])}
          >
            {item[0]} {item[1]}
          </button>
        ))}

        <div className="sidebar-bottom">

          <button className="sidebar-item">
            👤 Profile
          </button>

          <button className="sidebar-item">
            ⚙ Settings
          </button>

          <button
            className="logout-button"
            onClick={logout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <h2>Patient Dashboard</h2>

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

          <h1>Welcome, Rutuja Patil 👋</h1>

          <p className="dashboard-subtitle">
            Take care of your health today.
          </p>

          <div className="stats-grid">

            <Stat
              title="Upcoming Appointment"
              value="1"
              note="Today, 4:30 PM"
            />

            <Stat
              title="Reports"
              value="5"
              note="Available"
            />

            <Stat
              title="Prescriptions"
              value="3"
              note="Active"
            />

            <Stat
              title="Health Status"
              value="Good"
              note="✓ Healthy"
            />

          </div>

          <div className="content-grid">

            <div className="panel">

              <h3>Upcoming Appointment</h3>

              <div className="appointment-card">

                <div className="profile-circle">
                  ⚕
                </div>

                <div>
                  <strong>Dr. Ananya Mehta</strong>
                  <p>General Physician</p>
                </div>

                <div>
                  <strong>02 Sep 2026</strong>
                  <p>04:30 PM</p>
                </div>

              </div>

              <button className="green-button">
                View Details
              </button>

            </div>

            <div className="panel">

              <h3>Recent Reports</h3>

              <Report name="Blood Test Report" date="02 Sep 2026" />
              <Report name="X-Ray Chest" date="20 Aug 2026" />
              <Report name="Blood Pressure Report" date="15 Aug 2026" />

            </div>

          </div>

          <div className="security-banner">
            🔐 Your health data is encrypted and securely stored.
          </div>

        </section>

      </main>

    </div>
  );
}

function Stat({ title, value, note }) {
  return (
    <div className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function Report({ name, date }) {
  return (
    <div className="report-row">
      <div>
        <strong>📄 {name}</strong>
        <small>Uploaded on {date}</small>
      </div>

      <button>View</button>
    </div>
  );
}

export default PatientDashboard;