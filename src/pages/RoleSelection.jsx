import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { msg } from "@/i18n";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import SplitText from "@/components/SplitText";
import Photo from "@/components/Photo";
import FloatingNav from "@/components/layout/FloatingNav";
import { CalendarCheckArt, ClipboardChartArt, StethoscopeArt } from "@/components/art/Illustrations";

const ROLES = [
  {
    role: "Patient",
    photo: "patient",
    art: CalendarCheckArt,
    text: msg("Book appointments, upload reports and see what your care team shares with you."),
  },
  {
    role: "Doctor",
    photo: "doctor",
    art: StethoscopeArt,
    text: msg("Publish availability, see your booked appointments and manage patient records."),
  },
  {
    role: "Nurse",
    photo: "nurse",
    art: ClipboardChartArt,
    text: msg("Look up patient records and add care reports to a patient's file."),
  },
];

function RoleSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const roleName = { Patient: t("Patient"), Doctor: t("Doctor"), Nurse: t("Nurse") };
  const continueAs = { Patient: t("Continue as patient"), Doctor: t("Continue as doctor"), Nurse: t("Continue as nurse") };

  return (
    <div className="marketing page-wash pill-clearance min-h-screen text-foreground">
      <div className="bg-brand pattern-dots pb-32">
      <FloatingNav links={[{ to: "/home", label: t("Home") }]}>
        <Button size="sm" variant="ghost" className="rounded-full sm:hidden" onClick={() => navigate("/home")}>
          <ArrowLeft aria-hidden="true" />
          {t("Home")}
        </Button>
      </FloatingNav>

        <FadeIn className="mx-auto max-w-2xl px-4 pt-28 text-center sm:pt-32">
          <SplitText key={t("Who's signing in?")} as="h1" text={t("Who's signing in?")} className="text-4xl sm:text-5xl" />
          <p className="mt-3 text-base text-muted-foreground">{t("Choose your role to go to the right portal.")}</p>
        </FadeIn>
      </div>

      <main className="mx-auto -mt-20 max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ROLES.map(({ role, photo, art: Art, text }, i) => (
            <FadeIn key={role} delay={i * 0.12} className="h-full">
              <Card className="card-lift photo-card flex h-full flex-col overflow-hidden text-center shadow-2xl">
                <div className="photo-card__img relative">
                  <Photo name={photo} aspect={4 / 3} decorative sizes="(min-width: 768px) 320px, 100vw" />
                  <span aria-hidden="true" className="photo-card__shade" />
                  <span className="icon-tile absolute -bottom-8 left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-2xl border-4 border-card bg-mint-soft shadow-md">
                    <Art className="h-10 w-10" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-12">
                  <h2 className="photo-card__title text-xl">{roleName[role]}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{t(text)}</p>
                  <Button className="arrow-nudge mt-6 w-full" onClick={() => navigate(`/login/${role}`)}>
                    {continueAs[role]}
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
