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

const HeroSection = () => (
  <section
    className="hero-section hero-1"
    style={{ background: "#F2EFE9" }}
  >
    <div className="container">
      {/*
        Row: no extra paddingTop/paddingBottom — the parent .hero-1 CSS already
        provides padding:80px 0 and display:flex + align-items:center which
        vertically centers this row in 100vh. Adding paddingTop:100 here was
        double-stacking with the section padding, creating the large gap.
      */}
      <div className="row g-5 align-items-center">

        {/* LEFT — headline, description, CTAs */}
        <div className="col-lg-6">
          <div className="version-tag">
            Enterprise AI Platform · V2.0
            <span style={{ color: "#DDDAD4", margin: "0 4px" }}>·</span>
            ISO 27001 Certified
          </div>

          <h1 className="editorial-headline">
            Enterprise AI,<br />
            built for{" "}
            <span className="headline-accent">scale.</span>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            lineHeight: 1.75,
            color: "#4A4A4A",
            maxWidth: 520,     /* was 440 — widened for readability */
            marginBottom: 32,
          }}>
            XERXEZ delivers intelligent ERP, DevSecOps pipelines, and cloud
            infrastructure that transform how enterprises operate at scale.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <Link to="/contact" className="pill-btn">
              Get Started
              <span className="btn-arrow">
                <i className="far fa-arrow-right"></i>
              </span>
            </Link>
            <Link to="/service" className="pill-btn-ghost">
              See our services →
            </Link>
          </div>
        </div>

        {/* RIGHT — 3D dark performance card */}
        <div className="col-lg-6 d-flex justify-content-center justify-content-lg-end hero-card-col">
          <div
            className="tally-card"
            style={{ width: "100%", maxWidth: 420 }}  /* was 460 — slightly tighter */
          >
            {/* Header row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}>
              <span className="live-dot">Live · Current Performance</span>
              <span style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                XERXEZ ERP
              </span>
            </div>

            {/* Big number */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 72,     /* was 80 — scales better at narrower maxWidth */
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                }}>
                  99.9
                </span>
                <span style={{
                  fontSize: 20,
                  color: "rgba(255,255,255,0.4)",
                  paddingTop: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  %
                </span>
              </div>
              <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
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
              marginBottom: 20,
            }}>
              {[55, 70, 42, 80, 58, 88, 65, 92, 60, 85, 70, 99].map((h, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === 11 ? "#6c57d2" : "rgba(255,255,255,0.12)",
                  borderRadius: 3,
                }} />
              ))}
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 16,
              marginBottom: 16,
            }}>
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1,
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 4,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature bullets */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
              {features.map((feat) => (
                <div key={feat} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}>
                  <div style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#6c57d2",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "'DM Sans', sans-serif",
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
