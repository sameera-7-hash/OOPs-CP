import React, { useState } from "react";

function MedicalRecords({ navigate, logout }) {

  const [search, setSearch] = useState("");

  const records = [
    ["Blood Test Report", "02 Sep 2026", "Dr. Mehta", "Lab Report", "AES-256"],
    ["X-Ray Chest", "20 Aug 2026", "Dr. Shah", "Radiology", "AES-256"],
    ["Prescription", "18 Aug 2026", "Dr. Mehta", "Medication", "AES-256"],
    ["Diagnosis", "10 Aug 2026", "Dr. Rao", "Clinical", "DES"]
  ];

  const filtered = records.filter((record) =>
    record[0].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PatientPage
      title="Medical Records"
      navigate={navigate}
      logout={logout}
      active="medical-records"
    >

      <div className="page-heading">

        <h1>Medical Records</h1>

        <p>
          Access your securely stored medical information.
        </p>

      </div>

      <div className="panel">

        <div className="search-row">

          <input
            placeholder="🔍 Search records"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select>
            <option>All Records</option>
            <option>Lab Report</option>
            <option>Radiology</option>
            <option>Medication</option>
            <option>Clinical</option>
          </select>

        </div>

        <table className="data-table">

          <thead>
            <tr>
              <th>Record Name</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Type</th>
              <th>Encryption</th>
              <th>Integrity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((record, index) => (

              <tr key={index}>

                <td>{record[0]}</td>
                <td>{record[1]}</td>
                <td>{record[2]}</td>
                <td>{record[3]}</td>
                <td>{record[4]}</td>

                <td>
                  <span className="status green">
                    ✓ Verified
                  </span>
                </td>

                <td>
                  <button className="small-button">
                    View
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </PatientPage>
  );
}

function PatientPage({
  children,
  title,
  navigate,
  logout,
  active
}) {

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

        <div className="sidebar-brand">
          ✚ PatientCare
        </div>

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

          <button className="sidebar-item">
            👤 Profile
          </button>

          <button className="sidebar-item">
            ⚙ Settings
          </button>

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

export default MedicalRecords;