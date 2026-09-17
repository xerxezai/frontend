// ServicesV2.tsx
// Purpose: The /services page — hero, deep service grid, process band, a
//          stat strip, and the shared CTA band.
// Used in: src/App.tsx  (route: /services)
// Data source: `services` from src/data/index.ts is used to build the
//              schema.org ItemList JSON-LD. The visible service cards come from
//              <XerxezServiceDeepGrid> (same data). STATS below are the same figures
//              the existing ServiceSection3 hero shows.

import { CheckCircle2 } from "lucide-react";
import SEO from "../../components/seo/SEO";
import { services } from "../../data";
import {
  XerxezShell, V2StatStrip, XerxezServiceDeepGrid, XerxezProcess, XerxezCtaBand,
  T, Reveal, Eyebrow, DotGrid, Btn, V2_HEADER_H,
} from "../../components/v2";

// The 3 checkmark lines under the hero subtitle.
const HERO_CHECKS = ["10 enterprise services", "UAE & India based team", "Production in under 6 months"];
// Real Unsplash server-room photo — full-bleed hero background (dark overlay on top),
// same treatment as the careers page hero (src/page/v2/CareersV2.tsx).
import servicesHero from "../../assets/images/services-hero.jpg";

// SEO structured data — one schema.org "Service" entry per XERXEZ service.
const SERVICES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: (services as unknown as { title: string; description: string; slug: string }[]).map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.description,
      url: `https://www.xerxez.com/service/${s.slug}`,
      provider: { "@type": "Organization", name: "XERXEZ", url: "https://www.xerxez.com" },
    },
  })),
};

// Stat strip shown between the process band and the CTA.
const STATS = [
  { v: "8+",        l: "Services" },
  { v: "4+",        l: "Projects delivered" },
  { v: "AI-First",  l: "Architecture" },
  { v: "< 6 mo",    l: "Typical deployment" },
  { v: "99.9%",     l: "Uptime SLA" },
];

const ServicesV2 = () => (
  <XerxezShell>
    <SEO
      title="Our Services | AI ERP, DevSecOps, Cloud & More — XERXEZ India & UAE"
      description="Explore XERXEZ services: AI ERP, DevSecOps, cloud infrastructure, software development, mobile apps, AI training for enterprises in India, Dubai & Abu Dhabi UAE."
      canonical="/services"
      noIndex
      jsonLd={SERVICES_JSONLD}
    />

    {/* ── Hero — full-bleed server-room photo + dark navy overlay + soft red glow,
        left-aligned (photo/overlay unchanged). Fixed to exactly one viewport
        (height + minHeight: 100svh, overflow: hidden) so eyebrow, H1,
        subtitle, the 3 checkmarks and both CTAs are visible without
        scrolling. ── */}
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(160deg, #071a33 0%, #0d2d4e 100%)",   // navy fallback while the photo loads
      minHeight: "100svh", height: "100svh", display: "flex", alignItems: "center",
      paddingTop: V2_HEADER_H + 24, paddingBottom: 24,
    }}>
      {/* full-width background photo */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${servicesHero})`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />
      {/* dark navy overlay so the white hero text stays readable */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: T.scrim(0.50) }} />
      {/* soft red radial glow, top-right */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-25%", right: "-10%",
        width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, rgba(217,53,34,0.06) 45%, transparent 70%)`,
        filter: "blur(20px)", pointerEvents: "none",
      }} />
      {/* faint dot texture — softer/wider so it doesn't fight the photo underneath */}
      <DotGrid opacity={0.4} size={36} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 12 }}>
          <Eyebrow color={T.redLight} mb={0}>XERXEZ · OUR SERVICES</Eyebrow>
          <h1 style={{
            fontFamily: T.fontHead, fontWeight: 800,
            fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", lineHeight: 1.1,
            letterSpacing: "-0.02em", color: "#fff", margin: 0,
          }}>
            Enterprise software services built for lasting impact
          </h1>
          <p style={{
            fontFamily: T.fontBody, fontSize: "1.05rem", lineHeight: 1.6,
            color: "rgba(255,255,255,0.78)", margin: 0, maxWidth: 560,
          }}>
            From product strategy and design to engineering, AI, cloud, and quality assurance —
            one trusted partner across the full delivery lifecycle in UAE &amp; India.
          </p>

          {/* 3 checkmark lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HERO_CHECKS.map((label) => (
              <span key={label} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: T.fontHead, fontSize: "0.95rem", fontWeight: 600,
                color: "rgba(255,255,255,0.92)",
              }}>
                <CheckCircle2 size={18} strokeWidth={2.5} color={T.redLight} />
                {label}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 4 }}>
            <Btn href="#services">Explore services</Btn>{/* scrolls to <XerxezServiceDeepGrid> */}
            <Btn to="/contact" variant="outline" dark arrow={false}>Book a demo</Btn>
          </div>
        </div>
      </div>
    </section>

    <XerxezServiceDeepGrid />

    <XerxezProcess />

    {/* stat strip band */}
    <section style={{ background: T.lightAlt, borderBlock: `1px solid ${T.border}`, padding: "56px 0" }}>
      <div className="container">
        <Reveal>
          <V2StatStrip items={STATS} />
        </Reveal>
      </div>
    </section>

    <XerxezCtaBand />
  </XerxezShell>
);

export default ServicesV2;
