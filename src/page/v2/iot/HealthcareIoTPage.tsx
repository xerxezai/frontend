// HealthcareIoTPage.tsx
// Purpose: /v2/iot/healthcare-iot — sixth standalone IoT Solutions detail
//          page. Same architecture and card language as
//          SmartAssetTrackingPage.tsx (hero, white lift cards, numbered dark
//          capability cards, closing CTA).
// Used in: src/App.tsx (route: /v2/iot/healthcare-iot)
// Data source: original XERXEZ copy for this page (same standing allowance
//              as every other industry/solution detail page — never copied
//              from a competitor, no XERXEZ branding borrowed from any
//              reference site). No invented statistics. The Platform
//              Capabilities section carries an explicit AI disclaimer per
//              the client's brief — AI is framed as decision support for
//              clinicians, never a replacement for one.

import { useState } from "react";
import {
  CheckCircle2, Eye, Activity, Thermometer, ClipboardCheck, LayoutDashboard,
  HeartPulse, Smartphone, Plug, Bell, MapPin, BarChart3, ShieldCheck, Video,
  Watch, Pill, Building2, Stethoscope, Home, Users, Microscope, Package,
  Zap, TrendingUp, Gauge, Layers, PenTool, Network,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IconTile, V2_HEADER_H,
} from "../../../components/v2";

import heroImage from "../../../assets/images/iot/hero-healthcare-iot.jpg";
import illustrationImage from "../../../assets/images/iot/healthcare-iot-illustration.jpg";

const industryPad = { padding: "60px 0" };

// Section 2 — "connected healthcare" checklist (9 short labels).
const CONNECTED_DEVICES = [
  "Wearable health devices", "Patient monitoring", "Medical sensors",
  "Smart hospital equipment", "Environmental sensors", "Connected devices",
  "Remote monitoring systems", "Healthcare mobile apps", "Cloud platforms",
];

// Section 3 — "Connected Care Advantages", 5 white lift cards.
const CARE_ADVANTAGES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Eye,             title: "Detect Changes Earlier",         desc: "Continuous monitoring helps healthcare professionals identify changes earlier and support timely intervention." },
  { icon: Activity,        title: "Reduce Manual Monitoring",        desc: "Automated data collection reduces repetitive tasks so professionals can focus on patient care." },
  { icon: Thermometer,     title: "Monitor Healthcare Environments", desc: "Connected sensors monitor temperature, humidity and air quality across facilities." },
  { icon: ClipboardCheck,  title: "Improve Data Accuracy",           desc: "Automated timestamped data collection reduces manual documentation and creates consistent records." },
  { icon: LayoutDashboard, title: "Improve Operational Visibility",  desc: "Connect medical devices, equipment and systems into a centralized view of critical information." },
];

// Section 4 — "Platform Capabilities", 8 numbered dark cards.
const CAPABILITIES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: HeartPulse,  title: "Patient Monitoring",         desc: "Connect monitoring devices for continuous visibility into patient parameters." },
  { icon: Smartphone,  title: "Remote Health Tracking",     desc: "Access data from patients monitored outside clinical environments." },
  { icon: Plug,        title: "Medical Device Integration", desc: "Integrate connected medical equipment into centralized applications." },
  { icon: Bell,        title: "Real-Time Alert Management", desc: "Event-driven alerts based on device readings and predefined thresholds." },
  { icon: MapPin,      title: "Equipment Monitoring",       desc: "Track medical equipment status, location and utilization." },
  { icon: BarChart3,   title: "Healthcare Analytics",       desc: "Transform connected data into dashboards, reports and operational insights." },
  { icon: ShieldCheck, title: "Secure Data Management",     desc: "Access controls, encryption, auditability and data governance." },
  { icon: Video,       title: "Telehealth Integration",     desc: "Connect IoT data with digital healthcare and telemedicine workflows." },
];

// Section 5 — "Applications", 6 white lift cards.
const APPLICATIONS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Activity,   title: "Patient Vital Signs Monitoring", desc: "Connected devices capture vital sign information through centralized monitoring platforms." },
  { icon: Smartphone, title: "Remote Patient Monitoring",      desc: "Monitor patients remotely and receive health information without continuous physical presence." },
  { icon: Watch,      title: "Wearable Device Integration",    desc: "Smartwatches, fitness trackers and medical wearables provide health data for monitoring." },
  { icon: MapPin,     title: "Medical Equipment Monitoring",   desc: "Track status, location and utilization of connected equipment across facilities." },
  { icon: Pill,       title: "Medication Adherence Tracking",  desc: "Connected systems monitor medication schedules and provide adherence reminders." },
  { icon: BarChart3,  title: "Health Data Analytics",          desc: "Aggregate data from multiple devices into dashboards, trends and actionable insights." },
];

// Section 6 — "Use Cases", 6 white lift cards.
const USE_CASES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Building2,   title: "Hospitals",                     desc: "Monitor patients, medical equipment and critical healthcare infrastructure through connected systems." },
  { icon: Stethoscope, title: "Clinics",                       desc: "Connected monitoring devices to improve patient information management and operational visibility." },
  { icon: Home,        title: "Home Healthcare",                desc: "Remote monitoring through connected devices and mobile applications." },
  { icon: Users,       title: "Elderly Care",                  desc: "Remote monitoring and connected care workflows for elderly and assisted-care patients." },
  { icon: Microscope,  title: "Diagnostic Centers",             desc: "Connect medical equipment to improve equipment visibility and data management." },
  { icon: Package,     title: "Healthcare Asset Management",   desc: "Track medical equipment and devices using IoT-enabled technologies." },
];

// Section 7 — "Benefits", 6 white lift cards.
const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Activity,   title: "Continuous Monitoring",        desc: "Connected devices provide continuous data instead of periodic manual measurements." },
  { icon: Zap,        title: "Faster Response",               desc: "Real-time alerts help healthcare teams identify conditions requiring attention quickly." },
  { icon: TrendingUp, title: "Improved Efficiency",           desc: "Automation reduces repetitive monitoring and data-entry tasks." },
  { icon: Gauge,      title: "Better Equipment Utilization",  desc: "Connected monitoring helps understand where devices are and how they're used." },
  { icon: Smartphone, title: "Remote Healthcare",             desc: "IoT supports remote monitoring where patient information is collected outside facilities." },
  { icon: BarChart3,  title: "Data-Driven Decisions",         desc: "Aggregated data and analytics support more informed operational workflows." },
];

// Section 8 — "Why XERXEZ", 6 dark cards (no numbering).
const WHY_XERXEZ: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers,      title: "End-to-End IoT Expertise",   desc: "From consulting and architecture to device integration, analytics and support." },
  { icon: PenTool,     title: "Custom Healthcare Solutions", desc: "Built around your workflows, devices, users and operational requirements." },
  { icon: Eye,         title: "Real-Time Monitoring",        desc: "Centralized visibility into connected devices, patients, equipment and environments." },
  { icon: Network,     title: "Scalable Architecture",       desc: "From individual facilities to larger connected healthcare networks." },
  { icon: ShieldCheck, title: "Secure Data Management",      desc: "Security and access controls appropriate to healthcare data requirements." },
  { icon: Plug,        title: "Connected Ecosystem",         desc: "Integrate IoT with mobile apps, cloud platforms and existing healthcare systems." },
];

// Closing CTA — 3 trust signals below the button.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,         text: "Fast Response" },
  { icon: Layers,      text: "Custom Architecture" },
  { icon: ShieldCheck, text: "Secure by Design" },
];

// One white lift card — red icon tile, 3D lift on hover (translateY(-10px),
// deeper shadow), no rotation. Used for "Connected Care Advantages",
// "Applications", "Use Cases" and "Benefits".
const WhiteCard = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#fff", borderRadius: 16, padding: "28px 26px",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? "0 25px 50px rgba(7,26,51,0.20)" : "0 10px 30px rgba(7,26,51,0.08)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
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

// One dark navy card (#0d2a4a) — subtle border, 3D lift on hover (border
// turns red, deeper shadow), no rotation. `index` is optional: when given,
// the card shows a faded "01" style number (Platform Capabilities); when
// omitted, it's a plain icon card (Why XERXEZ).
const DarkCard = ({ icon: Icon, title, desc, index }: { icon: LucideIcon; title: string; desc: string; index?: number }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#0d2a4a", borderRadius: 16, padding: "24px 22px",
        border: `1px solid ${hover ? T.red : "rgba(255,255,255,0.08)"}`,
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? "0 24px 48px rgba(7,26,51,0.35)" : "0 10px 30px rgba(7,26,51,0.20)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${T.red}`, color: T.red,
        }}>
          <Icon size={18} strokeWidth={2} />
        </span>
        {index !== undefined && (
          <span style={{ fontFamily: T.fontHead, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

const HealthcareIoTPage = () => (
  <XerxezShell>
    <SEO
      title="Healthcare IoT | IoT Solutions | XERXEZ"
      description="Connect patients, medical devices, healthcare professionals and facilities through intelligent digital systems — enabling continuous monitoring and data-driven care."
      canonical="/v2/iot/healthcare-iot"
      noIndex
    />

    {/* ── Hero — shared IoT background (same image on every IoT page), navy
        scrim, left-aligned. ── */}
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
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(7,26,51,0.70)" }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "-25%", right: "-10%", width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, rgba(217,53,34,0.06) 45%, transparent 70%)`,
        filter: "blur(20px)", pointerEvents: "none",
      }} />
      <DotGrid opacity={0.4} size={36} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 14 }}>
          <Eyebrow color={T.redLight} mb={0}>XERXEZ · HEALTHCARE IoT</Eyebrow>
          <h1 style={{
            fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)",
            lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: 0,
          }}>
            Transform Healthcare With Connected, Intelligent Technology
          </h1>
          <p style={{ fontFamily: T.fontBody, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }}>
            Connect patients, medical devices, healthcare professionals and facilities through
            intelligent digital systems — enabling continuous monitoring, faster response and
            data-driven care. Stop relying on periodic manual observations and disconnected
            systems. Give your clinical and operations teams real-time visibility into patient
            parameters, medical equipment, facility conditions and healthcare workflows — so they
            can respond faster, reduce errors and deliver better care. Built for hospitals,
            clinics and healthcare networks in UAE &amp; India.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
            <Btn to="/v2/contact">Request a Demo</Btn>
            <Btn href="#capabilities" variant="outline" dark arrow={false}>View Capabilities</Btn>
          </div>
        </div>
      </div>
    </section>

    {/* ── Why IoT in Healthcare — copy + checklist on the left, TALL image on
        the right (checklist sits below the paragraph, not beside the image). ── */}
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow>Why IoT in Healthcare</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                lineHeight: 1.35, color: "#0F2C4D", margin: "14px 0 0",
              }}>
                Better Healthcare Decisions Start With Real-Time Information
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "22px 0 0" }}>
                The combination of IoT and healthcare is changing how patient care and operations
                are managed. Traditional monitoring depends on periodic measurements and manual
                observation. IoT enables continuous data collection from connected devices — so
                healthcare professionals have current information when it matters most.
              </p>
              {/* checklist — 3-column grid, directly below the paragraph */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 8px", marginTop: 32 }}>
                {CONNECTED_DEVICES.map((s) => (
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
                  alt="Stethoscope and smartphone representing connected healthcare technology"
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

    {/* ── Connected Care Advantages — light gray band, 5 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Connected Care Advantages" title="What IoT Changes in Healthcare Operations" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {CARE_ADVANTAGES.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <WhiteCard icon={c.icon} title={c.title} desc={c.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Platform Capabilities — dark navy, 8 numbered cards. ── */}
    <section id="capabilities" style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden", scrollMarginTop: V2_HEADER_H + 20 }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="Platform Capabilities"
            title="Technology Designed Around Modern Healthcare Requirements"
          />
        </Reveal>
        {/* AI disclaimer — required whenever AI-adjacent analytics/insights capabilities
            are described on a healthcare page: AI supports clinical judgment, it doesn't replace it. */}
        <p style={{
          fontFamily: T.fontBody, fontSize: 13, fontStyle: "italic", textAlign: "center",
          color: "rgba(255,255,255,0.5)", margin: "16px auto 0", maxWidth: 640,
        }}>
          AI-assisted insights are designed to support — not replace — the judgment of qualified healthcare professionals.
        </p>
        <div className="row g-4" style={{ marginTop: 40 }}>
          {CAPABILITIES.map((c, i) => (
            <div key={c.title} className="col-lg-3 col-md-6">
              <Reveal delay={(i % 4) * 60} fill>
                <DarkCard icon={c.icon} title={c.title} desc={c.desc} index={i} />
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
          <SectionHeading align="center" eyebrow="Applications" title="Practical Applications of Connected Healthcare Technology" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {APPLICATIONS.map((a, i) => (
            <div key={a.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <WhiteCard icon={a.icon} title={a.title} desc={a.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Use Cases — light gray band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Use Cases" title="Connecting Healthcare Across Different Environments" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {USE_CASES.map((u, i) => (
            <div key={u.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <WhiteCard icon={u.icon} title={u.title} desc={u.desc} />
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
          <SectionHeading align="center" eyebrow="Benefits" title="Improve Visibility, Efficiency &amp; Patient Engagement" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <WhiteCard icon={b.icon} title={b.title} desc={b.desc} />
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
            title="Build Reliable Connected Healthcare Experiences"
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {WHY_XERXEZ.map((w, i) => (
            <div key={w.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <DarkCard icon={w.icon} title={w.title} desc={w.desc} />
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
            Build Connected Healthcare Solutions
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 640,
          }}>
            Looking to connect medical devices, enable remote patient monitoring or build a
            connected healthcare platform? Our IoT specialists can help design an ecosystem
            around your healthcare requirements.
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

export default HealthcareIoTPage;
