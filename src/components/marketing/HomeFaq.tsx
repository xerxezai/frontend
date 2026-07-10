import { useState } from "react";

const GOLD = "#C9883A";

export const HOME_FAQS = [
  {
    q: "How long does ERP deployment take?",
    a: "Most XERXEZ ERP deployments go live in under 6 months. We use a phased approach — core modules ship in 8–16 weeks, then extensions — so you see value in weeks, not years.",
  },
  {
    q: "What industries do you serve?",
    a: "We serve 5+ industries including healthcare, manufacturing, logistics, finance, retail, and government — with solutions tailored to each sector's compliance and workflow requirements.",
  },
  {
    q: "Do you provide post-deployment support?",
    a: "Yes. Every deployment includes 90 days of hypercare support with SLA-backed response times, followed by optional 24/7 managed support packages and ongoing feature roadmapping.",
  },
  {
    q: "What is your pricing model?",
    a: "We offer fixed-scope, time-and-materials, and retainer models. Tell us your requirements via the contact page and we'll send a tailored estimate within 24 hours.",
  },
  {
    q: "Are you ISO certified?",
    a: "Our security and delivery practices are aligned to ISO 27001 and SOC 2, and every engagement is covered by a strict NDA. Compliance documentation is available on request.",
  },
  {
    q: "Can you upgrade our existing SAP/Oracle ERP?",
    a: "Yes. XERXEZ layers AI capabilities onto your existing SAP, Oracle, or Microsoft Dynamics system — so you modernise incrementally without a risky big-bang migration.",
  },
];

/** Homepage FAQ accordion. Content mirrors the FAQPage JSON-LD emitted on the homepage. */
const HomeFaq = () => {
  const [open, setOpen] = useState<number>(0);

  return (
    <section style={{ background: "#F8F4EE", padding: "96px 0 90px" }}>
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
              FAQ
            </span>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
          </div>
          <h2 style={{
            fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, lineHeight: 1.12,
            color: "#141413", fontFamily: "'DM Sans',sans-serif", margin: 0,
          }}>
            Questions, Answered
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {HOME_FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} style={{
                background: "#fff", borderRadius: 14,
                border: `1px solid ${isOpen ? "rgba(201,136,58,0.35)" : "rgba(201,136,58,0.12)"}`,
                boxShadow: isOpen ? "0 8px 28px rgba(0,0,0,0.08)" : "0 2px 12px rgba(0,0,0,0.05)",
                overflow: "hidden", transition: "border-color 0.2s ease, box-shadow 0.2s ease",
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
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: "#141413", lineHeight: 1.4 }}>
                    {f.q}
                  </span>
                  <i
                    className="fas fa-chevron-down"
                    style={{
                      color: GOLD, fontSize: 12, flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: "0 22px 19px" }}>
                    <p style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.72,
                      color: "rgba(20,20,19,0.58)", margin: 0,
                    }}>
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFaq;
