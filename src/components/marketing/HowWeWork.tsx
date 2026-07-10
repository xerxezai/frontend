const GOLD = "#C9883A";
const AMBER = "#E8A84E";

const STEPS = [
  { n: "1", icon: "fas fa-phone-alt",         title: "Discovery Call (Free)", desc: "We understand your needs, current stack, and business goals." },
  { n: "2", icon: "fas fa-drafting-compass",  title: "Solution Design",       desc: "Custom architecture plan with clear scope, timeline, and pricing." },
  { n: "3", icon: "fas fa-code",              title: "Agile Delivery",        desc: "2-week sprints with full transparency and stakeholder demos." },
  { n: "4", icon: "fas fa-headset",           title: "Go Live & Support",     desc: "Zero-downtime launch backed by a 24/7 dedicated team." },
];

/** Homepage "How We Work" — 4-step process strip. */
const HowWeWork = () => (
  <section style={{ background: "#F2EFE9", padding: "96px 0 90px", position: "relative", overflow: "hidden" }}>
    <div className="container">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
            How We Work
          </span>
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
        </div>
        <h2 style={{
          fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, lineHeight: 1.12,
          color: "#141413", fontFamily: "'DM Sans',sans-serif", margin: 0,
        }}>
          From First Call to Go-Live
        </h2>
      </div>

      {/* Steps */}
      <div className="row g-4">
        {STEPS.map((s, i) => (
          <div key={s.n} className="col-lg-3 col-md-6">
            <div
              style={{
                background: "#fff", borderRadius: 18, height: "100%",
                border: "1px solid rgba(201,136,58,0.12)",
                borderTop: `3px solid ${GOLD}`,
                boxShadow: "0 4px 22px rgba(0,0,0,0.07)",
                padding: "28px 24px 26px", position: "relative",
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 18px 44px rgba(0,0,0,0.11)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 22px rgba(0,0,0,0.07)"; }}
            >
              {/* Step number + connector arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
                  boxShadow: "0 4px 14px rgba(201,136,58,0.30)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={s.icon} style={{ color: "#fff", fontSize: 17 }} />
                </div>
                <span style={{
                  fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700,
                  color: "rgba(201,136,58,0.18)", lineHeight: 1, userSelect: "none",
                }}>
                  {s.n}
                </span>
              </div>
              <h4 style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700,
                color: "#141413", marginBottom: 9, lineHeight: 1.3,
              }}>
                {s.title}
              </h4>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, lineHeight: 1.68,
                color: "rgba(20,20,19,0.52)", margin: 0,
              }}>
                {s.desc}
              </p>
              {/* Arrow to next step (desktop only) */}
              {i < STEPS.length - 1 && (
                <i className="far fa-arrow-right d-none d-lg-block" aria-hidden="true" style={{
                  position: "absolute", top: "50%", right: -22, transform: "translateY(-50%)",
                  color: "rgba(201,136,58,0.45)", fontSize: 15, zIndex: 2,
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowWeWork;
