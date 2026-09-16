// IndustrialIoTPage.tsx
// Purpose: /v2/iot/industrial-iot — second standalone IoT Solutions detail
//          page. Same architecture and card language as
//          SmartAssetTrackingPage.tsx (hero, white lift cards, numbered dark
//          capability cards, closing CTA), trimmed to exactly the sections
//          in this page's brief.
// Used in: src/App.tsx (route: /v2/iot/industrial-iot)
// Data source: original XERXEZ copy for this page (same standing allowance
//              as every other industry/solution detail page — never copied
//              from a competitor). No invented statistics.

import {
  CheckCircle2, Gauge, Wrench, BarChart3, Package, MapPin, Zap,
  Plug, Bell, LayoutDashboard, Network, TrendingUp, TrendingDown,
  DollarSign, Activity, PenTool, Eye, ShieldCheck, Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IndustryHero, V2FeatureCard, DarkFeatureCard, V2_HEADER_H,
} from "../../../components/v2";

import heroImage from "../../../assets/images/iot/hero-industrial-iot.jpg";
import illustrationImage from "../../../assets/images/iot/industrial-iot-illustration.jpg";

const industryPad = { padding: "60px 0" };

// Section 2 — "connected systems" checklist (9 short labels, 3x3 grid).
const CONNECTED_SYSTEMS = [
  "Machine performance", "Production output", "Equipment health",
  "Inventory levels", "Asset utilization", "Energy consumption",
  "Maintenance requirements", "Warehouse operations", "Material movement",
];

// Section 3 — "How It Works", 6 white lift cards.
const HOW_IT_WORKS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Gauge,     title: "Real-Time Machine Monitoring", desc: "Connect machines with IoT sensors to monitor temperature, vibration, pressure and critical parameters." },
  { icon: Wrench,    title: "Predictive Maintenance",       desc: "Analyze machine data to identify potential failures before they cause costly downtime." },
  { icon: BarChart3, title: "Production Monitoring",        desc: "Track output, machine utilization, cycle times and manufacturing KPIs through centralized dashboards." },
  { icon: Package,   title: "Smart Inventory Management",   desc: "Connect inventory and production systems for real-time visibility of materials and components." },
  { icon: MapPin,    title: "Industrial Asset Tracking",    desc: "Monitor location, movement and utilization of critical assets across facilities." },
  { icon: Zap,       title: "Energy Monitoring",            desc: "Track energy consumption across machines and facilities to optimize industrial energy usage." },
];

// Section 4 — "Platform Capabilities", 9 numbered dark cards.
const CAPABILITIES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Plug,            title: "IoT Device Integration",         desc: "Connect sensors, PLCs and industrial equipment into one unified data layer." },
  { icon: Gauge,            title: "Machine & Equipment Monitoring", desc: "Track machine health, performance and operating parameters continuously." },
  { icon: Wrench,           title: "Predictive Maintenance",        desc: "Flag equipment issues before they cause unplanned downtime." },
  { icon: Package,          title: "Inventory Monitoring",          desc: "Maintain real-time visibility of materials, components and stock levels." },
  { icon: MapPin,           title: "Asset Tracking",                desc: "Monitor the location and utilization of critical industrial assets." },
  { icon: BarChart3,        title: "Production Analytics",          desc: "Turn machine and process data into actionable manufacturing insights." },
  { icon: Bell,             title: "Alerts & Notifications",        desc: "Get notified instantly when equipment or processes need attention." },
  { icon: LayoutDashboard,  title: "IoT Dashboards",                desc: "View every connected system from a single operational dashboard." },
  { icon: Network,          title: "Enterprise Integration",        desc: "Connect the IoT layer to your existing business and operational systems." },
];

// Section 5 — "Benefits", 6 white lift cards.
const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: TrendingDown, title: "Reduce Equipment Downtime",  desc: "Real-time monitoring and predictive maintenance identify problems before major failures." },
  { icon: TrendingUp,   title: "Improve Productivity",       desc: "Monitor utilization and bottlenecks to improve overall operational efficiency." },
  { icon: Package,      title: "Optimize Inventory",         desc: "Improve accuracy and reduce excess stock, shortages and manual processes." },
  { icon: DollarSign,   title: "Reduce Operational Costs",   desc: "Identify inefficiencies, downtime, energy waste and maintenance costs." },
  { icon: LayoutDashboard, title: "Improve Decision-Making", desc: "Give decision-makers real-time operational information through dashboards." },
  { icon: Activity,     title: "Increase Asset Utilization", desc: "Understand where assets are, how they're used and when they need maintenance." },
];

// Section 6 — "Why XERXEZ", 6 dark cards (no numbering).
const WHY_XERXEZ: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers,      title: "End-to-End IoT Expertise", desc: "From consulting and architecture to development, deployment and support." },
  { icon: PenTool,     title: "Custom-Built Solutions",   desc: "Designed around your machines, workflows, inventory and operational requirements." },
  { icon: Network,     title: "Scalable Architecture",    desc: "Scale from individual facilities to multi-site operations with thousands of connected devices." },
  { icon: Eye,         title: "Real-Time Visibility",     desc: "Monitor equipment, production, inventory and assets through centralized dashboards." },
  { icon: Plug,        title: "Enterprise Integration",   desc: "Connect your IoT ecosystem with existing platform, inventory, maintenance and business applications." },
  { icon: ShieldCheck, title: "Secure & Reliable",        desc: "Security, device authentication, access control and data protection built throughout." },
];

// Closing CTA — 3 trust signals below the button.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,         text: "Fast Response" },
  { icon: Layers,      text: "Custom Architecture" },
  { icon: ShieldCheck, text: "Enterprise Grade" },
];

const IndustrialIoTPage = () => (
  <XerxezShell>
    <SEO
      title="Industrial IoT | IoT Solutions | XERXEZ"
      description="Connect machines, equipment, assets and enterprise systems into one unified digital industrial ecosystem — powered by real-time data and AI."
      canonical="/v2/iot/industrial-iot"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · INDUSTRIAL IoT"
      heading={<>Build Smarter, Connected &amp; Data-Driven Industrial Operations</>}
      subtitle={<>
        Connect machines, equipment, assets, inventory and enterprise systems into one unified
        digital industrial ecosystem — powered by real-time data, AI intelligence and
        predictive analytics. Stop managing isolated machines and manual processes. Give your
        plant managers, engineers and operations teams continuous visibility into every
        connected asset, production line and facility — so they can move from reactive
        operations to proactive, data-driven decision-making. Built for manufacturers and
        industrial teams in UAE &amp; India.
      </>}
      heroImage={heroImage}
      ctaButtons={[
        { label: "Request a Demo", to: "/v2/contact" },
        { label: "View Capabilities", href: "#capabilities", variant: "outline", arrow: false },
      ]}
      overlayOpacity={0.70}
    />

    {/* ── What Is Industrial IoT — copy + checklist on the left, TALL image
        on the right (checklist sits below the paragraph, not beside the
        image). ── */}
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow>What Is Industrial IoT</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                lineHeight: 1.35, color: "#0F2C4D", margin: "14px 0 0",
              }}>
                Connecting Machines, Assets, People &amp; Processes
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "22px 0 0" }}>
                Industrial IoT connects the machines, equipment and physical processes already
                running your operation into a single, structured data layer. Physical activity on
                the shop floor becomes information your teams can see, analyze and act on — in real
                time, across every connected system. That same layer is what turns scattered
                machine data into decisions your team can actually act on, instead of activity
                nobody downstream ever sees:
              </p>
              {/* checklist — 3-column grid, directly below the paragraph */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 8px", marginTop: 32 }}>
                {CONNECTED_SYSTEMS.map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <CheckCircle2 size={16} strokeWidth={2.5} color={T.red} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: T.fontHead, fontSize: 14, fontWeight: 600, color: T.headNavy, lineHeight: 1.4 }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal delay={80}>
              <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(7,26,51,0.15)" }}>
                <img
                  src={illustrationImage}
                  alt="Robotic arm performing precision automation on connected industrial equipment"
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

    {/* ── How It Works — light gray band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="How It Works" title="From Connected Machines to Intelligent Factories" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {HOW_IT_WORKS.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<c.icon size={22} strokeWidth={2} />} title={c.title} desc={c.desc} />
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
            title="Everything You Need to Build a Connected Industrial Ecosystem"
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

    {/* ── Benefits — white band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Benefits" title="Make Your Industrial Operations More Intelligent" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<b.icon size={22} strokeWidth={2} />} title={b.title} desc={b.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Why XERXEZ — dark navy, 6 plain (unnumbered) dark cards. ── */}
    <section style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="Why XERXEZ"
            title="Build a Connected Industrial Future With the Right Technology Partner"
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {WHY_XERXEZ.map((w, i) => (
            <div key={w.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <DarkFeatureCard icon={w.icon} title={w.title} desc={w.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Closing CTA — navy band with red glow, custom copy (not the shared
        <XerxezCtaBand/>). ── */}
    <section style={{ background: T.navy, padding: "clamp(64px, 8vw, 104px) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
        width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`, pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <Eyebrow color={T.redLight}>Get Started</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead, fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800,
            lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 auto", maxWidth: 640,
          }}>
            Build Your Industrial IoT Solution
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 640,
          }}>
            Looking to modernize your manufacturing operations, improve inventory visibility or
            connect your industrial assets? Our IoT specialists can help you identify the right
            use cases and implementation strategy.
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

export default IndustrialIoTPage;
