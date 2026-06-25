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
                <Image
                  src="/assets/img/logo/xerxez_logo.png"
                  alt="Xerxez Solutions"
                  width={180}
                  height={45}
                  style={{ height: '45px', width: 'auto', background: 'transparent', display: 'block' }}
                />
              </Link>
            </div>
            <div className="header-right d-flex justify-content-end align-items-center">
              <div className="mean__menu-wrapper d-none d-xl-block">
                <MainMenuSection />
              </div>
              {variant ? (
                <div className="header-button">
                  <Link to="/contact" className="pill-btn">
                    Get Started
                    <span className="btn-arrow">
                      <i className="far fa-arrow-right"></i>
                    </span>
                  </Link>
                </div>
              ) : (
                <Link to="/contact" className="pill-btn">
                  Get Started
                  <span className="btn-arrow">
                    <i className="far fa-arrow-right"></i>
                  </span>
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


