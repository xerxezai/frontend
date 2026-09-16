// XerxezServiceDeepGrid.tsx
// Purpose: Services-page "Capabilities" grid — 2-up cards, one per service,
//          each with up to 4 highlight bullets and a link to the detail page.
// Used in: page/v2/ServicesV2.tsx
// Data source: the `services` array from src/data/index.ts (title, description,
//              slug, highlights). Rendered verbatim — no invented copy.

import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Shield, Cloud, Code, MessageSquare, GraduationCap, Atom, Smartphone, Server, Building2, Sparkles, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "../../../../data";
import { T, SectionHeading, Reveal, ArrowRight, sectionPad, V2_HEADER_H } from "../../01-core/v2theme";

// Only the fields this component reads off each service object.
type Svc = {
  slug: string; title: string; description: string; highlights?: string[];
};

// slug → lucide icon. Unknown slugs fall back to <Sparkles>.
const ICON: Record<string, LucideIcon> = {
  "ai-powered-erp": Brain,
  "devsecops-mlops-solutions": Shield,
  "cloud-service-storage": Cloud,
  "software-development": Code,
  "software-consulting": MessageSquare,
  "ai-training-consulting": GraduationCap,
  "quantum-computing": Atom,
  "mobile-application": Smartphone,
  "web-mobile-hosting": Server,
  "erp-industries": Building2,   // matches SERVICE_ICONS in XerxezHeader.tsx's mega-menu
};

// White card, red icon tile top-left, red top border + 3D lift on hover
// (translateY(-10px), deeper shadow, no rotation), 0.3s ease transition.
const Card = ({ s }: { s: Svc }) => {
  const Icon = ICON[s.slug] ?? Sparkles;   // pick the icon, or the fallback
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 16,
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        padding: "30px 28px",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? "0 25px 50px rgba(7,26,51,0.20)" : "0 10px 30px rgba(7,26,51,0.08)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}>
      {/* red icon tile, top-left */}
      <span style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0, marginBottom: 18,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: T.tileBg, color: T.red,
      }}>
        <Icon size={22} strokeWidth={2} />
      </span>
      <h3 style={{
        fontFamily: T.fontHead, fontSize: 19, fontWeight: 700,
        color: T.headNavy, margin: "0 0 10px", lineHeight: 1.25,
      }}>
        {s.title}
      </h3>

      <p style={{
        fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.7,
        color: T.muted, margin: "0 0 18px",
      }}>
        {s.description}
      </p>

      {/* first 4 highlights as a check-marked list (if the service has any) */}
      {s.highlights && s.highlights.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "grid", gap: 9 }}>
          {s.highlights.slice(0, 4).map((h) => (
            <li key={h} style={{
              display: "flex", alignItems: "flex-start", gap: 9,
              fontFamily: T.fontBody, fontSize: 13.5, color: "#42566b", lineHeight: 1.5,
            }}>
              <Check size={15} strokeWidth={2.5} color={T.red} style={{ flexShrink: 0, marginTop: 2 }} />
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* margin-top:auto pins this link to the bottom so cards stay aligned */}
      <Link to={`/v2/services/${s.slug}`} style={{
        marginTop: "auto",
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: T.fontHead, fontSize: 14, fontWeight: 600, color: T.red,
        textDecoration: "none",
      }}
        onMouseOver={(e) => (e.currentTarget.style.gap = "13px")}   // arrow nudge
        onMouseOut={(e) => (e.currentTarget.style.gap = "8px")}
      >
        Learn more
        <ArrowRight size={15} />
      </Link>
    </div>
  );
};

const XerxezServiceDeepGrid = () => (
  // id="services" is the scroll target for the page hero's "Explore services" button;
  // scrollMarginTop keeps the heading clear of the fixed header when it lands
  <section id="services" style={{ ...sectionPad, background: "#F4F7FA", scrollMarginTop: V2_HEADER_H + 24 }}>
    <div className="container">
      <Reveal>
        <SectionHeading
          eyebrow="Capabilities"
          title="One partner across the full delivery lifecycle"
          subtitle="From product strategy and design to engineering, AI, cloud, and quality assurance."
        />
      </Reveal>

      {/* 3-column grid (3-3-3-1 for the 10 services) */}
      <div className="row g-4" style={{ marginTop: 52 }}>
        {/* `services` is loosely typed in the data module; cast to the fields we use */}
        {(services as unknown as Svc[]).map((s, i) => (
          <div key={s.slug} className="col-lg-4 col-md-6">
            <Reveal delay={(i % 3) * 60} fill>
              <Card s={s} />
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default XerxezServiceDeepGrid;
