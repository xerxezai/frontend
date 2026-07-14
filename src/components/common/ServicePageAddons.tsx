/**
 * Shared conversion-focused sections reused across every service page
 * (the 8 ServicePageTemplate pages + the bespoke AIERPPage).
 * Visual language matches ServicePageTemplate.tsx / AIERPPage.tsx exactly.
 */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const OG    = "#C9883A";
const DARK  = "#1A1A1A";
const CREAM = "#F2EFE9";
const WHITE = "#FFFFFF";
const OG_G  = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const DBG   = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const OGL   = "rgba(201,136,58,0.09)";
const OGBRD = "rgba(201,136,58,0.30)";
const BS    = "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)";

const FI = ({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    viewport={{ once: true, margin: "-60px" }}
  >{children}</motion.div>
);

const SL = ({ t, dark = false }: { t: string; dark?: boolean }) => (
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

// ── 1. Trust signals — real numbers only, identical on every service page ────
const TRUST_SIGNALS = [
  { icon: "fas fa-diagram-project", val: "50+",   label: "Projects Delivered" },
  { icon: "fas fa-earth-americas",  val: "5+",     label: "Countries Served" },
  { icon: "fas fa-server",          val: "99.8%",  label: "Uptime" },
  { icon: "fas fa-user-graduate",   val: "75+",    label: "Professionals Trained" },
  { icon: "fas fa-clock",           val: "24h",    label: "Response Time" },
];

export const TrustSignalsBar = () => (
  <div style={{ background: WHITE, borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "28px 0" }}>
    <div className="container">
      <div className="row g-3 justify-content-center text-center">
        {TRUST_SIGNALS.map((s, i) => (
          <div key={s.label} className="col-6 col-md" style={{ borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <FI delay={0.04 * i}>
              <i className={s.icon} style={{ color: OG, fontSize: 15, marginBottom: 6, display: "block" }} />
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: DARK, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: "#8B7A6A", marginTop: 4, letterSpacing: "0.04em" }}>{s.label}</div>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── 2. Pain points ──────────────────────────────────────────────────────────
export const PainPointsSection = ({ points, href = "/contact" }: { points: string[]; href?: string }) => (
  <section style={{ padding: "90px 0 96px", background: CREAM }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 48 }}>
        <SL t="The Problem" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,40px)", color: DARK, lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          Are you struggling with...?
        </h2>
      </div></FI>
      <div className="row g-3 justify-content-center" style={{ maxWidth: 880, margin: "0 auto" }}>
        {points.map((p, i) => (
          <div className="col-md-6" key={p}>
            <FI delay={0.06 * i}>
              <div style={{
                background: WHITE, borderRadius: 14, height: "100%",
                border: "1px solid rgba(239,68,68,0.14)", borderLeft: "3px solid #ef4444",
                padding: "20px 22px", display: "flex", gap: 13, alignItems: "flex-start",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.05)",
              }}>
                <i className="fas fa-times-circle" style={{ color: "#ef4444", fontSize: 17, marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: DARK, fontWeight: 600, fontSize: 14.5, lineHeight: 1.55, fontFamily: "'DM Sans',sans-serif" }}>{p}</span>
              </div>
            </FI>
          </div>
        ))}
      </div>
      <FI delay={0.3}>
        <div style={{ textAlign: "center", marginTop: 44 }}>
          <Link to={href} style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            background: OG_G, color: "#fff", fontWeight: 700, fontSize: 15,
            padding: "14px 30px", borderRadius: 10, textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif", boxShadow: BS,
          }}>
            Solve This With XERXEZ <i className="far fa-arrow-right" style={{ fontSize: 13 }} />
          </Link>
        </div>
      </FI>
    </div>
  </section>
);

// ── 3. Results / ROI stats ───────────────────────────────────────────────────
export const ResultsSection = ({ stats }: { stats: { val: string; label: string }[] }) => (
  <section style={{ padding: "96px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Proven Results" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          Real Numbers. <span style={{ color: OG }}>Real Impact.</span>
        </h2>
      </div></FI>
      <div className="row g-4">
        {stats.map((s, i) => (
          <div key={s.label} className="col-lg-3 col-6">
            <FI delay={0.08 * i}>
              <div style={{
                textAlign: "center", padding: "34px 18px", height: "100%",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                borderTop: `2px solid ${OG}`, borderRadius: 16,
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 700, color: OG, lineHeight: 1 }}>{s.val}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, marginTop: 10, lineHeight: 1.4, fontFamily: "'DM Sans',sans-serif" }}>{s.label}</div>
              </div>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── 4. Testimonial ───────────────────────────────────────────────────────────
export const TestimonialSection = ({ quote, author }: { quote: string; author: string }) => (
  <section style={{ padding: "92px 0", background: CREAM }}>
    <div className="container">
      <FI>
        <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
          <i className="fas fa-quote-left" style={{ color: OGBRD, fontSize: 30, marginBottom: 22, display: "block" }} />
          <p style={{
            fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic",
            fontSize: "clamp(19px,2.4vw,27px)", color: DARK, lineHeight: 1.55, marginBottom: 22,
          }}>
            &ldquo;{quote}&rdquo;
          </p>
          <div style={{ width: 40, height: 2, background: OG_G, margin: "0 auto 14px" }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13.5, color: OG, letterSpacing: "0.02em", margin: 0 }}>{author}</p>
        </div>
      </FI>
    </div>
  </section>
);

// ── 5. Bottom CTA — identical copy on every page ────────────────────────────
export const BottomCTASection = ({ href = "/contact" }: { href?: string }) => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "12%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div aria-hidden="true" style={{ position: "absolute", bottom: -100, right: "12%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,120,92,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
      <FI>
        <div style={{ display: "flex", justifyContent: "center" }}><SL t="Get Started" dark /></div>
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", marginBottom: 18, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.025em" }}>
          Ready to Transform Your Business?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.72, fontFamily: "'DM Sans',sans-serif" }}>
          Join enterprises across 5+ countries already using XERXEZ. Get a free consultation within 24 hours.
        </p>
        <Link to={href} style={{
          display: "inline-flex", alignItems: "center", gap: 10, background: OG_G, color: "#fff",
          fontWeight: 700, fontSize: 16, padding: "16px 38px", borderRadius: 12, textDecoration: "none",
          fontFamily: "'DM Sans',sans-serif", boxShadow: BS, marginBottom: 30,
        }}>
          Book Free Consultation <i className="far fa-arrow-right" style={{ fontSize: 14 }} />
        </Link>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
          {["No commitment required", "Response within 24 hours", "Free consultation call included"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <i className="fas fa-check-circle" style={{ color: OG, fontSize: 14 }} />
              <span style={{ color: "rgba(255,255,255,0.60)", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{t}</span>
            </div>
          ))}
        </div>
      </FI>
    </div>
  </section>
);

// ── 6. Floating mobile CTA — sticky, mobile only ────────────────────────────
export const FloatingMobileCTA = ({ href = "/contact" }: { href?: string }) => (
  <>
    <style>{`
      @media (max-width: 767px) {
        .xz-floating-mobile-cta { display: flex !important; }
      }
    `}</style>
    <div className="xz-floating-mobile-cta" style={{
      display: "none",
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
      background: DARK, borderTop: `2px solid ${OG}`,
      padding: "12px 16px", boxShadow: "0 -4px 20px rgba(0,0,0,0.28)",
    }}>
      <Link to={href} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: OG_G, color: "#fff", fontWeight: 700, fontSize: 15,
        padding: "13px 20px", borderRadius: 10, textDecoration: "none",
        fontFamily: "'DM Sans',sans-serif", width: "100%",
      }}>
        <i className="fas fa-bolt" style={{ fontSize: 13 }} />
        Get Free Quote
      </Link>
    </div>
  </>
);
