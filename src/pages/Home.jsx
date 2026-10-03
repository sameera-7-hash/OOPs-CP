import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  ShieldCheck,
  Link2,
  Users,
  CalendarCheck,
  UploadCloud,
  BellRing,
  Lock,
  ShieldHalf,
  BadgeCheck,
  ArrowRight,
  Plus,
  Building2,
  Waves,
  Landmark,
  Castle,
  Grape,
  Wheat,
  Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import FadeIn from "@/components/FadeIn";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "AES-256 & DES Encryption",
    text: "Every patient record is encrypted at rest, with a legacy cipher included side-by-side for a security comparison.",
    gradient: "deep",
  },
  {
    icon: Link2,
    title: "Tamper-Evident Hash Chain",
    text: "Each record links cryptographically to the one before it — an edit anywhere in history is instantly detectable.",
    gradient: "green",
    animate: "float",
  },
  {
    icon: Users,
    title: "Three Role-Based Portals",
    text: "Purpose-built dashboards for doctors, nurses and patients, each seeing exactly what they need — and nothing else.",
    gradient: "sage",
  },
  {
    icon: CalendarCheck,
    title: "Live Appointment Booking",
    text: "Doctors publish real availability; patients book real open slots — no double-booking, ever.",
    gradient: "amber",
  },
  {
    icon: UploadCloud,
    title: "Secure Document Sharing",
    text: "Patients upload reports, nurses attach care notes — instantly visible to the right people, and no one else.",
    gradient: "rose",
  },
  {
    icon: BellRing,
    title: "Real-Time Reminders",
    text: "Booking an appointment notifies the patient, the doctor and nursing staff the moment it's confirmed.",
    gradient: "deep",
    animate: "pulse",
  },
];

const CLINICS = [
  { city: "Bangalore", icon: Building2 },
  { city: "Chennai", icon: Waves },
  { city: "Delhi", icon: Landmark },
  { city: "Hyderabad", icon: Castle },
  { city: "Kolkata", icon: Landmark },
  { city: "Mumbai", icon: Building2 },
  { city: "Mysore", icon: Castle },
  { city: "Nashik", icon: Grape },
  { city: "Pune", icon: Landmark },
  { city: "Punjab", icon: Wheat },
  { city: "Tirupati", icon: Landmark },
  { city: "Vishakapatnam", icon: Anchor },
];

const SECURITY_STRIP = [
  { icon: Lock, title: "Secure", text: "Your information is protected" },
  { icon: ShieldHalf, title: "Encrypted", text: "Healthcare data stays protected" },
  { icon: BadgeCheck, title: "Trusted", text: "Designed for secure healthcare" },
];

function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      heroRef.current.querySelectorAll("[data-hero]"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }
    );
    return () => tl.kill();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="app-header sticky top-3 z-30 flex h-16 items-center justify-between border-border bg-background/80 px-5 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
            <Plus className="h-5 w-5" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none">PatientCare</h2>
            <p className="mt-1 text-[10px] text-muted-foreground">Secure Healthcare Management</p>
          </div>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          <a href="#about" className="hidden text-xs font-medium text-muted-foreground hover:text-foreground sm:inline">
            About Project
          </a>
          <a href="#features" className="hidden text-xs font-medium text-muted-foreground hover:text-foreground sm:inline">
            Features
          </a>
          <Button size="sm" variant="accent" onClick={() => navigate("/role")}>
            Login
          </Button>
        </nav>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section
          ref={heroRef}
          className="home-hero relative overflow-hidden px-5 py-20 text-brand-ink sm:px-8 sm:py-28"
        >
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl text-center lg:text-left">
              <span
                data-hero
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-deep/20 bg-white/30 px-4 py-1.5 text-[11px] font-semibold text-brand-ink"
              >
                <Lock className="h-3.5 w-3.5" />
                Secure Healthcare Platform
              </span>

              <h1 data-hero className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Welcome To <span className="text-brand-ink">PatientCare</span>
              </h1>

              <h2 data-hero className="mt-3 text-xl font-semibold text-brand-ink sm:text-2xl">
                Your Health, Your Priority
              </h2>

              <p data-hero className="mt-4 text-sm leading-relaxed text-brand-deep/90 sm:text-base">
                A secure and reliable healthcare management platform designed to connect
                patients, doctors and nurses in one place.
              </p>

              <div data-hero className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button size="lg" variant="accent" onClick={() => navigate("/role")}>
                  Login to PatientCare
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-brand-deep/40 text-brand-ink hover:bg-white/20" asChild>
                  <a href="#about">Learn More</a>
                </Button>
              </div>
            </div>

            <FadeIn delay={0.3} className="w-full max-w-md flex-shrink-0 lg:w-[26rem]">
              <span                             className="mb-4 block text-center text-[11px] font-bold uppercase tracking-widest text-brand-ink lg:text-left">
                Our Services
              </span>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {SERVICES.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-brand-deep/15 bg-white/20 p-2.5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-brand-deep/40 hover:bg-white/40 sm:p-3"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/30 text-brand-deep transition-colors duration-200 group-hover:bg-brand-sage group-hover:text-brand-deep sm:h-10 sm:w-10">
                        <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </span>
                      <span className="text-[9px] font-semibold leading-tight text-brand-ink sm:text-[10px]">
                        {service.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ================= SECURITY STRIP ================= */}
        <section className="flex flex-wrap items-center justify-center gap-8 border-b border-border bg-card px-5 py-6 sm:gap-16">
          {SECURITY_STRIP.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <strong className="block text-xs">{title}</strong>
                <p className="text-[11px] text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <FadeIn as="span" className="mb-3 block text-[11px] font-bold uppercase tracking-widest text-primary">
              About This Project
            </FadeIn>
            <FadeIn as="h2" delay={0.05} className="text-2xl font-bold sm:text-3xl">
              A Full-Stack Clinic System, Built to Demonstrate Real OOP Design
            </FadeIn>
            <FadeIn as="p" delay={0.1} className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              PatientCare pairs a React frontend with a C++ REST API. The backend uses the
              Strategy pattern to swap encryption algorithms per record, keeps patient data in
              an append-only, hash-chained store so tampering anywhere in history is detectable,
              and exposes accounts, appointments, document sharing and live reminders — all
              wired end-to-end into the dashboards below.
            </FadeIn>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["3", "Role-based portals"],
                ["2", "Encryption algorithms"],
                ["C++", "REST backend"],
                ["0", "Double-booked slots"],
              ].map(([value, label], i) => (
                <FadeIn key={label} delay={i * 0.08}>
                  <Card className="py-6">
                    <strong className="block text-2xl font-bold text-primary">{value}</strong>
                    <span className="mt-1 block text-[11px] text-muted-foreground">{label}</span>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="bg-muted/40 px-5 py-16 sm:px-8 sm:py-20">
          <FadeIn as="span" className="mb-3 block text-center text-[11px] font-bold uppercase tracking-widest text-primary">
            The Chain of Trust
          </FadeIn>
          <FadeIn as="h2" delay={0.05} className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            What Powers PatientCare
          </FadeIn>
          <FadeIn
            as="p"
            delay={0.1}
            className="mx-auto mb-14 max-w-xl text-center text-xs leading-relaxed text-muted-foreground sm:text-sm"
          >
            Six links, one ledger — every feature below is a block in the same
            tamper-evident chain that holds your records.
          </FadeIn>

          <div className="relative mx-auto max-w-4xl">
            <div
              aria-hidden="true"
              className="absolute inset-y-2 left-6 w-0 border-l-2 border-dashed border-primary/25 sm:left-1/2"
            />

            <div className="space-y-10 sm:space-y-14">
              {FEATURES.map(({ icon: Icon, title, text, gradient, animate }, i) => {
                const flip = i % 2 === 1;
                return (
                  <FadeIn
                    key={title}
                    delay={i * 0.08}
                    className="relative flex items-start gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6"
                  >
                    <div className="relative z-10 order-first shrink-0 sm:order-0 sm:col-start-2">
                      <AnimatedIcon icon={Icon} gradient={gradient} animate={animate} className="ring-4 ring-muted/40" />
                    </div>

                    <Card
                      className={cn(
                        "min-w-0 flex-1 p-5",
                        flip ? "sm:col-start-3 sm:text-left" : "sm:col-start-1 sm:text-right"
                      )}
                    >
                      <span className="text-[10px] font-bold tracking-widest text-primary/50">
                        BLOCK {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 text-sm font-bold">{title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CLINIC NETWORK ================= */}
        <section id="clinics" className="px-5 py-16 sm:px-8 sm:py-20">
          <FadeIn as="h2" className="mb-10 text-center text-2xl font-bold sm:text-3xl">
            Our Clinic <span className="font-extrabold text-primary">Network</span>
          </FadeIn>

          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CLINICS.map(({ city, icon: Icon }, i) => (
              <FadeIn key={city} delay={i * 0.05}>
                <Card className="group flex flex-col items-center gap-3 p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-semibold">{city}</span>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
