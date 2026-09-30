import React from "react";
import { motion } from "motion/react";

// Fades/slides children into place the moment they scroll into view (once
// only). `delay` (seconds) staggers a group of siblings; `as` picks the
// motion element tag so this can render a <div>, an <li>, an <h2>, etc.
function FadeIn({ children, delay = 0, className, as = "div", y = 18 }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}

export default FadeIn;
