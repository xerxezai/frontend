// SmartRetailPage.tsx
// Purpose: /iot/smart-retail — seventh and final standalone IoT
//          Solutions detail page. Same architecture and card language as
//          SmartAssetTrackingPage.tsx (hero, white lift cards, numbered dark
//          capability cards, closing CTA).
// Used in: src/App.tsx (route: /iot/smart-retail)
// Data source: original XERXEZ copy for this page (same standing allowance
//              as every other industry/solution detail page — never copied
//              from a competitor, no XERXEZ branding borrowed from any
//              reference site). No invented statistics.

import {
  CheckCircle2, Package, LayoutGrid, Users, Thermometer, LayoutDashboard, Smartphone,
  Plug, Building2, Bell, BarChart3, MapPin,
  TrendingUp, Eye, Sparkles, Wrench,
  ShoppingCart, ShoppingBag, Pill, Truck,
  ClipboardCheck, ShieldCheck, Smile, Gauge, Zap,
  Layers, PenTool, Network, Brain,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import {
  XerxezShell, T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IndustryHero, V2FeatureCard, DarkFeatureCard, V2_HEADER_H,
} from "../../../components/v2";

import heroImage from "../../../assets/images/iot/hero-smart-retail.jpg";
import illustrationImage from "../../../assets/images/iot/smart-retail-illustration.jpg";

const industryPad = { padding: "60px 0" };

// Section 2 — "connecting stores" checklist (9 short labels).
const RETAIL_DATA_POINTS = [
  "Inventory levels", "Product movement", "Shelf availability",
  "Customer footfall", "Store occupancy", "Equipment conditions",
  "Cold-chain temperatures", "Energy consumption", "Point-of-sale activity",
];

// Section 3 — "IoT Applications", 6 white lift cards.
const IOT_APPLICATIONS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Package,         title: "Smart Inventory Management",    desc: "Track products and inventory in real time to understand availability, location and replenishment needs." },
  { icon: LayoutGrid,      title: "Smart Shelves",                 desc: "Connected shelves monitor product availability and detect changes to identify empty or low-stock areas faster." },
  { icon: Users,           title: "Customer Footfall Monitoring",  desc: "Sensors provide store traffic, occupancy and movement data to optimize layouts and staffing." },
  { icon: Thermometer,     title: "Cold Chain Monitoring",         desc: "Temperature and humidity sensors continuously monitor refrigerators, freezers and temperature-sensitive inventory." },
  { icon: LayoutDashboard, title: "Smart Store Monitoring",        desc: "Monitor lighting, HVAC, energy, security and store infrastructure from a centralized platform." },
  { icon: Smartphone,      title: "Connected Customer Experiences", desc: "IoT devices support interactive displays, personalized experiences and location-based engagement." },
];

// Section 4 — "Platform Capabilities", 7 numbered dark cards.
const CAPABILITIES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Plug,            title: "IoT Device Management",   desc: "Register, configure and manage connected sensors, gateways and retail devices." },
  { icon: Package,         title: "Inventory Visibility",    desc: "Monitor product quantities, locations and stock conditions across stores and warehouses." },
  { icon: Building2,       title: "Store Monitoring",        desc: "Track occupancy, temperature, energy, equipment health and security events." },
  { icon: LayoutDashboard, title: "Real-Time Dashboards",    desc: "Centralized visibility into operational KPIs and connected devices." },
  { icon: Bell,            title: "Alerts & Notifications",  desc: "Immediate notifications when predefined conditions or thresholds are triggered." },
  { icon: BarChart3,       title: "Analytics & Reporting",   desc: "Analyze inventory trends, customer activity and equipment performance." },
  { icon: MapPin,          title: "Multi-Store Management",  desc: "Monitor multiple stores, locations and warehouses from one platform." },
];

// Section 5 — "AI in Retail", 6 white lift cards.
const AI_IN_RETAIL: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: TrendingUp, title: "Demand Forecasting",           desc: "AI analyzes sales, inventory, seasonal trends and customer behavior for accurate forecasting." },
  { icon: Package,    title: "Inventory Optimization",       desc: "AI identifies demand patterns to optimize inventory levels and replenishment strategies." },
  { icon: Eye,        title: "Computer Vision",               desc: "AI-powered cameras support shelf monitoring, product recognition and loss-prevention workflows." },
  { icon: Users,      title: "Customer Behavior Analysis",   desc: "Analyze movement and interaction patterns to understand how shoppers engage with stores." },
  { icon: Sparkles,   title: "Personalized Recommendations", desc: "AI analyzes customer behavior to support relevant product recommendations." },
  { icon: Wrench,     title: "Predictive Maintenance",       desc: "AI analyzes equipment data to identify failures in refrigeration, HVAC and retail infrastructure." },
];

// Section 6 — "Use Cases", 6 white lift cards.
const USE_CASES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: ShoppingCart, title: "Smart Supermarkets",          desc: "Monitor shelves, inventory, refrigeration, customer movement and store infrastructure." },
  { icon: ShoppingBag,  title: "Fashion Retail",               desc: "Track products, inventory, customer movement and store assets." },
  { icon: Package,      title: "Grocery Retail",               desc: "Inventory monitoring, cold-chain management and smart shelves." },
  { icon: Pill,         title: "Pharmacies",                   desc: "Monitor inventory, storage conditions and temperature-sensitive products." },
  { icon: Building2,    title: "Shopping Malls",               desc: "Monitor occupancy, energy, security, parking and connected infrastructure." },
  { icon: Truck,        title: "Warehouses & Distribution", desc: "Track inventory, assets, equipment and material movement." },
];

// Section 7 — "Benefits", 6 white lift cards.
const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: ClipboardCheck, title: "Improve Inventory Accuracy",  desc: "Real-time tracking reduces manual checks and provides better product visibility." },
  { icon: Package,        title: "Reduce Stockouts",            desc: "Automated monitoring identifies low-stock conditions earlier for faster replenishment." },
  { icon: ShieldCheck,    title: "Reduce Product Loss",         desc: "Connected tracking improves visibility into product movement and unusual activity." },
  { icon: Smile,          title: "Improve Customer Experience", desc: "Connected technologies support personalized and responsive retail experiences." },
  { icon: Gauge,          title: "Optimize Store Operations",   desc: "Real-time information helps managers identify operational inefficiencies." },
  { icon: Zap,            title: "Reduce Energy Costs",         desc: "Monitor HVAC, lighting and refrigeration to identify optimization opportunities." },
];

// Section 8 — "Why XERXEZ", 6 dark cards (no numbering).
const WHY_XERXEZ: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers,      title: "End-to-End IoT Expertise", desc: "From strategy and architecture to device integration and ongoing support." },
  { icon: PenTool,     title: "Retail-Focused Solutions", desc: "Designed around real retail workflows, stores, inventory and customer experiences." },
  { icon: Network,     title: "Scalable Architecture",    desc: "From single connected stores to large multi-location retail networks." },
  { icon: Brain,       title: "AI & Analytics Integration", desc: "Combine real-time IoT data with AI for intelligent insights and recommendations." },
  { icon: Smartphone,  title: "Custom Applications",      desc: "Web and mobile apps for store managers, operations teams and business leaders." },
  { icon: ShieldCheck, title: "Secure & Reliable",    desc: "Authentication, access controls, device security and data protection throughout." },
];

// Closing CTA — 3 trust signals below the button.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,         text: "Fast Response" },
  { icon: Layers,      text: "Custom Architecture" },
  { icon: ShieldCheck, text: "Enterprise Grade" },
];

const SmartRetailPage = () => (
  <XerxezShell>
    <SEO
      title="Smart Retail | IoT Solutions | XERXEZ"
      description="Connect stores, products, shelves, inventory, customers and business systems into a unified digital retail ecosystem — enabling real-time visibility and intelligent experiences."
      canonical="/iot/smart-retail"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · SMART RETAIL"
      heading={<>Transform Retail With Connected, Intelligent &amp; Data-Driven Technology</>}
      subtitle={<>
        Connect stores, products, shelves, inventory, customers and business systems into a
        unified digital retail ecosystem — enabling real-time visibility, automated operations
        and intelligent customer experiences. Stop managing inventory manually, losing stock
        to poor visibility and missing sales opportunities. Give your store managers and
        operations teams a single platform that monitors every shelf, every product and every
        customer interaction in real time — so decisions are based on data, not guesswork.
        Across UAE &amp; India.
      </>}
      heroImage={heroImage}
      ctaButtons={[
        { label: "Request a Demo", to: "/contact" },
        { label: "View Capabilities", href: "#capabilities", variant: "outline", arrow: false },
      ]}
      overlayOpacity={0.70}
    />

    {/* ── What Is Smart Retail — copy + checklist on the left, TALL image on
        the right (checklist sits below the paragraph, not beside the image). ── */}
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow>What Is Smart Retail</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                lineHeight: 1.35, color: "#0F2C4D", margin: "14px 0 0",
              }}>
                Connecting Stores, Products, Customers &amp; Data
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: "1.1rem", lineHeight: 1.9, color: "#0F2C4D", margin: "22px 0 0" }}>
                Smart retail uses connected technologies to create a more intelligent and automated
                retail environment. IoT devices and sensors collect real-time information from
                stores, inventory, shelves, equipment and customer interactions — enabling
                retailers to gain greater visibility and respond faster to changing conditions.
              </p>
              {/* checklist — 3-column grid, directly below the paragraph */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 8px", marginTop: 32 }}>
                {RETAIL_DATA_POINTS.map((s) => (
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
                  alt="Hand interacting with digital retail equipment in a grocery store"
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

    {/* ── IoT Applications — light gray band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="IoT Applications" title="Turn Retail Operations Into Connected Experiences" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {IOT_APPLICATIONS.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<c.icon size={22} strokeWidth={2} />} title={c.title} desc={c.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Platform Capabilities — dark navy, 7 numbered cards. ── */}
    <section id="capabilities" style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden", scrollMarginTop: V2_HEADER_H + 20 }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="Platform Capabilities"
            title="One Connected Platform for Modern Retail Operations"
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

    {/* ── AI in Retail — white band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="AI in Retail" title="Combine IoT Data With AI to Create Intelligent Retail" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {AI_IN_RETAIL.map((a, i) => (
            <div key={a.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<a.icon size={22} strokeWidth={2} />} title={a.title} desc={a.desc} />
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
          <SectionHeading align="center" eyebrow="Use Cases" title="Where IoT Can Transform Retail Operations" />
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

    {/* ── Benefits — white band, 6 white lift cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Benefits" title="Build More Efficient & Customer-Centric Stores" />
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
            title="From Connected Devices to Intelligent Retail Platforms"
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
            Build Your Smart Retail Solution
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 640,
          }}>
            Looking to improve inventory visibility, build a connected store or create an
            AI-powered customer experience? Our IoT specialists can help you identify the right
            devices, architecture and integration strategy.
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

export default SmartRetailPage;
