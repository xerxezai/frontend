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
                  <Link to="/">
                    <Image
                      src="assets/img/logo/black-logo.svg"
                      alt="logo-img"
                      width={150}
                      height={52}
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
                Lorem ipsum dolor sit amet, consectetur <br /> adipiscing elit,{" "}
              </p>
              <MobileMenu />
              <div className="social-icon d-flex align-items-center">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <div className="offcanvas__contact">
                <h3>Information</h3>
                <ul className="contact-list">
                  <li>
                    <span>Address:</span>
                    Graaf Floriss 22A CH NY
                  </li>
                  <li>
                    <span>Call Us:</span>
                    <a href="tel:+00012345688">+000 123 456 88</a>
                  </li>
                  <li>
                    <span>Email:</span>
                    <a href="mailto:helloseoz@gmial.com">helloseoz@gmial.com</a>
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
