// SmartAssetTrackingPage.tsx
// Purpose: /v2/iot/smart-asset-tracking — first standalone IoT Solutions
//          detail page (hero, why-it-matters, operational advantages,
//          platform capabilities, closing CTA). Structure follows the same
//          pattern established by the industry detail pages (e.g.
//          ConstructionPage.tsx), adapted for IoT content per the client's
//          etiot.in reference.
// Used in: src/App.tsx (route: /v2/iot/smart-asset-tracking)
// Data source: original XERXEZ copy for this page (per the standing "original
//              copy allowed on industry/solution detail pages" decision —
//              never copied from a competitor). No invented statistics —
//              this page states no numeric claims.

import {
  Lock, BarChart3, AlertTriangle, MapPin,
  Navigation, Radio, Bluetooth, Bell, Package, Smartphone, LayoutDashboard,
  Zap, HardHat, ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IndustryHero, V2FeatureCard, DarkFeatureCard, V2_HEADER_H,
} from "../../../components/v2";

import heroImage from "../../../assets/images/iot/hero-smart-asset-tracking.jpg";
import illustrationImage from "../../../assets/images/iot/smart-asset-tracking-illustration.jpg";

const industryPad = { padding: "60px 0" };

// Closing CTA — 3 trust signals shown below the "Request a Demo" button.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,         text: "Fast Response — Within 24 hours" },
  { icon: HardHat,     text: "Solution Architect — Assigned to your project" },
  { icon: ShieldCheck, text: "No Lock-in — Full IP transfer on delivery" },
];

// "Operational Advantages" — 4 white cards.
const ADVANTAGES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Lock,         title: "Prevent asset loss and theft",          desc: "Monitor every asset in real time across locations to prevent losses, improve accountability, and eliminate the gaps left by manual tracking." },
  { icon: BarChart3,    title: "Improve operational productivity",      desc: "Real-time asset visibility reduces search time, prevents duplicate orders, and keeps operations running efficiently." },
  { icon: AlertTriangle, title: "Ensure compliance and audit readiness", desc: "Maintain a complete history of asset location, ownership, and usage with automated records. Stay audit-ready at all times." },
  { icon: MapPin,        title: "Gain instant location awareness",      desc: "Track asset locations in real time from a single dashboard across all sites. Detect anomalies early, respond faster." },
];

// "Platform Capabilities" — 9 numbered dark navy cards.
const CAPABILITIES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: MapPin,          title: "Real-Time Asset Tracking",         desc: "Follow asset movement continuously across sites, warehouses, and field operations." },
  { icon: Navigation,      title: "GPS-Based Location Monitoring",    desc: "Use GPS telemetry for outdoor and in-transit visibility of high-value equipment." },
  { icon: Radio,           title: "RFID Asset Identification",       desc: "Identify and scan assets quickly with RFID for warehouse and facility workflows." },
  { icon: Bluetooth,       title: "BLE Beacon Integration",          desc: "Extend indoor visibility with BLE beacons for zones where GPS is limited." },
  { icon: Bell,            title: "Geofencing and Location Alerts",  desc: "Trigger automated notifications when assets enter or leave defined boundaries." },
  { icon: BarChart3,       title: "Asset Utilization Analytics",     desc: "Understand how often assets are used so procurement and deployment decisions are based on evidence." },
  { icon: Package,         title: "Inventory Visibility",            desc: "Keep a live picture of inventory and equipment across locations instead of periodic audits." },
  { icon: Smartphone,      title: "Mobile Tracking Applications",    desc: "Give field teams and supervisors mobile access to location, status, and alerts." },
  { icon: LayoutDashboard, title: "Centralized Monitoring Dashboard", desc: "Manage assets, alerts, and utilization from a single operational command center." },
];

const SmartAssetTrackingPage = () => (
  <XerxezShell>
    <SEO
      title="Smart Asset Tracking | IoT Solutions | XERXEZ"
      description="Continuous, site-wide asset intelligence — GPS, RFID, BLE, geofencing, utilization analytics, and centralized monitoring for high-value assets and inventory."
      canonical="/v2/iot/smart-asset-tracking"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · SMART ASSET TRACKING"
      heading={<>You&apos;re Not Losing Assets. You&apos;re Losing Visibility Into Where They Are.</>}
      subtitle={<>
        Asset loss is a symptom. The underlying condition is operational blindness — procurement
        decisions made without utilization data, compliance records assembled from memory, and
        field teams working around equipment they can&apos;t find. We replace that blindness with
        continuous, site-wide asset intelligence.
      </>}
      heroImage={heroImage}
      ctaButtons={[
        { label: "Request a Demo", to: "/v2/contact" },
        { label: "View Capabilities", href: "#capabilities", variant: "outline", arrow: false },
      ]}
      maxWidth={720}
      overlayOpacity={0.70}
    />

    {/* ── Why It Matters — copy left, illustration right. ── */}
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow>Why Smart Asset Tracking Matters</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                lineHeight: 1.35, color: "#0F2C4D", margin: "14px 0 0",
              }}>
                Knowing where your assets are is the beginning. Knowing how they behave is the advantage.
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "24px 0 0" }}>
                Organizations with real-time asset visibility don&apos;t just reduce loss — they make
                fundamentally better decisions about deployment, maintenance, procurement, and
                compliance because they&apos;re working from accurate information instead of educated guesses.
              </p>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "20px 0 0" }}>
                Our Smart Asset Tracking platform is built on the belief that visibility at asset level
                isn&apos;t an operational luxury. It&apos;s the data foundation that makes every adjacent
                decision about deployment, maintenance, capital allocation, and regulatory accountability
                more reliable.
              </p>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal delay={80}>
              <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(7,26,51,0.15)" }}>
                <img
                  src={illustrationImage}
                  alt="Field team using a tablet and scanner to track asset location and status"
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: 520, minHeight: 520, objectFit: "cover", display: "block" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Operational Advantages — light gray band, 4 white lift-on-hover cards. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Operational Advantages" title="What continuous asset intelligence changes" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {ADVANTAGES.map((a, i) => (
            <div key={a.title} className="col-lg-3 col-md-6">
              <Reveal delay={i * 60} fill>
                <V2FeatureCard icon={<a.icon size={22} strokeWidth={2} />} title={a.title} desc={a.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Platform Capabilities — dark navy, 9 numbered cards, 3x3 grid. ── */}
    <section id="capabilities" style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden", scrollMarginTop: V2_HEADER_H + 20 }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="Platform Capabilities"
            title="What the Platform Is Built to Do"
            subtitle="Track high-value assets and inventory with GPS, RFID, BLE, geofencing, utilization analytics, and centralized monitoring."
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {CAPABILITIES.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <DarkFeatureCard icon={c.icon} title={c.title} desc={c.desc} index={i} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Closing CTA — navy band with red glow, custom copy (not the shared
        <XerxezCtaBand/>, whose fixed copy doesn't fit this page). ── */}
    <section style={{ background: T.navy, padding: "clamp(64px, 8vw, 104px) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
        width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`, pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <Eyebrow color={T.redLight}>Ready to Get Started</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead, fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800,
            lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 auto", maxWidth: 640,
          }}>
            Know What Your Assets Really Cost
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 620,
          }}>
            Let&apos;s map your asset environment, hardware mix, site count, and compliance
            requirements — and show you exactly what visibility at this level changes for your operations.
          </p>
          <Btn to="/v2/contact">Request a Demo</Btn>

          {/* 3 trust signals — centered row below the button */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", justifyContent: "center", marginTop: 34 }}>
            {CTA_TRUST_SIGNALS.map((s) => (
              <span key={s.text} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                <s.icon size={16} strokeWidth={2} color={T.redLight} />
                {s.text}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  </XerxezShell>
);

export default SmartAssetTrackingPage;
