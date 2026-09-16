// XerxezServiceTemplate.tsx
// Purpose: Shared layout for the single dynamic /v2/services/:slug route —
//          Hero, About the Service, Overview, Features Grid, Industries, FAQ,
//          Technologies, Why XERXEZ, CTA. Rendered once per slug by
//          src/page/v2/services/ServiceDetailPageV2.tsx, which looks up the
//          matching `services[]` entry (via `getServiceDetail`) and a small
//          per-slug config (eyebrow/hero photo/illustration photo) and passes
//          them in here — so the section markup exists exactly once instead
//          of being duplicated per service.
// Used in: page/v2/services/ServiceDetailPageV2.tsx
// Data source: every word (title/description/detailBody/highlights/keyFacts/
//              faqs) comes from the `service` prop — i.e. from the existing
//              `services` array in src/data/index.ts, the same data the
//              current /service/:slug page (ServiceDetailSection.tsx) renders.
//              Nothing here is invented. The Industries section reuses the
//              real INDUSTRIES list from src/data/erpIndustriesData.tsx
//              (the same 8 sectors shown on the homepage's XerxezIndustries),
//              and Technologies reuses XerxezTechStack's real 8 tech logos.

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "../../../../data";
import { INDUSTRIES } from "../../../../data/erpIndustriesData";
import {
  T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, sectionPad, V2_HEADER_H,
} from "../../01-core/v2theme";
import { V2FeatureCard } from "../../01-core/v2page";
import { getKeyFactIcon } from "../../01-core/icons";
import XerxezWhyChoose from "../../03-sections/about/XerxezWhyChoose";
import XerxezCtaBand from "../../03-sections/cta/XerxezCtaBand";
import { XerxezTechLogoStrip } from "../../03-sections/trusted/XerxezTechStack";   // the same floating tech-logo strip as the homepage

// The exact fields this template reads off a `services[]` entry — narrowed
// from the full (looser-typed) data-module shape so this file stays honest
// about what it actually uses. `iconKey` (e.g. "brain") drives the lucide
// icon lookup below; `icon` (the legacy FontAwesome class, e.g. "far fa-brain")
// is still present on the data but unused here — src/components/service/
// ServiceDetailSection.tsx (the pre-/v2 page) still renders it as a literal
// CSS class, so it stays on the data module for that consumer.
interface ServiceDetail {
  slug: string;
  title: string;
  description: string;
  detailBody: string;
  highlights: string[];
  // Optional expanded version of `highlights` — same items/order, each with a
  // one-sentence description. Falls back to plain `highlights` (title only)
  // for any service that doesn't have it yet.
  highlightDetails?: { title: string; desc: string }[];
  keyFacts: { iconKey: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

// Hand-written 2-sentence hero subtitles, one per service slug — richer and
// more specific than the short card `description` those services also carry
// (which stays in use everywhere else: cards, meta tags, etc.). Kept to 2
// sentences so the hero fits one screen. Falls back to `service.description`
// for any slug not covered here.
const SERVICE_HERO_SUBTITLES: Record<string, string> = {
  "ai-powered-erp": "Replace rigid legacy systems with an AI-native platform that continuously learns from your operational data — predicting demand, flagging anomalies and automating procurement before problems surface. Finance, HR, supply chain and production connected in one unified system, not 12 disconnected tools.",
  "software-development": "Off-the-shelf software forces your business to adapt to rigid workflows — we take the opposite approach. From internal platforms and customer-facing applications to complex enterprise ecosystems, we engineer solutions around your exact operations, goals and future roadmap.",
  "ai-training-consulting": "Your team understands the business — we teach them to build with AI. From executive AI literacy and applied machine learning to LLM fine-tuning, RAG pipelines and MLOps certification, our programs are built by practitioners who've shipped AI in production.",
  "mobile-application": "Your customers and field teams live on their phones — your applications should meet them there. We build iOS, Android and cross-platform mobile applications that are fast, offline-capable and deeply integrated with your enterprise systems.",
  "erp-industries": "Generic ERP doesn't understand your industry — it makes you adapt your operations to its limitations. We build AI-powered platforms pre-configured for EPC, Oil & Gas, Construction, Manufacturing, Healthcare and Facility Management — with industry-specific workflows built in from day one.",
  "devsecops-mlops-solutions": "Security bolted on at the end of a software project is security that doesn't work. We embed security into every stage of your development pipeline — from code commit to production deployment — so your teams ship faster without compromising compliance or reliability.",
  "cloud-service-storage": "Your cloud bill is not a utility expense — it's an engineering problem. We design multi-cloud architectures across AWS, Azure and GCP that are cost-optimised, highly available and built for data-intensive enterprise workloads from the start.",
  "quantum-computing": "Quantum computing is moving from research labs into enterprise production faster than most technology roadmaps account for. We help organizations assess quantum readiness, develop hybrid quantum-classical solutions and migrate cryptographic systems to post-quantum standards — before the window closes.",
  "web-mobile-hosting": "Your infrastructure should scale when you need it, cost what it should, and never be the reason a customer can't reach you. We manage high-availability hosting for web and mobile backends across AWS, Azure and GCP — with global CDN integration, auto-scaling and 24/7 monitoring included as standard.",
  "software-consulting": "The most expensive technology decisions are the ones made without a clear strategy — and they compound for years. We provide honest, vendor-neutral technology consulting, architecture reviews and digital transformation roadmaps built around your actual business objectives.",
};

// Slug → services[] entry lookup, used by the one dynamic page component.
// Returns undefined on a bad/renamed slug instead of throwing — the caller
// (ServiceDetailPageV2) treats that as a normal 404 (redirect + message),
// the same way the top-level catch-all route already handles an unknown URL,
// rather than crashing the whole route into the app-wide error boundary.
export function getServiceDetail(slug: string): ServiceDetail | undefined {
  const entry = services.find((s) => s.slug === slug);
  return entry as unknown as ServiceDetail | undefined;
}

// Centered eyebrow + H2 (+ optional subtitle), wrapped in the standard
// scroll-in reveal — the same 4-line shape this file previously repeated
// verbatim above Overview, Features Grid, Industries, FAQ and Technologies.
const CenteredHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <Reveal>
    <SectionHeading align="center" eyebrow={eyebrow} title={title} subtitle={subtitle} />
  </Reveal>
);

// One collapsible FAQ row. Self-contained (its own open/closed state) so the
// parent doesn't need to track "which of the 5 is open" — click to expand,
// click again to collapse; more than one can be open at once, which is fine
// for 5 short items.
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "20px 4px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
          fontFamily: T.fontHead, fontSize: 16, fontWeight: 600, color: T.headNavy,
        }}
      >
        {question}
        <ChevronDown size={18} style={{ flexShrink: 0, color: T.red, transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {/* grid-rows trick animates height without measuring it in JS */}
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 220ms ease" }}>
        <div style={{ overflow: "hidden" }}>
          <p style={{ fontFamily: T.fontBody, fontSize: 14.5, lineHeight: 1.7, color: T.muted, margin: "0 4px 20px" }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

// One Industries card. Same depth treatment as V2FeatureCard — lift +
// deeper shadow + red border on hover, no rotation. Kept as its own small
// component (rather than V2FeatureCard) because it needs a per-industry
// icon color (`ind.shelf`, the same accent used on the homepage's
// XerxezIndustries) that V2FeatureCard's `dark` on/off icon coloring can't express.
const IndustryCard = ({ icon: Icon, title, desc, accent }: { icon: LucideIcon; title: string; desc: string; accent: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#fff", border: `1px solid ${hover ? T.red : T.border}`, borderRadius: T.rcard, padding: "22px 20px",
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? `0 24px 48px ${T.scrim(0.16)}` : T.cardShadow,
        transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms ease, border-color 200ms ease",
      }}
    >
      <span style={{
        width: 44, height: 44, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "#fff", color: accent,
      }}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 15.5, fontWeight: 700, color: T.headNavy, margin: "14px 0 6px" }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 13, lineHeight: 1.55, color: T.muted, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

const XerxezServiceTemplate = ({
  service,           // the services[] entry this page is for
  heroImage,         // imported Pexels photo for the hero background
  illustrationImage, // imported Pexels photo for the "About the Service" side image
  eyebrow,           // short category label shown above the H1 (e.g. "Enterprise ERP")
}: { service: ServiceDetail; heroImage: string; illustrationImage: string; eyebrow: string }) => (
  <>
    {/* ── Hero — full-bleed Pexels photo + navy scrim overlay, left-aligned
        like the homepage hero (XerxezHero.tsx). Full-size scale: all 6
        highlights, generous padding and gaps. ── */}
    <section style={{
      position: "relative", overflow: "hidden",
      background: T.navyGrad,                                          // fallback while the photo loads
      minHeight: "100svh", display: "flex", alignItems: "center",
      paddingTop: V2_HEADER_H + 48, paddingBottom: 48,
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center",
      }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: T.scrim(0.55) }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "-25%", right: "-10%", width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, rgba(217,53,34,0.06) 45%, transparent 70%)`,
        filter: "blur(20px)", pointerEvents: "none",
      }} />
      <DotGrid opacity={0.4} size={36} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 16 }}>
          <Eyebrow color={T.redLight} mb={0}>{eyebrow}</Eyebrow>
          <h1 style={{
            fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
            lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: 0,
          }}>
            {service.title}
          </h1>
          <p style={{ fontFamily: T.fontBody, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }}>
            {SERVICE_HERO_SUBTITLES[service.slug] ?? service.description}
          </p>
          {/* all 6 highlights, 2 columns of 3 (column-major order) */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(3, auto)",
            gridAutoFlow: "column", columnGap: 24, rowGap: 10,
          }}>
            {service.highlights.slice(0, 6).map((h) => (
              <span key={h} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: T.fontBody, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>
                <Check size={15} strokeWidth={3} color={T.redLight} style={{ flexShrink: 0 }} />
                {h}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 4 }}>
            <Btn to="/v2/contact">Book a Demo</Btn>
            <Btn to="/v2/services" variant="outline" dark arrow={false}>View All Services</Btn>
          </div>
          {/* "who this is for" line, customised per service via service.title */}
          <p style={{ fontFamily: T.fontBody, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>
            Built for engineering teams, EPC contractors and industrial enterprises across UAE &amp; India investing in {service.title}.
          </p>

          {/* stats strip — all 4: first 2 keyFacts titles + 2 facts that apply to every service */}
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 8 }}>
            {[
              service.keyFacts[0]?.title,
              service.keyFacts[1]?.title,
              "UAE & India",
              "24/7 Support",
            ].filter(Boolean).map((stat, i) => (
              <div key={stat} style={{
                padding: i === 0 ? "0 24px 0 0" : "0 24px",
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.18)" : "none",
              }}>
                <span style={{ fontFamily: T.fontHead, fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── About the Service — text + illustration, two columns, matching
        etiot.in's "About the Service" layout. `detailBody` is one real
        paragraph in the data module (not pre-split into multiple), so it
        renders as one paragraph here rather than inventing paragraph breaks
        that aren't in the source. ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <SectionHeading eyebrow="About the Service" title={service.title} />
              <p style={{ fontFamily: T.fontBody, fontSize: 16, lineHeight: 1.8, color: T.muted, margin: "18px 0 0" }}>
                {service.detailBody}
              </p>
              {/* the 4 keyFacts' short titles (not their full descriptions —
                  those appear later in the Features Grid) as a quick-glance
                  summary, so this section carries more real substance than a
                  single paragraph while staying non-duplicate with the grid below */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 20px", marginTop: 28 }}>
                {service.keyFacts.map((fact) => (
                  <div key={fact.title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.red, flexShrink: 0 }} />
                    <span style={{ fontFamily: T.fontHead, fontSize: 14.5, fontWeight: 600, color: T.headNavy }}>
                      {fact.title}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal delay={80}>
              <div style={{ borderRadius: T.rcard, overflow: "hidden", boxShadow: T.cardShadow }}>
                <img
                  src={illustrationImage}
                  alt={`${service.title} — illustrative photo`}
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

    {/* ── Overview — the service's 6 highlights as a checklist, each with a
        bold title and a one-sentence description (`highlightDetails`).
        `detailBody` already carries the full narrative in "About the
        Service" above, so this section leads with the checklist rather than
        repeating that same paragraph a second time back-to-back on the page.
        Falls back to a title-only row (the plain `highlights` string) for
        any service that doesn't have `highlightDetails` yet. ── */}
    <section style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <CenteredHeader eyebrow="Overview" title="Everything this service includes" />
        <Reveal delay={80}>
          {/* 6 highlights, 2-up, each with a red check tile — the "highlightDetails"
             array verbatim (or `highlights` alone, title-only, as a fallback) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "22px 32px", marginTop: 44, maxWidth: 960, marginInline: "auto" }}>
            {(service.highlightDetails ?? service.highlights.map((h) => ({ title: h, desc: "" }))).map((h) => (
              <div key={h.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(217,53,34,0.1)", color: T.red,
                }}>
                  <Check size={13} strokeWidth={3} />
                </span>
                <span>
                  <span style={{ display: "block", fontFamily: T.fontHead, fontSize: 15, lineHeight: 1.4, color: T.headNavy, fontWeight: 700 }}>
                    {h.title}
                  </span>
                  {h.desc && (
                    <span style={{ display: "block", fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.6, color: T.muted, marginTop: 4 }}>
                      {h.desc}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>

    {/* ── Features Grid — the service's 4 keyFacts as cards, via the shared
        V2FeatureCard (core/v2page.tsx) rather than a second local card
        component. Every card is identical — flat gray fill, red border only
        on hover. ── */}
    <section style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <CenteredHeader eyebrow="What's Included" title="Built for real production use" />
        <div className="row g-4" style={{ marginTop: 48 }}>
          {service.keyFacts.map((fact, i) => {
            const Icon = getKeyFactIcon(fact.iconKey);
            return (
              <div key={fact.title} className="col-lg-3 col-md-6">
                <Reveal delay={(i % 4) * 60} fill>
                  <V2FeatureCard
                    icon={<Icon size={22} strokeWidth={2} />}
                    title={fact.title}
                    desc={fact.desc}
                  />
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── Industries — the real 8-sector INDUSTRIES list (same data the
        homepage's XerxezIndustries uses), shown as a compact "who this is
        for" grid rather than a repeated interactive selector. ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <CenteredHeader eyebrow="Industries" title="Built for every operational sector" />
        <div className="row g-4" style={{ marginTop: 44 }}>
          {INDUSTRIES.map((ind, i) => (
            // id + scrollMarginTop so the header's Industry We Serve dropdown
            // links (/v2/services/erp-industries#<slug>) land below the fixed
            // header instead of scrolling the card behind it.
            <div key={ind.slug} id={ind.slug} className="col-lg-3 col-md-6" style={{ scrollMarginTop: V2_HEADER_H + 24 }}>
              <Reveal delay={(i % 4) * 50} fill>
                <IndustryCard icon={ind.icon} title={ind.shortName} desc={ind.tagline} accent={ind.shelf} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── FAQ — the service's 5 faqs, verbatim, as a click-to-expand accordion. ── */}
    <section style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <CenteredHeader eyebrow="FAQ" title="Common questions" />
            <Reveal delay={80}>
              <div style={{ marginTop: 36, background: "#fff", borderRadius: T.rcard, border: `1px solid ${T.border}`, padding: "6px 24px" }}>
                {service.faqs.map((f) => <FaqItem key={f.question} question={f.question} answer={f.answer} />)}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Technologies we build with — the same real 8 logos as the homepage's
        XerxezTechStack, floating (auto-scroll), same as the homepage — not a
        static grid — matching etiot.in's service-page "Technologies we build
        with" band. Reuses XerxezTechStack's exported strip so the scroll
        mechanics/keyframes/pause-on-hover behavior exist in one place. ── */}
    <section style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <CenteredHeader eyebrow="Our Stack" title="Technologies we build with" />
      </div>
      <Reveal delay={80}>
        <div style={{ marginTop: 44 }}>
          <XerxezTechLogoStrip />
        </div>
      </Reveal>
    </section>

    {/* ── Why XERXEZ + closing CTA — shared sections, reused verbatim. ── */}
    <XerxezWhyChoose />
    <XerxezCtaBand />
  </>
);

export default XerxezServiceTemplate;
