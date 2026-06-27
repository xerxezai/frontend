import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ─── Module-level constants ───────────────────────────────────────────────────
const CYCLE_WORDS = [
  "AI-Powered ERP",
  "DevSecOps Pipelines",
  "Cloud Infrastructure",
  "AI Training & Consulting",
  "Quantum Computing",
];

const FULL_TEXT = "Enterprise AI";
const GLITCH_CHARS = "!#$%@&*ABCDEFXxYyZz01";

// Deterministic upward-rising particles
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${6 + (i * 5.4) % 88}%`,
  size: 3 + (i % 5),
  dur: `${7 + (i % 6)}s`,
  delay: `${(i * 0.65) % 7}s`,
  color:
    i % 3 === 0
      ? "rgba(201,136,58,0.45)"
      : i % 3 === 1
      ? "rgba(201,136,58,0.32)"
      : "rgba(220,215,210,0.4)",
}));

// ─── Hub + nodes (unchanged) ─────────────────────────────────────────────────
const HUB = { x: 250, y: 205, r: 42 };
const NODES = [
  { id: "fin",   x: 88,  y: 82,  r: 26, label: "Finance",   color: "#2D5A3D", dot: "#4ade80" },
  { id: "cloud", x: 388, y: 68,  r: 26, label: "Cloud",     color: "#1B3A5C", dot: "#60a5fa" },
  { id: "hr",    x: 438, y: 195, r: 23, label: "HR",        color: "#C9883A", dot: "#fbbf24" },
  { id: "crm",   x: 398, y: 330, r: 23, label: "CRM",       color: "#cc785c", dot: "#f97316" },
  { id: "ai",    x: 250, y: 392, r: 27, label: "AI/ML",     color: "#4A3D7C", dot: "#a78bfa" },
  { id: "dev",   x: 102, y: 330, r: 23, label: "DevSecOps", color: "#7C2D44", dot: "#fb7185" },
  { id: "inv",   x: 58,  y: 195, r: 21, label: "Inventory", color: "#2D7B6B", dot: "#2dd4bf" },
];

// ─── ERP Network SVG (unchanged) ─────────────────────────────────────────────
const ERPNetwork = () => (
  <svg
    viewBox="0 20 500 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="xz-network-svg"
    style={{ width: "100%", maxWidth: 480, overflow: "visible" }}
    aria-label="XERXEZ ERP module network diagram"
  >
    {NODES.map(n => (
      <line key={`line-${n.id}`} x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y}
        stroke="#dddad4" strokeWidth="1.5" strokeDasharray="5 5" />
    ))}
    {NODES.map((n, i) => (
      <circle key={`dot-${n.id}`} cx={0} cy={0} r={3} fill={n.dot}
        style={{ filter: `drop-shadow(0 0 4px ${n.dot})` }}>
        <animateMotion dur={`${2.8 + i * 0.35}s`} repeatCount="indefinite"
          path={`M ${HUB.x},${HUB.y} L ${n.x},${n.y}`} />
      </circle>
    ))}
    {NODES.map(n => (
      <g key={n.id}>
        <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke={n.dot} strokeWidth="1">
          <animate attributeName="r"
            values={`${n.r + 3};${n.r + 16};${n.r + 3}`} dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity"
            values="0.55;0;0.55" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity="0.1" />
        <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={n.color} strokeWidth="1.5" opacity="0.65" />
        <circle cx={n.x} cy={n.y - n.r + 7} r="3" fill={n.dot}
          style={{ filter: `drop-shadow(0 0 3px ${n.dot})` }} />
        <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#3d3d3a"
          fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">
          {n.label}
        </text>
      </g>
    ))}
    <circle cx={HUB.x} cy={HUB.y} r={HUB.r + 10} fill="none" stroke="#cc785c" strokeWidth="1">
      <animate attributeName="r"
        values={`${HUB.r + 6};${HUB.r + 22};${HUB.r + 6}`} dur="2.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.45;0;0.45" dur="2.4s" repeatCount="indefinite" />
    </circle>
    <circle cx={HUB.x} cy={HUB.y} r={HUB.r + 5} fill="none" stroke="#cc785c" strokeWidth="1" opacity="0.2" />
    <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="#efe9de" stroke="#cc785c" strokeWidth="2" />
    <text x={HUB.x} y={HUB.y - 5} textAnchor="middle" fill="#141413"
      fontSize="13" fontFamily="Cormorant Garamond, Garamond, serif" fontWeight="600">
      XERXEZ
    </text>
    <text x={HUB.x} y={HUB.y + 12} textAnchor="middle" fill="#6c6a64"
      fontSize="9" fontFamily="Inter, sans-serif" fontWeight="400">
      ERP Hub
    </text>
  </svg>
);

// ─── Neural network canvas ────────────────────────────────────────────────────
const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 40;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1.5 + Math.random() * 2,
    }));

    const MAX_DIST = 128;
    let raf: number;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(201,136,58,${(1 - d / MAX_DIST) * 0.11})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201,136,58,0.16)";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    // Pause RAF when tab is not visible, resume when visible again
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const HeroSection = () => {
  const [prefersReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // Cycling words
  const [wordIdx, setWordIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // Typewriter state
  const [displayed, setDisplayed] = useState(() => (prefersReduced ? FULL_TEXT : ""));
  const [glitching, setGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState(FULL_TEXT);

  // Scroll indicator fade
  const [scrolled, setScrolled] = useState(false);

  // Refs
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const cursorRaf = useRef<number>(0);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const holoRef = useRef<HTMLDivElement>(null);
  const holoGlowRef = useRef<HTMLDivElement>(null);

  // ── Cycling words ──
  useEffect(() => {
    const id = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % CYCLE_WORDS.length); setFadeIn(true); }, 380);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // ── Scroll fade ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Typewriter ──
  useEffect(() => {
    if (prefersReduced) return;
    let typeInterval: ReturnType<typeof setInterval>;
    const startTimeout = setTimeout(() => {
      let i = 0;
      typeInterval = setInterval(() => {
        i++;
        setDisplayed(FULL_TEXT.slice(0, i));
        if (i >= FULL_TEXT.length) clearInterval(typeInterval);
      }, 78);
    }, 420);
    return () => { clearTimeout(startTimeout); clearInterval(typeInterval); };
  }, [prefersReduced]);

  // ── Glitch ──
  useEffect(() => {
    if (prefersReduced) return;
    let glitchInterval: ReturnType<typeof setInterval>;
    const startDelay = setTimeout(() => {
      glitchInterval = setInterval(() => {
        setGlitching(true);
        let count = 0;
        const scramble = setInterval(() => {
          setGlitchText(
            FULL_TEXT.split("").map(c =>
              c === " " ? " " : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            ).join("")
          );
          count++;
          if (count >= 5) {
            clearInterval(scramble);
            setGlitchText(FULL_TEXT);
            setGlitching(false);
          }
        }, 55);
      }, 4200);
    }, FULL_TEXT.length * 78 + 2000);
    return () => { clearTimeout(startDelay); clearInterval(glitchInterval); };
  }, [prefersReduced]);

  // ── Custom cursor ──
  useEffect(() => {
    if (prefersReduced) return;
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animateRing = () => {
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.1);
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
      }
      cursorRaf.current = requestAnimationFrame(animateRing);
    };
    cursorRaf.current = requestAnimationFrame(animateRing);

    const expand = () => {
      if (!ringRef.current) return;
      ringRef.current.style.width = "50px";
      ringRef.current.style.height = "50px";
      ringRef.current.style.marginLeft = "-9px";
      ringRef.current.style.marginTop = "-9px";
      ringRef.current.style.borderColor = "rgba(201,136,58,0.7)";
    };
    const contract = () => {
      if (!ringRef.current) return;
      ringRef.current.style.width = "32px";
      ringRef.current.style.height = "32px";
      ringRef.current.style.marginLeft = "0px";
      ringRef.current.style.marginTop = "0px";
      ringRef.current.style.borderColor = "rgba(201,136,58,0.45)";
    };

    const els = document.querySelectorAll("a, button");
    els.forEach(el => { el.addEventListener("mouseenter", expand); el.addEventListener("mouseleave", contract); });

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(cursorRaf.current);
      els.forEach(el => { el.removeEventListener("mouseenter", expand); el.removeEventListener("mouseleave", contract); });
    };
  }, [prefersReduced]);

  // ── Magnetic button ──
  const onBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReduced) return;
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.28;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onBtnLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  };

  // ── Ripple on click ──
  const onBtnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    Object.assign(ripple.style, {
      position: "absolute",
      left: `${e.clientX - rect.left}px`,
      top: `${e.clientY - rect.top}px`,
      width: "6px", height: "6px",
      background: "rgba(255,255,255,0.55)",
      borderRadius: "50%",
      transform: "translate(-50%,-50%) scale(0)",
      animation: "xzRipple 0.58s ease-out forwards",
      pointerEvents: "none",
    });
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 620);
  };

  // ── Holographic card ──
  const onHoloMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = holoRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(820px) rotateX(${(0.5 - y) * 16}deg) rotateY(${(x - 0.5) * 16}deg)`;
    if (holoGlowRef.current) {
      const hue = Math.round(x * 340);
      holoGlowRef.current.style.background =
        `radial-gradient(circle at ${x * 100}% ${y * 100}%, hsla(${hue},85%,68%,0.18) 0%, transparent 60%)`;
      holoGlowRef.current.style.opacity = "1";
    }
  };
  const onHoloLeave = () => {
    if (holoRef.current)
      holoRef.current.style.transform = "perspective(820px) rotateX(0deg) rotateY(0deg)";
    if (holoGlowRef.current) holoGlowRef.current.style.opacity = "0";
  };

  const isTyping = !prefersReduced && displayed.length < FULL_TEXT.length;
  const headingText = glitching ? glitchText : (prefersReduced ? FULL_TEXT : displayed);

  return (
    <>
      {/* Custom cursor */}
      {!prefersReduced && (
        <>
          <div ref={dotRef} aria-hidden="true" style={{
            position: "fixed", top: 0, left: 0,
            width: 8, height: 8, borderRadius: "50%",
            background: "#C9883A",
            boxShadow: "0 0 10px rgba(201,136,58,0.85)",
            pointerEvents: "none", zIndex: 99999,
            willChange: "transform",
          }} />
          <div ref={ringRef} aria-hidden="true" style={{
            position: "fixed", top: 0, left: 0,
            width: 32, height: 32, borderRadius: "50%",
            border: "1.5px solid rgba(201,136,58,0.45)",
            pointerEvents: "none", zIndex: 99998,
            transition: "width 0.22s ease, height 0.22s ease, margin 0.22s ease, border-color 0.22s ease",
            willChange: "transform",
          }} />
        </>
      )}

      <section style={{
        background: "#EDE8DF",
        padding: "24px 0 64px",
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Neural network background */}
        {!prefersReduced && <NeuralCanvas />}

        {/* Dot-grid texture */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #dddad4 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          opacity: 0.38, zIndex: 0,
        }} />

        {/* Rising particles */}
        {!prefersReduced && PARTICLES.map(p => (
          <div key={p.id} aria-hidden="true" style={{
            position: "absolute", left: p.left, bottom: "-10px",
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.color,
            animation: `xzRiseUp ${p.dur} linear ${p.delay} infinite`,
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
                borderRadius: 9999, padding: "5px 14px 5px 10px",
                marginBottom: 36,
                animation: prefersReduced ? "none" : "xzFadeUp 0.6s ease both",
                animationDelay: "0.05s",
              }}>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#cc785c", flexShrink: 0,
                    animation: prefersReduced ? "none" : "xzDot1 2s ease-in-out infinite",
                  }} />
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#cc785c", opacity: 0.45, flexShrink: 0,
                    animation: prefersReduced ? "none" : "xzDot2 2s ease-in-out 0.35s infinite",
                  }} />
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11, fontWeight: 500,
                  letterSpacing: "1.1px", textTransform: "uppercase",
                  color: "#6c6a64",
                }}>
                  Enterprise AI Platform · V2.0
                </span>
              </div>

              {/* Heading */}
              <h1 style={{ marginBottom: 0, lineHeight: 1.0 }}>
                <span style={{
                  display: "block",
                  fontFamily: "'Cormorant Garamond', Garamond, serif",
                  fontWeight: 400,
                  fontSize: "clamp(42px, 5vw, 66px)",
                  color: "#141413",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.08, marginBottom: 4,
                  animation: prefersReduced ? "none" : "xzFadeUp 0.7s ease both",
                  animationDelay: "0.20s",
                }}>
                  The Future of
                </span>

                {/* Typewriter + glitch line */}
                <span style={{
                  display: "block",
                  fontFamily: "'Cormorant Garamond', Garamond, serif",
                  fontWeight: 700, fontStyle: "italic",
                  fontSize: "clamp(58px, 9vw, 118px)",
                  color: glitching ? "#a9583e" : "#cc785c",
                  letterSpacing: "-0.035em",
                  lineHeight: 0.9, marginBottom: 10,
                  minHeight: "1em",
                  transition: "color 0.08s",
                  textShadow: glitching
                    ? "0 0 24px rgba(201,136,58,0.55), 3px 0 0 rgba(204,120,92,0.35), -3px 0 0 rgba(201,136,58,0.3)"
                    : "none",
                }}>
                  {headingText}
                  {isTyping && (
                    <span aria-hidden="true" style={{
                      display: "inline-block",
                      width: "0.05em", height: "0.75em",
                      background: "#cc785c", verticalAlign: "middle",
                      marginLeft: 3, borderRadius: 1,
                      animation: "xzCursor 0.9s step-end infinite",
                    }} />
                  )}
                </span>

                <span style={{
                  display: "block",
                  fontFamily: "'Cormorant Garamond', Garamond, serif",
                  fontWeight: 400,
                  fontSize: "clamp(28px, 3.8vw, 50px)",
                  color: "#3d3d3a",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.12,
                  animation: prefersReduced ? "none" : "xzFadeUp 0.7s ease both",
                  animationDelay: "0.62s",
                }}>
                  is here —{" "}
                  <em style={{ color: "#C9883A", fontStyle: "italic" }}>for every enterprise.</em>
                </span>
              </h1>

              {/* Cycling line */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                marginTop: 28, marginBottom: 24,
                animation: prefersReduced ? "none" : "xzFadeIn 0.6s ease both",
                animationDelay: "0.85s",
              }}>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14, fontWeight: 500, color: "#6c6a64",
                  whiteSpace: "nowrap",
                }}>
                  Delivering:
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14, fontWeight: 600, color: "#cc785c",
                  opacity: fadeIn ? 1 : 0,
                  transition: "opacity 0.32s ease",
                  minWidth: "min(210px, 55vw)", display: "inline-block",
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
                fontFamily: "'Inter', sans-serif",
                fontSize: 16, lineHeight: 1.65,
                color: "#3d3d3a",
                maxWidth: 500, marginBottom: 40,
                animation: prefersReduced ? "none" : "xzFadeUp 0.6s ease both",
                animationDelay: "1.0s",
              }}>
                XERXEZ delivers intelligent ERP, DevSecOps pipelines, and cloud
                infrastructure that transform how enterprises operate at scale.
              </p>

              {/* CTAs */}
              <div style={{
                display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                animation: prefersReduced ? "none" : "xzScaleIn 0.6s ease both",
                animationDelay: "1.18s",
              }}>
                <Link
                  to="/contact"
                  ref={btnRef}
                  onMouseMove={onBtnMove}
                  onMouseLeave={onBtnLeave}
                  onClick={onBtnClick}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#cc785c", color: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14, fontWeight: 500, lineHeight: 1,
                    padding: "13px 24px", borderRadius: 8,
                    textDecoration: "none", cursor: "none",
                    position: "relative", overflow: "hidden",
                    transition: "background 150ms ease, transform 0.18s ease",
                    boxShadow: "0 4px 0 rgba(140,60,30,0.38), 0 6px 20px rgba(204,120,92,0.22)",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "#a9583e")}
                  onMouseOut={e => (e.currentTarget.style.background = "#cc785c")}
                >
                  Get Started
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 6.5h9M8 3l3.5 3.5L8 10"
                      stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                <Link to="/service" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: "#141413",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14, fontWeight: 500, lineHeight: 1,
                  padding: "13px 24px", borderRadius: 8,
                  border: "1px solid #dddad4",
                  textDecoration: "none", cursor: "none",
                  transition: "border-color 150ms ease, background 150ms ease",
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = "#cc785c";
                    e.currentTarget.style.background = "rgba(204,120,92,0.05)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = "#dddad4";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Explore Services
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 6.5h9M8 3l3.5 3.5L8 10"
                      stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* Scroll indicator */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                marginTop: 52,
                opacity: scrolled ? 0 : 0.45,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                  style={{ animation: prefersReduced ? "none" : "xzBounce 1.6s ease-in-out infinite" }}>
                  <path d="M10 3v14M3.5 10.5l6.5 6.5 6.5-6.5"
                    stroke="#141413" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 9, fontWeight: 600,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#141413",
                }}>
                  SCROLL
                </span>
              </div>
            </div>

            {/* ── RIGHT: Holographic card ── */}
            <div className="col-lg-6 d-none d-lg-flex align-items-start justify-content-center"
              style={{ paddingTop: 30 }}>
              <div
                ref={holoRef}
                onMouseMove={onHoloMove}
                onMouseLeave={onHoloLeave}
                style={{
                  position: "relative",
                  background: "linear-gradient(140deg, rgba(255,255,255,0.7) 0%, rgba(237,232,223,0.55) 100%)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(201,136,58,0.22)",
                  borderRadius: 24,
                  padding: "32px 20px 20px",
                  boxShadow: "0 8px 48px rgba(201,136,58,0.10), 0 2px 0 rgba(255,255,255,0.9) inset",
                  transition: "transform 0.12s ease-out",
                  transformStyle: "preserve-3d",
                  animation: prefersReduced ? "none" : "xzHoloBorder 3.5s ease-in-out infinite",
                  cursor: "none",
                }}
              >
                {/* Rainbow shimmer overlay */}
                <div ref={holoGlowRef} aria-hidden="true" style={{
                  position: "absolute", inset: 0, borderRadius: 24,
                  opacity: 0, transition: "opacity 0.18s",
                  pointerEvents: "none", zIndex: 2,
                }} />

                {/* Live status chip */}
                <div style={{
                  position: "absolute", top: 14, right: 16,
                  display: "flex", alignItems: "center", gap: 5,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 9, fontWeight: 600,
                  color: "#2D7B6B", letterSpacing: "0.06em",
                  zIndex: 3,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 7px #4ade80",
                    animation: prefersReduced ? "none" : "xzDot1 1.4s ease-in-out infinite",
                    flexShrink: 0,
                  }} />
                  LIVE SYSTEM
                </div>

                {/* ERP network */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <ERPNetwork />
                </div>

                {/* Stat chips */}
                <div style={{
                  display: "flex", gap: 8, justifyContent: "center",
                  marginTop: 10, flexWrap: "wrap", position: "relative", zIndex: 1,
                }}>
                  {[
                    { label: "Uptime", value: "99.9%" },
                    { label: "AI Models", value: "247" },
                    { label: "Clients", value: "120+" },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: "rgba(201,136,58,0.07)",
                      border: "1px solid rgba(201,136,58,0.14)",
                      borderRadius: 8, padding: "6px 14px",
                      textAlign: "center",
                    }}>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 15, fontWeight: 700, color: "#7A4A1E",
                        lineHeight: 1,
                      }}>
                        {s.value}
                      </div>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 9, color: "#6c6a64",
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        marginTop: 3,
                      }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Keyframes */}
        <style>{`
          @keyframes xzDot1 {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50%       { opacity: 0.25; transform: scale(0.7); }
          }
          @keyframes xzDot2 {
            0%, 100% { opacity: 0.45; }
            50%       { opacity: 0.1; }
          }
          @keyframes xzCursor {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }
          @keyframes xzBounce {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(7px); }
          }
          @keyframes xzRiseUp {
            0%   { transform: translateY(0);       opacity: 0; }
            8%   { opacity: 0.9; }
            85%  { opacity: 0.5; }
            100% { transform: translateY(-100vh);  opacity: 0; }
          }
          @keyframes xzRipple {
            0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%,-50%) scale(45); opacity: 0; }
          }
          @keyframes xzHoloBorder {
            0%, 100% { box-shadow: 0 8px 48px rgba(201,136,58,0.10), 0 2px 0 rgba(255,255,255,0.9) inset; }
            50%       { box-shadow: 0 8px 48px rgba(201,136,58,0.22), 0 0 0 1.5px rgba(201,136,58,0.28), 0 2px 0 rgba(255,255,255,0.9) inset; }
          }
          @media (prefers-reduced-motion: reduce) {
            .xz-network-svg animate,
            .xz-network-svg animateMotion { display: none; }
          }
        `}</style>
      </section>
    </>
  );
};

export default HeroSection;
