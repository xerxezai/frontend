import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

const SpikeMark = () => (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <line x1="7" y1="0" x2="7" y2="14" stroke="#faf9f5" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="0" y1="7" x2="14" y2="7" stroke="#faf9f5" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="2.05" y1="2.05" x2="11.95" y2="11.95" stroke="#faf9f5" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="11.95" y1="2.05" x2="2.05" y2="11.95" stroke="#faf9f5" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const linkStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: "#a09d96",
  textDecoration: "none",
  lineHeight: 1.55,
  transition: "color 150ms ease",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: "#faf9f5",
  marginBottom: 16,
  letterSpacing: 0,
};

const FooterSection2 = () => {
  return (
    <footer style={{ background: "#181715" }}>
      <div className="container">
        <div className="row gx-5" style={{ padding: "64px 0 48px" }}>

          {/* Col 1 — Wordmark + About */}
          <div className="col-lg-3 col-md-6 col-12 mb-5 mb-lg-0">
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 16 }}>
              <SpikeMark />
              <span style={{
                fontFamily: "'Cormorant Garamond', Garamond, serif",
                fontSize: 20,
                fontWeight: 400,
                color: "#faf9f5",
                letterSpacing: "-0.01em",
              }}>
                XERXEZ
              </span>
            </Link>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#a09d96",
              marginBottom: 20,
            }}>
              AI-powered enterprise systems — ERP, DevSecOps pipelines,
              and cloud infrastructure that help organisations scale securely.
            </p>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {[
                { href: "https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/", icon: "fab fa-linkedin-in", label: "LinkedIn" },
                { href: "https://github.com/", icon: "fab fa-github", label: "GitHub" },
                { href: "mailto:info@xerxez.com", icon: "fas fa-envelope", label: "Email" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer" aria-label={label}
                  style={{ color: "#6c6a64", fontSize: 15, transition: "color 150ms ease" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#faf9f5")}
                  onMouseOut={e => (e.currentTarget.style.color = "#6c6a64")}
                >
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Services */}
          <div className="col-lg-3 col-md-6 col-12 mb-5 mb-lg-0">
            <h4 style={headingStyle}>Services</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {[
                { to: "/service/ai-powered-erp", label: "AI-Powered ERP" },
                { to: "/service/devsecops-mlops-solutions", label: "DevSecOps Pipelines" },
                { to: "/service/cloud-service-storage", label: "Cloud Infrastructure" },
                { to: "/service/software-development", label: "Software Development" },
                { to: "/service/ai-training-consulting", label: "AI Training & Consulting" },
                { to: "/service/quantum-computing", label: "Quantum Computing" },
                { to: "/service/mobile-application", label: "Mobile Application" },
              ].map(({ to, label }) => (
                <li key={to} style={{ marginBottom: 10 }}>
                  <Link to={to} style={linkStyle}
                    onMouseOver={e => (e.currentTarget.style.color = "#faf9f5")}
                    onMouseOut={e => (e.currentTarget.style.color = "#a09d96")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div className="col-lg-3 col-md-6 col-12 mb-5 mb-lg-0">
            <h4 style={headingStyle}>Company</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/service", label: "Services" },
                { to: "/training", label: "Training" },
                { to: "/blog", label: "Blog" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to} style={{ marginBottom: 10 }}>
                  <Link to={to} style={linkStyle}
                    onMouseOver={e => (e.currentTarget.style.color = "#faf9f5")}
                    onMouseOut={e => (e.currentTarget.style.color = "#a09d96")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="col-lg-3 col-md-6 col-12">
            <h4 style={headingStyle}>Contact</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {[
                { icon: <Phone size={13} />, content: <a href="tel:+971567867451" style={linkStyle} onMouseOver={e => (e.currentTarget.style.color = "#faf9f5")} onMouseOut={e => (e.currentTarget.style.color = "#a09d96")}>+971 56 786 7451</a> },
                { icon: <Mail size={13} />, content: <a href="mailto:info@xerxez.com" style={linkStyle} onMouseOver={e => (e.currentTarget.style.color = "#faf9f5")} onMouseOut={e => (e.currentTarget.style.color = "#a09d96")}>info@xerxez.com</a> },
                { icon: <Globe size={13} />, content: <a href="https://xerxez.com" target="_blank" rel="noreferrer" style={linkStyle} onMouseOver={e => (e.currentTarget.style.color = "#faf9f5")} onMouseOut={e => (e.currentTarget.style.color = "#a09d96")}>xerxez.com</a> },
                { icon: <MapPin size={13} style={{ marginTop: 2 }} />, content: <span style={{ ...linkStyle, lineHeight: 1.5 }}>India &amp; UAE — Remote-first, Global delivery</span> },
              ].map(({ icon, content }, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, color: "#6c6a64" }}>
                  <span style={{ flexShrink: 0, paddingTop: 1 }}>{icon}</span>
                  {content}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(250,249,245,0.08)",
          padding: "20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "#6c6a64",
            margin: 0,
          }}>
            &copy; {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { to: "/contact", label: "Privacy Policy" },
              { to: "/contact", label: "Terms of Use" },
            ].map(({ to, label }) => (
              <Link key={label} to={to} style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#6c6a64",
                textDecoration: "none",
              }}
                onMouseOver={e => (e.currentTarget.style.color = "#a09d96")}
                onMouseOut={e => (e.currentTarget.style.color = "#6c6a64")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection2;
