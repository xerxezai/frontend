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
              <li>
                End of Year Sale: Save up to <b>55%</b> on Tasks
              </li>
              <li>
                <i className="fas fa-phone-alt"></i>
                <a href="tel:+00479394888">+00 (47) 939 4888</a>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:helloseoz@gmial.com">helloseoz@gmial.com</a>
              </li>
            </ul>
            <div className="social-icon">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-dribbble"></i>
              </a>
              <a href="#">
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
                    alt="logo-img"
                    width={135}
                    height={47}
                  />
                </Link>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="mean__menu-wrapper d-none d-xl-block">
                  <MainMenuSection />
                </div>
                <div className="link-btn">
                  Support: <a href="tel:88812345678">(888) 1234-5678</a>
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
