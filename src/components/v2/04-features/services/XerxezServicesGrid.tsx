// XerxezServicesGrid.tsx
// Purpose: Homepage "Our Services" section — a grid of 9 service cards, each
//          linking to its /v2/services/[slug] detail page (src/page/v2/services/).
// Used in: page/v2/HomeV2.tsx
// Data source: the 9 titles / slugs / descriptions mirror the SERVICES array in
//              the existing src/components/service/ServiceSection2.tsx. Icons are
//              chosen lucide equivalents (the source used FontAwesome classes).

import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Shield, Cloud, Code, GraduationCap, Atom, Smartphone, Server, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { T, SectionHeading, LearnMore, IconTile, Reveal, ArrowRight, sectionPad } from "../../01-core/v2theme";

type Svc = { icon: LucideIcon; title: string; slug: string; desc: string };

// One entry per XERXEZ service. `slug` builds the /service/<slug> detail URL.
const SERVICES: Svc[] = [
  { icon: Brain,         title: "AI-Powered ERP",          slug: "ai-powered-erp",            desc: "Intelligent ERP that automates operations, forecasts demand, and surfaces real-time insight across every unit." },
  { icon: Shield,        title: "DevSecOps Pipelines",     slug: "devsecops-mlops-solutions", desc: "Security-embedded CI/CD and production ML infrastructure for teams that ship fast and stay compliant." },
  { icon: Cloud,         title: "Cloud Infrastructure",    slug: "cloud-service-storage",     desc: "Multi-cloud architecture and cost-optimised storage for high-throughput, data-intensive workloads." },
  { icon: Code,          title: "Software Development",     slug: "software-development",      desc: "Custom enterprise applications and technology consulting to accelerate digital transformation." },
  { icon: GraduationCap, title: "AI Training & Consulting", slug: "ai-training-consulting",    desc: "Corporate programmes that upskill teams on LLMs, MLOps, and AI-native workflows." },
  { icon: Atom,          title: "Quantum Computing",       slug: "quantum-computing",         desc: "Quantum algorithms for complex optimisation, cryptography, and next-gen enterprise computing." },
  { icon: Smartphone,    title: "Mobile Application",      slug: "mobile-application",        desc: "Native and cross-platform apps built for performance, security, and enterprise-grade UX." },
  { icon: Server,        title: "Web & Mobile Hosting",    slug: "web-mobile-hosting",        desc: "Scalable, secure hosting with a 99.9% uptime SLA across AWS, Azure, and GCP." },
  { icon: MessageSquare, title: "Software Consulting",     slug: "software-consulting",       desc: "Strategic advisory to align your software architecture with business goals and future growth." },
];

// One service card. Lifts + deepens its shadow on hover (no rotation/tilt —
// dropped per feedback that the earlier pointer-tracked 3D tilt felt off).
// Red top accent + icon tile flipping to its solid "active" state complete
// the depth cue, matching V2FeatureCard's hover treatment.
const Card = ({ s }: { s: Svc }) => {
  const [hover, setHover] = useState(false);   // drives the lift / icon tile / border / accent styling
  const Icon = s.icon;

  return (
    <Link
      to={`/v2/services/${s.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",                        // equal-height row
        background: "#fff",
        border: `1px solid ${hover ? "rgba(217,53,34,0.28)" : T.border}`,
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,   // red accent appears on hover
        borderRadius: T.rcard,
        padding: "28px 26px 26px",
        textDecoration: "none",
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? `0 24px 48px ${T.scrim(0.16)}` : T.cardShadow,
        transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms ease, border-color 220ms ease",
      }}
    >
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{
        fontFamily: T.fontHead,
        fontSize: 18,
        fontWeight: 700,
        color: T.headNavy,
        margin: "20px 0 9px",
        lineHeight: 1.3,
      }}>
        {s.title}
      </h3>
      <p style={{
        fontFamily: T.fontBody,
        fontSize: 14,
        lineHeight: 1.65,
        color: T.muted,
        margin: "0 0 20px",
        flex: 1,                               // push the "Learn more" row to the bottom
      }}>
        {s.desc}
      </p>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: T.fontHead, fontSize: 14, fontWeight: 600, color: T.red,
      }}>
        Learn more
        {/* arrow nudges right on card hover */}
        <ArrowRight size={15} style={{
          transform: hover ? "translateX(4px)" : "none",
          transition: "transform 200ms ease",
        }} />
      </span>
    </Link>
  );
};

const XerxezServicesGrid = () => (
  <section style={{ ...sectionPad, background: "#fff" }}>
    <div className="container">
      <Reveal>
        <SectionHeading
          eyebrow="Our Services"
          title={<>Enterprise solutions for every<br className="d-none d-lg-inline" /> business challenge</>}
          subtitle="From AI-native ERP to quantum computing — architected, built, and delivered end to end."
        />
      </Reveal>

      {/* 3-up on lg, 2-up on md — 9 services divide evenly into 3 full rows of 3
          (a 4-up grid left the last row with a single card and a wide gap). */}
      <div className="row g-4" style={{ marginTop: 56 }}>
        {SERVICES.map((s, i) => (
          <div key={s.slug} className="col-lg-4 col-md-6">
            {/* stagger by column position within the 3-wide row */}
            <Reveal delay={(i % 3) * 60} fill>
              <Card s={s} />
            </Reveal>
          </div>
        ))}
      </div>

      <Reveal delay={80}>
        <div style={{ marginTop: 44 }}>
          <LearnMore to="/v2/services" label="View all services" />
        </div>
      </Reveal>
    </div>
  </section>
);

export default XerxezServicesGrid;
