// TrainingV2.tsx
// Purpose: The /training page — hero (with the cohort card), the live course
//          grid, a "why our training" band with a stat strip, an enterprise-
//          training CTA, and the shared CTA band.
// Used in: src/App.tsx  (route: /training)
// Data source: FEATURES and WHY_STATS mirror the existing TrainingPage
//              (src/page/TrainingPage.tsx). Course cards come from the live API
//              via <XerxezCourses>.

import { useState } from "react";
import {
  UserCheck, Laptop, Award, Users, CheckCircle2,
  GraduationCap, ClipboardList, FlaskConical,
  Building2, Monitor, Target, Zap, Globe2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../components/seo/SEO";
import {
  XerxezShell,
  XerxezTrainingCard, XerxezCourses,
  T, Eyebrow, SectionHeading, DotGrid, Btn, Reveal, IconTile, sectionPad, V2_HEADER_H,
} from "../../components/v2";
import heroImage from "../../assets/images/training-hero.jpg";

// The 3 trust checkmarks under the hero subtitle.
const HERO_CHECKS = [
  "Hands-on labs with real projects",
  "Certified by industry practitioners",
  "UAE & India based delivery",
];

// The 4 "why train with us" cards (verbatim from TrainingPage's `features`).
const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: UserCheck, title: "Industry Expert Instructors", desc: "Real-world practitioners with 5+ years of enterprise deployment experience. No academics — engineers who've shipped it in production." },
  { icon: Laptop,    title: "Hands-On Projects Only",      desc: "Build real enterprise systems during the course, not toy examples. Every lab uses production-equivalent environments." },
  { icon: Award,     title: "XERXEZ AI Certification",     desc: "Role-specific certificates (AI Engineer, MLOps Practitioner, AI Leader) that are industry recognised." },
  { icon: Users,     title: "Enterprise Batch Training",   desc: "Custom cohort programs for your entire team — 5 to 100 people — delivered at your pace, in-person or virtually." },
];

// Stat strip under the "why" cards. UAE and India get their own entries
// rather than one combined "UAE & India" stat, so both read with equal
// weight in the strip.
const WHY_STATS = [
  { v: "75+",   l: "Professionals trained" },
  { v: "4+",    l: "Client projects" },
  { v: "5+",    l: "Active programs" },
  { v: "UAE",   l: "Based & supported" },
  { v: "India", l: "Based & supported" },
];

// "For Organisations" — 3 delivery-model cards, right column.
const ORG_FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Building2, title: "On-Site Delivery",  desc: "Our trainers come to your office and deliver the program in your environment, with your tools and your data." },
  { icon: Monitor,    title: "Virtual & Hybrid",  desc: "Fully remote or hybrid delivery with live sessions, shared labs and real-time instructor access." },
  { icon: Target,     title: "Custom Curriculum", desc: "We build the program around your team's skill gaps, your tech stack and your specific AI use cases." },
];

// Closing CTA — 3 trust signals below the buttons.
const CTA_TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,           text: "Fast onboarding — program starts within 2 weeks" },
  { icon: GraduationCap, text: "CPD Accredited certification" },
  { icon: Globe2,        text: "UAE & India delivery" },
];

// One dark-navy advantage card — red icon tile, 3D lift + red glow on hover
// (no rotation). Used for the "Our Advantage" 2x2 grid, which sits on a
// white section, so the card supplies its own navy background rather than
// relying on a dark section behind it.
const AdvantageCard = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: T.navy, borderRadius: 16, padding: "30px 28px",
        border: `1px solid ${hover ? T.red : "rgba(255,255,255,0.08)"}`,
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? `0 24px 48px ${T.redGlow}` : "0 10px 30px rgba(7,26,51,0.20)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 18, fontWeight: 700, color: "#fff", margin: "20px 0 10px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.70)", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

// "Teach on XERXEZ Academy" — 4 benefit cards, left column of the instructor section.
const INSTRUCTOR_BENEFITS: { emoji: string; title: string; desc: string }[] = [
  { emoji: "💰", title: "Earn from your expertise", desc: "Get paid for every student who enrolls in your course. Competitive revenue share on every enrollment." },
  { emoji: "🌍", title: "Reach enterprise learners", desc: "Your courses reach IT teams, engineers and enterprise professionals across UAE & India." },
  { emoji: "🎓", title: "Build your brand", desc: "Establish yourself as a thought leader in AI, MLOps, DevSecOps or cloud architecture." },
  { emoji: "🛠️", title: "Full production support", desc: "We handle hosting, payments, marketing and student support — you just teach." },
];

// Requirements checklist on the instructor CTA card.
const INSTRUCTOR_REQUIREMENTS = [
  "1+ years industry experience",
  "Real production experience (not just theory)",
  "Ability to create hands-on labs",
];

// One light-gray benefit card — used in the "Teach on XERXEZ Academy" left column.
const InstructorBenefitCard = ({ emoji, title, desc }: { emoji: string; title: string; desc: string }) => (
  <div style={{
    height: "100%", background: T.lightAlt, borderRadius: 16, padding: "24px 22px",
    border: `1px solid ${T.border}`,
  }}>
    <span style={{
      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "#fff", fontSize: 22, boxShadow: T.cardShadow,
    }}>
      {emoji}
    </span>
    <h3 style={{ fontFamily: T.fontHead, fontSize: 16, fontWeight: 700, color: T.headNavy, margin: "16px 0 8px", lineHeight: 1.3 }}>
      {title}
    </h3>
    <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.6, color: T.muted, margin: 0 }}>
      {desc}
    </p>
  </div>
);

// One translucent dark-on-dark feature card — used in the "For Organisations"
// right column, which already sits on a navy section, so the card itself is
// a subtle rgba tint rather than a solid navy fill.
const OrgFeatureCard = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "24px 22px",
        border: `1px solid ${hover ? T.red : "rgba(255,255,255,0.10)"}`,
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? "0 24px 48px rgba(0,0,0,0.35)" : "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <span style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.08)", color: "#fff",
      }}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 16, fontWeight: 700, color: "#fff", margin: "16px 0 8px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.70)", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

const TrainingV2 = () => (
  <XerxezShell>
    <SEO
      title="AI Training | Enterprise AI & Cloud Courses — XERXEZ India & UAE"
      description="XERXEZ AI training for IT teams and enterprises. Learn AI, DevSecOps, Cloud, and ERP from practitioners who've shipped it in production."
      canonical="/training"
      noIndex
    />

    {/* ── Hero — dark navy, training photo, navy scrim, left-aligned text +
        the cohort card in a right slot. Every size/spacing value here is
        copied verbatim from PortfolioV2's hero so the two pages match
        exactly; only the two-column split (60/40, 40px gap) is specific to
        this page, since Portfolio's hero has no right-side card. ── */}
    <section style={{
      position: "relative", overflow: "hidden",
      background: T.navyGrad,
      minHeight: "100svh", display: "flex", alignItems: "center",
      paddingTop: V2_HEADER_H + 56, paddingBottom: 72,
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center",
      }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(7,26,51,0.60)" }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "-25%", right: "-10%", width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, rgba(217,53,34,0.06) 45%, transparent 70%)`,
        filter: "blur(20px)", pointerEvents: "none",
      }} />
      <DotGrid opacity={0.4} size={36} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40 }}>
          <div style={{ flex: "1 1 480px", maxWidth: 720 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Eyebrow color={T.redLight} mb={0}>XERXEZ · AI TRAINING &amp; UPSKILLING</Eyebrow>
              <h1 style={{
                fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)",
                lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: 0,
              }}>
                Master Enterprise AI &amp; Cloud Technologies
              </h1>
              <p style={{ fontFamily: T.fontBody, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }}>
                Industry-led training for IT teams and enterprises across UAE &amp; India. Learn AI,
                MLOps, DevSecOps, Cloud and ERP — from practitioners who've shipped it in
                production, not just taught it in theory.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginTop: 2 }}>
                {HERO_CHECKS.map((point) => (
                  <div key={point} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color={T.red} strokeWidth={2.5} />
                    <span style={{ fontFamily: T.fontBody, fontSize: 13.5, fontWeight: 600, color: "#fff" }}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
                <Btn to="/lma/courses">Browse courses</Btn>
                <Btn to="/contact?service=ai-training" variant="outline" dark arrow={false}>Enterprise training</Btn>
                <Btn to="/lma/login" variant="outline" dark arrow>Sign in</Btn>
              </div>
            </div>
          </div>
          <div style={{ flex: "1 1 340px", maxWidth: 460 }}>
            <Reveal delay={80}>
              <XerxezTrainingCard />
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <XerxezCourses />

    {/* ── Our Advantage — white section, 4 dark 2x2 cards + stat strip. ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Our Advantage"
            title="Why XERXEZ training"
            subtitle="The difference between knowing AI and being able to build with it — that's what our programs create."
          />
        </Reveal>
        <div className="row g-4" style={{ marginTop: 52 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="col-lg-6">
              <Reveal delay={i * 60} fill>
                <AdvantageCard icon={f.icon} title={f.title} desc={f.desc} />
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal delay={80}>
          {/* stat strip — large red number + gray label, vertical dividers between */}
          <div style={{
            marginTop: 56, paddingTop: 40, borderTop: `1px solid ${T.border}`,
            display: "flex", flexWrap: "wrap", justifyContent: "center",
          }}>
            {WHY_STATS.map((s, i) => (
              <div key={s.l} style={{
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                padding: "0 40px", borderLeft: i > 0 ? `1px solid ${T.border}` : "none",
              }}>
                <span style={{ fontFamily: T.fontHead, fontSize: 34, fontWeight: 800, color: T.red, lineHeight: 1 }}>{s.v}</span>
                <span style={{ fontFamily: T.fontBody, fontSize: 12.5, fontWeight: 500, color: "#5b6b7c", marginTop: 8 }}>{s.l}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>

    {/* ── For Organisations — dark navy, text+badges+quote+CTA | 3 feature cards. ── */}
    <section style={{ ...sectionPad, background: T.navy, position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 70%)`, filter: "blur(20px)", pointerEvents: "none",
      }} />
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow color={T.redLight}>For Organisations</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(28px, 3.2vw, 42px)",
                lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: 0,
              }}>
                Train your entire team — we come to you
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.72)", margin: "18px 0 0" }}>
                Custom enterprise programs for 5 to 100 people. On-site, virtual, or hybrid — built
                around your team's exact AI priorities, tools and knowledge gaps.
              </p>
              {/* trust badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                {[
                  { icon: GraduationCap, text: "CPD Accredited" },
                  { icon: ClipboardList, text: "Custom Curriculum" },
                  { icon: FlaskConical,  text: "Hands-On Labs" },
                ].map((b) => (
                  <span key={b.text} style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    fontFamily: T.fontHead, fontSize: 12.5, fontWeight: 600, color: "#fff",
                    background: "rgba(255,255,255,0.10)", borderRadius: 20, padding: "8px 16px",
                  }}>
                    <b.icon size={14} strokeWidth={2} /> {b.text}
                  </span>
                ))}
              </div>
              <p style={{
                fontFamily: T.fontBody, fontStyle: "italic", fontSize: 16, lineHeight: 1.6,
                color: "rgba(255,255,255,0.70)", margin: "26px 0 0",
              }}>
                "Teams leave with production-ready AI skills, not just theory."
              </p>
              <div style={{ marginTop: 28 }}>
                <Btn to="/contact?service=ai-training">Request enterprise training</Btn>
              </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <div className="row g-4">
              {ORG_FEATURES.map((f, i) => (
                <div key={f.title} className="col-12">
                  <Reveal delay={80 + i * 60} fill>
                    <OrgFeatureCard icon={f.icon} title={f.title} desc={f.desc} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Teach on XERXEZ Academy — white, 4 benefit cards | dark instructor CTA card. ── */}
    <section style={{ ...sectionPad, background: "#fff" }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="For Instructors"
            title="Share your expertise. Teach on XERXEZ Academy."
            subtitle="Are you an AI practitioner, MLOps engineer, DevSecOps expert or cloud architect? Join our instructor team and teach thousands of enterprise professionals."
            align="center"
          />
        </Reveal>

        <div className="row g-4 align-items-stretch" style={{ marginTop: 24 }}>
          <div className="col-lg-7">
            <div className="row g-4">
              {INSTRUCTOR_BENEFITS.map((b, i) => (
                <div key={b.title} className="col-sm-6">
                  <Reveal delay={80 + i * 60} fill>
                    <InstructorBenefitCard emoji={b.emoji} title={b.title} desc={b.desc} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-5">
            <Reveal delay={140} fill>
              <div style={{
                height: "100%", background: T.navy, borderRadius: 20, padding: "34px 30px",
                display: "flex", flexDirection: "column",
              }}>
                <h3 style={{ fontFamily: T.fontHead, fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
                  Ready to teach?
                </h3>
                <p style={{ fontFamily: T.fontBody, fontSize: 14.5, lineHeight: 1.65, color: "rgba(255,255,255,0.70)", margin: "12px 0 0" }}>
                  Apply to become an instructor — we review applications within 48 hours.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "24px 0 0" }}>
                  {INSTRUCTOR_REQUIREMENTS.map((r) => (
                    <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                        background: T.red, color: "#fff",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, lineHeight: 1,
                      }}>
                        ✓
                      </span>
                      <span style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.88)" }}>
                        {r}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 28 }}>
                  <Btn to="/lma/become-instructor">Apply to become an instructor</Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Closing CTA — training-specific (not the shared <XerxezCtaBand/>). ── */}
    <section style={{ background: T.navy, padding: "clamp(64px, 8vw, 104px) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
        width: 680, height: 680, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`, pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <Eyebrow color={T.redLight}>Get Started</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead, fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800,
            lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 auto", maxWidth: 640,
          }}>
            Ready to upskill your team?
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 620,
          }}>
            Whether you're an individual looking to master AI or an enterprise training 100
            engineers — we have a program built for you. Let's map your team's skill gaps and
            build the right learning path.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Btn to="/lma/courses">Browse courses</Btn>
            <Btn to="/contact?service=ai-training" variant="outline" dark arrow={false}>Enterprise training</Btn>
          </div>

          {/* 3 trust signals — centered row below the buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", justifyContent: "center", marginTop: 34 }}>
            {CTA_TRUST_SIGNALS.map((s) => (
              <span key={s.text} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                <s.icon size={16} strokeWidth={2} color={T.redLight} />
                {s.text}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  </XerxezShell>
);

export default TrainingV2;
