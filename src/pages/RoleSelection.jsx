import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import SplitText from "@/components/SplitText";
import Photo from "@/components/Photo";
import BrandMark from "@/components/BrandMark";
import { CalendarCheckArt, ClipboardChartArt, StethoscopeArt } from "@/components/art/Illustrations";

const ROLES = [
  {
    role: "Patient",
    photo: "bedside",
    art: CalendarCheckArt,
    text: "Book appointments, upload reports and see what your care team shares with you.",
  },
  {
    role: "Doctor",
    photo: "doctor",
    art: StethoscopeArt,
    text: "Publish availability, see your booked appointments and manage patient records.",
  },
  {
    role: "Nurse",
    photo: "nurse",
    art: ClipboardChartArt,
    text: "Look up patient records and add care reports to a patient's file.",
  },
];

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="hero-glow min-h-screen text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft aria-hidden="true" />
            Home
          </Button>
          <Link to="/" className="flex items-center gap-3 text-foreground no-underline">
            <BrandMark />
            <span className="hidden text-base font-semibold sm:inline">PatientCare</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <SplitText as="h1" text="Who's signing in?" className="text-3xl sm:text-4xl" />
          <p className="mt-3 text-base text-muted-foreground">Choose your role to go to the right portal.</p>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ROLES.map(({ role, photo, art: Art, text }, i) => (
            <FadeIn key={role} delay={i * 0.06} className="h-full">
              <Card className="card-lift group flex h-full flex-col overflow-hidden text-center">
                <div className="relative">
                  <Photo
                    name={photo}
                    aspect={4 / 3}
                    decorative
                    sizes="(min-width: 768px) 320px, 100vw"
                    imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="icon-tile absolute -bottom-8 left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-2xl border-4 border-card bg-secondary shadow-md">
                    <Art className="h-10 w-10" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-12">
                  <h2 className="text-xl">{role}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{text}</p>
                  <Button className="mt-6 w-full" onClick={() => navigate(`/login/${role}`)}>
                    Continue as {role.toLowerCase()}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RoleSelection;
