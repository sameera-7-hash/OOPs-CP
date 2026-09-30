import React, { useState } from "react";

function DoctorDashboard({ navigate, logout }) {
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
          <button className="icon-btn">🔔</button>

          <button
            className="user-btn"
            onClick={() => setProfile(true)}
          >
            <div className="avatar">D</div>
            <div>
              <strong>Dr. Ananya Mehta</strong>
              <small>Doctor</small>
            </div>
          </button>
        </div>
      </header>


      <div className="dashboard-body">

        <aside className="side-nav">

          <button
            className="nav-link active"
            onClick={() => navigate("doctor-dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("doctor-patients")}
          >
            👥 Patients
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("doctor-appointments")}
          >
            📅 Appointments
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("add-patient")}
          >
            ➕ Add Patient
          </button>

          <button className="nav-link">
            💊 Prescriptions
          </button>

          <button className="nav-link">
            📄 Reports
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("analytics")}
          >
            📊 Analytics
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("undo-redo")}
          >
            ↶ Undo / Redo
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("backup-restore")}
          >
            💾 Backup & Restore
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
                CLINICAL OVERVIEW
              </span>

              <h1>
                Good Morning, Dr. Ananya 👋
              </h1>

              <p>
                Here's today's clinical overview.
              </p>
            </div>

            <span className="available-badge">
              ● Available
            </span>

          </div>


          <div className="stats-container">

            <div className="stat-box">
              <span>👥 Total Patients</span>
              <strong>124</strong>
              <small>↑ 12 this week</small>
            </div>

            <div className="stat-box">
              <span>📅 Today's Appointments</span>
              <strong>12</strong>
              <small>Scheduled today</small>
            </div>

            <div className="stat-box">
              <span>⚠ Critical Patients</span>
              <strong>8</strong>
              <small className="danger-text">
                Needs attention
              </small>
            </div>

            <div className="stat-box">
              <span>✓ Integrity Status</span>
              <strong className="success-text">
                OK
              </strong>
              <small>All records secure</small>
            </div>

          </div>


          <section className="card">

            <div className="card-title">

              <div>
                <h2>Recent Patients</h2>
                <p>Recently accessed patient records</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => navigate("doctor-patients")}
              >
                View All Patients →
              </button>

            </div>


            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Age / Gender</th>
                    <th>Diagnosis</th>
                    <th>Priority</th>
                    <th>Encryption</th>
                    <th>Integrity</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td><b>Amit Sharma</b><small>P124</small></td>
                    <td>42 Y / Male</td>
                    <td>High Fever</td>
                    <td><span className="priority critical">Critical</span></td>
                    <td>AES-256</td>
                    <td className="success-text">✓ Verified</td>
                  </tr>

                  <tr>
                    <td><b>Neha Verma</b><small>P123</small></td>
                    <td>29 Y / Female</td>
                    <td>Fracture</td>
                    <td><span className="priority high">High</span></td>
                    <td>AES-256</td>
                    <td className="success-text">✓ Verified</td>
                  </tr>

                  <tr>
                    <td><b>Ravi Patel</b><small>P122</small></td>
                    <td>35 Y / Male</td>
                    <td>Diabetes Checkup</td>
                    <td><span className="priority medium">Medium</span></td>
                    <td>AES-256</td>
                    <td className="success-text">✓ Verified</td>
                  </tr>

                  <tr>
                    <td><b>Sneha Iyer</b><small>P121</small></td>
                    <td>31 Y / Female</td>
                    <td>Regular Checkup</td>
                    <td><span className="priority normal">Normal</span></td>
                    <td>DES</td>
                    <td className="success-text">✓ Verified</td>
                  </tr>

                  <tr>
                    <td><b>Rahul Mehta</b><small>P120</small></td>
                    <td>45 Y / Male</td>
                    <td>Blood Pressure</td>
                    <td><span className="priority high">High</span></td>
                    <td>AES-256</td>
                    <td className="success-text">✓ Verified</td>
                  </tr>

                </tbody>

              </table>

            </div>

          </section>


          <section className="card">

            <div className="card-title">
              <div>
                <h2>Quick Actions</h2>
                <p>Frequently used clinical actions</p>
              </div>
            </div>

            <div className="action-grid">

              <button onClick={() => navigate("add-patient")}>
                ➕
                <b>Add Patient</b>
                <small>New patient record</small>
              </button>

              <button onClick={() => navigate("doctor-patients")}>
                🔍
                <b>Search Patient</b>
                <small>Find patient quickly</small>
              </button>

              <button onClick={() => navigate("undo-redo")}>
                ↶
                <b>Undo</b>
                <small>Undo last action</small>
              </button>

              <button onClick={() => navigate("undo-redo")}>
                ↷
                <b>Redo</b>
                <small>Redo last action</small>
              </button>

            </div>

          </section>


          <div className="security-strip">
            <span>🛡 AES-256 Encryption</span>
            <span>💾 Backup Available</span>
            <span>✓ Integrity Verified</span>
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
              D
            </div>

            <h2>Dr. Ananya Mehta</h2>
            <p>General Physician</p>

            <div className="profile-info">
              <div>
                <span>Name</span>
                <b>Dr. Ananya Mehta</b>
              </div>

              <div>
                <span>Role</span>
                <b>Doctor</b>
              </div>

              <div>
                <span>Patients</span>
                <b>124 Patients</b>
              </div>

              <div>
                <span>Status</span>
                <b className="success-text">● Available</b>
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

export default DoctorDashboard;