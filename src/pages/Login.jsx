import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldHalf, User as UserIcon, BadgeCheck, Stethoscope, Plus as PlusIcon } from "lucide-react";
import { login as loginApi, signup as signupApi } from "@/Services/api";
import { useCurrentUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FadeIn from "@/components/FadeIn";
import HeroScene from "@/components/scene/HeroScene";

const ROLE_META = {
  Patient: {
    icon: UserIcon,
    description: "Access your health records, appointments and prescriptions.",
    emailPlaceholder: "Enter your patient email",
  },
  Doctor: {
    icon: Stethoscope,
    description: "Manage patients, consultations, prescriptions and reports.",
    emailPlaceholder: "Enter your doctor email",
  },
  Nurse: {
    icon: PlusIcon,
    description: "Manage patient care, tasks, appointments and alerts.",
    emailPlaceholder: "Enter your nurse email",
  },
};

const DASHBOARD_PATH = {
  Patient: "/patient/dashboard",
  Doctor: "/doctor/dashboard",
  Nurse: "/nurse/dashboard",
};

function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useCurrentUser();

  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const meta = ROLE_META[role] || ROLE_META.Patient;
  const RoleIcon = meta.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const result =
        mode === "signup"
          ? await signupApi({ name, email, password, role })
          : await loginApi({ email, password });

      if (mode === "login" && result.user.role !== role) {
        setError(`This account is registered as ${result.user.role}, not ${role}.`);
        return;
      }

      login(result.user, result.token);
      navigate(DASHBOARD_PATH[result.user.role] || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="flex w-full flex-col bg-card p-6 sm:p-10 lg:w-[55%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
              <PlusIcon className="h-5 w-5" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-none text-primary">PatientCare</h2>
              <p className="mt-1 text-[10px] text-muted-foreground">Secure Healthcare Management</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => navigate("/role")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <FadeIn className="mx-auto my-auto w-full max-w-sm py-10">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <RoleIcon className="h-6 w-6" />
          </span>

          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            {role} {mode === "signup" ? "Sign Up" : "Login"}
          </h1>

          <p className="mt-1.5 text-sm font-medium text-foreground/80">
            {mode === "signup" ? "Create your account to get started." : "Welcome back! Please login to your account."}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">{meta.description}</p>

          <Tabs
            value={mode}
            onValueChange={(next) => {
              setMode(next);
              setError("");
            }}
            className="mb-2 mt-4"
          >
            <TabsList>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-1.5">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    className="pl-9"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  placeholder={meta.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-9 pr-16"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[11px] font-bold text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="text-xs font-medium text-destructive">{error}</p>}

            <Button type="submit" size="lg" disabled={submitting} className="mt-1">
              {submitting
                ? "Please wait..."
                : mode === "signup"
                ? `Create ${role} Account`
                : `Login as ${role}`}
            </Button>
          </form>

          <div className="mt-6 flex justify-between border-t border-border pt-4">
            {[
              [Lock, "Secure", "Protected login"],
              [ShieldHalf, "Encrypted", "Data protection"],
              [BadgeCheck, "Trusted", "Secure access"],
            ].map(([Icon, title, text]) => (
              <div key={title} className="flex items-center gap-1.5 text-primary">
                <Icon className="h-4 w-4" />
                <span className="flex flex-col">
                  <strong className="text-[10px] text-foreground/80">{title}</strong>
                  <small className="text-[9px] text-muted-foreground">{text}</small>
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-light via-brand-sage to-brand-teal p-10 text-center text-brand-ink lg:flex">
        <HeroScene className="pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight">
            Your Health.
            <br />
            Our Priority.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-brand-deep">
            PatientCare provides secure access to your healthcare information anytime, anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
