import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CircleAlert, Eye, EyeOff, KeyRound, Lock, Mail, MailCheck } from "lucide-react";
import { requestPasswordReset, resetPassword } from "@/Services/api";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BrandMark from "@/components/BrandMark";
import FadeIn from "@/components/FadeIn";
import SplitText from "@/components/SplitText";
import Notice from "@/components/feedback/Notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mirrors PasswordResetService on the backend.
const MIN_PASSWORD = 8;
const RESEND_SECONDS = 60;
const ROLES = ["Patient", "Doctor", "Nurse"];

// /forgot-password?role=Patient&email=...
// Step "email": ask for a code. Step "code": enter it with a new password.
// Step "done": back to log in. The backend answers step 1 the same way
// whether or not the email has an account, and so does this page.
function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const role = ROLES.includes(searchParams.get("role")) ? searchParams.get("role") : "Patient";

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const sendCode = async () => {
    setError("");
    const trimmed = email.trim();
    if (!trimmed) {
      setError(t("Please enter your email."));
      return;
    }
    setSubmitting(true);
    try {
      await requestPasswordReset(trimmed);
      setEmail(trimmed);
      setStep("code");
      setResendIn(RESEND_SECONDS);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitReset = async () => {
    setError("");
    if (!/^\d{6}$/.test(code)) {
      setError(t("Enter the 6-digit code from the email."));
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(t("Your new password must be at least {{count}} characters.", { count: MIN_PASSWORD }));
      return;
    }
    if (password !== confirm) {
      setError(t("The two passwords don't match."));
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword({ email, code, password });
      setStep("done");
    } catch (err) {
      setError(
        err.status === 400 && /code/i.test(err.message)
          ? t("That code is invalid or has expired. Request a new one.")
          : err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (step === "email") sendCode();
    else if (step === "code") submitReset();
  };

  const loginPath = `/login/${role}?${new URLSearchParams({ email })}`;
  const errorId = error ? "reset-error" : undefined;
  const heading = {
    email: t("Forgot your password?"),
    code: t("Check your email"),
    done: t("Password updated"),
  }[step];

  return (
    <div className="page-wash pill-clearance flex min-h-screen flex-col px-4 py-6 text-foreground sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <BrandMark />
          <span className="text-base font-semibold">Beacon</span>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" onClick={() => navigate(loginPath)}>
            <ArrowLeft aria-hidden="true" />
            {t("Back to log in")}
          </Button>
        </div>
      </div>

      <FadeIn as="main" className="mx-auto my-auto w-full max-w-md py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
          <span className="glow-brand mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">
            {step === "code" ? <MailCheck aria-hidden="true" className="h-7 w-7" /> : <KeyRound aria-hidden="true" className="h-7 w-7" />}
          </span>
          <SplitText key={heading} as="h1" text={heading} className="text-3xl" />

          {step === "done" ? (
            <>
              <p className="mt-2 text-base text-muted-foreground">
                {t("You've been signed out everywhere. Log in with your new password.")}
              </p>
              <Button size="lg" className="mt-6 w-full" onClick={() => navigate(loginPath)}>
                {t("Go to log in")}
              </Button>
            </>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-2 flex flex-col gap-4">
              {step === "email" ? (
                <>
                  <p className="text-base text-muted-foreground">
                    {t("Enter the email you signed up with and we'll send you a 6-digit code to reset your password.")}
                  </p>
                  <div className="mt-2 flex flex-col gap-2">
                    <Label htmlFor="reset-email">{t("Email")}</Label>
                    <div className="relative">
                      <Mail aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        autoComplete="email"
                        className="pl-10"
                        value={email}
                        aria-describedby={errorId}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Notice tone="info" icon={MailCheck} className="mt-2">
                    {t("If an account exists for {{email}}, we've sent it a 6-digit code. It expires in 15 minutes.", { email })}
                  </Notice>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reset-code">{t("6-digit code")}</Label>
                    <Input
                      id="reset-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      className="text-center text-2xl font-semibold tracking-[0.5em]"
                      value={code}
                      aria-describedby={errorId}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reset-password">{t("New password")}</Label>
                    <div className="relative">
                      <Lock aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reset-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="pl-10 pr-24"
                        value={password}
                        aria-describedby={errorId ? `${errorId} reset-password-hint` : "reset-password-hint"}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        aria-pressed={showPassword}
                        className="absolute right-1 top-1/2 flex h-9 -translate-y-1/2 items-center gap-1 rounded-md px-3 text-sm font-semibold text-primary hover:bg-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                        {showPassword ? t("Hide") : t("Show")}
                      </button>
                    </div>
                    <p id="reset-password-hint" className="text-xs text-muted-foreground">
                      {t("At least {{count}} characters.", { count: MIN_PASSWORD })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reset-confirm">{t("Confirm new password")}</Label>
                    <div className="relative">
                      <Lock aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reset-confirm"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="pl-10"
                        value={confirm}
                        aria-describedby={errorId}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <p id="reset-error" role="alert" className="flex items-start gap-2 text-sm font-medium text-destructive">
                  <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" disabled={submitting} className="mt-2">
                {submitting ? t("Please wait…") : step === "email" ? t("Send code") : t("Reset password")}
              </Button>

              {step === "code" && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <button
                    type="button"
                    className="font-semibold text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                    disabled={resendIn > 0 || submitting}
                    onClick={sendCode}
                  >
                    {resendIn > 0 ? t("Resend code in {{seconds}}s", { seconds: resendIn }) : t("Resend code")}
                  </button>
                  <button
                    type="button"
                    className="font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    onClick={() => {
                      setStep("email");
                      setCode("");
                      setError("");
                    }}
                  >
                    {t("Use a different email")}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

export default ForgotPassword;
