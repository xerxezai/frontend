// IndustryHero.tsx
// Purpose: The full-bleed navy photo hero shared by every /v2/industries/*
//          and /v2/iot/* detail page — replaces 12 hand-rolled copies of the
//          same ~50-line block (photo layer, navy scrim, radial glow,
//          DotGrid, eyebrow, H1, subtitle, CTA row, optional highlights
//          row) that had already started drifting between pages (e.g.
//          inconsistent `minHeight`).
// Used in: page/v2/industries/*.tsx, page/v2/iot/*.tsx
// Data source: none — pure layout. Callers pass the copy/photo/highlights.

import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { T, Eyebrow, DotGrid, Btn, V2_HEADER_H } from "../../01-core/v2theme";

export interface IndustryHeroCta {
  label: string;
  to?: string;
  href?: string;
  variant?: "primary" | "outline";
  arrow?: boolean;
}

export const IndustryHero = ({
  eyebrow,
  heading,
  subtitle,
  heroImage,
  highlights,             // optional — industries pages show a bottom highlights row, IoT pages don't
  ctaButtons,
  minHeight = "100svh",   // IoT pages use the default; industries pages pass "82svh" to match their existing look
  maxWidth = 820,         // IoT pages' text column; industries pages pass 680
  titleSize = "clamp(2rem, 4vw, 3.2rem)",   // IoT pages' scale; industries pages pass "clamp(34px, 5vw, 56px)"
  overlayOpacity = 0.55,
}: {
  eyebrow: string;
  heading: ReactNode;
  subtitle: ReactNode;
  heroImage: string;
  highlights?: string[];
  ctaButtons: IndustryHeroCta[];
  minHeight?: string;
  maxWidth?: number;
  titleSize?: string;
  overlayOpacity?: number;
}) => (
  <section style={{
    position: "relative", overflow: "hidden",
    background: T.navyGrad,
    minHeight, display: "flex", alignItems: "center",
    paddingTop: V2_HEADER_H + 56, paddingBottom: 72,
  }}>
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0,
      backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center",
    }} />
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: T.scrim(overlayOpacity) }} />
    <div aria-hidden="true" style={{
      position: "absolute", top: "-25%", right: "-10%", width: 680, height: 680, borderRadius: "50%",
      background: `radial-gradient(circle, ${T.redGlow} 0%, rgba(217,53,34,0.06) 45%, transparent 70%)`,
      filter: "blur(20px)", pointerEvents: "none",
    }} />
    <DotGrid opacity={0.4} size={36} />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth, display: "flex", flexDirection: "column", gap: 14 }}>
        <Eyebrow color={T.redLight} mb={0}>{eyebrow}</Eyebrow>
        <h1 style={{
          fontFamily: T.fontHead, fontWeight: 800, fontSize: titleSize,
          lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: 0,
        }}>
          {heading}
        </h1>
        <p style={{ fontFamily: T.fontBody, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }}>
          {subtitle}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
          {ctaButtons.map((c) => (
            <Btn key={c.label} to={c.to} href={c.href} variant={c.variant} dark={c.variant === "outline"} arrow={c.arrow}>
              {c.label}
            </Btn>
          ))}
        </div>
      </div>

      {/* optional highlights row — outside the text column (its own wider
          max-width) and never wraps, matching the industries pages' original
          horizontal-scroll-on-overflow treatment */}
      {highlights && highlights.length > 0 && (
        <div style={{
          display: "flex", flexWrap: "nowrap", gap: 20, marginTop: 40, paddingTop: 28,
          borderTop: "1px solid rgba(255,255,255,0.14)", maxWidth: 900, overflowX: "auto",
        }}>
          {highlights.map((f) => (
            <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0, fontFamily: T.fontBody, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>
              <CheckCircle2 size={15} strokeWidth={3} color={T.redLight} />
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  </section>
);
