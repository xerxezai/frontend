// XerxezCtaBand.tsx
// Purpose: Reusable navy "book a call" conversion band placed near the bottom
//          of most /v2 pages.
// Used in: HomeV2, ServicesV2, PortfolioV2, TrainingV2, AboutV2
// Data source: copy adapted from the existing site's ReadyCTA / ContactSection.

import { T, Btn, Eyebrow, Reveal } from "../../01-core/v2theme";   // tokens + button + kicker + scroll-in wrapper

const XerxezCtaBand = () => (
  <section style={{ background: T.navy, padding: "clamp(64px, 8vw, 104px) 0", position: "relative", overflow: "hidden" }}>
    {/* red glow bleeding in from above, centred */}
    <div aria-hidden="true" style={{
      position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
      width: 680, height: 680, borderRadius: "50%",
      background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`,
      pointerEvents: "none",
    }} />
    <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
      <Reveal>
        {/* eyebrow — lighter red for contrast on navy */}
        <Eyebrow color={T.redLight}>Ready when you are</Eyebrow>
        <h2 style={{
          fontFamily: T.fontHead,
          fontSize: "clamp(28px, 4vw, 46px)",
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: "#fff",
          margin: "0 auto",
          maxWidth: 720,          // keep the headline to ~2 lines
        }}>
          Ready to accelerate your digital transformation?
        </h2>
        <p style={{
          fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
          color: "rgba(255,255,255,0.72)",
          margin: "18px auto 32px", maxWidth: 560,
        }}>
          Book a free discovery call. We'll map your current stack, your goals, and
          exactly how XERXEZ gets you there.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          {/* no pricing page/figures exist yet — second CTA points at real content instead */}
          <Btn to="/contact">Book a free demo</Btn>
          <Btn to="/services" variant="outline" dark arrow={false}>Explore our services</Btn>
        </div>
      </Reveal>
    </div>
  </section>
);

export default XerxezCtaBand;
