import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ShieldHalf, DatabaseZap, User, Stethoscope, Plus as PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import BrandMark from "@/components/BrandMark";

const ROLES = [
  {
    role: "Patient",
    icon: User,
    text: "View your health records, appointments and prescriptions",
    tint: "bg-brand-sage/20 text-brand-teal",
  },
  {
    role: "Doctor",
    icon: Stethoscope,
    text: "Manage patients, appointments, diagnosis and prescriptions",
    tint: "bg-primary/15 text-primary",
  },
  {
    role: "Nurse",
    icon: PlusIcon,
    text: "View patient queue, vitals, tasks and care reports",
    tint: "bg-brand-teal/20 text-brand-teal",
  },
];

const SECURITY = [
  { icon: Lock, title: "End-to-End Encryption", text: "Your data is protected" },
  { icon: ShieldHalf, title: "Integrity Protected", text: "Tamper-evident records" },
  { icon: DatabaseZap, title: "Secure Backup", text: "Always have a backup" },
];

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-selection-background min-h-screen text-foreground">
      <header className="app-header flex h-16 items-center justify-between border-border bg-card px-5 sm:px-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex items-center gap-2.5">
          <BrandMark />
          <div>
            <h2 className="text-sm font-bold leading-none">PatientCare</h2>
            <p className="mt-1 text-[10px] text-muted-foreground">Secure Healthcare Management</p>
          </div>
        </div>

        <span className="hidden text-[11px] font-bold text-primary sm:inline">
          🔒 Secure • Encrypted • Trusted
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <FadeIn as="h1" className="role-selection-title text-center text-2xl font-bold sm:text-3xl">
          Select Your Role To Continue
        </FadeIn>
        <FadeIn as="p" delay={0.05} className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
          Choose your role to access your personalized dashboard.
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {ROLES.map(({ role, icon: Icon, text, tint }, i) => (
            <FadeIn key={role} delay={i * 0.1}>
              <Card className="role-selection-card group flex h-full flex-col items-center p-7 text-center transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-lg">
                <span className={`mb-4 grid h-16 w-16 place-items-center rounded-full text-2xl ${tint}`}>
                  <Icon className="h-7 w-7" />
                </span>
                <h2 className="text-lg font-bold">{role}</h2>
                <p className="mt-2 min-h-10 text-xs leading-relaxed text-muted-foreground">{text}</p>
                <Button className="mt-5 w-full" onClick={() => navigate(`/login/${role}`)}>
                  Continue as {role}
                </Button>
              </Card>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SECURITY.map(({ icon: Icon, title, text }, i) => (
            <FadeIn key={title} delay={i * 0.08}>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <strong className="block text-xs">{title}</strong>
                  <p className="text-[11px] text-muted-foreground">{text}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RoleSelection;
