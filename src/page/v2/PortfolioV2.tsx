// PortfolioV2.tsx
// Purpose: The /portfolio page — hero, the filterable project grid, CTA band.
// Used in: src/App.tsx  (route: /portfolio)
// Data source: none here — <XerxezPortfolio> owns the project data / filtering.

import { CheckCircle2 } from "lucide-react";
import SEO from "../../components/seo/SEO";
import { XerxezShell, XerxezPortfolio, XerxezCtaBand, T, Eyebrow, DotGrid, Btn, V2_HEADER_H } from "../../components/v2";
import heroImage from "../../assets/images/portfolio-hero.jpg";

// The three trust points under the hero subtitle — short enough to sit on
// one line each so the whole hero still fits a single screen.
const TRUST_POINTS = ["Real enterprise clients", "Measurable outcomes", "UAE & India based"];

const PortfolioV2 = () => (
  <XerxezShell>
    <SEO
      title="XERXEZ Portfolio | AI ERP Projects UAE & India"
      description="See XERXEZ enterprise projects and ERP implementations across UAE & India. AI-powered solutions for EPC, Construction & Manufacturing."
      canonical="/portfolio"
      noIndex
    />

    {/* ── Hero — left-aligned, single-screen, dark achievement photo. ── */}
    <section style={{
      position: "relative", overflow: "hidden",
      background: T.navyGrad,
      minHeight: "100svh", display: "flex", alignItems: "center",
      paddingTop: V2_HEADER_H + 56, paddingBottom: 72,
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center",
      }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(7,26,51,0.60)" }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "-25%", right: "-10%", width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, rgba(217,53,34,0.06) 45%, transparent 70%)`,
        filter: "blur(20px)", pointerEvents: "none",
      }} />
      <DotGrid opacity={0.4} size={36} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 14 }}>
          <Eyebrow color={T.redLight} mb={0}>XERXEZ · PORTFOLIO</Eyebrow>
          <h1 style={{
            fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)",
            lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: 0,
          }}>
            Results that speak for themselves
          </h1>
          <p style={{ fontFamily: T.fontBody, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }}>
            Every project below is a proven enterprise transformation — measured in cost savings,
            uptime improvements, engineers trained and AI models shipped. Real clients, real
            outcomes, real impact across UAE &amp; India.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginTop: 2 }}>
            {TRUST_POINTS.map((point) => (
              <div key={point} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} color={T.red} strokeWidth={2.5} />
                <span style={{ fontFamily: T.fontBody, fontSize: 13.5, fontWeight: 600, color: "#fff" }}>
                  {point}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
            <Btn href="#project-grid">Explore work</Btn>
            <Btn to="/contact" variant="outline" dark arrow={false}>Start a project</Btn>
          </div>
        </div>
      </div>
    </section>

    <XerxezPortfolio />
    <XerxezCtaBand />
  </XerxezShell>
);

export default PortfolioV2;
