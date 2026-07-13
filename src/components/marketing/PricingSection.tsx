import { useState } from "react";
import { Link } from "react-router-dom";
import { PRICING_PLANS } from "../../data/pricingData";
import type { Currency } from "../../data/pricingData";
import { CurrencyToggle, PricingCard } from "./PricingCard";

const GOLD  = "#C9883A";
const CREAM = "#F0EDE6";
const MUTED = "rgba(240,237,230,0.55)";

const PricingSection = () => {
  const [currency, setCurrency] = useState<Currency>("INR");

  return (
    <section style={{ background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)", padding: "96px 0 90px" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
              Pricing
            </span>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
          </div>
          <h2 style={{
            fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 800, lineHeight: 1.12,
            color: CREAM, fontFamily: "'DM Sans',sans-serif", margin: "0 0 14px",
          }}>
            Plans For Every Stage
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: MUTED, margin: "0 0 22px", lineHeight: 1.6 }}>
            Transparent pricing in INR or AED. No hidden fees.
          </p>
          <CurrencyToggle currency={currency} onChange={setCurrency} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 22,
          maxWidth: 1040,
          margin: "0 auto",
        }} className="pricing-section-grid">
          {PRICING_PLANS.map(plan => (
            <PricingCard key={plan.name} plan={plan} currency={currency} billing="monthly" compact />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link
            to="/pricing"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
              color: GOLD, textDecoration: "none",
              padding: "11px 4px", borderBottom: "1px solid rgba(201,136,58,0.35)",
              transition: "border-color 150ms ease",
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = GOLD)}
            onMouseOut={e => (e.currentTarget.style.borderColor = "rgba(201,136,58,0.35)")}
          >
            View Full Pricing <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pricing-section-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default PricingSection;
