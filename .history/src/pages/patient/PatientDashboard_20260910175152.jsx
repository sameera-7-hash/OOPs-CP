import React, { useState } from "react";

function PatientDashboard({ navigate, logout }) {
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
              R
            </div>

            <div>
              <strong>Rutuja Patil</strong>
              <small>Patient</small>
            </div>

          </button>

        </div>

      </header>


      <div className="dashboard-body">

        <aside className="side-nav">

          <button
            className="nav-link active"
            onClick={() => navigate("patient-dashboard")}
          >
            🏠 Overview
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("patient-appointments")}
          >
            📅 Appointments
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("medical-records")}
          >
            📄 My Reports
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("prescriptions")}
          >
            💊 Prescriptions
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("medical-history")}
          >
            📋 Medical History
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
                PATIENT PORTAL
              </span>

              <h1>
                Welcome, Rutuja Patil 👋
              </h1>

              <p>
                Take care of your health today.
              </p>
            </div>

          </div>


          <div className="stats-container">

            <div className="stat-box">
              <span>📅 Upcoming Appointment</span>
              <strong>1</strong>
              <small>Today, 4:30 PM</small>
            </div>

            <div className="stat-box">
              <span>📄 Reports</span>
              <strong>5</strong>
              <small>Available</small>
            </div>

            <div className="stat-box">
              <span>💊 Prescriptions</span>
              <strong>3</strong>
              <small>Active prescriptions</small>
            </div>

            <div className="stat-box">
              <span>❤️ Health Status</span>
              <strong className="success-text">
                Good
              </strong>
              <small>✓ Healthy</small>
            </div>

          </div>


          <div className="two-column">

            <section className="card">

              <div className="card-title">

                <div>
                  <h2>Upcoming Appointment</h2>
                  <p>Your next scheduled consultation</p>
                </div>

                <span className="status-badge">
                  Confirmed
                </span>

              </div>


              <div className="appointment-box">

                <div className="doctor-avatar">
                  ⚕
                </div>

                <div>
                  <h3>Dr. Ananya Mehta</h3>
                  <p>General Physician</p>
                </div>

                <div className="appointment-date">
                  <b>02 Sep 2026</b>
                  <span>04:30 PM</span>
                </div>

              </div>


              <button
                className="primary-btn"
                onClick={() => navigate("patient-appointments")}
              >
                View Appointment Details →
              </button>

            </section>


            <section className="card">

              <div className="card-title">

                <div>
                  <h2>Recent Reports</h2>
                  <p>Your latest medical reports</p>
                </div>

                <button
                  className="text-btn"
                  onClick={() => navigate("medical-records")}
                >
                  View All
                </button>

              </div>


              <div className="report-item">
                <span>📄</span>
                <div>
                  <b>Blood Test Report</b>
                  <small>Uploaded on 02 Sep 2026</small>
                </div>
                <button>View</button>
              </div>

              <div className="report-item">
                <span>📄</span>
                <div>
                  <b>X-Ray Chest</b>
                  <small>Uploaded on 20 Aug 2026</small>
                </div>
                <button>View</button>
              </div>

              <div className="report-item">
                <span>📄</span>
                <div>
                  <b>Blood Pressure Report</b>
                  <small>Uploaded on 15 Aug 2026</small>
                </div>
                <button>View</button>
              </div>

            </section>

          </div>


          <div className="health-grid">

            <div className="health-box">
              <span>❤️</span>
              <div>
                <b>Health Status</b>
                <p>Your current health status is good.</p>
              </div>
              <strong className="success-text">
                ✓ Healthy
              </strong>
            </div>


            <div className="health-box">
              <span>🔐</span>
              <div>
                <b>Data Security</b>
                <p>Your health records are protected.</p>
              </div>
              <strong className="success-text">
                Protected
              </strong>
            </div>

          </div>


          <div className="security-strip">
            🔐 Your health data is encrypted and securely stored.
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
              R
            </div>

            <h2>Rutuja Patil</h2>
            <p>Patient</p>

            <div className="profile-info">

              <div>
                <span>Name</span>
                <b>Rutuja Patil</b>
              </div>

              <div>
                <span>Role</span>
                <b>Patient</b>
              </div>

              <div>
                <span>Reports</span>
                <b>5 Available</b>
              </div>

              <div>
                <span>Health Status</span>
                <b className="success-text">
                  ● Good
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

export default PatientDashboard;