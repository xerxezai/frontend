// XerxezProcess.tsx
// Purpose: "How we work" band — 4 numbered stage cards, dark navy on a white
//          section, with an arrow connector between them on desktop.
// Used in: page/v2/HomeV2.tsx, page/v2/ServicesV2.tsx
// Data source: the 4 stages are the STEPS array from the existing homepage
//              (src/components/marketing/HowWeWork.tsx). Numbering is legitimate
//              here because these are a real sequence.

import { useState } from "react";
import { Phone, PenTool, Code, LifeBuoy } from "lucide-react";   // one icon per stage
import type { LucideIcon } from "lucide-react";
import { T, Eyebrow, Reveal, sectionPad } from "../../01-core/v2theme";

// Ordered delivery stages.
const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Phone,    title: "Discovery Call (Free)", desc: "We understand your needs, current stack and business goals. No commitment required — just an honest conversation." },
  { icon: PenTool,  title: "Solution Design",       desc: "A custom architecture plan with clear scope, timeline and fixed pricing. No surprises mid-project." },
  { icon: Code,     title: "Agile Delivery",        desc: "Two-week sprints with full transparency, stakeholder demos and working software at every stage." },
  { icon: LifeBuoy, title: "Go Live & Support",     desc: "Zero-downtime launch backed by 24/7 dedicated support and continuous improvement." },
];

// One step card — dark navy (#071a33), large faded red step number, red icon
// tile, white title, translucent white description. 3D lift on hover
// (translateY(-10px), deeper shadow), no rotation.
const StepCard = ({ step, index }: { step: typeof STEPS[number]; index: number }) => {
  const [hover, setHover] = useState(false);
  const Icon = step.icon;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#071a33", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "28px 24px 24px", position: "relative", overflow: "hidden",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? "0 25px 50px rgba(7,26,51,0.35)" : "0 10px 30px rgba(7,26,51,0.20)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* big faint step number, top-right */}
      <span aria-hidden="true" style={{
        position: "absolute", top: 6, right: 14,
        fontFamily: T.fontHead, fontSize: 56, fontWeight: 800,
        color: "rgba(255,255,255,0.08)", lineHeight: 1,
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      {/* solid red icon tile */}
      <span style={{
        position: "relative", width: 48, height: 48, borderRadius: 13,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: T.red, color: "#fff",
        boxShadow: `0 8px 20px ${T.redGlow}`,
      }}>
        <Icon size={21} strokeWidth={2} />
      </span>
      <h3 style={{
        position: "relative", fontFamily: T.fontHead, fontSize: 17, fontWeight: 700,
        color: "#fff", margin: "20px 0 9px",
      }}>
        {step.title}
      </h3>
      <p style={{
        position: "relative", fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.65,
        color: "rgba(255,255,255,0.70)", margin: 0,
      }}>
        {step.desc}
      </p>
    </div>
  );
};

const XerxezProcess = () => (
  <section style={{ ...sectionPad, background: "#ffffff" }}>
    <div className="container">
      <Reveal>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <Eyebrow color={T.red}>How We Work</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead,
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            color: T.headNavy,
            margin: 0,
          }}>
            A clear path from first call to go-live
          </h2>
          <p style={{
            fontFamily: T.fontBody,
            fontSize: 17,
            lineHeight: 1.7,
            color: T.muted,
            margin: "18px auto 0",
            maxWidth: 640,
          }}>
            Four disciplined stages that keep discovery, design, engineering, and support tightly connected.
          </p>
        </div>
      </Reveal>

      <div className="row g-4" style={{ marginTop: 40 }}>
        {STEPS.map((s, i) => (
          <div key={s.title} className="col-lg-3 col-md-6" style={{ position: "relative" }}>
            <Reveal delay={i * 60} fill>
              <StepCard step={s} index={i} />
            </Reveal>
            {/* connector — desktop only, a thin line sitting in the gutter
                between cards (not after the last). Anchored to a fixed `top`
                matching the icon tile's vertical center (28px card padding +
                half the 48px tile) rather than "50%" of the card, since
                description lines of different lengths made each card a
                different height and left the connector at inconsistent
                heights relative to each other. */}
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className="d-none d-lg-flex" style={{
                position: "absolute", top: 52, right: -24, transform: "translateX(50%)",
                zIndex: 1, alignItems: "center", pointerEvents: "none",
              }}>
                <span style={{ width: 18, height: 2, background: "rgba(217,53,34,0.40)", display: "block" }} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default XerxezProcess;
