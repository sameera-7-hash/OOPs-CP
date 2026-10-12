import React from "react";
import SplitText from "@/components/SplitText";
import Photo from "@/components/Photo";
import { EcgLine } from "@/components/art/Illustrations";
import { SampleDataNotice } from "@/components/feedback/SampleTag";

// Dashboard greeting: a light mint brand card with the page title (h1), a short
// line, an optional action, and a role photo on wider screens. `sample`
// works as in PageHeading.
function WelcomeBanner({ eyebrow, title, description, action, photo, sample }) {
  return (
    <>
      <section className="bg-brand pattern-dots relative mb-6 grid animate-rise overflow-hidden rounded-2xl border border-primary/15 shadow-md md:grid-cols-[1.4fr_1fr]">
        {/* Pinned to the bottom edge, below the padded copy, so it never crosses text. */}
        <EcgLine className="ecg-glow pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full md:w-3/5" />
        <div className="relative flex flex-col justify-center gap-2 p-6 pb-14 sm:p-8 sm:pb-16">
          {eyebrow && (
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-coral" />
              {eyebrow}
            </span>
          )}
          <SplitText key={title} as="h1" text={title} className="text-3xl leading-tight sm:text-4xl" />
          {description && <p className="max-w-xl text-base text-muted-foreground">{description}</p>}
          {action && <div className="mt-4">{action}</div>}
        </div>
        {photo && (
          <div className="relative hidden md:block">
            <Photo name={photo} decorative aspect={4 / 3} sizes="420px" className="absolute inset-0 h-full w-full" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-mint-soft via-mint-soft/30 to-transparent" />
          </div>
        )}
      </section>
      {sample && <SampleDataNotice>{typeof sample === "string" ? sample : undefined}</SampleDataNotice>}
    </>
  );
}

export default WelcomeBanner;
