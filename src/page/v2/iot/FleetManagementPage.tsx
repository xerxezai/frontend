// FleetManagementPage.tsx
// Purpose: /iot/fleet-management-systems — fourth standalone IoT
//          Solutions detail page. Same architecture and card language as
//          SmartAssetTrackingPage.tsx (hero, white lift cards, numbered dark
//          capability cards, closing CTA).
// Used in: src/App.tsx (route: /iot/fleet-management-systems)
// Data source: original XERXEZ copy for this page (same standing allowance
//              as every other industry/solution detail page — never copied
//              from a competitor, no XERXEZ branding borrowed from any
//              reference site). No invented statistics.

import {
  CheckCircle2, MapPin, Route, Gauge, Fuel, Wrench, MapPinned,
  LayoutDashboard, Truck, Users, Bell, BarChart3, Smartphone,
  Package, ShoppingBag, HardHat, Factory, Briefcase, Key,
  DollarSign, ShieldCheck, TrendingUp, Eye, Lock, Layers, PenTool, Plug,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IndustryHero, V2FeatureCard, DarkFeatureCard, V2_HEADER_H,
} from "../../../components/v2";

import heroImage from "../../../assets/images/iot/hero-fleet-management.jpg";
import illustrationImage from "../../../assets/images/iot/fleet-management-illustration.jpg";

const industryPad = { padding: "60px 0" };

// Section 2 — "connect every vehicle" checklist (9 short labels).
const FLEET_DATA_POINTS = [
  "Vehicle location", "Vehicle movement", "Route history",
  "Speed & driving behavior", "Fuel consumption", "Engine performance",
  "Vehicle utilization", "Idle time", "Delivery status",
];

// Section 3 — "How It Works", 6 white lift cards.
const HOW_IT_WORKS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: MapPin,    title: "Real-Time Vehicle Tracking",  desc: "Monitor live location and movement of all vehicles through GPS-enabled tracking devices." },
  { icon: Route,     title: "Route Optimization",          desc: "Analyze routes, traffic conditions and delivery schedules to identify more efficient paths." },
  { icon: Gauge,     title: "Driver Behavior Monitoring",  desc: "Monitor speeding, harsh braking, rapid acceleration and excessive idling to improve safety." },
  { icon: Fuel,      title: "Fuel Monitoring",             desc: "Track fuel consumption patterns and identify inefficiencies across the entire fleet." },
  { icon: Wrench,    title: "Vehicle Health Monitoring",   desc: "Connect vehicle sensors to monitor engine performance and maintenance indicators." },
  { icon: MapPinned, title: "Geofencing",                  desc: "Create virtual geographic boundaries and receive alerts when vehicles enter or leave defined areas." },
];

// Section 4 — "Platform Capabilities", 9 numbered dark cards.
const CAPABILITIES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: LayoutDashboard, title: "Live Fleet Dashboard",     desc: "Monitor all vehicles on an interactive map with real-time status." },
  { icon: Truck,           title: "Vehicle Management",       desc: "Maintain vehicle profiles, documents, service history and specifications." },
  { icon: Users,           title: "Driver Management",        desc: "Manage driver profiles, assignments, performance and driving events." },
  { icon: Route,           title: "Trip & Route Management",  desc: "Plan trips, monitor routes and analyze historical journeys." },
  { icon: MapPinned,       title: "Geofencing",                desc: "Create geographic boundaries and configure automated notifications." },
  { icon: Bell,            title: "Alerts & Notifications",   desc: "Alerts for speeding, unauthorized movement, route deviations and maintenance." },
  { icon: Wrench,          title: "Maintenance Management",   desc: "Track service schedules, repairs and maintenance alerts." },
  { icon: BarChart3,       title: "Fleet Analytics",          desc: "Analyze utilization, fuel consumption, driver performance and efficiency." },
  { icon: Smartphone,      title: "Mobile Fleet Management",  desc: "Mobile access for fleet managers and field teams." },
];

// Section 5 — "Use Cases", 6 white lift cards.
const USE_CASES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Package,     title: "Logistics & Transportation", desc: "Track commercial vehicles, optimize routes and improve fleet utilization." },
  { icon: ShoppingBag, title: "E-Commerce Delivery",        desc: "Monitor last-mile delivery vehicles with real-time delivery visibility." },
  { icon: HardHat,     title: "Construction",               desc: "Monitor heavy equipment, commercial vehicles and project logistics." },
  { icon: Factory,     title: "Oil & Gas",                  desc: "Track transportation vehicles, tankers and field-service assets." },
  { icon: Briefcase,   title: "Field Services",             desc: "Track service vehicles, coordinate field teams and optimize technician routes." },
  { icon: Key,         title: "Rental & Leasing",           desc: "Monitor vehicle locations, utilization, mileage and operational activity." },
];

// Section 6 — "Benefits", 6 white lift cards.
const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: DollarSign,  title: "Reduce Fuel Costs",             desc: "Analyze routes, idling and driving behavior to identify fuel savings." },
  { icon: ShieldCheck, title: "Improve Fleet Safety",          desc: "Monitor driving events to encourage safer driving practices." },
  { icon: TrendingUp,  title: "Increase Vehicle Utilization",  desc: "Understand how vehicles are used and identify underutilized resources." },
  { icon: Eye,         title: "Improve Delivery Visibility",   desc: "Real-time visibility into vehicle movement and delivery progress." },
  { icon: Lock,        title: "Reduce Unauthorized Use",       desc: "Use GPS and geofencing to identify unusual vehicle movement." },
  { icon: Wrench,      title: "Improve Maintenance Planning",  desc: "Use vehicle data to identify service requirements and reduce downtime." },
];

// Section 7 — "Why XERXEZ", 6 dark cards (no numbering).
const WHY_XERXEZ: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers,      title: "End-to-End IoT Expertise", desc: "From strategy and architecture to device integration and ongoing support." },
  { icon: PenTool,     title: "Custom Fleet Platforms",   desc: "Built around your vehicles, drivers, workflows and logistics processes." },
  { icon: Eye,         title: "Real-Time Visibility",     desc: "Monitor vehicles through centralized web and mobile applications." },
  { icon: Layers,      title: "Scalable Architecture",    desc: "From small fleets to large distributed transportation networks." },
  { icon: Plug,        title: "Supply Chain Integration", desc: "Connect fleet data with logistics, warehouse, inventory and enterprise systems." },
  { icon: ShieldCheck, title: "Secure & Reliable",        desc: "Device authentication, access control and data protection throughout." },
];

// Closing CTA — 3 trust signals below the button.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Gauge,       text: "Fast Response" },
  { icon: Layers,      text: "Custom Architecture" },
  { icon: ShieldCheck, text: "Enterprise Grade" },
];

const FleetManagementPage = () => (
  <XerxezShell>
    <SEO
      title="Fleet Management Systems | IoT Solutions | XERXEZ"
      description="Get real-time visibility into vehicle movement, driver behavior, fuel usage, maintenance, routes and delivery operations — across your entire fleet."
      canonical="/iot/fleet-management-systems"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · FLEET MANAGEMENT SYSTEMS"
      heading={<>Smarter Fleet Operations With GPS, IoT &amp; Real-Time Intelligence</>}
      subtitle={<>
        Managing a modern fleet requires more than knowing where vehicles are. Get real-time
        visibility into vehicle movement, driver behavior, fuel usage, maintenance
        requirements, route efficiency and delivery operations — across your entire fleet.
        Stop managing drivers and vehicles through phone calls, spreadsheets and manual logs.
        Give your fleet managers a single platform that monitors every vehicle, every route
        and every driver event in real time — so costs are controlled, safety is improved and
        deliveries are on time. Built for logistics, transportation and field service teams in
        UAE &amp; India.
      </>}
      heroImage={heroImage}
      ctaButtons={[
        { label: "Request a Demo", to: "/contact" },
        { label: "View Capabilities", href: "#capabilities", variant: "outline", arrow: false },
      ]}
      overlayOpacity={0.70}
    />

    {/* ── What Is Fleet Management IoT — copy + checklist on the left, TALL
        image on the right (checklist sits below the paragraph, not beside
        the image). ── */}
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow>What Is Fleet Management IoT</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                lineHeight: 1.35, color: "#0F2C4D", margin: "14px 0 0",
              }}>
                Connect Every Vehicle With Real-Time Intelligence
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "22px 0 0" }}>
                GPS tracking for fleet management uses GPS-enabled devices installed in vehicles to
                capture location, movement, speed, route and operational information. Combined with
                IoT technology, connected vehicles transmit real-time data to a centralized
                platform — enabling fleet managers to make faster, data-driven decisions.
              </p>
              {/* checklist — 3-column grid, directly below the paragraph */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 8px", marginTop: 32 }}>
                {FLEET_DATA_POINTS.map((s) => (
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
                  alt="Aerial view of a logistics yard with organized cargo containers"
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
          <SectionHeading align="center" eyebrow="How It Works" title="From Vehicle Tracking to Intelligent Fleet Operations" />
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
            title="One Platform to Monitor Your Entire Fleet"
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

    {/* ── Use Cases — white band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Use Cases" title="IoT-Powered Transportation for Multiple Industries" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {USE_CASES.map((u, i) => (
            <div key={u.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<u.icon size={22} strokeWidth={2} />} title={u.title} desc={u.desc} />
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
          <SectionHeading align="center" eyebrow="Benefits" title="Improve Fleet Performance With Real-Time Data" />
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
            title="Build Smarter Transportation With IoT"
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
            Build Your Connected Fleet Management Solution
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 640,
          }}>
            Looking to implement GPS tracking, connect your commercial vehicles or build an
            IoT-powered fleet management platform? Our IoT specialists can help you select the
            right tracking devices, platform and integrations.
          </p>
          <Btn to="/contact">Request a Demo</Btn>

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

export default FleetManagementPage;
