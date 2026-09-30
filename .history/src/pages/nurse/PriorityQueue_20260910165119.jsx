import React from "react";

function PriorityQueue() {

  const patients = [
    ["Critical", "P101", "Amit Sharma", "Room 204"],
    ["Critical", "P118", "Patient", "Room 210"],
    ["High", "P104", "Neha Verma", "Room 108"],
    ["Medium", "P110", "Ravi Patel", "Room 312"],
    ["Normal", "P115", "Sneha Iyer", "Room 305"]
  ];

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">PRIORITY MANAGEMENT</span>
          <h1>Emergency Priority Queue</h1>
          <p>Patients are arranged according to priority.</p>
        </div>

      </div>


      <section className="card">

        <div className="priority-list">

          {patients.map((p, index) => (

            <div className="priority-row" key={index}>

              <span className={`priority ${p[0].toLowerCase()}`}>
                {p[0]}
              </span>

              <b>{p[1]}</b>

              <span>{p[2]}</span>

              <small>{p[3]}</small>

            </div>

          ))}

        </div>

      </section>


      <section className="card">

        <h2>Priority Rules</h2>

        <div className="priority-rule">

          <b>Highest Priority</b>
          <span>Critical patients</span>

        </div>

        <div className="priority-rule">

          <b>Lowest Priority</b>
          <span>Normal patients</span>

        </div>

        <p>
          Critical patients receive higher priority when required.
        </p>

      </section>


      <div className="security-strip">
        📊 Priority Queue / Heap → Highest-priority patient is processed first.
      </div>

    </div>
  );
}

export default PriorityQueue;