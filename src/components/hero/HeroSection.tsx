import { Link } from "react-router-dom";
import { InfiniteGridBackground } from "../ui/the-infinite-grid";

const stats = [
  { value: "40%",   label: "Cost Reduction",    icon: "fas fa-chart-line" },
  { value: "99.9%", label: "System Uptime",      icon: "fas fa-shield-alt" },
  { value: "<6 mo", label: "Time to Deploy",     icon: "fas fa-rocket"     },
];

type BentoStat  = { kind: "stat";   value: string; label: string; icon: string };
type BentoStack = { kind: "stack" };

const bento: (BentoStat | BentoStack)[] = [
  { kind: "stat",  value: "120+",   label: "Projects Delivered", icon: "fas fa-check-circle" },
  { kind: "stat",  value: "99.9%",  label: "Platform Uptime",    icon: "fas fa-shield-alt"  },
  { kind: "stat",  value: "<6 mo",  label: "Time to Go-Live",    icon: "fas fa-rocket"       },
  { kind: "stack" },
];

const techStack = ["AWS", "Azure", "GCP", "K8s", "TF"];

const HeroSection = () => {
  return (
    <InfiniteGridBackground
      as="section"
      className="hero-section hero-1 bg-cover"
      speed={0.35}
      revealRadius={420}
      baseOpacity={0.05}
      revealOpacity={0.40}
      gridColor="rgba(108,87,210,0.75)"
      blobColors={{
        topRight:   "rgba(108,87,210,0.10)",
        center:     "rgba(255,121,46,0.08)",
        bottomLeft: "rgba(108,87,210,0.07)",
      }}
    >
      <div className="container">
        <div className="row g-4 align-items-center">

          {/* ── Left: headline + CTA ─────────────────────── */}
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

          {/* ── Right: performance card ───────────────────── */}
          <div className="col-lg-6 smooth-fade-in fade-in">
            <div style={{
              background: "#ffffff",
              border: "1px solid #E5E5E5",
              borderRadius: 20,
              padding: "36px 32px",
              boxShadow: "0px 8px 40px rgba(108,87,210,0.10)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <i className="fas fa-brain" style={{ color: "#6c57d2", fontSize: 18 }} />
                <span style={{
                  color: "#9E9E9E",
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
                    background: "#F5F5F7",
                    border: "1px solid #E5E5E5",
                    borderRadius: 14,
                    padding: "22px 12px",
                    textAlign: "center",
                  }}>
                    <i className={icon} style={{ color: "#6c57d2", fontSize: 22, marginBottom: 10, display: "block" }} />
                    <div style={{ color: "#0A0A0A", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</div>
                    <div style={{ color: "#6B6B6B", fontSize: 11, marginTop: 6, lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #E5E5E5", marginBottom: 20 }} />

              {/* 2×2 bento grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {bento.map((cell, i) =>
                  cell.kind === "stack" ? (
                    <div key={i} style={{
                      background: "#F0EEFF",
                      border: "1px solid rgba(108,87,210,0.15)",
                      borderRadius: 12,
                      padding: "16px 14px",
                      display: "flex", flexDirection: "column", gap: 8,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#6c57d2", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Cloud Stack
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {techStack.map((t) => (
                          <span key={t} style={{
                            background: "#fff", border: "1px solid #E5E5E5",
                            borderRadius: 6, padding: "2px 8px",
                            fontSize: 11, fontWeight: 700, color: "#4B4B4B",
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div key={i} style={{
                      background: "#F5F5F7",
                      border: "1px solid #E5E5E5",
                      borderRadius: 12,
                      padding: "16px 14px",
                      display: "flex", flexDirection: "column", gap: 4,
                    }}>
                      <i className={(cell as BentoStat).icon} style={{ color: "#6c57d2", fontSize: 16 }} />
                      <div style={{ color: "#0A0A0A", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
                        {(cell as BentoStat).value}
                      </div>
                      <div style={{ color: "#6B6B6B", fontSize: 11 }}>{(cell as BentoStat).label}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </InfiniteGridBackground>
  );
};

export default HeroSection;
