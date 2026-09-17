// AboutV2.tsx
// Purpose: The /about page — a one-screen hero, 4 stat cards, "why XERXEZ"
//          copy + tech-stack marquee, a dark "six principles" grid,
//          mission/conviction cards, the three products, a leadership card,
//          the shared "Why XERXEZ" differentiators grid, and the shared CTA band.
// Used in: src/App.tsx  (route: /about)
// Data source: STATS use the real homepage/footer figures. PRODUCTS and VALUES
//              started from the existing About page (src/page/AboutPage.tsx)
//              but now carry this page's own copy/links per its design brief.
//              The leadership card uses the one verifiable fact in the repo —
//              the founder's LinkedIn (also in the site footer / SEO). "MT"
//              monogram is a placeholder per the client. VALUES' security
//              item states "enterprise-grade security" rather than naming
//              ISO 27001 / SOC 2 — the verified security claim lives once,
//              in the shared <XerxezWhyChoose /> "ISO 27001 Certified
//              Security" card reused at the bottom of this page.

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase, Building2, Layers, Gauge,          // stat-card icons
  Zap, ShieldCheck, Users, Code, BookOpen, TrendingUp, // "principles" icons
  GraduationCap, Cloud,                          // product icons
  Rocket, Sparkles, Tag, Key, Globe2,            // "why XERXEZ" card icons
  Handshake, Fuel,                               // "proven partner" field-row icons
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../components/seo/SEO";
import {
  XerxezShell, XerxezCtaBand, XerxezWhyChoose, XerxezTechLogoStrip, V2_HEADER_H,
  T, Btn, SectionHeading, Eyebrow, Reveal, DotGrid, sectionPad, IconTile,
} from "../../components/v2";
// Dark, moody tech-office team photo — full-bleed hero background.
import HERO_PHOTO from "../../assets/images/about-hero.jpg";

// The 4 stat cards (real numbers).
const STATS: { icon: LucideIcon; value: string; label: string; sub: string }[] = [
  { icon: Briefcase, value: "4+",    label: "Client projects delivered", sub: "Engineering & industrial clients" },
  { icon: Building2, value: "6+",    label: "Industries served",         sub: "EPC, Oil & Gas, Manufacturing & more" },
  { icon: Layers,    value: "12+",   label: "Platform modules",          sub: "CRM, HR, Sales, Procurement & more" },
  { icon: Gauge,     value: "99.9%", label: "Frontend uptime",           sub: "Across the XERXEZ platform" },
];

// The three XERXEZ products.
const PRODUCTS: { icon: LucideIcon; title: string; desc: string; to: string }[] = [
  { icon: Layers,        title: "AI-Powered ERP", to: "/services/ai-powered-erp",
    desc: "HR, CRM, Payroll, Sales, and Inventory — one AI-native platform that forecasts demand and automates workflows. Free to try, no credit card required." },
  { icon: GraduationCap, title: "LMA Academy", to: "/training",
    desc: "Courses in AI, MLOps, DevSecOps, Full Stack Development, and Cloud Architecture — taught by practitioners, with certificates on completion." },
  { icon: Cloud,         title: "DevSecOps & Cloud", to: "/services/devsecops-mlops-solutions",
    desc: "Security-embedded CI/CD pipelines and multi-cloud infrastructure on AWS, Azure, and GCP — zero-trust from day one." },
];

// "Proven Partner" section — the 6 field tags (real product/module names).
const FIELD_TAGS = ["AI-Powered ERP", "LMA Academy", "DevSecOps & Cloud", "HR & Payroll", "CRM & Sales", "Project Management"];

// "Proven Partner" section — the 5 right-column feature rows.
const FIELD_ROWS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers,    title: "Platform-first architecture",   desc: "Configurable rule engines and integration frameworks so deployments scale without starting over from scratch." },
  { icon: Handshake, title: "End-to-end ownership",           desc: "From requirements to deployment to support, we own the full solution journey — not just one layer." },
  { icon: Zap,       title: "Deployment-minded engineering",  desc: "Designed for reliability, maintainability and adoption in the field — not just performance in a demo environment." },
  { icon: ShieldCheck, title: "Governance with usability",    desc: "Stay compliant and auditable without burying operators in unnecessary complexity." },
  { icon: Fuel,      title: "Deep industry experience",       desc: "Proven deployments across EPC, Oil & Gas, Construction and Healthcare environments in UAE & India." },
];

// The 6 "Why XERXEZ" cards below the intro paragraphs.
const WHY_CARDS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Users,   title: "One Team, End to End",         desc: "We scope, build, deploy and support everything ourselves. No handoffs to third-party vendors, no finger-pointing when something breaks." },
  { icon: Rocket,  title: "Production in Weeks, Not Years", desc: "Our clients go live in under 6 months. We replace months-long rollouts with focused, sprint-based delivery that ships real value fast." },
  { icon: Sparkles, title: "AI Built In from Day One",     desc: "Every module ships with AI — forecasting, automation, anomaly detection. Not a chatbot added after launch, but intelligence woven into every workflow." },
  { icon: Tag,     title: "Fixed Price, No Surprises",     desc: "Scope and budget agreed up front. No change order culture, no scope creep invoices. What we quote is what you pay." },
  { icon: Key,     title: "You Own Everything",            desc: "Full IP transfer on delivery. Your code, your data, your platform. No vendor lock-in, no annual licence fees, no hostage situations." },
  { icon: Globe2,  title: "Built for UAE & India",         desc: "Deep understanding of local compliance, labour laws and business culture. We don't just sell software — we understand the markets you operate in." },
];

// The 6 operating principles.
const VALUES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Zap,         title: "Innovation First",      desc: "We adopt AI, cloud-native architectures and MLOps before they become industry standard — because early movers set the standards." },
  { icon: ShieldCheck, title: "Security by Design",     desc: "Enterprise-grade security and zero-trust are embedded from day one — not bolted on before go-live." },
  { icon: Users,       title: "Client Partnership",     desc: "We measure success in outcomes, not deliverables. 90%+ renewal rates reflect our long-term commitment." },
  { icon: Code,        title: "Engineering Excellence", desc: "Clean code, high test coverage, rigorous code review. We build systems that are maintainable for years." },
  { icon: BookOpen,    title: "Continuous Learning",    desc: "20% of engineer time goes to R&D, certifications, and open-source contribution. Stale teams build stale software." },
  { icon: TrendingUp,  title: "Impact Over Activity",   desc: "Every engagement starts with a measurable success metric — and we don't stop until we hit it." },
];

// One stat card — white, overlapping the bottom of the hero photo (etiot.in
// reference pattern). Red bold number, dark navy label, gray description.
// 3D lift + red glow on hover, no rotation.
const StatCard = ({ icon: Icon, value, label, sub }: { icon: LucideIcon; value: string; label: string; sub: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.rcard,
        padding: "28px 26px",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? `0 24px 48px ${T.redGlow}` : "0 20px 44px rgba(16,42,77,0.10)",
        transition: "transform 300ms ease, box-shadow 300ms ease",
      }}
    >
      <IconTile active={hover}><Icon size={20} strokeWidth={2} /></IconTile>
      <div style={{ fontFamily: T.fontHead, fontSize: 36, fontWeight: 800, color: T.red, lineHeight: 1, margin: "16px 0 4px" }}>
        {value}
      </div>
      <div style={{ fontFamily: T.fontHead, fontSize: 15, fontWeight: 700, color: T.headNavy, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: T.fontBody, fontSize: 13, color: T.muted }}>{sub}</div>
    </div>
  );
};

// One "Why XERXEZ" card — white, red icon tile, red top border on hover,
// 3D lift (translateY(-10px)), no rotation.
const WhyCard = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#fff", borderRadius: 16, padding: "28px 26px",
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? "0 25px 50px rgba(7,26,51,0.20)" : "0 10px 30px rgba(7,26,51,0.08)",
        transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
      }}
    >
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 17.5, fontWeight: 700, color: T.headNavy, margin: "18px 0 9px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.65, color: T.muted, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

// One "Six Principles" card — dark navy (#071a33), red icon tile, white
// title, translucent white description. Same treatment as Careers' "Why
// Join Us" cards: translateY(-10px) + red glow on hover, no rotation.
const PrincipleCard = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#071a33", borderRadius: 16, padding: "30px 26px",
        border: `1px solid ${hover ? T.red : "rgba(255,255,255,0.12)"}`,
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? `0 24px 48px ${T.redGlow}` : "0 10px 30px rgba(7,26,51,0.25)",
        transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
      }}
    >
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 18, fontWeight: 700, color: "#fff", margin: "18px 0 9px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.70)", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

// One product card — lifts + deepens its shadow on hover (no rotation),
// matching the depth treatment used on every other /v2 card grid.
const ProductCard = ({ p }: { p: { icon: LucideIcon; title: string; desc: string; to: string } }) => {
  const [hover, setHover] = useState(false);
  const Icon = p.icon;
  return (
    <Link
      to={p.to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        background: "#fff", border: `1px solid ${T.border}`, borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        borderRadius: T.rcard, padding: "30px 28px", textDecoration: "none",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? "0 25px 50px rgba(7,26,51,0.20)" : "0 10px 30px rgba(7,26,51,0.08)",
        transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
      }}>
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 19, fontWeight: 700, color: T.headNavy, margin: "18px 0 10px" }}>
        {p.title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 14.5, lineHeight: 1.7, color: T.muted, margin: "0 0 18px", flex: 1 }}>
        {p.desc}
      </p>
      <span style={{ fontFamily: T.fontHead, fontSize: 14, fontWeight: 600, color: T.red }}>Learn more →</span>
    </Link>
  );
};

const AboutV2 = () => (
  <XerxezShell>
    <SEO
      title="About XERXEZ | AI ERP & Enterprise Tech Company India & UAE"
      description="Learn about XERXEZ — AI-powered enterprise platform and technology company serving businesses across India, Dubai & Abu Dhabi UAE. ISO 27001 certified security."
      canonical="/about"
      noIndex
    />

    {/* ── Hero — centred, dark tech-office photo, fixed to exactly one viewport
        (height + minHeight: 100svh, overflow: hidden) so eyebrow, H1, subtitle
        and both CTAs are visible without scrolling. ── */}
    <section style={{
      position: "relative", background: T.navy, overflow: "hidden",
      minHeight: "100svh", height: "100svh", display: "flex", alignItems: "center",
      paddingTop: V2_HEADER_H + 24, paddingBottom: 24,
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, backgroundImage: `url(${HERO_PHOTO})`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: T.scrim(0.55) }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Eyebrow color={T.redLight} mb={0}>XERXEZ · ABOUT US</Eyebrow>
          <h1 style={{
            fontFamily: T.fontHead, fontWeight: 800,
            fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", lineHeight: 1.1,
            letterSpacing: "-0.02em", color: "#fff", margin: 0, maxWidth: 900,
          }}>
            One team building AI-native enterprise operations
          </h1>
          <p style={{
            fontFamily: T.fontBody, fontSize: "1.05rem", lineHeight: 1.6,
            color: "rgba(255,255,255,0.78)", margin: 0, maxWidth: 640,
          }}>
            XERXEZ is an AI-powered enterprise platform built around three products —
            AI-Powered ERP, LMA Academy, and DevSecOps &amp; Cloud — owned end-to-end by one team.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 14 }}>
            <Btn to="/contact">Start a discovery discussion</Btn>
            <Btn to="/services" variant="outline" dark arrow={false}>Explore solutions</Btn>
          </div>
        </div>
      </div>
    </section>

    {/* ── Stat cards — pulled up (translateY -48px) so they straddle the hero edge,
        matching etiot.in's white overlapping stat band ── */}
    <section style={{ background: T.lightAlt, borderBottom: `1px solid ${T.border}` }}>
      <div className="container">
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20, transform: "translateY(-48px)", marginBottom: -20,   // overlap up + pull the next section back
        }}>
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <StatCard icon={s.icon} value={s.value} label={s.label} sub={s.sub} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* ── A Proven Partner — dark navy, two columns (etiot.in reference layout) ── */}
    <section style={{ ...sectionPad, background: "#071a33" }}>
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow color={T.redLight} mb={16}>About XERXEZ</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(28px, 3.4vw, 40px)",
                lineHeight: 1.2, letterSpacing: "-0.02em", color: "#fff", margin: 0,
              }}>
                A Proven Partner for Enterprise Digital Transformation
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.75)", margin: "20px 0 0" }}>
                XERXEZ specializes in AI-powered platforms for complex operational and industrial
                challenges. With deep expertise across EPC, Oil &amp; Gas, Manufacturing, Healthcare
                and Facility Management, we build configurable platforms that solve real business
                problems at scale — not custom software that ages the moment requirements shift.
              </p>

              <div style={{ height: 1, background: T.red, width: 64, margin: "28px 0" }} />

              <div style={{
                fontFamily: T.fontBody, fontSize: 11.5, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase", color: T.redLight, marginBottom: 16,
              }}>
                Built and Running in the Field
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {FIELD_TAGS.map((t) => (
                  <span key={t} style={{
                    fontFamily: T.fontHead, fontSize: 13, fontWeight: 600, color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "6px 14px",
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              <p style={{
                fontFamily: T.fontBody, fontSize: 14.5, fontStyle: "italic", lineHeight: 1.7,
                color: "rgba(255,255,255,0.6)", margin: "28px 0 0",
              }}>
                We measure success by the years-long relationships our platforms build — not by the
                number of projects we close.
              </p>
            </Reveal>
          </div>

          <div className="col-lg-6">
            <div>
              {FIELD_ROWS.map((r, i) => (
                <Reveal key={r.title} delay={i * 50}>
                  <div style={{
                    display: "flex", gap: 18, alignItems: "flex-start",
                    padding: "20px 0",
                    borderBottom: i < FIELD_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.10)" : "none",
                  }}>
                    <span style={{
                      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(217,53,34,0.16)", color: T.redLight,
                    }}>
                      <r.icon size={20} strokeWidth={2} />
                    </span>
                    <div>
                      <div style={{ fontFamily: T.fontHead, fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                        {r.title}
                      </div>
                      <div style={{ fontFamily: T.fontBody, fontSize: 14.5, lineHeight: 1.65, color: "rgba(255,255,255,0.70)" }}>
                        {r.desc}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Why XERXEZ — heading + subtitle, then 6 impact cards ── */}
    <section style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Why XERXEZ"
            title={<>Built for environments where downtime isn&apos;t an option</>}
            subtitle="Founded on a single conviction: enterprise AI adoption should be simple, secure, and fast — one AI-native platform, owned and supported end-to-end by the same team."
          />
        </Reveal>

        <div className="row g-4" style={{ marginTop: 48 }}>
          {WHY_CARDS.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <WhyCard icon={c.icon} title={c.title} desc={c.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Tech stack — "Working with" heading + the shared marquee strip ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading align="center" eyebrow="Our Stack" title="Working with" />
        </Reveal>
      </div>
      <Reveal delay={80}>
        <div style={{ marginTop: 44 }}>
          <XerxezTechLogoStrip />
        </div>
      </Reveal>
    </section>

    {/* ── Six principles — dark navy 3-column card grid ── */}
    <section style={{ ...sectionPad, background: T.navy, position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="How We Work"
            title="Six principles, every decision"
            subtitle="The standards that shape how we scope, build, and support every engagement."
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {VALUES.map((v, i) => (
            <div key={v.title} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 60} fill>
                <PrincipleCard icon={v.icon} title={v.title} desc={v.desc} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Three products — card grid, each links to its /v2 page ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="What We Build"
            title="Three products. One platform."
            subtitle="Everything an enterprise needs to run operations, upskill teams, and ship securely — built and owned by XERXEZ end-to-end."
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 52 }}>
          {PRODUCTS.map((p, i) => (
            <div key={p.title} className="col-lg-4">
              <Reveal delay={i * 60} fill>
                <ProductCard p={p} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Leadership — single founder card (placeholder monogram, per client) ── */}
    <section style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="Leadership" title="The team behind the platform" />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 44 }}>
          <div className="col-lg-6">
            <Reveal>
              <div style={{
                display: "flex", gap: 20, alignItems: "center",
                background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.rcard, padding: "28px 26px",
                boxShadow: T.cardShadow, height: "100%",
              }}>
                {/* "MT" monogram — swap for a photo once the client provides one */}
                <span style={{
                  width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: T.red, color: "#fff",
                  fontFamily: T.fontHead, fontSize: 22, fontWeight: 800,
                }}>
                  MT
                </span>
                <div>
                  <div style={{ fontFamily: T.fontHead, fontSize: 18, fontWeight: 700, color: T.headNavy }}>
                    Er. Mohammed Tanzeem Agra
                  </div>
                  <div style={{ fontFamily: T.fontBody, fontSize: 13.5, color: T.muted, margin: "3px 0 12px" }}>
                    Founder · BE, MTech (CSE)
                  </div>
                  {/* the founder LinkedIn already used in the site footer / SEO */}
                  <a
                    href="https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/"
                    target="_blank" rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      fontFamily: T.fontHead, fontSize: 13, fontWeight: 600, color: T.red, textDecoration: "none",
                    }}
                  >
                    <i className="fab fa-linkedin-in" /> Connect on LinkedIn
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6 d-flex align-items-center">
            <Reveal delay={80}>
              <p style={{
                fontFamily: T.fontBody, fontSize: 14.5, fontStyle: "italic",
                color: T.muted, margin: 0,
              }}>
                More team members coming soon.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Why XERXEZ — shared differentiators grid, reused verbatim ── */}
    <XerxezWhyChoose />

    <XerxezCtaBand />
  </XerxezShell>
);

export default AboutV2;
