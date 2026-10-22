import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BellRing, CalendarCheck, FileStack, Link2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import RevealLines from "@/components/motion/RevealLines";
import ScrollProgress from "@/components/motion/ScrollProgress";
import Magnetic from "@/components/motion/Magnetic";
import { useParallax } from "@/hooks/useParallax";
import IconTile, { TONE_CYCLE } from "@/components/IconTile";
import Photo from "@/components/Photo";
import BrandMark from "@/components/BrandMark";
import FloatingNav from "@/components/layout/FloatingNav";
import { CalendarCheckArt, ClipboardChartArt, StethoscopeArt } from "@/components/art/Illustrations";

// Everything described on this page is something the app and its C++
// backend actually do -- no invented stats, locations or services.

const ROLES = [
  {
    role: "Patient",
    photo: "patient",
    art: CalendarCheckArt,
    title: "I'm a patient",
    points: ["Book an open slot with a doctor", "Upload your own reports", "See documents your care team shares"],
  },
  {
    role: "Doctor",
    photo: "doctor",
    art: StethoscopeArt,
    title: "I'm a doctor",
    points: ["Publish your available time slots", "See who has booked with you", "Add and review encrypted patient records"],
  },
  {
    role: "Nurse",
    photo: "nurse",
    art: ClipboardChartArt,
    title: "I'm a nurse",
    points: ["Look up patient records", "Write care reports for a patient", "Attach files to a patient's record"],
  },
];

const STEPS = [
  {
    title: "Create your account",
    text: "Choose your role and sign up with an email and password. Each role gets its own portal.",
  },
  {
    title: "Book an open slot",
    text: "Doctors publish the times they're free. Patients pick a date and one of those open slots.",
  },
  {
    title: "Stay in the loop",
    text: "A booking sends a reminder to the patient, the doctor and nursing staff. Reports live on the patient's record.",
  },
];

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Slot-checked booking",
    text: "Patients can only book times a doctor has opened, and a slot that's already taken is refused.",
  },
  {
    icon: ShieldCheck,
    title: "Encrypted records",
    text: "Each patient record is encrypted at rest with AES-256, or DES for comparison.",
  },
  {
    icon: Link2,
    title: "Tamper-evident storage",
    text: "Records sit in an append-only hash chain, so an edit anywhere in history is detected.",
  },
  {
    icon: FileStack,
    title: "Shared reports",
    text: "Patients upload documents and nurses add care reports, visible to the patient and their doctor.",
  },
  {
    icon: BellRing,
    title: "Booking reminders",
    text: "Booking an appointment notifies the patient, the doctor and nursing staff.",
  },
];

function SiteHeader() {
  const navigate = useNavigate();
  return (
    <FloatingNav
      links={[
        { href: "#how", label: "How it works" },
        { href: "#features", label: "Features" },
      ]}
    >
      <Button size="sm" className="rounded-full" onClick={() => navigate("/role")}>
        Log in
      </Button>
    </FloatingNav>
  );
}

// A small label under the hero actions. Each one names a real feature;
// none of them shows invented numbers.
function FeatureChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 text-sm font-semibold shadow-md backdrop-blur">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary bg-primary-gradient text-primary-foreground">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      {children}
    </span>
  );
}

// Full-bleed photo hero (after agio-style-animations.html): the photo
// settles from a slow zoom-out once loaded and drifts at a slower speed
// than the page (parallax); the headline reveals line by line from behind
// a mask; a looping line cues the scroll. A light wash, not a dark
// overlay, keeps the dark text readable over the photo.
function Hero() {
  const navigate = useNavigate();
  const parallaxRef = useParallax(0.3);
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-border">
      {/* Parallax only ever moves the photo down, so it needs overscan at
          the bottom only; anchoring the top keeps heads in frame. */}
      <div ref={parallaxRef} className="parallax-layer absolute inset-x-0 -bottom-[30%] top-0">
        <Photo
          name="hero"
          aspect={3 / 2}
          priority
          sizes="100vw"
          className="hero-zoom absolute inset-0 h-full w-full"
          imgClassName="object-[68%_0%]"
        />
      </div>
      <div aria-hidden="true" className="hero-wash absolute inset-0" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-28 pt-28 sm:px-6 sm:pt-32">
        <div className="max-w-xl">
          <FadeIn as="span" className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1 text-sm font-medium text-accent-foreground shadow-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-coral" />
            Clinic appointments and patient records
          </FadeIn>
          <RevealLines
            id="hero-title"
            className="text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
            lines={["Calm, organised care,", "from booking", "to records."]}
            lineClassNames={["", "text-primary", "text-primary"]}
            delay={0.15}
          />
          <FadeIn as="p" delay={0.6} className="mt-6 text-lg text-foreground/80">
            PatientCare connects patients, doctors and nurses. Book a doctor&apos;s real open slots, share reports
            with the care team, and keep every record encrypted and tamper-evident.
          </FadeIn>
          <FadeIn delay={0.75} className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button size="lg" className="pulse-once arrow-nudge" onClick={() => navigate("/role")}>
                Get started
                <ArrowRight aria-hidden="true" />
              </Button>
            </Magnetic>
            <Button size="lg" variant="outline" className="btn-sweep" asChild>
              <a href="#how">How it works</a>
            </Button>
          </FadeIn>
          <FadeIn delay={0.9} className="mt-8 flex flex-wrap gap-3">
            <FeatureChip icon={CalendarCheck}>Only open slots can be booked</FeatureChip>
            <FeatureChip icon={Lock}>Records encrypted at rest</FeatureChip>
          </FadeIn>
        </div>
      </div>

      <span aria-hidden="true" className="scroll-cue" />
    </section>
  );
}

function RoleGateway() {
  const navigate = useNavigate();
  return (
    <section aria-labelledby="roles-title" className="page-wash px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-10 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Choose your portal</span>
          <h2 id="roles-title" className="mt-2 text-3xl">One system, a portal for each role</h2>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ROLES.map(({ role, photo, art: Art, title, points }, i) => (
            <FadeIn key={role} delay={i * 0.06} className="h-full">
              <Card className="card-lift photo-card flex h-full flex-col overflow-hidden">
                <div className="photo-card__img relative">
                  <Photo name={photo} aspect={16 / 10} decorative sizes="(min-width: 768px) 360px, 100vw" />
                  <span aria-hidden="true" className="photo-card__shade" />
                  <span
                    aria-hidden="true"
                    className="photo-card__tag absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-semibold text-accent-foreground shadow-md"
                  >
                    {role} portal
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="icon-tile absolute -bottom-7 left-6 grid h-14 w-14 place-items-center rounded-xl border-4 border-card bg-mint-soft shadow-md">
                    <Art className="h-9 w-9" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-10 sm:px-8 sm:pb-8">
                  <h3 className="photo-card__title text-xl">{title}</h3>
                  <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                    {points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="btn-sweep arrow-nudge mt-6 w-full" onClick={() => navigate(`/login/${role}`)}>
                    Continue as {role.toLowerCase()}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-24 border-y border-primary/15 bg-secondary px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
        <FadeIn variant="clip" className="hidden overflow-hidden rounded-3xl lg:block">
          <Photo name="reception" aspect={4 / 5} sizes="420px" className="rounded-3xl shadow-xl" />
        </FadeIn>

        <div>
          <FadeIn className="mb-10 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</span>
            <h2 id="how-title" className="mt-2 text-3xl">Three steps to a booked appointment</h2>
          </FadeIn>

          <ol className="relative flex flex-col gap-8 before:absolute before:bottom-5 before:left-5 before:top-5 before:w-px before:bg-primary/30">
            {STEPS.map(({ title, text }, i) => (
              <FadeIn as="li" key={title} variant="fade-left" delay={i * 0.12} className="relative flex gap-5">
                <span
                  aria-hidden="true"
                  className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary bg-primary-gradient text-base font-semibold text-primary-foreground shadow-primary ring-4 ring-secondary"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg">
                    <span className="sr-only">Step {i + 1}: </span>
                    {title}
                  </h3>
                  <p className="mt-1 text-base text-foreground/80">{text}</p>
                </div>
              </FadeIn>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-10 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">What it does</span>
          <h2 id="features-title" className="mt-2 text-3xl">Built around how a clinic actually runs</h2>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <FadeIn key={title} delay={(i % 3) * 0.1}>
              <div className="card-lift flex h-full gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                <IconTile icon={Icon} tone={TONE_CYCLE[i % TONE_CYCLE.length]} />
                <div>
                  <h3 className="text-base">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="bg-brand pattern-dots mt-12 grid overflow-hidden rounded-2xl border border-primary/15 shadow-md md:grid-cols-2">
          <FadeIn variant="clip" className="md:h-full">
            <Photo name="records" aspect={3 / 2} sizes="(min-width: 768px) 560px, 100vw" className="md:h-full" />
          </FadeIn>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">About this project</span>
            <h3 className="mt-2 text-2xl">An OOP course project, built end to end</h3>
            <p className="mt-3 text-base text-muted-foreground">
              A React frontend talking to a C++ REST API. The backend swaps encryption algorithms per record using
              the Strategy pattern and keeps patient data in an append-only, hash-chained store.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="marketing min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <RoleGateway />
        <HowItWorks />
        <Features />
      </main>
      <footer className="accent-top pill-clearance border-t border-border bg-card px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2 font-semibold text-foreground">
            <BrandMark className="h-7 w-7" />
            PatientCare
          </span>
          <span>
            Clinic appointment and records system · Photos from{" "}
            <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-primary underline">
              Unsplash
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
