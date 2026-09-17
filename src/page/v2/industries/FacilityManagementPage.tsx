// FacilityManagementPage.tsx
// Purpose: /industries/facility-management — fourth standalone industry
//          detail page, same architecture as ConstructionPage.tsx /
//          HealthcarePage.tsx (hero, overview, challenges, solutions,
//          our-solution, key modules, results, shared Why XERXEZ + CTA).
// Used in: src/App.tsx (route: /industries/facility-management)
// Data source: core facts (name/tagline/features) come from the
//              "facility-management" entry in src/data/erpIndustriesData.tsx
//              (INDUSTRIES), which — unlike healthcare — does have its own
//              specific painPoints/modules in INDUSTRY_PAGE_CONTENT rather
//              than the shared GENERIC_CONTENT fallback. That real content
//              informed (cross-checked) the lists below, but per the user's
//              own detailed brief for this page, the on-page copy itself is
//              original XERXEZ voice written for this page — never copied
//              from a competitor. Results' percentages (40%, 50%, 30%, 100%)
//              are explicit figures supplied directly by the client, not
//              model-invented. No separate "why choose us" band — the
//              shared <XerxezWhyChoose /> below already states XERXEZ's
//              differentiators.

import {
  AlertTriangle, Wrench, ClipboardList, Zap, Users2, ShieldCheck, Bot,
  Building2, HardHat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import { getIndustryBySlug } from "../../../data/erpIndustriesData";
import {
  XerxezShell, XerxezWhyChoose, XerxezCtaBand, V2FeatureCard, IndustryHero, Checklist, DarkFeatureCard,
  T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal,
} from "../../../components/v2";

import heroImage from "../../../assets/images/industries/facility-management.jpg";
import illustrationImage from "../../../assets/images/industries/facility-management-illustration.jpg";

const industry = getIndustryBySlug("facility-management")!;   // real IndustryDef — slug/name/tagline/icon

const industryPad = { padding: "60px 0" };

// Original XERXEZ copy — hero/checklist phrasing per the client's exact spec.
const HERO_FEATURES = ["Asset & maintenance management", "Work order automation", "Energy & cost control"];
const HERO_SUBTITLE = "Assets, work orders and energy costs managed across every site — built for facility teams in UAE & India.";

const OVERVIEW_OPENING = "A facility manager doesn't lose sleep over software. They lose sleep over equipment breakdowns, missed maintenance schedules and tenants who can't get a response. We build the platform that keeps every asset, every work order and every cost visible — before problems become complaints.";
const OVERVIEW_PARA_2 = "Facility teams in the UAE and India are usually running dozens of buildings, hundreds of assets and a stream of tenant requests through phone calls, spreadsheets and disconnected vendor systems. XERXEZ gives facility and property managers one AI-powered platform that connects asset management, work orders and energy monitoring into a single view — so nothing gets missed and nothing waits longer than it should.";

const CHALLENGES = [
  { title: "Reactive maintenance causing costly breakdowns", desc: "Equipment gets fixed only after it fails, driving up repair costs and downtime." },
  { title: "Work order tracking across multiple buildings", desc: "Requests spread across phone, email and spreadsheets are easy to lose track of." },
  { title: "Energy consumption visibility and control", desc: "Without real-time monitoring, cost overruns aren't caught until the bill arrives." },
  { title: "Vendor and contractor management", desc: "Contracts, SLAs and performance are hard to track without a central system." },
  { title: "Compliance and inspection documentation", desc: "Manual paperwork makes it difficult to stay audit-ready for inspections." },
  { title: "Tenant communication and service requests", desc: "Slow response times to tenant requests erode trust and satisfaction." },
];
const SOLUTIONS = [
  { icon: Wrench, title: "Preventive Asset Maintenance", desc: "Scheduled maintenance that catches issues before they become breakdowns." },
  { icon: ClipboardList, title: "Real-Time Work Order Tracking", desc: "Every request tracked from creation to completion, across every building." },
  { icon: Zap, title: "Live Energy Monitoring", desc: "Consumption visibility across all buildings to catch cost overruns early." },
  { icon: Users2, title: "Vendor & Contractor Portal", desc: "Contracts, SLAs and performance managed in one unified system." },
  { icon: ShieldCheck, title: "Automated Compliance Tracking", desc: "Inspection reports and documentation collected continuously, audit-ready." },
  { icon: Building2, title: "Connected Tenant Requests", desc: "Faster response times with every service request tracked in real time." },
];
const KEY_FEATURES = [
  { title: "Asset & Maintenance Management", desc: "Track all assets, schedule preventive maintenance and reduce equipment downtime." },
  { title: "Work Order Management", desc: "Create, assign and track work orders from request to completion in real time." },
  { title: "Energy Management", desc: "Monitor energy consumption across all buildings and identify cost reduction opportunities." },
  { title: "Vendor & Contractor Portal", desc: "Manage vendors, contracts, SLAs and performance in one unified system." },
  { title: "Compliance & Inspection", desc: "Digital checklists, inspection reports and regulatory compliance documentation." },
  { title: "AI-Powered Insights", desc: "Predictive maintenance alerts and operational insights powered by AI." },
];
// Result stats — explicit figures per user request; all four carry real
// numbers here (unlike the Construction/Oil-Gas/Healthcare pattern, which
// has one numberless icon-fallback card).
const RESULTS = [
  { v: "40%", l: "Reduction in equipment downtime" },
  { v: "50%", l: "Faster work order resolution" },
  { v: "30%", l: "Reduction in energy costs" },
  { v: "100%", l: "Maintenance compliance" },
];
// "Delivered through" module cards — original XERXEZ copy naming the
// platform capabilities this page's Overview/Solution describe.
const MODULE_CARDS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Wrench, title: "Asset & Maintenance Management", desc: "Maintain a complete register of all assets with full service history and maintenance schedules. Preventive maintenance alerts reduce unexpected breakdowns by up to 40%. Track asset lifecycle costs to make informed replacement decisions." },
  { icon: ClipboardList, title: "Work Order Management", desc: "Create, assign, track and close work orders from any device in real time. Full audit trail from request to completion with photo evidence and sign-off. SLA tracking ensures no work order falls through the cracks." },
  { icon: Zap, title: "Energy Management", desc: "Monitor electricity, water and gas consumption across all buildings in real time. Identify waste, benchmark against targets and track savings over time. Automated alerts when consumption exceeds normal thresholds." },
  { icon: Users2, title: "Vendor & Contractor Portal", desc: "Onboard, manage and rate vendors and contractors in one unified system. Track contract expiry, insurance documents and performance against SLAs. Automated payment workflows reduce administrative overhead significantly." },
  { icon: ShieldCheck, title: "Compliance & Inspection Tracking", desc: "Digital inspection checklists ensure nothing is missed on routine rounds. Automated reports for regulatory submissions and authority inspections. Full document control for permits, certificates and compliance records." },
  { icon: Bot, title: "AI Assistant", desc: "Predict equipment failures before they happen using AI-powered maintenance intelligence. Instantly answer any query about assets, work orders or compliance status. Proactive alerts keep facility managers one step ahead at all times." },
];

const FacilityManagementPage = () => (
  <XerxezShell>
    <SEO
      title={`${industry.name} AI-Powered Platform & Digital Solutions | XERXEZ`}
      description={industry.tagline}
      canonical="/industries/facility-management"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · AI-POWERED FACILITY MANAGEMENT"
      heading={<>Built for Facility &amp; Property Managers</>}
      subtitle={HERO_SUBTITLE}
      heroImage={heroImage}
      highlights={HERO_FEATURES}
      ctaButtons={[{ label: "Book a Demo", to: "/contact" }]}
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
                  alt={`${industry.name} — rooftop building equipment and infrastructure`}
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
          <SectionHeading align="center" dark eyebrow="Challenges" title="Challenges in Facility Management" />
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
              <SectionHeading eyebrow="Our Solution" title="Built for Facility &amp; Property Teams" subtitle="One AI-powered platform that connects assets, work orders and energy costs — so nothing gets missed and nothing waits longer than it should." />
              <Checklist items={HERO_FEATURES} />
              <div style={{ marginTop: 24 }}>
                <Btn to="/contact">Discuss your project</Btn>
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

    {/* ── Key Features for Facility Management — original copy, 3-up
        lift-on-hover cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Key Features" title="What's included for facility management" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {KEY_FEATURES.map((m, i) => (
            <div key={m.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<HardHat size={22} strokeWidth={2} />} title={m.title} desc={m.desc} />
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
          <SectionHeading align="center" dark eyebrow="Results" title="What facility teams get" subtitle={industry.tagline} />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {RESULTS.map((r, i) => (
            <div key={r.l} className="col-lg-3 col-md-6">
              <Reveal delay={(i % 4) * 60} fill>
                <div style={{ height: "100%", textAlign: "center", padding: "30px 20px", background: "rgba(255,255,255,0.05)", borderRadius: T.rcard, border: "1px solid rgba(255,255,255,0.12)" }}>
                  <div style={{ fontFamily: T.fontHead, fontSize: 38, fontWeight: 800, color: T.red, lineHeight: 1, marginBottom: 10 }}>{r.v}</div>
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

export default FacilityManagementPage;
