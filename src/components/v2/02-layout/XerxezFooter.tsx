// XerxezFooter.tsx
// Purpose: Navy site footer for every /v2 page — 5-column layout (brand,
//          Services, IoT Solutions, Industries, Company) plus a legal bar,
//          matching etiot.in's footer structure.
// Used in: layout/XerxezShell.tsx (renders on all 7 /v2 pages)
// Data source: every link is a real, registered /v2 route (verified against
//              App.tsx) — nothing invented. The old trust-stats strip was
//              dropped to make room for the 5th column within the same
//              overall footer height (etiot.in's footer has no stats strip
//              either — those numbers already live in the hero).

import { Link } from "react-router-dom";
import Image from "../../utils/Image";                          // base-path-aware <img>
import { T } from "../01-core/v2theme";                            // tokens

// Column 2 — Services → the /v2 service detail routes.
const SERVICES = [
  { to: "/services/ai-powered-erp",            label: "AI-Powered ERP" },
  { to: "/services/devsecops-mlops-solutions", label: "DevSecOps Pipelines" },
  { to: "/services/cloud-service-storage",     label: "Cloud Infrastructure" },
  { to: "/services/software-development",      label: "Software Development" },
  { to: "/services/ai-training-consulting",    label: "AI Training & Consulting" },
  { to: "/services/mobile-application",        label: "Mobile Application" },
  { to: "/services/software-consulting",       label: "Software Consulting" },
];

// Column 3 — IoT Solutions → the /v2 IoT detail routes.
const IOT = [
  { to: "/iot/smart-asset-tracking",        label: "Smart Asset Tracking" },
  { to: "/iot/industrial-iot",              label: "Industrial IoT" },
  { to: "/iot/smart-building-solutions",    label: "Smart Building" },
  { to: "/iot/fleet-management-systems",    label: "Fleet Management" },
  { to: "/iot/agriculture-iot",             label: "Agriculture IoT" },
  { to: "/iot/healthcare-iot",              label: "Healthcare IoT" },
  { to: "/iot/smart-retail",                label: "Smart Retail" },
];

// Column 4 — Industries → the /v2 industry detail routes.
const INDUSTRIES = [
  { to: "/industries/epc-engineering",     label: "EPC & Engineering" },
  { to: "/industries/oil-gas",             label: "Oil & Gas" },
  { to: "/industries/construction",        label: "Construction" },
  { to: "/industries/manufacturing",       label: "Manufacturing" },
  { to: "/industries/facility-management", label: "Facility Management" },
  { to: "/industries/healthcare",          label: "Healthcare" },
];

// Column 5 — Company.
const COMPANY = [
  { to: "/",                 label: "Home" },
  { to: "/about",           label: "About Us" },
  { to: "/portfolio",       label: "Portfolio" },
  { to: "/training",        label: "AI Training" },
  { to: "/careers",         label: "Careers" },
  { to: "/contact",         label: "Contact" },
  { to: "/partner/training",   label: "Become a Partner" },
];

// Social links — FontAwesome brand classes (lucide has no brand icons).
const SOCIAL = [
  { href: "https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/", icon: "fab fa-linkedin-in", label: "LinkedIn" },
  { href: "https://github.com/xerxezai", icon: "fab fa-github", label: "GitHub" },
  { href: "mailto:info@xerxez.com", icon: "fas fa-envelope", label: "Email" },
];

// Shared style for each column's <h4> heading.
const colHead: React.CSSProperties = {
  fontFamily: T.fontBody, fontSize: 11, fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: "#ffffff", margin: "0 0 16px",
};

// Shared style for every footer link (dim white, brightens on hover via `hov`).
const linkStyle: React.CSSProperties = {
  fontFamily: T.fontBody, fontSize: 13, lineHeight: 1.5,
  color: "rgba(255,255,255,0.65)", textDecoration: "none",
  display: "inline-block",
};
// Spread onto a link to add hover brighten/restore (no state).
const hov = {
  onMouseOver: (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = "#fff"),
  onMouseOut:  (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)"),
};

// One link column — heading + a tight (6px gap) list of links.
const LinkColumn = ({ heading, items }: { heading: string; items: { to: string; label: string }[] }) => (
  <div className="col-lg-2 col-md-4 col-6">
    <h4 style={colHead}>{heading}</h4>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
      {items.map((it) => (
        <li key={it.to}><Link to={it.to} style={linkStyle} {...hov}>{it.label}</Link></li>
      ))}
    </ul>
  </div>
);

const XerxezFooter = () => (
  <footer style={{ background: T.navy, color: "#fff", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
    <div className="container">
      {/* 5-column layout: brand (col-lg-4) + 4 link columns (col-lg-2 each = 8) */}
      <div className="row" style={{ padding: "48px 0 40px", rowGap: 32 }}>
        {/* Column 1 — logo + about + socials + location */}
        <div className="col-lg-4 col-md-12">
          {/* logo — unchanged, exact same markup/size as before */}
          <Link to="/" style={{ display: "inline-flex", lineHeight: 0, marginBottom: 18 }}>
            <Image src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" width={190} height={64}
              style={{ height: 90, width: "auto" }} />
          </Link>
          <p style={{
            fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.65,
            color: "rgba(255,255,255,0.55)", maxWidth: 300, margin: "0 0 18px",
          }}>
            AI-powered ERP, IoT solutions, DevSecOps and cloud infrastructure — built for
            engineering and industrial enterprises in UAE &amp; India.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {SOCIAL.map(({ href, icon, label }) => (
              <a key={label} href={href} aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}   // open web links in a new tab
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: T.navy2,
                  color: "#ffffff", fontSize: 13.5,
                  transition: "background 160ms ease",
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = T.red; }}   // red tile on hover
                onMouseOut={(e) => { e.currentTarget.style.background = T.navy2; }}
              >
                <i className={icon} />
              </a>
            ))}
          </div>
          <p style={{
            fontFamily: T.fontBody, fontSize: 12.5,
            color: "rgba(255,255,255,0.45)", margin: 0,
          }}>
            Abu Dhabi, UAE &amp; India
          </p>
        </div>

        <LinkColumn heading="Services" items={SERVICES} />
        <LinkColumn heading="IoT Solutions" items={IOT} />
        <LinkColumn heading="Industries" items={INDUSTRIES} />
        <LinkColumn heading="Company" items={COMPANY} />
      </div>

      {/* Bottom bar — copyright + legal links */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.10)",
        padding: "16px 0",
        display: "flex", flexWrap: "wrap", gap: 12,
        alignItems: "center", justifyContent: "space-between",
      }}>
        <p style={{ fontFamily: T.fontBody, fontSize: 12.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          &copy; {new Date().getFullYear()} XERXEZ. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          <Link to="/privacy-policy" style={{ ...linkStyle, fontSize: 12.5 }} {...hov}>Privacy Policy</Link>
          <Link to="/terms-of-use" style={{ ...linkStyle, fontSize: 12.5 }} {...hov}>Terms of Use</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default XerxezFooter;
