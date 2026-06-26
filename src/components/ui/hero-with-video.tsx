import React, { useState, useRef } from "react";
import {
  Play, Pause, Mail, ArrowRight, Menu,
  ChevronDown, Sun, Moon,
} from "lucide-react";

// ── XERXEZ colour tokens ─────────────────────────────────────────────────────
const LIGHT = {
  bg:         "#faf9f5",
  card:       "#ffffff",
  cardBorder: "#E8E3DA",
  ink:        "#141413",
  muted:      "#6c6a64",
  subtle:     "#8e8b82",
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
  subtle:     "#6c6a64",
  border:     "rgba(255,255,255,0.08)",
  inputBg:    "#2a2826",
  coral:      "#cc785c",
  coralDark:  "#a9583e",
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface NavbarHeroProps {
  brandName?:        string;
  heroTitle?:        string;
  heroSubtitle?:     string;
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
  const [email,             setEmail]             = useState("");
  const [mobileOpen,        setMobileOpen]        = useState(false);
  const [openDropdown,      setOpenDropdown]      = useState<string | null>(null);
  const [isVideoPlaying,    setIsVideoPlaying]    = useState(false);
  const [isVideoPaused,     setIsVideoPaused]     = useState(false);
  const [isDark,            setIsDark]            = useState(false);
  const [loginHovered,      setLoginHovered]      = useState(false);
  const [ctaHovered,        setCtaHovered]        = useState(false);
  const [joinHovered,       setJoinHovered]       = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const C = isDark ? DARK : LIGHT;

  const toggleDropdown = (name: string) =>
    setOpenDropdown(openDropdown === name ? null : name);

  const handlePlayVideo = () => {
    videoRef.current?.play();
    setIsVideoPlaying(true);
    setIsVideoPaused(false);
  };
  const handlePauseVideo = () => {
    videoRef.current?.pause();
    setIsVideoPaused(true);
  };
  const handleResumeVideo = () => {
    videoRef.current?.play();
    setIsVideoPaused(false);
  };
  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    setIsVideoPaused(false);
  };

  // ── shared style helpers ────────────────────────────────────────────────────
  const navLinkStyle: React.CSSProperties = {
    display: "flex", alignItems: "center",
    gap: 4, padding: "8px 12px",
    fontSize: 14, fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    color: C.muted, textDecoration: "none",
    background: "none", border: "none", cursor: "pointer",
    borderRadius: 8, transition: "color 150ms ease",
  };

  const dropdownPanelStyle: React.CSSProperties = {
    position: "absolute", top: "100%", left: 0,
    marginTop: 8, padding: 8,
    background: C.card, border: `1px solid ${C.cardBorder}`,
    borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    zIndex: 20, minWidth: 192,
  };

  const dropdownItemStyle: React.CSSProperties = {
    display: "block", padding: "8px 12px",
    fontSize: 13, fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    color: C.muted, textDecoration: "none",
    borderRadius: 8, transition: "color 150ms ease, background 150ms ease",
  };

  return (
    <>
      {/* ── Scoped keyframes (only used here) ───────────────────────────────── */}
      <style>{`
        .xzuvh-nav-link:hover { color: ${C.ink} !important; }
        .xzuvh-drop-item:hover { color: ${C.ink} !important; background: ${C.inputBg} !important; }
        .xzuvh-mobile-item:hover { background: ${C.inputBg} !important; }
      `}</style>

      <div style={{
        position: "absolute", inset: 0,
        background: C.bg,
        overflowY: "auto",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: 1152, margin: "0 auto", padding: "24px 32px" }}>

          {/* ══ NAVBAR ════════════════════════════════════════════════════════ */}
          <div style={{
            position: "relative", zIndex: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 0", gap: 16,
          }}>

            {/* Left: brand + desktop nav */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <a href="#" style={{
                fontWeight: 700, fontSize: 22, color: C.ink,
                textDecoration: "none", flexShrink: 0,
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "-0.02em",
              }}>
                {brandName}
              </a>

              {/* Desktop nav — hidden below lg (992px) via Bootstrap */}
              <nav className="d-none d-lg-flex" style={{ alignItems: "center" }}>
                <ul style={{ display: "flex", alignItems: "center", margin: 0, padding: 0, listStyle: "none", gap: 2 }}>
                  <li>
                    <a href="#" className="xzuvh-nav-link" style={navLinkStyle}>About</a>
                  </li>

                  {/* Resources dropdown */}
                  <li style={{ position: "relative" }}>
                    <button
                      className="xzuvh-nav-link"
                      style={navLinkStyle}
                      onClick={() => toggleDropdown("desktop-resources")}
                    >
                      Resources
                      <ChevronDown size={14} style={{
                        transition: "transform 200ms ease",
                        transform: openDropdown === "desktop-resources" ? "rotate(180deg)" : "rotate(0deg)",
                      }} />
                    </button>
                    {openDropdown === "desktop-resources" && (
                      <ul style={{ ...dropdownPanelStyle, listStyle: "none", margin: 0 }}>
                        <li><a href="#" className="xzuvh-drop-item" style={dropdownItemStyle}>Documentation</a></li>
                        <li><a href="#" className="xzuvh-drop-item" style={dropdownItemStyle}>Tutorials</a></li>
                      </ul>
                    )}
                  </li>

                  <li>
                    <a href="#" className="xzuvh-nav-link" style={navLinkStyle}>Blog</a>
                  </li>

                  {/* Plans dropdown */}
                  <li style={{ position: "relative" }}>
                    <button
                      className="xzuvh-nav-link"
                      style={navLinkStyle}
                      onClick={() => toggleDropdown("desktop-pricing")}
                    >
                      Plans & Pricing
                      <ChevronDown size={14} style={{
                        transition: "transform 200ms ease",
                        transform: openDropdown === "desktop-pricing" ? "rotate(180deg)" : "rotate(0deg)",
                      }} />
                    </button>
                    {openDropdown === "desktop-pricing" && (
                      <ul style={{ ...dropdownPanelStyle, listStyle: "none", margin: 0 }}>
                        <li><a href="#" className="xzuvh-drop-item" style={dropdownItemStyle}>Starter</a></li>
                        <li><a href="#" className="xzuvh-drop-item" style={dropdownItemStyle}>Pro</a></li>
                        <li><a href="#" className="xzuvh-drop-item" style={dropdownItemStyle}>Enterprise</a></li>
                      </ul>
                    )}
                  </li>
                </ul>
              </nav>
            </div>

            {/* Right: CTAs + theme toggle + hamburger */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>

              {/* Desktop buttons */}
              <div className="d-none d-lg-flex" style={{ alignItems: "center", gap: 12 }}>
                <a
                  href="#"
                  style={{
                    padding: "8px 16px", fontSize: 14, fontWeight: 500,
                    color: loginHovered ? C.muted : C.ink,
                    textDecoration: "none", borderRadius: 10,
                    transition: "color 150ms ease",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={() => setLoginHovered(true)}
                  onMouseLeave={() => setLoginHovered(false)}
                >
                  Login
                </a>
                <button
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: ctaHovered ? C.coralDark : C.coral,
                    color: "#ffffff", padding: "10px 20px",
                    fontSize: 14, fontWeight: 500,
                    borderRadius: 10, border: "none", cursor: "pointer",
                    transition: "background 150ms ease",
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
                onClick={() => setIsDark(!isDark)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 38, height: 38, borderRadius: "50%",
                  background: C.inputBg, border: `1px solid ${C.border}`,
                  cursor: "pointer", flexShrink: 0,
                  transition: "background 150ms ease",
                }}
                aria-label="Toggle theme"
              >
                {isDark
                  ? <Sun size={16} color={C.ink} />
                  : <Moon size={16} color={C.muted} />}
              </button>

              {/* Mobile hamburger */}
              <div className="d-lg-none" style={{ position: "relative" }}>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 38, height: 38, borderRadius: 10,
                    background: "transparent", border: `1px solid ${C.border}`,
                    cursor: "pointer",
                  }}
                  aria-label="Open menu"
                >
                  <Menu size={18} color={C.ink} />
                </button>

                {/* Mobile dropdown */}
                {mobileOpen && (
                  <ul style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    padding: 8, background: C.card,
                    border: `1px solid ${C.cardBorder}`,
                    borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    zIndex: 30, minWidth: 220, margin: 0, listStyle: "none",
                  }}>
                    <li>
                      <a href="#" className="xzuvh-mobile-item" style={{
                        ...dropdownItemStyle, color: C.ink, display: "block",
                      }}>About</a>
                    </li>
                    <li>
                      <button
                        className="xzuvh-mobile-item"
                        style={{ ...dropdownItemStyle, color: C.ink, width: "100%", display: "flex", justifyContent: "space-between" }}
                        onClick={() => toggleDropdown("mobile-resources")}
                      >
                        Resources
                        <ChevronDown size={14} style={{ transform: openDropdown === "mobile-resources" ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
                      </button>
                      {openDropdown === "mobile-resources" && (
                        <ul style={{ marginLeft: 12, paddingLeft: 12, borderLeft: `2px solid ${C.border}`, listStyle: "none" }}>
                          <li><a href="#" className="xzuvh-drop-item" style={{ ...dropdownItemStyle, fontSize: 13 }}>Documentation</a></li>
                          <li><a href="#" className="xzuvh-drop-item" style={{ ...dropdownItemStyle, fontSize: 13 }}>Tutorials</a></li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <a href="#" className="xzuvh-mobile-item" style={{ ...dropdownItemStyle, color: C.ink, display: "block" }}>Blog</a>
                    </li>
                    <li>
                      <button
                        className="xzuvh-mobile-item"
                        style={{ ...dropdownItemStyle, color: C.ink, width: "100%", display: "flex", justifyContent: "space-between" }}
                        onClick={() => toggleDropdown("mobile-pricing")}
                      >
                        Plans & Pricing
                        <ChevronDown size={14} style={{ transform: openDropdown === "mobile-pricing" ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
                      </button>
                      {openDropdown === "mobile-pricing" && (
                        <ul style={{ marginLeft: 12, paddingLeft: 12, borderLeft: `2px solid ${C.border}`, listStyle: "none" }}>
                          <li><a href="#" className="xzuvh-drop-item" style={{ ...dropdownItemStyle, fontSize: 13 }}>Starter</a></li>
                          <li><a href="#" className="xzuvh-drop-item" style={{ ...dropdownItemStyle, fontSize: 13 }}>Enterprise</a></li>
                        </ul>
                      )}
                    </li>
                    <li style={{ borderTop: `1px solid ${C.border}`, marginTop: 8, paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                      <a href="#" style={{ ...dropdownItemStyle, color: C.ink, textAlign: "center" }}>Login</a>
                      <button style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        background: C.coral, color: "#fff",
                        padding: "10px 16px", fontSize: 14, fontWeight: 500,
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

          {/* ══ HERO TEXT ═════════════════════════════════════════════════════ */}
          <div style={{ padding: "40px 0 48px", textAlign: "center" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Garamond, serif",
                fontWeight: 700,
                fontSize: "clamp(32px, 5vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: C.ink,
                margin: "0 0 20px",
              }}>
                {heroTitle}
              </h1>
              <p style={{
                fontSize: 17, lineHeight: 1.7,
                color: C.muted, margin: "0 0 32px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {heroDescription}
              </p>

              {/* Email CTA row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                {/* Email input */}
                <div style={{ position: "relative" }}>
                  <Mail
                    size={16}
                    color={C.muted}
                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  />
                  <input
                    type="email"
                    placeholder={emailPlaceholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: 260, background: C.inputBg,
                      border: `1px solid ${C.border}`,
                      color: C.ink, padding: "11px 16px 11px 40px",
                      fontSize: 14, borderRadius: 100,
                      outline: "none", fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={e => (e.currentTarget.style.boxShadow = `0 0 0 2px ${C.coral}40`)}
                    onBlur={e => (e.currentTarget.style.boxShadow = "none")}
                  />
                </div>

                {/* Join button */}
                <button
                  onClick={() => console.log("email:", email)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: joinHovered ? C.coralDark : C.coral,
                    color: "#ffffff", padding: "11px 22px",
                    fontSize: 14, fontWeight: 600,
                    borderRadius: 100, border: "none", cursor: "pointer",
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

          {/* ══ VIDEO / IMAGE HERO ════════════════════════════════════════════ */}
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 24px 72px rgba(0,0,0,0.14)",
          }}>
            {/* Background image */}
            <img
              src={backgroundImage}
              alt="Hero visual"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                transition: "opacity 500ms ease",
                opacity: isVideoPlaying ? 0 : 1,
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
                transition: "opacity 500ms ease",
                opacity: isVideoPlaying ? 1 : 0,
              }}
              onEnded={handleVideoEnded}
              playsInline
              muted
            />

            {/* Play / Pause button */}
            <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 10 }}>
              {!isVideoPlaying ? (
                <button
                  onClick={handlePlayVideo}
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(255,255,255,0.20)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.30)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "background 200ms ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.32)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
                >
                  <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                </button>
              ) : (
                <button
                  onClick={isVideoPaused ? handleResumeVideo : handlePauseVideo}
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(255,255,255,0.20)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.30)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "background 200ms ease",
                  }}
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
          {/* bottom breathing room */}
          <div style={{ height: 48 }} />
        </div>
      </div>
    </>
  );
};

export { NavbarHero };
