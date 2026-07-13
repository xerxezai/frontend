import { Link } from "react-router-dom";
import type { PricingPlan, Currency, Billing } from "../../data/pricingData";
import { formatPrice } from "../../data/pricingData";

const GOLD  = "#C9883A";
const GOLDG = "linear-gradient(135deg,#E8A84E 0%,#C9883A 100%)";
const CREAM = "#F0EDE6";
const MUTED = "rgba(240,237,230,0.55)";

export function CurrencyToggle({ currency, onChange }: { currency: Currency; onChange: (c: Currency) => void }) {
  const btn = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 8,
    padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13,
    background: active ? GOLDG : "transparent",
    color: active ? "#0A0806" : "rgba(240,237,230,0.65)",
    boxShadow: active ? "0 3px 10px rgba(201,136,58,0.30)" : "none",
    transition: "color 0.2s ease, background 0.2s ease",
  });
  return (
    <div style={{ display: "inline-flex", gap: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 13, padding: 5 }}>
      <button type="button" style={btn(currency === "INR")} onClick={() => onChange("INR")}>🇮🇳 INR (₹)</button>
      <button type="button" style={btn(currency === "AED")} onClick={() => onChange("AED")}>🇦🇪 AED (د.إ)</button>
      <button type="button" style={btn(currency === "USD")} onClick={() => onChange("USD")}>🌍 USD ($)</button>
    </div>
  );
}

export function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  const btn = (active: boolean): React.CSSProperties => ({
    padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13,
    background: active ? GOLDG : "transparent",
    color: active ? "#0A0806" : "rgba(240,237,230,0.65)",
    boxShadow: active ? "0 3px 10px rgba(201,136,58,0.30)" : "none",
    transition: "color 0.2s ease, background 0.2s ease",
    display: "flex", alignItems: "center", gap: 6,
  });
  return (
    <div style={{ display: "inline-flex", gap: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 13, padding: 5 }}>
      <button type="button" style={btn(billing === "monthly")} onClick={() => onChange("monthly")}>Monthly</button>
      <button type="button" style={btn(billing === "yearly")} onClick={() => onChange("yearly")}>
        Yearly
        <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 7px", borderRadius: 999, background: billing === "yearly" ? "rgba(10,8,6,0.18)" : "rgba(201,136,58,0.18)", color: billing === "yearly" ? "#0A0806" : GOLD }}>
          2 mo free
        </span>
      </button>
    </div>
  );
}

export function PricingCard({ plan, currency, billing, compact = false }: {
  plan: PricingPlan; currency: Currency; billing: Billing; compact?: boolean;
}) {
  const { symbol, amount, suffix, strike } = formatPrice(plan, currency, billing);
  const isCustom = amount === "Custom";
  const isPopular = !!plan.badge;
  const featuresToShow = compact ? plan.features.slice(0, 3) : plan.features;
  const hiddenCount = compact ? plan.features.length - featuresToShow.length : 0;

  return (
    <div style={{
      position: "relative",
      background: isPopular ? "rgba(201,136,58,0.07)" : "rgba(255,255,255,0.035)",
      border: isPopular ? `2px solid ${GOLD}` : "1px solid rgba(255,255,255,0.09)",
      borderRadius: 20,
      padding: compact ? "30px 24px 26px" : "38px 30px 32px",
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

      <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: compact ? 19 : 22, color: CREAM, margin: 0 }}>
        {plan.name}
      </h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: MUTED, margin: "6px 0 20px", lineHeight: 1.5 }}>
        {plan.audience}
      </p>

      <div style={{ marginBottom: 22 }}>
        {strike && (
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(240,237,230,0.35)", textDecoration: "line-through", marginBottom: 2 }}>
            {strike}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
          {isCustom ? (
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: compact ? 30 : 38, color: GOLD, lineHeight: 1 }}>
              {amount}
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 3 }}>
              {/* Currency symbol rendered in DM Sans — Cormorant Garamond has no ₹ glyph and falls back to a mismatched font. */}
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: compact ? 20 : 24, color: CREAM, lineHeight: 1 }}>
                {symbol}
              </span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: compact ? 30 : 38, color: CREAM, lineHeight: 1 }}>
                {amount}
              </span>
            </span>
          )}
          {suffix && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: MUTED }}>{suffix}</span>}
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 26px", display: "flex", flexDirection: "column", gap: 11, flexGrow: 1 }}>
        {featuresToShow.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(240,237,230,0.82)", lineHeight: 1.45 }}>
            <svg viewBox="0 0 20 20" width={16} height={16} style={{ flexShrink: 0, marginTop: 2 }} fill="none">
              <circle cx="10" cy="10" r="10" fill={isPopular ? GOLD : "rgba(201,136,58,0.18)"} />
              <path d="M6 10.2l2.4 2.4L14 7" stroke={isPopular ? "#0A0806" : GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {f}
          </li>
        ))}
        {hiddenCount > 0 && (
          <li style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: GOLD, fontWeight: 600 }}>
            +{hiddenCount} more feature{hiddenCount > 1 ? "s" : ""}
          </li>
        )}
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
