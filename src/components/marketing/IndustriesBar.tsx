import { HeartPulse, Factory, Truck, Landmark, ShoppingBag, Building2 } from "lucide-react";

const GOLD = "#C9883A";

const INDUSTRIES = [
  { icon: HeartPulse,  label: "Healthcare"    },
  { icon: Factory,     label: "Manufacturing" },
  { icon: Truck,       label: "Logistics"     },
  { icon: Landmark,    label: "Finance"       },
  { icon: ShoppingBag, label: "Retail"        },
  { icon: Building2,   label: "Government"    },
];

const CERTS = [
  "ISO 27001 Aligned",
  "SOC 2 Aligned",
  "GDPR Compliant",
  "24/7 Support",
  "NDA Protected",
];

/** Trust strip shown directly after the homepage hero: industries served + compliance pills. */
const IndustriesBar = () => (
  <section style={{
    background: "#F2EFE9",
    borderBottom: "1px solid rgba(201,136,58,0.10)",
    padding: "40px 0 36px",
  }}>
    <div className="container" style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: "rgba(20,20,19,0.45)", marginBottom: 20,
      }}>
        Trusted by enterprises across industries
      </div>

      {/* Industry pills */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 22 }}>
        {INDUSTRIES.map(({ icon: Icon, label }) => (
          <span key={label} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff", border: "1px solid rgba(201,136,58,0.18)",
            borderRadius: 999, padding: "9px 18px",
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
            color: "#3A3530", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}>
            <Icon size={15} color={GOLD} strokeWidth={2} />
            {label}
          </span>
        ))}
      </div>

      {/* Compliance / trust row */}
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        alignItems: "center", gap: "8px 22px",
      }}>
        {CERTS.map(c => (
          <span key={c} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600,
            color: "rgba(20,20,19,0.52)",
          }}>
            <i className="fas fa-check-circle" style={{ color: GOLD, fontSize: 11 }} />
            {c}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default IndustriesBar;
