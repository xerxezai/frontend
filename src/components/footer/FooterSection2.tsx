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
        {/* Bootstrap row: equal 25% columns on desktop, 50% on tablet, 100% on mobile */}
        <div className="row gx-5" style={{ paddingTop: "48px", paddingBottom: "36px" }}>

          {/* Col 1 — About */}
          <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0">
            <div className="single-footer-widget" style={{ marginTop: 0 }}>
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
                <p style={{ color: "#555555", fontSize: "13px", lineHeight: 1.7, marginBottom: 0 }}>
                  We build AI-powered enterprise systems — ERP, DevSecOps pipelines,
                  and cloud infrastructure — that help organisations scale securely
                  and grow with confidence.
                </p>
                <div style={{ display: "flex", gap: "18px", marginTop: "16px", alignItems: "center" }}>
                  <a
                    href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    style={{ color: "#444444", fontSize: "17px", lineHeight: 1 }}
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    style={{ color: "#444444", fontSize: "17px", lineHeight: 1 }}
                  >
                    <i className="fab fa-github"></i>
                  </a>
                  <a
                    href="mailto:info@xerxez.com"
                    aria-label="Email"
                    style={{ color: "#444444", fontSize: "17px", lineHeight: 1 }}
                  >
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2 — Our Services */}
          <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0">
            <div className="single-footer-widget" style={{ marginTop: 0 }}>
              <div className="widget-head">
                <h3>Our Services</h3>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                {[
                  { to: "/service/ai-powered-erp", label: "AI-Powered ERP" },
                  { to: "/service/devsecops-mlops-solutions", label: "DevSecOps Pipelines" },
                  { to: "/service/cloud-service-storage", label: "Cloud Infrastructure" },
                  { to: "/service/software-development", label: "Software Development" },
                  { to: "/service/ai-training-consulting", label: "AI Training & Consulting" },
                  { to: "/service/quantum-computing", label: "Quantum Computing" },
                  { to: "/service/mobile-application", label: "Mobile Application" },
                ].map((item) => (
                  <li key={item.to} style={{ marginBottom: "8px" }}>
                    <Link
                      to={item.to}
                      style={{ color: "#555555", fontSize: "13px", textDecoration: "none" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3 — Quick Links */}
          <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0">
            <div className="single-footer-widget" style={{ marginTop: 0 }}>
              <div className="widget-head">
                <h3>Quick Links</h3>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About Us" },
                  { to: "/service", label: "Services" },
                  { to: "/training", label: "Training" },
                  { to: "/contact", label: "Contact Us" },
                ].map((item) => (
                  <li key={item.to} style={{ marginBottom: "8px" }}>
                    <Link
                      to={item.to}
                      style={{ color: "#555555", fontSize: "13px", textDecoration: "none" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 4 — Contact Us */}
          <div className="col-lg-3 col-md-6 col-12">
            <div className="single-footer-widget" style={{ marginTop: 0 }}>
              <div className="widget-head">
                <h3>Contact Us</h3>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <Phone size={14} color="#6B3FA0" style={{ flexShrink: 0 }} />
                  <a href="tel:+971567867451" style={{ color: "#555555", fontSize: "13px", textDecoration: "none" }}>
                    +971 56 786 7451
                  </a>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <Mail size={14} color="#6B3FA0" style={{ flexShrink: 0 }} />
                  <a href="mailto:info@xerxez.com" style={{ color: "#555555", fontSize: "13px", textDecoration: "none" }}>
                    info@xerxez.com
                  </a>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <Globe size={14} color="#6B3FA0" style={{ flexShrink: 0 }} />
                  <a href="https://xerxez.com" target="_blank" rel="noreferrer" style={{ color: "#555555", fontSize: "13px", textDecoration: "none" }}>
                    xerxez.com
                  </a>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <MapPin size={14} color="#6B3FA0" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ color: "#555555", fontSize: "13px", lineHeight: 1.5 }}>
                    India &amp; UAE — Remote-first, Global delivery
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      <FooterBottomSection />
    </section>
  );
};

export default FooterSection2;
