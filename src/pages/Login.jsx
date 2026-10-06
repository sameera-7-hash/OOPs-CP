import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldHalf, User as UserIcon, BadgeCheck, Stethoscope, Plus as PlusIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { login as loginApi, signup as signupApi } from "@/Services/api";
import { useCurrentUser } from "@/context/UserContext";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FadeIn from "@/components/FadeIn";

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

const LOGIN_HERO = {
  Patient: {
    video: "https://raw.githubusercontent.com/sameera-7-hash/Media-Assets/1f2c4dd01ecdd0d4e9437fe3aeeba75604b9ef98/patient.mp4",
    headline: ["Your Health.", "Our Priority."],
    description: "PatientCare provides secure access to your healthcare information anytime, anywhere.",
  },
  Doctor: {
    video: "https://raw.githubusercontent.com/sameera-7-hash/Media-Assets/1f2c4dd01ecdd0d4e9437fe3aeeba75604b9ef98/Doctor.mp4",
    headline: ["Precision Care.", "Empowered Decisions."],
    description: "PatientCare equips clinicians with comprehensive patient histories, efficient diagnostic tracking, and secure, real-time clinical insights anywhere.",
  },
  Nurse: {
    video: "https://raw.githubusercontent.com/sameera-7-hash/Media-Assets/1f2c4dd01ecdd0d4e9437fe3aeeba75604b9ef98/Nurse.mp4",
    headline: ["Compassionate Support.", "Connected Care."],
    description: "PatientCare empowers nursing teams with instant access to vital patient records, care plans, and seamless shift coordination at the bedside or on the go.",
  },
};

function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useCurrentUser();
  const reduceMotion = useReducedMotion();

  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const meta = ROLE_META[role] || ROLE_META.Patient;
  const hero = LOGIN_HERO[role] || LOGIN_HERO.Patient;
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
    <div className="login-page relative isolate flex min-h-screen flex-col-reverse bg-background text-foreground lg:flex-row">
      <div className="relative z-10 flex w-full flex-col bg-card/55 p-6 backdrop-blur-[2px] sm:p-10 lg:static lg:z-auto lg:w-[55%] lg:bg-card lg:backdrop-blur-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <div>
              <h2 className="text-sm font-bold leading-none text-foreground">PatientCare</h2>
              <p className="mt-1 text-[10px] text-foreground/75">Secure Healthcare Management</p>
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

          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {role} {mode === "signup" ? "Sign Up" : "Login"}
          </h1>

          <p className="mt-1.5 text-sm font-semibold text-foreground">
            {mode === "signup" ? "Create your account to get started." : "Welcome back! Please login to your account."}
          </p>

          <p className="mt-1 text-xs text-foreground/80">{meta.description}</p>

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
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70" />
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
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70" />
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
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70" />
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
                  <small className="text-[9px] text-foreground/75">{text}</small>
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-light via-brand-sage to-brand-teal p-6 text-center text-brand-ink lg:relative lg:inset-auto lg:z-auto lg:flex-1 lg:min-h-0 lg:p-10">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={hero.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/45 lg:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-br from-brand-light/25 via-brand-sage/20 to-brand-teal/25 lg:block" />
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-card/45 via-card/15 to-transparent lg:block" />
        <div className="relative z-10 hidden px-5 lg:block">
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : -36, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h2
              className="login-hero-title text-3xl leading-tight"
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {hero.headline[0]}
              <br />
              {hero.headline[1]}
            </motion.h2>
          </motion.div>
          <p className="mx-auto mt-3 max-w-sm text-sm text-brand-ink">
            {hero.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
