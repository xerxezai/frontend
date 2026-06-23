import MobileMenu from "../header/MobileMenu";
import { Link } from "react-router-dom";
import Image from "../utils/Image";

interface MobileMenuModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const MobileMenuModal = ({ isOpen, toggle }: MobileMenuModalProps) => {
  return (
    <>
      <div className="fix-area d-block d-xl-none">
        <div className={`offcanvas__info ${isOpen ? "info-open" : ""}`}>
          <div className="offcanvas__wrapper overflow-auto">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link to="/" style={{ display: 'inline-block', background: '#fff', borderRadius: 8, padding: '4px 8px' }}>
                    <Image
                      src="assets/img/logo/logo.png"
                      alt="Xerxez Solutions"
                      width={160}
                      height={36}
                    />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button onClick={toggle}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <h3 className="offcanvas-title">Hello There!</h3>
              <p>
                AI-powered ERP, DevSecOps, Cloud &amp; <br /> Software solutions for enterprises.
              </p>
              <MobileMenu />
              <div className="social-icon d-flex align-items-center">
                <a href="https://linkedin.com/company/xerxez" target="_blank" rel="noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://twitter.com/xerxez" target="_blank" rel="noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://github.com/xerxezai" target="_blank" rel="noreferrer">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://instagram.com/xerxez" target="_blank" rel="noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <div className="offcanvas__contact">
                <h3>Information</h3>
                <ul className="contact-list">
                  <li>
                    <span>Headquarters:</span>
                    Global â€” Remote-first
                  </li>
                  <li>
                    <span>Email:</span>
                    <a href="mailto:xerxez.in@gmail.com">xerxez.in@gmail.com</a>
                  </li>
                </ul>
              </div>
              <Link to="/contact" className="theme-btn">
                <span>Get a Quote</span> <i className="far fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay d-block d-xl-none ${
          isOpen ? "overlay-open" : ""
        }`}
        role="button"
        onClick={toggle}
      ></div>
    </>
  );
};

export default MobileMenuModal;




