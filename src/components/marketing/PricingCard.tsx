import { Link } from "react-router-dom";
import type { PricingPlan } from "../../data/pricingData";

const GOLD  = "#C9883A";
const GOLDG = "linear-gradient(135deg,#E8A84E 0%,#C9883A 100%)";
const CREAM = "#F0EDE6";
const MUTED = "rgba(240,237,230,0.55)";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  const isPopular = !!plan.badge;

  return (
    <div style={{
      position: "relative",
      background: isPopular ? "rgba(201,136,58,0.07)" : "rgba(255,255,255,0.035)",
      border: isPopular ? `2px solid ${GOLD}` : "1px solid rgba(255,255,255,0.09)",
      borderRadius: 20,
      padding: "38px 30px 32px",
      boxShadow: isPopular
        ? "0 24px 60px rgba(201,136,58,0.22),0 0 0 1px rgba(201,136,58,0.12)"
        : "0 4px 24px rgba(0,0,0,0.24)",
      display: "flex", flexDirection: "column", height: "100%",
    }}>
      {isPopular && (
        <span style={{
          position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
          background: GOLDG, color: "#0A0806", fontSize: 11, fontWeight: 800,
          padding: "6px 18px", borderRadius: 999, letterSpacing: "0.04em", whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(201,136,58,0.45)", fontFamily: "'DM Sans',sans-serif",
        }}>
          {plan.badge}
        </span>
      )}

      <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 22, color: CREAM, margin: 0 }}>
        {plan.name}
      </h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: MUTED, margin: "6px 0 20px", lineHeight: 1.5 }}>
        {plan.audience}
      </p>

      <div style={{ marginBottom: 22 }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 22, color: GOLD, lineHeight: 1.3 }}>
          Contact Us for Pricing
        </span>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 26px", display: "flex", flexDirection: "column", gap: 11, flexGrow: 1 }}>
        {plan.features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(240,237,230,0.82)", lineHeight: 1.45 }}>
            <svg viewBox="0 0 20 20" width={16} height={16} style={{ flexShrink: 0, marginTop: 2 }} fill="none">
              <circle cx="10" cy="10" r="10" fill={isPopular ? GOLD : "rgba(201,136,58,0.18)"} />
              <path d="M6 10.2l2.4 2.4L14 7" stroke={isPopular ? "#0A0806" : GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <Link
        to={plan.ctaLink}
        style={{
          display: "block", textAlign: "center", textDecoration: "none",
          fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 14,
          padding: "13px 20px", borderRadius: 10,
          background: isPopular ? GOLDG : "rgba(255,255,255,0.06)",
          color: isPopular ? "#0A0806" : CREAM,
          border: isPopular ? "none" : "1px solid rgba(255,255,255,0.14)",
          boxShadow: isPopular ? "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)" : "none",
          transition: "opacity 150ms ease",
        }}
        onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
        onMouseOut={e => (e.currentTarget.style.opacity = "1")}
      >
        {plan.cta}
      </Link>
    </div>
  );
}
