/**
 * XzHeroSection — shared dark hero component used across Portfolio, Services, and Training.
 * Keeps visual identity consistent: dark warm gradient + scrolling atmospheric cascade +
 * framer-motion staggered reveals + optional right-column content.
 */
import React, { useRef, useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ── Brand tokens ──────────────────────────────────────────────────────────
const OG = "#C9883A";
const CG = "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)";

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Count-up hook ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration: number, active: boolean) {
  const [v, setV] = useState(prefersReduced ? target : 0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    if (prefersReduced) { setV(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setV(Math.round(e * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setV(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);
  return v;
}

// ── Scrolling atmospheric cascade ─────────────────────────────────────────
const XzCascade: React.FC<{ colA: string[]; colB: string[] }> = ({ colA, colB }) => {
  if (prefersReduced) return null;
  const a = [...colA, ...colA];
  const b = [...colB, ...colB];
  const t: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond',Garamond,serif",
    fontSize: "clamp(15px,2vw,24px)",
    fontWeight: 600, whiteSpace: "nowrap",
    letterSpacing: "0.01em", lineHeight: 1,
  };
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Column A */}
      <div style={{ position: "absolute", left: "7%", top: 0, bottom: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, animation: "xzHeroScrollA 52s linear infinite", willChange: "transform" }}>
          {a.map((m, i) => <span key={i} style={{ ...t, color: "rgba(201,136,58,0.09)" }}>{m}</span>)}
        </div>
      </div>
      {/* Column B — hidden on mobile */}
      <div className="xz-hero-cascade-b" style={{ position: "absolute", right: "5%", top: 0, bottom: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, transform: "translateY(-15%)", animation: "xzHeroScrollB 70s linear infinite", willChange: "transform" }}>
          {b.map((m, i) => <span key={i} style={{ ...t, color: "rgba(204,120,92,0.07)" }}>{m}</span>)}
        </div>
      </div>
      {/* Top & bottom vignettes */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 130, background: "linear-gradient(to bottom,#1a1208 0%,transparent 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "linear-gradient(to top,#0f0a05 0%,transparent 100%)", pointerEvents: "none" }} />
      {/* Warm ambient glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(201,136,58,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
    </div>
  );
};

// ── Stat tile (supports static val or animated count-up) ──────────────────
const StatTile: React.FC<{ stat: XzHeroStat; active: boolean; index: number }> = ({ stat, active, index }) => {
  const counted = useCountUp(stat.raw ?? 0, 1600, active && stat.raw !== undefined);
  const display  = stat.raw !== undefined ? `${counted}${stat.suffix ?? ""}` : (stat.val ?? "");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.14 }}
      style={{ textAlign: "center", padding: "18px 26px", borderLeft: index > 0 ? "1px solid rgba(255,255,255,0.09)" : "none" }}
    >
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 700, color: OG, lineHeight: 1 }}>
        {display}
      </div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
        {stat.label}
      </div>
    </motion.div>
  );
};

// ── Public types ──────────────────────────────────────────────────────────
export interface XzHeroStat {
  /** Static display string (e.g. "8+"). Use when count-up is not desired. */
  val?: string;
  /** Numeric target for count-up animation. Supply `suffix` for "50+" style. */
  raw?: number;
  suffix?: string;
  label: string;
}

export interface XzHeroCta {
  label: string;
  /** Internal React Router path */
  to?: string;
  /** External/anchor href */
  href?: string;
  primary: boolean;
}

export interface XzHeroProps {
  /** Short badge label shown above the headline */
  badgeText: string;
  /** Headline as ReactNode so callers can do mixed bold/italic/color treatment */
  headline: ReactNode;
  description: string;
  ctas: XzHeroCta[];
  stats: XzHeroStat[];
  /** Background cascade — Column A (left, faster) */
  cascadeA: string[];
  /** Background cascade — Column B (right, slower) */
  cascadeB: string[];
  /** Optional right-column content (floating card, visualization, etc.) */
  right?: ReactNode;
  /** Optional section id for anchor links */
  id?: string;
}

// ── Component ─────────────────────────────────────────────────────────────
const XzHeroSection: React.FC<XzHeroProps> = ({
  badgeText, headline, description, ctas, stats, cascadeA, cascadeB, right, id,
}) => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsActive(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes xzHeroScrollA {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes xzHeroScrollB {
          from { transform: translateY(-15%); }
          to   { transform: translateY(-65%); }
        }
        @keyframes xzHeroBadgeDot {
          0%,100% { opacity:.5; transform:scale(1); }
          50%     { opacity:1; transform:scale(1.6); }
        }
        @media (max-width: 767px) {
          .xz-hero-cascade-b { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      <section
        id={id}
        style={{
          background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)",
          padding: "140px 0 110px",
          position: "relative", overflow: "hidden",
          minHeight: "58vh", display: "flex", alignItems: "center",
        }}
      >
        <XzCascade colA={cascadeA} colB={cascadeB} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="row g-5 align-items-center">

            {/* Left: text stack */}
            <div className={right ? "col-xl-6 col-lg-7" : "col-12 col-lg-8"}>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{ marginBottom: 24 }}
              >
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 9,
                  background: "rgba(201,136,58,0.11)", border: "1px solid rgba(201,136,58,0.26)",
                  borderRadius: 999, padding: "6px 18px",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: OG, fontFamily: "'DM Sans',sans-serif",
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%", background: OG, display: "inline-block",
                    animation: prefersReduced ? "none" : "xzHeroBadgeDot 2.2s ease-in-out infinite",
                  }} />
                  {badgeText}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08 }}
                style={{ marginBottom: 20 }}
              >
                {headline}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.20 }}
                style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.78,
                  color: "rgba(255,255,255,0.50)", marginBottom: 38, maxWidth: 500,
                }}
              >
                {description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.30 }}
                style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: stats.length > 0 ? 52 : 0 }}
              >
                {ctas.map((cta, i) => {
                  const base: React.CSSProperties = {
                    display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
                    fontWeight: cta.primary ? 700 : 600, fontSize: 14,
                    padding: "13px 28px", borderRadius: 10, textDecoration: "none",
                    fontFamily: "'DM Sans',sans-serif", minHeight: 44,
                    ...(cta.primary
                      ? { background: CG, color: "#fff", boxShadow: "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.28)" }
                      : { background: "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.16)" }),
                  };
                  const icon = <i className="far fa-arrow-right" style={{ fontSize: 12 }} />;
                  return cta.to
                    ? <Link key={i} to={cta.to} style={base}>{cta.label} {icon}</Link>
                    : <a key={i} href={cta.href ?? "#"} style={base}>{cta.label} {icon}</a>;
                })}
              </motion.div>

              {/* Stats strip */}
              {stats.length > 0 && (
                <div ref={statsRef} style={{
                  display: "inline-flex", flexWrap: "wrap",
                  background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
                }}>
                  {stats.map((s, i) => (
                    <StatTile key={s.label} stat={s} active={statsActive} index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* Right: optional floating card / visualization */}
            {right && (
              <div className="col-xl-5 col-lg-5 offset-xl-1 d-none d-lg-flex justify-content-center align-items-center">
                <motion.div
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: "100%", maxWidth: 340 }}
                >
                  {right}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default XzHeroSection;
