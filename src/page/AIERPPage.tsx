import { useState } from "react";
import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";

// ─── colour tokens ───────────────────────────────────────────────────────────
const C = {
  purple: "#6c57d2",
  purpleLight: "#f0edff",
  orange: "#ff792e",
  navy: "#003566",
  navyDark: "#001f3f",
  dark: "#0d0d1a",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  white: "#ffffff",
};

// ─── reusable primitives ─────────────────────────────────────────────────────
const Badge = ({
  children,
  color = C.purple,
  bg,
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) => (
  <span
    style={{
      display: "inline-block",
      background: bg ?? `${color}1a`,
      color,
      fontSize: 12,
      fontWeight: 700,
      padding: "4px 14px",
      borderRadius: 20,
      letterSpacing: 0.5,
      textTransform: "uppercase" as const,
      border: `1px solid ${color}44`,
    }}
  >
    {children}
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 12 }}>
    <Badge>{children as string}</Badge>
  </div>
);

const Check = ({ children }: { children: React.ReactNode }) => (
  <li
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 12,
      listStyle: "none",
      color: "#374151",
      fontSize: 15,
      lineHeight: 1.55,
    }}
  >
    <i
      className="fas fa-check-circle"
      style={{ color: C.purple, fontSize: 16, marginTop: 2, flexShrink: 0 }}
    ></i>
    {children}
  </li>
);

const ComplianceBadge = ({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 10,
      padding: "14px 20px",
    }}
  >
    <i className={icon} style={{ color: "#4ade80", fontSize: 20 }}></i>
    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{label}</span>
  </div>
);

// ─── SECTION 1: Hero ─────────────────────────────────────────────────────────
const Hero = () => (
  <section
    style={{
      background: `linear-gradient(135deg, ${C.navyDark} 0%, #0f1c3f 45%, #1a0a5c 100%)`,
      padding: "80px 0 72px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Background decoration */}
    <span
      style={{
        position: "absolute", top: -120, right: -120,
        width: 480, height: 480, borderRadius: "50%",
        background: "rgba(108,87,210,0.12)", pointerEvents: "none",
      }}
    />
    <span
      style={{
        position: "absolute", bottom: -80, left: "25%",
        width: 300, height: 300, borderRadius: "50%",
        background: "rgba(255,121,46,0.07)", pointerEvents: "none",
      }}
    />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 32 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 8, alignItems: "center" }}>
          <li><Link to="/" style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>Home</Link></li>
          <li style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>/</li>
          <li><Link to="/service" style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>Services</Link></li>
          <li style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>/</li>
          <li style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>AI-Powered ERP</li>
        </ol>
      </nav>

      <div className="row align-items-center g-5">
        <div className="col-lg-7">
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            <span style={{ background: C.orange, color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5, textTransform: "uppercase" }}>Flagship Service</span>
            <span style={{ background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)", letterSpacing: 0.5 }}>AI Powered</span>
            <span style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(74,222,128,0.3)", letterSpacing: 0.5 }}>Enterprise Ready</span>
          </div>

          <h1
            style={{
              color: C.white, fontWeight: 800,
              fontSize: "clamp(30px, 4vw, 52px)",
              lineHeight: 1.15, marginBottom: 24,
            }}
          >
            Intelligent ERP for
            <br />
            <span style={{ color: "#a78bfa" }}>Enterprise Operations</span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)", fontSize: 18,
              lineHeight: 1.75, marginBottom: 40, maxWidth: 560,
            }}
          >
            XERXEZ builds AI-powered ERP from scratch or layers intelligent
            automation onto your existing SAP, Oracle, or Microsoft Dynamics
            -- without migration risk, without operational downtime.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 52 }}>
            <Link
              to="/contact"
              className="theme-btn"
              style={{ fontSize: 15, padding: "13px 32px" }}
            >
              Request a Demo
              <i className="far fa-arrow-right"></i>
            </Link>
            <a
              href="mailto:xerxez.in@gmail.com?subject=Enterprise ERP Enquiry"
              style={{
                background: "transparent", color: C.white,
                padding: "13px 32px", borderRadius: 8, fontWeight: 700,
                fontSize: 15, display: "inline-flex", alignItems: "center",
                gap: 10, border: "1px solid rgba(255,255,255,0.35)",
                textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <i className="fas fa-envelope" style={{ fontSize: 14 }}></i>
              Contact Enterprise Sales
            </a>
          </div>

          {/* Trust row */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-shield-alt" style={{ color: "#4ade80", fontSize: 16 }}></i>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>ISO 27001 Ready</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-lock" style={{ color: "#4ade80", fontSize: 16 }}></i>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>SOC 2 Type II</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-server" style={{ color: "#4ade80", fontSize: 16 }}></i>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>99.9% Uptime SLA</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-cloud" style={{ color: "#4ade80", fontSize: 16 }}></i>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>AWS / Azure / GCP</span>
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="col-lg-5">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { val: "40%", label: "Reduction in operational costs", icon: "fas fa-chart-line" },
              { val: "60%", label: "Faster management decisions", icon: "fas fa-tachometer-alt" },
              { val: "<6 mo", label: "Full deployment timeline", icon: "fas fa-calendar-check" },
              { val: "99.9%", label: "System availability SLA", icon: "fas fa-server" },
            ].map((s) => (
              <div
                key={s.val}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 14, padding: "24px 20px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <i className={s.icon} style={{ color: C.orange, fontSize: 22, marginBottom: 12, display: "block" }}></i>
                <div style={{ color: C.white, fontSize: 32, fontWeight: 800, lineHeight: 1, marginBottom: 8 }}>
                  {s.val}
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── SECTION 2: Two tracks ────────────────────────────────────────────────────
const TwoTracks = () => (
  <section style={{ padding: "80px 0", background: "#f8f9fc" }}>
    <div className="container">
      <div className="text-center" style={{ marginBottom: 56 }}>
        <SectionLabel>Two Delivery Models</SectionLabel>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#111827", lineHeight: 1.2 }}>
          Build New. Or Make Existing
          <span style={{ color: C.purple }}> Intelligent.</span>
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, marginTop: 16, maxWidth: 580, marginInline: "auto" }}>
          XERXEZ is the only enterprise technology partner that delivers both
          paths with equal depth -- no trade-offs.
        </p>
      </div>

      <div className="row g-4">
        {/* Track A */}
        <div className="col-lg-6">
          <div
            style={{
              background: C.white, borderRadius: 16, padding: "44px 40px",
              border: `2px solid ${C.purple}22`,
              boxShadow: "0 4px 32px rgba(108,87,210,0.10)",
              height: "100%",
            }}
          >
            <div
              style={{
                width: 56, height: 56, borderRadius: 14,
                background: C.purpleLight, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 24,
              }}
            >
              <i className="fas fa-code-branch" style={{ color: C.purple, fontSize: 24 }}></i>
            </div>
            <Badge>Track A</Badge>
            <h3 style={{ fontWeight: 800, fontSize: 26, color: "#111827", margin: "16px 0 12px" }}>
              We Build Your AI ERP from Scratch
            </h3>
            <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              A purpose-built, cloud-native ERP designed entirely around your
              business model, industry, and compliance requirements. No legacy
              constraints. No forced compromises.
            </p>
            <ul style={{ padding: 0, margin: 0 }}>
              <Check>Fully custom modules: Finance, HR, CRM, Inventory, Sales, Logistics</Check>
              <Check>AI demand forecasting & anomaly detection baked in from day one</Check>
              <Check>API-first architecture -- integrates with any third-party platform</Check>
              <Check>Role-based dashboards for C-suite, department heads, and field staff</Check>
              <Check>Multi-currency, multi-language, multi-entity support</Check>
              <Check>White-labelled, fully owned IP transferred to you at delivery</Check>
            </ul>
            <div
              style={{
                marginTop: 36, padding: "18px 20px",
                background: "#f5f3ff", borderRadius: 10,
                borderLeft: `4px solid ${C.purple}`,
              }}
            >
              <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.6 }}>
                <strong>Typical timeline:</strong> 4 -- 6 months for a fully operational
                system with live AI analytics and role dashboards.
              </p>
            </div>
          </div>
        </div>

        {/* Track B */}
        <div className="col-lg-6">
          <div
            style={{
              background: C.white, borderRadius: 16, padding: "44px 40px",
              border: `2px solid ${C.orange}22`,
              boxShadow: "0 4px 32px rgba(255,121,46,0.10)",
              height: "100%",
            }}
          >
            <div
              style={{
                width: 56, height: 56, borderRadius: 14,
                background: "#fff4ee", display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 24,
              }}
            >
              <i className="fas fa-layer-group" style={{ color: C.orange, fontSize: 24 }}></i>
            </div>
            <Badge color={C.orange}>Track B</Badge>
            <h3 style={{ fontWeight: 800, fontSize: 26, color: "#111827", margin: "16px 0 12px" }}>
              We Upgrade Your Existing ERP with AI
            </h3>
            <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              Your organisation has already invested in SAP, Oracle, Microsoft
              Dynamics, or another enterprise platform. XERXEZ layers an
              intelligent AI engine on top -- zero migration risk, zero downtime.
            </p>
            <ul style={{ padding: 0, margin: 0 }}>
              <Check>Compatible with SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365</Check>
              <Check>AI forecasting & intelligent automation added via secure API bridge</Check>
              <Check>Real-time data unification across existing modules and silos</Check>
              <Check>Predictive maintenance, procurement automation, HR analytics</Check>
              <Check>Compliance-safe: no changes to your existing data schema</Check>
              <Check>Live within 8 -- 12 weeks alongside your running production system</Check>
            </ul>
            <div
              style={{
                marginTop: 36, padding: "18px 20px",
                background: "#fff4ee", borderRadius: 10,
                borderLeft: `4px solid ${C.orange}`,
              }}
            >
              <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.6 }}>
                <strong>No disruption guarantee:</strong> Our AI layer runs in
                read/write via secure middleware -- your ERP keeps running
                exactly as today.
              </p>
            </div>

            {/* Compatible systems */}
            <div style={{ marginTop: 28 }}>
              <p style={{ color: C.textMuted, fontSize: 13, fontWeight: 600, marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>
                Compatible Systems
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["SAP", "Oracle", "MS Dynamics", "NetSuite", "Odoo", "Sage"].map((sys) => (
                  <span
                    key={sys}
                    style={{
                      background: "#f3f4f6", color: "#374151",
                      fontSize: 13, fontWeight: 600, padding: "6px 16px",
                      borderRadius: 20, border: "1px solid #e5e7eb",
                    }}
                  >
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

// ─── SECTION 3: ERP Modules ───────────────────────────────────────────────────
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
  <section style={{ padding: "80px 0", background: C.white }}>
    <div className="container">
      <div className="text-center" style={{ marginBottom: 56 }}>
        <SectionLabel>Platform Modules</SectionLabel>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#111827", lineHeight: 1.2 }}>
          Every Function. One Intelligent Platform.
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, marginTop: 16, maxWidth: 560, marginInline: "auto" }}>
          All modules are interconnected, AI-informed, and deployable independently
          or as a complete suite.
        </p>
      </div>

      <div className="row g-4">
        {moduleList.map((mod) => (
          <div key={mod.title} className="col-lg-4 col-md-6">
            <div
              style={{
                background: "#f8f9fc", border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "28px 24px",
                transition: "border-color 0.2s, box-shadow 0.2s",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${C.purple}44`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px rgba(108,87,210,0.12)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = C.border;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: C.purpleLight, display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: 18,
                }}
              >
                <i className={mod.icon} style={{ color: C.purple, fontSize: 20 }}></i>
              </div>
              <h4 style={{ fontWeight: 700, fontSize: 17, color: "#111827", marginBottom: 8 }}>
                {mod.title}
              </h4>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                {mod.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── SECTION 4: ROI / Why AI ERP ─────────────────────────────────────────────
const ROISection = () => (
  <section style={{ padding: "80px 0", background: "#f8f9fc" }}>
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-5">
          <SectionLabel>Business Impact</SectionLabel>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#111827", lineHeight: 1.2, marginBottom: 20 }}>
            Measurable ROI from
            <span style={{ color: C.purple }}> Day One</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
            XERXEZ ERP deployments are benchmarked against client KPIs from
            the start of every engagement. Our AI layer begins generating
            measurable value within the first 30 days of go-live.
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
                  <span style={{ color: "#374151", fontSize: 14, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ color: r.color, fontSize: 14, fontWeight: 700 }}>{r.pct}%</span>
                </div>
                <div style={{ height: 8, background: "#e5e7eb", borderRadius: 6, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${r.pct}%`, height: "100%",
                      background: r.color, borderRadius: 6,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="row g-3">
            {[
              { icon: "fas fa-brain", title: "Predictive Intelligence", desc: "AI models predict demand, cash flow, and staffing requirements 12 weeks ahead -- giving leadership the data to act before problems materialise." },
              { icon: "fas fa-robot", title: "Process Automation", desc: "Repetitive tasks -- PO approvals, invoice matching, payroll runs, stock replenishment -- execute automatically with full audit trails." },
              { icon: "fas fa-chart-pie", title: "Unified Data Layer", desc: "All departments share a single source of truth. Finance, HR, sales, and ops data flow through one intelligent data layer -- eliminating silos." },
              { icon: "fas fa-bell", title: "Proactive Alerts", desc: "The system flags anomalies -- expense spikes, stock shortfalls, SLA breaches -- before they escalate, with recommended corrective actions." },
            ].map((item) => (
              <div key={item.title} className="col-sm-6">
                <div
                  style={{
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: 14, padding: "24px 22px", height: "100%",
                  }}
                >
                  <i className={item.icon} style={{ color: C.purple, fontSize: 24, marginBottom: 16, display: "block" }}></i>
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 8 }}>{item.title}</h4>
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

// ─── SECTION 5: Security & Compliance ────────────────────────────────────────
const Security = () => (
  <section
    style={{
      padding: "80px 0",
      background: `linear-gradient(135deg, ${C.navyDark} 0%, #0f1c3f 100%)`,
    }}
  >
    <div className="container">
      <div className="text-center" style={{ marginBottom: 52 }}>
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(74,222,128,0.15)", color: "#4ade80",
              fontSize: 12, fontWeight: 700, padding: "4px 16px",
              borderRadius: 20, letterSpacing: 0.5,
              border: "1px solid rgba(74,222,128,0.3)",
            }}
          >
            Security & Compliance
          </span>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: C.white, lineHeight: 1.2 }}>
          Government & Enterprise Grade Security
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, marginTop: 16, maxWidth: 580, marginInline: "auto" }}>
          XERXEZ ERP is architected to meet the security and compliance demands
          of defence, government, healthcare, and financial services sectors.
        </p>
      </div>

      <div className="row g-3 mb-5">
        {[
          { icon: "fas fa-certificate", label: "ISO 27001 Information Security" },
          { icon: "fas fa-clipboard-check", label: "SOC 2 Type II Certified" },
          { icon: "fas fa-gavel", label: "GDPR & Data Sovereignty" },
          { icon: "fas fa-shield-alt", label: "Government Security Standards" },
          { icon: "fas fa-lock", label: "AES-256 Encryption at Rest" },
          { icon: "fas fa-network-wired", label: "Zero-Trust Network Architecture" },
          { icon: "fas fa-user-shield", label: "Role-Based Access Control (RBAC)" },
          { icon: "fas fa-history", label: "Full Audit Trail & Log Retention" },
        ].map((c) => (
          <div key={c.label} className="col-lg-3 col-md-4 col-sm-6">
            <ComplianceBadge icon={c.icon} label={c.label} />
          </div>
        ))}
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16, padding: "36px 40px",
        }}
      >
        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <h3 style={{ color: C.white, fontWeight: 700, fontSize: 22, marginBottom: 12 }}>
              Ministry & Defence Deployment Ready
            </h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              Our ERP infrastructure supports air-gapped on-premise deployments
              for classified environments, private cloud deployments on
              government-approved infrastructure, and hybrid configurations with
              full data residency controls. All sensitive workloads can be
              configured to remain entirely within your jurisdiction.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link to="/contact" className="theme-btn" style={{ fontSize: 15 }}>
              Security Briefing
              <i className="far fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── SECTION 6: Implementation Process ───────────────────────────────────────
const Process = () => {
  const steps = [
    { no: "01", title: "Discovery & Assessment", dur: "Week 1 -- 2", desc: "We map your existing processes, data flows, integration points, and compliance requirements. Output: detailed architecture blueprint and project plan." },
    { no: "02", title: "Design & Architecture", dur: "Week 3 -- 5", desc: "Our architects design your ERP data model, AI pipeline, API integrations, and security controls. Sign-off before a single line of code is written." },
    { no: "03", title: "Agile Build & Integration", dur: "Week 6 -- 18", desc: "Modular agile delivery in 2-week sprints with working software at every milestone. Continuous integration testing and stakeholder demos throughout." },
    { no: "04", title: "UAT & Security Review", dur: "Week 19 -- 22", desc: "User acceptance testing with your teams, penetration testing by independent security engineers, and compliance validation against your regulatory requirements." },
    { no: "05", title: "Go-Live & Hypercare", dur: "Week 23 -- 26", desc: "Phased production rollout with a dedicated hypercare team available 24/7 for the first 30 days. Zero-downtime cutover for upgrade projects." },
    { no: "06", title: "Continuous Optimisation", dur: "Ongoing", desc: "Monthly AI model retraining, performance tuning, feature releases, and SLA-backed managed support. Your ERP improves automatically over time." },
  ];

  return (
    <section style={{ padding: "80px 0", background: C.white }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 56 }}>
          <SectionLabel>Implementation</SectionLabel>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#111827", lineHeight: 1.2 }}>
            From Contract to Go-Live in
            <span style={{ color: C.purple }}> Under 6 Months</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 17, marginTop: 16, maxWidth: 560, marginInline: "auto" }}>
            A structured, milestone-driven delivery process with full transparency
            at every stage.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((s) => (
            <div key={s.no} className="col-lg-4 col-md-6">
              <div
                style={{
                  background: "#f8f9fc", border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: "28px 26px", height: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute", top: 24, right: 24,
                    color: `${C.purple}20`, fontSize: 48,
                    fontWeight: 900, lineHeight: 1,
                  }}
                >
                  {s.no}
                </div>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: C.purpleLight, display: "flex",
                    alignItems: "center", justifyContent: "center", marginBottom: 16,
                  }}
                >
                  <span style={{ color: C.purple, fontWeight: 800, fontSize: 16 }}>{s.no}</span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 17, color: "#111827", marginBottom: 4 }}>
                  {s.title}
                </h4>
                <div
                  style={{
                    display: "inline-block", background: `${C.orange}18`,
                    color: C.orange, fontSize: 12, fontWeight: 700,
                    padding: "3px 12px", borderRadius: 20,
                    marginBottom: 14, border: `1px solid ${C.orange}30`,
                  }}
                >
                  {s.dur}
                </div>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 7: FAQ ───────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Can XERXEZ upgrade our SAP system without migration or downtime?",
    a: "Yes. Our AI layer connects to your SAP system via a secure read/write API middleware. Your existing SAP infrastructure, data schema, and workflows remain completely unchanged. The AI upgrade runs alongside your live system -- typically activated within 8-12 weeks with zero operational downtime.",
  },
  {
    q: "Is the ERP suitable for government and defence procurement environments?",
    a: "Designed for it. We support air-gapped on-premise deployments, private government cloud, and hybrid configurations with full data sovereignty. All sensitive data stays within your jurisdiction. We have experience with Ministry-level procurement, compliance auditing, and security accreditation processes.",
  },
  {
    q: "What differentiates XERXEZ AI ERP from off-the-shelf enterprise software?",
    a: "Three things: (1) The AI is built in from day one -- not bolted on. Our forecasting, anomaly detection, and automation are core architecture, not add-on modules. (2) You own all IP. There are no licensing fees after delivery. (3) We build to your processes -- not the other way around. No forced workflow changes.",
  },
  {
    q: "What cloud infrastructure do you deploy on?",
    a: "We are multi-cloud certified on AWS, Microsoft Azure, and Google Cloud Platform. We can deploy on your preferred cloud, on government-approved infrastructure, or on your own on-premise hardware. We do not lock you into any single provider.",
  },
  {
    q: "How is data security handled?",
    a: "AES-256 encryption at rest and in transit, zero-trust network architecture, role-based access control with MFA, full audit trails with tamper-proof log retention, and regular penetration testing by independent security firms. Our infrastructure is ISO 27001 ready and SOC 2 Type II aligned.",
  },
  {
    q: "What ongoing support is provided after go-live?",
    a: "All deployments include 90 days of hypercare support with 24/7 on-call coverage. After hypercare, we offer SLA-backed managed support tiers with dedicated response times. This includes monthly AI model retraining, security patching, and feature releases.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ padding: "80px 0", background: "#f8f9fc" }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 52 }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", color: "#111827", lineHeight: 1.2 }}>
            Questions from Enterprise Buyers
          </h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: C.white,
                  border: `1px solid ${open === i ? C.purple + "44" : C.border}`,
                  borderRadius: 12, marginBottom: 12,
                  boxShadow: open === i ? `0 2px 16px rgba(108,87,210,0.10)` : "none",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%", background: "none", border: "none",
                    padding: "22px 28px", display: "flex",
                    justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", textAlign: "left",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700, fontSize: 16,
                      color: open === i ? C.purple : "#111827",
                    }}
                  >
                    {faq.q}
                  </span>
                  <i
                    className={`fas fa-chevron-${open === i ? "up" : "down"}`}
                    style={{
                      color: open === i ? C.purple : C.textMuted,
                      fontSize: 14, flexShrink: 0,
                      transition: "transform 0.2s",
                    }}
                  ></i>
                </button>
                {open === i && (
                  <div style={{ padding: "0 28px 22px" }}>
                    <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.75, margin: 0 }}>
                      {faq.a}
                    </p>
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

// ─── SECTION 8: CTA ───────────────────────────────────────────────────────────
const CTASection = () => (
  <section
    style={{
      padding: "80px 0",
      background: `linear-gradient(135deg, ${C.purple} 0%, ${C.navy} 100%)`,
    }}
  >
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-7">
          <h2
            style={{
              color: C.white, fontWeight: 800,
              fontSize: "clamp(26px, 3.5vw, 44px)",
              lineHeight: 1.2, marginBottom: 20,
            }}
          >
            Ready to Transform Your
            <br />Enterprise Operations?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.7, marginBottom: 0 }}>
            Whether you're building from scratch or upgrading an existing ERP,
            XERXEZ delivers a solution that meets your exact requirements --
            on time, on budget, and to the security standards your organisation demands.
          </p>
        </div>
        <div className="col-lg-5">
          <div
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 16, padding: "36px 32px",
            }}
          >
            <h4 style={{ color: C.white, fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
              Start the conversation
            </h4>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Our enterprise team responds within 24 hours with a tailored
              briefing pack for your sector.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Link
                to="/contact"
                className="theme-btn"
                style={{
                  textAlign: "center", justifyContent: "center",
                  fontSize: 15, padding: "14px 24px",
                }}
              >
                Request a Demo
                <i className="far fa-arrow-right"></i>
              </Link>
              <a
                href="mailto:xerxez.in@gmail.com?subject=Enterprise ERP Sales Enquiry"
                style={{
                  display: "block", textAlign: "center",
                  background: "rgba(255,255,255,0.15)",
                  color: C.white, padding: "14px 24px",
                  borderRadius: 8, fontWeight: 700, fontSize: 15,
                  border: "1px solid rgba(255,255,255,0.30)",
                  textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <i className="fas fa-envelope" style={{ marginRight: 10 }}></i>
                Contact Enterprise Sales
              </a>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textAlign: "center", marginTop: 20, marginBottom: 0 }}>
              All enquiries are handled under strict NDA
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const AIERPPage = () => (
  <CustomLayout>
    <Hero />
    <TwoTracks />
    <Modules />
    <ROISection />
    <Security />
    <Process />
    <FAQSection />
    <CTASection />
  </CustomLayout>
);

export default AIERPPage;
