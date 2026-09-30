import React from "react";

function Analytics() {

  return (
    <div className="section-page">

      <div className="section-header">
        <div>
          <span className="eyebrow">INSIGHTS</span>
          <h1>Analytics</h1>
          <p>Clinical activity and patient statistics.</p>
        </div>
      </div>


      <div className="stats-container">

        <div className="stat-box">
          <span>Total Patients</span>
          <strong>124</strong>
          <small>↑ 12 this week</small>
        </div>

        <div className="stat-box">
          <span>Appointments</span>
          <strong>48</strong>
          <small>This month</small>
        </div>

        <div className="stat-box">
          <span>Completed</span>
          <strong>42</strong>
          <small className="success-text">87.5%</small>
        </div>

        <div className="stat-box">
          <span>Critical Cases</span>
          <strong>8</strong>
          <small className="danger-text">Needs attention</small>
        </div>

      </div>


      <section className="card">

        <h2>Patient Distribution</h2>

        <div className="analytics-bars">

          <div>
            <span>Normal</span>
            <div className="bar">
              <i style={{ width: "70%" }}></i>
            </div>
            <b>70%</b>
          </div>

          <div>
            <span>Medium</span>
            <div className="bar">
              <i style={{ width: "50%" }}></i>
            </div>
            <b>50%</b>
          </div>

          <div>
            <span>High</span>
            <div className="bar">
              <i style={{ width: "35%" }}></i>
            </div>
            <b>35%</b>
          </div>

          <div>
            <span>Critical</span>
            <div className="bar">
              <i style={{ width: "20%" }}></i>
            </div>
            <b>20%</b>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Analytics;