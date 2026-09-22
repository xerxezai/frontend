// PartnerWithUsPage.tsx
// Purpose: The /partner-with-us page — pitches the 3 ways to partner with
//          XERXEZ Academy (individual instructor, company/organisation,
//          listing existing courses), reuses <XerxezPartnerCourses> to show
//          the external courses already live on the platform, and closes
//          with a CTA band.
// Used in: src/App.tsx  (route: /partner-with-us)

import { useState } from "react";
import {
  Globe2, Wallet, Award, HeartHandshake,
  ClipboardList, ShieldCheck, TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../components/seo/SEO";
import {
  XerxezShell, XerxezPartnerCourses,
  T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IconTile, sectionPad, V2_HEADER_H,
} from "../../components/v2";

// ── Partnership type cards (Choose Your Path — 2 cards) ──────────────────
interface PartnershipType {
  emoji: string;
  title: string;
  desc: string;
  ctaLabel: string;
  ctaTo: string;
}
const PARTNERSHIP_TYPES: PartnershipType[] = [
  {
    emoji: "👨‍💻", title: "Individual Instructor",
    desc: "Upload your course, set your price, earn revenue.",
    ctaLabel: "Apply as Instructor →", ctaTo: "/lma/become-instructor",
  },
  {
    emoji: "🏢", title: "Company / Organisation",
    desc: "Host your corporate courses on XERXEZ Academy.",
    ctaLabel: "Apply as Partner →", ctaTo: "/lma/become-instructor",
  },
];

const PartnershipTypeCard = ({ p }: { p: PartnershipType }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", display: "flex", flexDirection: "column",
        background: "#fff", borderRadius: 16, padding: "32px 28px",
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? "0 25px 50px rgba(7,26,51,0.20)" : "0 10px 30px rgba(7,26,51,0.08)",
        transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>{p.emoji}</div>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 19, fontWeight: 700, color: T.headNavy, margin: "0 0 10px" }}>
        {p.title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.7, color: T.muted, margin: "0 0 22px", flex: 1 }}>
        {p.desc}
      </p>
      <Btn to={p.ctaTo} arrow={false}>{p.ctaLabel}</Btn>
    </div>
  );
};

// ── List Your Courses — standalone section, 2-column ─────────────────────
const LIST_COURSES_STEPS = [
  "📋 Send us your course details and link",
  "🔗 We list your courses on XERXEZ training page",
  "👆 Students click → go to your website directly",
  "🎟️ Provide a coupon code for XERXEZ students",
];

// ── Why Partner — 4 dark navy cards ─────────────────────────────────────
interface WhyItem { icon: LucideIcon; title: string; desc: string }
const WHY_ITEMS: WhyItem[] = [
  { icon: Globe2, title: "UAE & India Reach", desc: "Tap into our established learner base across two fast-growing tech markets." },
  { icon: Wallet, title: "Revenue Share", desc: "Transparent, competitive commission on every enrollment you bring or convert." },
  { icon: Award, title: "CPD Accredited", desc: "Your course sits alongside CPD-accredited programs, backed by real credibility." },
  { icon: HeartHandshake, title: "Full Support", desc: "From onboarding to marketing — our team helps you launch and grow." },
];

const WhyCard = ({ icon: Icon, title, desc }: WhyItem) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: hover ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, padding: "26px 22px",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 260ms ease, background 220ms ease",
      }}
    >
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 16, fontWeight: 700, color: "#fff", margin: "16px 0 8px" }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,0.62)", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

// ── How it works — 3 steps ──────────────────────────────────────────────
interface StepItem { icon: LucideIcon; step: string; title: string; desc: string }
const STEPS: StepItem[] = [
  { icon: ClipboardList, step: "01", title: "Apply", desc: "Tell us about yourself, your organization, or how you'll promote our courses." },
  { icon: ShieldCheck, step: "02", title: "Get Approved", desc: "Our team reviews your application, usually within a couple of business days." },
  { icon: TrendingUp, step: "03", title: "Start Earning", desc: "Publish courses or share your affiliate link — and track everything from your dashboard." },
];

const StepCard = ({ icon: Icon, step, title, desc }: StepItem) => (
  <div style={{ textAlign: "center", padding: "0 12px" }}>
    <div style={{ position: "relative", display: "inline-flex", marginBottom: 18 }}>
      <IconTile size={64}><Icon size={26} strokeWidth={2} /></IconTile>
      <span style={{
        position: "absolute", top: -8, right: -8, background: T.headNavy, color: "#fff",
        fontFamily: T.fontHead, fontSize: 11, fontWeight: 800, borderRadius: 999,
        width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {step}
      </span>
    </div>
    <h3 style={{ fontFamily: T.fontHead, fontSize: 17, fontWeight: 700, color: T.headNavy, margin: "0 0 8px" }}>{title}</h3>
    <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.7, color: T.muted, margin: "0 auto", maxWidth: 260 }}>{desc}</p>
  </div>
);

const PartnerWithUsPage = () => (
  <XerxezShell>
    <SEO
      title="Partner with XERXEZ Academy"
      description="Become an instructor, host your organization's courses, or become an affiliate — share your expertise with thousands of learners across UAE & India."
      canonical="/partner-with-us"
    />

    {/* ── Hero — dark navy ── */}
    <section style={{
      background: `linear-gradient(160deg, ${T.navy} 0%, #04101f 100%)`,
      padding: `calc(${V2_HEADER_H}px + clamp(64px, 9vw, 120px)) 0 clamp(56px, 7vw, 96px)`,
      position: "relative", overflow: "hidden",
    }}>
      <DotGrid opacity={0.4} size={36} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
        width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`, pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <Eyebrow color={T.redLight}>XERXEZ ACADEMY PARTNERSHIP</Eyebrow>
          <h1 style={{
            fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2rem, 4.2vw, 3.2rem)",
            lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 auto", maxWidth: 760,
          }}>
            Share Your Expertise With Thousands of Learners
          </h1>
          <p style={{
            fontFamily: T.fontBody, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.75)",
            margin: "18px auto 32px", maxWidth: 560,
          }}>
            Whether you're an individual expert, a training organization, or someone with an
            audience to share — there's a way to partner with XERXEZ Academy.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Btn to="/lma/become-instructor">Become an Instructor →</Btn>
            <Btn to="/lma/affiliate/apply" variant="outline" dark arrow={false}>Become an Affiliate →</Btn>
          </div>
        </Reveal>
      </div>
    </section>

    {/* ── List Your Courses on XERXEZ — standalone 2-column section ── */}
    <section style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="FOR COURSE OWNERS"
            title="Already have courses? List them on XERXEZ."
            subtitle="You have existing courses on your own platform. We list them on XERXEZ website. Students click and go directly to YOUR website to enroll."
          />
        </Reveal>
        <div className="row g-4 align-items-stretch" style={{ marginTop: 44 }}>
          <div className="col-lg-6">
            <Reveal fill>
              <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                  {LIST_COURSES_STEPS.map((line) => (
                    <li key={line} style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      fontFamily: T.fontBody, fontSize: 15, lineHeight: 1.6, color: T.headNavy,
                      background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px",
                    }}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal delay={80} fill>
              <div style={{
                height: "100%", background: T.navy, borderRadius: 18, padding: "40px 34px",
                display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                position: "relative", overflow: "hidden",
              }}>
                <div aria-hidden="true" style={{
                  position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
                  width: 420, height: 420, borderRadius: "50%",
                  background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`, pointerEvents: "none",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{ fontFamily: T.fontHead, fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 18px" }}>
                    Get Your Courses Listed
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
                    {[
                      "Fill the form with your course details",
                      "Our team reviews within 48 hours",
                      "We list your courses on XERXEZ website",
                      "Students discover and visit your platform",
                    ].map((line) => (
                      <li key={line} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
                        <span style={{ color: "#4ade80", flexShrink: 0 }}>✅</span> {line}
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontFamily: T.fontBody, fontSize: 13, lineHeight: 1.6, fontStyle: "italic", color: "rgba(255,255,255,0.60)", margin: "0 0 22px" }}>
                    💬 Commission and revenue terms are discussed mutually.
                  </p>
                  <Btn to="/contact?service=partner-courses#enquiry">Submit Your Course Details →</Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Choose Your Path — 2 white 3D-lift cards ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Choose Your Path"
            title="Two Ways to Teach"
            subtitle="Pick the path that fits how you want to share your expertise."
          />
        </Reveal>
        <div className="row g-4 justify-content-center" style={{ marginTop: 48 }}>
          {PARTNERSHIP_TYPES.map((p, i) => (
            <div key={p.title} className="col-lg-4 col-md-6">
              <Reveal delay={i * 70} fill><PartnershipTypeCard p={p} /></Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Why Partner — 4 dark navy cards ── */}
    <section style={{ ...sectionPad, background: T.navy }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center" dark
            eyebrow="Why Partner With Us"
            title="Built for Serious Partners"
            subtitle="Real reach, real revenue, real support — not just a listing page."
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 44 }}>
          {WHY_ITEMS.map((item, i) => (
            <div key={item.title} className="col-lg-3 col-md-6">
              <Reveal delay={(i % 4) * 60} fill><WhyCard {...item} /></Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── How it works — 3 steps ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Simple Process"
            title="How It Works"
            subtitle="From application to your first earnings, in three steps."
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 48 }}>
          {STEPS.map((s, i) => (
            <div key={s.step} className="col-lg-4">
              <Reveal delay={i * 80} fill><StepCard {...s} /></Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>

    <XerxezPartnerCourses />

    {/* ── Closing CTA — navy band ── */}
    <section style={{ background: T.navy, padding: "clamp(64px, 8vw, 104px) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
        width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`, pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <Eyebrow color={T.redLight}>Get Started Today</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead, fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800,
            lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 auto", maxWidth: 640,
          }}>
            Ready to Partner with XERXEZ?
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 520,
          }}>
            Apply in minutes — our team reviews every application personally.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Btn to="/lma/become-instructor">Become an Instructor →</Btn>
            <Btn to="/lma/affiliate/apply" variant="outline" dark arrow={false}>Become an Affiliate →</Btn>
          </div>
        </Reveal>
      </div>
    </section>
  </XerxezShell>
);

export default PartnerWithUsPage;
