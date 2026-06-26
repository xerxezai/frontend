const features = [
  "AI-Native ERP Capabilities",
  "ISO 27001 + SOC 2 Type II",
  "Multi-Cloud (AWS · Azure · GCP)",
  "MLOps & Data Pipeline Expertise",
  "Custom Enterprise Software",
  "24/7 Dedicated Support Teams",
  "DevSecOps-Embedded Security",
];

type Mark = "yes" | "no" | "partial";

const grid: Mark[][] = [
  ["no",  "partial", "yes"],
  ["no",  "no",      "yes"],
  ["no",  "partial", "yes"],
  ["no",  "partial", "yes"],
  ["no",  "no",      "yes"],
  ["no",  "partial", "yes"],
  ["no",  "no",      "yes"],
];

const MarkIcon = ({ mark }: { mark: Mark }) => {
  if (mark === "yes") return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: "50%",
      background: "rgba(201,136,58,0.12)",
    }}>
      <i className="fas fa-check" style={{ color: "#C9883A", fontSize: 12 }} />
    </span>
  );
  if (mark === "no") return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: "50%",
      background: "rgba(239,68,68,0.08)",
    }}>
      <i className="fas fa-times" style={{ color: "#ef4444", fontSize: 12 }} />
    </span>
  );
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: "50%",
      background: "rgba(245,158,11,0.10)",
    }}>
      <i className="fas fa-minus" style={{ color: "#f59e0b", fontSize: 12 }} />
    </span>
  );
};

const ComparisonSection = () => {
  const cols = [
    { label: "Generic Agencies", highlight: false },
    { label: "Other IT Firms",   highlight: false },
    { label: "XERXEZ",           highlight: true, badge: "Best Choice ✓" },
  ];

  return (
    <section className="fix section-padding" style={{ background: "#F5F5F7" }}>
      <div className="container">
        <div className="section-title text-center mb-50">
          <span className="fade-in">Why Choose Us</span>
          <h2 className="char-animation">Why Enterprises Choose XERXEZ</h2>
          <p style={{ color: "#4B4B4B", maxWidth: 560, margin: "0 auto" }}>
            See how we stack up against generic agencies and other IT firms across
            the capabilities that matter most to enterprise clients.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 560 }}>
            <thead>
              <tr>
                <th style={{ width: "34%", padding: "16px 20px", textAlign: "left" }} />
                {cols.map((col) => (
                  <th
                    key={col.label}
                    style={{
                      width: "22%",
                      padding: "20px 16px",
                      textAlign: "center",
                      background: col.highlight ? "#C9883A" : "#ffffff",
                      color: col.highlight ? "#ffffff" : "#0A0A0A",
                      fontWeight: 700,
                      fontSize: 15,
                      borderRadius: col.highlight ? "12px 12px 0 0" : "8px 8px 0 0",
                      border: col.highlight ? "none" : "1px solid #E5E5E5",
                      borderBottom: "none",
                      position: "relative",
                    }}
                  >
                    {col.highlight && col.badge && (
                      <div style={{
                        position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                        background: "#ff792e", color: "#fff", fontSize: 11, fontWeight: 700,
                        padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap",
                        letterSpacing: "0.05em",
                      }}>
                        {col.badge}
                      </div>
                    )}
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feat, ri) => (
                <tr key={feat} style={{ background: ri % 2 === 0 ? "#ffffff" : "#F9F9FC" }}>
                  <td style={{
                    padding: "16px 20px",
                    fontSize: 14, fontWeight: 500, color: "#0A0A0A",
                    borderBottom: "1px solid #E5E5E5",
                    borderLeft: "1px solid #E5E5E5",
                  }}>
                    {feat}
                  </td>
                  {grid[ri].map((mark, ci) => (
                    <td
                      key={ci}
                      style={{
                        textAlign: "center",
                        padding: "16px 16px",
                        borderBottom: "1px solid " + (cols[ci].highlight ? "rgba(255,255,255,0.15)" : "#E5E5E5"),
                        borderRight: ci === 2 ? "1px solid " + (cols[ci].highlight ? "transparent" : "#E5E5E5") : "none",
                        background: cols[ci].highlight
                          ? "rgba(201,136,58,0.06)"
                          : "transparent",
                      }}
                    >
                      <MarkIcon mark={mark} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td style={{
                  padding: "0 20px 0 20px",
                  borderLeft: "1px solid #E5E5E5",
                  borderBottom: "1px solid #E5E5E5",
                }} />
                {cols.map((col, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "0",
                      background: col.highlight ? "#C9883A" : "#ffffff",
                      borderRadius: col.highlight ? "0 0 12px 12px" : "0 0 8px 8px",
                      height: 8,
                      border: col.highlight ? "none" : "1px solid #E5E5E5",
                      borderTop: "none",
                    }}
                  />
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#4B4B4B" }}>
            <MarkIcon mark="yes" /> Available
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#4B4B4B" }}>
            <MarkIcon mark="partial" /> Partial / Limited
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#4B4B4B" }}>
            <MarkIcon mark="no" /> Not Available
          </span>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;

