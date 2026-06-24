import { Link } from "react-router-dom";

const stats = [
  { value: "40%",   label: "Cost Reduction",    icon: "fas fa-chart-line" },
  { value: "99.9%", label: "System Uptime",      icon: "fas fa-shield-alt" },
  { value: "<6 mo", label: "Time to Deploy",     icon: "fas fa-rocket"     },
];

const features = [
  "AI-native ERP — built for enterprise scale",
  "ISO 27001 & SOC 2 Type II compliant",
  "Multi-cloud: AWS · Azure · GCP",
  "24/7 dedicated support teams",
];

const HeroSection = () => {
  return (
    <section className="hero-section hero-1 bg-cover">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <span className="hero-sub-tag">
                <i className="fas fa-bolt"></i>
                Enterprise AI &amp; Cloud Solutions
              </span>
              <h1 className="char-animation">
                AI-Powered ERP, MLOps &amp; Cloud for Modern Enterprises
              </h1>
              <p>
                XERXEZ delivers intelligent enterprise software, DevSecOps pipelines,
                and cloud infrastructure that transform how your business operates at scale.
              </p>
              <div className="hero-btn smooth-fade-in fade-in">
                <Link to="/contact" className="theme-btn">
                  Get Started
                  <i className="far fa-arrow-right"></i>
                </Link>
                <Link to="/service" className="theme-btn style-2">
                  Our Services
                  <i className="far fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-6 smooth-fade-in fade-in">
            <div style={{
              background: "rgba(108,87,210,0.10)",
              border: "1px solid rgba(108,87,210,0.28)",
              borderRadius: 20,
              padding: "36px 32px",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <i className="fas fa-brain" style={{ color: "#6c57d2", fontSize: 18 }} />
                <span style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  XERXEZ Enterprise Performance
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
                {stats.map(({ value, label, icon }) => (
                  <div key={label} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(108,87,210,0.35)",
                    borderRadius: 14,
                    padding: "22px 12px",
                    textAlign: "center",
                  }}>
                    <i className={icon} style={{ color: "#6c57d2", fontSize: 22, marginBottom: 10, display: "block" }} />
                    <div style={{ color: "#fff", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 6, lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: 22 }} />

              {features.map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <i className="fas fa-check-circle" style={{ color: "#6c57d2", fontSize: 14, flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 14 }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
