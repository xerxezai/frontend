import { HardHat, Fuel, Building, Factory, Wrench, Landmark } from "lucide-react";

const GOLD = "#C9883A";

const INDUSTRIES = [
  { icon: HardHat,  label: "Engineering & EPC"      },
  { icon: Fuel,     label: "Oil & Gas"              },
  { icon: Building, label: "Construction"           },
  { icon: Factory,  label: "Manufacturing"          },
  { icon: Wrench,   label: "Facilities Management"  },
  { icon: Landmark, label: "Government Contractors" },
];

const CERTS = [
  "AI-Native Platform",
  "UAE Based & Supported",
  "NDA Protected",
  "Enterprise Security",
  "Dedicated Support",
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
        animation: "xzIndFadeUp 0.5s ease both",
      }}>
        Trusted by enterprises across industries
      </div>

      {/* Industry pills */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 22 }}>
        {INDUSTRIES.map(({ icon: Icon, label }, i) => (
          <span
            key={label}
            className="xz-ind-pill"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", border: "1px solid rgba(201,136,58,0.18)",
              borderRadius: 999, padding: "9px 18px",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
              color: "#3A3530", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              cursor: "default",
              animation: `xzIndFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${0.08 + i * 0.06}s both`,
            }}
          >
            <Icon size={15} color={GOLD} strokeWidth={2} />
            {label}
          </span>
        ))}
      </div>

      {/* Compliance / trust row */}
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        alignItems: "center", gap: "8px 22px",
        animation: "xzIndFadeUp 0.5s ease 0.42s both",
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

    <style>{`
      @keyframes xzIndFadeUp {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
      }
      .xz-ind-pill { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
      .xz-ind-pill:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(201,136,58,0.18);
        border-color: rgba(201,136,58,0.40);
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }
    `}</style>
  </section>
);

export default IndustriesBar;
