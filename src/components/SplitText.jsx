import React from "react";

// Reveals text letter by letter. Letters are grouped per word so lines
// still wrap between words. Screen readers read a visually hidden copy of
// the whole phrase; the animated letters are hidden from them. The total
// stagger is capped (maxSpread) so long titles still finish quickly.
// Under prefers-reduced-motion the CSS turns the animation off.
//
// Scripts such as Devanagari build one visible letter from several code
// points (a consonant plus vowel signs, or a conjunct), so splitting them
// would show broken glyphs. Non-Latin text animates word by word instead.
const NON_LATIN = /[^\u0000-ɏ -⁯]/;

function SplitText({ text, as: Tag = "span", className, delay = 0, maxSpread = 520, ...rest }) {
  const str = String(text ?? "");
  const byWord = NON_LATIN.test(str);
  const pieces = (word) => (byWord ? [word] : [...word]);
  const letters = byWord ? str.split(/\s+/).filter(Boolean).length || 1 : str.replace(/\s+/g, "").length || 1;
  const step = Math.min(byWord ? 90 : 28, maxSpread / letters);
  let index = 0;

  return (
    <Tag className={className} {...rest}>
      <span className="sr-only">{str}</span>
      {str.split(/(\s+)/).map((word, w) =>
        /^\s+$/.test(word) ? (
          <span key={w} aria-hidden="true"> </span>
        ) : (
          <span key={w} aria-hidden="true" className="split-word">
            {pieces(word).map((ch, c) => {
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
