import React from "react";

function DoctorDashboard({ navigate, logout }) {

  const menu = [
    ["▦", "Dashboard", "doctor-dashboard"],
    ["👥", "Patients", "doctor-patients"],
    ["📅", "Appointments", "doctor-appointments"],
    ["➕", "Add Patient", "add-patient"],
    ["💊", "Prescriptions", "doctor-dashboard"],
    ["📄", "Reports", "doctor-dashboard"],
    ["📊", "Analytics", "analytics"],
    ["↶", "Undo / Redo", "undo-redo"],
    ["💾", "Backup & Restore", "backup-restore"]
  ];

  return (
    <DoctorLayout
      menu={menu}
      active="doctor-dashboard"
      navigate={navigate}
      logout={logout}
    >

      <h1>Good Morning, Dr. Ananya 👋</h1>

      <p className="dashboard-subtitle">
        Here's today's clinical overview.
      </p>

      <div className="stats-grid">

        <Stat title="Total Patients" value="124" note="↑ 12 this week" />

        <Stat title="Today's Appointments" value="12" note="View schedule" />

        <Stat title="Critical Patients" value="8" note="Needs attention" />

        <Stat title="Integrity Status" value="OK" note="All records secure" />

      </div>

      <div className="panel">

        <div className="panel-header">

          <h3>Recent Patients</h3>

          <button onClick={() => navigate("doctor-patients")}>
            View All
          </button>

        </div>

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age / Gender</th>
              <th>Diagnosis</th>
              <th>Priority</th>
              <th>Encryption</th>
              <th>Integrity</th>
            </tr>
          </thead>

          <tbody>

            <PatientRow id="P124" name="Amit Sharma" age="42 Y / Male" diagnosis="High Fever" priority="Critical" encryption="AES-256" />

            <PatientRow id="P123" name="Neha Verma" age="29 Y / Female" diagnosis="Fracture" priority="High" encryption="AES-256" />

            <PatientRow id="P122" name="Ravi Patel" age="35 Y / Male" diagnosis="Diabetes Checkup" priority="Medium" encryption="AES-256" />

            <PatientRow id="P121" name="Sneha Iyer" age="31 Y / Female" diagnosis="Regular Checkup" priority="Normal" encryption="DES" />

            <PatientRow id="P120" name="Rahul Mehta" age="45 Y / Male" diagnosis="Blood Pressure" priority="High" encryption="AES-256" />

          </tbody>

        </table>

      </div>

      <div className="panel">

        <h3>Recent Actions</h3>

        <div className="quick-actions">

          <button onClick={() => navigate("add-patient")}>
            ➕ Add Patient
            <small>New patient record</small>
          </button>

          <button onClick={() => navigate("doctor-patients")}>
            🔍 Search Patient
            <small>Find patient quickly</small>
          </button>

          <button onClick={() => navigate("undo-redo")}>
            ↶ Undo
            <small>Undo last action</small>
          </button>

          <button onClick={() => navigate("undo-redo")}>
            ↷ Redo
            <small>Redo last action</small>
          </button>

        </div>

      </div>

      <div className="security-banner">
        🛡 Using AES-256 Encryption &nbsp; | &nbsp;
        💾 Backup Available &nbsp; | &nbsp;
        ✓ Integrity Verified
      </div>

    </DoctorLayout>
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

function PatientRow({ id, name, age, diagnosis, priority, encryption }) {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{age}</td>
      <td>{diagnosis}</td>
      <td>
        <span className={`priority ${priority.toLowerCase()}`}>
          {priority}
        </span>
      </td>
      <td>{encryption}</td>
      <td>
        <span className="status green">✓ OK</span>
      </td>
    </tr>
  );
}

export function DoctorLayout({
  children,
  menu,
  active,
  navigate,
  logout
}) {

  return (
    <div className="dashboard-layout">

      <aside className="sidebar doctor-sidebar">

        <div className="sidebar-brand">
          ✚ PatientCare
        </div>

        {menu.map((item) => (

          <button
            key={item[1]}
            className={
              active === item[2]
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => navigate(item[2])}
          >
            {item[0]} {item[1]}
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

          <h2>Doctor Dashboard</h2>

          <div className="user-profile">

            <span>🔔</span>

            <div className="avatar doctor-avatar">
              D
            </div>

            <div>
              <strong>Dr. Ananya Mehta</strong>
              <small>Doctor</small>
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

export default DoctorDashboard;