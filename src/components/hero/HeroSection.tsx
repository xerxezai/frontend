import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const CYCLE_WORDS = [
  "AI-Powered ERP",
  "DevSecOps Pipelines",
  "Cloud Infrastructure",
  "AI Training & Consulting",
  "Quantum Computing",
];

// Hub center
const HUB = { x: 250, y: 205, r: 42 };

// Outer module nodes
const NODES = [
  { id: "fin",   x: 88,  y: 82,  r: 26, label: "Finance",   color: "#2D5A3D", dot: "#4ade80" },
  { id: "cloud", x: 388, y: 68,  r: 26, label: "Cloud",     color: "#1B3A5C", dot: "#60a5fa" },
  { id: "hr",    x: 438, y: 195, r: 23, label: "HR",        color: "#C9883A", dot: "#fbbf24" },
  { id: "crm",   x: 398, y: 330, r: 23, label: "CRM",       color: "#cc785c", dot: "#f97316" },
  { id: "ai",    x: 250, y: 392, r: 27, label: "AI/ML",     color: "#4A3D7C", dot: "#a78bfa" },
  { id: "dev",   x: 102, y: 330, r: 23, label: "DevSecOps", color: "#7C2D44", dot: "#fb7185" },
  { id: "inv",   x: 58,  y: 195, r: 21, label: "Inventory", color: "#2D7B6B", dot: "#2dd4bf" },
];

const ERPNetwork = () => (
  <svg
    viewBox="0 0 500 450"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="xz-network-svg"
    style={{ width: "100%", maxWidth: 480, overflow: "visible" }}
    aria-label="XERXEZ ERP module network diagram"
  >
    {/* Dashed connection lines hub → outer */}
    {NODES.map(n => (
      <line
        key={`line-${n.id}`}
        x1={HUB.x} y1={HUB.y}
        x2={n.x}   y2={n.y}
        stroke="#dddad4"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />
    ))}

    {/* Flowing data dots along each line */}
    {NODES.map((n, i) => (
      <circle key={`dot-${n.id}`} cx={0} cy={0} r={3} fill={n.dot}
        style={{ filter: `drop-shadow(0 0 4px ${n.dot})` }}>
        <animateMotion
          dur={`${2.8 + i * 0.35}s`}
          repeatCount="indefinite"
          path={`M ${HUB.x},${HUB.y} L ${n.x},${n.y}`}
        />
      </circle>
    ))}

    {/* Outer nodes */}
    {NODES.map(n => (
      <g key={n.id}>
        {/* Pulse ring */}
        <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke={n.dot} strokeWidth="1">
          <animate attributeName="r"
            values={`${n.r + 3};${n.r + 16};${n.r + 3}`}
            dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity"
            values="0.55;0;0.55"
            dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* Node fill */}
        <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity="0.1" />
        {/* Node border */}
        <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={n.color} strokeWidth="1.5" opacity="0.65" />
        {/* Status indicator dot */}
        <circle cx={n.x} cy={n.y - n.r + 7} r="3" fill={n.dot}
          style={{ filter: `drop-shadow(0 0 3px ${n.dot})` }} />
        {/* Label */}
        <text x={n.x} y={n.y + 5}
          textAnchor="middle"
          fill="#3d3d3a"
          fontSize="10"
          fontFamily="Inter, sans-serif"
          fontWeight="500">
          {n.label}
        </text>
      </g>
    ))}

    {/* Center hub — XERXEZ */}
    {/* Outer pulse ring */}
    <circle cx={HUB.x} cy={HUB.y} r={HUB.r + 10} fill="none" stroke="#cc785c" strokeWidth="1">
      <animate attributeName="r"
        values={`${HUB.r + 6};${HUB.r + 22};${HUB.r + 6}`}
        dur="2.4s" repeatCount="indefinite" />
      <animate attributeName="opacity"
        values="0.45;0;0.45"
        dur="2.4s" repeatCount="indefinite" />
    </circle>
    {/* Inner accent ring */}
    <circle cx={HUB.x} cy={HUB.y} r={HUB.r + 5}
      fill="none" stroke="#cc785c" strokeWidth="1" opacity="0.2" />
    {/* Hub body */}
    <circle cx={HUB.x} cy={HUB.y} r={HUB.r}
      fill="#efe9de" stroke="#cc785c" strokeWidth="2" />
    {/* Hub label */}
    <text x={HUB.x} y={HUB.y - 5}
      textAnchor="middle"
      fill="#141413"
      fontSize="13"
      fontFamily="Cormorant Garamond, Garamond, serif"
      fontWeight="600">
      XERXEZ
    </text>
    <text x={HUB.x} y={HUB.y + 12}
      textAnchor="middle"
      fill="#6c6a64"
      fontSize="9"
      fontFamily="Inter, sans-serif"
      fontWeight="400">
      ERP Hub
    </text>
  </svg>
);

const HeroSection = () => {
  const [wordIdx, setWordIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % CYCLE_WORDS.length);
        setFadeIn(true);
      }, 380);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{
      background: "#faf9f5",
      padding: "72px 0 72px",
      minHeight: "calc(100vh - 84px)",
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle dot-grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, #dddad4 1px, transparent 1px)",
        backgroundSize: "38px 38px",
        opacity: 0.38,
      }} aria-hidden="true" />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row g-5 align-items-start">

          {/* ── LEFT: headline + typing + CTAs ── */}
          <div className="col-lg-6">

            {/* Animated badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#efe9de", border: "1px solid #e6dfd8",
              borderRadius: 9999, padding: "5px 14px 5px 10px",
              marginBottom: 36,
            }}>
              <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#cc785c", flexShrink: 0,
                  animation: "xzDot1 2s ease-in-out infinite",
                }} />
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#cc785c", opacity: 0.45, flexShrink: 0,
                  animation: "xzDot2 2s ease-in-out 0.35s infinite",
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

            {/* Three-line dramatic headline */}
            <h1 style={{ marginBottom: 0, lineHeight: 1.0 }}>
              {/* Line 1 — plain editorial */}
              <span style={{
                display: "block",
                fontFamily: "'Cormorant Garamond', Garamond, serif",
                fontWeight: 400,
                fontSize: "clamp(42px, 5vw, 66px)",
                color: "#141413",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                marginBottom: 4,
              }}>
                The Future of
              </span>

              {/* Line 2 — large italic accent (like RADAI's teal "Engineering AI") */}
              <span style={{
                display: "block",
                fontFamily: "'Cormorant Garamond', Garamond, serif",
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: "clamp(58px, 9vw, 118px)",
                color: "#cc785c",
                letterSpacing: "-0.035em",
                lineHeight: 0.9,
                marginBottom: 10,
              }}>
                Enterprise AI
              </span>

              {/* Line 3 — muted resolution */}
              <span style={{
                display: "block",
                fontFamily: "'Cormorant Garamond', Garamond, serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 3.8vw, 50px)",
                color: "#3d3d3a",
                letterSpacing: "-0.015em",
                lineHeight: 1.12,
              }}>
                is here —{" "}
                <em style={{ color: "#C9883A", fontStyle: "italic" }}>for every enterprise.</em>
              </span>
            </h1>

            {/* Typing / cycling line */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: 28, marginBottom: 24,
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
                minWidth: 210, display: "inline-block",
              }}>
                {CYCLE_WORDS[wordIdx]}
              </span>
              {/* Blinking cursor */}
              <span style={{
                width: 2, height: 17, background: "#cc785c",
                display: "inline-block", borderRadius: 1, flexShrink: 0,
                animation: "xzCursor 1s step-end infinite",
              }} aria-hidden="true" />
            </div>

            {/* Description */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16, lineHeight: 1.65,
              color: "#3d3d3a",
              maxWidth: 500, marginBottom: 40,
            }}>
              XERXEZ delivers intelligent ERP, DevSecOps pipelines, and cloud
              infrastructure that transform how enterprises operate at scale.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <Link to="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#cc785c", color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14, fontWeight: 500, lineHeight: 1,
                padding: "13px 24px", borderRadius: 8,
                textDecoration: "none", cursor: "pointer",
                transition: "background 150ms ease",
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
                textDecoration: "none", cursor: "pointer",
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
              marginTop: 56, opacity: 0.45,
            }}>
              <div style={{
                width: 1, height: 36, background: "#141413",
                animation: "xzScrollLine 2s ease-in-out infinite",
              }} />
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

          {/* ── RIGHT: ERP Network ── */}
          <div className="col-lg-6 d-none d-lg-flex align-items-start justify-content-center"
            style={{ paddingTop: 16 }}>
            <ERPNetwork />
          </div>

        </div>
      </div>

      {/* Keyframe definitions */}
      <style>{`
        @keyframes xzDot1 {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50%       { opacity: 0.25; transform: scale(0.75); }
        }
        @keyframes xzDot2 {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%       { opacity: 0.1; transform: scale(0.75); }
        }
        @keyframes xzCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes xzScrollLine {
          0%, 100% { transform: scaleY(1);   transform-origin: top; }
          50%       { transform: scaleY(0.3); transform-origin: top; }
        }
        @media (prefers-reduced-motion: reduce) {
          .xz-network-svg animate,
          .xz-network-svg animateMotion { display: none; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
