import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";

// ── brand tokens (verbatim, see AIERPPage.tsx / CareersPage.tsx) ────────────
const OG    = "#C9883A";
const DARK  = "#1a1208";
const CREAM = "#F8F7F4";
const WHITE = "#FFFFFF";
const MUT   = "#6B6B6B";
const FF    = "'DM Sans',sans-serif";
const OG_G  = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const DBG   = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const OGL   = "rgba(201,136,58,0.09)";
const OGBRD = "rgba(201,136,58,0.30)";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";

const FI = ({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    viewport={{ once: true, margin: "-60px" }}
  >
    {children}
  </motion.div>
);

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700,
  textAlign: "center", margin: "0 0 12px",
};
const sectionSub: React.CSSProperties = {
  fontFamily: FF, fontSize: 15.5, textAlign: "center", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.6,
};

// ── data ──────────────────────────────────────────────────────────────────
const WHY_CARDS = [
  { emoji: "💰", icon: "fas fa-money-bill-wave", title: "High Commission", text: "Earn 10-30% commission on every deal you close. No cap on earnings." },
  { emoji: "🎯", icon: "fas fa-bullseye", title: "Ready Market", text: "UAE Engineering and EPC companies are actively looking for AI-powered ERP solutions. The market is ready." },
  { emoji: "🛠️", icon: "fas fa-tools", title: "Full Support", text: "We provide product training, demo support, sales materials, and a dedicated XERXEZ team to help you close deals." },
  { emoji: "🌍", icon: "fas fa-globe", title: "Sell From Anywhere", text: "Based in any country? No problem. Sell remotely and earn commissions paid in AED, USD, or INR." },
];

const PACKAGES = [
  { name: "Basic", badge: null, border: "rgba(255,255,255,0.15)", highlight: false, modules: "Dashboard, HR & Payroll, CRM, Sales, Accounting", pct: 10 },
  { name: "Professional", badge: "Most Popular", border: OG, highlight: true, modules: "Everything in Basic + Procurement, Logistics, Document Management", pct: 20 },
  { name: "Enterprise", badge: null, border: "rgba(201,136,58,0.50)", highlight: false, modules: "Everything in Professional + Project Management, Asset Management, QHSE, MLM", pct: 30 },
] as const;

const AED_TO_USD = 0.27;
const AED_TO_INR = 22.50;

const STEPS = [
  { n: "01", icon: "fas fa-file-alt", title: "Apply", text: "Fill out the partner application on our website. We review within 48 hours." },
  { n: "02", icon: "fas fa-check-circle", title: "Get Approved", text: "Once approved, you receive your Partner Portal login and unique partner code (XRZ-XXX)." },
  { n: "03", icon: "fas fa-handshake", title: "Sell", text: "Use our training materials and sales kit to approach Engineering & EPC companies. Submit deals through your partner portal." },
  { n: "04", icon: "fas fa-money-bill-wave", title: "Earn", text: "When deal is confirmed, your commission is calculated and paid within 30 days." },
];

const GET_ITEMS = [
  { icon: "fas fa-laptop", title: "Partner Portal Access", text: "Login at xerxez.com/partner to track your deals and commissions in real time." },
  { icon: "fas fa-id-badge", title: "Unique Partner Code", text: "Your own XRZ-XXX code to identify your referred clients and track your earnings." },
  { icon: "fas fa-graduation-cap", title: "Product Training", text: "Complete training on all XERXEZ ERP modules so you can confidently pitch to any client." },
  { icon: "fas fa-file-powerpoint", title: "Sales Materials", text: "Product presentations, brochures, and email templates ready to use with your prospects." },
  { icon: "fas fa-users", title: "Demo Support", text: "XERXEZ team joins your client demo calls to help present and close the deal." },
  { icon: "fas fa-chart-line", title: "Real-time Tracking", text: "Track every deal status and commission amount in your partner dashboard." },
];

const WHO_ITEMS = [
  "Have connections in Engineering, EPC, Construction, Oil & Gas, or Manufacturing companies",
  "Have B2B sales experience",
  "Can communicate in English or Arabic",
  "Are based in UAE, GCC, or any other country",
  "Want to earn commission without any upfront investment",
  "Can dedicate part-time hours to selling",
];

const FAQS = [
  { q: "Do I need technical knowledge to sell XERXEZ ERP?", a: "No. We provide full product training. You just need to understand the client's pain points and introduce XERXEZ as the solution. Our team handles the technical demo." },
  { q: "How much can I earn per deal?", a: "It depends on the package sold and the deal value. For example, if you sell a Professional Package worth AED 50,000, you earn AED 10,000 (20% commission). Use our commission calculator above to estimate your earnings." },
  { q: "In which currency will I be paid?", a: "We pay in AED (UAE Dirham) by default. We can also arrange payment in USD or INR based on your preference and location." },
  { q: "When do I get paid?", a: "Commissions are paid within 30 days of the client making their payment to XERXEZ." },
  { q: "Can I sell from outside UAE?", a: "Yes! You can be based anywhere in the world. Many of our partners sell remotely and receive payment internationally." },
  { q: "Is there a minimum number of deals required?", a: "No minimum. Sell at your own pace. There is no pressure, quota, or time limit." },
  { q: "How do I submit a deal?", a: "Once approved, login to your Partner Portal at xerxez.com/partner and fill the deal submission form. Our team will contact the client within 24 hours to schedule a demo." },
  { q: "What is the application process?", a: "Fill the form at xerxez.com/contact under the \"Become a Partner\" tab. We review all applications within 48 hours and send login credentials if approved." },
];

// ── commission calculator ────────────────────────────────────────────────
function CommissionCalculator() {
  const [dealValue, setDealValue] = useState("");
  const v = parseFloat(dealValue) || 0;
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20,
      padding: "36px 32px", maxWidth: 720, margin: "0 auto",
    }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#fff", textAlign: "center", margin: "0 0 24px" }}>
        💡 Commission Calculator
      </h3>

      <label style={{ display: "block", fontFamily: FF, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        Enter Deal Value (AED)
      </label>
      <input
        type="number" value={dealValue} onChange={e => setDealValue(e.target.value)} placeholder="e.g. 50000"
        style={{
          width: "100%", boxSizing: "border-box", height: 52, padding: "0 18px", borderRadius: 12,
          border: "1.5px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)", color: "#fff",
          fontFamily: FF, fontSize: 16, outline: "none", marginBottom: 24,
        }}
      />

      {v > 0 && (
        <div style={{ animation: "xzPtFadeUp 0.3s ease both" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 18px", marginBottom: 18, textAlign: "center" }}>
            <span style={{ fontFamily: FF, fontSize: 13.5, color: "rgba(255,255,255,0.75)" }}>
              Deal Value: <strong style={{ color: "#fff" }}>AED {fmt(v)}</strong> = <strong style={{ color: "#fff" }}>USD {fmt(v * AED_TO_USD)}</strong> = <strong style={{ color: "#fff" }}>INR {fmt(v * AED_TO_INR)}</strong>
            </span>
          </div>

          <p style={{ fontFamily: FF, fontSize: 12, fontWeight: 700, color: OG, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
            Your Commission
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PACKAGES.map(p => {
              const commission = v * p.pct / 100;
              return (
                <div key={p.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
                  background: "#fff", borderRadius: 10, padding: "12px 18px", border: p.highlight ? `1.5px solid ${OG}` : "1px solid rgba(0,0,0,0.06)",
                }}>
                  <span style={{ fontFamily: FF, fontSize: 13.5, fontWeight: 700, color: "#141413" }}>
                    {p.name} Package ({p.pct}%)
                  </span>
                  <span style={{ fontFamily: FF, fontSize: 13.5, fontWeight: 800, color: OG }}>
                    AED {fmt(commission)} <span style={{ color: "#9b9690", fontWeight: 600 }}>|</span> USD {fmt(commission * AED_TO_USD)} <span style={{ color: "#9b9690", fontWeight: 600 }}>|</span> INR {fmt(commission * AED_TO_INR)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p style={{ fontFamily: FF, fontSize: 11.5, color: "rgba(255,255,255,0.38)", textAlign: "center", margin: "22px 0 0", lineHeight: 1.6 }}>
        * Exchange rates are approximate. Actual payment in AED, USD, or INR based on your preference.
      </p>
    </div>
  );
}

// ── FAQ accordion ─────────────────────────────────────────────────────────
function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      {FAQS.map((item, i) => (
        <div key={item.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          <button
            type="button" onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              padding: "20px 4px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
            }}
            aria-expanded={open === i}
          >
            <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 15.5, color: "#fff" }}>{item.q}</span>
            <i className={`fas fa-chevron-${open === i ? "up" : "down"}`} style={{ color: OG, fontSize: 13, flexShrink: 0 }} />
          </button>
          {open === i && (
            <div style={{ padding: "0 4px 22px", animation: "xzPtFadeUp 0.25s ease both" }}>
              <p style={{ fontFamily: FF, fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: 0 }}>{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────
const PartnersPage = () => (
  <CustomLayout>
    <SEO
      title="Partner Program — Earn Up to 30% Commission | XERXEZ"
      description="Join the XERXEZ Partner Program and earn 10-30% commission selling AI-Powered ERP to Engineering and EPC companies in UAE. Apply today."
      canonical="/partners"
    />
    <style>{`
      @keyframes xzPtFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      .xz-pt-btn-outline:hover { background: rgba(255,255,255,0.08) !important; }
      .xz-pt-btn-outline-dark:hover { background: rgba(26,18,8,0.06) !important; }
    `}</style>

    {/* ── SECTION 1 — Hero ── */}
    <section style={{ background: DBG, padding: "160px 20px 80px", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 780 }}>
        <FI>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: OGL, border: `1px solid ${OGBRD}`,
            borderRadius: 100, padding: "7px 20px", marginBottom: 24, fontFamily: FF, fontSize: 11.5, fontWeight: 700,
            letterSpacing: "0.16em", textTransform: "uppercase", color: OG,
          }}>
            ✦ Partner Program
          </span>
        </FI>
        <FI delay={0.08}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(34px,5.5vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, margin: "0 0 20px" }}>
            Earn Up to 30% Commission<br />
            <em style={{ color: OG, fontStyle: "normal" }}>Selling AI-Powered ERP</em>
          </h1>
        </FI>
        <FI delay={0.16}>
          <p style={{ fontFamily: FF, fontSize: 16.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 36px" }}>
            Join the XERXEZ Partner Program and earn industry-leading commissions by introducing Engineering, EPC, and Industrial companies to the future of business operations.
          </p>
        </FI>
        <FI delay={0.24}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 56 }}>
            <Link to="/contact#partner" style={{
              display: "flex", alignItems: "center", gap: 9, background: OG_G, color: "#fff", textDecoration: "none",
              fontFamily: FF, fontWeight: 700, fontSize: 15, padding: "15px 30px", borderRadius: 12,
              boxShadow: "0 4px 0 rgba(120,70,15,0.50), 0 8px 24px rgba(201,136,58,0.25)",
            }}>
              Become a Partner <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />
            </Link>
            <Link to="/partner" className="xz-pt-btn-outline" style={{
              display: "flex", alignItems: "center", gap: 9, background: "transparent", color: "#fff", textDecoration: "none",
              fontFamily: FF, fontWeight: 700, fontSize: 15, padding: "15px 30px", borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.25)", transition: "background 150ms ease",
            }}>
              Partner Login
            </Link>
          </div>
        </FI>
        <FI delay={0.32}>
          <div style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
            {[
              { val: "30%", label: "Max Commission" },
              { val: "AED · USD · INR", label: "Payment Currency Options" },
              { val: "48hrs", label: "Application Review" },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: "0 32px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: OG, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6, whiteSpace: "nowrap" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FI>
      </div>
    </section>

    {/* ── SECTION 2 — Why Partner With Us ── */}
    <section style={{ background: CREAM, padding: "90px 20px" }}>
      <div className="container">
        <FI><h2 style={{ ...sectionTitle, color: "#141413" }}>Why Partner With XERXEZ?</h2></FI>
        <div style={{ height: 48 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {WHY_CARDS.map((c, i) => (
            <FI key={c.title} delay={i * 0.08}>
              <div style={{
                background: WHITE, borderRadius: 16, borderTop: `3px solid ${OG}`, boxShadow: BCARD,
                padding: "30px 26px", height: "100%", boxSizing: "border-box",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: OGL, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: 18, fontSize: 22,
                }}>
                  <i className={c.icon} style={{ color: OG, fontSize: 20 }} />
                </div>
                <h3 style={{ fontFamily: FF, fontSize: 16.5, fontWeight: 800, color: "#141413", margin: "0 0 10px" }}>
                  {c.emoji} {c.title}
                </h3>
                <p style={{ fontFamily: FF, fontSize: 13.5, color: MUT, lineHeight: 1.7, margin: 0 }}>{c.text}</p>
              </div>
            </FI>
          ))}
        </div>
      </div>
    </section>

    {/* ── SECTION 3 — Commission Structure ── */}
    <section style={{ background: DBG, padding: "90px 20px" }}>
      <div className="container">
        <FI><h2 style={{ ...sectionTitle, color: "#fff" }}>Commission Structure</h2></FI>
        <FI delay={0.06}><p style={{ ...sectionSub, color: "rgba(255,255,255,0.55)" }}>The more you sell, the more you earn</p></FI>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, marginBottom: 64 }}>
          {PACKAGES.map((p, i) => (
            <FI key={p.name} delay={i * 0.08}>
              <div style={{
                position: "relative", background: "rgba(255,255,255,0.03)", borderRadius: 18,
                border: `1.5px solid ${p.border}`, padding: "34px 28px", height: "100%", boxSizing: "border-box",
                boxShadow: p.highlight ? "0 12px 40px rgba(201,136,58,0.15)" : "none",
              }}>
                {p.badge && (
                  <span style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    background: OG_G, color: "#fff", fontFamily: FF, fontSize: 10.5, fontWeight: 800,
                    letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 16px", borderRadius: 100,
                    whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(201,136,58,0.35)",
                  }}>
                    {p.badge}
                  </span>
                )}
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#fff", margin: "8px 0 14px" }}>
                  {p.name} Package
                </h3>
                <p style={{ fontFamily: FF, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 22px", minHeight: 66 }}>
                  {p.modules}
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 18 }}>
                  <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                    Commission
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 700, color: OG }}>
                    {p.pct}% <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>of deal value</span>
                  </div>
                </div>
              </div>
            </FI>
          ))}
        </div>

        <FI delay={0.1}><CommissionCalculator /></FI>

        <FI delay={0.16}>
          <div style={{
            maxWidth: 720, margin: "32px auto 0", background: OGL, border: `1px solid ${OGBRD}`, borderRadius: 16,
            padding: "26px 30px",
          }}>
            {[
              "Commissions paid within 30 days of client payment",
              "Payment in AED, USD, or INR based on your preference",
              "No cap on monthly earnings",
              "Recurring commission on renewals",
            ].map(line => (
              <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <i className="fas fa-check-circle" style={{ color: OG, fontSize: 14, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: FF, fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        </FI>
      </div>
    </section>

    {/* ── SECTION 4 — How It Works ── */}
    <section style={{ background: CREAM, padding: "90px 20px" }}>
      <div className="container">
        <FI><h2 style={{ ...sectionTitle, color: "#141413" }}>How It Works</h2></FI>
        <FI delay={0.06}><p style={{ ...sectionSub, color: MUT }}>4 simple steps to start earning</p></FI>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
              <FI delay={i * 0.1}>
                <div style={{ width: 220, textAlign: "center" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", background: OG_G, display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 6px 20px rgba(201,136,58,0.30)",
                  }}>
                    <i className={s.icon} style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 800, color: OG, letterSpacing: "0.1em", marginBottom: 6 }}>STEP {s.n}</div>
                  <h3 style={{ fontFamily: FF, fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 10px" }}>{s.title}</h3>
                  <p style={{ fontFamily: FF, fontSize: 13, color: MUT, lineHeight: 1.65, margin: 0 }}>{s.text}</p>
                </div>
              </FI>
              {i < STEPS.length - 1 && (
                <i className="fas fa-arrow-right" style={{ color: "rgba(0,0,0,0.15)", fontSize: 18, margin: "0 4px 90px", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── SECTION 5 — What You Get ── */}
    <section style={{ background: DBG, padding: "90px 20px" }}>
      <div className="container">
        <FI><h2 style={{ ...sectionTitle, color: "#fff" }}>What You Get as a Partner</h2></FI>
        <div style={{ height: 48 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "28px 40px", maxWidth: 960, margin: "0 auto" }}>
          {GET_ITEMS.map((item, i) => (
            <FI key={item.title} delay={(i % 2) * 0.08}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: `1px solid ${OGBRD}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <i className={item.icon} style={{ color: OG, fontSize: 17 }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: FF, fontSize: 15.5, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
                    ✦ {item.title}
                  </h3>
                  <p style={{ fontFamily: FF, fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                </div>
              </div>
            </FI>
          ))}
        </div>
      </div>
    </section>

    {/* ── SECTION 6 — Who Should Apply ── */}
    <section style={{ background: CREAM, padding: "90px 20px" }}>
      <div className="container">
        <FI><h2 style={{ ...sectionTitle, color: "#141413" }}>Who Should Apply?</h2></FI>
        <FI delay={0.06}><p style={{ ...sectionSub, color: MUT }}>You're a great fit if you:</p></FI>

        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {WHO_ITEMS.map((item, i) => (
            <FI key={item} delay={i * 0.05}>
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 14, background: WHITE, borderRadius: 12,
                padding: "16px 20px", boxShadow: BCARD,
              }}>
                <span style={{
                  width: 26, height: 26, borderRadius: "50%", background: OGL, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0, marginTop: 1,
                }}>
                  <i className="fas fa-check" style={{ color: OG, fontSize: 12 }} />
                </span>
                <span style={{ fontFamily: FF, fontSize: 14.5, color: "#141413", lineHeight: 1.6 }}>{item}</span>
              </div>
            </FI>
          ))}
        </div>
      </div>
    </section>

    {/* ── SECTION 7 — FAQ ── */}
    <section style={{ background: DBG, padding: "90px 20px" }}>
      <div className="container">
        <FI><h2 style={{ ...sectionTitle, color: "#fff" }}>Frequently Asked Questions</h2></FI>
        <div style={{ height: 40 }} />
        <FaqAccordion />
      </div>
    </section>

    {/* ── SECTION 8 — CTA Banner ── */}
    <section style={{ background: OG, padding: "72px 20px" }}>
      <div className="container" style={{ textAlign: "center", maxWidth: 620 }}>
        <FI>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,38px)", fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
            Ready to Start Earning?
          </h2>
        </FI>
        <FI delay={0.06}>
          <p style={{ fontFamily: FF, fontSize: 15.5, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, margin: "0 0 32px" }}>
            Join the XERXEZ Partner Program today. Apply in 5 minutes, get approved in 48 hours.
          </p>
        </FI>
        <FI delay={0.12}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/contact#partner" style={{
              display: "flex", alignItems: "center", gap: 9, background: DARK, color: "#fff", textDecoration: "none",
              fontFamily: FF, fontWeight: 700, fontSize: 15, padding: "15px 30px", borderRadius: 12,
              boxShadow: "0 4px 0 rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.20)",
            }}>
              Apply Now <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />
            </Link>
            <Link to="/partner" className="xz-pt-btn-outline-dark" style={{
              display: "flex", alignItems: "center", gap: 9, background: "transparent", color: "#fff", textDecoration: "none",
              fontFamily: FF, fontWeight: 700, fontSize: 15, padding: "15px 30px", borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.6)", transition: "background 150ms ease",
            }}>
              Login to Portal <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />
            </Link>
          </div>
        </FI>
      </div>
    </section>
  </CustomLayout>
);

export default PartnersPage;
