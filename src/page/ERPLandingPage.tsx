import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";
import { INDUSTRIES } from "../data/erpIndustriesData";

// ── Brand tokens — identical set used across AIERPPage.tsx / ERPIndustriesPage.tsx ──
const OG    = "#C9883A";
const DARK  = "#1A1A1A";
const BODY  = "#4B4B4B";
const MUT   = "#6B6B6B";
const CREAM = "#F8F7F4";
const WHITE = "#FFFFFF";
const OG_G  = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const DBG   = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const OGL   = "rgba(201,136,58,0.09)";
const OGBRD = "rgba(201,136,58,0.30)";
const BS    = "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";
const FF    = "'DM Sans',sans-serif";

const CONTACT_HREF = `/contact?service=${encodeURIComponent("AI-Powered ERP")}`;

// ── Fade-in wrapper (exact pattern from AIERPPage.tsx FI) ───────────────────────
const FI = ({
  children, delay = 0, y = 28,
}: { children: React.ReactNode; delay?: number; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    viewport={{ once: true, margin: "-60px" }}
  >
    {children}
  </motion.div>
);

// ── Section label pill (exact pattern from AIERPPage.tsx SL) ────────────────────
const SL = ({ t, dark = false }: { t: string; dark?: boolean }) => (
  <div style={{ marginBottom: 14 }}>
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: dark ? "rgba(201,136,58,0.13)" : OGL,
      color: OG, fontSize: 10, fontWeight: 700,
      padding: "5px 16px", borderRadius: 20,
      letterSpacing: "0.16em", textTransform: "uppercase",
      border: `1px solid ${dark ? "rgba(201,136,58,0.28)" : OGBRD}`,
      fontFamily: FF,
    }}>✦ {t}</span>
  </div>
);

// ── Card3D — EXACT copy from AIERPPage.tsx, unmodified ─────────────────────────
const Card3D = ({
  children, accent = OG, style = {}, p = "28px 26px",
}: { children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div style={{
      background: WHITE, borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.07)",
      borderTop: `3px solid ${accent}`,
      boxShadow: h ? BHOV : BCARD,
      transform: h ? "translateY(-7px)" : "translateY(0)",
      transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
      padding: p, cursor: "default", height: "100%", position: "relative", ...style,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </div>
  );
};

// ── Dark glass card — EXACT copy from AIERPPage.tsx DC ──────────────────────────
const DC = ({
  children, accent = OG, style = {}, p = "28px 26px",
}: { children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div style={{
      background: h ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderTop: `2px solid ${accent}`,
      borderRadius: 16, padding: p,
      transform: h ? "translateY(-6px)" : "translateY(0)",
      boxShadow: h
        ? "0 20px 60px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.06)"
        : "0 4px 20px rgba(0,0,0,0.20)",
      transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms ease,background 200ms ease",
      height: "100%", cursor: "default", position: "relative", ...style,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </div>
  );
};

// ── Icon badge (exact pattern from AIERPPage.tsx IB) ────────────────────────────
const IB = ({ icon, size = 48 }: { icon: string; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.292),
    background: OG_G, boxShadow: BS,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginBottom: 18,
  }}>
    <i className={icon} style={{ color: "#fff", fontSize: size * 0.40 }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HERO — dark
// ═══════════════════════════════════════════════════════════════════════════════
const Hero = () => (
  <section style={{ background: DBG, padding: "150px 0 90px", position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "30px 30px", zIndex: 0 }} />
    <div aria-hidden="true" style={{ position: "absolute", top: "-10%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.14) 0%,rgba(204,120,92,0.07) 40%,transparent 70%)", filter: "blur(90px)", pointerEvents: "none", zIndex: 0 }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="row justify-content-center text-center">
        <div className="col-lg-9">
          <FI><SL t="AI-Powered ERP · Built for UAE" dark /></FI>
          <FI delay={0.08}>
            <h1 style={{
              fontFamily: FF, fontWeight: 800, fontSize: "clamp(32px,5vw,58px)",
              lineHeight: 1.1, color: "#fff", margin: "0 0 22px", letterSpacing: "-0.03em",
            }}>
              Stop Managing Engineering<br />Projects on Excel
            </h1>
          </FI>
          <FI delay={0.16}>
            <p style={{
              fontFamily: FF, fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.60)",
              maxWidth: 680, margin: "0 auto 36px",
            }}>
              XERXEZ ERP eliminates manual approvals, document chaos, and procurement bottlenecks —
              built specifically for Engineering, EPC, Oil &amp; Gas, and Construction companies in UAE.
            </p>
          </FI>
          <FI delay={0.24}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 22 }}>
              <Link to={CONTACT_HREF} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: OG_G, color: "#fff", padding: "14px 28px", borderRadius: 10,
                fontWeight: 700, fontSize: 15, textDecoration: "none", fontFamily: FF, boxShadow: BS,
              }}>
                See ERP in Action <i className="far fa-arrow-right" style={{ fontSize: 13 }} />
              </Link>
              <Link to="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.07)", color: "#fff", padding: "14px 28px", borderRadius: 10,
                fontWeight: 600, fontSize: 15, border: "1px solid rgba(255,255,255,0.18)",
                textDecoration: "none", fontFamily: FF,
              }}>
                Book a Demo
              </Link>
            </div>
          </FI>
          <FI delay={0.32}>
            <p style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.40)", margin: 0 }}>
              Invite-only access · UAE-based support · Enterprise deployment
            </p>
          </FI>
        </div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 2. PROBLEM — cream
// ═══════════════════════════════════════════════════════════════════════════════
const PAIN_POINTS = [
  { icon: "fab fa-whatsapp",     text: "Approvals stuck in WhatsApp & Email" },
  { icon: "fas fa-folder-open",  text: "Documents lost across shared drives" },
  { icon: "fas fa-hourglass-half", text: "Procurement delays costing you time" },
  { icon: "fas fa-eye-slash",    text: "No visibility on project costs" },
  { icon: "fas fa-file-excel",   text: "HR processes still running on Excel" },
  { icon: "fas fa-robot",        text: "Zero AI in your daily operations" },
];

const ProblemSection = () => (
  <section style={{ padding: "100px 0", background: CREAM }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="The Problem" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          Sound Familiar?
        </h2>
      </div></FI>
      <div className="row g-4">
        {PAIN_POINTS.map((p, i) => (
          <div key={p.text} className="col-lg-4 col-md-6">
            <FI delay={0.05 * i}>
              <Card3D accent="#ef4444" p="26px 24px" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                  background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={p.icon} style={{ color: "#ef4444", fontSize: 18 }} />
                </div>
                <p style={{ color: DARK, fontSize: 14.5, fontWeight: 700, lineHeight: 1.4, margin: 0, fontFamily: FF }}>{p.text}</p>
              </Card3D>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SOLUTION — dark
// ═══════════════════════════════════════════════════════════════════════════════
const SOLUTION_COLUMNS = [
  {
    icon: "fas fa-file-invoice-dollar", title: "AI Procurement",
    items: ["Auto-extract PO data from PDFs", "Multi-level approval workflows", "Vendor comparison & tracking"],
  },
  {
    icon: "fas fa-file-alt", title: "AI Document Control",
    items: ["Intelligent document classification", "Version control & audit trails", "Search across all documents instantly"],
  },
  {
    icon: "fas fa-users", title: "AI HR & Payroll",
    items: ["Leave & attendance automation", "Payroll processing with approval flow", "Employee self-service portal"],
  },
];

const SolutionSection = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 56 }}>
        <SL t="The Solution" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          One AI-Powered Platform.<br /><span style={{ color: OG }}>Built for How You Work.</span>
        </h2>
      </div></FI>
      <div className="row g-4">
        {SOLUTION_COLUMNS.map((col, i) => (
          <div key={col.title} className="col-lg-4">
            <FI delay={0.08 * i}>
              <DC p="34px 30px">
                <IB icon={col.icon} size={48} />
                <h4 style={{ fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 18, fontFamily: FF }}>{col.title}</h4>
                <ul style={{ padding: 0, margin: 0 }}>
                  {col.items.map((it) => (
                    <li key={it} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 12, listStyle: "none", color: "rgba(255,255,255,0.60)", fontSize: 14, lineHeight: 1.55, fontFamily: FF }}>
                      <i className="fas fa-check-circle" style={{ color: OG, fontSize: 13, marginTop: 3, flexShrink: 0 }} />
                      {it}
                    </li>
                  ))}
                </ul>
              </DC>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 4. INDUSTRIES — cream
// ═══════════════════════════════════════════════════════════════════════════════
const INDUSTRY_COPY: Record<string, string> = {
  "epc": "Manage procurement, documents, and project controls in one place",
  "oil-gas": "Compliance-ready workflows with full audit trails and document intelligence",
  "construction": "Track costs, approvals, and vendor communications from one dashboard",
};
const FEATURED_INDUSTRIES = INDUSTRIES.filter((i) => INDUSTRY_COPY[i.slug]);

const IndustriesSection = () => (
  <section style={{ padding: "100px 0", background: CREAM }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Industries" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
          Built for These Industries
        </h2>
      </div></FI>
      <div className="row g-4 justify-content-center">
        {FEATURED_INDUSTRIES.map((ind, i) => {
          const Icon = ind.icon;
          return (
            <div key={ind.slug} className="col-lg-4 col-md-6">
              <FI delay={0.08 * i}>
                <Card3D accent={ind.shelf} p="30px 26px">
                  <div style={{
                    width: 52, height: 52, borderRadius: 15, marginBottom: 18,
                    background: ind.shelf, display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 4px 0 ${ind.shelf}80,0 6px 18px ${ind.shelf}4D`,
                  }}>
                    <Icon size={24} color="#fff" strokeWidth={2} />
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 10, fontFamily: FF }}>{ind.shortName}</h4>
                  <p style={{ color: BODY, fontSize: 14, lineHeight: 1.65, margin: 0, fontFamily: FF }}>{INDUSTRY_COPY[ind.slug]}</p>
                </Card3D>
              </FI>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MODULES — dark
// ═══════════════════════════════════════════════════════════════════════════════
const MODULES = [
  { icon: "fas fa-users",               label: "Employee Management" },
  { icon: "fas fa-calendar-check",      label: "Leave Management" },
  { icon: "fas fa-money-check-alt",     label: "Payroll" },
  { icon: "fas fa-shopping-cart",       label: "Procurement" },
  { icon: "fas fa-file-alt",            label: "Document Management" },
  { icon: "fas fa-robot",               label: "AI Assistant" },
  { icon: "fas fa-tasks",               label: "Project Management" },
  { icon: "fas fa-calculator",          label: "Cost Estimation" },
  { icon: "fas fa-truck",               label: "Logistics & Dispatch" },
  { icon: "fas fa-chart-bar",           label: "Finance & Accounting" },
  { icon: "fas fa-tools",                label: "Asset Management" },
  { icon: "fas fa-shield-alt",           label: "QHSE" },
  { icon: "fas fa-exclamation-triangle", label: "Risk Register" },
];

const ModulesSection = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Modules" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.2vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: FF, letterSpacing: "-0.02em" }}>
           13+ AI Modules Ready to Deploy
        </h2>
      </div></FI>
      <div className="row g-3">
        {MODULES.map((m, i) => (
          <div key={m.label} className="col-lg-3 col-md-4 col-6">
            <FI delay={0.04 * i}>
              <DC p="24px 18px" style={{ textAlign: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, margin: "0 auto 14px",
                  background: OG_G, boxShadow: BS,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={m.icon} style={{ color: "#fff", fontSize: 18 }} />
                </div>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0, fontFamily: FF, lineHeight: 1.4 }}>{m.label}</p>
              </DC>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 6. TRUST BAR — white
// ═══════════════════════════════════════════════════════════════════════════════
const TRUST_STATS = [
  { val: "4+",       label: "Client Projects Delivered" },
  { val: "13+",      label: "AI Modules Built" },
  { val: "UAE",      label: "Based & Supported" },
  { val: "AI-First", label: "Architecture" },
];

const TrustBar = () => (
  <section style={{ padding: "64px 0", background: WHITE, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
    <div className="container">
      <div className="row g-3">
        {TRUST_STATS.map((s, i) => (
          <div key={s.label} className="col-lg-3 col-6">
            <FI delay={0.06 * i}>
              <Card3D p="22px 18px" style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 26, color: OG, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: FF, fontSize: 11.5, color: MUT, marginTop: 8, lineHeight: 1.3 }}>{s.label}</div>
              </Card3D>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 7. CTA — dark
// ═══════════════════════════════════════════════════════════════════════════════
const CTASection = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="row justify-content-center text-center">
        <div className="col-lg-8">
          <FI>
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(26px,3.5vw,44px)", lineHeight: 1.15, marginBottom: 18, fontFamily: FF, letterSpacing: "-0.025em" }}>
              Ready to See It in Action?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16.5, lineHeight: 1.72, fontFamily: FF, maxWidth: 540, margin: "0 auto 32px" }}>
              We work with a limited number of engineering and industrial companies. Request your demo today.
            </p>
            <Link to={CONTACT_HREF} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: OG_G, color: "#fff", fontWeight: 700, fontSize: 15,
              padding: "14px 30px", borderRadius: 10, textDecoration: "none", fontFamily: FF, boxShadow: BS,
            }}>
              See ERP in Action <i className="far fa-arrow-right" style={{ fontSize: 13 }} />
            </Link>
            <p style={{ fontFamily: FF, fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.40)", marginTop: 20 }}>
              Invite-only access · No commitment required
            </p>
          </FI>
        </div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ═══════════════════════════════════════════════════════════════════════════════
const ERPLandingPage = () => (
  <>
    <SEO
      title="AI-Powered ERP for Engineering & EPC Companies in UAE & India — XERXEZ"
      description="XERXEZ ERP eliminates manual approvals, document chaos, and procurement bottlenecks for Engineering, EPC, Oil & Gas, and Construction companies in the UAE & India."
      canonical="/ai-erp"
      keywords="AI ERP UAE, Engineering ERP, EPC ERP software, Oil and Gas ERP, Construction ERP UAE, XERXEZ ERP"
    />
    <CustomLayout>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <IndustriesSection />
      <ModulesSection />
      <TrustBar />
      <CTASection />
    </CustomLayout>
  </>
);

export default ERPLandingPage;
