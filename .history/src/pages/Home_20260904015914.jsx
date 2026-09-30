import React from "react";
import Navbar from "../components/navbar";
import RoleCard from "../components/RoleCard";

function Home({ onSelectRole }) {
  return (
    <div className="home-page">

      <Navbar onHome={() => window.scrollTo(0, 0)} />

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-text">

            <h1>
              Welcome To
              <br />
              <span>PatientCare</span>
            </h1>

            <p className="hero-tagline">
              Your Health. Your Priority.
            </p>

            <button
              className="hero-button"
              onClick={() =>
                document
                  .getElementById("role-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Login
            </button>

          </div>

          <div className="hero-image">
            <div className="doctor-image-placeholder">
              <div className="doctor-symbol">⚕</div>
              <h3>Healthcare</h3>
              <p>Secure • Encrypted • Trusted</p>
            </div>
          </div>

        </div>

      </section>

      <section id="role-section" className="role-section">

        <h1>Select Your Role To Continue</h1>

        <p className="section-subtitle">
          Choose the dashboard that matches your role
        </p>

        <div className="role-container">

          <RoleCard
            icon="👤"
            role="Patient"
            color="patient-role"
            description="View your health records, appointments and prescriptions"
            onClick={() => onSelectRole("Patient")}
          />

          <RoleCard
            icon="⚕"
            role="Doctor"
            color="doctor-role"
            description="Manage patients, appointments, diagnosis and prescriptions"
            onClick={() => onSelectRole("Doctor")}
          />

          <RoleCard
            icon="✚"
            role="Nurse"
            color="nurse-role"
            description="View patient queue, vitals, tasks and care reports"
            onClick={() => onSelectRole("Nurse")}
          />

        </div>

        <div className="security-strip">

          <div>
            <strong>🔐 End-to-End Encryption</strong>
            <span>Your data is protected</span>
          </div>

          <div>
            <strong>🛡 Integrity Protected</strong>
            <span>Tamper-evident records</span>
          </div>

          <div>
            <strong>💾 Secure Backup</strong>
            <span>Always have a backup</span>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;