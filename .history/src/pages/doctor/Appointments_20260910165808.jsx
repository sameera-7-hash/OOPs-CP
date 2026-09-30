import React from "react";
import { DoctorLayout } from "./DoctorDashboard";

function Appointments({ navigate, logout }) {

  return (
    <DoctorLayout
      active="doctor-appointments"
      navigate={navigate}
      logout={logout}
      menu={doctorMenu}
    >

      <div className="page-heading">

        <h1>Today's Appointments</h1>

        <p>Manage your consultation schedule.</p>

      </div>

      <div className="panel">

        <table className="data-table">

          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>09:00 AM</td>
              <td>Amit Sharma</td>
              <td>Follow-up</td>
              <td><span className="status blue">Scheduled</span></td>
              <td><button className="small-button">Start</button></td>
            </tr>

            <tr>
              <td>10:30 AM</td>
              <td>Neha Verma</td>
              <td>Consultation</td>
              <td><span className="status blue">Scheduled</span></td>
              <td><button className="small-button">Start</button></td>
            </tr>

            <tr>
              <td>12:00 PM</td>
              <td>Ravi Patel</td>
              <td>Checkup</td>
              <td><span className="status green">Completed</span></td>
              <td><button className="small-button">View</button></td>
            </tr>

            <tr>
              <td>04:30 PM</td>
              <td>Sneha Iyer</td>
              <td>Review</td>
              <td><span className="status blue">Scheduled</span></td>
              <td><button className="small-button">Start</button></td>
            </tr>

          </tbody>

        </table>

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

export default Appointments;