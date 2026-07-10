import { Link } from "react-router-dom";

const GOLD = "#C9883A";
const CG = "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)";

/** Standard bottom-of-page conversion block used on marketing pages. */
const ReadyCTA = () => (
  <section style={{
    background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)",
    padding: "88px 0", position: "relative", overflow: "hidden",
  }}>
    <div aria-hidden="true" style={{
      position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
      width: 800, height: 600, borderRadius: "50%",
      background: "radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 65%)",
      pointerEvents: "none",
    }} />
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)",
      backgroundSize: "28px 28px",
    }} />

    <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
      <h2 style={{
        fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
        fontSize: "clamp(26px,4vw,44px)", color: "#fff",
        letterSpacing: "-0.03em", marginBottom: 14,
      }}>
        Ready to Transform{" "}
        <em style={{ color: GOLD, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
          Your Enterprise?
        </em>
      </h2>
      <p style={{
        fontSize: 15, color: "rgba(255,255,255,0.50)", lineHeight: 1.75,
        fontFamily: "'DM Sans',sans-serif", marginBottom: 32,
      }}>
        Tell us where you are — we'll show you the fastest path to AI-powered operations.
      </p>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 22 }}>
        <Link to="/contact" style={{
          display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
          background: CG, color: "#fff", fontWeight: 700, fontSize: 14,
          padding: "14px 30px", borderRadius: 10, textDecoration: "none",
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.28)", minHeight: 48,
        }}>
          Book a Free Consultation <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
        </Link>
        <Link to="/contact" style={{
          display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
          background: "rgba(255,255,255,0.07)", color: "#fff",
          fontWeight: 600, fontSize: 14, padding: "14px 30px",
          borderRadius: 10, textDecoration: "none",
          fontFamily: "'DM Sans',sans-serif",
          border: "1px solid rgba(255,255,255,0.18)", minHeight: 48,
        }}>
          Talk to an Expert
        </Link>
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center",
        gap: "6px 18px", fontFamily: "'DM Sans',sans-serif", fontSize: 13,
        color: "rgba(255,255,255,0.45)",
      }}>
        <span>
          Or call us:{" "}
          <a href="tel:+971567867451" style={{ color: "#E8A84E", textDecoration: "none", fontWeight: 700 }}>
            +971 56 786 7451
          </a>
        </span>
        <span style={{ color: "rgba(201,136,58,0.40)" }}>·</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
          Response within 24 hours
        </span>
      </div>
    </div>
  </section>
);

export default ReadyCTA;
