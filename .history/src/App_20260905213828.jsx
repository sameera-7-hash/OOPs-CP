import React, { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/Appointments";
import MedicalRecords from "./pages/patient/MedicalRecords";
import Prescriptions from "./pages/patient/Prescriptions";
import MedicalHistory from "./pages/patient/MedicalHistory";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Patients from "./pages/doctor/Patients";
import AddPatient from "./pages/doctor/AddPatient";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorAppointments from "./pages/doctor/Appointments";
import Analytics from "./pages/doctor/Analytics";
import UndoRedo from "./pages/doctor/UndoRedo";
import BackupRestore from "./pages/doctor/BackupRestore";

import NurseDashboard from "./pages/nurse/NurseDashboard";
import PatientQueue from "./pages/nurse/PatientQueue";
import PriorityQueue from "./pages/nurse/PriorityQueue";
import Vitals from "./pages/nurse/Vitals";
import Tasks from "./pages/nurse/Tasks";
import Alerts from "./pages/nurse/Alerts";
function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState(null);

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setPage("login");
  };

  const login = () => {
    if (role === "Patient") setPage("patient-dashboard");
    if (role === "Doctor") setPage("doctor-dashboard");
    if (role === "Nurse") setPage("nurse-dashboard");
  };

  const logout = () => {
    setRole(null);
    setPage("home");
  };

  const navigate = (newPage) => {
    setPage(newPage);
  };

  if (page === "home") {
  return (
    <Home
      onLogin={() => setPage("role-selection")}
    />
  );
}

if (page === "role-selection") {
  return (
    <RoleSelection
      onSelectRole={selectRole}
      onBack={() => setPage("home")}
    />
  );
}

  if (page === "login") {
    return (
      <Login
        role={role}
        onLogin={login}
        onBack={() => setPage("home")}
      />
    );
  }

  /* ================= PATIENT ================= */

  if (page === "patient-dashboard") {
    return (
      <PatientDashboard
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "patient-appointments") {
    return (
      <PatientAppointments
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "medical-records") {
    return (
      <MedicalRecords
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "prescriptions") {
    return (
      <Prescriptions
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "medical-history") {
    return (
      <MedicalHistory
        navigate={navigate}
        logout={logout}
      />
    );
  }

  /* ================= DOCTOR ================= */

  if (page === "doctor-dashboard") {
    return (
      <DoctorDashboard
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "doctor-patients") {
    return (
      <Patients
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "add-patient") {
    return (
      <AddPatient
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "patient-details") {
    return (
      <PatientDetails
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "doctor-appointments") {
    return (
      <DoctorAppointments
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "analytics") {
    return (
      <Analytics
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "undo-redo") {
    return (
      <UndoRedo
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "backup-restore") {
    return (
      <BackupRestore
        navigate={navigate}
        logout={logout}
      />
    );
  }

  /* ================= NURSE ================= */

  if (page === "nurse-dashboard") {
    return (
      <NurseDashboard
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "patient-queue") {
    return (
      <PatientQueue
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "priority-queue") {
    return (
      <PriorityQueue
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "vitals") {
    return (
      <Vitals
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "tasks") {
    return (
      <Tasks
        navigate={navigate}
        logout={logout}
      />
    );
  }

  if (page === "alerts") {
    return (
      <Alerts
        navigate={navigate}
        logout={logout}
      />
    );
  }

  return null;
}

export default App;