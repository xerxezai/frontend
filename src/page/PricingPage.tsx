import { useState } from "react";
import CustomLayout from "../components/layout/CustomLayout";
import SEO from "../components/seo/SEO";
import { PRICING_PLANS } from "../data/pricingData";
import type { Currency, Billing } from "../data/pricingData";
import { CurrencyToggle, BillingToggle, PricingCard } from "../components/marketing/PricingCard";

const GOLD  = "#C9883A";
const CREAM = "#F0EDE6";
const MUTED = "rgba(240,237,230,0.55)";

const PRICING_FAQS = [
  {
    q: "Do you support both INR and AED billing?",
    a: "Yes, we bill in INR for India and AED for UAE clients.",
  },
  {
    q: "What is included in the 8-hour work day?",
    a: "Full access to all modules for your team during business hours.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, upgrade or downgrade anytime.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, we offer a 14-day free trial on all plans.",
  },
];

function PricingFaq() {
  const [open, setOpen] = useState<number>(0);
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      {PRICING_FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} style={{
            background: "rgba(255,255,255,0.035)",
            border: `1px solid ${isOpen ? "rgba(201,136,58,0.35)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 14, overflow: "hidden",
            transition: "border-color 0.2s ease",
          }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16, padding: "17px 22px", background: "none", border: "none",
                cursor: "pointer", textAlign: "left", minHeight: 44,
              }}
            >
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: CREAM, lineHeight: 1.4 }}>
                {f.q}
              </span>
              <i className="fas fa-chevron-down" style={{
                color: GOLD, fontSize: 12, flexShrink: 0,
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }} />
            </button>
            {isOpen && (
              <div style={{ padding: "0 22px 19px" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.72, color: MUTED, margin: 0 }}>
                  {f.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const PricingPage = () => {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <CustomLayout>
      <SEO
        title="XERXEZ ERP Pricing — India & UAE | ₹15,000/mo"
        description="Transparent ERP pricing for India and UAE. Plans from ₹15,000/month or AED 3,000/month. AI-powered ERP for enterprises in India, Dubai, Abu Dhabi."
        canonical="/pricing"
        keywords="ERP pricing india, erp software cost UAE, xerxez pricing, ERP software dubai price, best erp india"
      />

      <section style={{
        background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)",
        padding: "150px 0 90px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 40px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
                Pricing
              </span>
              <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
            </div>
            <h1 style={{
              fontSize: "clamp(30px,4vw,48px)", fontWeight: 800, lineHeight: 1.1,
              color: CREAM, fontFamily: "'DM Sans',sans-serif", margin: "0 0 16px",
            }}>
              Simple, Transparent Pricing
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: MUTED, lineHeight: 1.7, margin: 0 }}>
              AI-powered ERP for enterprises in India, Dubai &amp; Abu Dhabi. Pick a plan, switch currency, and get started in minutes.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              <CurrencyToggle currency={currency} onChange={setCurrency} />
              <BillingToggle billing={billing} onChange={setBilling} />
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(240,237,230,0.4)", margin: 0, textAlign: "center" }}>
              All prices exclusive of taxes.
              {currency === "AED" && <><br />Based on 8 hours/day | AED 200/hour.</>}
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 26,
            maxWidth: 1080,
            margin: "56px auto 0",
          }} className="pricing-grid">
            {PRICING_PLANS.map(plan => (
              <PricingCard key={plan.name} plan={plan} currency={currency} billing={billing} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "linear-gradient(200deg,#1a1208 0%,#0f0a05 100%)", padding: "90px 0 100px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
                FAQ
              </span>
              <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
            </div>
            <h2 style={{
              fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, lineHeight: 1.15,
              color: CREAM, fontFamily: "'DM Sans',sans-serif", margin: 0,
            }}>
              Pricing Questions, Answered
            </h2>
          </div>
          <PricingFaq />
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </CustomLayout>
  );
};

export default PricingPage;
