import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CircleAlert, Eye, EyeOff, Lock, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { login as loginApi, signup as signupApi } from "@/Services/api";
import { useCurrentUser } from "@/context/UserContext";
import { safeNextPath } from "@/lib/navigation";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FadeIn from "@/components/FadeIn";
import Photo from "@/components/Photo";
import SplitText from "@/components/SplitText";
import { CalendarCheckArt, ClipboardChartArt, EcgLine, StethoscopeArt } from "@/components/art/Illustrations";

const ROLE_META = {
  Patient: {
    photo: "bedside",
    art: CalendarCheckArt,
    description: "Book appointments and see your reports.",
    emailPlaceholder: "you@example.com",
    headline: "Your appointments and reports, in one place.",
  },
  Doctor: {
    photo: "doctor",
    art: StethoscopeArt,
    description: "Manage your availability, appointments and patient records.",
    emailPlaceholder: "doctor@example.com",
    headline: "Your schedule and patient records, ready when you are.",
  },
  Nurse: {
    photo: "nurse",
    art: ClipboardChartArt,
    description: "Look up patient records and add care reports.",
    emailPlaceholder: "nurse@example.com",
    headline: "Patient records and care reports, at hand.",
  },
};

const DASHBOARD_PATH = {
  Patient: "/patient/dashboard",
  Doctor: "/doctor/dashboard",
  Nurse: "/nurse/dashboard",
};

function Login() {
  const { role } = useParams();
  const [searchParams] = useSearchParams();
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
  const Art = meta.art;

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
      // ?next= is set by ProtectedRoute for Patient-only links (e.g. a
      // prefilled booking); anything off-site or unsafe is ignored.
      const next = safeNextPath(searchParams.get("next"), window.location.origin);
      navigate(next || DASHBOARD_PATH[result.user.role] || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const errorId = error ? "login-error" : undefined;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="pill-clearance flex w-full flex-col bg-card px-4 py-6 sm:px-10 lg:w-1/2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="text-base font-semibold">PatientCare</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/role")}>
            <ArrowLeft aria-hidden="true" />
            Change role
          </Button>
        </div>

        <FadeIn as="main" className="mx-auto my-auto w-full max-w-sm py-10">
          <Art className="mb-6 h-14 w-14" />
          <SplitText
            key={`${role}-${mode}`}
            as="h1"
            text={`${role} ${mode === "signup" ? "sign up" : "log in"}`}
            className="text-3xl"
          />
          <p className="mt-2 text-base text-muted-foreground">
            {mode === "signup" ? "Create your account to get started. " : "Welcome back. "}
            {meta.description}
          </p>

          <Tabs
            value={mode}
            onValueChange={(next) => {
              setMode(next);
              setError("");
            }}
            className="mt-6"
          >
            <TabsList aria-label="Log in or create an account">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <UserIcon aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="pl-10"
                    value={name}
                    aria-describedby={errorId}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="pl-10"
                  placeholder={meta.emailPlaceholder}
                  value={email}
                  aria-describedby={errorId}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="pl-10 pr-24"
                  value={password}
                  aria-describedby={errorId}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-pressed={showPassword}
                  className="absolute right-1 top-1/2 flex h-9 -translate-y-1/2 items-center gap-1 rounded-md px-3 text-sm font-semibold text-primary hover:bg-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p id="login-error" role="alert" className="flex items-start gap-2 text-sm font-medium text-destructive">
                <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="mt-2">
              {submitting ? "Please wait…" : mode === "signup" ? `Create ${role.toLowerCase()} account` : `Log in as ${role.toLowerCase()}`}
            </Button>
          </form>

          <p className="mt-6 flex items-start gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Patient records are stored encrypted on the clinic server.
          </p>
        </FadeIn>
      </div>

      <aside aria-hidden="true" className="bg-brand relative hidden flex-1 overflow-hidden lg:block">
        <Photo name={meta.photo} decorative priority aspect={2 / 3} sizes="50vw" className="absolute inset-0 h-full w-full" />
        {/* Deep-teal wash keeps the headline readable over any photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-mint-soft via-mint-soft/80 to-transparent" />
        <EcgLine className="ecg-glow absolute inset-x-0 bottom-40 h-24 w-full" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <span className="glow-brand mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-card">
            <Art className="h-11 w-11" />
          </span>
          <p className="max-w-md text-3xl font-semibold leading-snug text-foreground">{meta.headline}</p>
        </div>
      </aside>
    </div>
  );
}

export default Login;
