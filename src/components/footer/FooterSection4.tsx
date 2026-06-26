import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import FooterBottomSection from "./FooterBottomSection";

const FooterSection4 = () => {
  return (
    <section
      className="footer-section fix"
      style={{ background: "#F8F7F4" }}
    >
      <div className="container">
        <div className="footer-widget-wrapper">
          <div className="row">

            {/* Col 1 — About */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <Link to="/">
                    <img
                      src="/assets/img/logo/xerxez_logo.png"
                      alt="Xerxez Solutions"
                      style={{ height: "45px", width: "auto", marginBottom: "12px", display: "block", background: "transparent", border: "none", boxShadow: "none" }}
                    />
                  </Link>
                  <h3 style={{ color: "#1a1a1a", fontWeight: 600 }}>About XERXEZ</h3>
                </div>
                <div className="footer-content">
                  <p style={{ color: "#555555" }}>
                    XERXEZ delivers AI-powered ERP, cloud infrastructure, and DevSecOps
                    solutions that transform how enterprises operate at scale.
                  </p>
                  <div className="social-icon">
                    <a href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/" target="_blank" rel="noreferrer" style={{ color: "#444444" }}>
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://github.com/" target="_blank" rel="noreferrer" style={{ color: "#444444" }}>
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://instagram.com/xerxez" target="_blank" rel="noreferrer" style={{ color: "#444444" }}>
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2 — Our Services */}
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="400"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3 style={{ color: "#1a1a1a", fontWeight: 600 }}>Our Services</h3>
                </div>
                <ul className="list-area">
                  <li><Link to="/service/ai-powered-erp" style={{ color: "#444444" }}>AI-Powered ERP</Link></li>
                  <li><Link to="/service/devsecops-mlops-solutions" style={{ color: "#444444" }}>DevSecOps Pipelines</Link></li>
                  <li><Link to="/service/cloud-service-storage" style={{ color: "#444444" }}>Cloud Infrastructure</Link></li>
                  <li><Link to="/service/software-development" style={{ color: "#444444" }}>Software Development</Link></li>
                  <li><Link to="/service/ai-training-consulting" style={{ color: "#444444" }}>AI Training &amp; Consulting</Link></li>
                  <li><Link to="/service/quantum-computing" style={{ color: "#444444" }}>Quantum Computing</Link></li>
                  <li><Link to="/service/mobile-application" style={{ color: "#444444" }}>Mobile Application</Link></li>
                </ul>
              </div>
            </div>

            {/* Col 3 — Contact Us */}
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="600"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3 style={{ color: "#1a1a1a", fontWeight: 600 }}>Contact Us</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Phone size={16} color="#B47428" style={{ flexShrink: 0 }} />
                    <a href="tel:+971567867451" style={{ color: "#444444", textDecoration: "none", fontSize: 14 }}>+971 56 786 7451</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Mail size={16} color="#B47428" style={{ flexShrink: 0 }} />
                    <a href="mailto:info@xerxez.com" style={{ color: "#444444", textDecoration: "none", fontSize: 14 }}>info@xerxez.com</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Globe size={16} color="#B47428" style={{ flexShrink: 0 }} />
                    <a href="https://xerxez.com" target="_blank" rel="noreferrer" style={{ color: "#444444", textDecoration: "none", fontSize: 14 }}>xerxez.com</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <MapPin size={16} color="#B47428" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "#555555", fontSize: 14, lineHeight: 1.5 }}>India &amp; UAE — Remote-first, Global delivery</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Col 4 — Quick Links */}
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-2">
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="800"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3 style={{ color: "#1a1a1a", fontWeight: 600 }}>Quick Links</h3>
                </div>
                <ul className="list-area">
                  <li><Link to="/" style={{ color: "#444444" }}>Home</Link></li>
                  <li><Link to="/about" style={{ color: "#444444" }}>About Us</Link></li>
                  <li><Link to="/service" style={{ color: "#444444" }}>Services</Link></li>
                  <li><Link to="/training" style={{ color: "#444444" }}>Training</Link></li>
                  <li><Link to="/contact" style={{ color: "#444444" }}>Contact Us</Link></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
      <FooterBottomSection variant />
    </section>
  );
};

export default FooterSection4;

