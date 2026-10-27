import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const WORD_STEP_S = 0.07; // stagger between words, across all lines
const SHEEN_GAP_S = 0.35; // pause after the last word lands
const SHEEN_STEP_S = 0.045; // the beam travels word to word
// Hindi (any non-Latin text) skips the per-word masks, blur and sheen and
// just fades in once: far fewer elements and no filters to paint.
const NON_LATIN = /[^\u0000-\u024f\u2000-\u206f]/;

// Headline opening: each word rises from behind its own mask, unblurring
// and untilting as it lands, staggered across the lines. Once all words
// are in, a beam of warm light sweeps across the headline once (each
// word's sheen starts a little after the previous one, so it reads as one
// pass). Lines are given explicitly so wrapping stays natural inside each.
// Splits on spaces only, so Devanagari words stay whole. The full text is
// real DOM text; under reduced motion the CSS shows it plainly.
// `lineClassNames` styles individual lines, e.g. to colour the second one.
function RevealLines({ as: Tag = "h1", lines, className, lineClassNames = [], delay = 0, ...rest }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Next frame, so the hidden start state paints first.
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (NON_LATIN.test(lines.join(" "))) {
    return (
      <Tag
        className={cn("reveal-words reveal-words--plain", shown && "is-in", className)}
        style={{ "--plain-delay": `${Math.round(delay * 1000)}ms` }}
        {...rest}
      >
        {lines.map((line, i) => (
          <span key={i} className={cn("reveal-words__line", lineClassNames[i])}>
            {line}
            {i < lines.length - 1 ? " " : null}
          </span>
        ))}
      </Tag>
    );
  }

  const words = lines.map((line) => line.split(/\s+/).filter(Boolean));
  const total = words.reduce((n, w) => n + w.length, 0);
  const sheenStart = delay + total * WORD_STEP_S + SHEEN_GAP_S;
  let index = 0;

  return (
    <Tag className={cn("reveal-words", shown && "is-in", className)} {...rest}>
      {words.map((lineWords, i) => (
        <span key={i} className={cn("reveal-words__line", lineClassNames[i])}>
          {lineWords.map((word, w) => {
            const n = index++;
            return (
              <React.Fragment key={w}>
                <span className="reveal-word">
                  <span
                    style={{
                      "--word-delay": `${Math.round((delay + n * WORD_STEP_S) * 1000)}ms`,
                      "--sheen-delay": `${Math.round((sheenStart + n * SHEEN_STEP_S) * 1000)}ms`,
                    }}
                  >
                    {word}
                  </span>
                </span>
                {w < lineWords.length - 1 ? " " : null}
              </React.Fragment>
            );
          })}
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export default RevealLines;
