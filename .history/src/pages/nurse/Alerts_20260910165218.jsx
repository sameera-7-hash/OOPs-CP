import React from "react";

function Alerts() {

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">NOTIFICATIONS</span>
          <h1>Alerts</h1>
          <p>Important patient and care notifications.</p>
        </div>

      </div>


      <section className="card">

        <div className="alert-large">

          <div className="alert-symbol">
            ⚠
          </div>

          <div>
            <span className="alert-label">
              Critical Patient
            </span>

            <h2>P101 — Amit Sharma</h2>

            <p>
              Room 204 • Needs immediate attention
            </p>
          </div>

          <button className="small-primary-btn">
            View Details
          </button>

        </div>


        <div className="alert-large">

          <div className="alert-symbol">
            ⚠
          </div>

          <div>
            <span className="alert-label">
              Vitals Alert
            </span>

            <h2>P118 — Patient</h2>

            <p>
              Vitals require attention
            </p>
          </div>

          <button className="small-primary-btn">
            View Details
          </button>

        </div>

      </section>

    </div>
  );
}

export default Alerts;