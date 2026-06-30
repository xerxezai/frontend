import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import XzHeroSection from "../components/common/XzHeroSection";
import CustomLayout from "../components/layout/CustomLayout";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const OG      = "#C9883A";
const C2      = "#cc785c";
const DARK    = "#1A1A1A";
const BODY    = "#4B4B4B";
const MUT     = "#6B6B6B";
const CREAM   = "#F2EFE9";
const WHITE   = "#FFFFFF";
const OG_G    = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const C2_G    = "linear-gradient(145deg,#e09070 0%,#cc785c 100%)";
const DBG     = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const OGL     = "rgba(201,136,58,0.09)";
const OGBRD   = "rgba(201,136,58,0.30)";
const OGDEEP  = "rgba(150,95,30,0.50)";
const C2DEEP  = "rgba(140,70,40,0.45)";
const BS      = "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)";
const BS2     = "0 4px 0 rgba(140,70,40,0.45),0 6px 20px rgba(204,120,92,0.28)";
const BCARD   = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV    = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

const pref =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion:reduce)").matches;

// ── Reusable fade-in wrapper ──────────────────────────────────────────────────
const FI = ({
  children, delay = 0, y = 28, className = "",
}: { children: React.ReactNode; delay?: number; y?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    viewport={{ once: true, margin: "-60px" }}
    className={className}
  >
    {children}
  </motion.div>
);

// ── Section label pill ────────────────────────────────────────────────────────
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

// ── Icon badge ────────────────────────────────────────────────────────────────
const IB = ({ icon, size = 48, coral = false, mb = 20 }: { icon: string; size?: number; coral?: boolean; mb?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.292),
    background: coral ? C2_G : OG_G,
    boxShadow: coral ? BS2 : BS,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginBottom: mb,
  }}>
    <i className={icon} style={{ color: "#fff", fontSize: size * 0.40 }} />
  </div>
);

// ── Light 3D card ─────────────────────────────────────────────────────────────
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

// ── Dark glass card ───────────────────────────────────────────────────────────
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

// ── ERP Network Hub (hero right column) ───────────────────────────────────────
const ERP_HUB = { cx: 210, cy: 205, r: 42 };
const ERP_NODES = [
  { id: "fin", cx: 210, cy: 55,  r: 22, label: "Finance",   color: "#F5A623", glow: "rgba(245,166,35,0.28)"  },
  { id: "hr",  cx: 340, cy: 130, r: 22, label: "HR",        color: "#8B5CF6", glow: "rgba(139,92,246,0.28)"  },
  { id: "crm", cx: 340, cy: 280, r: 22, label: "CRM",       color: "#cc785c", glow: "rgba(204,120,92,0.28)"  },
  { id: "ai",  cx: 210, cy: 355, r: 26, label: "AI / ML",   color: "#C9883A", glow: "rgba(201,136,58,0.28)"  },
  { id: "log", cx: 80,  cy: 280, r: 22, label: "Logistics", color: "#D46A1A", glow: "rgba(212,106,26,0.28)"  },
  { id: "inv", cx: 80,  cy: 130, r: 22, label: "Inventory", color: "#6B3FA0", glow: "rgba(107,63,160,0.28)"  },
];

const ERPHub = () => {
  const [mounted, setMounted] = useState(false);
  const [flash, setFlash]     = useState(-1);
  const cardRef = useRef<HTMLDivElement>(null);
  const hlRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 120); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (pref) return;
    const id = setInterval(() => {
      setFlash(Math.floor(Math.random() * ERP_NODES.length));
      setTimeout(() => setFlash(-1), 700);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pref) return;
    const el = cardRef.current; const hl = hlRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    const rY = (x - 0.5) * 20, rX = (0.5 - y) * 12;
    el.style.transition = "transform 0.08s linear,box-shadow 0.08s linear";
    el.style.transform  = `perspective(1000px) rotateX(${rY}deg) rotateY(${rX}deg) scale(1.02)`;
    el.style.boxShadow  = `${(-rY*1.4).toFixed(1)}px ${(36+rX).toFixed(1)}px 80px rgba(100,60,20,0.38)`;
    if (hl) {
      hl.style.opacity    = "1";
      hl.style.background = `radial-gradient(ellipse 55% 45% at ${(x*100).toFixed(1)}% ${(y*100).toFixed(1)}%,rgba(255,215,185,0.12) 0%,transparent 65%)`;
    }
  };
  const onLeave = () => {
    if (pref) return;
    const el = cardRef.current;
    if (el) { el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1),box-shadow 0.55s ease"; el.style.transform = ""; el.style.boxShadow = ""; }
    if (hlRef.current) hlRef.current.style.opacity = "0";
    setTimeout(() => { if (cardRef.current) cardRef.current.style.transition = ""; }, 560);
  };

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        background: "#1a1208", border: "1px solid rgba(180,140,100,0.15)",
        borderRadius: 20, padding: "16px 16px 12px",
        boxShadow: "0 40px 80px rgba(100,60,20,0.25),0 0 0 1px rgba(255,255,255,0.03) inset",
        animation: pref ? "none" : "erpCardIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both",
        transformStyle: "preserve-3d", willChange: "transform", position: "relative",
      }}>
      {/* specular */}
      <div ref={hlRef} aria-hidden="true" style={{
        position: "absolute", inset: 0, borderRadius: 20,
        pointerEvents: "none", opacity: 0, zIndex: 10,
        transition: "background 0.12s ease,opacity 0.25s ease",
      }} />
      {/* warm glow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 40% at 50% 0%,rgba(201,136,58,0.09) 0%,transparent 70%)",
      }} />

      {/* top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12, position: "relative", zIndex: 2, transform: "translateZ(14px)",
      }}>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(180,140,100,0.5)", textTransform: "uppercase" }}>ERP NETWORK</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 7px #4ade80,0 0 14px rgba(74,222,128,0.4)", animation: pref ? "none" : "erpLivePulse 1.8s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "#4ade80" }}>LIVE</span>
        </div>
      </div>

      {/* SVG network */}
      <div style={{ position: "relative", zIndex: 2, transform: "translateZ(20px)" }}>
        <svg viewBox="0 0 420 420" width="100%" style={{ overflow: "visible", display: "block" }} aria-label="XERXEZ AI ERP module network">
          <defs>
            <pattern id="erpDot" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
              <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(180,140,100,0.06)" />
            </pattern>
            <filter id="erpHGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="8" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="erpTGlow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="erpHFill" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="rgba(201,136,58,0.30)"/>
              <stop offset="100%" stopColor="rgba(201,136,58,0.06)"/>
            </radialGradient>
          </defs>
          <rect width="420" height="420" fill="url(#erpDot)"/>

          {ERP_NODES.map((n, i) => {
            const dx = n.cx - ERP_HUB.cx, dy = n.cy - ERP_HUB.cy;
            const len = Math.ceil(Math.sqrt(dx*dx + dy*dy));
            return (
              <line key={`l-${n.id}`} x1={ERP_HUB.cx} y1={ERP_HUB.cy} x2={n.cx} y2={n.cy}
                stroke={n.color} strokeWidth="1" strokeOpacity="0.22" strokeDasharray={len}
                style={{
                  strokeDashoffset: mounted && !pref ? 0 : len,
                  transition: pref ? "none" : `stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) ${0.3+i*0.1}s`,
                }} />
            );
          })}

          {ERP_NODES.map((n, i) => (
            <circle key={`t-${n.id}`} r="2.5" fill={n.color} filter="url(#erpTGlow)"
              opacity={mounted && !pref ? 0.9 : 0}
              style={{ transition: `opacity 0.3s ease ${0.9+i*0.1}s` }}>
              {!pref && <animateMotion dur={`${2.8+i*0.35}s`} repeatCount="indefinite" path={`M ${ERP_HUB.cx},${ERP_HUB.cy} L ${n.cx},${n.cy}`}/>}
            </circle>
          ))}

          {ERP_NODES.map((n, i) => (
            <g key={n.id} style={{ opacity: mounted ? 1 : 0, transition: pref ? "none" : `opacity 0.55s ease ${0.5+i*0.1}s` }}>
              <circle cx={n.cx} cy={n.cy} r={n.r+5} fill="none" stroke={n.color} strokeWidth="0.8">
                <animate attributeName="r" values={`${n.r+3};${n.r+16};${n.r+3}`} dur={`${3.2+i*0.3}s`} repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.45;0;0.45" dur={`${3.2+i*0.3}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={n.cx} cy={n.cy} r={n.r+2} fill={n.glow}/>
              <circle cx={n.cx} cy={n.cy} r={n.r} fill={flash===i ? n.color+"30" : "rgba(26,18,8,0.85)"} stroke={n.color} strokeWidth="1.4" strokeOpacity="0.85"/>
              <circle cx={n.cx} cy={n.cy-n.r+6} r="2.5" fill={n.color} filter="url(#erpTGlow)"/>
              <text x={n.cx} y={n.cy+5} textAnchor="middle" fill="rgba(255,255,255,0.80)" fontSize="8.5" fontFamily="'Inter',sans-serif" fontWeight="600">{n.label}</text>
            </g>
          ))}

          <circle cx={ERP_HUB.cx} cy={ERP_HUB.cy} r={ERP_HUB.r+30} fill="rgba(201,136,58,0.05)"/>
          <circle cx={ERP_HUB.cx} cy={ERP_HUB.cy} r={ERP_HUB.r+18} fill="rgba(201,136,58,0.08)"/>
          <circle cx={ERP_HUB.cx} cy={ERP_HUB.cy} r={ERP_HUB.r+13} fill="none" stroke="#cc785c" strokeWidth="1.2" strokeDasharray="8 6" strokeOpacity="0.55">
            {!pref && <animateTransform attributeName="transform" type="rotate" from={`0 ${ERP_HUB.cx} ${ERP_HUB.cy}`} to={`360 ${ERP_HUB.cx} ${ERP_HUB.cy}`} dur="14s" repeatCount="indefinite"/>}
          </circle>
          <circle cx={ERP_HUB.cx} cy={ERP_HUB.cy} r={ERP_HUB.r+5} fill="none" stroke="#cc785c" strokeWidth="0.7" strokeDasharray="3 9" strokeOpacity="0.30">
            {!pref && <animateTransform attributeName="transform" type="rotate" from={`360 ${ERP_HUB.cx} ${ERP_HUB.cy}`} to={`0 ${ERP_HUB.cx} ${ERP_HUB.cy}`} dur="20s" repeatCount="indefinite"/>}
          </circle>
          <circle cx={ERP_HUB.cx} cy={ERP_HUB.cy} r={ERP_HUB.r} fill="url(#erpHFill)" stroke="#cc785c" strokeWidth="1.8" strokeOpacity="0.92" filter="url(#erpHGlow)"/>
          <circle cx={ERP_HUB.cx} cy={ERP_HUB.cy} r={ERP_HUB.r+4} fill="none" stroke="#cc785c" strokeWidth="1.6">
            <animate attributeName="r" values={`${ERP_HUB.r+2};${ERP_HUB.r+24};${ERP_HUB.r+2}`} dur="3s" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.55;0;0.55" dur="3s" repeatCount="indefinite"/>
          </circle>
          <text x={ERP_HUB.cx} y={ERP_HUB.cy-5} textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="12" fontFamily="'Cormorant Garamond',serif" fontWeight="700">XERXEZ</text>
          <text x={ERP_HUB.cx} y={ERP_HUB.cy+10} textAnchor="middle" fill="rgba(201,136,58,0.70)" fontSize="6.5" fontFamily="'Courier New',monospace" fontWeight="500" letterSpacing="2">ERP CORE</text>
        </svg>
      </div>
    </div>
  );
};

// ── Cascade content ───────────────────────────────────────────────────────────
const ERP_CA = ["Finance & Accounting","Human Resources","Supply Chain","CRM & Sales","AI Analytics Engine","Inventory Management","Procurement","Compliance & Audit","Logistics & Dispatch"];
const ERP_CB = ["40% Cost Reduction","60% Faster Decisions","99.9% Uptime SLA","Zero Migration Risk","8-Week AI Upgrade","Full IP Ownership","$4M+ Client Savings","Enterprise Grade","ISO 27001 Certified"];

// ── SEO ───────────────────────────────────────────────────────────────────────
const useSEO = () => {
  useEffect(() => {
    const p = document.title;
    document.title = "AI-Powered ERP System | XERXEZ Enterprise Solutions";
    const up = (n: string, c: string) => {
      let el = document.querySelector(`meta[name="${n}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    up("description", "XERXEZ builds AI-powered ERP from scratch or upgrades your existing SAP, Oracle, or Microsoft Dynamics — enterprise-grade, government deployment ready, ISO 27001 and SOC 2 aligned.");
    up("keywords", "AI ERP, enterprise resource planning, SAP upgrade, Oracle AI, ERP software, XERXEZ, government ERP");
    return () => { document.title = p; };
  }, []);
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HERO
// ═══════════════════════════════════════════════════════════════════════════════
const Hero = () => (
  <XzHeroSection
    badgeText="AI-Powered ERP · Flagship Product"
    headline={
      <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
        Intelligent ERP for<br />
        <em style={{ color: C2, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
          Enterprise Operations
        </em>
      </h1>
    }
    description="Build a new AI ERP from scratch, or layer intelligent automation onto your existing SAP, Oracle, or Dynamics — zero migration risk, zero downtime."
    ctas={[
      { label: "Request a Demo",         to: "/contact",                                                              primary: true  },
      { label: "Contact Enterprise Sales", href: "mailto:info@xerxez.com?subject=Enterprise ERP Enquiry",            primary: false },
    ]}
    stats={[
      { val: "40%",   label: "Cost Reduction"  },
      { val: "60%",   label: "Faster Decisions"},
      { val: "99.9%", label: "Uptime SLA"      },
    ]}
    cascadeA={ERP_CA}
    cascadeB={ERP_CB}
    right={<ERPHub />}
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// 2. TWO DELIVERY TRACKS  — cream
// ═══════════════════════════════════════════════════════════════════════════════
const TrackCard = ({
  accent, accentGrad, accentDeep, accentLight, track, icon, title, desc, bullets, info, systems,
}: {
  accent: string; accentGrad: string; accentDeep: string; accentLight: string;
  track: string; icon: string; title: string; desc: string;
  bullets: string[]; info: string; systems?: string[];
}) => {
  const [h, setH] = useState(false);
  return (
    <div style={{
      background: WHITE, borderRadius: 18,
      border: `1px solid rgba(0,0,0,0.07)`, borderTop: `3px solid ${accent}`,
      boxShadow: h ? BHOV : BCARD,
      transform: h ? "translateY(-6px)" : "translateY(0)",
      transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
      padding: "44px 40px", height: "100%", cursor: "default",
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <div style={{ width: 52, height: 52, borderRadius: 15, background: accentGrad, boxShadow: `0 4px 0 ${accentDeep},0 6px 18px rgba(201,136,58,0.22)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <i className={icon} style={{ color: "#fff", fontSize: 22 }} />
      </div>
      <span style={{ display: "inline-block", background: accentLight, color: accent, fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, border: `1px solid ${accent}44`, marginBottom: 16, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{track}</span>
      <h3 style={{ fontWeight: 800, fontSize: 24, color: DARK, marginBottom: 12, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>{title}</h3>
      <p style={{ color: BODY, fontSize: 15, lineHeight: 1.72, marginBottom: 28, fontFamily: "'DM Sans',sans-serif" }}>{desc}</p>
      <ul style={{ padding: 0, margin: 0, marginBottom: 28 }}>
        {bullets.map((b) => (
          <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 11, listStyle: "none", color: BODY, fontSize: 14.5, lineHeight: 1.55, fontFamily: "'DM Sans',sans-serif" }}>
            <i className="fas fa-check-circle" style={{ color: accent, fontSize: 15, marginTop: 2, flexShrink: 0 }} />
            {b}
          </li>
        ))}
      </ul>
      <div style={{ padding: "16px 20px", background: CREAM, borderRadius: 10, borderLeft: `3px solid ${accent}`, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)" }}>
        <p style={{ margin: 0, color: BODY, fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }} dangerouslySetInnerHTML={{ __html: info }} />
      </div>
      {systems && (
        <div style={{ marginTop: 22 }}>
          <p style={{ color: MUT, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Compatible Systems</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {systems.map((s) => (
              <span key={s} style={{ background: CREAM, color: BODY, fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.07)", fontFamily: "'DM Sans',sans-serif" }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TwoTracks = () => (
  <section style={{ padding: "100px 0", background: CREAM }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 60 }}>
        <SL t="Two Delivery Models" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          Build New. Or Make Existing <span style={{ color: OG }}>Intelligent.</span>
        </h2>
        <p style={{ color: BODY, fontSize: 17, marginTop: 16, maxWidth: 580, marginInline: "auto", fontFamily: "'DM Sans',sans-serif" }}>
          The only enterprise technology partner that delivers both paths with equal depth — no trade-offs.
        </p>
      </div></FI>
      <div className="row g-4">
        <div className="col-lg-6"><FI delay={0.1}>
          <TrackCard
            accent={OG} accentGrad={OG_G} accentDeep={OGDEEP} accentLight={OGL}
            track="Track A" icon="fas fa-code-branch"
            title="We Build Your AI ERP from Scratch"
            desc="A purpose-built, cloud-native ERP designed entirely around your business model, industry, and compliance requirements. No legacy constraints. No forced compromises."
            bullets={["Fully custom modules: Finance, HR, CRM, Inventory, Sales, Logistics","AI demand forecasting & anomaly detection baked in from day one","API-first architecture — integrates with any third-party platform","Role-based dashboards for C-suite, department heads, and field staff","Multi-currency, multi-language, multi-entity support","White-labelled, fully owned IP transferred to you at delivery"]}
            info="<strong>Typical timeline:</strong> 4&ndash;6 months for a fully operational system with live AI analytics and role dashboards."
          />
        </FI></div>
        <div className="col-lg-6"><FI delay={0.2}>
          <TrackCard
            accent={C2} accentGrad={C2_G} accentDeep={C2DEEP} accentLight="rgba(204,120,92,0.09)"
            track="Track B" icon="fas fa-layer-group"
            title="We Upgrade Your Existing ERP with AI"
            desc="Your organisation has already invested in SAP, Oracle, or Microsoft Dynamics. XERXEZ layers an intelligent AI engine on top — zero migration risk, zero downtime."
            bullets={["Compatible with SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365","AI forecasting & automation added via secure API bridge","Real-time data unification across existing modules and silos","Predictive maintenance, procurement automation, HR analytics","Compliance-safe: no changes to your existing data schema","Live within 8–12 weeks alongside your running production system"]}
            info="<strong>No disruption guarantee:</strong> Our AI layer runs via secure middleware &mdash; your ERP keeps running exactly as today."
            systems={["SAP","Oracle","MS Dynamics","NetSuite","Odoo","Sage"]}
          />
        </FI></div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 3. COMPARISON TABLE  — dark
// ═══════════════════════════════════════════════════════════════════════════════
const TABLE_ROWS = [
  { feature: "Starting point",         build: "Greenfield — designed from scratch",        upgrade: "Your existing SAP / Oracle / Dynamics" },
  { feature: "Deployment timeline",    build: "4 – 6 months",                             upgrade: "8 – 12 weeks" },
  { feature: "Data migration",         build: "Full migration with cleansing",             upgrade: "No migration — reads existing data" },
  { feature: "Customisation level",    build: "100% custom to your processes",             upgrade: "AI layer adapts to existing setup" },
  { feature: "IP ownership",           build: "Full IP transferred to client",             upgrade: "AI modules fully owned by client" },
  { feature: "Operational disruption", build: "Phased cutover, minimal downtime",          upgrade: "Zero downtime — runs alongside live ERP" },
  { feature: "Compliance changes",     build: "Full compliance architecture built in",     upgrade: "No changes to existing compliance posture" },
  { feature: "Ideal for",             build: "No ERP, legacy system, or full replatform", upgrade: "Existing enterprise ERP investment" },
];

const ComparisonTable = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Side-by-Side Comparison" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(24px,3vw,40px)", color: "#fff", lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          Build from Scratch vs <span style={{ color: OG }}>Upgrade Existing ERP</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 16, marginTop: 14, maxWidth: 540, marginInline: "auto", fontFamily: "'DM Sans',sans-serif" }}>
          Choose the path that fits your organisation. Both deliver the same AI-powered outcome — different starting points.
        </p>
      </div></FI>

      <FI delay={0.15}>
        <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.09)", borderTop: `3px solid ${OG}`, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600, background: "rgba(255,255,255,0.03)" }}>
              <thead>
                <tr>
                  <th style={{ padding: "18px 24px", background: "rgba(255,255,255,0.04)", textAlign: "left", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.30)", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)", width: "27%", fontFamily: "'DM Sans',sans-serif" }}>Feature</th>
                  <th style={{ padding: "18px 24px", background: "rgba(201,136,58,0.10)", textAlign: "left", fontSize: 14, fontWeight: 800, color: OG, borderBottom: `1px solid ${OGBRD}`, width: "37%", fontFamily: "'DM Sans',sans-serif" }}>
                    <i className="fas fa-code-branch" style={{ marginRight: 8 }} />Build from Scratch
                  </th>
                  <th style={{ padding: "18px 24px", background: "rgba(204,120,92,0.09)", textAlign: "left", fontSize: 14, fontWeight: 800, color: C2, borderBottom: "1px solid rgba(204,120,92,0.28)", width: "36%", fontFamily: "'DM Sans',sans-serif" }}>
                    <i className="fas fa-layer-group" style={{ marginRight: 8 }} />Upgrade Existing ERP
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "15px 24px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.70)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontFamily: "'DM Sans',sans-serif" }}>{row.feature}</td>
                    <td style={{ padding: "15px 24px", fontSize: 13, color: "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.06)", borderLeft: `2px solid ${OGBRD}`, fontFamily: "'DM Sans',sans-serif" }}>
                      <i className="fas fa-check-circle" style={{ color: OG, marginRight: 8, fontSize: 12 }} />{row.build}
                    </td>
                    <td style={{ padding: "15px 24px", fontSize: 13, color: "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.06)", borderLeft: "2px solid rgba(204,120,92,0.28)", fontFamily: "'DM Sans',sans-serif" }}>
                      <i className="fas fa-check-circle" style={{ color: C2, marginRight: 8, fontSize: 12 }} />{row.upgrade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FI>

      <FI delay={0.25}><div className="row g-3 mt-4">
        <div className="col-md-6">
          <Link to="/contact?type=build" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)", color: "#fff", padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)" }}>
            Start a Build Consultation <i className="far fa-arrow-right" style={{ fontSize: 13 }} />
          </Link>
        </div>
        <div className="col-md-6">
          <a href="mailto:info@xerxez.com?subject=ERP Upgrade Enquiry" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.07)", color: "#fff", padding: "14px 24px", borderRadius: 10, fontWeight: 600, fontSize: 15, border: `1px solid ${OGBRD}`, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
            Enquire About ERP Upgrade <i className="far fa-arrow-right" style={{ fontSize: 13 }} />
          </a>
        </div>
      </div></FI>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 4. BUSINESS IMPACT / ROI  — cream
// ═══════════════════════════════════════════════════════════════════════════════
const ROIBars = () => {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  const bars = [
    { pct: 40, label: "Reduction in operational overhead" },
    { pct: 60, label: "Faster executive reporting cycles" },
    { pct: 35, label: "Decrease in procurement errors"   },
    { pct: 50, label: "Reduction in manual data entry"   },
  ];

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {bars.map((b) => (
        <div key={b.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: BODY, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{b.label}</span>
            <span style={{ color: OG, fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>{b.pct}%</span>
          </div>
          <div style={{ height: 9, background: "rgba(201,136,58,0.12)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{
              width: active ? `${b.pct}%` : "0%", height: "100%",
              background: OG_G, borderRadius: 8,
              boxShadow: "0 2px 8px rgba(201,136,58,0.40)",
              transition: pref ? "none" : "width 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const ROISection = () => (
  <section style={{ padding: "100px 0", background: WHITE }}>
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-5">
          <FI>
            <SL t="Business Impact" />
            <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: DARK, lineHeight: 1.15, marginBottom: 20, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
              Measurable ROI from <span style={{ color: OG }}>Day One</span>
            </h2>
            <p style={{ color: BODY, fontSize: 16, lineHeight: 1.78, marginBottom: 36, fontFamily: "'DM Sans',sans-serif" }}>
              XERXEZ ERP deployments are benchmarked against client KPIs from day one.
              Our AI layer generates measurable value within the first 30 days of go-live.
            </p>
            <ROIBars />
          </FI>
        </div>
        <div className="col-lg-7">
          <div className="row g-3">
            {[
              { icon: "fas fa-brain",     title: "Predictive Intelligence", desc: "AI models predict demand, cash flow, and staffing 12 weeks ahead — giving leadership data to act before problems materialise." },
              { icon: "fas fa-robot",     title: "Process Automation",      desc: "Repetitive tasks — PO approvals, invoice matching, payroll, stock replenishment — execute automatically with full audit trails." },
              { icon: "fas fa-chart-pie", title: "Unified Data Layer",      desc: "All departments share a single source of truth. Finance, HR, sales, and ops flow through one intelligent data layer." },
              { icon: "fas fa-bell",      title: "Proactive Alerts",        desc: "The system flags anomalies — expense spikes, stock shortfalls, SLA breaches — before they escalate, with recommended actions." },
            ].map((item, i) => (
              <div key={item.title} className="col-sm-6">
                <FI delay={0.1 + i * 0.08}>
                  <Card3D p="26px 24px">
                    <IB icon={item.icon} size={46} />
                    <h4 style={{ fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{item.title}</h4>
                    <p style={{ color: BODY, fontSize: 13.5, lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{item.desc}</p>
                  </Card3D>
                </FI>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 5. PLATFORM MODULES  — dark
// ═══════════════════════════════════════════════════════════════════════════════
const MODULE_LIST = [
  { icon: "fas fa-chart-bar",           title: "Finance & Accounting",     desc: "GL, AP/AR, budgeting, financial reporting, multi-currency", coral: false },
  { icon: "fas fa-users",               title: "Human Resources",          desc: "Payroll, leave management, recruitment, performance reviews", coral: false },
  { icon: "fas fa-boxes",               title: "Inventory & Supply Chain", desc: "Stock management, warehouse ops, supplier portal, demand planning", coral: false },
  { icon: "fas fa-handshake",           title: "CRM & Sales",              desc: "Pipeline management, lead scoring, quote generation, customer 360", coral: true  },
  { icon: "fas fa-file-invoice-dollar", title: "Invoicing & Billing",      desc: "Automated invoicing, payment tracking, subscription billing", coral: false },
  { icon: "fas fa-shopping-cart",       title: "Procurement & Purchases",  desc: "PO management, vendor evaluation, 3-way matching", coral: false },
  { icon: "fas fa-truck",               title: "Logistics & Dispatch",     desc: "Fleet tracking, route optimisation, delivery confirmation", coral: true  },
  { icon: "fas fa-brain",               title: "AI Analytics Engine",      desc: "Demand forecasting, anomaly detection, executive dashboards", coral: false },
  { icon: "fas fa-shield-alt",          title: "Compliance & Audit",       desc: "Automated audit trails, regulatory reports, access control logs", coral: true  },
];

const Modules = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 56 }}>
        <SL t="Platform Modules" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          Every Function. <span style={{ color: OG }}>One Intelligent Platform.</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 17, marginTop: 16, maxWidth: 560, marginInline: "auto", fontFamily: "'DM Sans',sans-serif" }}>
          All modules are interconnected, AI-informed, and deployable independently or as a complete suite.
        </p>
      </div></FI>
      <div className="row g-4">
        {MODULE_LIST.map((m, i) => (
          <div key={m.title} className="col-lg-4 col-md-6">
            <FI delay={0.05 + (i % 3) * 0.08}>
              <DC accent={m.coral ? C2 : OG} p="30px 26px">
                <div style={{ width: 48, height: 48, borderRadius: 13, background: m.coral ? C2_G : OG_G, boxShadow: m.coral ? BS2 : BS, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <i className={m.icon} style={{ color: "#fff", fontSize: 20 }} />
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>{m.title}</h4>
                <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 14, lineHeight: 1.68, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{m.desc}</p>
              </DC>
            </FI>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 6. INDUSTRIES  — cream
// ═══════════════════════════════════════════════════════════════════════════════
const SECTORS = [
  { icon: "fas fa-landmark",      label: "Government & Defence"     },
  { icon: "fas fa-heartbeat",     label: "Healthcare & Pharma"      },
  { icon: "fas fa-university",    label: "Financial Services"        },
  { icon: "fas fa-industry",      label: "Manufacturing"            },
  { icon: "fas fa-shipping-fast", label: "Logistics & Supply Chain" },
  { icon: "fas fa-store",         label: "Retail & E-Commerce"      },
];

const COMPLIANCE = [
  { icon: "fas fa-certificate",     label: "ISO 27001"             },
  { icon: "fas fa-clipboard-check", label: "SOC 2 Type II"         },
  { icon: "fas fa-gavel",           label: "GDPR Compliant"        },
  { icon: "fas fa-lock",            label: "AES-256 Encrypted"     },
  { icon: "fas fa-network-wired",   label: "Zero-Trust Architecture"},
  { icon: "fas fa-user-shield",     label: "RBAC & MFA"            },
  { icon: "fas fa-history",         label: "Full Audit Trail"      },
  { icon: "fas fa-server",          label: "Air-Gap Deployable"    },
];

const ClientLogos = () => (
  <section style={{ padding: "100px 0", background: CREAM }}>
    <div className="container">
      <FI><div className="text-center" style={{ marginBottom: 52 }}>
        <SL t="Trusted Across Industries" />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(24px,3vw,40px)", color: DARK, lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          Built for Every Enterprise Sector
        </h2>
      </div></FI>

      <div className="row g-3 justify-content-center" style={{ marginBottom: 48 }}>
        {SECTORS.map((s, i) => (
          <div key={s.label} className="col-lg-2 col-md-4 col-6">
            <FI delay={0.06 * i}>
              <Card3D p="28px 16px" style={{ textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: OG_G, boxShadow: BS, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <i className={s.icon} style={{ color: "#fff", fontSize: 22 }} />
                </div>
                <p style={{ color: BODY, fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.4, fontFamily: "'DM Sans',sans-serif" }}>{s.label}</p>
              </Card3D>
            </FI>
          </div>
        ))}
      </div>

      <FI delay={0.2}>
        <div style={{ padding: "24px 36px", background: WHITE, border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${OG}`, borderRadius: 16, display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "center", boxShadow: BCARD }}>
          {COMPLIANCE.map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: OGL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={item.icon} style={{ color: OG, fontSize: 12 }} />
              </div>
              <span style={{ color: BODY, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </FI>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 7. IMPLEMENTATION PROCESS  — dark
// ═══════════════════════════════════════════════════════════════════════════════
const STEPS = [
  { no: "01", title: "Discovery & Assessment",    dur: "Week 1 – 2",   desc: "We map your existing processes, data flows, integration points, and compliance requirements. Output: detailed architecture blueprint and project plan." },
  { no: "02", title: "Design & Architecture",     dur: "Week 3 – 5",   desc: "Our architects design your ERP data model, AI pipeline, API integrations, and security controls. Sign-off before a single line of code is written." },
  { no: "03", title: "Agile Build & Integration", dur: "Week 6 – 18",  desc: "Modular agile delivery in 2-week sprints with working software at every milestone. Continuous integration testing and stakeholder demos throughout." },
  { no: "04", title: "UAT & Security Review",     dur: "Week 19 – 22", desc: "User acceptance testing with your teams, penetration testing by independent security engineers, and compliance validation against regulatory requirements." },
  { no: "05", title: "Go-Live & Hypercare",       dur: "Week 23 – 26", desc: "Phased production rollout with a dedicated hypercare team available 24/7 for the first 30 days. Zero-downtime cutover for upgrade projects." },
  { no: "06", title: "Continuous Optimisation",   dur: "Ongoing",      desc: "Monthly AI model retraining, performance tuning, feature releases, and SLA-backed managed support. Your ERP improves automatically over time." },
];

const Process = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <FI><div className="text-center" style={{ marginBottom: 56 }}>
        <SL t="Implementation" dark />
        <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: "#fff", lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          From Contract to Go-Live in <span style={{ color: OG }}>Under 6 Months</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 17, marginTop: 16, maxWidth: 560, marginInline: "auto", fontFamily: "'DM Sans',sans-serif" }}>
          A structured, milestone-driven delivery process with full transparency at every stage.
        </p>
      </div></FI>
      <div className="row g-4">
        {STEPS.map((s, i) => (
          <div key={s.no} className="col-lg-4 col-md-6">
            <FI delay={0.06 + (i % 3) * 0.09}>
              <DC p="30px 28px">
                {/* ghost watermark */}
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

// ═══════════════════════════════════════════════════════════════════════════════
// 8. FAQ  — cream
// ═══════════════════════════════════════════════════════════════════════════════
const FAQS = [
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
    <section style={{ padding: "100px 0", background: CREAM }}>
      <div className="container">
        <FI><div className="text-center" style={{ marginBottom: 52 }}>
          <SL t="FAQ" />
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3vw,42px)", color: DARK, lineHeight: 1.15, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
            Questions from Enterprise Buyers
          </h2>
        </div></FI>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {FAQS.map((faq, i) => (
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

// ═══════════════════════════════════════════════════════════════════════════════
// 9. CTA  — dark
// ═══════════════════════════════════════════════════════════════════════════════
const CTASection = () => (
  <section style={{ padding: "100px 0", background: DBG, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div aria-hidden="true" style={{ position: "absolute", bottom: -100, right: "12%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,120,92,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div className="row align-items-center g-5">
        <div className="col-lg-7">
          <FI>
            <SL t="Get Started" dark />
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", lineHeight: 1.12, marginBottom: 22, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.025em" }}>
              Ready to Transform Your<br />Enterprise Operations?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1.72, fontFamily: "'DM Sans',sans-serif", maxWidth: 500 }}>
              Whether you're building from scratch or upgrading an existing ERP, XERXEZ delivers a solution that meets your exact requirements — on time, on budget, and to the security standards your organisation demands.
            </p>
            <div style={{ display: "flex", gap: 20, marginTop: 36, flexWrap: "wrap" }}>
              {["ISO 27001 Ready","SOC 2 Type II","Strict NDA"].map((t) => (
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
                Get a tailored briefing pack with architecture recommendations, timeline, and cost estimate for your sector.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link to="/contact" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 24px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.28)" }}>
                  Request A Demo <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
                </Link>
                <a href="mailto:info@xerxez.com?subject=Enterprise ERP Sales Enquiry" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: CREAM, color: DARK, padding: "13px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "1px solid rgba(0,0,0,0.10)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ═══════════════════════════════════════════════════════════════════════════════
const AIERPPage = () => {
  useSEO();
  return (
    <>
      <style>{`
        @keyframes erpCardIn {
          from { opacity:0; transform:translateX(40px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes erpLivePulse {
          0%,100% { box-shadow:0 0 7px #4ade80,0 0 14px rgba(74,222,128,.45); }
          50%     { box-shadow:0 0 3px #4ade80,0 0 5px rgba(74,222,128,.15); }
        }
      `}</style>
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
    </>
  );
};

export default AIERPPage;
