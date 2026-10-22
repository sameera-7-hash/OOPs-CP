import React, { useState } from "react";
import { photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

// A responsive photo in a tinted frame. The tint shows while it loads, and
// if the image can't be fetched the frame simply stays tinted (no broken
// image icon). Pass decorative to hide it from screen readers.
function Photo({ name, aspect = 4 / 3, sizes, className, imgClassName, priority = false, decorative = false }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { src, srcSet, alt } = photo(name, { aspect });

  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)} style={{ aspectRatio: aspect }}>
      {!failed && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes || "100vw"}
          alt={decorative ? "" : alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          data-loaded={loaded || undefined}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      )}
    </div>
  );
}

export default Photo;
