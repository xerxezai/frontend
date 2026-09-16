// XerxezWhyChoose.tsx
// Purpose: "Why XERXEZ" section — heading + CTA, then a 6-card grid naming
//          XERXEZ's own differentiators (icon + title + description).
// Used in: page/v2/HomeV2.tsx, and (via XerxezServiceTemplate) all 10
//          /v2/services/[slug] pages.
// Data source: the 6 differentiator labels are the same ones the existing
//              site's "Why XERXEZ" table names (src/components/marketing/
//              WhyXerxez.tsx) — this version drops that table's XERXEZ-vs-
//              agency-vs-Big-4 comparison columns and just states XERXEZ's
//              own strength for each, in plain marketing copy consistent
//              with claims made elsewhere on the site (ISO 27001, full IP
//              transfer, etc. — see src/data/index.ts `services`). The
//              security item states ISO 27001 only (not SOC 2) — SOC 2
//              wasn't a verified claim.
// This is the single shared "Why XERXEZ" implementation — every /v2 page
// that shows this section (Home, About, Services, all 10 service detail
// pages via XerxezServiceTemplate, and both industry detail pages) renders
// this same component rather than a page-local copy, so any copy change
// here (like the security item below) applies everywhere automatically.

import { Sparkles, Tag, Clock, Headphones, Shield, Key } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { T, SectionHeading, Btn, Reveal, sectionPad } from "../../01-core/v2theme";
import { V2FeatureCard } from "../../01-core/v2page";

// Each item: an icon, the differentiator title, and a one-line description.
// Exported so other pages (e.g. industry detail pages) can reuse a subset of
// these same real differentiators in their own layout instead of retyping them.
export const WHY_XERXEZ_ITEMS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Sparkles,   title: "AI-Native Platform",        desc: "Every module ships with AI built in from day one — not bolted on after the fact." },
  { icon: Tag,        title: "Fixed-Price Delivery",      desc: "Clear scope and a clear budget agreed up front — no surprise change orders mid-project." },
  { icon: Clock,      title: "Under 6-Month Delivery",    desc: "From kickoff to production, most engagements go live inside two quarters, not two years." },
  { icon: Headphones, title: "24/7 Support",              desc: "Round-the-clock monitoring and response — not office-hours-only coverage." },
  { icon: Shield,     title: "ISO 27001 Certified Security", desc: "ISO 27001 certified security practices built into every deployment — your data stays protected and compliant at all times." },
  { icon: Key,        title: "Full IP Transfer",          desc: "You own the code, the documentation, and the deployment — no lock-in, ever." },
];

const XerxezWhyChoose = () => (
  <section style={{ ...sectionPad, background: T.lightAlt }}>
    <div className="container">
      {/* header row: heading on the left, CTA bottom-aligned on the right */}
      <div className="row g-4 align-items-end" style={{ marginBottom: 52 }}>
        <div className="col-lg-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why XERXEZ"
              title="Built different, delivered better"
              subtitle="The differences that matter when the platform has to run the business."
            />
          </Reveal>
        </div>
        <div className="col-lg-4" style={{ textAlign: "left" }}>
          <Reveal delay={80}>
            <Btn to="/v2/contact">Discuss your project</Btn>
          </Reveal>
        </div>
      </div>

      {/* 3-up card grid (2-up on md) */}
      <div className="row g-4">
        {WHY_XERXEZ_ITEMS.map((it, i) => (
          <div key={it.title} className="col-lg-4 col-md-6">
            {/* stagger by column position (0 / 60 / 120ms); `fill` keeps the row level */}
            <Reveal delay={(i % 3) * 60} fill>
              <V2FeatureCard
                icon={<it.icon size={22} strokeWidth={2} />}
                title={it.title}
                desc={it.desc}
              />
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default XerxezWhyChoose;
