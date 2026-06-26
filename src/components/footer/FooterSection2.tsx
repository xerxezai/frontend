import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

// ── Navy theme tokens (matches FooterSection + FooterBottomSection) ──
const N = {
  bg:      "#1a2744",
  heading: "#ffffff",
  body:    "#8a9bbf",
  link:    "#8a9bbf",
  linkHov: "#c8d4e8",
  icon:    "#6a7fa8",
  divider: "#243460",
  copy:    "#5a6b8a",
};


const linkStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: N.link,
  textDecoration: "none",
  lineHeight: 1.55,
  transition: "color 150ms ease",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: N.heading,
  marginBottom: 16,
  letterSpacing: 0,
};

const hov = {
  onMouseOver: (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.color = N.linkHov),
  onMouseOut:  (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.color = N.link),
};

const FooterSection2 = () => {
  return (
    <footer style={{ background: N.bg }}>
      <div className="container">
        <div className="row gx-5" style={{ padding: "48px 0 36px" }}>

          {/* Col 1 — Wordmark + About */}
          <div className="col-lg-3 col-md-6 col-12 mb-5 mb-lg-0">
            <Link to="/" style={{ display: "inline-block", textDecoration: "none", marginBottom: 20 }}>
              <img
                src="/assets/img/logo/xerxez_logo.png"
                alt="Xerxez Solutions"
                style={{ height: 90, width: "auto", display: "block" }}
              />
            </Link>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              color: N.body,
              marginBottom: 20,
            }}>
              AI-powered enterprise systems — ERP, DevSecOps pipelines,
              and cloud infrastructure that help organisations scale securely.
            </p>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {[
                { href: "https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/", icon: "fab fa-linkedin-in", label: "LinkedIn" },
                { href: "https://github.com/",           icon: "fab fa-github",      label: "GitHub" },
                { href: "mailto:info@xerxez.com",        icon: "fas fa-envelope",   label: "Email" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer" aria-label={label}
                  style={{ color: N.icon, fontSize: 15, transition: "color 150ms ease" }}
                  onMouseOver={e => (e.currentTarget.style.color = N.linkHov)}
                  onMouseOut={e => (e.currentTarget.style.color = N.icon)}
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
                { to: "/service/ai-powered-erp",            label: "AI-Powered ERP" },
                { to: "/service/devsecops-mlops-solutions", label: "DevSecOps Pipelines" },
                { to: "/service/cloud-service-storage",     label: "Cloud Infrastructure" },
                { to: "/service/software-development",      label: "Software Development" },
                { to: "/service/ai-training-consulting",    label: "AI Training & Consulting" },
                { to: "/service/quantum-computing",         label: "Quantum Computing" },
                { to: "/service/mobile-application",        label: "Mobile Application" },
              ].map(({ to, label }) => (
                <li key={to} style={{ marginBottom: 10 }}>
                  <Link to={to} style={linkStyle} {...hov}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Link us */}
          <div className="col-lg-3 col-md-6 col-12 mb-5 mb-lg-0">
            <h4 style={headingStyle}>Link us</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {[
                { to: "/",         label: "Home" },
                { to: "/about",     label: "About Us" },
                { to: "/service",   label: "Services" },
                { to: "/training",  label: "Training" },
                { to: "/blog",      label: "Blog" },
                { to: "/contact",   label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to} style={{ marginBottom: 10 }}>
                  <Link to={to} style={linkStyle} {...hov}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="col-lg-3 col-md-6 col-12">
            <h4 style={headingStyle}>Contact</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {[
                { icon: <Phone size={13} />,  content: <a href="tel:+971567867451"          style={linkStyle} {...hov}>+971 56 786 7451</a> },
                { icon: <Mail size={13} />,  content: <a href="mailto:info@xerxez.com"      style={linkStyle} {...hov}>info@xerxez.com</a> },
                { icon: <Globe size={13} />, content: <a href="https://xerxez.com" target="_blank" rel="noreferrer" style={linkStyle} {...hov}>xerxez.com</a> },
                { icon: <MapPin size={13} style={{ marginTop: 2 }} />, content: <span style={{ ...linkStyle, lineHeight: 1.5 }}>India &amp; UAE — Remote-first, Global delivery</span> },
              ].map(({ icon, content }, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, color: N.icon }}>
                  <span style={{ flexShrink: 0, paddingTop: 1 }}>{icon}</span>
                  {content}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${N.divider}`,
          padding: "18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: N.copy, margin: 0 }}>
            &copy; {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms",   label: "Terms of Use" },
            ].map(({ to, label }) => (
              <Link key={label} to={to} style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: N.copy,
                textDecoration: "none",
              }}
                onMouseOver={e => (e.currentTarget.style.color = N.body)}
                onMouseOut={e => (e.currentTarget.style.color = N.copy)}
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