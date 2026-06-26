import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";

// ── colour tokens ────────────────────────────────────────────────────────────
const C = {
  purple: "#6c57d2",
  purpleDark: "#5242b0",
  purpleLight: "rgba(108,87,210,0.18)",
  purpleMid: "rgba(108,87,210,0.15)",
  orange: "#ff792e",
  navy: "#003566",
  navyDark: "#001f3f",
  textMuted: "rgba(255,255,255,0.55)",
  border: "rgba(108,87,210,0.22)",
  white: "#ffffff",
};

// ── SEO meta injection ───────────────────────────────────────────────────────
const useSEOMeta = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "AI-Powered ERP System | XERXEZ Enterprise Solutions";

    const upsert = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    upsert("description", "XERXEZ builds AI-powered ERP from scratch or upgrades your existing SAP, Oracle, or Microsoft Dynamics — enterprise-grade, government deployment ready, ISO 27001 and SOC 2 aligned.");
    upsert("keywords", "AI ERP, enterprise resource planning, SAP upgrade, Oracle AI, ERP software, XERXEZ, government ERP, ministry ERP, cloud ERP");

    return () => {
      document.title = prev;
    };
  }, []);
};

// ── small primitives ─────────────────────────────────────────────────────────
const PurpleBadge = ({ children, outline }: { children: string; outline?: boolean }) => (
  <span
    style={{
      display: "inline-block",
      background: outline ? "transparent" : `${C.purple}22`,
      color: outline ? "rgba(255,255,255,0.9)" : C.purple,
      fontSize: 13,
      fontWeight: 600,
      padding: "5px 16px",
      borderRadius: 20,
      letterSpacing: 0.2,
      border: `1px solid ${outline ? "rgba(255,255,255,0.35)" : C.purple + "44"}`,
    }}
  >
    {children}
  </span>
);

const Check = ({ children }: { children: React.ReactNode }) => (
  <li
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 12,
      listStyle: "none",
      color: "rgba(255,255,255,0.80)",
      fontSize: 15,
      lineHeight: 1.55,
    }}
  >
    <i className="fas fa-check-circle" style={{ color: C.purple, fontSize: 16, marginTop: 2, flexShrink: 0 }} />
    {children}
  </li>
);

// ── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section
    style={{
      background: `linear-gradient(135deg, ${C.navyDark} 0%, #0f1c3f 45%, #1a0a5c 100%)`,
      padding: "148px 0 80px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <span style={{ position: "absolute", top: -120, right: -120, width: 480, height: 480, borderRadius: "50%", background: "rgba(108,87,210,0.12)", pointerEvents: "none" }} />
    <span style={{ position: "absolute", bottom: -80, left: "25%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,121,46,0.07)", pointerEvents: "none" }} />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 32 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <li><Link to="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>Home</Link></li>
          <li style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>/</li>
          <li><Link to="/service" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>Services</Link></li>
          <li style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>/</li>
          <li style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>AI-Powered ERP</li>
        </ol>
      </nav>

      <div className="row align-items-center g-5">
        {/* Left */}
        <div className="col-lg-7">
          {/* Badges — all purple-themed */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            <span style={{ background: C.orange, color: "#fff", fontSize: 13, fontWeight: 600, padding: "5px 16px", borderRadius: 20, letterSpacing: 0.2 }}>
              Flagship
            </span>
            <PurpleBadge outline>AI Powered</PurpleBadge>
            <PurpleBadge outline>Enterprise Ready</PurpleBadge>
          </div>

          <h1
            style={{
              color: C.white,
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 52px)",
              lineHeight: 1.15,
              marginBottom: 24,
            }}
          >
            Intelligent ERP for
            <br />
            <span style={{ color: "#a78bfa" }}>Enterprise Operations</span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: 17,
              lineHeight: 1.75,
              marginBottom: 40,
              maxWidth: 560,
            }}
          >
            XERXEZ builds AI-powered ERP from scratch or layers intelligent
            automation onto your existing SAP, Oracle, or Microsoft Dynamics
            &mdash; without migration risk, without operational downtime.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
            <Link to="/contact" className="theme-btn" style={{ fontSize: 15, padding: "13px 32px" }}>
              Request a Demo
              <i className="far fa-arrow-right" />
            </Link>
            <a
              href="mailto:info@xerxez.com?subject=Enterprise ERP Enquiry"
              style={{
                background: "transparent",
                color: C.white,
                padding: "13px 28px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid rgba(255,255,255,0.35)",
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <i className="fas fa-envelope" style={{ fontSize: 13 }} />
              Contact Enterprise Sales
            </a>
          </div>

          {/* Trust indicators */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            {[
              { icon: "fas fa-certificate", label: "ISO 27001 Ready" },
              { icon: "fas fa-clipboard-check", label: "SOC 2 Type II" },
              { icon: "fas fa-server", label: "99.9% Uptime SLA" },
              { icon: "fas fa-cloud", label: "AWS / Azure / GCP" },
            ].map((t) => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <i className={t.icon} style={{ color: "#4ade80", fontSize: 14 }} />
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stats — 2x2 grid, responsive */}
        <div className="col-lg-5 col-md-8 col-sm-10">
          <div className="row g-3">
            {[
              { val: "40%", label: "Reduction in operational costs", icon: "fas fa-chart-line" },
              { val: "60%", label: "Faster management decisions", icon: "fas fa-tachometer-alt" },
              { val: "<6 mo", label: "Full deployment timeline", icon: "fas fa-calendar-check" },
              { val: "99.9%", label: "System availability SLA", icon: "fas fa-server" },
            ].map((s) => (
              <div key={s.val} className="col-6">
                <div
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 14,
                    padding: "22px 18px",
                    backdropFilter: "blur(8px)",
                    height: "100%",
                  }}
                >
                  <i className={s.icon} style={{ color: C.orange, fontSize: 20, marginBottom: 12, display: "block" }} />
                  <div style={{ color: C.white, fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800, lineHeight: 1, marginBottom: 8 }}>
                    {s.val}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── TWO TRACKS ───────────────────────────────────────────────────────────────
const TwoTracks = () => (
  <section style={{ padding: "80px 0", background: "#0a0a1a" }}>
    <div className="container">
      <div className="text-center" style={{ marginBottom: 56 }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ display: "inline-block", background: C.purpleLight, color: C.purple, fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, letterSpacing: 0.6, textTransform: "uppercase", border: `1px solid ${C.purple}55` }}>
            Two Delivery Models
          </span>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#ffffff", lineHeight: 1.2 }}>
          Build New. Or Make Existing
          <span style={{ color: C.purple }}> Intelligent.</span>
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, marginTop: 16, maxWidth: 580, marginInline: "auto" }}>
          XERXEZ is the only enterprise technology partner that delivers both
          paths with equal depth &mdash; no trade-offs.
        </p>
      </div>

      <div className="row g-4">
        {/* Track A */}
        <div className="col-lg-6">
          <div style={{ background: "#0d0d1f", borderRadius: 16, padding: "44px 40px", border: `2px solid ${C.purple}33`, boxShadow: "0 4px 32px rgba(108,87,210,0.15)", height: "100%" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: C.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <i className="fas fa-code-branch" style={{ color: C.purple, fontSize: 22 }} />
            </div>
            <span style={{ display: "inline-block", background: C.purpleLight, color: C.purple, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, border: `1px solid ${C.purple}44`, marginBottom: 16, letterSpacing: 0.5, textTransform: "uppercase" }}>Track A</span>
            <h3 style={{ fontWeight: 800, fontSize: 26, color: "#ffffff", marginBottom: 12 }}>
              We Build Your AI ERP from Scratch
            </h3>
            <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              A purpose-built, cloud-native ERP designed entirely around your
              business model, industry, and compliance requirements. No legacy
              constraints. No forced compromises.
            </p>
            <ul style={{ padding: 0, margin: 0 }}>
              <Check>Fully custom modules: Finance, HR, CRM, Inventory, Sales, Logistics</Check>
              <Check>AI demand forecasting &amp; anomaly detection baked in from day one</Check>
              <Check>API-first architecture &mdash; integrates with any third-party platform</Check>
              <Check>Role-based dashboards for C-suite, department heads, and field staff</Check>
              <Check>Multi-currency, multi-language, multi-entity support</Check>
              <Check>White-labelled, fully owned IP transferred to you at delivery</Check>
            </ul>
            <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(108,87,210,0.12)", borderRadius: 10, borderLeft: `4px solid ${C.purple}` }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6 }}>
                <strong>Typical timeline:</strong> 4&ndash;6 months for a fully operational
                system with live AI analytics and role dashboards.
              </p>
            </div>
          </div>
        </div>

        {/* Track B */}
        <div className="col-lg-6">
          <div style={{ background: "#0d0d1f", borderRadius: 16, padding: "44px 40px", border: `2px solid ${C.orange}33`, boxShadow: "0 4px 32px rgba(255,121,46,0.12)", height: "100%" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,121,46,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <i className="fas fa-layer-group" style={{ color: C.orange, fontSize: 22 }} />
            </div>
            <span style={{ display: "inline-block", background: "rgba(255,121,46,0.15)", color: C.orange, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, border: `1px solid ${C.orange}44`, marginBottom: 16, letterSpacing: 0.5, textTransform: "uppercase" }}>Track B</span>
            <h3 style={{ fontWeight: 800, fontSize: 26, color: "#ffffff", marginBottom: 12 }}>
              We Upgrade Your Existing ERP with AI
            </h3>
            <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              Your organisation has already invested in SAP, Oracle, or Microsoft
              Dynamics. XERXEZ layers an intelligent AI engine on top &mdash;
              zero migration risk, zero downtime.
            </p>
            <ul style={{ padding: 0, margin: 0 }}>
              <Check>Compatible with SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365</Check>
              <Check>AI forecasting &amp; automation added via secure API bridge</Check>
              <Check>Real-time data unification across existing modules and silos</Check>
              <Check>Predictive maintenance, procurement automation, HR analytics</Check>
              <Check>Compliance-safe: no changes to your existing data schema</Check>
              <Check>Live within 8&ndash;12 weeks alongside your running production system</Check>
            </ul>
            <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(255,121,46,0.1)", borderRadius: 10, borderLeft: `4px solid ${C.orange}` }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6 }}>
                <strong>No disruption guarantee:</strong> Our AI layer runs via
                secure middleware &mdash; your ERP keeps running exactly as today.
              </p>
            </div>

            <div style={{ marginTop: 24 }}>
              <p style={{ color: C.textMuted, fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>Compatible Systems</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["SAP", "Oracle", "MS Dynamics", "NetSuite", "Odoo", "Sage"].map((sys) => (
                  <span key={sys} style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.15)" }}>
                    {sys}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── BUILD vs UPGRADE COMPARISON TABLE ────────────────────────────────────────
const ComparisonTable = () => {
  const rows = [
    { feature: "Starting point", build: "Greenfield — designed from scratch", upgrade: "Your existing SAP / Oracle / Dynamics" },
    { feature: "Deployment timeline", build: "4 – 6 months", upgrade: "8 – 12 weeks" },
    { feature: "Data migration", build: "Full migration with cleansing", upgrade: "No migration — reads existing data" },
    { feature: "Customisation level", build: "100% custom to your processes", upgrade: "AI layer adapts to existing setup" },
    { feature: "IP ownership", build: "Full IP transferred to client", upgrade: "AI modules fully owned by client" },
    { feature: "Operational disruption", build: "Phased cutover, minimal downtime", upgrade: "Zero downtime — runs alongside live ERP" },
    { feature: "Compliance changes", build: "Full compliance architecture built in", upgrade: "No changes to existing compliance posture" },
    { feature: "Ideal for", build: "No ERP, legacy system, or full replatform", upgrade: "Existing enterprise ERP investment" },
  ];

  return (
    <section style={{ padding: "80px 0", background: "#0f0f2d" }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ display: "inline-block", background: C.purpleLight, color: C.purple, fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, letterSpacing: 0.6, textTransform: "uppercase", border: `1px solid ${C.purple}55` }}>
              Side-by-Side Comparison
            </span>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(24px, 3vw, 38px)", color: "#ffffff", lineHeight: 1.2 }}>
            Build from Scratch vs Upgrade Existing ERP
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16, marginTop: 14, maxWidth: 540, marginInline: "auto" }}>
            Choose the path that fits your organisation. Both deliver the same
            AI-powered outcome &mdash; with different starting points.
          </p>
        </div>

        <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ padding: "18px 24px", background: "#1a1a35", textAlign: "left", fontSize: 13, fontWeight: 700, color: C.textMuted, letterSpacing: 0.5, textTransform: "uppercase", borderBottom: `2px solid ${C.border}`, width: "28%" }}>
                  Feature
                </th>
                <th style={{ padding: "18px 24px", background: C.purpleLight, textAlign: "left", fontSize: 14, fontWeight: 800, color: C.purple, borderBottom: `2px solid ${C.purple}55`, width: "36%" }}>
                  <i className="fas fa-code-branch" style={{ marginRight: 8 }} />
                  Build from Scratch
                </th>
                <th style={{ padding: "18px 24px", background: "rgba(255,121,46,0.12)", textAlign: "left", fontSize: 14, fontWeight: 800, color: C.orange, borderBottom: `2px solid ${C.orange}44`, width: "36%" }}>
                  <i className="fas fa-layer-group" style={{ marginRight: 8 }} />
                  Upgrade Existing ERP
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} style={{ background: i % 2 === 0 ? "#0d0d1f" : "#111130" }}>
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.8)", borderBottom: `1px solid ${C.border}` }}>
                    {row.feature}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: "rgba(255,255,255,0.7)", borderBottom: `1px solid ${C.border}`, borderLeft: `3px solid ${C.purple}44` }}>
                    <i className="fas fa-check-circle" style={{ color: C.purple, marginRight: 8, fontSize: 13 }} />
                    {row.build}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: "rgba(255,255,255,0.7)", borderBottom: `1px solid ${C.border}`, borderLeft: `3px solid ${C.orange}44` }}>
                    <i className="fas fa-check-circle" style={{ color: C.orange, marginRight: 8, fontSize: 13 }} />
                    {row.upgrade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row g-3 mt-4">
          <div className="col-md-6">
            <Link to="/contact?type=build" className="theme-btn d-block text-center" style={{ justifyContent: "center" }}>
              Start a Build Consultation
              <i className="far fa-arrow-right" />
            </Link>
          </div>
          <div className="col-md-6">
            <a
              href="mailto:info@xerxez.com?subject=ERP Upgrade Enquiry"
              style={{ display: "block", textAlign: "center", background: "transparent", color: C.purple, padding: "13px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: `2px solid ${C.purple}`, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
            >
              Enquire About an ERP Upgrade
              <i className="far fa-arrow-right" style={{ marginLeft: 10 }} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── ERP MODULES ──────────────────────────────────────────────────────────────
const moduleList = [
  { icon: "fas fa-chart-bar", title: "Finance & Accounting", desc: "GL, AP/AR, budgeting, financial reporting, multi-currency" },
  { icon: "fas fa-users", title: "Human Resources", desc: "Payroll, leave management, recruitment, performance reviews" },
  { icon: "fas fa-boxes", title: "Inventory & Supply Chain", desc: "Stock management, warehouse ops, supplier portal, demand planning" },
  { icon: "fas fa-handshake", title: "CRM & Sales", desc: "Pipeline management, lead scoring, quote generation, customer 360" },
  { icon: "fas fa-file-invoice-dollar", title: "Invoicing & Billing", desc: "Automated invoicing, payment tracking, subscription billing" },
  { icon: "fas fa-shopping-cart", title: "Procurement & Purchases", desc: "PO management, vendor evaluation, 3-way matching" },
  { icon: "fas fa-truck", title: "Logistics & Dispatch", desc: "Fleet tracking, route optimisation, delivery confirmation" },
  { icon: "fas fa-brain", title: "AI Analytics Engine", desc: "Demand forecasting, anomaly detection, executive dashboards" },
  { icon: "fas fa-shield-alt", title: "Compliance & Audit", desc: "Automated audit trails, regulatory reports, access control logs" },
];

const Modules = () => (
  <section style={{ padding: "80px 0", background: "#0a0a1a" }}>
    <div className="container">
      <div className="text-center" style={{ marginBottom: 52 }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ display: "inline-block", background: C.purpleLight, color: C.purple, fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, letterSpacing: 0.6, textTransform: "uppercase", border: `1px solid ${C.purple}55` }}>
            Platform Modules
          </span>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#ffffff", lineHeight: 1.2 }}>
          Every Function. One Intelligent Platform.
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, marginTop: 16, maxWidth: 560, marginInline: "auto" }}>
          All modules are interconnected, AI-informed, and deployable
          independently or as a complete suite.
        </p>
      </div>
      <div className="row g-4">
        {moduleList.map((mod) => (
          <div key={mod.title} className="col-lg-4 col-md-6">
            <div
              style={{ background: "#0d0d1f", border: `1px solid ${C.border}`, borderRadius: 14, padding: "28px 24px", height: "100%", transition: "border-color 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${C.purple}66`; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(108,87,210,0.18)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: C.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <i className={mod.icon} style={{ color: C.purple, fontSize: 20 }} />
              </div>
              <h4 style={{ fontWeight: 700, fontSize: 17, color: "#ffffff", marginBottom: 8 }}>{mod.title}</h4>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{mod.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── ROI ──────────────────────────────────────────────────────────────────────
const ROISection = () => (
  <section style={{ padding: "80px 0", background: "#0f0f2d" }}>
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-5">
          <div style={{ marginBottom: 12 }}>
            <span style={{ display: "inline-block", background: C.purpleLight, color: C.purple, fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, letterSpacing: 0.6, textTransform: "uppercase", border: `1px solid ${C.purple}55` }}>
              Business Impact
            </span>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#ffffff", lineHeight: 1.2, marginBottom: 20 }}>
            Measurable ROI from
            <span style={{ color: C.purple }}> Day One</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
            XERXEZ ERP deployments are benchmarked against client KPIs from
            day one. Our AI layer generates measurable value within the first
            30 days of go-live.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { pct: 40, label: "Reduction in operational overhead", color: C.purple },
              { pct: 60, label: "Faster executive reporting cycles", color: C.orange },
              { pct: 35, label: "Decrease in procurement errors", color: "#10b981" },
              { pct: 50, label: "Reduction in manual data entry", color: "#6366f1" },
            ].map((r) => (
              <div key={r.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ color: r.color, fontSize: 14, fontWeight: 700 }}>{r.pct}%</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ width: `${r.pct}%`, height: "100%", background: r.color, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="row g-3">
            {[
              { icon: "fas fa-brain", title: "Predictive Intelligence", desc: "AI models predict demand, cash flow, and staffing 12 weeks ahead — giving leadership data to act before problems materialise." },
              { icon: "fas fa-robot", title: "Process Automation", desc: "Repetitive tasks — PO approvals, invoice matching, payroll, stock replenishment — execute automatically with full audit trails." },
              { icon: "fas fa-chart-pie", title: "Unified Data Layer", desc: "All departments share a single source of truth. Finance, HR, sales, and ops flow through one intelligent data layer." },
              { icon: "fas fa-bell", title: "Proactive Alerts", desc: "The system flags anomalies — expense spikes, stock shortfalls, SLA breaches — before they escalate, with recommended actions." },
            ].map((item) => (
              <div key={item.title} className="col-sm-6">
                <div style={{ background: "#0d0d1f", border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px 22px", height: "100%" }}>
                  <i className={item.icon} style={{ color: C.purple, fontSize: 24, marginBottom: 16, display: "block" }} />
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: "#ffffff", marginBottom: 8 }}>{item.title}</h4>
                  <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── ENTERPRISE CLIENT LOGOS ───────────────────────────────────────────────────
const ClientLogos = () => {
  const sectors = [
    { icon: "fas fa-landmark", label: "Government & Defence" },
    { icon: "fas fa-heartbeat", label: "Healthcare & Pharma" },
    { icon: "fas fa-university", label: "Financial Services" },
    { icon: "fas fa-industry", label: "Manufacturing" },
    { icon: "fas fa-shipping-fast", label: "Logistics & Supply Chain" },
    { icon: "fas fa-store", label: "Retail & E-Commerce" },
  ];

  return (
    <section
      style={{
        padding: "64px 0",
        background: `linear-gradient(135deg, ${C.navyDark} 0%, #0f1c3f 100%)`,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container">
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.45)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          Trusted Across Industries
        </p>
        <div className="row g-3 justify-content-center">
          {sectors.map((s) => (
            <div key={s.label} className="col-lg-2 col-md-4 col-6">
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: "22px 16px",
                  textAlign: "center",
                }}
              >
                <i className={s.icon} style={{ color: "#a78bfa", fontSize: 26, marginBottom: 10, display: "block" }} />
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance strip */}
        <div
          style={{
            marginTop: 44,
            padding: "28px 36px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[
            { icon: "fas fa-certificate", label: "ISO 27001" },
            { icon: "fas fa-clipboard-check", label: "SOC 2 Type II" },
            { icon: "fas fa-gavel", label: "GDPR Compliant" },
            { icon: "fas fa-lock", label: "AES-256 Encrypted" },
            { icon: "fas fa-network-wired", label: "Zero-Trust Architecture" },
            { icon: "fas fa-user-shield", label: "RBAC & MFA" },
            { icon: "fas fa-history", label: "Full Audit Trail" },
            { icon: "fas fa-server", label: "Air-Gap Deployable" },
          ].map((c) => (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <i className={c.icon} style={{ color: "#4ade80", fontSize: 15 }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── PROCESS ───────────────────────────────────────────────────────────────────
const Process = () => {
  const steps = [
    { no: "01", title: "Discovery & Assessment", dur: "Week 1 – 2", desc: "We map your existing processes, data flows, integration points, and compliance requirements. Output: detailed architecture blueprint and project plan." },
    { no: "02", title: "Design & Architecture", dur: "Week 3 – 5", desc: "Our architects design your ERP data model, AI pipeline, API integrations, and security controls. Sign-off before a single line of code is written." },
    { no: "03", title: "Agile Build & Integration", dur: "Week 6 – 18", desc: "Modular agile delivery in 2-week sprints with working software at every milestone. Continuous integration testing and stakeholder demos throughout." },
    { no: "04", title: "UAT & Security Review", dur: "Week 19 – 22", desc: "User acceptance testing with your teams, penetration testing by independent security engineers, and compliance validation against your regulatory requirements." },
    { no: "05", title: "Go-Live & Hypercare", dur: "Week 23 – 26", desc: "Phased production rollout with a dedicated hypercare team available 24/7 for the first 30 days. Zero-downtime cutover for upgrade projects." },
    { no: "06", title: "Continuous Optimisation", dur: "Ongoing", desc: "Monthly AI model retraining, performance tuning, feature releases, and SLA-backed managed support. Your ERP improves automatically over time." },
  ];

  return (
    <section style={{ padding: "80px 0", background: "#0a0a1a" }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 52 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ display: "inline-block", background: C.purpleLight, color: C.purple, fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, letterSpacing: 0.6, textTransform: "uppercase", border: `1px solid ${C.purple}55` }}>
              Implementation
            </span>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#ffffff", lineHeight: 1.2 }}>
            From Contract to Go-Live in
            <span style={{ color: C.purple }}> Under 6 Months</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 17, marginTop: 16, maxWidth: 560, marginInline: "auto" }}>
            A structured, milestone-driven delivery process with full transparency at every stage.
          </p>
        </div>
        <div className="row g-4">
          {steps.map((s) => (
            <div key={s.no} className="col-lg-4 col-md-6">
              <div style={{ background: "#0d0d1f", border: `1px solid ${C.border}`, borderRadius: 14, padding: "28px 26px", height: "100%", position: "relative" }}>
                <div style={{ position: "absolute", top: 20, right: 22, color: `${C.purple}20`, fontSize: 52, fontWeight: 900, lineHeight: 1 }}>{s.no}</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span style={{ color: C.purple, fontWeight: 800, fontSize: 15 }}>{s.no}</span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 17, color: "#ffffff", marginBottom: 6 }}>{s.title}</h4>
                <div style={{ display: "inline-block", background: `${C.orange}18`, color: C.orange, fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, marginBottom: 14, border: `1px solid ${C.orange}44` }}>
                  {s.dur}
                </div>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
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
    <section style={{ padding: "80px 0", background: "#0f0f2d" }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ display: "inline-block", background: C.purpleLight, color: C.purple, fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, letterSpacing: 0.6, textTransform: "uppercase", border: `1px solid ${C.purple}55` }}>
              FAQ
            </span>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#ffffff", lineHeight: 1.2 }}>
            Questions from Enterprise Buyers
          </h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{ background: "#0d0d1f", border: `1px solid ${open === i ? C.purple + "66" : C.border}`, borderRadius: 12, marginBottom: 12, boxShadow: open === i ? "0 2px 16px rgba(108,87,210,0.18)" : "none", overflow: "hidden", transition: "border-color 0.2s" }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", background: "none", border: "none", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 16 }}
                >
                  <span style={{ fontWeight: 700, fontSize: 15.5, color: open === i ? C.purple : "rgba(255,255,255,0.9)" }}>{faq.q}</span>
                  <i className={`fas fa-chevron-${open === i ? "up" : "down"}`} style={{ color: open === i ? C.purple : C.textMuted, fontSize: 13, flexShrink: 0 }} />
                </button>
                {open === i && (
                  <div style={{ padding: "0 28px 20px" }}>
                    <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
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

// ── CTA ───────────────────────────────────────────────────────────────────────
const CTASection = () => (
  <section style={{ padding: "80px 0", background: `linear-gradient(135deg, ${C.purple} 0%, ${C.purpleDark} 100%)` }}>
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-7">
          <h2 style={{ color: C.white, fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 44px)", lineHeight: 1.2, marginBottom: 20 }}>
            Ready to Transform Your
            <br />Enterprise Operations?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.7 }}>
            Whether you're building from scratch or upgrading an existing ERP,
            XERXEZ delivers a solution that meets your exact requirements &mdash;
            on time, on budget, and to the security standards your organisation demands.
          </p>
        </div>
        <div className="col-lg-5">
          <div style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)", borderRadius: 16, padding: "36px 32px" }}>
            <h4 style={{ color: C.white, fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Start the conversation</h4>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Our enterprise team responds within 24 hours with a tailored briefing pack for your sector.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Link to="/contact" className="theme-btn" style={{ textAlign: "center", justifyContent: "center", fontSize: 15, padding: "14px 24px" }}>
                Request a Demo
                <i className="far fa-arrow-right" />
              </Link>
              <a
                href="mailto:info@xerxez.com?subject=Enterprise ERP Sales Enquiry"
                style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.14)", color: C.white, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "1px solid rgba(255,255,255,0.30)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
              >
                <i className="fas fa-envelope" style={{ marginRight: 10 }} />
                Contact Enterprise Sales
              </a>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", marginTop: 20, marginBottom: 0 }}>
              All enquiries handled under strict NDA
            </p>
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
      <Modules />
      <ROISection />
      <ClientLogos />
      <Process />
      <FAQSection />
      <CTASection />
    </CustomLayout>
  );
};

export default AIERPPage;
