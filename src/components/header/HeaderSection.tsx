import {} from "react";
import MainMenuSection from "./MainMenuSection";
import { useCustomContext } from "../../context/context";
import { Link } from "react-router-dom";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
}


const HeaderSection = ({ variant: _variant }: Props) => {
  const { toggleMobileMenu } = useCustomContext();

  return (
    <header className="hdr-s1" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      height: 70,
      background: "rgba(20,14,6,0.94)",
      borderBottom: "1px solid rgba(201,136,58,0.18)",
      boxShadow: "0 2px 0 rgba(201,136,58,0.18), 0 8px 32px rgba(0,0,0,0.50)",
      backdropFilter: "blur(20px) saturate(1.4)",
      WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      transition: "background 250ms ease",
    }}>
      <div className="container h-100">
        <div style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}>
          {/* Logo — far left */}
          <Link to="/" style={{ display: "block", textDecoration: "none", flexShrink: 0 }}>
            <Image
              src="/assets/img/logo/xerxez_logo.png"
              alt="Xerxez Solutions"
              width={220}
              height={80}
              style={{ height: 100, width: "auto", display: "block" }}
            />
          </Link>

          {/* Spacer pushes nav + actions to far right */}
          <div style={{ flex: 1 }} />

          {/* Desktop nav — right side, before action buttons */}
          <div className="header-main d-none d-xl-block" style={{ padding: 0, flexShrink: 0, marginRight: 80 }}>
            <MainMenuSection />
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Sign in — text link */}
            <Link to="/erp" className="d-none d-xl-inline-flex" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.75)",
              textDecoration: "none",
              padding: "8px 10px",
              transition: "color 150ms ease",
            }}
              onMouseOver={e => (e.currentTarget.style.color = "#C9883A")}
              onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            >
              Sign in
            </Link>

            {/* Primary CTA — gold */}
            <Link to="/contact" className="d-none d-xl-inline-flex" style={{
              alignItems: "center",
              gap: 6,
              background: "linear-gradient(135deg, #E8A84E 0%, #C9883A 100%)",
              color: "#0a0806",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1,
              padding: "0 20px",
              height: 38,
              borderRadius: 8,
              textDecoration: "none",
              transition: "opacity 150ms ease, box-shadow 150ms ease",
              boxShadow: "0 3px 0 rgba(100,58,10,0.50), 0 6px 18px rgba(201,136,58,0.22)",
              whiteSpace: "nowrap",
            }}
              onMouseOver={e => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.boxShadow = "0 1px 0 rgba(100,58,10,0.40), 0 3px 10px rgba(201,136,58,0.18)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = "0 3px 0 rgba(100,58,10,0.50), 0 6px 18px rgba(201,136,58,0.22)";
              }}
            >
              Get Started
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="d-xl-none"
              onClick={toggleMobileMenu}
              style={{
                background: "none",
                border: "1px solid rgba(201,136,58,0.28)",
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
  );
};

export default HeaderSection;
