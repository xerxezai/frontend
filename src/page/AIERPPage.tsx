import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";

// ── colour tokens ─────────────────────────────────────────────────────────────
const C = {
  orange:      "#C9883A",
  orangeGrad:  "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)",
  orangeLight: "rgba(201,136,58,0.09)",
  orangeMid:   "rgba(201,136,58,0.18)",
  orangeBorder:"rgba(201,136,58,0.30)",
  orangeDeep:  "rgba(150,95,30,0.50)",
  coral:       "#cc785c",
  coralGrad:   "linear-gradient(145deg, #e09070 0%, #cc785c 100%)",
  coralDeep:   "rgba(140,70,40,0.45)",
  cream:       "#F8F7F4",
  beige:       "#F0EDE8",
  white:       "#FFFFFF",
  warmDark:    "#1a1208",
  dark:        "#1A1A1A",
  body:        "#4B4B4B",
  muted:       "#6B6B6B",
  light:       "#9B9B9B",
  border:      "rgba(0,0,0,0.07)",
  borderMed:   "rgba(0,0,0,0.11)",
};

// ── shadow system ─────────────────────────────────────────────────────────────
const shadow = {
  card:  "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.03)",
  hover: "0 2px 4px rgba(0,0,0,0.05), 0 12px 36px rgba(0,0,0,0.10), 0 28px 64px rgba(201,136,58,0.12)",
  badge: "0 4px 0 rgba(150,95,30,0.50), 0 6px 20px rgba(201,136,58,0.30)",
  badgeCoral: "0 4px 0 rgba(140,70,40,0.45), 0 6px 20px rgba(204,120,92,0.28)",
  ctaCard: "0 0 0 6px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.36)",
};

// ── SEO ───────────────────────────────────────────────────────────────────────
const useSEOMeta = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "AI-Powered ERP System | XERXEZ Enterprise Solutions";
    const upsert = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    upsert("description", "XERXEZ builds AI-powered ERP from scratch or upgrades your existing SAP, Oracle, or Microsoft Dynamics — enterprise-grade, government deployment ready, ISO 27001 and SOC 2 aligned.");
    upsert("keywords", "AI ERP, enterprise resource planning, SAP upgrade, Oracle AI, ERP software, XERXEZ, government ERP, ministry ERP, cloud ERP");
    return () => { document.title = prev; };
  }, []);
};

// ── reusable 3D card ──────────────────────────────────────────────────────────
interface Card3DProps {
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
  className?: string;
  padding?: string;
  radius?: number;
}
const Card3D = ({ children, accent = C.orange, style, className = "", padding = "28px 26px", radius = 16 }: Card3DProps) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      style={{
        background: C.white,
        borderRadius: radius,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${accent}`,
        boxShadow: hovered ? shadow.hover : shadow.card,
        transform: hovered ? "translateY(-7px)" : "translateY(0)",
        transition: "transform 280ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
        padding,
        cursor: "default",
        height: "100%",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};

// ── 3D icon badge ─────────────────────────────────────────────────────────────
const IconBadge = ({ icon, size = 48, coral = false }: { icon: string; size?: number; coral?: boolean }) => (
  <div style={{
    width: size, height: size,
    borderRadius: Math.round(size * 0.292),
    background: coral ? C.coralGrad : C.orangeGrad,
    boxShadow: coral ? shadow.badgeCoral : shadow.badge,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginBottom: 20,
  }}>
    <i className={icon} style={{ color: "#fff", fontSize: size * 0.40 }} />
  </div>
);

// ── section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ marginBottom: 14 }}>
    <span style={{
      display: "inline-block", background: C.orangeLight, color: C.orange,
      fontSize: 11, fontWeight: 700, padding: "5px 18px", borderRadius: 20,
      letterSpacing: "0.14em", textTransform: "uppercase",
      border: `1px solid ${C.orangeBorder}`, fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </span>
  </div>
);

// ── 1. HERO ───────────────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{ background: C.cream, padding: "148px 0 96px", position: "relative", overflow: "hidden" }}>
    {/* warm radial accents */}
    <span style={{ position: "absolute", top: -120, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
    <span style={{ position: "absolute", bottom: -80, left: "20%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 40 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <li><Link to="/" style={{ color: C.muted, fontSize: 13, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Home</Link></li>
          <li style={{ color: C.light, fontSize: 13 }}>/</li>
          <li><Link to="/service" style={{ color: C.muted, fontSize: 13, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Services</Link></li>
          <li style={{ color: C.light, fontSize: 13 }}>/</li>
          <li style={{ color: C.dark, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>AI-Powered ERP</li>
        </ol>
      </nav>

      <div className="row align-items-center g-5">
        {/* Left */}
        <div className="col-lg-7">
          {/* Badges */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", background: C.orangeGrad, color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 20, letterSpacing: 0.3, boxShadow: `0 3px 0 ${C.orangeDeep}, 0 5px 12px rgba(201,136,58,0.26)`, fontFamily: "'DM Sans', sans-serif" }}>Flagship</span>
            <span style={{ display: "inline-block", background: C.white, color: C.orange, fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 20, border: `1px solid ${C.orangeBorder}`, boxShadow: shadow.card, fontFamily: "'DM Sans', sans-serif" }}>AI Powered</span>
            <span style={{ display: "inline-block", background: C.white, color: C.orange, fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 20, border: `1px solid ${C.orangeBorder}`, boxShadow: shadow.card, fontFamily: "'DM Sans', sans-serif" }}>Enterprise Ready</span>
          </div>

          <h1 style={{ color: C.dark, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.1, marginBottom: 24, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.025em" }}>
            Intelligent ERP for
            <br />
            <em style={{ color: C.orange, fontStyle: "italic" }}>Enterprise Operations</em>
          </h1>

          <p style={{ color: C.body, fontSize: 17, lineHeight: 1.78, marginBottom: 44, maxWidth: 560, fontFamily: "'DM Sans', sans-serif" }}>
            XERXEZ builds AI-powered ERP from scratch or layers intelligent
            automation onto your existing SAP, Oracle, or Microsoft Dynamics
            &mdash; without migration risk, without operational downtime.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
            <Link to="/contact" className="theme-btn" style={{ fontSize: 15, padding: "13px 32px" }}>
              Request a Demo
              <i className="far fa-arrow-right" />
            </Link>
            <a
              href="mailto:info@xerxez.com?subject=Enterprise ERP Enquiry"
              style={{ background: C.white, color: C.dark, padding: "13px 28px", borderRadius: 8, fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${C.borderMed}`, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", boxShadow: shadow.card }}
            >
              <i className="fas fa-envelope" style={{ fontSize: 13, color: C.orange }} />
              Contact Enterprise Sales
            </a>
          </div>

          {/* Trust bar */}
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", alignItems: "stretch", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: shadow.card, background: C.white, maxWidth: 560 }}>
            {[
              { icon: "fas fa-certificate",     label: "ISO 27001" },
              { icon: "fas fa-clipboard-check", label: "SOC 2 Type II" },
              { icon: "fas fa-server",           label: "99.9% Uptime" },
              { icon: "fas fa-cloud",            label: "AWS / Azure / GCP" },
            ].map((t, i) => (
              <div key={t.label} style={{ flex: "1 1 120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 10px", gap: 6, borderLeft: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <i className={t.icon} style={{ color: C.orange, fontSize: 16 }} />
                <span style={{ color: C.body, fontSize: 11, fontWeight: 600, textAlign: "center", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 2×2 stat grid — 3D raised cards */}
        <div className="col-lg-5 col-md-8 col-sm-10">
          <div className="row g-3">
            {[
              { val: "40%",   label: "Reduction in operational costs",  icon: "fas fa-chart-line" },
              { val: "60%",   label: "Faster management decisions",     icon: "fas fa-tachometer-alt" },
              { val: "<6 mo", label: "Full deployment timeline",        icon: "fas fa-calendar-check" },
              { val: "99.9%", label: "System availability SLA",        icon: "fas fa-server" },
            ].map((s) => (
              <div key={s.val} className="col-6">
                <Card3D padding="24px 20px">
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: C.orangeGrad, boxShadow: shadow.badge, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <i className={s.icon} style={{ color: "#fff", fontSize: 16 }} />
                  </div>
                  <div style={{ color: C.dark, fontSize: "clamp(26px, 3.2vw, 34px)", fontWeight: 800, lineHeight: 1, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
                    {s.val}
                  </div>
                  <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.45, fontFamily: "'DM Sans', sans-serif" }}>
                    {s.label}
                  </div>
                </Card3D>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── 2. TWO DELIVERY MODELS ────────────────────────────────────────────────────
const TrackCard = ({ accent, accentGrad, accentDeep, accentLight, track, icon, title, desc, bullets, info, systems }: {
  accent: string; accentGrad: string; accentDeep: string; accentLight: string;
  track: string; icon: string; title: string; desc: string;
  bullets: string[]; info: string; systems?: string[];
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: C.white, borderRadius: 18,
        border: `1px solid ${C.border}`, borderTop: `3px solid ${accent}`,
        boxShadow: hovered ? shadow.hover : shadow.card,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 280ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
        padding: "44px 40px", height: "100%", cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 52, height: 52, borderRadius: 15, background: accentGrad, boxShadow: `0 4px 0 ${accentDeep}, 0 6px 18px rgba(201,136,58,0.22)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <i className={icon} style={{ color: "#fff", fontSize: 22 }} />
      </div>
      <span style={{ display: "inline-block", background: accentLight, color: accent, fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, border: `1px solid ${accent}44`, marginBottom: 16, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{track}</span>
      <h3 style={{ fontWeight: 800, fontSize: 24, color: C.dark, marginBottom: 12, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>{title}</h3>
      <p style={{ color: C.body, fontSize: 15, lineHeight: 1.72, marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
      <ul style={{ padding: 0, margin: 0, marginBottom: 28 }}>
        {bullets.map((item) => (
          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 11, listStyle: "none", color: C.body, fontSize: 14.5, lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
            <i className="fas fa-check-circle" style={{ color: accent, fontSize: 15, marginTop: 2, flexShrink: 0 }} />
            {item}
          </li>
        ))}
      </ul>
      {/* inset info box */}
      <div style={{ padding: "16px 20px", background: C.cream, borderRadius: 10, borderLeft: `3px solid ${accent}`, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)" }}>
        <p style={{ margin: 0, color: C.body, fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }} dangerouslySetInnerHTML={{ __html: info }} />
      </div>
      {systems && (
        <div style={{ marginTop: 22 }}>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Compatible Systems</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {systems.map((sys) => (
              <span key={sys} style={{ background: C.cream, color: C.body, fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20, border: `1px solid ${C.border}`, fontFamily: "'DM Sans', sans-serif", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                {sys}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TwoTracks = () => (
  <section style={{ padding: "96px 0", background: C.white }}>
    <div className="container">
      <div className="text-center" style={{ marginBottom: 60 }}>
        <SectionLabel>Two Delivery Models</SectionLabel>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 42px)", color: C.dark, lineHeight: 1.15, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
          Build New. Or Make Existing
          <span style={{ color: C.orange }}> Intelligent.</span>
        </h2>
        <p style={{ color: C.body, fontSize: 17, marginTop: 16, maxWidth: 580, marginInline: "auto", fontFamily: "'DM Sans', sans-serif" }}>
          XERXEZ is the only enterprise technology partner that delivers both paths with equal depth &mdash; no trade-offs.
        </p>
      </div>
      <div className="row g-4">
        <div className="col-lg-6">
          <TrackCard
            accent={C.orange} accentGrad={C.orangeGrad} accentDeep={C.orangeDeep} accentLight={C.orangeLight}
            track="Track A" icon="fas fa-code-branch"
            title="We Build Your AI ERP from Scratch"
            desc="A purpose-built, cloud-native ERP designed entirely around your business model, industry, and compliance requirements. No legacy constraints. No forced compromises."
            bullets={[
              "Fully custom modules: Finance, HR, CRM, Inventory, Sales, Logistics",
              "AI demand forecasting & anomaly detection baked in from day one",
              "API-first architecture — integrates with any third-party platform",
              "Role-based dashboards for C-suite, department heads, and field staff",
              "Multi-currency, multi-language, multi-entity support",
              "White-labelled, fully owned IP transferred to you at delivery",
            ]}
            info="<strong>Typical timeline:</strong> 4&ndash;6 months for a fully operational system with live AI analytics and role dashboards."
          />
        </div>
        <div className="col-lg-6">
          <TrackCard
            accent={C.coral} accentGrad={C.coralGrad} accentDeep={C.coralDeep} accentLight="rgba(204,120,92,0.09)"
            track="Track B" icon="fas fa-layer-group"
            title="We Upgrade Your Existing ERP with AI"
            desc="Your organisation has already invested in SAP, Oracle, or Microsoft Dynamics. XERXEZ layers an intelligent AI engine on top — zero migration risk, zero downtime."
            bullets={[
              "Compatible with SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365",
              "AI forecasting & automation added via secure API bridge",
              "Real-time data unification across existing modules and silos",
              "Predictive maintenance, procurement automation, HR analytics",
              "Compliance-safe: no changes to your existing data schema",
              "Live within 8–12 weeks alongside your running production system",
            ]}
            info="<strong>No disruption guarantee:</strong> Our AI layer runs via secure middleware &mdash; your ERP keeps running exactly as today."
            systems={["SAP", "Oracle", "MS Dynamics", "NetSuite", "Odoo", "Sage"]}
          />
        </div>
      </div>
    </div>
  </section>
);

// ── 3. COMPARISON TABLE ───────────────────────────────────────────────────────
const ComparisonTable = () => {
  const rows = [
    { feature: "Starting point",         build: "Greenfield — designed from scratch",         upgrade: "Your existing SAP / Oracle / Dynamics" },
    { feature: "Deployment timeline",    build: "4 – 6 months",                              upgrade: "8 – 12 weeks" },
    { feature: "Data migration",         build: "Full migration with cleansing",              upgrade: "No migration — reads existing data" },
    { feature: "Customisation level",    build: "100% custom to your processes",              upgrade: "AI layer adapts to existing setup" },
    { feature: "IP ownership",           build: "Full IP transferred to client",              upgrade: "AI modules fully owned by client" },
    { feature: "Operational disruption", build: "Phased cutover, minimal downtime",           upgrade: "Zero downtime — runs alongside live ERP" },
    { feature: "Compliance changes",     build: "Full compliance architecture built in",      upgrade: "No changes to existing compliance posture" },
    { feature: "Ideal for",             build: "No ERP, legacy system, or full replatform",  upgrade: "Existing enterprise ERP investment" },
  ];

  return (
    <section style={{ padding: "96px 0", background: C.beige }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 52 }}>
          <SectionLabel>Side-by-Side Comparison</SectionLabel>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(24px, 3vw, 40px)", color: C.dark, lineHeight: 1.15, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
            Build from Scratch vs Upgrade Existing ERP
          </h2>
          <p style={{ color: C.body, fontSize: 16, marginTop: 14, maxWidth: 540, marginInline: "auto", fontFamily: "'DM Sans', sans-serif" }}>
            Choose the path that fits your organisation. Both deliver the same AI-powered outcome &mdash; with different starting points.
          </p>
        </div>

        {/* table raised as a card */}
        <div style={{ borderRadius: 18, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.orange}`, overflow: "hidden", boxShadow: shadow.hover }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, background: C.white }}>
              <thead>
                <tr>
                  <th style={{ padding: "18px 24px", background: C.beige, textAlign: "left", fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.09em", textTransform: "uppercase", borderBottom: `2px solid ${C.borderMed}`, width: "28%", fontFamily: "'DM Sans', sans-serif" }}>
                    Feature
                  </th>
                  <th style={{ padding: "18px 24px", background: C.orangeLight, textAlign: "left", fontSize: 14, fontWeight: 800, color: C.orange, borderBottom: `2px solid ${C.orangeBorder}`, width: "36%", fontFamily: "'DM Sans', sans-serif" }}>
                    <i className="fas fa-code-branch" style={{ marginRight: 8 }} />Build from Scratch
                  </th>
                  <th style={{ padding: "18px 24px", background: "rgba(204,120,92,0.08)", textAlign: "left", fontSize: 14, fontWeight: 800, color: C.coral, borderBottom: "2px solid rgba(204,120,92,0.28)", width: "36%", fontFamily: "'DM Sans', sans-serif" }}>
                    <i className="fas fa-layer-group" style={{ marginRight: 8 }} />Upgrade Existing ERP
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? C.white : "#FDFCFA" }}>
                    <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700, color: C.dark, borderBottom: `1px solid ${C.border}`, fontFamily: "'DM Sans', sans-serif" }}>{row.feature}</td>
                    <td style={{ padding: "16px 24px", fontSize: 14, color: C.body, borderBottom: `1px solid ${C.border}`, borderLeft: `3px solid ${C.orangeBorder}`, fontFamily: "'DM Sans', sans-serif" }}>
                      <i className="fas fa-check-circle" style={{ color: C.orange, marginRight: 8, fontSize: 13 }} />{row.build}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: 14, color: C.body, borderBottom: `1px solid ${C.border}`, borderLeft: "3px solid rgba(204,120,92,0.28)", fontFamily: "'DM Sans', sans-serif" }}>
                      <i className="fas fa-check-circle" style={{ color: C.orange, marginRight: 8, fontSize: 13 }} />{row.upgrade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row g-3 mt-4">
          <div className="col-md-6">
            <Link to="/contact?type=build" className="theme-btn d-block text-center" style={{ justifyContent: "center" }}>
              Start a Build Consultation <i className="far fa-arrow-right" />
            </Link>
          </div>
          <div className="col-md-6">
            <a
              href="mailto:info@xerxez.com?subject=ERP Upgrade Enquiry"
              style={{ display: "block", textAlign: "center", background: C.white, color: C.orange, padding: "13px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: `2px solid ${C.orange}`, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", boxShadow: shadow.card }}
            >
              Enquire About an ERP Upgrade <i className="far fa-arrow-right" style={{ marginLeft: 8 }} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── 4. BUSINESS IMPACT ────────────────────────────────────────────────────────
const ROISection = () => (
  <section style={{ padding: "96px 0", background: C.white }}>
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-5">
          <SectionLabel>Business Impact</SectionLabel>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 42px)", color: C.dark, lineHeight: 1.15, marginBottom: 20, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
            Measurable ROI from<span style={{ color: C.orange }}> Day One</span>
          </h2>
          <p style={{ color: C.body, fontSize: 16, lineHeight: 1.78, marginBottom: 36, fontFamily: "'DM Sans', sans-serif" }}>
            XERXEZ ERP deployments are benchmarked against client KPIs from day one.
            Our AI layer generates measurable value within the first 30 days of go-live.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { pct: 40, label: "Reduction in operational overhead" },
              { pct: 60, label: "Faster executive reporting cycles" },
              { pct: 35, label: "Decrease in procurement errors" },
              { pct: 50, label: "Reduction in manual data entry" },
            ].map((r) => (
              <div key={r.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ color: C.body, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{r.label}</span>
                  <span style={{ color: C.orange, fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{r.pct}%</span>
                </div>
                <div style={{ height: 9, background: C.orangeLight, borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ width: `${r.pct}%`, height: "100%", background: C.orangeGrad, borderRadius: 8, boxShadow: "0 2px 6px rgba(201,136,58,0.35)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="row g-3">
            {[
              { icon: "fas fa-brain",     title: "Predictive Intelligence", desc: "AI models predict demand, cash flow, and staffing 12 weeks ahead — giving leadership data to act before problems materialise." },
              { icon: "fas fa-robot",     title: "Process Automation",      desc: "Repetitive tasks — PO approvals, invoice matching, payroll, stock replenishment — execute automatically with full audit trails." },
              { icon: "fas fa-chart-pie", title: "Unified Data Layer",      desc: "All departments share a single source of truth. Finance, HR, sales, and ops flow through one intelligent data layer." },
              { icon: "fas fa-bell",      title: "Proactive Alerts",        desc: "The system flags anomalies — expense spikes, stock shortfalls, SLA breaches — before they escalate, with recommended actions." },
            ].map((item) => (
              <div key={item.title} className="col-sm-6">
                <Card3D padding="26px 24px">
                  <IconBadge icon={item.icon} size={46} />
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: C.dark, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h4>
                  <p style={{ color: C.body, fontSize: 13.5, lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
                </Card3D>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── 5. PLATFORM MODULES ───────────────────────────────────────────────────────
const moduleList = [
  { icon: "fas fa-chart-bar",            title: "Finance & Accounting",     desc: "GL, AP/AR, budgeting, financial reporting, multi-currency" },
  { icon: "fas fa-users",                title: "Human Resources",          desc: "Payroll, leave management, recruitment, performance reviews" },
  { icon: "fas fa-boxes",                title: "Inventory & Supply Chain", desc: "Stock management, warehouse ops, supplier portal, demand planning" },
  { icon: "fas fa-handshake",            title: "CRM & Sales",              desc: "Pipeline management, lead scoring, quote generation, customer 360" },
  { icon: "fas fa-file-invoice-dollar",  title: "Invoicing & Billing",      desc: "Automated invoicing, payment tracking, subscription billing" },
  { icon: "fas fa-shopping-cart",        title: "Procurement & Purchases",  desc: "PO management, vendor evaluation, 3-way matching" },
  { icon: "fas fa-truck",                title: "Logistics & Dispatch",     desc: "Fleet tracking, route optimisation, delivery confirmation" },
  { icon: "fas fa-brain",                title: "AI Analytics Engine",      desc: "Demand forecasting, anomaly detection, executive dashboards" },
  { icon: "fas fa-shield-alt",           title: "Compliance & Audit",       desc: "Automated audit trails, regulatory reports, access control logs" },
];

const Modules = () => (
  <section style={{ padding: "96px 0", background: C.cream }}>
    <div className="container">
      <div className="text-center" style={{ marginBottom: 56 }}>
        <SectionLabel>Platform Modules</SectionLabel>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 42px)", color: C.dark, lineHeight: 1.15, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
          Every Function. One Intelligent Platform.
        </h2>
        <p style={{ color: C.body, fontSize: 17, marginTop: 16, maxWidth: 560, marginInline: "auto", fontFamily: "'DM Sans', sans-serif" }}>
          All modules are interconnected, AI-informed, and deployable independently or as a complete suite.
        </p>
      </div>
      <div className="row g-4">
        {moduleList.map((mod) => (
          <div key={mod.title} className="col-lg-4 col-md-6">
            <Card3D padding="30px 26px">
              <IconBadge icon={mod.icon} size={50} />
              <h4 style={{ fontWeight: 700, fontSize: 17, color: C.dark, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{mod.title}</h4>
              <p style={{ color: C.body, fontSize: 14, lineHeight: 1.68, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{mod.desc}</p>
            </Card3D>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── 6. TRUSTED ACROSS INDUSTRIES ──────────────────────────────────────────────
const ClientLogos = () => {
  const sectors = [
    { icon: "fas fa-landmark",      label: "Government & Defence" },
    { icon: "fas fa-heartbeat",     label: "Healthcare & Pharma" },
    { icon: "fas fa-university",    label: "Financial Services" },
    { icon: "fas fa-industry",      label: "Manufacturing" },
    { icon: "fas fa-shipping-fast", label: "Logistics & Supply Chain" },
    { icon: "fas fa-store",         label: "Retail & E-Commerce" },
  ];

  return (
    <section style={{ padding: "96px 0", background: C.white }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 52 }}>
          <SectionLabel>Trusted Across Industries</SectionLabel>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(24px, 3vw, 40px)", color: C.dark, lineHeight: 1.15, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
            Built for Every Enterprise Sector
          </h2>
        </div>

        <div className="row g-3 justify-content-center" style={{ marginBottom: 40 }}>
          {sectors.map((s) => (
            <div key={s.label} className="col-lg-2 col-md-4 col-6">
              <Card3D padding="28px 16px" style={{ textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: C.orangeGrad, boxShadow: shadow.badge, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <i className={s.icon} style={{ color: "#fff", fontSize: 22 }} />
                </div>
                <p style={{ color: C.body, fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
              </Card3D>
            </div>
          ))}
        </div>

        {/* Compliance strip — raised card */}
        <div style={{
          padding: "28px 36px", background: C.white,
          border: `1px solid ${C.border}`, borderTop: `3px solid ${C.orange}`,
          borderRadius: 16, display: "flex", flexWrap: "wrap",
          gap: 20, alignItems: "center", justifyContent: "center",
          boxShadow: shadow.card,
        }}>
          {[
            { icon: "fas fa-certificate",     label: "ISO 27001" },
            { icon: "fas fa-clipboard-check", label: "SOC 2 Type II" },
            { icon: "fas fa-gavel",           label: "GDPR Compliant" },
            { icon: "fas fa-lock",            label: "AES-256 Encrypted" },
            { icon: "fas fa-network-wired",   label: "Zero-Trust Architecture" },
            { icon: "fas fa-user-shield",     label: "RBAC & MFA" },
            { icon: "fas fa-history",         label: "Full Audit Trail" },
            { icon: "fas fa-server",          label: "Air-Gap Deployable" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={item.icon} style={{ color: C.orange, fontSize: 12 }} />
              </div>
              <span style={{ color: C.body, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── 7. IMPLEMENTATION ─────────────────────────────────────────────────────────
const Process = () => {
  const steps = [
    { no: "01", title: "Discovery & Assessment",    dur: "Week 1 – 2",    desc: "We map your existing processes, data flows, integration points, and compliance requirements. Output: detailed architecture blueprint and project plan." },
    { no: "02", title: "Design & Architecture",     dur: "Week 3 – 5",    desc: "Our architects design your ERP data model, AI pipeline, API integrations, and security controls. Sign-off before a single line of code is written." },
    { no: "03", title: "Agile Build & Integration", dur: "Week 6 – 18",   desc: "Modular agile delivery in 2-week sprints with working software at every milestone. Continuous integration testing and stakeholder demos throughout." },
    { no: "04", title: "UAT & Security Review",     dur: "Week 19 – 22",  desc: "User acceptance testing with your teams, penetration testing by independent security engineers, and compliance validation against regulatory requirements." },
    { no: "05", title: "Go-Live & Hypercare",       dur: "Week 23 – 26",  desc: "Phased production rollout with a dedicated hypercare team available 24/7 for the first 30 days. Zero-downtime cutover for upgrade projects." },
    { no: "06", title: "Continuous Optimisation",   dur: "Ongoing",       desc: "Monthly AI model retraining, performance tuning, feature releases, and SLA-backed managed support. Your ERP improves automatically over time." },
  ];

  return (
    <section style={{ padding: "96px 0", background: C.beige }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 56 }}>
          <SectionLabel>Implementation</SectionLabel>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 42px)", color: C.dark, lineHeight: 1.15, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
            From Contract to Go-Live in<span style={{ color: C.orange }}> Under 6 Months</span>
          </h2>
          <p style={{ color: C.body, fontSize: 17, marginTop: 16, maxWidth: 560, marginInline: "auto", fontFamily: "'DM Sans', sans-serif" }}>
            A structured, milestone-driven delivery process with full transparency at every stage.
          </p>
        </div>
        <div className="row g-4">
          {steps.map((s) => (
            <div key={s.no} className="col-lg-4 col-md-6">
              <Card3D padding="30px 28px">
                {/* ghost number watermark */}
                <div style={{ position: "absolute", top: 18, right: 22, color: "rgba(201,136,58,0.08)", fontSize: 56, fontWeight: 900, lineHeight: 1, fontFamily: "'DM Sans', sans-serif", userSelect: "none", pointerEvents: "none" }}>{s.no}</div>
                {/* 3D number badge */}
                <div style={{ width: 46, height: 46, borderRadius: 13, background: C.orangeGrad, boxShadow: shadow.badge, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>{s.no}</span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 17, color: C.dark, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</h4>
                <span style={{ display: "inline-block", background: C.orangeLight, color: C.orange, fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, marginBottom: 14, border: `1px solid ${C.orangeBorder}`, fontFamily: "'DM Sans', sans-serif" }}>{s.dur}</span>
                <p style={{ color: C.body, fontSize: 14, lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
              </Card3D>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── 8. FAQ ────────────────────────────────────────────────────────────────────
const faqs = [
  { q: "Can XERXEZ upgrade our SAP system without migration or downtime?", a: "Yes. Our AI layer connects to your SAP system via a secure read/write API middleware. Your existing SAP infrastructure, data schema, and workflows remain completely unchanged. The AI upgrade runs alongside your live system — typically activated within 8-12 weeks with zero operational downtime." },
  { q: "Is the ERP suitable for government and defence procurement environments?", a: "Designed for it. We support air-gapped on-premise deployments, private government cloud, and hybrid configurations with full data sovereignty. All sensitive data stays within your jurisdiction. We have experience with Ministry-level procurement, compliance auditing, and security accreditation processes." },
  { q: "What differentiates XERXEZ AI ERP from off-the-shelf enterprise software?", a: "Three things: (1) The AI is built in from day one — not bolted on. (2) You own all IP — no licensing fees after delivery. (3) We build to your processes — no forced workflow changes." },
  { q: "What cloud infrastructure do you deploy on?", a: "We are multi-cloud certified on AWS, Microsoft Azure, and Google Cloud Platform. We can deploy on your preferred cloud, on government-approved infrastructure, or on your own on-premise hardware. We do not lock you into any single provider." },
  { q: "How is data security handled?", a: "AES-256 encryption at rest and in transit, zero-trust network architecture, role-based access control with MFA, full audit trails with tamper-proof log retention, and regular penetration testing by independent security firms." },
  { q: "What ongoing support is provided after go-live?", a: "All deployments include 90 days of hypercare support with 24/7 on-call coverage. After hypercare, we offer SLA-backed managed support with dedicated response times, monthly AI model retraining, security patching, and feature releases." },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ padding: "96px 0", background: C.white }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 52 }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 42px)", color: C.dark, lineHeight: 1.15, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
            Questions from Enterprise Buyers
          </h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: C.white, borderRadius: 14, marginBottom: 12,
                  border: `1px solid ${open === i ? C.orangeBorder : C.border}`,
                  borderTop: `3px solid ${open === i ? C.orange : C.border}`,
                  boxShadow: open === i ? shadow.hover : shadow.card,
                  transform: open === i ? "translateY(-3px)" : "translateY(0)",
                  overflow: "hidden",
                  transition: "transform 240ms cubic-bezier(0.22,1,0.36,1), box-shadow 240ms, border-color 200ms",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", background: "none", border: "none", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 16 }}
                >
                  <span style={{ fontWeight: 700, fontSize: 15.5, color: open === i ? C.orange : C.dark, fontFamily: "'DM Sans', sans-serif", transition: "color 200ms" }}>{faq.q}</span>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: open === i ? C.orangeGrad : C.cream, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: open === i ? shadow.badge : "none", transition: "background 200ms, box-shadow 200ms" }}>
                    <i className={`fas fa-chevron-${open === i ? "up" : "down"}`} style={{ color: open === i ? "#fff" : C.muted, fontSize: 11 }} />
                  </div>
                </button>
                {open === i && (
                  <div style={{ padding: "0 28px 22px" }}>
                    <p style={{ color: C.body, fontSize: 15, lineHeight: 1.78, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── 9. CTA ────────────────────────────────────────────────────────────────────
const CTASection = () => (
  <section style={{ padding: "96px 0", background: C.warmDark, position: "relative", overflow: "hidden" }}>
    {/* warm ambient orbs */}
    <span style={{ position: "absolute", top: -80, left: "10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
    <span style={{ position: "absolute", bottom: -100, right: "15%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="row align-items-center g-5">
        {/* Left */}
        <div className="col-lg-7">
          <SectionLabel>Get Started</SectionLabel>
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 46px)", lineHeight: 1.12, marginBottom: 22, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.025em" }}>
            Ready to Transform Your<br />Enterprise Operations?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 17, lineHeight: 1.72, fontFamily: "'DM Sans', sans-serif", maxWidth: 500 }}>
            Whether you're building from scratch or upgrading an existing ERP, XERXEZ delivers a solution that meets your exact requirements &mdash; on time, on budget, and to the security standards your organisation demands.
          </p>
          {/* mini trust row */}
          <div style={{ display: "flex", gap: 16, marginTop: 36, flexWrap: "wrap" }}>
            {["ISO 27001 Ready", "SOC 2 Type II", "Strict NDA"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <i className="fas fa-check-circle" style={{ color: C.orange, fontSize: 14 }} />
                <span style={{ color: "rgba(255,255,255,0.60)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — dramatically raised white card */}
        <div className="col-lg-5">
          <div style={{
            background: C.white,
            borderRadius: 22,
            padding: "40px 36px",
            boxShadow: shadow.ctaCard,
            borderTop: `4px solid ${C.orange}`,
          }}>
            {/* badge inside card */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: C.orangeGrad, boxShadow: shadow.badge, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-rocket" style={{ color: "#fff", fontSize: 17 }} />
              </div>
              <div>
                <div style={{ color: C.dark, fontWeight: 700, fontSize: 18, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>Start the conversation</div>
                <div style={{ color: C.muted, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Enterprise team responds within 24 hours</div>
              </div>
            </div>

            <p style={{ color: C.muted, fontSize: 14, marginBottom: 28, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
              Get a tailored briefing pack with architecture recommendations, timeline, and cost estimate for your sector.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link to="/contact" className="theme-btn" style={{ textAlign: "center", justifyContent: "center", fontSize: 15, padding: "14px 24px" }}>
                Request A Demo <i className="far fa-arrow-right" />
              </Link>
              <a
                href="mailto:info@xerxez.com?subject=Enterprise ERP Sales Enquiry"
                style={{ display: "block", textAlign: "center", background: C.cream, color: C.dark, padding: "13px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: `1px solid ${C.borderMed}`, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
              >
                <i className="fas fa-envelope" style={{ marginRight: 8, color: C.orange }} />
                Contact Enterprise Sales
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20 }}>
              <i className="fas fa-lock" style={{ color: C.orange, fontSize: 11 }} />
              <p style={{ color: C.light, fontSize: 12, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                All enquiries handled under strict NDA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── PAGE ROOT ─────────────────────────────────────────────────────────────────
const AIERPPage = () => {
  useSEOMeta();
  return (
    <CustomLayout>
      <Hero />
      <TwoTracks />
      <ComparisonTable />
      <ROISection />
      <Modules />
      <ClientLogos />
      <Process />
      <FAQSection />
      <CTASection />
    </CustomLayout>
  );
};

export default AIERPPage;
