import {
  Video,
  Microscope,
  ClipboardCheck,
  Smile,
  Activity,
  BedDouble,
  Syringe,
  Home as HomeIcon,
  Droplet,
  PersonStanding,
  Pill,
  Siren,
} from "lucide-react";

// The 12 services shown on the Home hero grid, each linking to its own
// /services/:slug detail page (see pages/ServiceDetail.jsx).
export const SERVICES = [
  {
    slug: "consultations",
    title: "Consultations",
    icon: Video,
    blurb: "Talk to a doctor, in person or over video.",
    description:
      "Book a virtual or in-person consultation with a doctor who understands your history and gets straight to what matters. Every consultation is logged straight into your medical record, so your next visit doesn't start from zero.",
  },
  {
    slug: "diagnostics",
    title: "Diagnostics",
    icon: Microscope,
    blurb: "Lab testing and imaging, results in your portal.",
    description:
      "Fast, accurate lab testing and diagnostic imaging, with results delivered straight to your patient portal as soon as they're ready — no waiting on a callback to find out.",
  },
  {
    slug: "health-checks",
    title: "Health Checks",
    icon: ClipboardCheck,
    blurb: "Routine screenings that catch issues early.",
    description:
      "Routine and comprehensive health screenings that catch small issues before they become big ones. We track your results over time, not just as a single snapshot.",
  },
  {
    slug: "dental-care",
    title: "Dental Care",
    icon: Smile,
    blurb: "Cleanings and restorative care for your smile.",
    description:
      "Cleanings, checkups and restorative dental care from a team that keeps your whole smile — and the health it's connected to — in mind.",
  },
  {
    slug: "diabetes-care",
    title: "Diabetes Care",
    icon: Activity,
    blurb: "Ongoing management built around your routine.",
    description:
      "Ongoing management and monitoring for diabetes, built around your daily routine, not against it. Your care team reviews trends, not just single readings.",
  },
  {
    slug: "treatment-rooms",
    title: "Treatment Rooms",
    icon: BedDouble,
    blurb: "Private rooms for procedures and recovery.",
    description:
      "Private, fully-equipped treatment rooms for procedures, recovery and short-stay observation, staffed around the clock by our nursing team.",
  },
  {
    slug: "vaccinations",
    title: "Vaccinations",
    icon: Syringe,
    blurb: "Routine and travel vaccines, fully tracked.",
    description:
      "Routine immunizations and travel vaccines, tracked in one place so you never lose your record and always know what's due next.",
  },
  {
    slug: "health-at-home",
    title: "Health @ Home",
    icon: HomeIcon,
    blurb: "Nursing visits and sample collection at your door.",
    description:
      "Nursing visits, sample collection and follow-up care delivered to your door — for when getting to a clinic is the hardest part of getting care.",
  },
  {
    slug: "sugar",
    title: "Sugar",
    icon: Droplet,
    blurb: "Blood sugar testing and trend tracking.",
    description:
      "Blood sugar testing and trend tracking to keep your levels — and your care team — informed between visits.",
  },
  {
    slug: "physiotherapy",
    title: "Physiotherapy",
    icon: PersonStanding,
    blurb: "Guided rehabilitation plans for your recovery.",
    description:
      "Guided rehabilitation and physical therapy plans tailored to your recovery goals, with progress tracked session over session.",
  },
  {
    slug: "pharmacy",
    title: "Pharmacy",
    icon: Pill,
    blurb: "Prescriptions filled, delivered, and refilled on time.",
    description:
      "Prescriptions filled and delivered, with refill reminders tied to your actual prescriptions so you never run out unexpectedly.",
  },
  {
    slug: "urgent-medical-care",
    title: "Urgent Medical Care",
    icon: Siren,
    blurb: "Walk-in care for what can't wait.",
    description:
      "Walk-in care for the things that can't wait for a scheduled appointment, backed by the same secure records as the rest of your care.",
  },
];

export function getServiceBySlug(slug) {
  return SERVICES.find((s) => s.slug === slug);
}
