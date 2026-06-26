import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import FooterBottomSection from "./FooterBottomSection";

const FooterSection2 = () => {
  return (
    <section
      className="footer-section fix bg-cover"
      style={{ background: "#F8F7F4" }}
    >
      <div className="container">
        <div className="xerxez-footer-grid">

          {/* Col 1 — About */}
          <div
            className="single-footer-widget"
            data-aos="fade-up"
            data-aos-delay="0"
            data-aos-duration="800"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <div className="widget-head">
              <Link to="/" style={{ display: "block", marginBottom: "14px" }}>
                <img
                  src="/assets/img/logo/xerxez_logo.png"
                  alt="Xerxez Solutions"
                  style={{ height: "56px", width: "auto", display: "block" }}
                />
              </Link>
              <h3>About XERXEZ</h3>
            </div>
            <div className="footer-content">
              <p style={{ color: "#555555", fontSize: 13, lineHeight: 1.7 }}>
                We build AI-powered enterprise systems — ERP, DevSecOps pipelines,
                and cloud infrastructure — that help organisations scale securely
                and grow with confidence.
              </p>
              <div className="social-icon" style={{ display: "flex", gap: 16, marginTop: 16, alignItems: "center" }}>
                <a
                  href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a href="mailto:info@xerxez.com" aria-label="Email">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2 — Our Services */}
          <div
            className="single-footer-widget"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="800"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <div className="widget-head">
              <h3>Our Services</h3>
            </div>
            <ul className="list-area" style={{ padding: 0, margin: 0, listStyle: "none" }}>
              <li><Link to="/service/ai-powered-erp">AI-Powered ERP</Link></li>
              <li><Link to="/service/devsecops-mlops-solutions">DevSecOps Pipelines</Link></li>
              <li><Link to="/service/cloud-service-storage">Cloud Infrastructure</Link></li>
              <li><Link to="/service/software-development">Software Development</Link></li>
              <li><Link to="/service/ai-training-consulting">AI Training &amp; Consulting</Link></li>
              <li><Link to="/service/quantum-computing">Quantum Computing</Link></li>
              <li><Link to="/service/mobile-application">Mobile Application</Link></li>
            </ul>
          </div>

          {/* Col 3 — Quick Links */}
          <div
            className="single-footer-widget"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <div className="widget-head">
              <h3>Quick Links</h3>
            </div>
            <ul className="list-area" style={{ padding: 0, margin: 0, listStyle: "none" }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/service">Services</Link></li>
              <li><Link to="/training">Training</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 4 — Contact Us */}
          <div
            className="single-footer-widget"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="800"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <div className="widget-head">
              <h3>Contact Us</h3>
            </div>
            <ul className="footer-contact-list">
              <li>
                <Phone size={14} color="#6B3FA0" />
                <a href="tel:+971567867451">+971 56 786 7451</a>
              </li>
              <li>
                <Mail size={14} color="#6B3FA0" />
                <a href="mailto:info@xerxez.com">info@xerxez.com</a>
              </li>
              <li>
                <Globe size={14} color="#6B3FA0" />
                <a href="https://xerxez.com" target="_blank" rel="noreferrer">xerxez.com</a>
              </li>
              <li style={{ alignItems: "flex-start" }}>
                <MapPin size={14} color="#6B3FA0" style={{ marginTop: 2, flexShrink: 0 }} />
                <span>India &amp; UAE — Remote-first, Global delivery</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <FooterBottomSection />
    </section>
  );
};

export default FooterSection2;
