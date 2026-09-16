// XerxezTrainingCard.tsx
// Purpose: The dark "next cohort" card shown in the training page hero's right
//          slot — programme name, format/duration pills, 4 highlight points,
//          and a "Reserve your seat" CTA. Kept deliberately compact (13px
//          type throughout, 16px padding, 8px gaps between blocks, no
//          seats-filled counter or trust-badge row) so it fits inside the
//          hero's exact height alongside the text column.
// Used in: page/v2/TrainingV2.tsx (hero right slot)
// Data source: cohort details (name, format, duration) are the same figures
//              shown on the existing TrainingPage's CohortCard
//              (src/page/TrainingPage.tsx). No confirmed start date yet, so
//              the cohort date reads "Coming Soon" rather than a specific one.

import { Link } from "react-router-dom";
import { Tv, Clock, CheckCircle2 } from "lucide-react";
import { T } from "../../01-core/v2theme";

// The 2 quick-fact pills.
const INFO_PILLS = [
  { icon: Tv,    label: "Format",   val: "Live" },
  { icon: Clock, label: "Duration", val: "8 Weeks" },
];

// The 4 highlight points, each with a red checkmark.
const HIGHLIGHTS = [
  "Live instructor-led sessions — not pre-recorded",
  "Real project labs using enterprise datasets",
  "Certificate on completion — CPD accredited",
  "Direct access to practitioners who've shipped AI in production",
];

const XerxezTrainingCard = () => (
  <div style={{
    position: "relative", overflow: "hidden",
    background: T.navy, border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16, padding: 22,
    boxShadow: "0 30px 60px rgba(7,26,51,0.45)",
  }}>
    {/* red glow, bottom-right — matches the hero's decorative glow language */}
    <div aria-hidden="true" style={{
      position: "absolute", bottom: "-35%", right: "-20%", width: 260, height: 260, borderRadius: "50%",
      background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 70%)`, filter: "blur(20px)", pointerEvents: "none",
    }} />

    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 11 }}>
      {/* top: "ENROLLING NOW" pill + next-cohort date */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#16a34a", color: "#fff",
          fontFamily: T.fontHead, fontSize: 13, fontWeight: 700,
          padding: "4px 10px", borderRadius: 999,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
          ENROLLING NOW
        </span>
        <span style={{ fontFamily: T.fontBody, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
          Next cohort · Coming Soon
        </span>
      </div>

      <h3 style={{ fontFamily: T.fontHead, fontSize: 13, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.3 }}>
        AI Practitioner Program
      </h3>
      <p style={{
        fontFamily: T.fontBody, fontSize: 13, lineHeight: 1.4, color: "rgba(255,255,255,0.68)", margin: 0,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        Hands-on, certification-backed training for enterprise AI practitioners.
      </p>

      {/* 2 info pills */}
      <div style={{ display: "flex", gap: 8 }}>
        {INFO_PILLS.map((p) => (
          <div key={p.label} style={{
            display: "flex", alignItems: "center", gap: 8, flex: 1,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 12, padding: "10px 14px",
          }}>
            <p.icon size={16} strokeWidth={2} color={T.redLight} />
            <span>
              <span style={{ display: "block", fontFamily: T.fontHead, fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{p.val}</span>
              <span style={{ display: "block", fontFamily: T.fontBody, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{p.label}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.10)" }} />

      {/* 4 highlight points */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HIGHLIGHTS.map((h) => (
          <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <CheckCircle2 size={15} strokeWidth={2.5} color={T.red} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: T.fontBody, fontSize: 13, lineHeight: 1.4, color: "rgba(255,255,255,0.82)" }}>
              {h}
            </span>
          </div>
        ))}
      </div>

      {/* CTA → /v2 contact page */}
      <Link to="/v2/contact" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: T.red, color: "#fff",
        fontFamily: T.fontHead, fontSize: 13, fontWeight: 600,
        padding: "15px 22px", borderRadius: T.rx, textDecoration: "none",
        boxShadow: `0 10px 24px ${T.redGlow}`, marginTop: 8,
      }}>
        Reserve your seat →
      </Link>
      <p style={{ fontFamily: T.fontBody, fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", margin: 0 }}>
        CPD Accredited · Register your interest now
      </p>
    </div>
  </div>
);

export default XerxezTrainingCard;
