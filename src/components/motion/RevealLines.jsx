import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Headline that reveals line by line: each line slides up from behind a
// clip, staggered. Lines are given explicitly so wrapping stays natural
// inside each one. The full text is real DOM text (no aria tricks needed).
// `lineClassName` styles individual lines, e.g. to colour the second one.
function RevealLines({ as: Tag = "h1", lines, className, lineClassNames = [], delay = 0, ...rest }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Next frame, so the hidden start state paints first.
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Tag className={cn("reveal-lines", shown && "is-in", className)} {...rest}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-line">
          <span
            className={lineClassNames[i]}
            style={{ "--line-delay": `${Math.round((delay + i * 0.14) * 1000)}ms` }}
          >
            {line}
          </span>
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export default RevealLines;
