import { Link } from "react-router-dom";

const stats = [
  { value: "40%",   label: "Cost Reduction" },
  { value: "99.9%", label: "System Uptime"  },
  { value: "<6 mo", label: "Time to Deploy" },
];

const features = [
  "AI-native ERP — built for enterprise scale",
  "ISO 27001 & SOC 2 Type II compliant",
  "Multi-cloud: AWS · Azure · GCP",
  "24/7 dedicated support teams",
];

const SpikeMark = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <line x1="7" y1="0" x2="7" y2="14" stroke="#141413" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="0" y1="7" x2="14" y2="7" stroke="#141413" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="2.05" y1="2.05" x2="11.95" y2="11.95" stroke="#141413" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="11.95" y1="2.05" x2="2.05" y2="11.95" stroke="#141413" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HeroSection = () => (
  <section style={{
    background: "#faf9f5",
    padding: "40px 0 80px",
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "flex-start",
  }}>
    <div className="container">
      <div className="row g-5 align-items-center">

        {/* LEFT — editorial headline + CTAs */}
        <div className="col-lg-6">
          {/* Eyebrow badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#efe9de",
            border: "1px solid #e6dfd8",
            borderRadius: 9999,
            padding: "4px 14px",
            marginBottom: 32,
          }}>
            <SpikeMark />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "#6c6a64",
            }}>
              Enterprise AI Platform · V2.0
            </span>
          </div>

          {/* Display headline — Cormorant Garamond 400, negative tracking */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', 'Tiempos Headline', Garamond, serif",
            fontWeight: 400,
            fontSize: "clamp(48px, 6vw, 72px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#141413",
            marginBottom: 24,
          }}>
            Enterprise AI,<br />
            built for{" "}
            <em style={{ color: "#cc785c", fontStyle: "italic" }}>scale.</em>
          </h1>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            lineHeight: 1.55,
            color: "#3d3d3a",
            maxWidth: 520,
            marginBottom: 40,
          }}>
            XERXEZ delivers intelligent ERP, DevSecOps pipelines, and cloud
            infrastructure that transform how enterprises operate at scale.
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Link to="/contact" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#cc785c",
              color: "#ffffff",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1,
              padding: "12px 20px",
              height: 40,
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 150ms ease",
            }}
              onMouseOver={e => (e.currentTarget.style.background = "#a9583e")}
              onMouseOut={e => (e.currentTarget.style.background = "#cc785c")}
            >
              Get Started
            </Link>
            <Link to="/service" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              color: "#141413",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1,
              padding: "12px 20px",
              height: 40,
              borderRadius: 8,
              border: "1px solid #e6dfd8",
              textDecoration: "none",
              transition: "border-color 150ms ease",
            }}
              onMouseOver={e => (e.currentTarget.style.borderColor = "#cc785c")}
              onMouseOut={e => (e.currentTarget.style.borderColor = "#e6dfd8")}
            >
              See our services
            </Link>
          </div>
        </div>

        {/* RIGHT — dark navy product mockup card */}
        <div className="col-lg-6 d-flex justify-content-center justify-content-lg-end">
          <div style={{
            background: "#181715",
            borderRadius: 16,
            padding: 32,
            width: "100%",
            maxWidth: 440,
          }}>
            {/* Card header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#5db872",
                }} />
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#a09d96",
                  letterSpacing: "0.06em",
                }}>
                  Live · Current Performance
                </span>
              </div>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                XERXEZ ERP
              </span>
            </div>

            {/* Big uptime number */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', Garamond, serif",
                  fontSize: 72,
                  fontWeight: 400,
                  color: "#faf9f5",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}>
                  99.9
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 20,
                  color: "rgba(250,249,245,0.4)",
                  paddingTop: 8,
                }}>
                  %
                </span>
              </div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: "#a09d96",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 4,
              }}>
                System Uptime SLA
              </div>
            </div>

            {/* Mini bar chart */}
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 3,
              height: 40,
              marginBottom: 24,
            }}>
              {[55, 70, 42, 80, 58, 88, 65, 92, 60, 85, 70, 99].map((h, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === 11 ? "#cc785c" : "rgba(250,249,245,0.1)",
                  borderRadius: 3,
                }} />
              ))}
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              borderTop: "1px solid rgba(250,249,245,0.08)",
              paddingTop: 20,
              marginBottom: 20,
            }}>
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    fontWeight: 400,
                    color: "#faf9f5",
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    color: "#a09d96",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 4,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature bullets */}
            <div style={{ borderTop: "1px solid rgba(250,249,245,0.08)", paddingTop: 16 }}>
              {features.map((feat) => (
                <div key={feat} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}>
                  <div style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#cc785c",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "#a09d96",
                  }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

export default HeroSection;
