import { useEffect, useState } from "react";
import MainMenuSection from "./MainMenuSection";
import { useCustomContext } from "../../context/context";
import { Link } from "react-router-dom";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
}
const HeaderSection = ({ variant }: Props) => {
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
    <header
      className={`header-section header-1 ${variant ? "header-4" : ""} ${
        isSticky ? "sticky" : ""
      }`}
    >
      <div className="container">
        <div className="mega-menu-wrapper">
          <div className="header-main">
            <div className="header-left">
              <Link to="/" className="header-logo1">
                {isSticky && !variant ? (
                  <Image
                    src="assets/img/logo/logo.png"
                    alt="Xerxez Solutions"
                    width={150}
                    height={36}
                  />
                ) : (
                  <Image
                    src="assets/img/logo/white-logo.svg"
                    alt="Xerxez Solutions"
                    width={150}
                    height={36}
                  />
                )}
              </Link>
            </div>
            <div className="header-right d-flex justify-content-end align-items-center">
              <div className="mean__menu-wrapper d-none d-xl-block">
                <MainMenuSection />
              </div>
              {!variant && (
                <div className="link-btn d-none d-xl-flex align-items-center gap-2">
                  <i className="fas fa-envelope" style={{color: "var(--theme-color, #6c57d2)"}}></i>
                  <a href="mailto:info@xerxez.com" style={{color: "#333", fontWeight: 500, textTransform: "none" as const}}>info@xerxez.com</a>
                </div>
              )}
              {variant ? (
                <div className="header-button">
                  <Link to="/contact" className="theme-btn">
                    Get Started
                    <i className="far fa-arrow-right"></i>
                  </Link>
                </div>
              ) : (
                <Link to="/contact" className="theme-btn">
                  Get Started
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}

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
    </header>
  );
};

export default HeaderSection;


