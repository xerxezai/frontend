// IndustryCards.tsx
// Purpose: The two card types repeated across every /v2/industries/* and
//          /v2/iot/* detail page — a red-tick "Checklist" row and a dark
//          navy "DarkFeatureCard" (this replaces the two nearly-identical,
//          independently-invented card families those pages used to
//          hand-roll: industries' "ModuleCard" and IoT's "DarkCard"). Both
//          previously lived copy-pasted in 5-7 files each; this is the one
//          place they're defined now.
// Used in: page/v2/industries/*.tsx, page/v2/iot/*.tsx
// Data source: none — pure layout. Callers pass the copy/icons.

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { T } from "./v2theme";

// ── <Checklist> ─────────────────────────────────────────────────────────
// A list of short labels, each with a red checkmark. Two visual variants:
// "card" — a white, shadowed, red-left-border row per item (the pattern
// ConstructionPage/EpcEngineeringPage/HealthcarePage/FacilityManagementPage/
// ManufacturingPage all used); "row" — a plain row with no card chrome
// (OilGasPage's simpler treatment). Defaults to "card" since 5 of the 6
// industry pages use it.
export const Checklist = ({
  items,
  variant = "card",
}: {
  items: string[];
  variant?: "card" | "row";
}) => (
  <div style={{ display: "grid", gap: variant === "card" ? 8 : 12, marginTop: 26 }}>
    {items.map((f) => (
      <div
        key={f}
        style={
          variant === "card"
            ? {
                display: "flex", alignItems: "center", gap: 12,
                background: "#fff", borderLeft: "3px solid #D93522", borderRadius: 10,
                padding: "12px 14px", boxShadow: "0 6px 16px rgba(16,42,77,0.07)",
              }
            : { display: "flex", alignItems: "flex-start", gap: 10 }
        }
      >
        <span style={{
          width: variant === "card" ? 26 : 22, height: variant === "card" ? 26 : 22,
          borderRadius: "50%", flexShrink: 0, marginTop: variant === "card" ? 0 : 1,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "rgba(217,53,34,0.1)", color: T.red,
        }}>
          <CheckCircle2 size={variant === "card" ? 14 : 13} strokeWidth={3} />
        </span>
        <span style={{
          fontFamily: variant === "card" ? T.fontHead : T.fontBody,
          fontSize: variant === "card" ? 14.5 : 15,
          lineHeight: variant === "card" ? 1.4 : 1.6,
          color: T.headNavy, fontWeight: variant === "card" ? 700 : 500,
        }}>
          {f}
        </span>
      </div>
    ))}
  </div>
);

// ── <DarkFeatureCard> ─────────────────────────────────────────────────────
// Dark navy card — red icon tile (filled or outline via `variant`), an
// optional faded numbered index, 3D lift on hover (translateY(-8px), deeper
// shadow, red border), no rotation. Covers what were two separate,
// independently-built card families:
//  - industries' "ModuleCard" → variant="filled", no index
//  - IoT's "DarkCard"         → variant="outline", optional index
export const DarkFeatureCard = ({
  icon: Icon, title, desc, index, variant = "outline",
}: {
  icon: LucideIcon; title: string; desc: string; index?: number;
  variant?: "filled" | "outline";
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: T.navy, borderRadius: 16, padding: "24px 22px",
        border: `1px solid ${hover ? T.red : "rgba(255,255,255,0.08)"}`,
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? "0 24px 48px rgba(7,26,51,0.35)" : "0 10px 30px rgba(7,26,51,0.20)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        {variant === "outline" ? (
          <span style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: `1.5px solid ${T.red}`, color: T.red,
          }}>
            <Icon size={18} strokeWidth={2} />
          </span>
        ) : (
          <span style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "rgba(217,53,34,0.16)", color: T.redLight,
          }}>
            <Icon size={18} strokeWidth={2} />
          </span>
        )}
        {index !== undefined && (
          <span style={{ fontFamily: T.fontHead, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};
