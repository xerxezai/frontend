import { useEffect, useRef } from "react";
import MainMenuSection from "./MainMenuSection";
import { useCustomContext } from "../../context/context";
import { Link } from "react-router-dom";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
}

const HeaderSection = ({ variant: _variant }: Props) => {
  const { toggleMobileMenu } = useCustomContext();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = headerRef.current;
      if (!el) return;
      if (window.scrollY > 40) {
        el.style.background = "rgba(14,9,3,0.82)";
        el.style.borderBottomColor = "rgba(201,136,58,0.20)";
        el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(201,136,58,0.10)";
      } else {
        el.style.background = "rgba(20,14,6,0.55)";
        el.style.borderBottomColor = "rgba(180,140,100,0.10)";
        el.style.boxShadow = "none";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes xzNavIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .xz-header { animation: xzNavIn 0.45s ease both; }
      `}</style>
      <header ref={headerRef} className="xz-header" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      height: 70,
      background: "rgba(20,14,6,0.55)",
      borderBottom: "1px solid rgba(180,140,100,0.10)",
      boxShadow: "none",
      backdropFilter: "blur(24px) saturate(1.8)",
      WebkitBackdropFilter: "blur(24px) saturate(1.8)",
      transition: "background 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
    }}>
      <div className="container h-100">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}>
          {/* Wordmark */}
          <Link to="/" style={{ display: "block", textDecoration: "none" }}>
            <Image
              src="/assets/img/logo/xerxez_logo.png"
              alt="Xerxez Solutions"
              width={220}
              height={80}
              style={{ height: 100, width: "auto", display: "block" }}
            />
          </Link>

          {/* Desktop nav */}
          <div className="header-main d-none d-xl-block" style={{ padding: 0, flex: "none" }}>
            <MainMenuSection />
          </div>

          {/* Right cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 60 }}>            <Link to="/contact" style={{
              display: "none",
            }} className="d-none d-xl-inline-block" />

            {/* Sign in — text link */}
            <Link to="/erp" className="d-none d-xl-inline-flex" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.82)",
              textDecoration: "none",
              padding: "8px 4px",
            }}>
              Sign in
            </Link>

            {/* Primary CTA — coral */}
            <Link to="/contact" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#cc785c",
              color: "#ffffff",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1,
              padding: "10px 18px",
              height: 40,
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 150ms ease",
              whiteSpace: "nowrap",
            }}
              onMouseOver={e => (e.currentTarget.style.background = "#a9583e")}
              onMouseOut={e => (e.currentTarget.style.background = "#cc785c")}
            >
              Get Started
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="d-xl-none"
              onClick={toggleMobileMenu}
              style={{
                background: "none",
                border: "1px solid rgba(180,140,100,0.3)",
                borderRadius: 8,
                padding: "8px 10px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1,
              }}
              aria-label="Open menu"
            >
              <i className="fal fa-bars" style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>
      </header>
    </>
  );
};

export default HeaderSection;
