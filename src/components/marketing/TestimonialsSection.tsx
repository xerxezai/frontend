const GOLD = "#C9883A";

const QUOTES = [
  {
    quote: "XERXEZ deployed our AI-powered ERP in four months. We saw a 40% cost reduction in the first year.",
    role: "CTO",
    org: "Healthcare Group",
  },
  {
    quote: "Their DevSecOps team cut our deployment cycle from three weeks to two days. Zero security incidents since go-live.",
    role: "IT Director",
    org: "Logistics Company",
  },
  {
    quote: "The MLOps pipeline XERXEZ built handles 10M+ predictions a day at 99.9% uptime. Models ship in hours, not months.",
    role: "Data Science Director",
    org: "Retail Enterprise",
  },
];

const Stars = () => (
  <div style={{ display: "flex", gap: 3, marginBottom: 16 }} aria-label="5 out of 5 stars">
    {[0, 1, 2, 3, 4].map(i => (
      <i key={i} className="fas fa-star" style={{ color: GOLD, fontSize: 12 }} />
    ))}
  </div>
);

/** Homepage client testimonials — anonymised role-level attributions. */
const TestimonialsSection = () => (
  <section style={{ background: "#F2EFE9", padding: "96px 0 90px" }}>
    <div className="container">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
            Client Outcomes
          </span>
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
        </div>
        <h2 style={{
          fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, lineHeight: 1.12,
          color: "#141413", fontFamily: "'DM Sans',sans-serif", margin: 0,
        }}>
          What Enterprise Teams Say
        </h2>
      </div>

      <div className="row g-4">
        {QUOTES.map(t => (
          <div key={t.role} className="col-lg-4 col-md-6">
            <div
              style={{
                background: "#fff", borderRadius: 18, height: "100%",
                border: "1px solid rgba(201,136,58,0.12)",
                borderTop: `3px solid ${GOLD}`,
                boxShadow: "0 4px 22px rgba(0,0,0,0.07)",
                padding: "28px 26px 24px",
                display: "flex", flexDirection: "column",
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 18px 44px rgba(0,0,0,0.11)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 22px rgba(0,0,0,0.07)"; }}
            >
              <Stars />
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, lineHeight: 1.72,
                color: "#3A3530", marginBottom: 20, flex: 1,
              }}>
                “{t.quote}”
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(145deg,#e8a84e,#C9883A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className="fas fa-user-tie" style={{ color: "#fff", fontSize: 15 }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 700, color: "#141413", lineHeight: 1.2 }}>
                    {t.role}
                  </div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(20,20,19,0.48)", marginTop: 2 }}>
                    {t.org}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
