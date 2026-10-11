import React from "react";
import SplitText from "@/components/SplitText";
import Photo from "@/components/Photo";
import { EcgLine } from "@/components/art/Illustrations";
import { SampleDataNotice } from "@/components/feedback/SampleTag";

// Dashboard greeting: a deep-teal card with the page title (h1), a short
// line, an optional action, and a role photo on wider screens. `sample`
// works as in PageHeading.
function WelcomeBanner({ eyebrow, title, description, action, photo, sample }) {
  return (
    <>
      <section className="relative mb-6 grid animate-rise overflow-hidden rounded-2xl bg-sidebar text-sidebar-foreground shadow-md md:grid-cols-[1.4fr_1fr]">
        <EcgLine className="pointer-events-none absolute inset-x-0 bottom-2 h-16 w-full stroke-sidebar-foreground opacity-30 md:w-3/5" />
        <div className="relative flex flex-col justify-center gap-2 p-6 sm:p-8">
          {eyebrow && <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-muted">{eyebrow}</span>}
          <SplitText key={title} as="h1" text={title} className="text-3xl leading-tight sm:text-4xl" />
          {description && <p className="max-w-xl text-base text-sidebar-muted">{description}</p>}
          {action && <div className="mt-4">{action}</div>}
        </div>
        {photo && (
          <div className="relative hidden md:block">
            <Photo name={photo} decorative aspect={4 / 3} sizes="420px" className="absolute inset-0 h-full w-full" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-sidebar to-transparent" />
          </div>
        )}
      </section>
      {sample && <SampleDataNotice>{typeof sample === "string" ? sample : undefined}</SampleDataNotice>}
    </>
  );
}

export default WelcomeBanner;
