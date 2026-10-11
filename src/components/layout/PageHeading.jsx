import React from "react";
import FadeIn from "@/components/FadeIn";
import SplitText from "@/components/SplitText";
import { SampleDataNotice } from "@/components/feedback/SampleTag";

// Page title block. `sample` adds a visible notice that the screen shows
// placeholder data (pass a string to customise the explanation).
function PageHeading({ eyebrow, title, description, action, sample }) {
  return (
    <>
      <FadeIn className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</span>
          )}
          <SplitText key={title} as="h1" text={title} className="text-3xl leading-tight sm:text-4xl" />
          {description && <p className="mt-2 max-w-2xl text-base text-muted-foreground">{description}</p>}
        </div>
        {action}
      </FadeIn>
      {sample && <SampleDataNotice>{typeof sample === "string" ? sample : undefined}</SampleDataNotice>}
    </>
  );
}

export default PageHeading;
