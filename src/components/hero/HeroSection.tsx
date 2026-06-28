import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const CYCLE_WORDS = [
  "AI-Powered ERP",
  "DevSecOps Pipelines",
  "Cloud Infrastructure",
  "AI Training & Consulting",
  "Quantum Computing",
  "Intelligent Automation",
  "Data Analytics",
  "Cybersecurity",
  "Digital Transformation",
];

const FULL_TEXT = "Enterprise AI";
const BAR_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const BAR_BASE = [62, 78, 55, 85, 70, 92];
const LINE_Y = [20, 35, 28, 52, 45, 68, 60, 78, 72, 88];

// ─── Live AI Dashboard ────────────────────────────────────────────────────────
const AIDashboard = ({ prefersReduced }: { prefersReduced: boolean }) => {
  const [time, setTime] = useState(new Date());
  const [bars, setBars] = useState(BAR_BASE);
  const [mounted, setMounted] = useState(false);
  const [counts, setCounts] = useState({ uptime: 0, models: 0, clients: 0 });
  const [flashIdx, setFlashIdx] = useState(-1);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (prefersReduced) { setCounts({ uptime: 999, models: 247, clients: 120 }); return; }
    const start = Date.now();
    const dur = 2000;
    const id = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(2, -10 * p);
      setCounts({ uptime: Math.round(999 * e), models: Math.round(247 * e), clients: Math.round(120 * e) });
      if (p === 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setBars(b => b.map(v => Math.max(38, Math.min(96, v + (Math.random() - 0.5) * 18))));
      setFlashIdx(Math.floor(Math.random() * 3));
      setTimeout(() => setFlashIdx(-1), 700);
    }, 3000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const W = 260, H = 64;
  const pts = LINE_Y.map((v, i) => ({ x: (i / (LINE_Y.length - 1)) * W, y: H - (v / 100) * H }));
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `${lineD} L${W},${H} L0,${H}Z`;
  const last = pts[pts.length - 1];
  const timeStr = time.toLocaleTimeString("en-US", { hour12: false });

  const stats = [
    { label: "UPTIME",    val: `${(counts.uptime / 10).toFixed(1)}%` },
    { label: "AI MODELS", val: `${counts.models}` },
    { label: "CLIENTS",   val: `${counts.clients}+` },
  ];

  return (
    <div style={{
      position: "relative", width: "100%", maxWidth: 500,
      background: "linear-gradient(145deg,rgba(14,13,18,0.97) 0%,rgba(20,18,28,0.96) 100%)",
      backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
      border: "1px solid rgba(204,120,92,0.22)",
      borderRadius: 20, padding: "22px 22px 18px",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset,0 32px 80px rgba(0,0,0,0.32),0 4px 24px rgba(204,120,92,0.1)",
      animation: prefersReduced ? "none" : "xzCardIn 0.8s cubic-bezier(0.22,1,0.36,1) both",
      animationDelay: "0.3s",
    }}>
      {/* Border glow overlay */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
        background: "linear-gradient(135deg,rgba(204,120,92,0.18) 0%,transparent 45%,rgba(201,136,58,0.08) 100%)",
        animation: prefersReduced ? "none" : "xzBorderGlow 5s ease-in-out infinite",
      }} />

      {/* TOP ROW */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: "#4ade80",
            boxShadow: "0 0 8px #4ade80,0 0 16px rgba(74,222,128,0.45)",
            animation: prefersReduced ? "none" : "xzLivePulse 1.8s ease-in-out infinite",
          }} />
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "#4ade80" }}>
            LIVE SYSTEM
          </span>
        </div>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>
          {timeStr}
        </span>
      </div>

      {/* BAR CHART */}
      <div style={{ marginBottom: 14, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 8, fontFamily: "'Inter',sans-serif", color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7 }}>
          PERFORMANCE INDEX
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 68 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: "100%", height: `${h}%`,
                borderRadius: "3px 3px 0 0",
                background: "linear-gradient(180deg,#cc785c 0%,#C9883A 55%,#7A4A1E 100%)",
                transform: mounted ? "scaleY(1)" : "scaleY(0)",
                transformOrigin: "bottom",
                transition: prefersReduced ? "none" : `transform ${0.55 + i * 0.07}s cubic-bezier(0.34,1.56,0.64,1) ${0.1 + i * 0.07}s, height 0.7s cubic-bezier(0.34,1.56,0.64,1)`,
                boxShadow: "0 0 10px rgba(204,120,92,0.3)",
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
          {BAR_LABELS.map((l, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 7, fontFamily: "'Inter',sans-serif", color: "rgba(255,255,255,0.25)" }}>{l}</div>
          ))}
        </div>
      </div>

      {/* LINE GRAPH */}
      <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 8, fontFamily: "'Inter',sans-serif", color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>
          AI PROCESSING LOAD
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="xzAG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cc785c" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#cc785c" stopOpacity="0" />
            </linearGradient>
            <filter id="xzGF" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d={areaD} fill="url(#xzAG)"
            style={{ opacity: mounted ? 1 : 0, transition: prefersReduced ? "none" : "opacity 1.2s ease 0.9s" }} />
          <path d={lineD} fill="none" stroke="#cc785c" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            style={{
              strokeDasharray: 700,
              strokeDashoffset: mounted && !prefersReduced ? 0 : 700,
              transition: prefersReduced ? "none" : "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1) 0.5s",
            }} />
          <circle cx={last.x} cy={last.y} r={4} fill="#cc785c" filter="url(#xzGF)"
            style={{
              opacity: mounted ? 1 : 0,
              transition: prefersReduced ? "none" : "opacity 0.4s ease 2s",
              animation: mounted && !prefersReduced ? "xzEndPulse 2.2s ease-in-out 2.1s infinite" : "none",
            }} />
        </svg>
      </div>

      {/* STATS ROW */}
      <div style={{
        display: "flex", gap: 7, position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14,
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            flex: 1, textAlign: "center",
            background: flashIdx === i ? "rgba(204,120,92,0.13)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${flashIdx === i ? "rgba(204,120,92,0.32)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 10, padding: "9px 4px",
            transition: "all 0.3s ease",
          }}>
            <div style={{
              fontFamily: "'Inter',sans-serif", fontSize: 17, fontWeight: 700,
              color: flashIdx === i ? "#cc785c" : "rgba(255,255,255,0.85)",
              lineHeight: 1, transition: "color 0.3s ease",
            }}>{s.val}</div>
            <div style={{
              fontFamily: "'Inter',sans-serif", fontSize: 7,
              color: "rgba(255,255,255,0.32)", letterSpacing: "0.1em",
              textTransform: "uppercase", marginTop: 4,
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const HeroSection = () => {
  const [prefersReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion:reduce)").matches : false
  );
  const [wordIdx, setWordIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % CYCLE_WORDS.length); setFadeIn(true); }, 350);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const onBtnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    Object.assign(ripple.style, {
      position: "absolute", left: `${e.clientX - rect.left}px`, top: `${e.clientY - rect.top}px`,
      width: "6px", height: "6px", background: "rgba(255,255,255,0.6)", borderRadius: "50%",
      transform: "translate(-50%,-50%) scale(0)", animation: "xzRipple 0.6s ease-out forwards",
      pointerEvents: "none",
    });
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 640);
  };

  return (
    <section style={{
      background: "#EDE8DF",
      padding: "24px 0 64px",
      minHeight: "calc(100vh - 70px)",
      display: "flex", alignItems: "flex-start",
      position: "relative", overflow: "hidden",
    }}>
      {/* Dot-grid texture */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle,#dddad4 1px,transparent 1px)",
        backgroundSize: "38px 38px", opacity: 0.38, zIndex: 0,
      }} />

      {/* Diagonal light rays */}
      {[0, 1, 2].map(i => (
        <div key={i} aria-hidden="true" style={{
          position: "absolute",
          width: "260%", height: "1px",
          background: "linear-gradient(90deg,transparent 0%,rgba(201,136,58,0.06) 30%,rgba(201,136,58,0.09) 50%,rgba(201,136,58,0.06) 70%,transparent 100%)",
          top: `${20 + i * 28}%`, left: "-80%",
          transform: "rotate(-13deg)",
          animation: prefersReduced ? "none" : `xzRayDrift ${12 + i * 5}s ease-in-out ${i * 2.8}s infinite alternate`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row g-5 align-items-start">

          {/* ── LEFT ── */}
          <div className="col-lg-6">

            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#efe9de", border: "1px solid #e6dfd8",
              borderRadius: 9999, padding: "5px 14px 5px 10px", marginBottom: 36,
              animation: prefersReduced ? "none" : "xzFadeUp 0.5s ease both",
              animationDelay: "0.05s",
            }}>
              <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc785c", flexShrink: 0, animation: prefersReduced ? "none" : "xzDot1 2s ease-in-out infinite" }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc785c", opacity: 0.45, flexShrink: 0, animation: prefersReduced ? "none" : "xzDot2 2s ease-in-out 0.35s infinite" }} />
              </span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "1.1px", textTransform: "uppercase", color: "#6c6a64" }}>
                Enterprise AI Platform · V2.0
              </span>
            </div>

            {/* Heading */}
            <h1 style={{ marginBottom: 0, lineHeight: 1.0 }}>

              {/* "The Future of" — slide from left + blur to sharp */}
              <span style={{
                display: "block",
                fontFamily: "'Cormorant Garamond',Garamond,serif",
                fontWeight: 400, fontSize: "clamp(42px,5vw,66px)",
                color: "#141413", letterSpacing: "-0.02em",
                lineHeight: 1.08, marginBottom: 4,
                animation: prefersReduced ? "none" : "xzSlideBlur 0.6s cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "0.1s",
              }}>
                The Future of
              </span>

              {/* "Enterprise AI" — per-letter stagger + color sweep */}
              <span style={{
                display: "block",
                fontFamily: "'Cormorant Garamond',Garamond,serif",
                fontWeight: 700, fontStyle: "italic",
                fontSize: "clamp(58px,9vw,118px)",
                color: "#cc785c",
                letterSpacing: "-0.035em",
                lineHeight: 0.9, marginBottom: 10,
                minHeight: "1em",
              }}>
                {FULL_TEXT.split("").map((char, i) => (
                  <span key={i} style={{
                    display: "inline-block",
                    animation: prefersReduced ? "none" : "xzLetterIn 0.55s cubic-bezier(0.22,1,0.36,1) both",
                    animationDelay: `${0.35 + i * 0.045}s`,
                  }}>
                    {char === " " ? " " : char}
                  </span>
                ))}
              </span>

              {/* "is here —" — fade up */}
              <span style={{
                display: "block",
                fontFamily: "'Cormorant Garamond',Garamond,serif",
                fontWeight: 400, fontSize: "clamp(28px,3.8vw,50px)",
                color: "#3d3d3a", letterSpacing: "-0.015em", lineHeight: 1.12,
                animation: prefersReduced ? "none" : "xzFadeUp 0.65s ease both",
                animationDelay: "0.8s",
              }}>
                is here —{" "}
                <em style={{ color: "#C9883A", fontStyle: "italic" }}>for every enterprise.</em>
              </span>
            </h1>

            {/* Cycling services */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
              marginTop: 28, marginBottom: 24,
              animation: prefersReduced ? "none" : "xzFadeIn 0.5s ease both",
              animationDelay: "1.0s",
            }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: "#6c6a64", whiteSpace: "nowrap" }}>
                Delivering:
              </span>
              <span style={{
                fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: "#cc785c",
                opacity: fadeIn ? 1 : 0, transition: "opacity 0.3s ease",
                minWidth: "min(230px,55vw)", display: "inline-block",
              }}>
                {CYCLE_WORDS[wordIdx]}
              </span>
              <span aria-hidden="true" style={{
                width: 2, height: 17, background: "#cc785c",
                display: "inline-block", borderRadius: 1, flexShrink: 0,
                animation: "xzCursor 1s step-end infinite",
              }} />
            </div>

            {/* Description */}
            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.65,
              color: "#3d3d3a", maxWidth: 500, marginBottom: 40,
              animation: prefersReduced ? "none" : "xzFadeUp 0.5s ease both",
              animationDelay: "1.1s",
            }}>
              XERXEZ delivers intelligent ERP, DevSecOps pipelines, and cloud
              infrastructure that transform how enterprises operate at scale.
            </p>

            {/* CTAs */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
              animation: prefersReduced ? "none" : "xzFadeUp 0.5s ease both",
              animationDelay: "1.25s",
            }}>
              {/* Get Started — shimmer */}
              <Link
                to="/contact"
                ref={btnRef}
                onClick={onBtnClick}
                className="xz-btn-shimmer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#cc785c", color: "#ffffff",
                  fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, lineHeight: 1,
                  padding: "13px 24px", borderRadius: 8,
                  textDecoration: "none", position: "relative", overflow: "hidden",
                  transition: "background 150ms ease, transform 0.15s ease",
                  boxShadow: "0 4px 0 rgba(140,60,30,0.38),0 6px 20px rgba(204,120,92,0.22)",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#a9583e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#cc785c"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  Get Started
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>

              {/* Explore Services — draw underline on hover */}
              <Link
                to="/service"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: "#141413",
                  fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, lineHeight: 1,
                  padding: "13px 24px", borderRadius: 8,
                  border: "1px solid #dddad4", textDecoration: "none",
                  position: "relative",
                  transition: "border-color 150ms ease, background 150ms ease, transform 0.15s ease",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = "#cc785c";
                  e.currentTarget.style.background = "rgba(204,120,92,0.05)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  const line = e.currentTarget.querySelector(".xz-uline") as HTMLElement | null;
                  if (line) line.style.transform = "scaleX(1)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = "#dddad4";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                  const line = e.currentTarget.querySelector(".xz-uline") as HTMLElement | null;
                  if (line) line.style.transform = "scaleX(0)";
                }}
              >
                Explore Services
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="xz-uline" style={{
                  position: "absolute", bottom: 7, left: 24, right: 40, height: 1,
                  background: "#cc785c", borderRadius: 1,
                  transform: "scaleX(0)", transformOrigin: "left",
                  transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
                }} />
              </Link>
            </div>

            {/* Scroll indicator */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginTop: 52,
              opacity: scrolled ? 0 : 0.45, transition: "opacity 0.4s ease",
              pointerEvents: "none",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                style={{ animation: prefersReduced ? "none" : "xzBounce 1.6s ease-in-out infinite" }}>
                <path d="M10 3v14M3.5 10.5l6.5 6.5 6.5-6.5" stroke="#141413" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#141413" }}>
                SCROLL
              </span>
            </div>
          </div>

          {/* ── RIGHT: Live AI Dashboard ── */}
          <div className="col-lg-6 d-none d-lg-flex align-items-start justify-content-center" style={{ paddingTop: 30 }}>
            <AIDashboard prefersReduced={prefersReduced} />
          </div>

        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes xzDot1 { 0%,100%{opacity:.9;transform:scale(1)} 50%{opacity:.25;transform:scale(.7)} }
        @keyframes xzDot2 { 0%,100%{opacity:.45} 50%{opacity:.1} }
        @keyframes xzCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes xzBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        @keyframes xzRipple { 0%{transform:translate(-50%,-50%) scale(0);opacity:1} 100%{transform:translate(-50%,-50%) scale(45);opacity:0} }
        @keyframes xzFadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes xzFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes xzSlideBlur {
          from{opacity:0;transform:translateX(-28px);filter:blur(10px)}
          to{opacity:1;transform:translateX(0);filter:blur(0)}
        }
        @keyframes xzLetterIn {
          from{opacity:0;transform:translateY(22px);filter:blur(5px)}
          to{opacity:1;transform:translateY(0);filter:blur(0)}
        }
        @keyframes xzCardIn {
          from{opacity:0;transform:translateY(30px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes xzBorderGlow { 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes xzLivePulse {
          0%,100%{box-shadow:0 0 8px #4ade80,0 0 16px rgba(74,222,128,.45)}
          50%{box-shadow:0 0 3px #4ade80,0 0 6px rgba(74,222,128,.15)}
        }
        @keyframes xzEndPulse {
          0%,100%{transform:scale(1);opacity:1}
          50%{transform:scale(1.65);opacity:.5}
        }
        @keyframes xzRayDrift {
          from{transform:rotate(-13deg) translateY(0px)}
          to{transform:rotate(-13deg) translateY(32px)}
        }
        @keyframes xzShimmer {
          0%{transform:translateX(-100%) skewX(-15deg)}
          30%,100%{transform:translateX(220%) skewX(-15deg)}
        }
        .xz-btn-shimmer::before {
          content:'';
          position:absolute;top:0;left:0;right:0;bottom:0;
          background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.22) 50%,transparent 62%);
          transform:translateX(-100%) skewX(-15deg);
          animation:xzShimmer 3.5s ease-in-out 1.5s infinite;
        }
        @media (prefers-reduced-motion:reduce) {
          *{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
