import React, { useState } from "react";

function BackupRestore() {

  const [message, setMessage] = useState("");

  return (
    <div className="section-page">

      <div className="section-header">
        <div>
          <span className="eyebrow">DATA MANAGEMENT</span>
          <h1>Backup & Restore</h1>
          <p>Protect and restore healthcare records.</p>
        </div>
      </div>


      <div className="two-column">

        <section className="card backup-card">

          <div className="feature-icon">
            💾
          </div>

          <h2>Create Backup</h2>

          <p>
            Create a secure backup of patient and medical records.
          </p>

          <button
            className="primary-btn"
            onClick={() => setMessage("Backup created successfully.")}
          >
            Create Backup
          </button>

        </section>


        <section className="card backup-card">

          <div className="feature-icon">
            ♻
          </div>

          <h2>Restore Data</h2>

          <p>
            Restore previously backed up healthcare records.
          </p>

          <button
            className="secondary-btn"
            onClick={() => setMessage("Restore process started.")}
          >
            Restore Backup
          </button>

        </section>

      </div>


      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

    </div>
  );
}

export default BackupRestore;