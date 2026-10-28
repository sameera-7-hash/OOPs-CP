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
  BookOpenCheck,
  Stethoscope,
  Building2,
} from "lucide-react";
import { msg } from "@/i18n";

// Sidebar menus for each role's DashboardShell. Centralized so every page
// in a role's section shares the exact same nav (previously each page
// file redefined its own copy of this array by hand). Labels are English
// keys; DashboardShell translates them when it renders.
export const doctorMenu = [
  { label: msg("Dashboard"), icon: LayoutDashboard, path: "/doctor/dashboard" },
  { label: msg("Patients"), icon: Users, path: "/doctor/patients" },
  { label: msg("Appointments"), icon: CalendarDays, path: "/doctor/appointments" },
  { label: msg("Add Patient"), icon: UserPlus, path: "/doctor/add-patient" },
  { label: msg("Analytics"), icon: BarChart3, path: "/doctor/analytics" },
  { label: msg("Undo / Redo"), icon: History, path: "/doctor/undo-redo" },
  { label: msg("Backup & Restore"), icon: Save, path: "/doctor/backup-restore" },
  { label: msg("Condition guidance"), icon: BookOpenCheck, path: "/guidance" },
  { label: msg("Doctor directory"), icon: Stethoscope, path: "/doctors" },
  { label: msg("My clinic"), icon: Building2, path: "/doctor/profile" },
];

export const nurseMenu = [
  { label: msg("Dashboard"), icon: LayoutDashboard, path: "/nurse/dashboard" },
  { label: msg("Patients"), icon: Users, path: "/nurse/patients" },
  { label: msg("Patient Queue"), icon: ListOrdered, path: "/nurse/queue" },
  { label: msg("Priority Queue"), icon: AlertTriangle, path: "/nurse/priority" },
  { label: msg("Vitals"), icon: HeartPulse, path: "/nurse/vitals" },
  { label: msg("Tasks"), icon: ListChecks, path: "/nurse/tasks" },
  { label: msg("Reports"), icon: FileText, path: "/nurse/reports" },
  { label: msg("Alerts"), icon: Bell, path: "/nurse/alerts" },
  { label: msg("Condition guidance"), icon: BookOpenCheck, path: "/guidance" },
  { label: msg("Doctor directory"), icon: Stethoscope, path: "/doctors" },
];

export const patientMenu = [
  { label: msg("Overview"), icon: Home, path: "/patient/dashboard" },
  { label: msg("Appointments"), icon: CalendarDays, path: "/patient/appointments" },
  { label: msg("My Reports"), icon: FileText, path: "/patient/reports" },
  { label: msg("Prescriptions"), icon: Pill, path: "/patient/prescriptions" },
  { label: msg("Medical History"), icon: ClipboardList, path: "/patient/history" },
  { label: msg("Condition guidance"), icon: BookOpenCheck, path: "/guidance" },
  { label: msg("Doctor directory"), icon: Stethoscope, path: "/doctors" },
];
