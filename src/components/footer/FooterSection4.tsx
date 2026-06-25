import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import FooterBottomSection from "./FooterBottomSection";

const FooterSection4 = () => {
  return (
    <section className="footer-section fix">
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
                      style={{ height: "60px", width: "auto", marginBottom: "16px", display: "block", background: "transparent", border: "none", boxShadow: "none" }}
                    />
                  </Link>
                  <h3>About XERXEZ</h3>
                </div>
                <div className="footer-content">
                  <p>
                    XERXEZ delivers AI-powered ERP, cloud infrastructure, and DevSecOps
                    solutions that transform how enterprises operate at scale.
                  </p>
                  <div className="social-icon">
                    <a href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/" target="_blank" rel="noreferrer">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://github.com/" target="_blank" rel="noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://instagram.com/xerxez" target="_blank" rel="noreferrer">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2 — Our Services (7) */}
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
                  <h3>Our Services</h3>
                </div>
                <ul className="list-area">
                  <li><Link to="/service/ai-powered-erp">AI-Powered ERP</Link></li>
                  <li><Link to="/service/devsecops-mlops-solutions">DevSecOps Pipelines</Link></li>
                  <li><Link to="/service/cloud-service-storage">Cloud Infrastructure</Link></li>
                  <li><Link to="/service/software-development">Software Development</Link></li>
                  <li><Link to="/service/ai-training-consulting">AI Training &amp; Consulting</Link></li>
                  <li><Link to="/service/quantum-computing">Quantum Computing</Link></li>
                  <li><Link to="/service/mobile-application">Mobile Application</Link></li>
                </ul>
              </div>
            </div>

            {/* Col 3 — Quick Links */}
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
                  <h3>Quick Links</h3>
                </div>
                <ul className="list-area">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/service">Services</Link></li>
                  <li><Link to="/training">Training</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>
            </div>

            {/* Col 4 — Contact Us */}
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
                  <h3>Contact Us</h3>
                </div>
                <ul className="footer-contect" style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "left" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Phone size={16} color="#6B3FA0" style={{ flexShrink: 0 }} />
                    <a href="tel:+971567867451" style={{ color: "#aaa", textDecoration: "none", fontSize: 14 }}>+971 56 786 7451</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Mail size={16} color="#6B3FA0" style={{ flexShrink: 0 }} />
                    <a href="mailto:info@xerxez.com" style={{ color: "#aaa", textDecoration: "none", fontSize: 14 }}>info@xerxez.com</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Globe size={16} color="#6B3FA0" style={{ flexShrink: 0 }} />
                    <a href="https://xerxez.com" style={{ color: "#aaa", textDecoration: "none", fontSize: 14 }}>xerxez.com</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <MapPin size={16} color="#6B3FA0" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "#aaa", fontSize: 14, lineHeight: 1.5 }}>India &amp; UAE — Remote-first, Global delivery</span>
                  </li>
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
