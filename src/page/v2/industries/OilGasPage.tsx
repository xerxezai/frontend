// OilGasPage.tsx
// Purpose: /v2/industries/oil-gas — the first standalone industry detail
//          page (etiot.in-style: hero, overview, challenges, solutions,
//          our-solution, features, results, then the shared Why XERXEZ +
//          CTA sections). Previously this sector only had a card in the
//          header's Industry We Serve dropdown linking to a hash anchor on
//          the ERP Industries service page; this is its own real page.
// Used in: src/App.tsx (route: /v2/industries/oil-gas)
// Data source: the industry's core facts — name, tagline, the 3 `features`,
//              the 4 `painPoints`, the 6 `modules` — come from the "oil-gas"
//              entry in src/data/erpIndustriesData.tsx (INDUSTRIES +
//              INDUSTRY_PAGE_CONTENT); "Our Solution" and "Key Features"
//              below render those verbatim. The Overview intro/second
//              paragraph, the expanded 6-item feature list, "Challenges in
//              Oil & Gas Industry", and "How XERXEZ Solves It" are original
//              XERXEZ copy written for this page — by explicit user decision
//              this page is allowed original marketing copy (not strictly
//              erpIndustriesData.tsx-only like the header's Industry We
//              Serve dropdown), on the condition it's XERXEZ's own voice,
//              never copied from a competitor's site. Results' percentages
//              (35%, 50%, 40%) are explicit figures supplied directly by the
//              client for this page (mirrored from ConstructionPage.tsx's
//              Results section on request), not model-invented — every other
//              number-free page on the site still avoids stating a figure
//              with no real source behind it. No separate "why choose us"
//              band — that would have repeated the shared <XerxezWhyChoose />
//              below it, so only the shared component states XERXEZ's
//              differentiators.

import {
  AlertTriangle, CheckCircle2, Gauge, ShieldCheck, Truck, Wrench, Layers, Bot,
} from "lucide-react";
import SEO from "../../../components/seo/SEO";
import { getIndustryBySlug, getIndustryPageContent } from "../../../data/erpIndustriesData";
import {
  XerxezShell, XerxezWhyChoose, XerxezCtaBand, V2FeatureCard, IndustryHero, Checklist,
  T, Eyebrow, SectionHeading, DotGrid, Reveal,
} from "../../../components/v2";

import heroImage from "../../../assets/images/industries/oil-gas.jpg";
import illustrationImage from "../../../assets/images/industries/oil-gas-illustration.jpg";
import solutionImage from "../../../assets/images/industries/oil-gas-solution.jpg";

const industry = getIndustryBySlug("oil-gas")!;               // real IndustryDef — slug/name/tagline/features/icon
const content = getIndustryPageContent("oil-gas");            // real painPoints/modules

const industryPad = { padding: "60px 0" };

// Original XERXEZ copy — expanded, more specific hero subtitle (real tagline
// plus real geography/segment detail already used elsewhere on the site).
const HERO_SUBTITLE = "Field operations, safety compliance and supply chain — built for upstream and downstream teams across refineries, rigs, and pipelines in UAE & India.";

// Original XERXEZ copy (see file header) — story-driven Overview: a bold
// opening statement, then a follow-up paragraph naming the 3 real
// upstream/midstream/downstream stages and XERXEZ's approach. Explicitly no
// bullet points in this section, by request — the prose carries it.
const OVERVIEW_OPENING = "An oil field worker doesn't care about your platform. They care whether the part they need is at the right site, at the right time, with the right approval. We build the platform that makes that happen — every shift, every site, every time.";
const OVERVIEW_PARA_2 = "From upstream exploration and drilling to midstream logistics and downstream refining, every stage carries its own compliance requirements, safety protocols, and operational data. XERXEZ's AI-Powered Platform connects field operations, asset management, and compliance tracking into one system — so the right part, the right approval, and the right information are always where your teams need them, across every site you operate.";

// Original XERXEZ copy — 6 challenges and their paired solutions, written
// for this page specifically (not sourced from erpIndustriesData.tsx).
const CHALLENGES = [
  { title: "Manual field reporting causing delays", desc: "Paper-based processes slow down decision-making and create data gaps between field and office." },
  { title: "Compliance and safety documentation gaps", desc: "Managing HSE documentation manually leads to audit failures and regulatory penalties." },
  { title: "Supply chain visibility across multiple sites", desc: "Lack of real-time inventory data causes procurement delays and project stoppages." },
  { title: "Procurement inefficiencies", desc: "Manual approval workflows and maverick spending increase operational costs significantly." },
  { title: "Asset downtime and maintenance tracking", desc: "Reactive maintenance leads to costly equipment failures and unplanned production halts." },
  { title: "Real-time data gaps between field and office", desc: "Disconnected systems prevent timely decision-making and accurate project reporting." },
];
const SOLUTIONS = [
  { icon: Gauge, title: "Real-Time Field Operations Dashboard", desc: "Live status from every site, replacing manual reports that arrive days late." },
  { icon: ShieldCheck, title: "Automated Compliance & Safety Tracking", desc: "QHSE documentation and incident reporting centralized and always audit-ready." },
  { icon: Truck, title: "Integrated Supply Chain Management", desc: "One system for vendors, logistics, and inventory across every site you operate." },
  { icon: Wrench, title: "Predictive Asset Maintenance", desc: "Catch equipment issues before they cause downtime, not after." },
  { icon: Layers, title: "Multi-Site Project Management", desc: "Run upstream, midstream, and downstream projects from a single control tower." },
  { icon: Bot, title: "AI-Powered Procurement Automation", desc: "Approvals, vendor scoring, and purchase orders handled without manual chasing." },
];
// Result stats — same explicit figures/style as ConstructionPage.tsx's
// Results section, per direct request ("same fix for Oil & Gas").
const RESULTS = [
  { v: "35%", l: "Fewer project cost overruns" },
  { v: "50%", l: "Faster procurement approvals" },
  { v: "", l: "Real-time visibility across all sites" },
  { v: "40%", l: "Less compliance paperwork" },
];
// Original description per real module (content.modules, verbatim titles —
// only the description text is new copy) for the Key Features cards below.
const MODULE_DESCRIPTIONS: Record<string, string> = {
  "Asset & Maintenance Management": "Track all field assets, schedule preventive maintenance and reduce unplanned equipment downtime.",
  "QHSE — safety and compliance tracking": "Digital safety checklists, incident reporting and full regulatory compliance documentation.",
  "Field Operations Dashboard": "Real-time visibility of all field activities, crew status and operational KPIs in one unified view.",
  "Procurement — approved vendor management": "Streamline purchasing with approved vendor lists, automated POs and spend analytics.",
  "Document Management — compliance control": "Centralized repository for all compliance documents, permits and certifications.",
  "AI Assistant — instant compliance queries": "AI-powered assistant that answers compliance questions and flags regulatory risks instantly.",
};

const OilGasPage = () => (
  <XerxezShell>
    <SEO
      title={`${industry.name} AI-Powered Platform & Digital Solutions | XERXEZ`}
      description={industry.tagline}
      canonical="/v2/industries/oil-gas"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · AI-POWERED OIL & GAS"
      heading={<>Built for Oil &amp; Gas Operations</>}
      subtitle={HERO_SUBTITLE}
      heroImage={heroImage}
      highlights={industry.features}
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
                  alt={`${industry.name} — industrial pipeline infrastructure`}
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

    {/* ── Challenges in Oil & Gas Industry — dark navy, 3-up lift-on-hover
        cards, original copy. ── */}
    <section style={{ ...industryPad, background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading align="center" dark eyebrow="Challenges" title="Challenges in Oil & Gas Industry" />
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

    {/* ── Our Solution — real features + the full real module list, photo on
        the right. ── */}
    <section style={{ ...industryPad, background: T.lightAlt }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 order-lg-2">
            <Reveal>
              <SectionHeading eyebrow="Our Solution" title="Built for upstream and downstream teams" subtitle={industry.tagline} />
              <Checklist items={industry.features} variant="row" />
              <p style={{ fontFamily: T.fontHead, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.red, margin: "28px 0 4px" }}>
                Delivered through
              </p>
              <Checklist items={content.modules} variant="row" />
            </Reveal>
          </div>
          <div className="col-lg-6 order-lg-1">
            <Reveal delay={80}>
              <div style={{ borderRadius: T.rcard, overflow: "hidden", boxShadow: T.cardShadow }}>
                <img
                  src={solutionImage}
                  alt={`${industry.name} — pipeline and plant infrastructure`}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: 640, objectFit: "cover", display: "block" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Key Features — all 6 real platform modules, 3-up lift-on-hover cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Key Features" title="What's included for oil & gas" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {content.modules.map((m, i) => (
            <div key={m} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<CheckCircle2 size={22} strokeWidth={2} />} title={m} desc={MODULE_DESCRIPTIONS[m]} />
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
          <SectionHeading align="center" dark eyebrow="Results" title="What oil & gas teams get" subtitle={industry.tagline} />
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

export default OilGasPage;
