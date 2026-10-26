import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CursorFollower from "@/components/CursorFollower";
import FluidTrail from "@/components/FluidTrail";
import LiquidHeading from "@/components/motion/LiquidHeading";

// A thin gold rule fading out at both ends, with a four-point star at its
// centre. Frames the landing page top and bottom.
function GoldRule({ position }) {
  return (
    <div className={`landing__rule landing__rule--${position}`} aria-hidden="true">
      <span className="landing__rule-line" />
      <svg className="landing__rule-star" viewBox="0 0 24 24">
        <path d="M12 0C12.6 7.4 16.6 11.4 24 12C16.6 12.6 12.6 16.6 12 24C11.4 16.6 7.4 12.6 0 12C7.4 11.4 11.4 7.4 12 0Z" />
      </svg>
      <span className="landing__rule-line" />
    </div>
  );
}

// The Beacon lighthouse as line art: outlines only, in glowing gold, with
// light rays that pulse like the lamp.
function BeaconOutline() {
  return (
    <svg className="landing__logo" viewBox="0 0 64 64" role="img" aria-label="Beacon">
      <g className="landing__logo-rays">
        <path d="M21 16.5 12 12.5M21 19.5 12 23.5M43 16.5 52 12.5M43 19.5 52 23.5" />
      </g>
      <path d="M32 3.5V7M26 14Q32 6.5 38 14" />
      <rect x="26" y="14" width="12" height="9" rx="1" />
      <path d="M22 23H42M23.5 23V26M40.5 23V26M22 26H42" />
      <path d="M27 26 24 54H40L37 26M25.7 38H38.3M25 45.5H39" />
      <path d="M30 54V49.5Q32 47 34 49.5V54M20 54H44" />
      <path d="M13 59.5Q17.5 56.5 22 59.5T31 59.5T40 59.5T49 59.5" />
    </svg>
  );
}

// The splash before Home: the lighthouse painting full-bleed, a pastel
// fluid trail stirred by the pointer behind the text, and one way in.
// The trail and the custom cursor live only here; every other page keeps
// the plain system cursor.
function Landing() {
  const { t } = useTranslation();
  const bgRef = useRef(null);

  return (
    <main className="landing">
      <img
        ref={bgRef}
        className="landing__bg"
        src="/landing/lighthouse-1600.webp"
        srcSet="/landing/lighthouse-960.webp 960w, /landing/lighthouse-1600.webp 1600w, /landing/lighthouse-2948.webp 2948w"
        // On screens taller than the painting's 2.09:1, cover scales it by height.
        sizes="(max-aspect-ratio: 737/352) calc(100vh * 2.094), 100vw"
        alt=""
        fetchPriority="high"
      />
      <div className="landing__veil" aria-hidden="true" />
      <FluidTrail className="landing__fluid" image={bgRef} />
      <GoldRule position="top" />
      <GoldRule position="bottom" />

      <section className="landing__content">
        <BeaconOutline />
        <LiquidHeading as="p" className="landing__eyebrow">{t("YOUR CARE, YOUR WAY")}</LiquidHeading>
        <LiquidHeading className="landing__title">{t("A clearer path to better care.")}</LiquidHeading>
        <LiquidHeading as="p" className="landing__lede">
          {t("Every health journey deserves guidance, clarity, and care you can trust. Let Beacon help you find your way.")}
        </LiquidHeading>
        <div className="landing__enter-wrap">
          <Link to="/home" className="landing__enter">
            <span className="landing__enter-glow" aria-hidden="true" />
            <span className="landing__enter-label">{t("Enter Beacon")}</span>
            <span className="landing__enter-icon" aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </section>

      <CursorFollower />
    </main>
  );
}

export default Landing;
