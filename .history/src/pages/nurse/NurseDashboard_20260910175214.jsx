import React from "react";

function NurseDashboard({ navigate, logout }) {

  return (
    <NurseLayout
      active="nurse-dashboard"
      navigate={navigate}
      logout={logout}
    >

      <h1>Good Morning, Nurse Priya 👋</h1>

      <p className="dashboard-subtitle">
        Monitor patient flow, care tasks and queue.
      </p>

      <div className="stats-grid">

        <Stat
          title="Waiting Patients"
          value="7"
          note="In consultation: 3"
        />

        <Stat
          title="Critical Patients"
          value="2"
          note="Immediate attention"
        />

        <Stat
          title="Tasks Today"
          value="14"
          note="✓ 5 Completed"
        />

        <Stat
          title="Bed Availability"
          value="6"
          note="Available beds"
        />

      </div>

      <div className="content-grid">

        <div className="panel">

          <div className="panel-header">

            <h3>Patient Queue</h3>

            <button
              onClick={() => navigate("patient-queue")}
            >
              Next Patient
            </button>

          </div>

          <QueueRow
            id="P101"
            name="Amit Sharma"
            priority="Critical"
            room="Room 204"
            position="1st"
          />

          <QueueRow
            id="P104"
            name="Neha Verma"
            priority="High"
            room="Room 108"
            position="2nd"
          />

          <QueueRow
            id="P110"
            name="Ravi Patel"
            priority="Medium"
            room="Room 312"
            position="3rd"
          />

          <QueueRow
            id="P115"
            name="Sneha Iyer"
            priority="Normal"
            room="Room 305"
            position="4th"
          />

        </div>

        <div className="panel">

          <h3>Today's Tasks</h3>

          <Task text="Check Vitals - Room 204" done />
          <Task text="Medicine Rounds" done />
          <Task text="Update Care Notes" />
          <Task text="Assist in Consultation" />
          <Task text="Discharge Summary" />

        </div>

      </div>

      <div className="alert-box">
        ⚠ P101 (Amit Sharma) needs immediate attention.
        <button onClick={() => navigate("alerts")}>
          View Details
        </button>
      </div>

      <div className="dsainfo">
        📋 Queue follows FIFO. Critical patients are prioritized.
      </div>

    </NurseLayout>
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

function QueueRow({ id, name, priority, room, position }) {

  return (
    <div className="queue-row">

      <strong>{id}</strong>

      <span>{name}</span>

      <span className={`priority ${priority.toLowerCase()}`}>
        {priority}
      </span>

      <span>{room}</span>

      <strong>{position}</strong>

    </div>
  );
}

function Task({ text, done }) {

  return (
    <div className="task-row">

      <input
        type="checkbox"
        checked={done}
        readOnly
      />

      <span>{text}</span>

    </div>
  );
}

export function NurseLayout({
  children,
  active,
  navigate,
  logout
}) {

  const menu = [
    ["▦", "Dashboard", "nurse-dashboard"],
    ["☷", "Patient Queue", "patient-queue"],
    ["⚠", "Priority Queue", "priority-queue"],
    ["🩺", "Vitals", "vitals"],
    ["✓", "Tasks", "tasks"],
    ["📋", "Care Notes", "nurse-dashboard"],
    ["📄", "Reports", "nurse-dashboard"],
    ["🔔", "Alerts", "alerts"]
  ];

  return (
    <div className="dashboard-layout">

      <aside className="sidebar nurse-sidebar">

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

          <h2>Nurse Dashboard</h2>

          <div className="user-profile">

            <span>🔔</span>

            <div className="avatar nurse-avatar">
              N
            </div>

            <div>
              <strong>Nurse Priya</strong>
              <small>Nurse</small>
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

export default NurseDashboard;