import React, { useState } from "react";

function Patients({ navigate }) {

  const [search, setSearch] = useState("");

  const patients = [
    ["P124", "Amit Sharma", "42", "Male", "High Fever", "Critical"],
    ["P123", "Neha Verma", "29", "Female", "Fracture", "High"],
    ["P122", "Ravi Patel", "35", "Male", "Diabetes Checkup", "Medium"],
    ["P121", "Sneha Iyer", "31", "Female", "Regular Checkup", "Normal"],
    ["P120", "Rahul Mehta", "45", "Male", "Blood Pressure", "High"]
  ];

  const filtered = patients.filter(
    (p) =>
      p[1].toLowerCase().includes(search.toLowerCase()) ||
      p[0].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">PATIENT MANAGEMENT</span>
          <h1>Patients</h1>
          <p>View and manage patient records.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("add-patient")}
        >
          + Add Patient
        </button>

      </div>


      <section className="card">

        <div className="search-row">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by patient name or ID..."
          />

        </div>


        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Diagnosis</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((p) => (

                <tr key={p[0]}>

                  <td>{p[0]}</td>

                  <td>
                    <b>{p[1]}</b>
                  </td>

                  <td>{p[2]}</td>
                  <td>{p[3]}</td>
                  <td>{p[4]}</td>

                  <td>
                    <span className={`priority ${p[5].toLowerCase()}`}>
                      {p[5]}
                    </span>
                  </td>

                  <td>
                    <button
                      className="small-primary-btn"
                      onClick={() =>
                        navigate("patient-details")
                      }
                    >
                      View
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Patients;