import React from "react";

function RoleCard({ icon, role, description, onClick, color }) {
  return (
    <div className={`role-card ${color}`}>
      <div className="role-icon">{icon}</div>

      <h2>{role}</h2>

      <p>{deimport React from "react";

function RoleSelection({ onSelectRole, onBack }) {
  return (
    <div className="role-selection-page">

      {/* Header */}
      <header className="role-header">

        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="role-brand">
          <div className="brand-logo">✚</div>

          <div>
            <h2>PatientCare</h2>
            <p>Secure Healthcare Management</p>
          </div>
        </div>

        <div className="header-security">
          🔒 Secure • Encrypted • Trusted
        </div>

      </header>

      {/* Main Content */}
      <main className="role-main">

        <h1>Select Your Role To Continue</h1>

        <p className="role-introduction">
          Choose your role to access your personalized dashboard.
        </p>

        <div className="role-cards">

          {/* Patient */}
          <div className="role-card patient-card">

            <div className="role-icon patient-icon">
              👤
            </div>

            <h2>Patient</h2>

            <p>
              View your health records, appointments and prescriptions
            </p>

            <button
              onClick={() => onSelectRole("Patient")}
            >
              Continue as Patient
            </button>

          </div>


          {/* Doctor */}
          <div className="role-card doctor-card">

            <div className="role-icon doctor-icon">
              ⚕
            </div>

            <h2>Doctor</h2>

            <p>
              Manage patients, appointments, diagnosis and prescriptions
            </p>

            <button
              onClick={() => onSelectRole("Doctor")}
            >
              Continue as Doctor
            </button>

          </div>


          {/* Nurse */}
          <div className="role-card nurse-card">

            <div className="role-icon nurse-icon">
              ✚
            </div>

            <h2>Nurse</h2>

            <p>
              View patient queue, vitals, tasks and care reports
            </p>

            <button
              onClick={() => onSelectRole("Nurse")}
            >
              Continue as Nurse
            </button>

          </div>

        </div>


        {/* Security Section */}
        <div className="role-security">

          <div className="security-item">

            <div className="security-icon">
              🔐
            </div>

            <div>
              <strong>End-to-End Encryption</strong>
              <p>Your data is protected</p>
            </div>

          </div>


          <div className="security-item">

            <div className="security-icon">
              🛡
            </div>

            <div>
              <strong>Integrity Protected</strong>
              <p>Tamper-evident records</p>
            </div>

          </div>


          <div className="security-item">

            <div className="security-icon">
              💾
            </div>

            <div>
              <strong>Secure Backup</strong>
              <p>Always have a backup</p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default RoleSelection;scription}</p>

      <button onClick={onClick}>
        Continue as {role}
      </button>
    </div>
  );
}

export default RoleCard;