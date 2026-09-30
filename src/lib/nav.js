import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserPlus,
  BarChart3,
  History,
  Save,
  ListOrdered,
  AlertTriangle,
  HeartPulse,
  ListChecks,
  FileText,
  Bell,
  Home,
  Pill,
  ClipboardList,
} from "lucide-react";

// Sidebar menus for each role's DashboardShell. Centralized so every page
// in a role's section shares the exact same nav (previously each page
// file redefined its own copy of this array by hand).
export const doctorMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/doctor/dashboard" },
  { label: "Patients", icon: Users, path: "/doctor/patients" },
  { label: "Appointments", icon: CalendarDays, path: "/doctor/appointments" },
  { label: "Add Patient", icon: UserPlus, path: "/doctor/add-patient" },
  { label: "Analytics", icon: BarChart3, path: "/doctor/analytics" },
  { label: "Undo / Redo", icon: History, path: "/doctor/undo-redo" },
  { label: "Backup & Restore", icon: Save, path: "/doctor/backup-restore" },
];

export const nurseMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/nurse/dashboard" },
  { label: "Patient Queue", icon: ListOrdered, path: "/nurse/queue" },
  { label: "Priority Queue", icon: AlertTriangle, path: "/nurse/priority" },
  { label: "Vitals", icon: HeartPulse, path: "/nurse/vitals" },
  { label: "Tasks", icon: ListChecks, path: "/nurse/tasks" },
  { label: "Reports", icon: FileText, path: "/nurse/reports" },
  { label: "Alerts", icon: Bell, path: "/nurse/alerts" },
];

export const patientMenu = [
  { label: "Overview", icon: Home, path: "/patient/dashboard" },
  { label: "Appointments", icon: CalendarDays, path: "/patient/appointments" },
  { label: "My Reports", icon: FileText, path: "/patient/reports" },
  { label: "Prescriptions", icon: Pill, path: "/patient/prescriptions" },
  { label: "Medical History", icon: ClipboardList, path: "/patient/history" },
];
