// XerxezTrustedBy.tsx
// Purpose: Thin "serving UAE & India enterprises" trust strip — a row of
//          industry pills plus a row of assurance items.
// Used in: page/v2/HomeV2.tsx
// Data source: industries + assurance labels are the INDUSTRIES / CERTS arrays
//              from the existing homepage (src/components/marketing/IndustriesBar.tsx).

import { HardHat, Fuel, Building, Factory, Wrench, Landmark, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { T, Eyebrow, Reveal } from "../../01-core/v2theme";

// Industry pills — icon + label.
const INDUSTRIES: { icon: LucideIcon; label: string }[] = [
  { icon: HardHat,  label: "Engineering & EPC" },
  { icon: Fuel,     label: "Oil & Gas" },
  { icon: Building,  label: "Construction" },
  { icon: Factory,  label: "Manufacturing" },
  { icon: Wrench,   label: "Facilities Management" },
  { icon: Landmark, label: "Government Contractors" },
];

// Assurance items shown as a check-marked list below the pills.
const CERTS = [
  "AI-Native Platform",
  "UAE & India Based",
  "NDA Protected",
  "Enterprise Security",
  "Dedicated Support",
];

const XerxezTrustedBy = () => (
  // light band with a hairline border top and bottom
  <section style={{ background: T.lightAlt, padding: "56px 0", borderBlock: `1px solid ${T.border}` }}>
    <div className="container" style={{ textAlign: "center" }}>
      <Reveal>
        <Eyebrow>Serving UAE &amp; India enterprises</Eyebrow>

        {/* industry pills — wrap and stay centred */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 4 }}>
          {INDUSTRIES.map(({ icon: Icon, label }) => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "#fff",
              border: `1px solid ${T.border}`,
              borderRadius: 999,
              padding: "10px 18px",
              fontFamily: T.fontHead,
              fontSize: 13.5,
              fontWeight: 500,
              color: T.headNavy,
            }}>
              <Icon size={15} strokeWidth={2} color={T.red} />
              {label}
            </span>
          ))}
        </div>

        {/* assurance list — red ticks */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "10px 26px", marginTop: 22,
        }}>
          {CERTS.map((c) => (
            <span key={c} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontFamily: T.fontBody, fontSize: 13, fontWeight: 500, color: T.muted,
            }}>
              <Check size={14} strokeWidth={2.5} color={T.red} />
              {c}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

export default XerxezTrustedBy;
