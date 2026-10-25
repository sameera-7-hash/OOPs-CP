import React, { Suspense, lazy, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserContext } from "./context/UserContext";
import { logout as logoutApi } from "./Services/api";
import ProtectedRoute from "./components/ProtectedRoute";
import ServerStatus from "./components/feedback/ServerStatus";
import { ToastProvider } from "./context/ToastContext";
import { EmergencyProvider } from "./components/emergency/Emergency";

// Home is loaded eagerly for the fastest first paint; every other page
// is its own chunk, fetched when its route is first visited.
import Home from "./pages/Home";
const Login = lazy(() => import("./pages/Login"));
const RoleSelection = lazy(() => import("./pages/RoleSelection"));

const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard"));
const PatientAppointments = lazy(() => import("./pages/patient/Appointments"));
const MedicalRecords = lazy(() => import("./pages/patient/MedicalRecords"));
const Prescriptions = lazy(() => import("./pages/patient/Prescriptions"));
const MedicalHistory = lazy(() => import("./pages/patient/MedicalHistory"));

const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard"));
const Patients = lazy(() => import("./pages/doctor/Patients"));
const AddPatient = lazy(() => import("./pages/doctor/AddPatient"));
const PatientDetails = lazy(() => import("./pages/doctor/PatientDetails"));
const DoctorAppointments = lazy(() => import("./pages/doctor/Appointments"));
const Analytics = lazy(() => import("./pages/doctor/Analytics"));
const UndoRedo = lazy(() => import("./pages/doctor/UndoRedo"));
const BackupRestore = lazy(() => import("./pages/doctor/BackupRestore"));

const NurseDashboard = lazy(() => import("./pages/nurse/NurseDashboard"));
const NursePatients = lazy(() => import("./pages/nurse/Patients"));
const PatientQueue = lazy(() => import("./pages/nurse/PatientQueue"));
const PriorityQueue = lazy(() => import("./pages/nurse/PriorityQueue"));
const Vitals = lazy(() => import("./pages/nurse/Vitals"));
const Tasks = lazy(() => import("./pages/nurse/Tasks"));
const Alerts = lazy(() => import("./pages/nurse/Alerts"));
const NurseReports = lazy(() => import("./pages/nurse/Reports"));

const ConditionGuidance = lazy(() => import("./pages/ConditionGuidance"));
const DoctorDirectory = lazy(() => import("./pages/DoctorDirectory"));

function PageFallback() {
  const { t } = useTranslation();
  return (
    <div role="status" className="grid min-h-screen place-items-center bg-background">
      <span className="sr-only">{t("Loading page…")}</span>
      <LoaderCircle aria-hidden="true" className="h-8 w-8 animate-spin text-primary motion-reduce:animate-none" />
    </div>
  );
}

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
      <ToastProvider>
        <BrowserRouter>
          <EmergencyProvider>
          <ServerStatus />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/role" element={<RoleSelection />} />
              <Route path="/login/:role" element={<Login />} />

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

              {/* ================= ANY SIGNED-IN ROLE ================= */}
              <Route path="/guidance" element={<ProtectedRoute roles={["Patient", "Doctor", "Nurse"]}><ConditionGuidance /></ProtectedRoute>} />
              <Route path="/doctors" element={<ProtectedRoute roles={["Patient", "Doctor", "Nurse"]}><DoctorDirectory /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          </EmergencyProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
