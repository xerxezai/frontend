// HealthcarePage.tsx
// Purpose: /v2/industries/healthcare — third standalone industry detail
//          page, same architecture as ConstructionPage.tsx (hero, overview,
//          challenges, solutions, our-solution, key modules, results, then
//          the shared Why XERXEZ + CTA sections).
// Used in: src/App.tsx (route: /v2/industries/healthcare)
// Data source: the industry's core facts — name and tagline — come from the
//              "healthcare" entry in src/data/erpIndustriesData.tsx
//              (INDUSTRIES). That entry's `painPoints`/`modules` fall back to
//              erpIndustriesData's shared GENERIC_CONTENT (not healthcare-
//              specific), so — per the same standing decision made for the
//              Oil & Gas and Construction pages — every section below beyond
//              the hero/hero-checklist is original XERXEZ copy written for
//              this page, never copied from a competitor, never a fabricated
//              metric with no real source. Results' percentages (45%, 30%,
//              100%) are explicit figures supplied directly by the client
//              for this page, not model-invented. No separate "why choose
//              us" band — that would repeat the shared <XerxezWhyChoose />
//              below it, so only the shared component states XERXEZ's
//              differentiators.

import {
  AlertTriangle, ShieldCheck, FileText, Bot,
  DollarSign, Package, CalendarClock, Building2, HeartPulse, BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../../components/seo/SEO";
import { getIndustryBySlug } from "../../../data/erpIndustriesData";
import {
  XerxezShell, XerxezWhyChoose, XerxezCtaBand, V2FeatureCard, IndustryHero, Checklist, DarkFeatureCard,
  T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal,
} from "../../../components/v2";

import heroImage from "../../../assets/images/industries/healthcare.jpg";
import illustrationImage from "../../../assets/images/industries/healthcare-illustration.jpg";

const industry = getIndustryBySlug("healthcare")!;   // real IndustryDef — slug/name/tagline/icon

const industryPad = { padding: "60px 0" };

// Original XERXEZ copy — the hero/checklist phrasing (the underlying real
// `industry.features` use slightly different wording — "Patient management
// & billing" etc. — this page uses the client-specified phrasing instead).
const HERO_FEATURES = ["Patient billing & revenue cycle", "Medical supply chain", "Staff & resource management"];
const HERO_SUBTITLE = "Patient billing, medical supply chain and staff scheduling — built for hospitals, clinics and healthcare networks in UAE & India.";

const OVERVIEW_OPENING = "A doctor doesn't lose sleep over software. They lose sleep over missing patient records, delayed supplies and staff who aren't where they need to be. We build the platform that keeps all of that connected — so your teams can focus on care, not administration.";
const OVERVIEW_PARA_2 = "A hospital or clinic runs on dozens of moving parts at once — admissions, billing, pharmacy, staffing, and compliance — each with its own system and its own point of failure. XERXEZ gives healthcare providers in the UAE and India one AI-powered platform that connects patient billing, supply chain, and staff scheduling into a single source of truth, so administrative complexity never gets in the way of patient care.";

const CHALLENGES = [
  { title: "Patient billing complexity & revenue leakage", desc: "Manual billing processes and claim errors quietly erode revenue across departments." },
  { title: "Medical supply chain disruptions", desc: "Stockouts and expired inventory happen when supply levels aren't tracked in real time." },
  { title: "Staff scheduling across multiple departments", desc: "Coordinating doctor, nurse and support staff rosters by hand causes gaps in coverage." },
  { title: "Regulatory compliance & accreditation", desc: "Manual documentation makes it hard to stay audit-ready for accreditation bodies." },
  { title: "Patient data management & privacy", desc: "Records scattered across systems make both continuity of care and privacy harder to guarantee." },
  { title: "Multi-location coordination", desc: "Hospitals, clinics and diagnostic centers operating on different systems lose a unified view." },
];
const SOLUTIONS = [
  { icon: DollarSign, title: "Automated Billing & Claims", desc: "Fewer claim rejections and full revenue visibility across every department." },
  { icon: Package, title: "Real-Time Medical Supply Tracking", desc: "Live inventory of medicines, equipment and consumables across every site." },
  { icon: CalendarClock, title: "Unified Staff Scheduling", desc: "Doctor, nurse and support staff rosters, attendance and payroll in one place." },
  { icon: ShieldCheck, title: "Automated Compliance Documentation", desc: "Accreditation and regulatory evidence collected continuously, not scrambled for." },
  { icon: FileText, title: "Connected Patient Records", desc: "One record per patient, accessible wherever they're being treated." },
  { icon: Building2, title: "Multi-Location Visibility", desc: "One dashboard across every hospital, clinic and diagnostic center you run." },
];
const KEY_FEATURES = [
  { title: "Patient Billing & Revenue Cycle", desc: "Automate billing, reduce claim rejections and track revenue across all departments." },
  { title: "Medical Supply Chain", desc: "Real-time inventory of medicines, equipment and consumables across all locations." },
  { title: "Staff Scheduling & HR", desc: "Manage doctor, nurse and support staff rosters, attendance and payroll." },
  { title: "Compliance & Accreditation", desc: "Track JCI, NABH and local regulatory requirements with automated documentation." },
  { title: "Multi-location Management", desc: "Unified visibility across hospitals, clinics and diagnostic centers." },
  { title: "AI-Powered Analytics", desc: "Real-time insights on patient flow, resource utilization and operational performance." },
];
// Result stats — explicit figures per user request (see Results section).
const RESULTS = [
  { v: "45%", l: "Reduction in billing errors" },
  { v: "30%", l: "Improvement in supply chain efficiency" },
  { v: "100%", l: "Compliance documentation" },
  { v: "", l: "Real-time visibility across all locations" },
];
// "Delivered through" module cards — original XERXEZ copy naming the
// platform capabilities this page's Overview/Solution describe.
const MODULE_CARDS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: DollarSign, title: "Patient Billing & Revenue Cycle", desc: "Automate the entire billing cycle from patient registration to final payment and insurance settlement. Reduce claim rejections with built-in validation against payer rules. Real-time revenue tracking across all departments and locations." },
  { icon: Package, title: "Medical Supply Chain", desc: "Maintain optimal stock levels of medicines, consumables and medical equipment across all locations. Automated reorder triggers prevent stockouts of critical supplies. Full traceability from supplier to patient bedside." },
  { icon: CalendarClock, title: "Staff Scheduling & HR", desc: "Build and manage rosters for doctors, nurses and support staff across all departments and shifts. Track attendance, overtime and leave in real time. Automated payroll processing with full compliance to local labour laws." },
  { icon: ShieldCheck, title: "Compliance & Accreditation", desc: "Maintain a complete digital audit trail for JCI, NABH and UAE health authority requirements. Automated reminders for license renewals, inspections and document submissions. Never miss a compliance deadline again." },
  { icon: FileText, title: "Electronic Health Records", desc: "Seamlessly integrate with your existing HIS or EMR system for unified patient data access. Ensure clinical staff always have the right patient information at the right time. Secure, role-based access controls protect patient privacy at all times." },
  { icon: Bot, title: "AI Assistant", desc: "Instantly answer clinical, operational and compliance queries without searching through systems. Proactively flags supply shortages, staffing gaps and compliance risks. Available to all staff across mobile and desktop 24/7." },
];

const HealthcarePage = () => (
  <XerxezShell>
    <SEO
      title={`${industry.name} AI-Powered Platform & Digital Solutions | XERXEZ`}
      description={industry.tagline}
      canonical="/v2/industries/healthcare"
      noIndex
    />

    <IndustryHero
      eyebrow="XERXEZ · AI-POWERED HEALTHCARE"
      heading={<>Built for Healthcare Providers &amp; Hospitals</>}
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
                  alt={`${industry.name} — doctors reviewing patient information`}
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
          <SectionHeading align="center" dark eyebrow="Challenges" title="Challenges in the Healthcare Industry" />
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
              <SectionHeading eyebrow="Our Solution" title="Built for Hospitals &amp; Healthcare Networks" subtitle="One AI-powered platform that connects patient billing, supply chain and staffing — so administrative complexity never gets in the way of patient care." />
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

    {/* ── Key Features for Healthcare — original copy, 3-up lift-on-hover
        cards. ── */}
    <section style={{ ...industryPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Key Features" title="What's included for healthcare" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {KEY_FEATURES.map((m, i) => (
            <div key={m.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <V2FeatureCard icon={<HeartPulse size={22} strokeWidth={2} />} title={m.title} desc={m.desc} />
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
          <SectionHeading align="center" dark eyebrow="Results" title="What healthcare providers get" subtitle={industry.tagline} />
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
                      <BarChart3 size={38} strokeWidth={1.75} color={T.red} />
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

export default HealthcarePage;
