import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CursorFollower from "@/components/CursorFollower";
import FluidTrail from "@/components/FluidTrail";

// The splash before Home: the lighthouse painting full-bleed, a pastel
// fluid trail stirred by the pointer behind the text, and one way in.
// The trail and the custom cursor live only here; every other page keeps
// the plain system cursor.
function Landing() {
  const { t } = useTranslation();

  return (
    <main className="landing">
      <img
        className="landing__bg"
        src="/landing/lighthouse-1600.webp"
        srcSet="/landing/lighthouse-960.webp 960w, /landing/lighthouse-1600.webp 1600w, /landing/lighthouse-2948.webp 2948w"
        // On screens taller than the painting's 2.09:1, cover scales it by height.
        sizes="(max-aspect-ratio: 737/352) calc(100vh * 2.094), 100vw"
        alt=""
        fetchPriority="high"
      />
      <div className="landing__veil" aria-hidden="true" />
      <FluidTrail className="landing__fluid" />

      <section className="landing__content">
        <p className="landing__eyebrow">{t("YOUR CARE, YOUR WAY")}</p>
        <h1 className="landing__title">{t("A clearer path to better care.")}</h1>
        <p className="landing__lede">
          {t("Every health journey deserves guidance, clarity, and care you can trust. Let Beacon help you find your way.")}
        </p>
        <Link to="/home" className="landing__enter">
          <span>{t("Enter Beacon")}</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <CursorFollower />
    </main>
  );
}

export default Landing;
