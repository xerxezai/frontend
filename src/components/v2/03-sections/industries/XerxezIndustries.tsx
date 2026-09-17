// XerxezIndustries.tsx
// Purpose: The homepage's signature interactive section. Visitor picks their
//          industry from the left list; the right panel updates to that sector's
//          ERP focus (name, tagline, feature bullets, "Explore industry" link).
// Used in: page/v2/HomeV2.tsx
// Data source: src/data/erpIndustriesData.ts (INDUSTRIES) — slug, name,
//              shortName, tagline, features, icon. Nothing invented.

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { INDUSTRIES, industryLabel } from "../../../../data/erpIndustriesData";
import { T, SectionHeading, Btn, Reveal, DotGrid, sectionPad } from "../../01-core/v2theme";
import epcHero from "../../../../assets/images/industries/epc-engineering.jpg";
import oilGasHero from "../../../../assets/images/industries/oil-gas.jpg";
import constructionHero from "../../../../assets/images/industries/construction.jpg";
import manufacturingHero from "../../../../assets/images/industries/manufacturing.jpg";
import facilityManagementHero from "../../../../assets/images/industries/facility-management.jpg";
import healthcareHero from "../../../../assets/images/industries/healthcare.jpg";

// Show the first 6 industries so the list fits without scrolling. These 6
// slugs are exactly the ones with a standalone /v2/industries/* page — only
// "epc" needs remapping, since its v2 route is "epc-engineering".
const LIST = INDUSTRIES.slice(0, 6);
const industryRoute = (slug: string) => `/industries/${slug === "epc" ? "epc-engineering" : slug}`;

// Right-panel background photo per industry, keyed by slug — matches LIST 1:1.
const HERO_IMAGE: Record<string, string> = {
  "epc": epcHero,
  "oil-gas": oilGasHero,
  "construction": constructionHero,
  "manufacturing": manufacturingHero,
  "facility-management": facilityManagementHero,
  "healthcare": healthcareHero,
};

const XerxezIndustries = () => {
  const [active, setActive] = useState(0);   // index of the selected industry
  const sel = LIST[active];                  // the currently-shown industry object
  const SelIcon = sel.icon;                  // its icon component (for the detail panel)

  return (
    <section style={{ ...sectionPad, background: T.navyGrad, position: "relative", overflow: "hidden" }}>
      {/* faint dot-grid texture over the gradient */}
      <DotGrid />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            dark
            eyebrow="Industries We Serve"
            title={<>Domain expertise across the<br className="d-none d-lg-inline" /> industries that move the world</>}
            subtitle="XERXEZ understands regulated workflows, operational complexity, and the pace of digital growth. Pick your sector."
          />
        </Reveal>

        {/* align-items:stretch → the two columns match height */}
        <div className="row g-4 g-lg-5" style={{ marginTop: 54, alignItems: "stretch" }}>
          {/* ── Left: the selectable industry list ── */}
          <div className="col-lg-5">
            <Reveal>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {LIST.map((ind, i) => {
                  const Icon = ind.icon;
                  const on = i === active;             // is this the selected row?
                  return (
                    <button
                      key={ind.slug}
                      type="button"
                      onClick={() => setActive(i)}     // select this industry
                      aria-pressed={on}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        width: "100%",
                        textAlign: "left",
                        padding: "16px 18px",
                        borderRadius: T.rcard,
                        cursor: "pointer",
                        // selected → red-tinted border + fill; otherwise faint white
                        border: `1px solid ${on ? "rgba(217,53,34,0.55)" : "rgba(255,255,255,0.10)"}`,
                        background: on ? "rgba(217,53,34,0.14)" : "rgba(255,255,255,0.04)",
                        transition: "background 180ms ease, border-color 180ms ease",
                      }}
                    >
                      {/* icon tile — solid red when selected */}
                      <span style={{
                        width: 42, height: 42, flexShrink: 0, borderRadius: 12,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        background: on ? T.red : "rgba(255,255,255,0.08)",
                        color: "#fff",
                      }}>
                        <Icon size={19} strokeWidth={2} />
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        {/* short industry name */}
                        <span style={{
                          display: "block",
                          fontFamily: T.fontHead, fontSize: 15.5, fontWeight: 600,
                          color: "#fff",
                        }}>
                          {industryLabel(ind)}
                        </span>
                        {/* one-line tagline, truncated with an ellipsis */}
                        <span style={{
                          display: "block",
                          fontFamily: T.fontBody, fontSize: 12.5, lineHeight: 1.5,
                          color: "rgba(255,255,255,0.6)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {ind.tagline}
                        </span>
                      </span>
                      {/* chevron — brightens when selected */}
                      <ChevronRight size={16} color={on ? "#ff8571" : "rgba(255,255,255,0.35)"} style={{ flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* ── Right: detail panel for the selected industry ── */}
          <div className="col-lg-7">
            <Reveal delay={80} fill>
              <div style={{
                position: "relative",
                height: "100%",
                minHeight: 380,                       // keep the panel tall even for short content
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20,
                padding: "clamp(24px, 4vw, 44px)",
                overflow: "hidden",                    // clip the background photo to the rounded corners
              }}>
                {/* background photo layer — one <img> per industry, cross-faded via opacity
                    so switching industries transitions smoothly instead of popping */}
                {LIST.map((ind, i) => (
                  <img
                    key={ind.slug}
                    src={HERO_IMAGE[ind.slug]}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover",
                      opacity: i === active ? 1 : 0,
                      transition: "opacity 500ms ease",
                      zIndex: 0,
                    }}
                  />
                ))}
                {/* dark overlay so the white/red text stays readable over any photo */}
                <div aria-hidden="true" style={{
                  position: "absolute", inset: 0,
                  background: "rgba(7,26,51,0.75)",
                  zIndex: 1,
                }} />

                {/* text content — lifted above the photo + overlay layers (both position:absolute
                    with a z-index), so it needs its own stacking context on top of them */}
                <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* header: red icon tile + "01 — Industry focus" kicker */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      background: T.red, color: "#fff",
                      boxShadow: `0 8px 20px ${T.redGlow}`,
                    }}>
                      <SelIcon size={24} strokeWidth={2} />
                    </span>
                    <span style={{
                      fontFamily: T.fontBody, fontSize: 12, fontWeight: 600,
                      letterSpacing: "0.24em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}>
                      {String(active + 1).padStart(2, "0")} — Industry focus
                    </span>
                  </div>

                  {/* full industry name */}
                  <h3 style={{
                    fontFamily: T.fontHead,
                    fontSize: "clamp(24px, 3vw, 34px)",
                    fontWeight: 800,
                    color: "#fff",
                    margin: "22px 0 14px",
                    lineHeight: 1.2,
                    letterSpacing: "-0.015em",
                  }}>
                    {sel.name}
                  </h3>

                  <p style={{
                    fontFamily: T.fontBody, fontSize: 16, lineHeight: 1.7,
                    color: "rgba(255,255,255,0.78)", margin: "0 0 22px",
                  }}>
                    {sel.tagline}
                  </p>

                  {/* feature bullets with a small red dot */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "grid", gap: 10 }}>
                    {sel.features.map((f) => (
                      <li key={f} style={{
                        display: "flex", alignItems: "flex-start", gap: 10,
                        fontFamily: T.fontBody, fontSize: 14.5, color: "rgba(255,255,255,0.72)",
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%", background: T.redLight,
                          flexShrink: 0, marginTop: 8,
                        }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* margin-top:auto pins the button to the bottom of the panel */}
                  <div style={{ marginTop: "auto" }}>
                    <Btn to={industryRoute(sel.slug)}>Explore industry</Btn>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default XerxezIndustries;
