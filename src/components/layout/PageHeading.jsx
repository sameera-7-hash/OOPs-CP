import React from "react";
import FadeIn from "@/components/FadeIn";

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <FadeIn className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </FadeIn>
  );
}

export default PageHeading;
