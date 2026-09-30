import React from "react";
import { NurseLayout } from "./NurseDashboard";

function Alerts({ navigate, logout }) {

  return (
    <NurseLayout
      active="alerts"
      navigate={navigate}
      logout={logout}
    >

      <div className="page-heading">

        <h1>Alerts</h1>

        <p>Important patient and care notifications.</p>

      </div>

      <div className="alert-card critical-alert">

        <div className="alert-icon">⚠</div>

        <div>

          <h3>Critical Patient</h3>

          <p>
            P101 — Amit Sharma
          </p>

          <small>
            Room 204 • Needs immediate attention
          </small>

        </div>

        <button
          onClick={() => navigate("patient-queue")}
        >
          View Details
        </button>

      </div>

      <div className="alert-card warning-alert">

        <div className="alert-icon">⚠</div>

        <div>

          <h3>Vitals Alert</h3>

          <p>P118 — Patient</p>

          <small>
            Vitals require attention
          </small>

        </div>

        <button onClick={() => navigate("vitals")}>
          View Details
        </button>

      </div>

    </NurseLayout>
  );
}

export default Alerts;