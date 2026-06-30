import { useEffect, useState } from "react";
import MainMenuSection from "./MainMenuSection";
import { useCustomContext } from "../../context/context";
import { Link } from "react-router-dom";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
}


const HeaderSection = ({ variant: _variant }: Props) => {
  const { toggleMobileMenu } = useCustomContext();
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      height: 70,
      background: "rgba(20,14,6,0.92)",
      borderBottom: "1px solid rgba(180,140,100,0.16)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
      backdropFilter: "blur(20px) saturate(1.5)",
      WebkitBackdropFilter: "blur(20px) saturate(1.5)",
      transition: "background 250ms ease",
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
  );
};

export default HeaderSection;
