import { useEffect, useState } from "react";
import { useCustomContext } from "../../context/context";
import MainMenuSection from "./MainMenuSection";
import SignInDropdown from "./SignInDropdown";
import { Link } from "react-router-dom";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
}
const HeaderSection2 = ({ variant }: Props) => {
  const { toggleMobileMenu } = useCustomContext();
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      setIsSticky(scroll >= 250);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header className="header-section-2">
      <div className="header-top-section">
        <div className="container">
          <div className={`header-top-wrapper ${variant ? "style-2" : ""}`} style={{ padding: "5px 0" }}>
            <ul className="top-list">
              <li className="top-tagline">
                <i className="fas fa-rocket"></i>
                <strong style={{ color: "#E8A84E", fontWeight: 700 }}>New:</strong>
                {" "}AI-Powered ERP now available for Engineering & EPC companies in UAE & India
              </li>
              <li className="top-divider">|</li>
              <li>
                <Link
                  to="/contact"
                  style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700,
                    color: "#E8A84E", textDecoration: "none",
                    display: "inline-flex", alignItems: "center", gap: 6,
                    transition: "color 150ms ease",
                  }}
                  onMouseOver={e => (e.currentTarget.style.color = "#fff")}
                  onMouseOut={e => (e.currentTarget.style.color = "#E8A84E")}
                >
                  Request a Demo <i className="far fa-arrow-right" style={{ fontSize: 10 }} />
                </Link>
              </li>
            </ul>
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/" target="_blank" rel="noreferrer" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://github.com/xerxezai" target="_blank" rel="noreferrer" title="GitHub">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={`header-1 ${isSticky ? "sticky" : ""}`}>
        <div className="container">
          <div className="mega-menu-wrapper">
            <div className="header-main" style={{ padding: "5px 0" }}>
              <div className="header-left">
                <Link to="/" className="header-logo1">
                  <Image
                    src="/assets/img/logo/xerxez_logo.png"
                    alt="Xerxez Solutions"
                    width={220}
                    height={120}
                    style={{ height: '120px', width: 'auto', background: 'transparent', display: 'block', border: 'none', boxShadow: 'none' }}
                  />
                </Link>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="mean__menu-wrapper d-none d-xl-block">
                  <MainMenuSection />
                </div>
                <SignInDropdown className="d-none d-xl-inline-flex" />
                <Link to="/contact" className="d-none d-xl-inline-flex" style={{
                  alignItems: "center",
                  background: "linear-gradient(135deg, #E8A84E 0%, #C9883A 100%)",
                  color: "#0a0806",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14, fontWeight: 700,
                  padding: "0 20px",
                  height: 40,
                  borderRadius: 8,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  marginLeft: 4,
                  boxShadow: "0 3px 0 rgba(100,58,10,0.50), 0 6px 18px rgba(201,136,58,0.20)",
                  transition: "opacity 150ms ease",
                }}
                  onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
                  onMouseOut={e => (e.currentTarget.style.opacity = "1")}
                >
                  Book Free Demo
                </Link>
                <div className="header__hamburger d-xl-none my-auto">
                  <div
                    className="sidebar__toggle"
                    role="button"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fal fa-bars"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection2;


