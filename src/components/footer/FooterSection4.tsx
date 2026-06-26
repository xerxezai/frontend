import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import FooterBottomSection from "./FooterBottomSection";

// ── Navy theme tokens (shared across all footer variants) ──
const N = {
  bg:      "#1a2744",
  heading: "#ffffff",
  body:    "#8a9bbf",
  link:    "#8a9bbf",
  linkHov: "#c8d4e8",
  icon:    "#6a7fa8",
};

const hov = {
  onMouseOver: (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.color = N.linkHov),
  onMouseOut: (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.color = N.link),
};

const FooterSection4 = () => {
  return (
    <section
      className="footer-section fix"
      style={{ background: N.bg }}
    >
      <div className="container">
        <div className="footer-widget-wrapper">
          <div className="row">

            {/* Col 1 — About */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="single-footer-widget"
                data-aos="fade-up" data-aos-delay="200"
                data-aos-duration="1000" data-aos-once="true"
              >
                <div className="widget-head">
                  <Link to="/">
                    <img
                      src="/assets/img/logo/xerxez_logo.png"
                      alt="Xerxez Solutions"
                      style={{ height: "45px", width: "auto", marginBottom: "12px", display: "block" }}
                    />
                  </Link>
                  <h3 style={{ color: N.heading, fontWeight: 600 }}>About XERXEZ</h3>
                </div>
                <div className="footer-content">
                  <p style={{ color: N.body }}>
                    XERXEZ delivers AI-powered ERP, cloud infrastructure, and DevSecOps
                    solutions that transform how enterprises operate at scale.
                  </p>
                  <div className="social-icon">
                    {[
                      { href: "https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/", icon: "fab fa-linkedin-in", label: "LinkedIn" },
                      { href: "https://github.com/",         icon: "fab fa-github",      label: "GitHub" },
                      { href: "https://instagram.com/xerxez", icon: "fab fa-instagram",  label: "Instagram" },
                    ].map(({ href, icon, label }) => (
                      <a key={label} href={href}
                        target="_blank" rel="noreferrer" aria-label={label}
                        style={{ color: N.icon, transition: "color 150ms ease" }}
                        onMouseOver={e => (e.currentTarget.style.color = N.linkHov)}
                        onMouseOut={e => (e.currentTarget.style.color = N.icon)}
                      >
                        <i className={icon} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2 — Our Services */}
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5">
              <div
                className="single-footer-widget"
                data-aos="fade-up" data-aos-delay="400"
                data-aos-duration="1000" data-aos-once="true"
              >
                <div className="widget-head">
                  <h3 style={{ color: N.heading, fontWeight: 600 }}>Our Services</h3>
                </div>
                <ul className="list-area">
                  {[
                    { to: "/service/ai-powered-erp",            label: "AI-Powered ERP" },
                    { to: "/service/devsecops-mlops-solutions", label: "DevSecOps Pipelines" },
                    { to: "/service/cloud-service-storage",     label: "Cloud Infrastructure" },
                    { to: "/service/software-development",      label: "Software Development" },
                    { to: "/service/ai-training-consulting",    label: "AI Training & Consulting" },
                    { to: "/service/quantum-computing",         label: "Quantum Computing" },
                    { to: "/service/mobile-application",        label: "Mobile Application" },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} style={{ color: N.link }} {...hov}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Col 3 — Contact Us */}
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5">
              <div
                className="single-footer-widget"
                data-aos="fade-up" data-aos-delay="600"
                data-aos-duration="1000" data-aos-once="true"
              >
                <div className="widget-head">
                  <h3 style={{ color: N.heading, fontWeight: 600 }}>Contact Us</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Phone size={16} color={N.icon} style={{ flexShrink: 0 }} />
                    <a href="tel:+971567867451"
                      style={{ color: N.link, textDecoration: "none", fontSize: 14 }}
                      {...hov}>+971 56 786 7451</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Mail size={16} color={N.icon} style={{ flexShrink: 0 }} />
                    <a href="mailto:info@xerxez.com"
                      style={{ color: N.link, textDecoration: "none", fontSize: 14 }}
                      {...hov}>info@xerxez.com</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Globe size={16} color={N.icon} style={{ flexShrink: 0 }} />
                    <a href="https://xerxez.com"
                      target="_blank" rel="noreferrer"
                      style={{ color: N.link, textDecoration: "none", fontSize: 14 }}
                      {...hov}>xerxez.com</a>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <MapPin size={16} color={N.icon} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: N.body, fontSize: 14, lineHeight: 1.5 }}>
                      India &amp; UAE — Remote-first, Global delivery
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Col 4 — Quick Links */}
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-2">
              <div
                className="single-footer-widget"
                data-aos="fade-up" data-aos-delay="800"
                data-aos-duration="1000" data-aos-once="true"
              >
                <div className="widget-head">
                  <h3 style={{ color: N.heading, fontWeight: 600 }}>Quick Links</h3>
                </div>
                <ul className="list-area">
                  {[
                    { to: "/",        label: "Home" },
                    { to: "/about",    label: "About Us" },
                    { to: "/service",  label: "Services" },
                    { to: "/training", label: "Training" },
                    { to: "/contact",  label: "Contact Us" },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} style={{ color: N.link }} {...hov}>
                        {label}
                      </Link>
                    </li>
                  ))}
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