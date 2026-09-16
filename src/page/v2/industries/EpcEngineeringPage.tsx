// EpcEngineeringPage.tsx
// Purpose: /v2/industries/epc-engineering — fifth standalone industry detail
//          page, same architecture as ConstructionPage.tsx (hero, overview,
//          challenges, solutions, our-solution, key modules, results, then
//          the shared Why XERXEZ + CTA sections).
// Used in: src/App.tsx (route: /v2/industries/epc-engineering)
// Data source: core facts (name/tagline/features) come from the "epc" entry
//              in src/data/erpIndustriesData.tsx (INDUSTRIES) — the route
//              path uses the client-specified "epc-engineering" slug while
//              the underlying data slug stays "epc" (see INDUSTRY_PAGE_OVERRIDES
//              in XerxezHeader.tsx, which maps the header's "epc" dropdown
//              entry to this route). INDUSTRY_PAGE_CONTENT's real "epc"
//              painPoints/modules informed (cross-checked) the lists below,
//              but per the same standing decision made for every other
//              industry page, the on-page copy itself is original XERXEZ
//              voice written for this page, never copied from a competitor.
//              Results' percentages (35%, 50%, 100%) are explicit figures
//              supplied directly by the client, not model-invented. No
//              separate "why choose us" band — the shared <XerxezWhyChoose />
//              below already states XERXEZ's differentiators.

import {
  AlertTriangle, ClipboardList, Package, Users2, FileText, ShieldCheck, Bot,
  Gauge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import { getIndustryBySlug } from "../../../data/erpIndustriesData";
import {
  XerxezShell, XerxezWhyChoose, XerxezCtaBand, V2FeatureCard, IndustryHero, Checklist, DarkFeatureCard,
  T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal,
} from "../../../components/v2";

import heroImage from "../../../assets/images/industries/epc-engineering.jpg";
import illustrationImage from "../../../assets/images/industries/epc-engineering-illustration.jpg";

const industry = getIndustryBySlug("epc")!;   // real IndustryDef — slug/name/tagline/icon

const industryPad = { padding: "60px 0" };

// Original XERXEZ copy — hero/checklist phrasing per the client's exact spec
// (the underlying real `industry.features` use different wording — "Project
// cost control & procurement tracking" etc. — this page uses the
// client-specified phrasing throughout instead).
const HERO_FEATURES = ["Project controls & cost management", "Procurement & vendor management", "Multi-contract visibility"];
const HERO_SUBTITLE = "Project controls, procurement and contractor management — built for EPC and engineering teams delivering complex projects in UAE & India.";

const OVERVIEW_OPENING = "An EPC project director doesn't lose sleep over software. They lose sleep over cost overruns, procurement delays and subcontractors who miss milestones. We build the platform that gives them complete control — from FEED to mechanical completion.";
const OVERVIEW_PARA_2 = "EPC projects run across multiple engineering disciplines, tight margins and global supply chains, with contractual and regulatory requirements that vary across every site in the UAE and India. XERXEZ gives EPC contractors and engineering firms one AI-powered platform that connects project controls, procurement and subcontractor management into a single source of truth, so cost and schedule risk gets caught early instead of at project close-out.";

const CHALLENGES = [
  { title: "Cost overruns on multi-discipline projects", desc: "Spend across engineering, procurement and construction is hard to track as one picture." },
  { title: "Procurement delays across global supply chains", desc: "Long-lead items and cross-border vendors make delivery dates hard to protect." },
  { title: "Subcontractor coordination across multiple disciplines", desc: "Civil, mechanical, electrical and instrumentation teams working off different schedules." },
  { title: "Document control and engineering change management", desc: "Drawing revisions and correspondence scattered make it easy to work off an outdated version." },
  { title: "HSE compliance across large project sites", desc: "Permits, method statements and incident reporting are hard to standardize at scale." },
  { title: "Real-time project controls and earned value tracking", desc: "Schedule and cost performance is often known only after the month-end report." },
];
const SOLUTIONS = [
  { icon: Gauge, title: "Real-Time Project Controls", desc: "Schedule, cost and earned value tracked across every work package and discipline." },
  { icon: Package, title: "Connected Procurement & Supply Chain", desc: "Full procurement cycle visibility from RFQ to delivery and inspection." },
  { icon: Users2, title: "Unified Subcontractor Management", desc: "Work packages, progress claims and performance tracked across every subcontractor." },
  { icon: FileText, title: "Centralized Document Control", desc: "Drawings, specifications and correspondence always on the latest revision." },
  { icon: ShieldCheck, title: "Digital HSE Management", desc: "Permits, method statements and incident reporting standardized project-wide." },
  { icon: ClipboardList, title: "Earned Value & Forecasting", desc: "Real-time cost and completion forecasts instead of a month-end surprise." },
];
const KEY_FEATURES = [
  { title: "Project Controls & Earned Value", desc: "Real-time schedule and cost performance tracking against baseline across all disciplines and work packages." },
  { title: "Procurement & Vendor Management", desc: "Full procurement cycle management with approved vendor lists, competitive bidding and automated purchase orders." },
  { title: "Subcontractor Management", desc: "Work package control, progress billing, retention management and performance tracking for all subcontractors." },
  { title: "Document Control", desc: "Engineering drawing management, revision control, transmittals and correspondence tracking in one system." },
  { title: "HSE & Compliance", desc: "Digital permits to work, method statements, incident reporting and regulatory compliance documentation." },
  { title: "AI-Powered Project Intelligence", desc: "Predictive analytics for cost, schedule and risk — giving project directors early warning of emerging issues." },
];
// Result stats — explicit figures per user request (see Results section).
const RESULTS = [
  { v: "35%", l: "Reduction in cost overruns" },
  { v: "50%", l: "Faster procurement cycle" },
  { v: "100%", l: "Document traceability" },
  { v: "", l: "Real-time visibility across all disciplines" },
];
// "Delivered through" module cards — original XERXEZ copy naming the
// platform capabilities this page's Overview/Solution describe.
const MODULE_CARDS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Gauge, title: "Project Controls", desc: "Track schedule, cost and earned value across every work package and discipline. Real-time forecasting of final project cost and completion date. Instant alerts when variances exceed approved thresholds." },
  { icon: Package, title: "Procurement & Supply Chain", desc: "Manage the full procurement cycle from RFQ to delivery and inspection. Approved vendor lists, competitive bidding and automated PO generation. Full traceability of every material from order to installation." },
  { icon: Users2, title: "Subcontractor Management", desc: "Manage work packages, progress claims and performance across all subcontractors. Track milestones against the master schedule and flag delays before they impact critical path. Centralized communication and document sharing." },
  { icon: FileText, title: "Document Control", desc: "Centralized control of all engineering drawings, specifications and correspondence. Automated revision tracking and distribution ensures teams always work from the latest revision. Full audit trail for all document transactions." },
  { icon: ShieldCheck, title: "HSE Management", desc: "Digital HSE plans, method statements, permits to work and incident reporting. Automated compliance tracking against project HSE requirements. Real-time safety statistics and trend analysis across the project site." },
  { icon: Bot, title: "AI Assistant", desc: "Instant answers to project status, cost and schedule queries. Proactively alerts project controls teams to emerging risks and variances. Available 24/7 across mobile and desktop for field and office teams." },
];

const EpcEngineeringPage = () => (
  <XerxezShell>
    <SEO
      title={`${industry.name} AI-Powered Platform & Digital Solutions | XERXEZ`}
      description={industry.tagline}
      canonical="/v2/industries/epc-engineering"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · AI-POWERED EPC & ENGINEERING"
      heading={<>Built for EPC Contractors &amp; Engineering Firms</>}
      subtitle={HERO_SUBTITLE}
      heroImage={heroImage}
      highlights={HERO_FEATURES}
      ctaButtons={[{ label: "Book a Demo", to: "/v2/contact" }]}
      minHeight="82svh"
      maxWidth={680}
      titleSize="clamp(34px, 5vw, 56px)"
    />

    {/* ── Overview — story-driven prose (no bullets): a bold opening
        statement, then a follow-up paragraph on XERXEZ's approach. ── */}
    <section style={{ padding: "80px 0", background: "#fff" }}>
      <div className="container">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 60 }}>
          <div style={{ flex: "1 1 380px" }}>
            <Reveal>
              <Eyebrow>Overview</Eyebrow>
              <p style={{ fontFamily: T.fontHead, fontWeight: 700, fontSize: "clamp(1.3rem, 2vw, 1.6rem)", lineHeight: 1.4, color: "#0F2C4D", margin: 0 }}>
                {OVERVIEW_OPENING}
              </p>
              <p style={{ fontFamily: T.fontBody, fontSize: "1rem", fontWeight: 400, lineHeight: 1.8, color: "#5B6B7C", margin: "24px 0 0" }}>
                {OVERVIEW_PARA_2}
              </p>
            </Reveal>
          </div>
          <div style={{ flex: "1 1 380px" }}>
            <Reveal delay={80}>
              <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(7,26,51,0.15)" }}>
                <img
                  src={illustrationImage}
                  alt={`${industry.name} — engineers reviewing project drawings`}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Challenges — dark navy, 3-up lift-on-hover cards, original copy. ── */}
    <section style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading align="center" dark eyebrow="Challenges" title="Challenges in EPC &amp; Engineering" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {CHALLENGES.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard dark icon={<AlertTriangle size={22} strokeWidth={2} />} title={c.title} desc={c.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── How XERXEZ Solves It — white background, icon + title + description
        per solution, original copy paired 1:1 with the challenges above. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="How We Solve It" title="How XERXEZ Solves It" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {SOLUTIONS.map((s, i) => (
            <div key={s.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<s.icon size={22} strokeWidth={2} />} title={s.title} desc={s.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Our Solution — red-left-border checklist + CTA on the left, dark
        navy module cards on the right, with a subtle navy gradient behind
        them. 5/7 column split since the module grid needs more room than a
        plain checklist does. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: "0 0 0 50%",
        background: "linear-gradient(115deg, transparent 0%, rgba(7,26,51,0.05) 35%, rgba(7,26,51,0.09) 100%)",
        pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row g-5">
          <div className="col-lg-5">
            <Reveal>
              <SectionHeading eyebrow="Our Solution" title="Built for EPC Project Directors &amp; Engineers" subtitle="One AI-powered platform that connects project controls, procurement and subcontractor management — so cost and schedule risk gets caught early." />
              <Checklist items={HERO_FEATURES} />
              <div style={{ marginTop: 24 }}>
                <Btn to="/v2/contact">Discuss your project</Btn>
              </div>
            </Reveal>
          </div>
          <div className="col-lg-7" style={{ display: "flex" }}>
            <Reveal delay={80} fill>
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <p style={{ fontFamily: T.fontHead, fontSize: 15, fontWeight: 700, color: T.headNavy, margin: "0 0 16px" }}>
                  Delivered through
                </p>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {MODULE_CARDS.map((c) => (
                    <DarkFeatureCard key={c.title} variant="filled" icon={c.icon} title={c.title} desc={c.desc} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Key Features for EPC & Engineering — original copy, 3-up
        lift-on-hover cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Key Features" title="What's included for EPC &amp; engineering" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {KEY_FEATURES.map((m, i) => (
            <div key={m.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<ClipboardList size={22} strokeWidth={2} />} title={m.title} desc={m.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Results — dark navy stat cards, large red figure + white label.
        Tighter padding (40px, not the page's usual 60px). ── */}
    <section style={{ padding: "40px 0", background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading align="center" dark eyebrow="Results" title="What EPC contractors get" subtitle={industry.tagline} />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {RESULTS.map((r, i) => (
            <div key={r.l} className="col-lg-3 col-md-6">
              <Reveal delay={(i % 4) * 60} fill>
                <div style={{ height: "100%", textAlign: "center", padding: "30px 20px", background: "rgba(255,255,255,0.05)", borderRadius: T.rcard, border: "1px solid rgba(255,255,255,0.12)" }}>
                  {r.v ? (
                    <div style={{ fontFamily: T.fontHead, fontSize: 38, fontWeight: 800, color: T.red, lineHeight: 1, marginBottom: 10 }}>{r.v}</div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                      <Gauge size={38} strokeWidth={1.75} color={T.red} />
                    </div>
                  )}
                  <div style={{ fontFamily: T.fontBody, fontSize: 14.5, lineHeight: 1.5, color: "#fff", fontWeight: 600 }}>{r.l}</div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Why XERXEZ + closing CTA — shared sections, reused verbatim. ── */}
    <XerxezWhyChoose />
    <XerxezCtaBand />
  </XerxezShell>
);

export default EpcEngineeringPage;
