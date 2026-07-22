import MobileMenu from "../header/MobileMenu";
import { SIGNIN_OPTIONS } from "../header/SignInDropdown";
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
                  <Link to="/" >
                    <Image
                      src="/assets/img/logo/xerxez_logo.png"
                      alt="Xerxez Solutions"
                      width={180}
                      height={60}
                      style={{ height: '60px', width: 'auto', background: 'transparent', display: 'block', border: 'none', boxShadow: 'none' }}
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
              <div style={{ margin: "20px 0" }}>
                <h3 className="offcanvas-title" style={{ fontSize: 16, marginBottom: 10 }}>Sign In</h3>
                {SIGNIN_OPTIONS.map(opt => (
                  <Link
                    key={opt.to}
                    to={opt.to}
                    onClick={toggle}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "10px 0", textDecoration: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 2,
                      background: "rgba(201,136,58,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#C9883A", fontSize: 14,
                    }}>
                      <i className={opt.icon} />
                    </span>
                    <span>
                      <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#fff" }}>{opt.label}</span>
                      <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{opt.subtitle}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <div className="social-icon d-flex align-items-center">
                <a href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/" target="_blank" rel="noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://github.com/" target="_blank" rel="noreferrer">
                  <i className="fab fa-github"></i>
                </a>
              </div>
              <div className="offcanvas__contact">
                <h3>Information</h3>
                <ul className="contact-list">
                  <li>
                    <span>Headquarters:</span>
                    India &amp; UAE — Remote-first, Global delivery
                  </li>
                  <li>
                    <span>Phone:</span>
                    <a href="tel:+971567867451">+971 56 786 7451</a>
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






