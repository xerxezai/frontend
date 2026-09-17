// ConstructionPage.tsx
// Purpose: /industries/construction — second standalone industry detail
//          page, same architecture as OilGasPage.tsx (hero, overview,
//          challenges, solutions, our-solution, key modules, results, then
//          the shared Why XERXEZ + CTA sections).
// Used in: src/App.tsx (route: /industries/construction)
// Data source: the industry's core facts — name, tagline, the 3 `features`,
//              the 4 `painPoints`, the 6 `modules` — come from the
//              "construction" entry in src/data/erpIndustriesData.tsx
//              (INDUSTRIES + INDUSTRY_PAGE_CONTENT); confirmed via a repo
//              search that no other real construction-specific content
//              exists in src/data/. Overview's second paragraph, the
//              Challenges/Solutions/Key-Modules copy, and the Results figures
//              are original XERXEZ copy (per the same standing decision made
//              for the Oil & Gas page: original copy is allowed here, never
//              copied from a competitor). Results' percentages (35%, 50%,
//              40%) are explicit figures supplied directly by the client for
//              this page, not model-invented — every other page on the site
//              still avoids stating a number with no real source behind it.
//              No separate "why choose us" band — that would have repeated
//              the shared <XerxezWhyChoose /> below it, so only the shared
//              component states XERXEZ's differentiators.

import {
  AlertTriangle, CheckCircle2, Gauge, Users, Truck, ShieldCheck, FolderOpen, MapPin,
  Building2, Package, DollarSign, UserCog, Bot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import { getIndustryBySlug, getIndustryPageContent } from "../../../data/erpIndustriesData";
import {
  XerxezShell, XerxezWhyChoose, XerxezCtaBand, V2FeatureCard, IndustryHero, Checklist, DarkFeatureCard,
  T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal,
} from "../../../components/v2";

import heroImage from "../../../assets/images/industries/construction.jpg";
import illustrationImage from "../../../assets/images/industries/construction-illustration.jpg";

const industry = getIndustryBySlug("construction")!;         // real IndustryDef — slug/name/tagline/features/icon
const content = getIndustryPageContent("construction");      // real painPoints/modules

const industryPad = { padding: "60px 0" };

// Original XERXEZ copy — expanded, more specific hero subtitle (real tagline
// plus real geography/segment detail already used elsewhere on the site).
const HERO_SUBTITLE = "Project budgets, materials, subcontractors and site safety — all tracked in real time from groundbreaking to handover, built for EPC and construction teams in UAE & India.";

// Original XERXEZ copy (see file header) — story-driven Overview: a bold
// opening statement, then a follow-up paragraph on XERXEZ's approach.
// Explicitly no bullet points in this section, by request — no numbers
// either, and the prose carries it.
const OVERVIEW_OPENING = "A project manager doesn't lose sleep over software. They lose sleep over budget overruns, delayed materials and subcontractors who don't show up. We build the system that keeps all of that visible, trackable and under control — from groundbreaking to handover.";
const OVERVIEW_PARA_2 = "A single project moves through design, procurement, multiple subcontractors, and inspection before handover — and each stage produces its own paperwork, its own budget line, and its own point of failure. XERXEZ gives general contractors and developers one AI-powered platform that follows a project from groundbreaking to handover — replacing spreadsheets, disconnected tools, and manual approvals with a single source of truth for every phase.";

// Original XERXEZ copy — 6 challenges and their paired solutions/modules,
// written for this page specifically (not sourced from erpIndustriesData.tsx).
const CHALLENGES = [
  { title: "Budget overruns on large projects", desc: "Poor cost visibility leads to uncontrolled spending and project losses across multiple contracts." },
  { title: "Subcontractor coordination issues", desc: "Managing multiple subcontractors with different systems causes delays and miscommunication." },
  { title: "Material procurement delays", desc: "Manual purchasing processes and lack of inventory visibility stall project timelines." },
  { title: "Site safety compliance", desc: "Paper-based safety documentation makes it hard to track incidents and maintain regulatory compliance." },
  { title: "Document and drawing management", desc: "Version control issues and scattered documents lead to costly rework and errors on site." },
  { title: "Labour tracking across multiple sites", desc: "No real-time visibility of workforce attendance, skills, and productivity across sites." },
];
const SOLUTIONS = [
  { icon: Gauge, title: "Real-Time Project Budget Tracking", desc: "Spend visible against budget as it happens, not discovered at month-end." },
  { icon: Users, title: "Subcontractor Management Portal", desc: "Every subcontractor's schedule, work orders, and payments in one place." },
  { icon: Truck, title: "Automated Material Procurement", desc: "Purchase orders and deliveries tracked against the project schedule." },
  { icon: ShieldCheck, title: "Digital Safety Checklists", desc: "Site inspections logged on-site, not filled in from memory back at the office." },
  { icon: FolderOpen, title: "Document Control System", desc: "One version-controlled home for every drawing, permit, and change order." },
  { icon: MapPin, title: "Multi-Site Labour Management", desc: "Attendance and crew allocation tracked across every active site." },
];
const KEY_MODULES = [
  { title: "Project Cost Management", desc: "Track budgets, costs and financial performance across every construction project in real time." },
  { title: "Procurement & Materials", desc: "Automate purchase orders, vendor management and material tracking from order to delivery." },
  { title: "Subcontractor Management", desc: "Manage contracts, progress billing and performance of all subcontractors in one place." },
  { title: "HSE & Safety Compliance", desc: "Digital safety checklists, incident reporting and regulatory compliance documentation." },
  { title: "Document Management", desc: "Centralized control of drawings, contracts, RFIs and all project documents." },
  { title: "Labour & Resource Planning", desc: "Track workforce hours, skills and availability across multiple construction sites." },
];
// Result stats — explicit figures per user request (see StatCard below).
const RESULTS = [
  { v: "35%", l: "Fewer project cost overruns" },
  { v: "50%", l: "Faster procurement approvals" },
  { v: "", l: "Real-time visibility across all sites" },
  { v: "40%", l: "Less compliance paperwork" },
];
// The "Delivered through" module cards — keyed by each real module name
// (content.modules) verbatim, so the render loop stays tied to the real
// data instead of a hand-ordered array. Description is original XERXEZ copy
// (fuller than the short fragment some of the real module strings carry
// after their own " — ") and the icon is a UI choice, not data.
const MODULE_CARDS: Record<string, { icon: LucideIcon; title: string; desc: string }> = {
  "Project Management — milestones and tasks": { icon: Building2, title: "Project Management", desc: "Track milestones, tasks and critical path across all active projects. Get real-time alerts on delays before they become overruns. Keep every stakeholder aligned from site manager to board level." },
  "Material & Equipment tracking": { icon: Package, title: "Material & Equipment", desc: "Monitor stock levels, deliveries and equipment utilization across every site in real time. Automated reorder alerts prevent material shortages that stop work. Full traceability from purchase order to on-site delivery." },
  "Subcontractor Management — work orders": { icon: Users, title: "Subcontractor Management", desc: "Manage work orders, contracts, progress claims and retention across all subcontractors. Track performance against SLAs and flag delays before they impact the critical path. Centralized communication and document sharing." },
  "Budget Control — real-time cost monitoring": { icon: DollarSign, title: "Budget Control", desc: "Real-time cost monitoring against budget for every work package and project phase. Instant variance alerts when spending exceeds approved limits. Accurate forecasting of final project cost at any stage." },
  "HR — labour attendance and payroll": { icon: UserCog, title: "HR", desc: "Track labour attendance, skills, certifications and productivity across all sites. Automate payroll calculations including overtime, allowances and deductions. Ensure only certified workers are deployed on safety-critical tasks." },
  "AI Assistant — project status queries": { icon: Bot, title: "AI Assistant", desc: "Ask any question about project status, budget or resources and get an instant answer. Proactively alerts you to risks, delays and budget overruns before they escalate. Available 24/7 across mobile and desktop." },
};

const ConstructionPage = () => (
  <XerxezShell>
    <SEO
      title={`${industry.name} AI-Powered Platform & Digital Solutions | XERXEZ`}
      description={industry.tagline}
      canonical="/industries/construction"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · AI-POWERED CONSTRUCTION"
      heading={<>Built for Construction &amp; Project Teams</>}
      subtitle={HERO_SUBTITLE}
      heroImage={heroImage}
      highlights={industry.features}
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
                  alt={`${industry.name} — engineers reviewing site blueprints`}
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
          <SectionHeading align="center" dark eyebrow="Challenges" title="Challenges in the Construction Industry" />
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

    {/* ── Our Solution — real features (red-left-border cards + CTA) on the
        left, the full real module list as dark navy cards on the right,
        with a subtle navy gradient behind them. 5/7 column split (not the
        page's usual 6/6) since the module grid needs more room than a
        plain checklist does. ── */}
    <section style={{ ...industryPad, background: "#F4F7FA", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: "0 0 0 50%",
        background: "linear-gradient(115deg, transparent 0%, rgba(7,26,51,0.05) 35%, rgba(7,26,51,0.09) 100%)",
        pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* no `align-items-start` — default Bootstrap row behavior (stretch)
           makes both columns match height, so the module grid can fill it */}
        <div className="row g-5">
          <div className="col-lg-5">
            <Reveal>
              <SectionHeading eyebrow="Our Solution" title="Built for General Contractors & Developers" subtitle="One AI-powered platform that follows your project from groundbreaking to handover — replacing spreadsheets, disconnected tools and manual approvals." />
              <Checklist items={industry.features} />
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
                {/* CSS grid (not Bootstrap's row/col) so each card genuinely
                   stretches to fill its row band — `flex: 1` lets the grid
                   itself grow to match the left column's full height instead
                   of leaving empty space below a fixed-height card block. */}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {content.modules.map((m) => {
                    const card = MODULE_CARDS[m];
                    if (!card) return null;   // every real module has a card; guards a future data-module edit with no matching entry
                    return <DarkFeatureCard key={m} variant="filled" icon={card.icon} title={card.title} desc={card.desc} />;
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Key Platform Modules for Construction — original module names, 3-up
        lift-on-hover cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Key Platform Modules" title="Key Platform Modules for Construction" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {KEY_MODULES.map((m, i) => (
            <div key={m.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<CheckCircle2 size={22} strokeWidth={2} />} title={m.title} desc={m.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Results — dark navy stat cards, large red figure + white label.
        Tighter padding (40px, not the page's usual 60px) per request. ── */}
    <section style={{ padding: "40px 0", background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading align="center" dark eyebrow="Results" title="What construction teams get" subtitle={industry.tagline} />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {RESULTS.map((r, i) => (
            <div key={r.l} className="col-lg-3 col-md-6">
              <Reveal delay={(i % 4) * 60} fill>
                <div style={{ height: "100%", textAlign: "center", padding: "30px 20px", background: "rgba(255,255,255,0.05)", borderRadius: T.rcard, border: "1px solid rgba(255,255,255,0.12)" }}>
                  {/* the one result with no real percentage behind it gets an
                     icon at the same height instead of a fabricated number,
                     so the row stays visually even */}
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

    {/* ── Why XERXEZ + closing CTA — shared sections, reused verbatim. No
        separate custom "why choose us" band here — a smaller 3-item version
        immediately followed by this same full 6-item version was a redundant
        back-to-back repeat, so only the shared component stays. ── */}
    <XerxezWhyChoose />
    <XerxezCtaBand />
  </XerxezShell>
);

export default ConstructionPage;
