import React, { useState } from "react";
import { NurseLayout } from "./NurseDashboard";

function PatientQueue({ navigate, logout }) {

  const [queue, setQueue] = useState([
    ["P101", "Amit Sharma", "Critical", "Room 204"],
    ["P104", "Neha Verma", "High", "Room 108"],
    ["P110", "Ravi Patel", "Medium", "Room 312"],
    ["P115", "Sneha Iyer", "Normal", "Room 305"]
  ]);

  const nextPatient = () => {

    if (queue.length === 0) return;

    const next = queue[0];

    setQueue(queue.slice(1));

    alert(`${next[1]} is now being attended.`);
  };

  const addPatient = () => {

    const newPatient = [
      `P${120 + queue.length}`,
      "New Patient",
      "Normal",
      "Room 310"
    ];

    setQueue([...queue, newPatient]);
  };

  return (
    <NurseLayout
      active="patient-queue"
      navigate={navigate}
      logout={logout}
    >

      <div className="page-heading">

        <h1>Patient Queue</h1>

        <p>
          Manage patients waiting for consultation.
        </p>

      </div>

      <div className="panel">

        <div className="queue-flow">

          <strong>FRONT</strong>

          {queue.map((patient, index) => (

            <React.Fragment key={patient[0]}>

              <div className="queue-box">

                <strong>{patient[0]}</strong>
                <span>{patient[1]}</span>

                <span className={`priority ${patient[2].toLowerCase()}`}>
                  {patient[2]}
                </span>

                <small>{patient[3]}</small>

              </div>

              {index < queue.length - 1 && (
                <span className="arrow">→</span>
              )}

            </React.Fragment>

          ))}

          <strong>REAR</strong>

        </div>

      </div>

      <div className="action-buttons">

        <button
          className="primary-button"
          onClick={addPatient}
        >
          + Add Patient
        </button>

        <button
          className="primary-button"
          onClick={nextPatient}
        >
          → Next Patient
        </button>

      </div>

      <div className="dsainfo">
        📚 Queue follows FIFO — First In, First Out.
      </div>

    </NurseLayout>
  );
}

export default PatientQueue;