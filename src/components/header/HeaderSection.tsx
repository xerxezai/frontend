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
      height: 96,
      background: isSticky ? "rgba(250,249,245,0.96)" : "#faf9f5",
      borderBottom: isSticky ? "1px solid #e6dfd8" : "1px solid transparent",
      backdropFilter: isSticky ? "blur(12px)" : "none",
      transition: "border-color 250ms ease, background 250ms ease",
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
              width={240}
              height={85}
              style={{ height: 85, width: "auto", display: "block" }}
            />
          </Link>

          {/* Desktop nav */}
          <div className="header-main d-none d-xl-block" style={{ padding: 0, flex: "none" }}>
            <MainMenuSection />
          </div>

          {/* Right cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/contact" style={{
              display: "none",
            }} className="d-none d-xl-inline-block" />

            {/* Sign in — text link */}
            <Link to="/erp" className="d-none d-xl-inline-flex" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "#3d3d3a",
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
                border: "1px solid #e6dfd8",
                borderRadius: 8,
                padding: "8px 10px",
                cursor: "pointer",
                color: "#141413",
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
