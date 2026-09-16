// ProjectCaseStudyTemplate.tsx
// Purpose: Shared layout for the 3 portfolio case-study pages (AI ERP, MLOps,
//          Cloud Infrastructure) — identical section structure across all
//          three (hero w/ metric badge, Challenge, Solution, Results, "How
//          We Did It" numbered steps, Tech Stack, project info band,
//          prev/next nav, CTA), only the copy/numbers differ per project, so
//          it's one template driven by a `CaseStudyData` prop rather than 3
//          near-duplicate files. Every card type (solution / result / step /
//          info / tech pill) gets its own 3D-lift hover per the design spec.
// Used in: page/v2/projects/AIERPProjectPage.tsx, MLOpsProjectPage.tsx,
//          CloudInfraProjectPage.tsx
// Data source: original XERXEZ copy per the client's project brief for each
//              case study. No invented statistics — every number shown is
//              one the client supplied.

import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, XerxezCtaBand, T, SectionHeading, DotGrid, Btn, Reveal, IconTile, V2_HEADER_H,
} from "../../../components/v2";

const sectionPad = { padding: "90px 0" };

export type Feature = { icon: LucideIcon; title: string; desc: string };
export type TechItem = { icon: LucideIcon; name: string };
export type Stat = { value: string; label: string };
export type Step = { title: string; desc: string };
export type SidebarItem = { label: string; value: string };
export type ProjectNav = { title: string; href: string };

export type CaseStudyData = {
  seoTitle: string;
  seoDesc: string;
  canonical: string;

  // Hero
  category: string;         // "AI & ERP"
  industry: string;         // "Engineering & Industrial"
  duration: string;         // "6 months"
  team: string;             // "8 engineers"
  keyMetricValue: string;   // "40%"
  keyMetricLabel: string;   // "Cost reduction"
  title: string;
  techStack: TechItem[];    // shown as hero chips + the Tech Stack section

  // Body
  challenge: string;                 // story-driven paragraph
  solutionPoints: Feature[];         // 3D-lift solution cards
  results: Stat[];                   // 4 large stat cards
  steps: Step[];                     // "How We Did It" — 4 numbered steps
  sidebar: SidebarItem[];            // project info band

  prev?: ProjectNav;
  next?: ProjectNav;
};

// ── Shared "3D lift" hover mechanics — translateY(-10px) + deeper shadow,
// never a rotation, 0.3s ease. Every card type below reuses this shape. ──
const liftStyle = (hover: boolean, resting: string): CSSProperties => ({
  transform: hover ? "translateY(-10px)" : "translateY(0)",
  boxShadow: hover ? "0 25px 50px rgba(7,26,51,0.20)" : resting,
  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
});

// Hover state + the mouse handlers that drive it, so each card below declares
// the pattern once instead of repeating the same two inline callbacks.
const useHover = () => {
  const [hover, setHover] = useState(false);
  return [hover, { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) }] as const;
};

// Big red metric number — shared by the hero badge and the result stat cards.
// Results mix short numbers ("40%") with longer words ("Automated"), and a
// fixed clamp sized for "40%" overflows a word that long — so the font size
// scales down with the value's length instead of using one fixed clamp.
const metricValue: CSSProperties = {
  fontFamily: T.fontHead, fontWeight: 800, color: T.red, lineHeight: 1.1,
  wordBreak: "break-word", overflowWrap: "break-word",
};
const metricFontSize = (value: string) => {
  const len = value.replace(/\s/g, "").length;
  if (len > 7) return "clamp(1.5rem, 2.8vw, 2rem)";
  if (len > 4) return "clamp(1.8rem, 3.4vw, 2.5rem)";
  return "clamp(2.1rem, 4vw, 3rem)";
};
const metricLabel: CSSProperties = { fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 600, color: "#fff" };

// Small uppercase caption — project info labels and the prev/next kickers.
const microLabel: CSSProperties = {
  fontFamily: T.fontBody, fontSize: 11.5, fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
};

// Solution card — white, red icon tile, red top border on hover.
const SolutionCard = ({ icon: Icon, title, desc }: Feature) => {
  const [hover, hoverProps] = useHover();
  return (
    <div
      {...hoverProps}
      style={{
        height: "100%", background: "#fff", borderRadius: 16, padding: "28px 26px",
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        ...liftStyle(hover, "0 10px 30px rgba(7,26,51,0.08)"),
      }}
    >
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 17, fontWeight: 700, color: T.headNavy, margin: "18px 0 9px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.65, color: T.muted, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

// Result stat card — dark navy, subtle border, large red number, 3D lift.
const StatCard = ({ value, label }: Stat) => {
  const [hover, hoverProps] = useHover();
  return (
    <div
      {...hoverProps}
      style={{
        height: "100%", background: "rgba(255,255,255,0.04)", borderRadius: 16,
        border: `1px solid ${hover ? T.red : "rgba(255,255,255,0.12)"}`,
        padding: "32px 24px", textAlign: "center",
        display: "flex", flexDirection: "column",
        ...liftStyle(hover, "none"),
      }}
    >
      {/* fixed-height value slot so short numbers and long words ("95%" vs
          "Automated") still land at the same font baseline, keeping every
          label in the row aligned regardless of value length */}
      <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...metricValue, fontSize: metricFontSize(value) }}>
          {value}
        </span>
      </div>
      <div style={{ ...metricLabel, marginTop: 12 }}>
        {label}
      </div>
    </div>
  );
};

// "How We Did It" step card — dark navy (#071a33), faded number top-right,
// white title, muted white description, 3D lift.
const StepCard = ({ index, title, desc }: Step & { index: number }) => {
  const [hover, hoverProps] = useHover();
  return (
    <div
      {...hoverProps}
      style={{
        height: "100%", background: T.navy, borderRadius: 16,
        border: `1px solid ${hover ? T.red : "rgba(255,255,255,0.08)"}`,
        padding: "26px 24px",
        ...liftStyle(hover, "0 10px 30px rgba(7,26,51,0.20)"),
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontFamily: T.fontHead, fontSize: 34, fontWeight: 800, color: "rgba(217,53,34,0.45)", lineHeight: 1 }}>
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 17, fontWeight: 700, color: "#fff", margin: "8px 0", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.70)", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

// Tech stack pill — white bg, red icon, bold name, radius 12, shadow.
const TechPill = ({ icon: Icon, name }: TechItem) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 10,
    background: "#fff", borderRadius: 12, boxShadow: T.cardShadow,
    padding: "12px 20px",
  }}>
    <Icon size={18} strokeWidth={2.2} color={T.red} />
    <span style={{ fontFamily: T.fontHead, fontSize: 14.5, fontWeight: 700, color: T.headNavy }}>
      {name}
    </span>
  </span>
);

// Project info card — dark navy band, translucent bordered tile.
const InfoCard = ({ label, value }: SidebarItem) => (
  <div style={{
    height: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16, padding: 22,
  }}>
    <div style={{ ...microLabel, color: "rgba(255,255,255,0.55)" }}>
      {label}
    </div>
    <div style={{ fontFamily: T.fontHead, fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 8 }}>
      {value}
    </div>
  </div>
);

// Prev / next project link — same markup both ways, only the kicker differs.
const ProjectNavLink = ({ nav, kicker }: { nav: ProjectNav; kicker: string }) => (
  <Link to={nav.href} style={{ display: "block", textDecoration: "none" }}>
    <div style={{ ...microLabel, color: "#5b6b7c" }}>
      {kicker}
    </div>
    <div style={{ fontFamily: T.fontHead, fontSize: 17, fontWeight: 700, color: T.headNavy, marginTop: 6 }}>
      {nav.title}
    </div>
  </Link>
);

const ProjectCaseStudyTemplate = ({ data }: { data: CaseStudyData }) => (
  <XerxezShell>
    <SEO title={data.seoTitle} description={data.seoDesc} canonical={data.canonical} noIndex />

    {/* ── Hero — dark navy, red radial glow, category pill, metric badge. ── */}
    <section style={{
      position: "relative", overflow: "hidden", background: T.navy,
      paddingTop: V2_HEADER_H + 56, paddingBottom: 72,
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "-25%", right: "-10%", width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, rgba(217,53,34,0.06) 45%, transparent 70%)`,
        filter: "blur(20px)", pointerEvents: "none",
      }} />
      <DotGrid opacity={0.25} size={36} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ marginBottom: 24 }}>
            <Btn to="/v2/portfolio" variant="outline" dark arrow={false}>← Back to Portfolio</Btn>
          </div>
          <div className="row align-items-center g-5">
            <div className="col-lg-8">
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                <span style={{
                  fontFamily: T.fontHead, fontSize: 12.5, fontWeight: 700, letterSpacing: "0.04em",
                  color: "#fff", background: T.red, borderRadius: 20, padding: "7px 18px",
                }}>
                  {data.category}
                </span>
                <span style={{ fontFamily: T.fontBody, fontSize: 13.5, color: "rgba(255,255,255,0.6)" }}>
                  {data.industry}
                </span>
              </div>
              <h1 style={{
                fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: 0,
              }}>
                {data.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                {[`Duration: ${data.duration}`, `Team: ${data.team}`].map((pill) => (
                  <span key={pill} style={{
                    fontFamily: T.fontBody, fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.75)",
                    background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: "7px 16px",
                  }}>
                    {pill}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                {data.techStack.map((t) => (
                  <span key={t.name} style={{
                    fontFamily: T.fontHead, fontSize: 12.5, fontWeight: 600, color: "#fff",
                    background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "7px 16px",
                  }}>
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              {/* key metric badge — large red number + label, dark card */}
              <div style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 16, padding: "28px 24px", textAlign: "center",
              }}>
                <div style={{ ...metricValue, fontSize: metricFontSize(data.keyMetricValue) }}>
                  {data.keyMetricValue}
                </div>
                <div style={{ ...metricLabel, marginTop: 10 }}>
                  {data.keyMetricLabel}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* ── The Challenge — white, story-driven paragraph. ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionHeading align="center" eyebrow="The Challenge" title="Where Things Stood" />
            <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "28px 0 0", textAlign: "center" }}>
              {data.challenge}
            </p>
          </div>
        </Reveal>
      </div>
    </section>

    {/* ── Our Solution — light gray band, 3D-lift solution cards. ── */}
    <section style={{ ...sectionPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Our Solution" title="What We Built" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {data.solutionPoints.map((s, i) => (
            <div key={s.title} className="col-lg-3 col-md-6">
              <Reveal delay={i * 60} fill>
                <SolutionCard icon={s.icon} title={s.title} desc={s.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Measurable Results — dark navy, 4 large stat cards. ── */}
    <section style={{ ...sectionPad, background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading align="center" dark eyebrow="Measurable Results" title="The Outcome" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {/* most projects report 4 results (4-up row); a couple report 5 —
              3-up keeps those balanced (3+2) instead of an orphaned 5th card */}
          {data.results.map((r) => (
            <div key={r.label} className={data.results.length === 5 ? "col-lg-4 col-md-6" : "col-lg-3 col-md-6"}>
              <Reveal fill>
                <StatCard value={r.value} label={r.label} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── How We Did It — white section, dark navy step cards, 2x2 grid. A
        real sequence, so visible numbering is appropriate here. ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="How We Did It" title="Our Delivery Process" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {data.steps.map((s, i) => (
            <div key={s.title} className="col-lg-6">
              <Reveal delay={i * 60} fill>
                <StepCard index={i + 1} title={s.title} desc={s.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Technology Stack — light gray band, icon pills. ── */}
    <section style={{ ...sectionPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Technology Stack" title="Tools & Platforms Used" />
        </Reveal>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 40 }}>
          {data.techStack.map((t) => (
            <TechPill key={t.name} icon={t.icon} name={t.name} />
          ))}
        </div>
      </div>
    </section>

    {/* ── Project info band — dark navy, 4 info cards in a row. ── */}
    <section style={{ padding: "72px 0", background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div className="row g-4">
            {data.sidebar.map((item) => (
              <div key={item.label} className="col-lg-3 col-md-6">
                <InfoCard label={item.label} value={item.value} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>

    {/* ── Previous / Next project navigation. ── */}
    {(data.prev || data.next) && (
      <section style={{ padding: "40px 0", background: "#fff", borderTop: `1px solid ${T.border}` }}>
        <div className="container">
          <div className="row g-3">
            <div className="col-md-6">
              {data.prev && <ProjectNavLink nav={data.prev} kicker="← Previous Project" />}
            </div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              {data.next && <ProjectNavLink nav={data.next} kicker="Next Project →" />}
            </div>
          </div>
        </div>
      </section>
    )}

    <XerxezCtaBand />
  </XerxezShell>
);

export default ProjectCaseStudyTemplate;
