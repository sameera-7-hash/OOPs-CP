import React, { useState } from "react";

function NurseDashboard({ navigate, logout }) {

  const [profile, setProfile] = useState(false);

  return (
    <div className="dashboard-page">

      <header className="topbar">

        <div className="brand">
          <div className="brand-logo">+</div>

          <div>
            <h2>PatientCare</h2>
            <span>Secure Healthcare Management</span>
          </div>
        </div>


        <div className="topbar-right">

          <button className="icon-btn">
            🔔
          </button>

          <button
            className="user-btn"
            onClick={() => setProfile(true)}
          >

            <div className="avatar">
              P
            </div>

            <div>
              <strong>Nurse Priya</strong>
              <small>Nurse</small>
            </div>

          </button>

        </div>

      </header>


      <div className="dashboard-body">

        <aside className="side-nav">

          <button
            className="nav-link active"
            onClick={() => navigate("nurse-dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("patient-queue")}
          >
            ☷ Patient Queue
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("priority-queue")}
          >
            ⚠ Priority Queue
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("vitals")}
          >
            🩺 Vitals
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("tasks")}
          >
            ✓ Tasks
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("care-notes")}
          >
            📋 Care Notes
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("nurse-reports")}
          >
            📄 Reports
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("alerts")}
          >
            🔔 Alerts
          </button>


          <div className="nav-bottom">

            <button
              className="nav-link"
              onClick={() => setProfile(true)}
            >
              👤 Profile
            </button>

            <button className="nav-link">
              ⚙ Settings
            </button>

            <button
              className="logout-btn"
              onClick={logout}
            >
              ↪ Logout
            </button>

          </div>

        </aside>


        <main className="dashboard-content">

          <div className="page-heading">

            <div>
              <span className="eyebrow">
                NURSING PORTAL
              </span>

              <h1>
                Good Morning, Nurse Priya 👋
              </h1>

              <p>
                Monitor patient flow, care tasks and queue.
              </p>
            </div>

          </div>


          <div className="stats-container">

            <div className="stat-box">
              <span>👥 Waiting Patients</span>
              <strong>7</strong>
              <small>In consultation: 3</small>
            </div>

            <div className="stat-box">
              <span>⚠ Critical Patients</span>
              <strong>2</strong>
              <small className="danger-text">
                Immediate attention
              </small>
            </div>

            <div className="stat-box">
              <span>✓ Tasks Today</span>
              <strong>14</strong>
              <small>5 Completed</small>
            </div>

            <div className="stat-box">
              <span>🛏 Bed Availability</span>
              <strong>6</strong>
              <small>Available beds</small>
            </div>

          </div>


          <div className="two-column">

            <section className="card">

              <div className="card-title">

                <div>
                  <h2>Patient Queue</h2>
                  <p>Patients waiting for consultation.</p>
                </div>

                <button
                  className="text-btn"
                  onClick={() => navigate("patient-queue")}
                >
                  View Queue
                </button>

              </div>


              <div className="queue-list">

                <div>
                  <b>P101</b>
                  <span>Amit Sharma</span>
                  <label className="priority critical">
                    Critical
                  </label>
                  <small>Room 204</small>
                </div>

                <div>
                  <b>P104</b>
                  <span>Neha Verma</span>
                  <label className="priority high">
                    High
                  </label>
                  <small>Room 108</small>
                </div>

                <div>
                  <b>P110</b>
                  <span>Ravi Patel</span>
                  <label className="priority medium">
                    Medium
                  </label>
                  <small>Room 312</small>
                </div>

                <div>
                  <b>P115</b>
                  <span>Sneha Iyer</span>
                  <label className="priority normal">
                    Normal
                  </label>
                  <small>Room 305</small>
                </div>

              </div>


              <button
                className="primary-btn"
                onClick={() => navigate("patient-queue")}
              >
                Next Patient →
              </button>

            </section>


            <section className="card">

              <div className="card-title">

                <div>
                  <h2>Today's Tasks</h2>
                  <p>Track daily nursing activities.</p>
                </div>

                <button
                  className="text-btn"
                  onClick={() => navigate("tasks")}
                >
                  View Tasks
                </button>

              </div>


              <div className="task-list">

                <label>
                  <input type="checkbox" defaultChecked />
                  Check Vitals - Room 204
                </label>

                <label>
                  <input type="checkbox" defaultChecked />
                  Medicine Rounds
                </label>

                <label>
                  <input type="checkbox" />
                  Update Care Notes
                </label>

                <label>
                  <input type="checkbox" />
                  Assist in Consultation
                </label>

                <label>
                  <input type="checkbox" />
                  Discharge Summary
                </label>

              </div>

            </section>

          </div>


          <section className="card">

            <div className="card-title">

              <div>
                <h2>Important Alerts</h2>
                <p>Patient and care notifications.</p>
              </div>

              <button
                className="text-btn"
                onClick={() => navigate("alerts")}
              >
                View All
              </button>

            </div>


            <div className="alert-row">

              <span>⚠</span>

              <div>
                <b>Critical Patient</b>
                <p>P101 — Amit Sharma • Room 204</p>
              </div>

              <button
                className="small-primary-btn"
                onClick={() => navigate("alerts")}
              >
                View Details
              </button>

            </div>


            <div className="alert-row">

              <span>⚠</span>

              <div>
                <b>Vitals Alert</b>
                <p>P118 — Vitals require attention</p>
              </div>

              <button
                className="small-primary-btn"
                onClick={() => navigate("alerts")}
              >
                View Details
              </button>

            </div>

          </section>


          <div className="security-strip">
            🛡 Queue follows FIFO. Critical patients are prioritized.
          </div>

        </main>

      </div>


      {profile && (
        <div
          className="modal-overlay"
          onClick={() => setProfile(false)}
        >

          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setProfile(false)}
            >
              ×
            </button>

            <div className="large-avatar">
              P
            </div>

            <h2>Nurse Priya</h2>
            <p>Nurse</p>

            <div className="profile-info">

              <div>
                <span>Name</span>
                <b>Nurse Priya</b>
              </div>

              <div>
                <span>Role</span>
                <b>Nurse</b>
              </div>

              <div>
                <span>Waiting Patients</span>
                <b>7 Patients</b>
              </div>

              <div>
                <span>Status</span>
                <b className="success-text">
                  ● On Duty
                </b>
              </div>

            </div>

            <button
              className="primary-btn full-btn"
              onClick={() => setProfile(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default NurseDashboard;