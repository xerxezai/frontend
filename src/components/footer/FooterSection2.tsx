import { Link } from "react-router-dom";
import Image from "../utils/Image";

const FooterSection2 = () => {
  return (
    <footer className="xerxez-footer">
      <div className="container">
        <div className="xerxez-footer__main">
          {/* Logo + Social */}
          <div className="xerxez-footer__brand">
            <Link to="/">
              <Image
                src="assets/img/logo/white-logo.svg"
                alt="XERXEZ"
                width={148}
                height={34}
              />
            </Link>
            <div className="xerxez-footer__social">
              <a href="https://linkedin.com/company/xerxez" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://twitter.com/xerxezai" target="_blank" rel="noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://github.com/xerxezai" target="_blank" rel="noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://instagram.com/xerxez" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Nav links */}
          <nav className="xerxez-footer__nav">
            <div className="xerxez-footer__nav-primary">
              <Link to="/" className="xerxez-footer__link">Home</Link>
              <Link to="/about" className="xerxez-footer__link">About</Link>
              <Link to="/service" className="xerxez-footer__link">Services</Link>
              <Link to="/service/ai-training" className="xerxez-footer__link">Training</Link>
              <Link to="/contact" className="xerxez-footer__link">Contact Us</Link>
            </div>
            <div className="xerxez-footer__nav-secondary">
              <Link to="/contact" className="xerxez-footer__link-sm">Privacy Policy</Link>
              <Link to="/contact" className="xerxez-footer__link-sm">Terms of Use</Link>
            </div>
          </nav>
        </div>

        <div className="xerxez-footer__divider" />

        <div className="xerxez-footer__bottom">
          <p>© 2026 XERXEZ. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection2;
