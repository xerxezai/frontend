import { useEffect, useState } from "react";
import { useCustomContext } from "../../context/context";
import MainMenuSection from "./MainMenuSection";
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
          <div className={`header-top-wrapper ${variant ? "style-2" : ""}`}>
            <ul className="top-list">
              <li className="top-tagline">
                <i className="fas fa-rocket"></i>
                AI-Powered ERP, DevSecOps &amp; Cloud Solutions for Enterprises
              </li>
              <li className="top-divider">|</li>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:hello@xerxez.com">hello@xerxez.com</a>
              </li>
              <li>
                <i className="fas fa-globe"></i>
                <a href="https://xerxez.com" target="_blank" rel="noreferrer">xerxez.com</a>
              </li>
            </ul>
            <div className="social-icon">
              <a href="https://linkedin.com/company/xerxez" target="_blank" rel="noreferrer" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://twitter.com/xerxez" target="_blank" rel="noreferrer" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://github.com/xerxezai" target="_blank" rel="noreferrer" title="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://instagram.com/xerxez" target="_blank" rel="noreferrer" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={`header-1 ${isSticky ? "sticky" : ""}`}>
        <div className="container">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <Link to="/" className="header-logo1">
                  <Image
                    src="assets/img/logo/black-logo.svg"
                    alt="Xerxez Solutions"
                    width={192}
                    height={42}
                  />
                </Link>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="mean__menu-wrapper d-none d-xl-block">
                  <MainMenuSection />
                </div>
                <div className="link-btn d-none d-xl-flex align-items-center gap-2">
                  <i className="fas fa-envelope" style={{color: "var(--theme-color, #6c57d2)"}}></i>
                  <a href="mailto:hello@xerxez.com" style={{color: "#333", fontWeight: 500}}>hello@xerxez.com</a>
                </div>
                <Link to="/contact" className="theme-btn">
                  Get Started
                  <i className="far fa-arrow-right"></i>
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
