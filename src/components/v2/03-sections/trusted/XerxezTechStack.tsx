// XerxezTechStack.tsx
// Purpose: "Technologies we work with" — a continuously floating (auto-scroll)
//          strip of tech-stack logo tiles, matching etiot.in's marquee. The
//          strip itself is `XerxezTechLogoStrip`, exported (alongside `LOGOS`) so
//          XerxezServiceTemplate's "Technologies we build with" section can reuse
//          the exact same floating strip under its own heading, instead of
//          duplicating the marquee mechanics or falling back to a static grid.
// Used in: page/v2/HomeV2.tsx (this component) and XerxezServiceTemplate.tsx
//          (the exported `XerxezTechLogoStrip`, on all 10 /v2/services/[slug] pages).
// Data source: official brand SVGs (Simple Icons, CC0) saved locally under
//              src/assets/logos/, brand-colored. The 8 technologies are the
//              same real stack already named in AboutV2's `TECH` chips
//              (Python, Django, React, AWS, Docker, Kubernetes, TensorFlow,
//              PostgreSQL) — not a mismatched client-logo set.

import { useState } from "react";
import reactLogo from "../../../../assets/logos/react.svg";
import pythonLogo from "../../../../assets/logos/python.svg";
import djangoLogo from "../../../../assets/logos/django.svg";
import awsLogo from "../../../../assets/logos/amazonaws.svg";
import dockerLogo from "../../../../assets/logos/docker.svg";
import kubernetesLogo from "../../../../assets/logos/kubernetes.svg";
import tensorflowLogo from "../../../../assets/logos/tensorflow.svg";
import postgresqlLogo from "../../../../assets/logos/postgresql.svg";
import { T, SectionHeading, Reveal } from "../../01-core/v2theme";

// Real stack, real logos — mirrors AboutV2's TECH list. Exported so
// XerxezServiceTemplate's "Technologies we build with" section can reuse the
// exact same 8 logos instead of re-importing/re-declaring them.
export const LOGOS = [
  { src: reactLogo, alt: "React" },
  { src: pythonLogo, alt: "Python" },
  { src: djangoLogo, alt: "Django" },
  { src: awsLogo, alt: "Amazon Web Services" },
  { src: dockerLogo, alt: "Docker" },
  { src: kubernetesLogo, alt: "Kubernetes" },
  { src: tensorflowLogo, alt: "TensorFlow" },
  { src: postgresqlLogo, alt: "PostgreSQL" },
];

// One logo tile — shared by both copies of the strip. Same 3D-lift hover as
// every other card on /v2/services/* (translateY(-10px), deeper shadow, no
// rotation, 0.3s ease) — independent of the track's own translateX scroll,
// since the lift is a transform on this tile, not on the scrolling parent.
const Tile = ({ src, alt, decorative }: { src: string; alt: string; decorative?: boolean }) => {
  const [hover, setHover] = useState(false);
  return (
  <div
    // the duplicated second copy exists only to fill the loop visually — hide it from assistive tech
    aria-hidden={decorative ? "true" : undefined}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    style={{
      flex: "0 0 auto", width: 150, height: 92,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#fff", border: `1px solid ${T.border}`,
      borderRadius: 12,
      transform: hover ? "translateY(-10px)" : "translateY(0)",
      boxShadow: hover ? `0 25px 50px ${T.scrim(0.20)}` : "0 4px 12px rgba(7,26,51,0.08)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    }}
  >
    {/* A bare <img>, not the shared utils/Image wrapper: these logos are ES-module
        imports (already fully resolved URLs), so the wrapper's base-path handling
        and required width/height props would add nothing here. `loading="lazy"` is
        deliberately omitted — half the strip starts outside the overflow:hidden
        viewport, and deferring those tiles would leave blank squares that pop in
        as the marquee scrolls. */}
    <img
      src={src}
      alt={decorative ? "" : alt}
      decoding="async"
      style={{ height: 40, width: "auto", maxWidth: 110, objectFit: "contain", display: "block" }}
    />
  </div>
  );
};

// The floating strip itself — scoped keyframes + hover/reduced-motion rules
// + the duplicated-list viewport/track. Exported (no heading of its own) so
// any /v2 section can drop it in under its own SectionHeading. Keyframe name
// is kept local/scoped per repo convention (animation names aren't shared
// globally across the codebase's three apps).
export const XerxezTechLogoStrip = () => (
  <>
    <style>{`
      @keyframes v2TechScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }   /* strip is rendered twice, so 50% = exactly one loop */
      }
      .v2TechMarqueeTrack {
        animation: v2TechScroll 38s linear infinite;
      }
      .v2TechMarqueeViewport:hover .v2TechMarqueeTrack,
      .v2TechMarqueeViewport:focus-within .v2TechMarqueeTrack {
        animation-play-state: paused;   /* pause to read a logo, or for keyboard focus */
      }
      @media (prefers-reduced-motion: reduce) {
        .v2TechMarqueeTrack { animation: none; }
      }
    `}</style>
    {/* full-bleed viewport, edges faded with a mask so tiles scroll "off" softly */}
    <div
      className="v2TechMarqueeViewport"
      style={{
        overflow: "hidden",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)",
      }}
    >
      <div className="v2TechMarqueeTrack" style={{ display: "flex", width: "max-content", gap: 16, padding: "4px 0" }}>
        {/* the list rendered twice back-to-back is what makes the 0%→-50% loop seamless */}
        {LOGOS.map((l) => <Tile key={l.alt} src={l.src} alt={l.alt} />)}
        {LOGOS.map((l) => <Tile key={`dup-${l.alt}`} src={l.src} alt={l.alt} decorative />)}
      </div>
    </div>
  </>
);

const XerxezTechStack = () => (
  <section style={{ padding: "60px 0", background: T.lightAlt }}>
    <div className="container">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Technologies we work with"
          title="Built on the platforms enterprises trust"
          subtitle="A production stack chosen for reliability, security, and scale — not novelty."
        />
      </Reveal>
    </div>

    <Reveal delay={80}>
      <div style={{ marginTop: 52 }}>
        <XerxezTechLogoStrip />
      </div>
    </Reveal>
  </section>
);

export default XerxezTechStack;
