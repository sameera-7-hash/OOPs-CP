import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { logout as logoutApi } from "./Services/api";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomCursor from "./components/CustomCursor";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import ServiceDetail from "./pages/ServiceDetail";

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
import NursePatients from "./pages/nurse/Patients";
import PatientQueue from "./pages/nurse/PatientQueue";
import PriorityQueue from "./pages/nurse/PriorityQueue";
import Vitals from "./pages/nurse/Vitals";
import Tasks from "./pages/nurse/Tasks";
import Alerts from "./pages/nurse/Alerts";
import NurseReports from "./pages/nurse/Reports";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem("pc_user");
    // A user record with no matching token (e.g. leftover from before
    // sessions existed) isn't usable -- treat it as logged out.
    if (raw && !localStorage.getItem("pc_token")) return null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  // Applied once so the chosen theme is visible even on the Home/Login
  // screens, not just after a dashboard (with its own ThemeToggle) mounts.
  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", localStorage.getItem("pc_theme_v2") || "light");
    } catch {
      // ignore
    }
  }, []);

  // Called by Login with the { user, token } object /api/auth/login or
  // /api/auth/signup returned.
  const login = (authedUser, token) => {
    setUser(authedUser);
    try {
      localStorage.setItem("pc_user", JSON.stringify(authedUser));
      localStorage.setItem("pc_token", token);
    } catch {
      // Private browsing / blocked storage -- session just won't persist.
    }
  };

  const logout = () => {
    logoutApi(); // best-effort server-side invalidate; fire-and-forget
    setUser(null);
    try {
      localStorage.removeItem("pc_user");
      localStorage.removeItem("pc_token");
    } catch {
      // ignore
    }
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/role" element={<RoleSelection />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />

          {/* ================= PATIENT ================= */}
          <Route path="/patient/dashboard" element={<ProtectedRoute role="Patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute role="Patient"><PatientAppointments /></ProtectedRoute>} />
          <Route path="/patient/reports" element={<ProtectedRoute role="Patient"><MedicalRecords /></ProtectedRoute>} />
          <Route path="/patient/prescriptions" element={<ProtectedRoute role="Patient"><Prescriptions /></ProtectedRoute>} />
          <Route path="/patient/history" element={<ProtectedRoute role="Patient"><MedicalHistory /></ProtectedRoute>} />

          {/* ================= DOCTOR ================= */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute role="Doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/patients" element={<ProtectedRoute role="Doctor"><Patients /></ProtectedRoute>} />
          <Route path="/doctor/patients/:id" element={<ProtectedRoute role="Doctor"><PatientDetails /></ProtectedRoute>} />
          <Route path="/doctor/add-patient" element={<ProtectedRoute role="Doctor"><AddPatient /></ProtectedRoute>} />
          <Route path="/doctor/appointments" element={<ProtectedRoute role="Doctor"><DoctorAppointments /></ProtectedRoute>} />
          <Route path="/doctor/analytics" element={<ProtectedRoute role="Doctor"><Analytics /></ProtectedRoute>} />
          <Route path="/doctor/undo-redo" element={<ProtectedRoute role="Doctor"><UndoRedo /></ProtectedRoute>} />
          <Route path="/doctor/backup-restore" element={<ProtectedRoute role="Doctor"><BackupRestore /></ProtectedRoute>} />

          {/* ================= NURSE ================= */}
          <Route path="/nurse/dashboard" element={<ProtectedRoute role="Nurse"><NurseDashboard /></ProtectedRoute>} />
          <Route path="/nurse/patients" element={<ProtectedRoute role="Nurse"><NursePatients /></ProtectedRoute>} />
          <Route path="/nurse/queue" element={<ProtectedRoute role="Nurse"><PatientQueue /></ProtectedRoute>} />
          <Route path="/nurse/priority" element={<ProtectedRoute role="Nurse"><PriorityQueue /></ProtectedRoute>} />
          <Route path="/nurse/vitals" element={<ProtectedRoute role="Nurse"><Vitals /></ProtectedRoute>} />
          <Route path="/nurse/tasks" element={<ProtectedRoute role="Nurse"><Tasks /></ProtectedRoute>} />
          <Route path="/nurse/alerts" element={<ProtectedRoute role="Nurse"><Alerts /></ProtectedRoute>} />
          <Route path="/nurse/reports" element={<ProtectedRoute role="Nurse"><NurseReports /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
