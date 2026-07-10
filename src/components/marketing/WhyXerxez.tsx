const GOLD = "#C9883A";

const ROWS: { feature: string; xerxez: boolean; agency: boolean; big4: boolean }[] = [
  { feature: "AI-Native Platform",   xerxez: true, agency: false, big4: false },
  { feature: "Fixed-Price Delivery", xerxez: true, agency: false, big4: false },
  { feature: "<6 Month Delivery",    xerxez: true, agency: false, big4: false },
  { feature: "24/7 Support",         xerxez: true, agency: false, big4: true  },
  { feature: "ISO 27001 Aligned",    xerxez: true, agency: false, big4: true  },
  { feature: "Full IP Transfer",     xerxez: true, agency: false, big4: false },
];

const Mark = ({ yes }: { yes: boolean }) => (
  <i
    className={yes ? "fas fa-check-circle" : "fas fa-times-circle"}
    aria-label={yes ? "Yes" : "No"}
    style={{ color: yes ? "#22c55e" : "rgba(20,20,19,0.22)", fontSize: 16 }}
  />
);

/** Homepage "Why XERXEZ" — competitor comparison table. */
const WhyXerxez = () => (
  <section style={{ background: "#F8F4EE", padding: "96px 0 90px" }}>
    <div className="container">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans',sans-serif" }}>
            Why XERXEZ
          </span>
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
        </div>
        <h2 style={{
          fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, lineHeight: 1.12,
          color: "#141413", fontFamily: "'DM Sans',sans-serif", margin: 0,
        }}>
          Built Different, Delivered Better
        </h2>
      </div>

      {/* Comparison table — horizontally scrollable on small screens */}
      <div style={{ maxWidth: 860, margin: "0 auto", overflowX: "auto" }}>
        <table style={{
          width: "100%", minWidth: 560, borderCollapse: "separate", borderSpacing: 0,
          background: "#fff", borderRadius: 18, overflow: "hidden",
          border: "1px solid rgba(201,136,58,0.14)",
          boxShadow: "0 4px 28px rgba(0,0,0,0.07)",
          fontFamily: "'DM Sans',sans-serif",
        }}>
          <thead>
            <tr style={{ background: "#1a1208" }}>
              <th style={{ textAlign: "left", padding: "16px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                Feature
              </th>
              <th style={{ padding: "16px 18px", fontSize: 13, fontWeight: 800, color: "#E8A84E", textAlign: "center", whiteSpace: "nowrap" }}>
                XERXEZ
              </th>
              <th style={{ padding: "16px 18px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", textAlign: "center", whiteSpace: "nowrap" }}>
                Generic Agency
              </th>
              <th style={{ padding: "16px 18px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", textAlign: "center", whiteSpace: "nowrap" }}>
                Big 4 Consulting
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.feature} style={{ background: i % 2 ? "#FBF9F5" : "#fff" }}>
                <td style={{ padding: "14px 22px", fontSize: 14, fontWeight: 600, color: "#141413", borderTop: "1px solid rgba(201,136,58,0.08)" }}>
                  {r.feature}
                </td>
                <td style={{ padding: "14px 18px", textAlign: "center", borderTop: "1px solid rgba(201,136,58,0.08)", background: "rgba(201,136,58,0.055)" }}>
                  <Mark yes={r.xerxez} />
                </td>
                <td style={{ padding: "14px 18px", textAlign: "center", borderTop: "1px solid rgba(201,136,58,0.08)" }}>
                  <Mark yes={r.agency} />
                </td>
                <td style={{ padding: "14px 18px", textAlign: "center", borderTop: "1px solid rgba(201,136,58,0.08)" }}>
                  <Mark yes={r.big4} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default WhyXerxez;
