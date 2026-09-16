// v2page.tsx
// Purpose: Page-layout helpers reused across /v2 pages — the inner-page hero
//          band, a number+label stat strip, and a simple feature card.
// Used in: page/v2/ServicesV2, PortfolioV2, TrainingV2, CareersV2, AboutV2
// Data source: none — pure layout. Callers pass the copy / items.

import { useState } from "react";                            // hover state (V2FeatureCard)
import type { CSSProperties, ReactNode } from "react";      // types only
import { T, Btn, Eyebrow, IconTile, V2_HEADER_H } from "./v2theme";    // tokens + button + kicker + icon tile + header height

// ── <V2PageHero> ─────────────────────────────────────────────────────────
// The navy hero band at the top of an inner page: eyebrow + H1 + subtitle +
// optional CTAs, with an optional right-hand slot and optional photo layer.
export const V2PageHero = ({
  eyebrow,               // small red kicker
  title,                 // H1 (string or JSX)
  subtitle,              // optional supporting line
  ctas,                  // optional array of buttons
  right,                 // optional JSX shown to the right (e.g. a card)
  photo,                 // optional background image URL
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  ctas?: { label: string; to?: string; href?: string; variant?: "primary" | "outline"; arrow?: boolean }[];
  right?: ReactNode;
  photo?: string;
}) => (
  <section
    style={{
      position: "relative",                 // anchor for the absolute layers below
      background: T.navy,
      overflow: "hidden",                   // clip the glow circle
      paddingTop: V2_HEADER_H + 56,         // clear the fixed header + breathing room
      paddingBottom: 72,
    }}
  >
    {/* optional photo layer — dimmed so text stays readable */}
    {photo && (
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${photo})`, backgroundSize: "cover", backgroundPosition: "center right",
        opacity: 0.42,
      }} />
    )}
    {/* scrim over the photo (dark on the left where the text is); no-op without a photo */}
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0,
      background: photo
        ? `linear-gradient(90deg, ${T.scrim(0.95)} 0%, ${T.scrim(0.86)} 45%, ${T.scrim(0.55)} 100%)`
        : "transparent",
    }} />
    {/* soft blue glow, top-right — matches the homepage hero atmosphere */}
    <div aria-hidden="true" style={{
      position: "absolute", top: "-30%", right: "-12%",
      width: 620, height: 620, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(12,76,143,0.28) 0%, transparent 68%)",
      filter: "blur(20px)", pointerEvents: "none",
    }} />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="row align-items-center g-5">
        {/* text column — narrower when there's a right slot */}
        <div className={right ? "col-lg-7" : "col-12"}>
          {/* lighter red for contrast on navy; 20px gap to the larger H1 below */}
          <Eyebrow color={T.redLight} mb={20}>{eyebrow}</Eyebrow>
          <h1 style={{
            fontFamily: T.fontHead, fontWeight: 800,
            fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1.08,
            letterSpacing: "-0.02em", color: "#fff", margin: 0,
            maxWidth: right ? undefined : 900,            // constrain only when full-width
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontFamily: T.fontBody, fontSize: 17.5, lineHeight: 1.7,
              color: "rgba(255,255,255,0.75)", margin: "22px 0 0", maxWidth: 620,
            }}>
              {subtitle}
            </p>
          )}
          {ctas && ctas.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 32 }}>
              {ctas.map((c) => (
                <Btn key={c.label} to={c.to} href={c.href}
                  variant={c.variant ?? "primary"}
                  dark                                     // always on a dark bg here
                  // show the arrow unless the caller says otherwise; default: primary yes, outline no
                  arrow={c.arrow ?? c.variant !== "outline"}>
                  {c.label}
                </Btn>
              ))}
            </div>
          )}
        </div>
        {/* right slot (optional) */}
        {right && <div className="col-lg-5">{right}</div>}
      </div>
    </div>
  </section>
);

// ── <V2StatStrip> ────────────────────────────────────────────────────────
// A responsive row of "big number + small label" stats. `auto-fit` wraps them
// to 2-up / 1-up on narrow screens with no media query.
export const V2StatStrip = ({
  items,                 // [{ v: "12+", l: "ERP modules" }, …]
  dark = false,          // true on navy sections
}: { items: { v: string; l: string }[]; dark?: boolean }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,   // even columns, wrap when tight
    gap: "24px 20px",
  }}>
    {items.map((s) => (
      <div key={s.l}>
        <div style={{
          fontFamily: T.fontHead, fontSize: 30, fontWeight: 800, lineHeight: 1,
          letterSpacing: "-0.02em", color: dark ? "#fff" : T.headNavy,
        }}>
          {s.v}
        </div>
        <div style={{
          fontFamily: T.fontBody, fontSize: 12, fontWeight: 500,
          letterSpacing: "0.04em", textTransform: "uppercase",
          color: dark ? "rgba(255,255,255,0.55)" : T.muted, marginTop: 7,
        }}>
          {s.l}
        </div>
      </div>
    ))}
  </div>
);

// ── <V2FeatureCard> ──────────────────────────────────────────────────────
// Icon tile + title + optional description (omit `desc` for a title-only
// card — the paragraph is skipped entirely rather than left as an empty
// gap under the heading). Static at rest; on hover it lifts
// (translateY), gains a deeper shadow, the border turns red, and the icon
// tile flips to its solid "active" state — depth cues with no rotation/tilt
// (explicitly dropped from the homepage services grid — lift/shadow only).
// Used for every "why / culture / benefits / features" grid across /v2,
// including the /v2/services/[slug] Features Grid. `height:100%` keeps a
// row of cards level when each sits directly in a Bootstrap `.col`.
export const V2FeatureCard = ({
  icon,                  // JSX icon (lucide element)
  title,
  desc,
  dark = false,          // true on navy sections
  style,                 // optional style overrides merged last
}: {
  icon: ReactNode; title: string; desc?: string; dark?: boolean; style?: CSSProperties;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%",                                             // equal-height row (see note above)
        background: dark ? "rgba(255,255,255,0.05)" : "#fff",
        border: `1px solid ${hover ? T.red : dark ? "rgba(255,255,255,0.12)" : T.border}`,
        borderRadius: T.rcard,
        padding: "28px 26px",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover
          ? (dark ? "0 24px 48px rgba(0,0,0,0.35)" : `0 24px 48px ${T.scrim(0.16)}`)
          : (dark ? "none" : T.cardShadow),
        transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms ease, border-color 200ms ease",
        ...style,
      }}>
      <IconTile active={hover}>{icon}</IconTile>
      <h3 style={{
        fontFamily: T.fontHead, fontSize: 18, fontWeight: 700,
        color: dark ? "#fff" : T.headNavy, margin: desc ? "18px 0 9px" : "18px 0 0", lineHeight: 1.3,
      }}>
        {title}
      </h3>
      {desc && (
        <p style={{
          fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.65,
          color: dark ? "rgba(255,255,255,0.68)" : T.muted, margin: 0,
        }}>
          {desc}
        </p>
      )}
    </div>
  );
};
