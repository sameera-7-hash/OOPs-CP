import React from "react";

function Prescriptions({ navigate, logout }) {

  return (
    <PatientPage
      title="Prescriptions"
      navigate={navigate}
      logout={logout}
      active="prescriptions"
    >

      <div className="page-heading">

        <h1>My Prescriptions</h1>

        <p>
          View your active and previous prescriptions.
        </p>

      </div>

      <div className="panel">

        <table className="data-table">

          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Paracetamol</td>
              <td>500 mg</td>
              <td>2 times/day</td>
              <td>5 days</td>
              <td>Dr. Mehta</td>
              <td><span className="status green">Active</span></td>
            </tr>

            <tr>
              <td>Vitamin D</td>
              <td>1 tablet</td>
              <td>Once/day</td>
              <td>30 days</td>
              <td>Dr. Mehta</td>
              <td><span className="status green">Active</span></td>
            </tr>

            <tr>
              <td>Amoxicillin</td>
              <td>500 mg</td>
              <td>3 times/day</td>
              <td>7 days</td>
              <td>Dr. Shah</td>
              <td><span className="status gray">Completed</span></td>
            </tr>

          </tbody>

        </table>

      </div>

    </PatientPage>
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

export default Prescriptions;