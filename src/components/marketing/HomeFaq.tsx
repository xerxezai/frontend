import { useEffect, useRef, useState } from "react";

const GOLD = "#C9883A";

export const HOME_FAQS = [
  {
    q: "What is XERXEZ?",
    a: "XERXEZ is an AI-powered enterprise platform with 3 products: ERP system, LMA Academy online courses, and DevSecOps cloud solutions. Serving businesses in UAE, Abu Dhabi and India.",
  },
  {
    q: "Is XERXEZ ERP free to try?",
    a: "Yes! XERXEZ ERP is free to try with full access — no credit card required. Includes HR, Payroll, CRM, Sales, Inventory and more. Start at xerxez.com/erp",
  },
  {
    q: "How do I enroll in XERXEZ Academy courses?",
    a: "Visit xerxez.com/lma, browse courses on AI, MLOps and DevSecOps, and enroll instantly. Get a certificate on completion.",
  },
  {
    q: "Does XERXEZ work for small businesses?",
    a: "Yes! XERXEZ ERP works for businesses of all sizes — from 5 to 500+ employees. Affordable, scalable and easy to set up in minutes.",
  },
  {
    q: "Is XERXEZ available in UAE and Abu Dhabi?",
    a: "Yes, XERXEZ serves enterprises across UAE, Abu Dhabi, Dubai and India with 24/7 support and remote-first delivery.",
  },
  {
    q: "How much does XERXEZ ERP cost?",
    a: "XERXEZ offers flexible pricing for all business sizes. Contact us at info@xerxez.com or visit xerxez.com/contact for a custom quote.",
  },
  {
    q: "What courses does XERXEZ Academy offer?",
    a: "XERXEZ Academy offers AI & ML, MLOps, DevSecOps, Full Stack Development, Cloud Architecture and ERP training courses with industry certificates.",
  },
  {
    q: "How do I contact XERXEZ support?",
    a: "Email info@xerxez.com, call +971 56 786 7451, or use the live chat on xerxez.com. We respond within 24 hours.",
  },
];

/** Homepage FAQ accordion. Content mirrors the FAQPage JSON-LD emitted on the homepage. */
const HomeFaq = () => {
  const [open, setOpen] = useState<number>(0);
  const headRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setReveal(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background: "#F8F4EE", padding: "96px 0 90px" }}>
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Header */}
        <div ref={headRef} style={{
          textAlign: "center", marginBottom: 48,
          opacity: reveal ? 1 : 0, transform: reveal ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}>
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
                overflow: "hidden", transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
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
