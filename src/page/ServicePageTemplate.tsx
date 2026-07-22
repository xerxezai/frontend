/**
 * ServicePageTemplate — shared layout for all 8 non-ERP service pages.
 * Matches AIERPPage.tsx visual language exactly:
 *   brand tokens, Card3D / DC glass cards, FI motion wrapper, SL pill, IB badge.
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import XzHeroSection from "../components/common/XzHeroSection";
import type { XzHeroStat } from "../components/common/XzHeroSection";
import CustomLayout from "../components/layout/CustomLayout";
import {
  TrustSignalsBar,
  PainPointsSection,
  FloatingMobileCTA,
} from "../components/common/ServicePageAddons";

// ── Brand tokens (identical to AIERPPage) ─────────────────────────────────────
const OG    = "#C9883A";
const DARK  = "#1A1A1A";
const BODY  = "#4B4B4B";
const MUT   = "#6B6B6B";
const CREAM = "#F2EFE9";
const WHITE = "#FFFFFF";
const OG_G  = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const DBG   = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const OGL   = "rgba(201,136,58,0.09)";
const OGBRD = "rgba(201,136,58,0.30)";
const BS    = "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

const pref = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

// ── Motion fade-in wrapper (identical to AIERPPage FI) ────────────────────────
const FI = ({ children, delay = 0, y = 28, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    viewport={{ once: true, margin: "-60px" }}
    className={className}
  >{children}</motion.div>
);

// ── Section label pill (identical to AIERPPage SL) ────────────────────────────
export const SL = ({ t, dark = false }: { t: string; dark?: boolean }) => (
  <div style={{ marginBottom: 14 }}>
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: dark ? "rgba(201,136,58,0.13)" : OGL,
      color: OG, fontSize: 10, fontWeight: 700,
      padding: "5px 16px", borderRadius: 20,
      letterSpacing: "0.16em", textTransform: "uppercase",
      border: `1px solid ${dark ? "rgba(201,136,58,0.28)" : OGBRD}`,
      fontFamily: "'DM Sans',sans-serif",
    }}>✦ {t}</span>
  </div>
);

// ── Icon badge (identical to AIERPPage IB) ────────────────────────────────────
const IB = ({ icon, size = 48 }: { icon: string; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.292),
    background: OG_G, boxShadow: BS,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginBottom: 20,
  }}>
    <i className={icon} style={{ color: "#fff", fontSize: size * 0.40 }} />
  </div>
);

// ── Light 3D card (identical to AIERPPage Card3D) ─────────────────────────────
const Card3D = ({ children, style = {}, p = "28px 26px" }: {
  children: React.ReactNode; style?: React.CSSProperties; p?: string;
}) => {
  const [h, setH] = useState(false);
  return (
    <div
      style={{
        background: WHITE, borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.07)",
        borderTop: `3px solid ${OG}`,
        boxShadow: h ? BHOV : BCARD,
        transform: h ? "translateY(-7px)" : "translateY(0)",
        transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
        padding: p, cursor: "default", height: "100%", position: "relative", ...style,
      }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    >{children}</div>
  );
};

// ── Dark glass card (identical to AIERPPage DC) ───────────────────────────────
const DC = ({ children, style = {}, p = "30px 28px" }: {
  children: React.ReactNode; style?: React.CSSProperties; p?: string;
}) => {
  const [h, setH] = useState(false);
  return (
    <div
      style={{
        background: h ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderTop: `2px solid ${OG}`,
        borderRadius: 16, padding: p,
        transform: h ? "translateY(-6px)" : "translateY(0)",
        boxShadow: h
          ? "0 20px 60px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.06)"
          : "0 4px 20px rgba(0,0,0,0.20)",
        transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms ease,background 200ms ease",
        height: "100%", cursor: "default", position: "relative", ...style,
      }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    >{children}</div>
  );
};

// ── Hero right-column card: 2×2 stat grid ────────────────────────────────────
export const ServiceHeroCard = ({ icon, title, stats }: {
  icon: string; title: string;
  stats: { val: string; label: string }[];
}) => (
  <div style={{
    background: "linear-gradient(160deg,#faf7f3 0%,#e8e0d4 100%)",
    border: "1px solid rgba(210,195,175,0.6)",
    boxShadow: "0 6px 0 rgba(155,130,100,0.45),0 12px 32px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.90)",
    borderRadius: 20, padding: "28px 24px",
  }}>
    {/* header */}
    <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 22 }}>
      <div style={{
        width: 50, height: 50, borderRadius: 14, flexShrink: 0,
        background: OG_G, boxShadow: BS,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={icon} style={{ color: "#fff", fontSize: 21 }} />
      </div>
      <div>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: OG, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>XERXEZ Service</p>
        <h4 style={{ fontSize: 15, fontWeight: 800, color: DARK, margin: 0, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.2 }}>{title}</h4>
      </div>
    </div>
    {/* 2×2 stat grid */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 16 }}>
      {stats.slice(0, 4).map((s, i) => (
        <div key={i} style={{
          background: WHITE, border: "1px solid rgba(0,0,0,0.07)",
          borderTop: `2px solid ${OG}`, borderRadius: 12, padding: "13px 13px",
          boxShadow: BCARD,
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: OG, lineHeight: 1 }}>{s.val}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, color: MUT, marginTop: 5, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.3 }}>{s.label}</div>
        </div>
      ))}
    </div>
    {/* status */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px rgba(74,222,128,0.6)", flexShrink: 0 }} />
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: MUT }}>Available now · responds within 24 h</span>
    </div>
  </div>
);

// ── Public types ──────────────────────────────────────────────────────────────
export interface ServiceFeature  { icon: string; title: string; desc: string; }
export interface ServiceStep     { no: string; title: string; dur: string; desc: string; }
export interface ServiceUseCase  { icon: string; label: string; desc: string; }
export interface ServiceFAQ      { q: string; a: string; }

export interface ServicePageConfig {
  seoTitle:   string;
  seoDesc:    string;
  /** Exact value from ContactSection2's SERVICES list — pre-selects "Service of Interest" on /contact. */
  serviceName: string;
  badgeText:  string;
  headline:   React.ReactNode;
  description: string;
  heroStats:  XzHeroStat[];
  cascadeA:   string[];
  cascadeB:   string[];
  heroRight:  React.ReactNode;
  trustBar:   { icon: string; label: string }[];
  featureLabel: string;
  featureTitle: React.ReactNode;
  features:   ServiceFeature[];
  processLabel: string;
  processTitle: React.ReactNode;
  steps:      ServiceStep[];
  useCaseLabel: string;
  useCaseTitle: React.ReactNode;
  useCases:   ServiceUseCase[];
  faqTitle:   React.ReactNode;
  faqs:       ServiceFAQ[];
  ctaTitle:   React.ReactNode;
  ctaDesc:    string;
  ctaTags:    string[];
  /** Optional conversion add-on — section only renders when data is provided. */
  painPoints?: string[];
}

// ── SEO helper ────────────────────────────────────────────────────────────────
function useSEO(title: string, desc: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    const set = (n: string, c: string) => {
      let el = document.querySelector(`meta[name="${n}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    set("description", desc);
    return () => { document.title = prev; };
  }, [title, desc]);
}

// ════════════════════════════════════════════════════════════════════════════
// SECTIONS
// ════════════════════════════════════════════════════════════════════════════

// 1. Trust bar
const TrustBar = ({ items }: { items: { icon: string; label: string }[] }) => (
  <div style={{ background: WHITE, borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "14px 0" }}>
    <div className="container">
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: MUT, letterSpacing: "0.10em", textTransform: "uppercase", marginRight: 10, flexShrink: 0 }}>Certified &amp; Compliant</span>
        {items.map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && <span style={{ color: "rgba(0,0,0,0.15)", fontSize: 14, lineHeight: 1 }}>·</span>}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: OGL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={item.icon} style={{ color: OG, fontSize: 11 }} />
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: BODY, whiteSpace: "nowrap" }}>{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

// 2. Key Features (white)
const FeaturesSection = ({ label, title, features }: {
  label: string; title: React.ReactNode; features: ServiceFeature[];
}) => (
  <section style={{ padding: "100px 0", background: WHITE }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 60 }}>
        <SL t={label} />
        <div style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>{title}</div>
      </div></FI>
      <div className="row g-4">
        {features.map((f, i) => (
          <div key={f.title} className="col-lg-4 col-md-6">
            <FI delay={0.06 + (i % 3) * 0.09}>
              <Card3D p="30px 28px">
                <IB icon={f.icon} size={48} />
                <h4 style={{ fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>{f.title}</h4>
                <p style={{ color: BODY, fontSize: 14, lineHeight: 1.70, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{f.desc}</p>
              </Card3D>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 3. Process / How It Works (dark)
const ProcessSection = ({ label, title, steps }: {
  label: string; title: React.ReactNode; steps: ServiceStep[];
}) => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 56 }}>
        <SL t={label} dark />
        <div style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>{title}</div>
      </div></FI>
      <div className="row g-4">
        {steps.map((s, i) => (
          <div key={s.no} className="col-lg-4 col-md-6">
            <FI delay={0.06 + (i % 3) * 0.09}>
              <DC p="30px 28px">
                <div aria-hidden="true" style={{ position: "absolute", top: 18, right: 22, color: "rgba(201,136,58,0.07)", fontSize: 56, fontWeight: 900, lineHeight: 1, fontFamily: "'DM Sans',sans-serif", userSelect: "none", pointerEvents: "none" }}>{s.no}</div>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: OG_G, boxShadow: BS, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>{s.no}</span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{s.title}</h4>
                <span style={{ display: "inline-block", background: "rgba(201,136,58,0.13)", color: OG, fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, marginBottom: 14, border: "1px solid rgba(201,136,58,0.28)", fontFamily: "'DM Sans',sans-serif" }}>{s.dur}</span>
                <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 14, lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{s.desc}</p>
              </DC>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 4. Use Cases (cream)
const UseCasesSection = ({ label, title, useCases }: {
  label: string; title: React.ReactNode; useCases: ServiceUseCase[];
}) => (
  <section style={{ padding: "100px 0", background: CREAM }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t={label} />
        <div style={{ fontWeight: 800, fontSize: "clamp(24px,3vw,40px)", color: DARK, lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>{title}</div>
      </div></FI>
      <div className="row g-3 justify-content-center">
        {useCases.map((u, i) => (
          <div key={u.label} className="col-lg-4 col-md-6">
            <FI delay={0.06 * i}>
              <Card3D p="28px 24px">
                <div style={{ width: 52, height: 52, borderRadius: 14, background: OG_G, boxShadow: BS, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 0 16px" }}>
                  <i className={u.icon} style={{ color: "#fff", fontSize: 22 }} />
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{u.label}</h4>
                <p style={{ color: BODY, fontSize: 13.5, lineHeight: 1.68, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{u.desc}</p>
              </Card3D>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 5. FAQ (white)
const FAQSection = ({ title, faqs }: { title: React.ReactNode; faqs: ServiceFAQ[] }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ padding: "100px 0", background: WHITE }}>
      <div className="container">
        <FI><div className="text-center" style={{ marginBottom: 52 }}>
          <SL t="FAQ" />
          <div style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>{title}</div>
        </div></FI>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {faqs.map((faq, i) => (
              <FI key={i} delay={0.04 * i}>
                <div style={{
                  background: WHITE, borderRadius: 14, marginBottom: 12,
                  border: `1px solid ${open === i ? OGBRD : "rgba(0,0,0,0.07)"}`,
                  borderTop: `3px solid ${open === i ? OG : "rgba(0,0,0,0.07)"}`,
                  boxShadow: open === i ? BHOV : BCARD,
                  transform: open === i ? "translateY(-3px)" : "translateY(0)",
                  overflow: "hidden",
                  transition: "transform 240ms cubic-bezier(0.22,1,0.36,1),box-shadow 240ms,border-color 200ms",
                }}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 16 }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 15.5, color: open === i ? OG : DARK, fontFamily: "'DM Sans',sans-serif", transition: "color 200ms" }}>{faq.q}</span>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: open === i ? OG_G : CREAM, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: open === i ? BS : "none", transition: "background 200ms,box-shadow 200ms" }}>
                      <i className={`fas fa-chevron-${open === i ? "up" : "down"}`} style={{ color: open === i ? "#fff" : MUT, fontSize: 11 }} />
                    </div>
                  </button>
                  <div style={{ maxHeight: open === i ? "400px" : "0", overflow: "hidden", transition: pref ? "none" : "max-height 0.38s cubic-bezier(0.22,1,0.36,1)" }}>
                    <div style={{ padding: "0 28px 22px" }}>
                      <p style={{ color: BODY, fontSize: 15, lineHeight: 1.78, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              </FI>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 6. CTA (dark — identical to AIERPPage CTASection)
const CTASection = ({ title, desc, tags, contactHref }: { title: React.ReactNode; desc: string; tags: string[]; contactHref: string }) => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div aria-hidden="true" style={{ position: "absolute", bottom: -100, right: "12%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,120,92,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="row align-items-center g-5">
        <div className="col-lg-7">
          <FI>
            <SL t="Get Started" dark />
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", lineHeight: 1.12, marginBottom: 22, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.025em" }}>{title}</div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1.72, fontFamily: "'DM Sans',sans-serif", maxWidth: 500 }}>{desc}</p>
            <div style={{ display: "flex", gap: 20, marginTop: 36, flexWrap: "wrap" }}>
              {tags.map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <i className="fas fa-check-circle" style={{ color: OG, fontSize: 14 }} />
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{t}</span>
                </div>
              ))}
            </div>
          </FI>
        </div>
        <div className="col-lg-5">
          <FI delay={0.18}>
            <div style={{ background: WHITE, borderRadius: 22, padding: "40px 36px", boxShadow: "0 0 0 6px rgba(255,255,255,0.06),0 32px 80px rgba(0,0,0,0.38)", borderTop: `4px solid ${OG}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: OG_G, boxShadow: BS, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fas fa-rocket" style={{ color: "#fff", fontSize: 17 }} />
                </div>
                <div>
                  <div style={{ color: DARK, fontWeight: 700, fontSize: 18, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.2 }}>Start the conversation</div>
                  <div style={{ color: MUT, fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>Enterprise team responds within 24 hours</div>
                </div>
              </div>
              <p style={{ color: MUT, fontSize: 14, marginBottom: 28, lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>
                Get a tailored briefing pack with solution architecture, timeline, and cost estimate for your requirements.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link to={contactHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 24px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.28)" }}>
                  Request A Demo <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
                </Link>
                <a href="mailto:xerxez.in@gmail.com?subject=Enterprise Sales Enquiry" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: CREAM, color: DARK, padding: "13px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "1px solid rgba(0,0,0,0.10)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
                  <i className="fas fa-envelope" style={{ color: OG, fontSize: 13 }} />
                  Contact Enterprise Sales
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20 }}>
                <i className="fas fa-lock" style={{ color: OG, fontSize: 11 }} />
                <p style={{ color: MUT, fontSize: 12, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>All enquiries handled under strict NDA</p>
              </div>
            </div>
          </FI>
        </div>
      </div>
    </div>
  </section>
);

// ════════════════════════════════════════════════════════════════════════════
// PAGE TEMPLATE ROOT
// ════════════════════════════════════════════════════════════════════════════
const ServicePageTemplate: React.FC<{ config: ServicePageConfig }> = ({ config }) => {
  useSEO(config.seoTitle, config.seoDesc);
  const contactHref = `/contact?service=${encodeURIComponent(config.serviceName)}`;
  return (
    <CustomLayout>
      <XzHeroSection
        badgeText={config.badgeText}
        headline={config.headline}
        description={config.description}
        ctas={[
          { label: "Request a Demo",          to: contactHref,                                             primary: true  },
          { label: "Contact Enterprise Sales", href: "mailto:xerxez.in@gmail.com?subject=Enterprise Enquiry", primary: false },
        ]}
        stats={config.heroStats}
        cascadeA={config.cascadeA}
        cascadeB={config.cascadeB}
        right={config.heroRight}
      />
      <TrustSignalsBar />
      <TrustBar items={config.trustBar} />
      {config.painPoints && <PainPointsSection points={config.painPoints} href={contactHref} />}
      <FeaturesSection label={config.featureLabel} title={config.featureTitle} features={config.features} />
      <ProcessSection  label={config.processLabel} title={config.processTitle} steps={config.steps} />
      <UseCasesSection label={config.useCaseLabel} title={config.useCaseTitle} useCases={config.useCases} />
      <FAQSection title={config.faqTitle} faqs={config.faqs} />
      <CTASection title={config.ctaTitle} desc={config.ctaDesc} tags={config.ctaTags} contactHref={contactHref} />
      <FloatingMobileCTA href={contactHref} />
    </CustomLayout>
  );
};

export default ServicePageTemplate;
