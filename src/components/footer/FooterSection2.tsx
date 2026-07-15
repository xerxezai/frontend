import { Link } from "react-router-dom";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

const OG  = "#C9883A";
const C2  = "#cc785c";
const BG  = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const DIV = "rgba(255,255,255,0.07)";

const TRUST = [
  { val: "50+",   label: "Enterprise\nClients"    },
  { val: "5+",    label: "Countries\nServed"      },
  { val: "99.8%", label: "Platform\nUptime"       },
  { val: "5 yrs", label: "Years in\nOperation"    },
];

const SERVICES = [
  { to: "/service/ai-powered-erp",            label: "AI-Powered ERP"           },
  { to: "/service/devsecops-mlops-solutions", label: "DevSecOps Pipelines"      },
  { to: "/service/cloud-service-storage",     label: "Cloud Infrastructure"     },
  { to: "/service/software-development",      label: "Software Development"     },
  { to: "/service/ai-training-consulting",    label: "AI Training & Consulting"  },
  { to: "/service/quantum-computing",         label: "Quantum Computing"        },
  { to: "/service/mobile-application",        label: "Mobile Application"       },
  { to: "/erp-industries",                    label: "ERP Industries"           },
];

const NAV = [
  { to: "/",         label: "Home"     },
  { to: "/about",    label: "About Us" },
  { to: "/service",  label: "Services" },
  { to: "/training", label: "Training" },
  { to: "/project",  label: "Projects" },
  { to: "/contact",  label: "Contact"  },
];

const SOCIAL = [
  { href: "https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/", icon: "fab fa-linkedin-in", label: "LinkedIn" },
  { href: "https://github.com/xerxezai",                                                    icon: "fab fa-github",      label: "GitHub"   },
  { href: "mailto:info@xerxez.com",                                                        icon: "fas fa-envelope",    label: "Email"    },
];

const colHead: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10, fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: OG, marginBottom: 20,
};

const linkBase: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  color: "rgba(255,255,255,0.50)",
  textDecoration: "none",
  lineHeight: 1.55,
  transition: "color 150ms ease",
  display: "block",
};

const linkHov = {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = OG),
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.50)"),
};

const FooterSection2 = () => (
  <>
    <style>{`
      /* ── Trust strip ── */
      .xz-footer-trust {
        display: flex;
        align-items: stretch;
        border-bottom: 1px solid ${DIV};
        padding: 28px 0;
      }
      .xz-footer-trust-item {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 0 32px;
        border-left: 1px solid ${DIV};
      }
      .xz-footer-trust-item:first-child { border-left: none; }

      /* ── Main link grid ── */
      .xz-footer-grid {
        display: grid;
        grid-template-columns: 260px 200px 140px 1fr;
        gap: 72px;
        align-items: start;
        padding: 52px 0 44px;
      }

      /* ── Tablet ── */
      @media (max-width: 1100px) {
        .xz-footer-grid { gap: 48px; }
      }
      @media (max-width: 991px) {
        .xz-footer-trust-item:nth-child(n+3) { display: none; }
        .xz-footer-grid {
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          padding: 44px 0 32px;
        }
      }
      @media (max-width: 575px) {
        .xz-footer-trust { display: none; }
        .xz-footer-grid {
          grid-template-columns: 1fr;
          gap: 32px;
          padding: 36px 0 24px;
        }
      }
    `}</style>

    <footer style={{ background: BG }}>
      <div className="container">

        {/* ── Trust strip ─────────────────────────────────── */}
        <div className="xz-footer-trust">
          {TRUST.map((t, i) => (
            <div key={i} className="xz-footer-trust-item">
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30, fontWeight: 700,
                color: OG, lineHeight: 1,
                letterSpacing: "-0.02em",
                flexShrink: 0,
              }}>
                {t.val}
              </span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10, fontWeight: 600,
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                lineHeight: 1.45,
                whiteSpace: "pre-line",
              }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Main grid ───────────────────────────────────── */}
        <div className="xz-footer-grid">

          {/* Col 1 — Brand */}
          <div>
            <Link to="/" style={{ display: "inline-block", textDecoration: "none", marginBottom: 16 }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26, fontWeight: 700,
                color: "#ffffff", letterSpacing: "-0.01em",
              }}>
                Xerxez{" "}
                <em style={{ color: OG, fontStyle: "normal" }}>Solutions</em>
              </span>
            </Link>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, lineHeight: 1.72,
              color: "rgba(255,255,255,0.38)",
              marginBottom: 24, maxWidth: 230,
            }}>
              Enterprise AI systems — ERP, DevSecOps pipelines, and cloud
              infrastructure for organisations that can't afford downtime.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIAL.map(({ href, icon, label }) => (
                <a key={label} href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: OG, fontSize: 14,
                    transition: "background 180ms ease, border-color 180ms ease, color 180ms ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background    = "rgba(201,136,58,0.15)";
                    e.currentTarget.style.borderColor   = "rgba(201,136,58,0.40)";
                    e.currentTarget.style.color         = C2;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background    = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor   = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.color         = OG;
                  }}
                >
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Services */}
          <div>
            <h4 style={colHead}>Services</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {SERVICES.map(({ to, label }) => (
                <li key={to} style={{ marginBottom: 10 }}>
                  <Link to={to} style={linkBase} {...linkHov}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h4 style={colHead}>Link us</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {NAV.map(({ to, label }) => (
                <li key={to} style={{ marginBottom: 10 }}>
                  <Link to={to} style={linkBase} {...linkHov}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 style={colHead}>Contact</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {([
                {
                  icon: <Phone size={12} />,
                  content: (
                    <a href="tel:+971567867451" style={linkBase} {...linkHov}>
                      +971 56 786 7451
                    </a>
                  ),
                },
                {
                  icon: <Mail size={12} />,
                  content: (
                    <a href="mailto:info@xerxez.com" style={linkBase} {...linkHov}>
                      info@xerxez.com
                    </a>
                  ),
                },
                {
                  icon: <Globe size={12} />,
                  content: (
                    <a href="https://xerxez.com" target="_blank" rel="noreferrer" style={linkBase} {...linkHov}>
                      xerxez.com
                    </a>
                  ),
                },
                {
                  icon: <MapPin size={12} style={{ marginTop: 2 }} />,
                  content: (
                    <span style={{ ...linkBase, cursor: "default", lineHeight: 1.55 }}>
                      India &amp; UAE —<br />Remote-first, Global delivery
                    </span>
                  ),
                },
              ] as { icon: React.ReactNode; content: React.ReactNode }[]).map(({ icon, content }, i) => (
                <li key={i} style={{
                  display: "flex", alignItems: "flex-start",
                  gap: 10, marginBottom: 14, color: OG,
                }}>
                  <span style={{ flexShrink: 0, paddingTop: 3 }}>{icon}</span>
                  {content}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────── */}
        <div style={{
          borderTop: `1px solid ${DIV}`,
          padding: "18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.22)",
            margin: 0,
          }}>
            &copy; {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms",   label: "Terms of Use"   },
            ].map(({ to, label }) => (
              <Link key={label} to={to} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.22)",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  </>
);

export default FooterSection2;
