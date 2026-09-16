// ManufacturingPage.tsx
// Purpose: /v2/industries/manufacturing — sixth standalone industry detail
//          page, same architecture as ConstructionPage.tsx (hero, overview,
//          challenges, solutions, our-solution, key modules, results, then
//          the shared Why XERXEZ + CTA sections).
// Used in: src/App.tsx (route: /v2/industries/manufacturing)
// Data source: core facts (name/tagline/features) come from the
//              "manufacturing" entry in src/data/erpIndustriesData.tsx
//              (INDUSTRIES), which has its own specific painPoints/modules
//              in INDUSTRY_PAGE_CONTENT. That real content informed
//              (cross-checked) the lists below, but per the client's own
//              detailed brief for this page, the on-page copy itself is
//              original XERXEZ voice written for this page — never copied
//              from a competitor. Results' percentages (40%, 35%, 50%) are
//              explicit figures supplied directly by the client, not
//              model-invented. No separate "why choose us" band — the
//              shared <XerxezWhyChoose /> below already states XERXEZ's
//              differentiators.

import {
  AlertTriangle, CalendarClock, Package, ShieldCheck, Truck, Users2, Bot,
  Factory,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import { getIndustryBySlug } from "../../../data/erpIndustriesData";
import {
  XerxezShell, XerxezWhyChoose, XerxezCtaBand, V2FeatureCard, IndustryHero, Checklist, DarkFeatureCard,
  T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal,
} from "../../../components/v2";

import heroImage from "../../../assets/images/industries/manufacturing.jpg";
import illustrationImage from "../../../assets/images/industries/manufacturing-illustration.jpg";

const industry = getIndustryBySlug("manufacturing")!;   // real IndustryDef — slug/name/tagline/icon

const industryPad = { padding: "60px 0" };

// Original XERXEZ copy — hero/checklist phrasing per the client's exact spec.
const HERO_FEATURES = ["Production planning & scheduling", "Inventory & materials control", "Quality management"];
const HERO_SUBTITLE = "Production planning, inventory control and quality management — built for manufacturers in UAE & India.";

const OVERVIEW_OPENING = "A plant manager doesn't lose sleep over software. They lose sleep over production stoppages, raw material shortages and quality rejections that delay shipments. We build the platform that keeps every line running, every order tracked and every delivery on time.";
const OVERVIEW_PARA_2 = "Manufacturers in the UAE and India are balancing production efficiency against a supply chain that can shift without warning, all while holding to the quality standards their customers and export markets demand. XERXEZ gives plant managers and production teams one AI-powered platform that connects production planning, inventory and quality management into a single view — so a shortage or a defect gets caught on the floor, not at the customer.";

const CHALLENGES = [
  { title: "Production stoppages due to material shortages", desc: "Lines go idle when raw material levels aren't tracked in real time." },
  { title: "Poor visibility of shop floor operations in real time", desc: "Supervisors find out about a delay after it's already cost the shift." },
  { title: "Quality rejections and rework costs", desc: "Defects caught late in the process cost far more to fix than at the source." },
  { title: "Inefficient production planning and scheduling", desc: "Manual scheduling leaves capacity idle on some lines and overloaded on others." },
  { title: "Supply chain disruptions affecting raw materials", desc: "A single supplier delay can stall production across multiple product lines." },
  { title: "Compliance with industry and export standards", desc: "Manual documentation makes it hard to stay audit-ready for every market you ship to." },
];
const SOLUTIONS = [
  { icon: CalendarClock, title: "Optimized Production Scheduling", desc: "Production plans built and tracked against real capacity across every line and shift." },
  { icon: Package, title: "Real-Time Inventory Control", desc: "Live visibility of raw materials, WIP and finished goods across every warehouse." },
  { icon: ShieldCheck, title: "Built-In Quality Management", desc: "Inspection and non-conformance tracking at every stage, not just at final QC." },
  { icon: CalendarClock, title: "Capacity-Aware Planning", desc: "Schedules that account for real machine and labour capacity, not guesswork." },
  { icon: Truck, title: "Connected Supplier Management", desc: "Approved suppliers and delivery tracking to catch disruptions before they stop a line." },
  { icon: Factory, title: "Export-Ready Compliance", desc: "Documentation collected continuously, audit-ready for every market you serve." },
];
const KEY_FEATURES = [
  { title: "Production Planning & Scheduling", desc: "Build optimised production schedules, track work orders in real time and maximise capacity utilisation across all lines." },
  { title: "Inventory & Materials Control", desc: "Real-time stock visibility, automated reorder triggers and full traceability from raw material to finished product." },
  { title: "Quality Management", desc: "Digital inspection records, non-conformance reporting and root cause analysis to reduce defects and rework costs." },
  { title: "Procurement & Supplier Management", desc: "Full procurement cycle with approved suppliers, competitive bidding, automated POs and delivery tracking." },
  { title: "Shop Floor Management", desc: "Real-time visibility of every production line, work centre and operator — from supervisor dashboard to CEO level." },
  { title: "AI-Powered Production Intelligence", desc: "Predictive analytics for demand, capacity and quality — giving plant managers early warning of emerging production risks." },
];
// Result stats — explicit figures per user request (see Results section).
const RESULTS = [
  { v: "40%", l: "Reduction in production stoppages" },
  { v: "35%", l: "Improvement in on-time delivery" },
  { v: "50%", l: "Reduction in quality rejections" },
  { v: "", l: "Real-time visibility across all production lines" },
];
// "Delivered through" module cards — original XERXEZ copy naming the
// platform capabilities this page's Overview/Solution describe.
const MODULE_CARDS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: CalendarClock, title: "Production Planning & Scheduling", desc: "Build and manage production schedules across all lines and shifts. Real-time tracking of work orders against plan with instant alerts on delays. Optimise capacity utilisation and reduce idle time across all production assets." },
  { icon: Package, title: "Inventory & Materials Control", desc: "Real-time visibility of raw materials, WIP and finished goods across all warehouses. Automated reorder triggers prevent production stoppages due to material shortages. Full traceability from supplier to finished product." },
  { icon: ShieldCheck, title: "Quality Management", desc: "Digital quality checklists, inspection records and non-conformance reporting at every production stage. Root cause analysis tools reduce recurring defects and rework costs. Full traceability for customer complaints and product recalls." },
  { icon: Truck, title: "Procurement & Supplier Management", desc: "Manage the full procurement cycle with approved supplier lists and competitive bidding. Automated PO generation, delivery tracking and invoice matching. Supplier performance scorecards drive continuous improvement." },
  { icon: Users2, title: "HR & Labour Management", desc: "Track attendance, skills, certifications and productivity for all production staff. Automated payroll processing with shift allowances and overtime calculations. Ensure only trained and certified operators run critical equipment." },
  { icon: Bot, title: "AI Assistant", desc: "Instant answers to production, inventory and quality queries. Proactive alerts on material shortages, quality trends and schedule risks. Available 24/7 to plant managers and production supervisors across mobile and desktop." },
];

const ManufacturingPage = () => (
  <XerxezShell>
    <SEO
      title={`${industry.name} AI-Powered Platform & Digital Solutions | XERXEZ`}
      description={industry.tagline}
      canonical="/v2/industries/manufacturing"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · AI-POWERED MANUFACTURING"
      heading={<>Built for Manufacturers &amp; Production Teams</>}
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
                  alt={`${industry.name} — automated production line equipment`}
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
          <SectionHeading align="center" dark eyebrow="Challenges" title="Challenges in Manufacturing" />
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
              <SectionHeading eyebrow="Our Solution" title="Built for Plant Managers &amp; Production Teams" subtitle="One AI-powered platform that connects production planning, inventory and quality — so a shortage or a defect gets caught on the floor, not at the customer." />
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

    {/* ── Key Features for Manufacturing — original copy, 3-up
        lift-on-hover cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Key Features" title="What's included for manufacturing" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {KEY_FEATURES.map((m, i) => (
            <div key={m.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<Factory size={22} strokeWidth={2} />} title={m.title} desc={m.desc} />
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
          <SectionHeading align="center" dark eyebrow="Results" title="What manufacturers get" subtitle={industry.tagline} />
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
                      <Factory size={38} strokeWidth={1.75} color={T.red} />
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

export default ManufacturingPage;
