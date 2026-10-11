import React from "react";

// Reveals text letter by letter. Letters are grouped per word so lines
// still wrap between words. Screen readers read a visually hidden copy of
// the whole phrase; the animated letters are hidden from them. The total
// stagger is capped (maxSpread) so long titles still finish quickly.
// Under prefers-reduced-motion the CSS turns the animation off.
function SplitText({ text, as: Tag = "span", className, delay = 0, maxSpread = 520, ...rest }) {
  const str = String(text ?? "");
  const letters = str.replace(/\s+/g, "").length || 1;
  const step = Math.min(28, maxSpread / letters);
  let index = 0;

  return (
    <Tag className={className} {...rest}>
      <span className="sr-only">{str}</span>
      {str.split(/(\s+)/).map((word, w) =>
        /^\s+$/.test(word) ? (
          <span key={w} aria-hidden="true"> </span>
        ) : (
          <span key={w} aria-hidden="true" className="split-word">
            {[...word].map((ch, c) => {
              const d = Math.round(delay + index++ * step);
              return (
                <span key={c} className="split-letter" style={{ "--d": `${d}ms` }}>
                  {ch}
                </span>
              );
            })}
          </span>
        )
      )}
    </Tag>
  );
}

export default SplitText;
