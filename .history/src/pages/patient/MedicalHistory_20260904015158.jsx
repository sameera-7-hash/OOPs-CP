import React from "react";

function MedicalHistory({ navigate, logout }) {

  return (
    <PatientPage
      title="Medical History"
      navigate={navigate}
      logout={logout}
      active="medical-history"
    >

      <div className="page-heading">

        <h1>Medical History</h1>

        <p>
          Your healthcare history in chronological order.
        </p>

      </div>

      <div className="timeline">

        <History
          date="02 Sep 2026"
          title="Blood Test"
          description="CBC blood test report uploaded."
        />

        <History
          date="20 Aug 2026"
          title="X-Ray"
          description="Chest X-Ray completed."
        />

        <History
          date="18 Aug 2026"
          title="Prescription"
          description="Medication prescription issued."
        />

        <History
          date="10 Aug 2026"
          title="Consultation"
          description="General health consultation completed."
        />

      </div>

    </PatientPage>
  );
}

function History({ date, title, description }) {

  return (
    <div className="timeline-item">

      <div className="timeline-dot"></div>

      <div className="panel">

        <small>{date}</small>

        <h3>{title}</h3>

        <p>{description}</p>

      </div>

    </div>
  );
}

function PatientPage({ children, title, navigate, logout, active }) {

  const links = [
    ["🏠", "Overview", "patient-dashboard"],
    ["📅", "Appointments", "patient-appointments"],
    ["📄", "My Reports", "medical-records"],
    ["💊", "Prescriptions", "prescriptions"],
    ["📋", "Medical History", "medical-history"]
  ];

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="sidebar-brand">✚ PatientCare</div>

        {links.map((link) => (
          <button
            key={link[1]}
            className={
              active === link[2]
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => navigate(link[2])}
          >
            {link[0]} {link[1]}
          </button>
        ))}

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

export default MedicalHistory;