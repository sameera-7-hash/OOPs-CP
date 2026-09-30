import React from "react";
import { NurseLayout } from "./NurseDashboard";

function PriorityQueue({ navigate, logout }) {

  const patients = [
    ["Critical", "P101", "Amit Sharma", "Room 204"],
    ["Critical", "P118", "Patient", "Room 210"],
    ["High", "P104", "Neha Verma", "Room 108"],
    ["Medium", "P110", "Ravi Patel", "Room 312"],
    ["Normal", "P115", "Sneha Iyer", "Room 305"]
  ];

  return (
    <NurseLayout
      active="priority-queue"
      navigate={navigate}
      logout={logout}
    >

      <div className="page-heading">

        <h1>Emergency Priority Queue</h1>

        <p>
          Patients are arranged according to priority.
        </p>

      </div>

      <div className="panel">

        <div className="priority-list">

          {patients.map((patient, index) => (

            <div
              className="priority-row"
              key={index}
            >

              <span
                className={`priority ${patient[0].toLowerCase()}`}
              >
                {patient[0]}
              </span>

              <strong>{patient[1]}</strong>

              <span>{patient[2]}</span>

              <span>{patient[3]}</span>

            </div>

          ))}

        </div>

      </div>

      <div className="priority-explanation">

        <strong>Highest Priority</strong>

        <div className="priority-line"></div>

        <strong>Lowest Priority</strong>

        <p>
          Critical patients receive higher priority when required.
        </p>

      </div>

      <div className="dsainfo">
        📚 Priority Queue / Heap → Highest-priority patient is processed first.
      </div>

    </NurseLayout>
  );
}

export default PriorityQueue;