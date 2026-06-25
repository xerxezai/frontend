import { Link } from "react-router-dom";
import SeoFormSection from "../forms/SeoFormSection";

const CtaSection = () => (
  <section style={{
    position: "relative",
    padding: "96px 0",
    background: "linear-gradient(135deg, #4a38b8 0%, #6c57d2 50%, #8b73ff 100%)",
    overflow: "hidden",
  }}>
    {/* Decorative blobs */}
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: "40%", height: "80%", borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", filter: "blur(80px)",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", left: "-8%",
        width: "35%", height: "70%", borderRadius: "50%",
        background: "rgba(255,255,255,0.05)", filter: "blur(80px)",
      }} />
      {/* Grid overlay */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
        <defs>
          <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-grid)" />
      </svg>
    </div>

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div style={{
        background: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.20)",
        borderRadius: 24,
        padding: "56px 48px",
        maxWidth: 780,
        margin: "0 auto",
        boxShadow: "0 8px 64px rgba(0,0,0,0.20)",
      }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span style={{
            background: "rgba(255,255,255,0.18)",
            color: "#fff", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "6px 16px", borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.25)",
          }}>
            <i className="fas fa-bolt" style={{ marginRight: 6 }} />
            Free Tech Assessment
          </span>
        </div>

        <h2 style={{
          color: "#fff", textAlign: "center", fontWeight: 800,
          fontSize: "clamp(24px, 4vw, 38px)", lineHeight: 1.2,
          marginBottom: 14,
        }}>
          Request a Digital Transformation Audit
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.78)", textAlign: "center",
          fontSize: 15, lineHeight: 1.7, marginBottom: 36,
          maxWidth: 520, margin: "0 auto 36px",
        }}>
          Enter your website and email — our experts will analyse your current stack
          and identify opportunities for AI, cloud, and DevSecOps modernisation.
        </p>

        <SeoFormSection />

        {/* Trust row */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 28,
          marginTop: 28, flexWrap: "wrap",
        }}>
          {[
            { icon: "fas fa-lock",        label: "SSL Encrypted" },
            { icon: "fas fa-clock",       label: "24h Response" },
            { icon: "fas fa-ban",         label: "No Spam" },
          ].map((t) => (
            <span key={t.label} style={{
              display: "flex", alignItems: "center", gap: 7,
              color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 500,
            }}>
              <i className={t.icon} style={{ fontSize: 11 }} />
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Below-card CTA links */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
        <Link to="/contact" style={{
          color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600,
          borderBottom: "1px solid rgba(255,255,255,0.40)", paddingBottom: 2,
        }}>
          Talk to our team <i className="far fa-arrow-right" style={{ marginLeft: 6 }} />
        </Link>
        <Link to="/service" style={{
          color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: 14, fontWeight: 500,
        }}>
          View all services
        </Link>
      </div>
    </div>
  </section>
);

export default CtaSection;
