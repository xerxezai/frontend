// AgricultureIoTPage.tsx
// Purpose: /iot/agriculture-iot — fifth standalone IoT Solutions detail
//          page. Same architecture and card language as
//          SmartAssetTrackingPage.tsx (hero, white lift cards, numbered dark
//          capability cards, closing CTA).
// Used in: src/App.tsx (route: /iot/agriculture-iot)
// Data source: original XERXEZ copy for this page (same standing allowance
//              as every other industry/solution detail page — never copied
//              from a competitor, no XERXEZ branding borrowed from any
//              reference site). No invented statistics.

import {
  CheckCircle2, Gauge, Droplet, CloudRain, Sprout, Wrench, Smartphone,
  Plug, Bell, MapPin, BarChart3, Brain,
  Target, Leaf, PawPrint, Eye, Zap,
  ShieldCheck, Layers, PenTool, Network, Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IndustryHero, V2FeatureCard, DarkFeatureCard, V2_HEADER_H,
} from "../../../components/v2";

import heroImage from "../../../assets/images/iot/hero-agriculture-iot.jpg";
import illustrationImage from "../../../assets/images/iot/agriculture-iot-illustration.jpg";

const industryPad = { padding: "60px 0" };

// Section 2 — "connecting farms" checklist (9 short labels).
const FARM_DATA_POINTS = [
  "Soil moisture", "Temperature", "Humidity",
  "Rainfall", "Water levels", "Crop conditions",
  "Equipment status", "Irrigation", "Livestock",
];

// Section 3 — "How It Works", 6 white lift cards.
const HOW_IT_WORKS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Gauge,      title: "Real-Time Soil Monitoring",          desc: "Monitor soil moisture, temperature, humidity and pH so farmers can make informed irrigation and crop management decisions." },
  { icon: Droplet,    title: "Smart Irrigation",                   desc: "Use real-time soil and environmental data to determine irrigation requirements and automate water delivery." },
  { icon: CloudRain,  title: "Weather & Environmental Monitoring", desc: "Connected weather stations monitor temperature, humidity, rainfall and wind to help farmers plan activities." },
  { icon: Sprout,     title: "Crop Monitoring",                    desc: "IoT devices provide continuous information about crop-growing conditions with AI-powered early issue detection." },
  { icon: Wrench,     title: "Equipment Monitoring",               desc: "Connected agricultural machinery monitored for location, utilization, fuel consumption and maintenance requirements." },
  { icon: Smartphone, title: "Remote Farm Management",             desc: "Access important farm information remotely through web and mobile applications from anywhere." },
];

// Section 4 — "Platform Capabilities", 9 numbered dark cards.
const CAPABILITIES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Plug,      title: "IoT Sensor Integration",     desc: "Connect soil, weather, water, temperature and GPS devices." },
  { icon: Droplet,   title: "Smart Irrigation Automation", desc: "Automated irrigation based on soil moisture and weather conditions." },
  { icon: Gauge,     title: "Soil Health Monitoring",     desc: "Track soil parameters and visualize historical and real-time data." },
  { icon: CloudRain, title: "Weather Monitoring",         desc: "Collect and analyze environmental data from connected weather stations." },
  { icon: Sprout,    title: "Crop & Field Monitoring",    desc: "Monitor fields and agricultural plots through centralized dashboards." },
  { icon: Bell,      title: "Alerts & Notifications",     desc: "Notifications when sensor readings cross predefined thresholds." },
  { icon: MapPin,    title: "Farm Equipment Tracking",    desc: "Monitor tractors, pumps, irrigation equipment and agricultural assets." },
  { icon: BarChart3, title: "Data Analytics",             desc: "Convert IoT data into dashboards, reports, trends and actionable insights." },
  { icon: Brain,     title: "AI-Powered Agriculture",     desc: "AI to identify patterns, detect anomalies and forecast conditions." },
];

// Section 5 — "Applications", 6 white lift cards.
const APPLICATIONS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Target,   title: "Precision Farming",         desc: "Use real-time data for targeted decisions on irrigation, fertilizers and crop management." },
  { icon: Droplet,  title: "Smart Irrigation",          desc: "Monitor soil moisture and automate water delivery based on actual conditions." },
  { icon: Leaf,     title: "Greenhouse Monitoring",     desc: "Monitor temperature, humidity, light and soil in controlled growing environments." },
  { icon: PawPrint, title: "Livestock Monitoring",      desc: "Track livestock location, activity, environmental conditions and health indicators." },
  { icon: Sprout,   title: "Crop Health Monitoring",    desc: "Combine sensors, cameras and AI to monitor crop conditions and detect issues early." },
  { icon: Droplet,  title: "Water Resource Management", desc: "Monitor water tanks, pipelines, pumps and irrigation systems." },
];

// Section 6 — "Benefits", 6 white lift cards.
const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Droplet,   title: "Optimize Water Consumption",    desc: "Real-time soil and environmental data helps determine when and where irrigation is required." },
  { icon: BarChart3, title: "Improve Resource Utilization",  desc: "Monitor water, energy, fertilizers and equipment to identify inefficiencies." },
  { icon: Eye,       title: "Reduce Manual Monitoring",      desc: "Automated sensors reduce the need for continuous manual field inspection." },
  { icon: Zap,       title: "Make Faster Decisions",         desc: "Real-time information allows farmers to respond to changing conditions quickly." },
  { icon: Wrench,    title: "Support Predictive Maintenance", desc: "Equipment data identifies abnormal conditions before unexpected failures." },
  { icon: Leaf,      title: "Increase Sustainability",       desc: "Data-driven resource management supports more efficient use of agricultural inputs." },
];

// Section 7 — "Why XERXEZ", 6 dark cards (no numbering).
const WHY_XERXEZ: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers,      title: "End-to-End Development",  desc: "From IoT architecture and device integration to applications, cloud and AI." },
  { icon: Network,     title: "Scalable Architecture",    desc: "From individual farms to large agricultural operations with thousands of connected devices." },
  { icon: PenTool,     title: "Custom Solutions",         desc: "Built around your crops, environmental conditions, workflows and equipment." },
  { icon: Eye,         title: "Real-Time Monitoring",     desc: "Live sensor and equipment data through intuitive dashboards and mobile apps." },
  { icon: Settings,    title: "Intelligent Automation",   desc: "Automate irrigation, alerts and workflows using IoT rules and AI." },
  { icon: ShieldCheck, title: "Secure & Reliable",        desc: "Secure device communication, authentication and reliable data processing." },
];

// Closing CTA — 3 trust signals below the button.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,         text: "Fast Response" },
  { icon: Layers,      text: "Custom Architecture" },
  { icon: ShieldCheck, text: "Enterprise Grade" },
];

const AgricultureIoTPage = () => (
  <XerxezShell>
    <SEO
      title="Agriculture IoT | IoT Solutions | XERXEZ"
      description="Monitor crops, soil, weather, irrigation, livestock and equipment in real time — reducing waste, improving yields and making every farming decision data-driven."
      canonical="/iot/agriculture-iot"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · AGRICULTURE IoT"
      heading={<>Transform Farming With Smart Agriculture Technology</>}
      subtitle={<>
        Agriculture is evolving from traditional farming to data-driven, connected and
        intelligent operations. Monitor crops, soil, weather, irrigation, livestock and
        equipment in real time — reducing waste, improving yields and making every farming
        decision based on accurate data rather than guesswork. Stop relying on manual
        observation and historical assumptions. Give your farming teams continuous visibility
        into soil conditions, crop health, irrigation requirements and equipment status — so
        resources are used efficiently and yields are maximized. Built for agricultural
        businesses and agri-tech companies in UAE &amp; India.
      </>}
      heroImage={heroImage}
      ctaButtons={[
        { label: "Request a Demo", to: "/contact" },
        { label: "View Capabilities", href: "#capabilities", variant: "outline", arrow: false },
      ]}
      overlayOpacity={0.70}
    />

    {/* ── What Is Smart Agriculture IoT — copy + checklist on the left, TALL
        image on the right (checklist sits below the paragraph, not beside
        the image). ── */}
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow>What Is Smart Agriculture IoT</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                lineHeight: 1.35, color: "#0F2C4D", margin: "14px 0 0",
              }}>
                Connecting Farms, Crops, Equipment &amp; Data
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "22px 0 0" }}>
                A smart agriculture system uses connected sensors and IoT devices to continuously
                collect information from agricultural environments. Soil moisture, temperature,
                humidity, rainfall, water levels, crop conditions and equipment status can be
                monitored through a centralized platform — enabling farmers to irrigate at the
                right time, monitor crop health and optimize water, fertilizers and energy usage.
              </p>
              {/* checklist — 3-column grid, directly below the paragraph */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 8px", marginTop: 32 }}>
                {FARM_DATA_POINTS.map((s) => (
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
                  alt="Center-pivot irrigation system watering a green crop field"
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
          <SectionHeading align="center" eyebrow="How It Works" title="From Traditional Farming to Data-Driven Farming" />
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
            title="One Connected Platform for Modern Farming"
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
          <SectionHeading align="center" eyebrow="Applications" title="Where IoT Agriculture Solutions Can Make an Impact" />
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
          <SectionHeading align="center" eyebrow="Benefits" title="Make Farming More Efficient, Productive &amp; Sustainable" />
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
            title="Technology That Connects Farming With Intelligence"
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
            Build Your Smart Agriculture Solution
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 640,
          }}>
            Looking to implement IoT in farming or build a next-generation smart farming system?
            Our IoT experts can help you define the right sensors, connectivity, platform
            architecture, applications and AI capabilities for your use case.
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

export default AgricultureIoTPage;
