import React from "react";

function PatientQueue({ navigate }) {

  return (
    <div className="section-page">

      <div className="section-header">
        <div>
          <span className="eyebrow">QUEUE MANAGEMENT</span>
          <h1>Patient Queue</h1>
          <p>Manage patients waiting for consultation.</p>
        </div>
      </div>


      <section className="card">

        <div className="queue-large">

          <div className="queue-heading">
            <b>FRONT</b>
          </div>

          <QueueRow id="P101" name="Amit Sharma" priority="Critical" room="204" />
          <QueueRow id="P104" name="Neha Verma" priority="High" room="108" />
          <QueueRow id="P110" name="Ravi Patel" priority="Medium" room="312" />
          <QueueRow id="P115" name="Sneha Iyer" priority="Normal" room="305" />

          <div className="queue-heading">
            <b>REAR</b>
          </div>

        </div>


        <div className="form-actions">

          <button className="primary-btn">
            + Add Patient
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("priority-queue")}
          >
            Next Patient
          </button>

        </div>

      </section>


      <div className="security-strip">
        📚 Queue follows FIFO — First In, First Out.
      </div>

    </div>
  );
}


function QueueRow({ id, name, priority, room }) {

  return (
    <div className="queue-large-row">

      <strong>{id}</strong>

      <span>{name}</span>

      <label className={`priority ${priority.toLowerCase()}`}>
        {priority}
      </label>

      <small>Room {room}</small>

      <span>→</span>

    </div>
  );
}

export default PatientQueue;