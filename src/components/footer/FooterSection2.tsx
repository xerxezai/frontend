import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import FooterBottomSection from "./FooterBottomSection";

const FooterSection2 = () => {
  return (
    <section
      className="footer-section fix bg-cover"
      style={{ background: "#F8F7F4" }}
    >
      <div className="container" style={{ paddingRight: "40px" }}>
        <div
          className="footer-widget-wrapper style-2"
          style={{ paddingTop: "60px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr max-content 1fr",
              gap: "40px",
            }}
          >

            {/* Col 1 — About */}
            <div>
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <Link to="/" style={{ display: "block", marginBottom: "12px" }}>
                    <img
                      src="/assets/img/logo/xerxez_logo.png"
                      alt="Xerxez Solutions"
                      style={{ height: "45px", width: "auto", display: "block", background: "transparent", border: "none", boxShadow: "none" }}
                    />
                  </Link>
                  <h3 style={{ color: "#1a1a1a", fontWeight: 600, marginTop: 0 }}>About XERXEZ</h3>
                </div>
                <div className="footer-content">
                  <p style={{ color: "#555555" }}>
                    We build AI-powered enterprise systems — ERP, DevSecOps pipelines,
                    and cloud infrastructure — that help organisations scale securely
                    and grow with confidence.
                  </p>
                  <div className="social-icon">
                    <a href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/" target="_blank" rel="noreferrer" style={{ color: "#444444" }}>
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://github.com/" target="_blank" rel="noreferrer" style={{ color: "#444444" }}>
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="mailto:info@xerxez.com" style={{ color: "#444444" }}>
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2 — Our Services */}
            <div>
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
                <ul className="list-area" style={{ padding: 0, margin: 0, listStyle: "none" }}>
                  <li style={{ marginBottom: "10px" }}><Link to="/service/ai-powered-erp" style={{ color: "#555555" }}>AI-Powered ERP</Link></li>
                  <li style={{ marginBottom: "10px" }}><Link to="/service/devsecops-mlops-solutions" style={{ color: "#555555" }}>DevSecOps Pipelines</Link></li>
                  <li style={{ marginBottom: "10px" }}><Link to="/service/cloud-service-storage" style={{ color: "#555555" }}>Cloud Infrastructure</Link></li>
                  <li style={{ marginBottom: "10px" }}><Link to="/service/software-development" style={{ color: "#555555" }}>Software Development</Link></li>
                  <li style={{ marginBottom: "10px" }}><Link to="/service/ai-training-consulting" style={{ color: "#555555" }}>AI Training &amp; Consulting</Link></li>
                  <li style={{ marginBottom: "10px" }}><Link to="/service/quantum-computing" style={{ color: "#555555" }}>Quantum Computing</Link></li>
                  <li><Link to="/service/mobile-application" style={{ color: "#555555" }}>Mobile Application</Link></li>
                </ul>
              </div>
            </div>

            {/* Col 3 — Quick Links (swapped) */}
            <div>
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="600"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3 style={{ color: "#1a1a1a", fontWeight: 600 }}>Quick Links</h3>
                </div>
                <ul className="list-area" style={{ padding: 0, margin: 0, listStyle: "none" }}>
                  <li style={{ marginBottom: "10px" }}><Link to="/" style={{ color: "#555555" }}>Home</Link></li>
                  <li style={{ marginBottom: "10px" }}><Link to="/about" style={{ color: "#555555" }}>About Us</Link></li>
                  <li style={{ marginBottom: "10px" }}><Link to="/service" style={{ color: "#555555" }}>Services</Link></li>
                  <li style={{ marginBottom: "10px" }}><Link to="/training" style={{ color: "#555555" }}>Training</Link></li>
                  <li><Link to="/contact" style={{ color: "#555555" }}>Contact Us</Link></li>
                </ul>
              </div>
            </div>

            {/* Col 4 — Contact Us (swapped) */}
            <div>
              <div
                className="single-footer-widget"
                data-aos="fade-up"
                data-aos-delay="800"
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div className="widget-head">
                  <h3 style={{ color: "#1a1a1a", fontWeight: 600 }}>Contact Us</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Phone size={16} color="#6B3FA0" style={{ flexShrink: 0 }} />
                    <a href="tel:+971567867451" style={{ color: "#555555", textDecoration: "none", fontSize: 14 }}>+971 56 786 7451</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Mail size={16} color="#6B3FA0" style={{ flexShrink: 0 }} />
                    <a href="mailto:info@xerxez.com" style={{ color: "#555555", textDecoration: "none", fontSize: 14 }}>info@xerxez.com</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Globe size={16} color="#6B3FA0" style={{ flexShrink: 0 }} />
                    <a href="https://xerxez.com" target="_blank" rel="noreferrer" style={{ color: "#555555", textDecoration: "none", fontSize: 14 }}>xerxez.com</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <MapPin size={16} color="#6B3FA0" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: "#555555", fontSize: 14, lineHeight: 1.5 }}>India &amp; UAE — Remote-first, Global delivery</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
      <FooterBottomSection />
    </section>
  );
};

export default FooterSection2;
