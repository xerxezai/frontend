// SmartBuildingPage.tsx
// Purpose: /v2/iot/smart-building-solutions — third standalone IoT Solutions
//          detail page. Same architecture and card language as
//          SmartAssetTrackingPage.tsx / IndustrialIoTPage.tsx (hero, white
//          lift cards, numbered dark capability cards, closing CTA).
// Used in: src/App.tsx (route: /v2/iot/smart-building-solutions)
// Data source: original XERXEZ copy for this page (same standing allowance
//              as every other industry/solution detail page — never copied
//              from a competitor, no XERXEZ branding borrowed from any
//              reference site). No invented statistics.

import {
  CheckCircle2, Gauge, Zap, Wind, Lightbulb, Wrench, Smartphone,
  Plug, LayoutDashboard, Bell, Settings, BarChart3, Building2,
  Briefcase, HeartPulse, BedDouble, GraduationCap, Factory,
  DollarSign, Eye, ShieldCheck, Leaf, Layers, PenTool, Network,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IndustryHero, V2FeatureCard, DarkFeatureCard, V2_HEADER_H,
} from "../../../components/v2";

import heroImage from "../../../assets/images/iot/hero-smart-building.jpg";
import illustrationImage from "../../../assets/images/iot/smart-building-illustration.jpg";

const industryPad = { padding: "60px 0" };

// Section 2 — "connect every building system" checklist (9 short labels).
const BUILDING_SYSTEMS = [
  "HVAC systems", "Lighting systems", "Energy consumption",
  "Occupancy", "Indoor air quality", "Temperature & humidity",
  "Access control", "Security systems", "Building assets",
];

// Section 3 — "How It Works", 6 white lift cards.
const HOW_IT_WORKS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Gauge,     title: "Real-Time Building Monitoring", desc: "Connected sensors collect temperature, humidity, occupancy and equipment status continuously." },
  { icon: Zap,       title: "Smart Energy Management",       desc: "Monitor energy consumption across floors and equipment to identify inefficiencies." },
  { icon: Wind,      title: "Intelligent HVAC Management",   desc: "Use occupancy data to optimize heating, ventilation and air conditioning." },
  { icon: Lightbulb, title: "Automated Lighting",             desc: "Smart lighting responds to occupancy, schedules and daylight conditions automatically." },
  { icon: Wrench,    title: "Predictive Maintenance",         desc: "Monitor equipment to identify abnormal conditions before they cause costly downtime." },
  { icon: Smartphone, title: "Remote Facility Management",    desc: "Monitor building conditions and respond to alerts from anywhere via web and mobile." },
];

// Section 4 — "Platform Capabilities", 7 numbered dark cards.
const CAPABILITIES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Plug,           title: "Device Management",         desc: "Register, configure and manage connected sensors and building devices." },
  { icon: LayoutDashboard, title: "Real-Time Dashboards",      desc: "View live information from all building systems through intuitive dashboards." },
  { icon: Bell,           title: "Alerts & Notifications",     desc: "Real-time alerts for energy anomalies, equipment failures and security events." },
  { icon: Settings,       title: "Automation & Rules",         desc: "Automated actions based on sensor data, schedules and occupancy." },
  { icon: BarChart3,      title: "Analytics & Reporting",      desc: "Analyze energy usage, equipment performance and occupancy trends." },
  { icon: Smartphone,     title: "Mobile Access",              desc: "Monitor and manage building operations from mobile devices anywhere." },
  { icon: Building2,      title: "Multi-Building Management",  desc: "Manage multiple buildings and facilities from one centralized platform." },
];

// Section 5 — "Applications", 6 white lift cards.
const APPLICATIONS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Building2,     title: "Commercial Buildings",       desc: "Optimize energy, occupancy, HVAC, lighting and security across office buildings." },
  { icon: Briefcase,     title: "Smart Offices",              desc: "Connected workplaces with intelligent lighting, climate control and room utilization." },
  { icon: HeartPulse,    title: "Hospitals",                  desc: "Monitor medical facility infrastructure, equipment, energy and critical building operations." },
  { icon: BedDouble,     title: "Hotels",                     desc: "Improve guest comfort through smart room controls, energy management and occupancy monitoring." },
  { icon: GraduationCap, title: "Educational Institutions",   desc: "Monitor classrooms, energy, security and facility utilization." },
  { icon: Factory,       title: "Industrial Facilities",      desc: "Connect buildings with industrial infrastructure for energy and safety monitoring." },
];

// Section 6 — "Benefits", 6 white lift cards.
const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Zap,          title: "Reduce Energy Consumption",  desc: "Use real-time data to identify inefficiencies and optimize building systems." },
  { icon: Gauge,        title: "Improve Occupant Comfort",   desc: "Monitor conditions and automate systems to maintain comfortable environments." },
  { icon: DollarSign,   title: "Reduce Maintenance Costs",   desc: "Identify equipment issues early and shift from reactive to proactive maintenance." },
  { icon: Eye,          title: "Improve Facility Visibility", desc: "Monitor all building systems through centralized dashboards." },
  { icon: ShieldCheck,  title: "Strengthen Security",        desc: "Connect access control, sensors and alerts into an integrated security ecosystem." },
  { icon: Leaf,         title: "Support Sustainability",     desc: "Use data-driven energy management for more sustainable building operations." },
];

// Section 7 — "Why XERXEZ", 6 dark cards (no numbering).
const WHY_XERXEZ: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers,      title: "End-to-End IoT Expertise",   desc: "From strategy and architecture to device integration and ongoing support." },
  { icon: PenTool,     title: "Custom-Built Solutions",     desc: "Designed around your building systems, facility workflows and business objectives." },
  { icon: Network,     title: "Scalable IoT Architecture",  desc: "From individual buildings to multi-building campuses and smart city infrastructure." },
  { icon: Eye,         title: "Real-Time Monitoring",       desc: "Centralized visibility into building systems, energy, environment and security." },
  { icon: Smartphone,  title: "Mobile & Web Applications",  desc: "Intuitive apps for facility teams to monitor, manage and respond from anywhere." },
  { icon: ShieldCheck, title: "Secure & Reliable",          desc: "Device security, authentication, access control and data protection throughout." },
];

// Closing CTA — 3 trust signals below the button.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,         text: "Fast Response" },
  { icon: Layers,      text: "Custom Architecture" },
  { icon: ShieldCheck, text: "Enterprise Grade" },
];

const SmartBuildingPage = () => (
  <XerxezShell>
    <SEO
      title="Smart Building Solutions | IoT Solutions | XERXEZ"
      description="Connect sensors, equipment, lighting, HVAC, security and building management systems into one unified digital ecosystem."
      canonical="/v2/iot/smart-building-solutions"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · SMART BUILDING SOLUTIONS"
      heading={<>Build Smarter, Safer &amp; More Connected Buildings</>}
      subtitle={<>
        Connect sensors, equipment, lighting, HVAC systems, security infrastructure and
        building management systems into one unified digital ecosystem — enabling real-time
        monitoring, automated workflows and intelligent facility management. Stop managing
        each building system in isolation. Give your facility managers a single platform that
        collects, processes and acts on data from every connected system — across single
        buildings, multi-site campuses and smart city infrastructure in UAE &amp; India.
      </>}
      heroImage={heroImage}
      ctaButtons={[
        { label: "Request a Demo", to: "/v2/contact" },
        { label: "View Capabilities", href: "#capabilities", variant: "outline", arrow: false },
      ]}
      overlayOpacity={0.70}
    />

    {/* ── What Are Smart Building Solutions — copy + checklist on the left,
        TALL image on the right (checklist sits below the paragraph, not
        beside the image). ── */}
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 60 }}>
          <div style={{ flex: "1 1 380px" }}>
            <Reveal>
              <Eyebrow>What Are Smart Building Solutions</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                lineHeight: 1.35, color: "#0F2C4D", margin: "14px 0 0",
              }}>
                Connect Every Building System Through IoT
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#5B6B7C", margin: "22px 0 0" }}>
                Smart building solutions connect the systems that already run a facility — HVAC,
                lighting, energy, access and security — into a single, structured data layer.
                Instead of each system operating in isolation, facility teams get one connected
                view of how the building actually behaves, in real time. That connected view is
                what turns a building from a collection of separate systems into a single
                intelligent environment facility teams can actually manage.
              </p>
              {/* checklist — 3-column grid, directly below the paragraph */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 8px", marginTop: 32 }}>
                {BUILDING_SYSTEMS.map((s) => (
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
          <div style={{ flex: "1 1 380px" }}>
            <Reveal delay={80}>
              <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(7,26,51,0.15)" }}>
                <img
                  src={illustrationImage}
                  alt="Modern building interior with connected architectural systems"
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
          <SectionHeading align="center" eyebrow="How It Works" title="From Conventional Buildings to Intelligent Infrastructure" />
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

    {/* ── Platform Capabilities — dark navy, 7 numbered cards, 3x3 grid. ── */}
    <section id="capabilities" style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden", scrollMarginTop: V2_HEADER_H + 20 }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="Platform Capabilities"
            title="One Digital Platform for Complete Building Visibility"
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

    {/* ── Applications — white band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Applications" title="Practical Applications of IoT in Buildings" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {APPLICATIONS.map((a, i) => (
            <div key={a.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<a.icon size={22} strokeWidth={2} />} title={a.title} desc={a.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Benefits — light gray band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Benefits" title="Make Buildings More Efficient, Sustainable &amp; Intelligent" />
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
            title="Build Intelligent Infrastructure With the Right Technology Partner"
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
            Build Your Smart Building Solution
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 640,
          }}>
            Looking to connect your building systems, reduce energy consumption or improve
            facility monitoring? Our IoT specialists can help you identify the right devices,
            platform and automation strategy.
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

export default SmartBuildingPage;
