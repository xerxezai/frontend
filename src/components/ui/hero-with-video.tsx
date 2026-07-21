import React, { useState, useRef } from "react";
import {
  Play, Pause, Mail, ArrowRight,
  Menu, ChevronDown, Sun, Moon,
} from "lucide-react";

// ── XERXEZ colour tokens ──────────────────────────────────────────────────────
const LIGHT = {
  bg:         "#faf9f5",
  card:       "#ffffff",
  cardBorder: "#E8E3DA",
  ink:        "#141413",
  muted:      "#6c6a64",
  border:     "#e6dfd8",
  inputBg:    "#EDE8DF",
  coral:      "#cc785c",
  coralDark:  "#a9583e",
};

const DARK = {
  bg:         "#181715",
  card:       "#252320",
  cardBorder: "rgba(255,255,255,0.10)",
  ink:        "#faf9f5",
  muted:      "#9c9890",
  border:     "rgba(255,255,255,0.08)",
  inputBg:    "#2a2826",
  coral:      "#cc785c",
  coralDark:  "#a9583e",
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface NavbarHeroProps {
  brandName?:        string;
  heroTitle?:        string;
  heroDescription?:  string;
  backgroundImage?:  string;
  videoUrl?:         string;
  emailPlaceholder?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
const NavbarHero: React.FC<NavbarHeroProps> = ({
  brandName        = "nexus",
  heroTitle        = "Innovation Meets Simplicity",
  heroDescription  = "Discover cutting-edge solutions designed for the modern digital landscape.",
  backgroundImage  = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2072&q=80",
  videoUrl         = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  emailPlaceholder = "enter@email.com",
}) => {
  const [email,          setEmail]          = useState("");
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [openDropdown,   setOpenDropdown]   = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoPaused,  setIsVideoPaused]  = useState(false);
  const [isDark,         setIsDark]         = useState(false);
  const [ctaHovered,     setCtaHovered]     = useState(false);
  const [joinHovered,    setJoinHovered]    = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const C = isDark ? DARK : LIGHT;

  const toggleDropdown = (name: string) =>
    setOpenDropdown(prev => (prev === name ? null : name));

  const handlePlay = () => {
    videoRef.current?.play();
    setIsVideoPlaying(true);
    setIsVideoPaused(false);
  };
  const handlePause = () => {
    videoRef.current?.pause();
    setIsVideoPaused(true);
  };
  const handleResume = () => {
    videoRef.current?.play();
    setIsVideoPaused(false);
  };
  const handleEnded = () => {
    setIsVideoPlaying(false);
    setIsVideoPaused(false);
  };

  // ── Shared style fragments ────────────────────────────────────────────────
  const navLinkBase: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 4,
    padding: "8px 12px", fontSize: 14, fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    color: C.muted, textDecoration: "none",
    background: "none", border: "none", cursor: "pointer",
    borderRadius: 8, transition: "color 150ms ease",
    whiteSpace: "nowrap",
  };

  const dropdownPanel: React.CSSProperties = {
    position: "absolute", top: "calc(100% + 8px)", left: 0,
    padding: 8, background: C.card,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    zIndex: 30, minWidth: 192, listStyle: "none", margin: 0,
  };

  const dropdownItem: React.CSSProperties = {
    display: "block", padding: "8px 12px",
    fontSize: 13, fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    color: C.muted, textDecoration: "none",
    borderRadius: 8, transition: "color 150ms ease, background 150ms ease",
    background: "transparent", border: "none", cursor: "pointer",
    width: "100%", textAlign: "left",
  };

  const playBtnStyle: React.CSSProperties = {
    width: 52, height: 52, borderRadius: "50%",
    background: "rgba(255,255,255,0.20)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.30)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "background 200ms ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'DM Sans', 'Inter', sans-serif",
      transition: "background 250ms ease",
    }}>
      {/* Scoped hover rules — class names are unique to this component */}
      <style>{`
        .xzuvh-link:hover  { color: ${C.ink}      !important; }
        .xzuvh-ditem:hover { color: ${C.ink}      !important; background: ${C.inputBg} !important; }
        .xzuvh-mitem:hover { background: ${C.inputBg} !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* ══ NAVBAR ═══════════════════════════════════════════════════════ */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
          padding: "8px 0", marginBottom: 0,
          position: "relative", zIndex: 20,
        }}>

          {/* Left: brand + desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
            <a href="#" style={{
              fontWeight: 700, fontSize: 22, color: C.ink,
              textDecoration: "none",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "-0.02em",
            }}>
              {brandName}
            </a>

            {/* Desktop nav — hidden below lg */}
            <nav className="d-none d-lg-flex">
              <ul style={{ display: "flex", alignItems: "center", margin: 0, padding: 0, listStyle: "none", gap: 2 }}>
                <li><a href="#" className="xzuvh-link" style={navLinkBase}>About</a></li>

                {/* Resources */}
                <li style={{ position: "relative" }}>
                  <button className="xzuvh-link" style={navLinkBase}
                    onClick={() => toggleDropdown("d-resources")}>
                    Resources
                    <ChevronDown size={13} style={{
                      transition: "transform 200ms",
                      transform: openDropdown === "d-resources" ? "rotate(180deg)" : "none",
                    }} />
                  </button>
                  {openDropdown === "d-resources" && (
                    <ul style={dropdownPanel}>
                      <li><a href="#" className="xzuvh-ditem" style={dropdownItem}>Documentation</a></li>
                      <li><a href="#" className="xzuvh-ditem" style={dropdownItem}>Tutorials</a></li>
                      <li><a href="#" className="xzuvh-ditem" style={dropdownItem}>Case Studies</a></li>
                    </ul>
                  )}
                </li>

                <li><a href="#" className="xzuvh-link" style={navLinkBase}>Blog</a></li>

                {/* Pricing */}
                <li style={{ position: "relative" }}>
                  <button className="xzuvh-link" style={navLinkBase}
                    onClick={() => toggleDropdown("d-pricing")}>
                    Plans & Pricing
                    <ChevronDown size={13} style={{
                      transition: "transform 200ms",
                      transform: openDropdown === "d-pricing" ? "rotate(180deg)" : "none",
                    }} />
                  </button>
                  {openDropdown === "d-pricing" && (
                    <ul style={dropdownPanel}>
                      <li><a href="#" className="xzuvh-ditem" style={dropdownItem}>Basic</a></li>
                      <li><a href="#" className="xzuvh-ditem" style={dropdownItem}>Professional</a></li>
                      <li><a href="#" className="xzuvh-ditem" style={dropdownItem}>Enterprise</a></li>
                    </ul>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          {/* Right: buttons + theme toggle + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>

            {/* Desktop buttons */}
            <div className="d-none d-lg-flex" style={{ alignItems: "center", gap: 8 }}>
              <a href="#" className="xzuvh-link" style={{ ...navLinkBase, padding: "8px 16px" }}>
                Login
              </a>
              <button
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: ctaHovered ? C.coralDark : C.coral,
                  color: "#fff", padding: "10px 20px", fontSize: 14,
                  fontWeight: 600, borderRadius: 10, border: "none",
                  cursor: "pointer", transition: "background 150ms ease",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                Get Started <ArrowRight size={14} />
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(d => !d)}
              aria-label="Toggle theme"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 38, height: 38, borderRadius: "50%",
                background: C.inputBg, border: `1px solid ${C.border}`,
                cursor: "pointer", flexShrink: 0, transition: "background 150ms ease",
              }}
            >
              {isDark ? <Sun size={15} color={C.ink} /> : <Moon size={15} color={C.muted} />}
            </button>

            {/* Mobile hamburger */}
            <div className="d-lg-none" style={{ position: "relative" }}>
              <button
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Open menu"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 38, height: 38, borderRadius: 10,
                  background: "transparent", border: `1px solid ${C.border}`,
                  cursor: "pointer",
                }}
              >
                <Menu size={17} color={C.ink} />
              </button>

              {/* Mobile menu panel */}
              {mobileOpen && (
                <ul style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  padding: 8, background: C.card,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  zIndex: 30, minWidth: 220, margin: 0, listStyle: "none",
                }}>
                  <li><a href="#" className="xzuvh-mitem" style={{ ...dropdownItem, color: C.ink }}>About</a></li>

                  <li>
                    <button className="xzuvh-mitem"
                      style={{ ...dropdownItem, color: C.ink, display: "flex", justifyContent: "space-between" }}
                      onClick={() => toggleDropdown("m-resources")}>
                      Resources
                      <ChevronDown size={13} style={{ transform: openDropdown === "m-resources" ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
                    </button>
                    {openDropdown === "m-resources" && (
                      <ul style={{ marginLeft: 12, paddingLeft: 12, borderLeft: `2px solid ${C.border}`, listStyle: "none" }}>
                        <li><a href="#" className="xzuvh-ditem" style={{ ...dropdownItem, fontSize: 13 }}>Documentation</a></li>
                        <li><a href="#" className="xzuvh-ditem" style={{ ...dropdownItem, fontSize: 13 }}>Tutorials</a></li>
                      </ul>
                    )}
                  </li>

                  <li><a href="#" className="xzuvh-mitem" style={{ ...dropdownItem, color: C.ink }}>Blog</a></li>

                  <li>
                    <button className="xzuvh-mitem"
                      style={{ ...dropdownItem, color: C.ink, display: "flex", justifyContent: "space-between" }}
                      onClick={() => toggleDropdown("m-pricing")}>
                      Plans & Pricing
                      <ChevronDown size={13} style={{ transform: openDropdown === "m-pricing" ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
                    </button>
                    {openDropdown === "m-pricing" && (
                      <ul style={{ marginLeft: 12, paddingLeft: 12, borderLeft: `2px solid ${C.border}`, listStyle: "none" }}>
                        <li><a href="#" className="xzuvh-ditem" style={{ ...dropdownItem, fontSize: 13 }}>Basic</a></li>
                        <li><a href="#" className="xzuvh-ditem" style={{ ...dropdownItem, fontSize: 13 }}>Professional</a></li>
                        <li><a href="#" className="xzuvh-ditem" style={{ ...dropdownItem, fontSize: 13 }}>Enterprise</a></li>
                      </ul>
                    )}
                  </li>

                  <li style={{ borderTop: `1px solid ${C.border}`, marginTop: 8, paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    <a href="#" className="xzuvh-mitem" style={{ ...dropdownItem, color: C.ink, textAlign: "center" }}>Login</a>
                    <button style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: C.coral, color: "#fff",
                      padding: "10px 16px", fontSize: 14, fontWeight: 600,
                      borderRadius: 10, border: "none", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      Get Started <ArrowRight size={14} />
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ══ HERO TEXT ════════════════════════════════════════════════════ */}
        <div style={{ padding: "48px 0 52px", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 58px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: C.ink,
              margin: "0 0 20px",
            }}>
              {heroTitle}
            </h1>
            <p style={{
              fontSize: 17, lineHeight: 1.7,
              color: C.muted, margin: "0 0 36px",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {heroDescription}
            </p>

            {/* Email + CTA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Mail size={15} color={C.muted} style={{
                  position: "absolute", left: 14,
                  top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none",
                }} />
                <input
                  type="email"
                  placeholder={emailPlaceholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: 260, background: C.inputBg,
                    border: `1px solid ${C.border}`,
                    color: C.ink, padding: "12px 16px 12px 40px",
                    fontSize: 14, borderRadius: 100,
                    outline: "none", fontFamily: "'DM Sans', sans-serif",
                    transition: "box-shadow 150ms ease",
                  }}
                  onFocus={e => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.coral}33`)}
                  onBlur={e => (e.currentTarget.style.boxShadow = "none")}
                />
              </div>
              <button
                onClick={() => {}}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: joinHovered ? C.coralDark : C.coral,
                  color: "#fff", padding: "12px 22px",
                  fontSize: 14, fontWeight: 600, borderRadius: 100,
                  border: "none", cursor: "pointer",
                  transition: "background 150ms ease",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={() => setJoinHovered(true)}
                onMouseLeave={() => setJoinHovered(false)}
              >
                Join Now <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ══ VIDEO / IMAGE ════════════════════════════════════════════════ */}
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 24px 72px rgba(0,0,0,0.14)",
          background: "#000",
        }}>
          {/* Poster image */}
          <img
            src={backgroundImage}
            alt="Hero visual"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: isVideoPlaying ? 0 : 1,
              transition: "opacity 500ms ease",
            }}
          />

          {/* Video */}
          <video
            ref={videoRef}
            src={videoUrl}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: isVideoPlaying ? 1 : 0,
              transition: "opacity 500ms ease",
            }}
            onEnded={handleEnded}
            playsInline
            muted
          />

          {/* Play / Pause button */}
          <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 10 }}>
            {!isVideoPlaying ? (
              <button
                onClick={handlePlay}
                style={playBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.32)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
              >
                <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
              </button>
            ) : (
              <button
                onClick={isVideoPaused ? handleResume : handlePause}
                style={playBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.32)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
              >
                {isVideoPaused
                  ? <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                  : <Pause size={22} color="#fff" fill="#fff" />}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export { NavbarHero };
