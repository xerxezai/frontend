// XerxezFooter.tsx
// Purpose: Navy site footer for every /v2 page — trust stats, brand blurb,
//          social links, Services / Link-us / Contact columns, legal bar.
// Used in: layout/XerxezShell.tsx (renders on all 7 /v2 pages)
// Data source: every link, number and contact detail is copied verbatim from
//              the existing site footer (src/components/footer/FooterSection2.tsx).
//              The "Link us" column points at /v2 routes so users stay in the variant.

import { Link } from "react-router-dom";
import { Mail, Phone, Globe, MapPin } from "lucide-react";     // contact-row icons
import Image from "../../utils/Image";                          // base-path-aware <img>
import { T } from "../01-core/v2theme";                            // tokens

// Service links → the /v2 service detail routes.
const SERVICES = [
  { to: "/v2/services/ai-powered-erp",            label: "AI-Powered ERP" },
  { to: "/v2/services/devsecops-mlops-solutions", label: "DevSecOps Pipelines" },
  { to: "/v2/services/cloud-service-storage",     label: "Cloud Infrastructure" },
  { to: "/v2/services/software-development",      label: "Software Development" },
  { to: "/v2/services/ai-training-consulting",    label: "AI Training & Consulting" },
  { to: "/v2/services/quantum-computing",         label: "Quantum Computing" },
  { to: "/v2/services/mobile-application",        label: "Mobile Application" },
  { to: "/v2/services/erp-industries",            label: "ERP Industries" },
];

// Primary nav → /v2 equivalents. "Become a Partner" deep-links to the Partner
// tab on the /v2 contact page, which XerxezContactForm opens off the #partner hash.
const NAV = [
  { to: "/v2",                 label: "Home" },
  { to: "/v2/about",           label: "About Us" },
  { to: "/v2/services",        label: "Services" },
  { to: "/v2/training",        label: "Training" },
  { to: "/v2/portfolio",       label: "Projects" },
  { to: "/v2/contact",         label: "Contact" },
  { to: "/v2/contact#partner", label: "Become a Partner" },
];

// Social links — FontAwesome brand classes (lucide has no brand icons).
const SOCIAL = [
  { href: "https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/", icon: "fab fa-linkedin-in", label: "LinkedIn" },
  { href: "https://github.com/xerxezai", icon: "fab fa-github", label: "GitHub" },
  { href: "mailto:info@xerxez.com", icon: "fas fa-envelope", label: "Email" },
];

// Trust stats shown in the strip at the top of the footer.
const TRUST = [
  { v: "4+",    l: "Client projects delivered" },
  { v: "UAE",   l: "Based & supported" },
  { v: "99.9%", l: "Frontend uptime" },
  { v: "5 yrs", l: "Years in operation" },
];

// Shared style for each column's <h4> heading.
const colHead: React.CSSProperties = {
  fontFamily: T.fontBody, fontSize: 11, fontWeight: 700,
  letterSpacing: "0.18em", textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)", margin: "0 0 18px",
};

// Shared style for every footer link (dim white, brightens on hover via `hov`).
const linkStyle: React.CSSProperties = {
  fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.6,
  color: "rgba(255,255,255,0.62)", textDecoration: "none",
  display: "inline-block",
};
// Spread onto a link to add hover brighten/restore (no state).
const hov = {
  onMouseOver: (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = "#fff"),
  onMouseOut:  (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.62)"),
};

const XerxezFooter = () => (
  <footer style={{ background: T.navy, color: "#fff" }}>
    <div className="container">
      {/* Trust strip — 4 stats, auto-fit grid so they stay evenly spread and wrap on mobile */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 20,
        padding: "32px 0",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
      }}>
        {TRUST.map((t) => (
          <div key={t.l} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            {/* big red number */}
            <span style={{ fontFamily: T.fontHead, fontSize: 26, fontWeight: 800, color: T.red, lineHeight: 1, flexShrink: 0 }}>
              {t.v}
            </span>
            {/* small uppercase label */}
            <span style={{
              fontFamily: T.fontBody, fontSize: 11, fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)", maxWidth: 140, lineHeight: 1.4,
            }}>
              {t.l}
            </span>
          </div>
        ))}
      </div>

      {/* Link columns */}
      <div className="row" style={{ padding: "48px 0 40px", rowGap: 36 }}>
        {/* Column 1 — brand: logo + blurb + socials */}
        <div className="col-lg-4 col-md-12">
          <Link to="/v2" style={{ display: "inline-flex", lineHeight: 0, marginBottom: 18 }}>
            <Image src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" width={190} height={64}
              style={{ height: 56, width: "auto" }} />
          </Link>
          <p style={{
            fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.75,
            color: "rgba(255,255,255,0.55)", maxWidth: 300, margin: "0 0 22px",
          }}>
            Enterprise AI systems — ERP, DevSecOps pipelines, and cloud infrastructure
            for organisations that can't afford downtime.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {SOCIAL.map(({ href, icon, label }) => (
              <a key={label} href={href} aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}   // open web links in a new tab
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.8)", fontSize: 15,
                  transition: "background 160ms ease, border-color 160ms ease",
                }}
                onMouseOver={(e) => {                                     // tint red on hover
                  e.currentTarget.style.background = "rgba(217,53,34,0.16)";
                  e.currentTarget.style.borderColor = "rgba(217,53,34,0.45)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                <i className={icon} />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2 — Services */}
        <div className="col-lg-3 col-md-4 col-6">
          <h4 style={colHead}>Services</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {SERVICES.map((s) => (
              <li key={s.to}><Link to={s.to} style={linkStyle} {...hov}>{s.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Column 3 — primary nav */}
        <div className="col-lg-2 col-md-4 col-6">
          <h4 style={colHead}>Link us</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} style={linkStyle} {...hov}>{n.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Column 4 — contact details (real XERXEZ contact info) */}
        <div className="col-lg-3 col-md-4">
          <h4 style={colHead}>Contact</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Phone size={14} color={T.red} style={{ marginTop: 3, flexShrink: 0 }} />
              <a href="tel:+971567867451" style={linkStyle} {...hov}>+971 56 786 7451</a>
            </li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Mail size={14} color={T.red} style={{ marginTop: 3, flexShrink: 0 }} />
              <a href="mailto:info@xerxez.com" style={linkStyle} {...hov}>info@xerxez.com</a>
            </li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Globe size={14} color={T.red} style={{ marginTop: 3, flexShrink: 0 }} />
              <a href="https://xerxez.com" target="_blank" rel="noreferrer" style={linkStyle} {...hov}>xerxez.com</a>
            </li>
            <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <MapPin size={14} color={T.red} style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ ...linkStyle, color: "rgba(255,255,255,0.55)" }}>
                India &amp; UAE — Remote-first, global delivery
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar — copyright + legal links */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.10)",
        padding: "20px 0",
        display: "flex", flexWrap: "wrap", gap: 12,
        alignItems: "center", justifyContent: "space-between",
      }}>
        <p style={{ fontFamily: T.fontBody, fontSize: 12.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          &copy; {new Date().getFullYear()} XERXEZ. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {/* legal pages have no /v2 variant — link to the real ones */}
          <Link to="/privacy" style={{ ...linkStyle, fontSize: 12.5 }} {...hov}>Privacy Policy</Link>
          <Link to="/terms" style={{ ...linkStyle, fontSize: 12.5 }} {...hov}>Terms of Use</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default XerxezFooter;
