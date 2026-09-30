import React, { useState } from "react";
import { DoctorLayout } from "./DoctorDashboard";

function Patients({ navigate, logout }) {

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");

  const patients = [
    {
      id: "P124",
      name: "Amit Sharma",
      age: 42,
      gender: "Male",
      diagnosis: "High Fever",
      priority: "Critical"
    },
    {
      id: "P123",
      name: "Neha Verma",
      age: 29,
      gender: "Female",
      diagnosis: "Fracture",
      priority: "High"
    },
    {
      id: "P122",
      name: "Ravi Patel",
      age: 35,
      gender: "Male",
      diagnosis: "Diabetes",
      priority: "Medium"
    },
    {
      id: "P121",
      name: "Sneha Iyer",
      age: 31,
      gender: "Female",
      diagnosis: "Checkup",
      priority: "Normal"
    }
  ];

  const filtered = patients
    .filter((p) =>
      `${p.id} ${p.name} ${p.diagnosis}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "age") return a.age - b.age;
      if (sort === "id") return a.id.localeCompare(b.id);
      return 0;
    });

  return (
    <DoctorLayout
      active="doctor-patients"
      navigate={navigate}
      logout={logout}
      menu={doctorMenu}
    >

      <div className="page-heading">

        <h1>Patient Records</h1>

        <p>
          Search, sort and manage patient information.
        </p>

      </div>

      <div className="panel">

        <div className="search-row">

          <input
            placeholder="🔍 Search by ID, name or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="age">Sort by Age</option>
            <option value="id">Sort by Patient ID</option>
          </select>

        </div>

        <table className="data-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Diagnosis</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((patient) => (

              <tr key={patient.id}>

                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.diagnosis}</td>

                <td>
                  <span className={`priority ${patient.priority.toLowerCase()}`}>
                    {patient.priority}
                  </span>
                </td>

                <td>
                  <button
                    className="small-button"
                    onClick={() => navigate("patient-details")}
                  >
                    View
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="dsainfo">
        🔎 Patient ID Search → Hash Map concept &nbsp; | &nbsp;
        ↕ Sorting → Sorting algorithm
      </div>

    </DoctorLayout>
  );
}

const doctorMenu = [
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

export default Patients;