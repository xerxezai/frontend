// CareersV2.tsx
// Purpose: The /careers page — hero, "why join us", live open positions,
//          culture, benefits, the application form, and a closing CTA.
//          Structure mirrors etiot.in's careers page.
// Used in: src/App.tsx  (route: /careers)
// Data source: WHY_US / CULTURE / BENEFITS started from src/page/CareersPage.tsx's
//              lists but now carry original, page-specific copy and card counts
//              (4 / 6 / 8) per this page's own design brief — no longer a 1:1
//              mirror. Job listings come from GET /careers/positions/ with
//              FALLBACK_POSITIONS shown until it responds. The application
//              form (<XerxezCareersForm>) POSTs to /careers/apply/.

import { useEffect, useState } from "react";
import {
  Rocket, Globe2, BookOpen, Wallet, Handshake, Target, TrendingUp, Lock,
  Home, Clock3, Award, Wrench, MapPin, CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO, { PAGE_SEO } from "../../components/seo/SEO";
import apiService from "../../services/api";
// Diverse team collaborating in a bright modern office — full-bleed hero background (dark overlay on top).
import careersHero from "../../assets/images/careers-hero-v2.jpg";
import {
  XerxezShell, XerxezCareersForm, type Position, V2_HEADER_H,
  T, Btn, SectionHeading, Eyebrow, Reveal, DotGrid, sectionPad, IconTile,
} from "../../components/v2";

// Spread onto a section to offset its `#anchor` scroll target below the fixed header.
const anchor = { scrollMarginTop: V2_HEADER_H + 24 };

// The 3 checkmark lines under the hero subtitle.
const HERO_CHECKS = ["Remote-first · UAE & India based", "Fast-growing product team", "Real clients, real impact"];

// Shown until the live /careers/positions/ endpoint responds (verbatim from CareersPage).
const FALLBACK_POSITIONS: Position[] = [
  { id: "full-stack-ai-trainer", title: "Full Stack AI Trainer", type: "Full Time", location: "Remote",
    description: "Train and develop AI models, create AI course content for our Academy platform, work with students and instructors.",
    requirements: ["Python", "Machine Learning", "React", "Django", "Content Creation"] },
  { id: "mlops-engineer-mlflow", title: "MLOps Engineer (MLflow)", type: "Full Time", location: "Remote",
    description: "Build and maintain ML pipelines using MLflow, monitor model performance, deploy models to production.",
    requirements: ["MLflow", "Docker", "Kubernetes", "Python", "AWS/GCP", "CI/CD"] },
];

// The 4 "why join us" cards, 2x2 grid, dark navy.
const WHY_US: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Rocket,   title: "Fast Growth",              desc: "Ship real features on our AI-powered platform and Academy — not legacy maintenance work. Your code goes live to real engineering clients." },
  { icon: Globe2,   title: "Remote First",              desc: "No office required. Work from anywhere with a team that has built async collaboration in from day one across UAE & India." },
  { icon: BookOpen, title: "Learning & Development",    desc: "Hands-on access to AI tools, courses, cloud certifications and mentorship. You grow as the product grows." },
  { icon: Wallet,   title: "Performance Bonus",         desc: "Compensation tied to real impact — ship meaningful work and get rewarded for it. Market-rate salaries + performance bonuses." },
];

// The 6 culture cards, 3-column grid, white with a red left border.
const CULTURE: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Handshake,  title: "Collaborative",       desc: "Async-first by default, with regular syncs that keep everyone aligned no matter which time zone they're in. No micromanagement — just clear goals and trust." },
  { icon: Rocket,     title: "Innovative",          desc: "Every module we ship has AI built in from day one — not bolted on after the fact. We push the boundaries of what enterprise software can do." },
  { icon: Target,     title: "Impact-Driven",       desc: "We build for the engineers, HR teams and operators who use our platform daily — not for a demo. Real users, real feedback, real improvement." },
  { icon: TrendingUp, title: "Growth Mindset",      desc: "We invest in our people. Access to courses, certifications, AI tools and mentorship — because when you grow, the product grows." },
  { icon: Globe2,     title: "Globally Distributed", desc: "A remote-first team spanning UAE and India, working across time zones with modern tools and a culture built for distributed work." },
  { icon: Lock,       title: "Ownership Culture",   desc: "Every team member owns their work end to end — from design to deployment to support. No blame culture, just accountability and learning." },
];

// The 8 benefit cards, 4-column grid on desktop, white with icon tile.
const BENEFITS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Home,       title: "Remote Work",           desc: "Fully remote — set up your workspace wherever you do your best work. No commute, no office politics, just focus." },
  { icon: Clock3,     title: "Flexible Hours",        desc: "A few core overlap hours for syncs. Structure the rest of your day around what works for you and your time zone." },
  { icon: BookOpen,   title: "Learning Budget",       desc: "Annual learning budget for courses, certifications and conferences. Direct access to AI tools and platforms to stay ahead." },
  { icon: Award,      title: "Performance Bonus",     desc: "Merit-based bonuses when your work moves the needle — not a fixed annual formality tied to politics." },
  { icon: TrendingUp, title: "Career Growth",         desc: "Clear growth paths from junior to senior to lead. We promote from within and reward people who take ownership." },
  { icon: Wrench,     title: "Modern Tooling",        desc: "Access to the latest AI tools, cloud platforms and development infrastructure — no fighting with outdated systems." },
  { icon: Globe2,     title: "UAE & India Presence",  desc: "Work with clients and teams across two of the fastest growing tech markets in the world." },
  { icon: Handshake,  title: "Supportive Team",       desc: "A small, senior team where your voice matters. Direct access to founders and leadership from day one." },
];

// One "Why Join Us" card — dark navy (#071a33), red icon tile, white title,
// translucent white description, red-glow lift on hover (no rotation).
const WhyJoinCard = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#071a33", borderRadius: 16, padding: "32px 28px",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? `0 24px 48px ${T.redGlow}` : "0 10px 30px rgba(7,26,51,0.25)",
        transition: "transform 300ms ease, box-shadow 300ms ease",
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

// One job card in the "Open positions" band — white, 3D lift + red top
// border on hover, no rotation. Clicking Apply prefills the form's position
// dropdown and scrolls to it (via `onApply`).
const JobCard = ({ job, onApply }: { job: Position; onApply: (t: string) => void }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", display: "flex", flexDirection: "column",
        background: "#fff", borderRadius: 16, padding: "30px 28px",
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover ? "0 25px 50px rgba(7,26,51,0.20)" : "0 10px 30px rgba(7,26,51,0.08)",
        transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
      }}
    >
      {/* "Full Time · Remote" pill */}
      <div style={{ marginBottom: 16 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: T.lightAlt, color: T.muted,
          fontFamily: T.fontBody, fontSize: 12.5, fontWeight: 600,
          padding: "6px 14px", borderRadius: 999,
        }}>
          {job.type} <MapPin size={12} />{job.location}
        </span>
      </div>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 21, fontWeight: 800, color: T.headNavy, margin: "0 0 12px" }}>{job.title}</h3>
      <p style={{
        fontFamily: T.fontBody, fontSize: 14.5, lineHeight: 1.68, color: T.muted, margin: "0 0 20px", flex: 1,
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {job.description}
      </p>
      {/* tech stack tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {job.requirements.map((r) => (
          <span key={r} style={{
            background: "rgba(217,53,34,0.08)", color: T.red,
            fontFamily: T.fontBody, fontSize: 12, fontWeight: 600,
            padding: "5px 13px", borderRadius: 999,
          }}>
            {r}
          </span>
        ))}
      </div>
      <button type="button" onClick={() => onApply(job.title)} style={{
        display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-end",
        background: "none", border: "none", cursor: "pointer", padding: 0,
        fontFamily: T.fontHead, fontSize: 14.5, fontWeight: 700, color: T.red,
      }}>
        Apply for this role →
      </button>
    </div>
  );
};

// One culture card — white with a red left border, icon tile top-left,
// dark navy title, gray description, 8px lift on hover (no rotation).
const CultureCard = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#fff", borderLeft: `3px solid ${T.red}`, borderRadius: 16,
        padding: "28px 26px",
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? "0 24px 48px rgba(7,26,51,0.16)" : T.cardShadow,
        transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms ease",
      }}
    >
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 18, fontWeight: 700, color: T.headNavy, margin: "18px 0 9px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.65, color: T.muted, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

// One benefit card — white, red icon tile, red-top-border lift on hover,
// no rotation. Used in the 4-up (desktop) benefits grid.
const BenefitCard = ({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", background: "#fff", borderRadius: 16, padding: "28px 24px",
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? "0 24px 48px rgba(7,26,51,0.16)" : "0 10px 30px rgba(7,26,51,0.08)",
        transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms ease, border-color 260ms ease",
      }}
    >
      <IconTile active={hover}><Icon size={22} strokeWidth={2} /></IconTile>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 16.5, fontWeight: 700, color: T.headNavy, margin: "16px 0 8px", lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.6, color: T.muted, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
};

const CareersV2 = () => {
  const [positions, setPositions] = useState<Position[]>(FALLBACK_POSITIONS);   // job listings
  const [prefill, setPrefill] = useState("");                                   // job title to pre-select in the form

  // Fetch the live positions once; keep the fallback if the request fails or is shaped unexpectedly.
  useEffect(() => {
    let cancelled = false;   // guard against setting state after unmount
    (async () => {
      const result = await apiService.get<{ positions: Position[] }>("/careers/positions/");
      if (!cancelled && result.success && Array.isArray((result.data as { positions?: Position[] })?.positions)) {
        setPositions((result.data as { positions: Position[] }).positions);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // A JobCard "Apply" click: remember the title, then scroll to the form.
  const onApply = (title: string) => {
    setPrefill(title);
    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <XerxezShell>
      {/* PAGE_SEO.careers carries the careers JobPosting JSON-LD; canonical + noIndex overridden for /v2 */}
      <SEO {...PAGE_SEO.careers} canonical="/careers" noIndex />

      {/* ── Hero — full-bleed office photo + dark navy overlay + soft red glow, left-aligned ──
          Fixed to exactly one viewport (height + minHeight: 100svh, overflow: hidden) —
          every hero element (eyebrow, H1, subtitle, 3 checkmarks, 2 CTAs) must be visible
          without scrolling, so type scale and gaps are compressed versus other /v2 heroes. */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #071a33 0%, #0d2d4e 100%)",   // navy fallback while the photo loads
        minHeight: "100svh", height: "100svh", display: "flex", alignItems: "center",
        paddingTop: V2_HEADER_H + 24, paddingBottom: 24,
      }}>
        {/* full-width background photo */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${careersHero})`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        {/* dark navy overlay so the white hero text stays readable */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: T.scrim(0.55) }} />
        {/* soft red radial glow, top-right */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "-25%", right: "-10%",
          width: 680, height: 680, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.redGlow} 0%, rgba(217,53,34,0.06) 45%, transparent 70%)`,
          filter: "blur(20px)", pointerEvents: "none",
        }} />
        {/* faint dot texture — slightly softer/wider than the default so it
            doesn't fight the photo underneath */}
        <DotGrid opacity={0.4} size={36} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 12 }}>
            <Eyebrow color={T.redLight} mb={0}>XERXEZ · CAREERS</Eyebrow>
            <h1 style={{
              fontFamily: T.fontHead, fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.08,
              letterSpacing: "-0.025em", color: "#fff", margin: 0,
            }}>
              Build the Future of Enterprise AI with Us
            </h1>
            <p style={{
              fontFamily: T.fontBody, fontSize: "1rem", lineHeight: 1.6,
              color: "rgba(255,255,255,0.8)", margin: 0, maxWidth: 560,
            }}>
              Join a remote-first team building AI-powered platforms for engineering, EPC and
              industrial companies across UAE &amp; India — where your work ships to real clients, fast.
            </p>

            {/* 3 checkmark lines, replacing the old pill chips */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {HERO_CHECKS.map((label) => (
                <span key={label} style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  fontFamily: T.fontHead, fontSize: "0.95rem", fontWeight: 600,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  <CheckCircle2 size={18} strokeWidth={2.5} color={T.redLight} />
                  {label}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 16 }}>
              {/* both scroll to sections on this page */}
              <Btn href="#positions">View open positions</Btn>
              <Btn href="#culture" variant="outline" dark arrow={false}>See our culture</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why join us — 4 cards, 2x2 grid, dark navy on a light gray section ── */}
      <section style={{ ...sectionPad, background: T.lightAlt }}>
        <div className="container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Why Join Us"
              title="Work that sharpens your craft"
              subtitle="A remote-first team building production AI systems with modern tooling, clear ownership, and room to grow."
            />
          </Reveal>
          <div className="row g-4" style={{ marginTop: 48 }}>
            {WHY_US.map((it, i) => (
              <div key={it.title} className="col-lg-6">
                <Reveal delay={i * 60} fill>
                  <WhyJoinCard icon={it.icon} title={it.title} desc={it.desc} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open positions — dark, scroll target #positions, 2-col 3D-lift job cards ── */}
      <section id="positions" style={{ ...sectionPad, ...anchor, background: T.navyGrad }}>
        <div className="container">
          <Reveal>
            <SectionHeading
              dark align="center"
              eyebrow="Open Positions"
              title="Come build with us"
              subtitle="Every role is remote and works on real product from day one."
            />
          </Reveal>
          <div className="row g-4" style={{ marginTop: 48 }}>
            {positions.map((job, i) => (
              <div key={job.id} className="col-lg-6">
                <Reveal delay={i * 60} fill><JobCard job={job} onApply={onApply} /></Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our culture — scroll target #culture, 6 cards in a 3-column grid ── */}
      <section id="culture" style={{ ...sectionPad, ...anchor, background: T.lightAlt }}>
        <div className="container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Our Culture"
              title="A workplace built on ownership and craft"
              subtitle="Culture is how we ship — with ownership, curiosity, and respect for the people who use what we build."
            />
          </Reveal>
          <div className="row g-4" style={{ marginTop: 48 }}>
            {CULTURE.map((it, i) => (
              <div key={it.title} className="col-lg-4 col-md-6">
                <Reveal delay={(i % 3) * 60} fill>
                  <CultureCard icon={it.icon} title={it.title} desc={it.desc} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits — 8 cards, 4-up desktop / 2-up tablet / 1-up mobile ── */}
      <section style={{ ...sectionPad, background: "#fff" }}>
        <div className="container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Benefits"
              title="Support that helps you do your best work"
              subtitle="Practical benefits designed around flexibility, learning, and long-term growth."
            />
          </Reveal>
          <div className="row g-4" style={{ marginTop: 48 }}>
            {BENEFITS.map((it, i) => (
              <div key={it.title} className="col-lg-3 col-md-6">
                <Reveal delay={(i % 4) * 60} fill>
                  <BenefitCard icon={it.icon} title={it.title} desc={it.desc} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application form — scroll target #apply-form ── */}
      <section id="apply-form" style={{ ...sectionPad, ...anchor, background: T.lightAlt }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <Reveal>
                <SectionHeading
                  align="center"
                  eyebrow="Apply Now"
                  title="Start your application"
                  subtitle="Fill in the form and attach your resume. We reply within 3–5 business days."
                />
              </Reveal>
              <Reveal delay={60}>
                <div style={{
                  marginTop: 44, background: "#fff", borderRadius: 20, padding: "40px 36px",
                  border: `1px solid ${T.border}`, borderTop: `3px solid ${T.red}`,
                  boxShadow: "0 24px 60px rgba(16,42,77,0.10)",
                }}>
                  {/* `prefill` is the job title chosen from a JobCard's Apply button */}
                  <XerxezCareersForm positions={positions} prefillPosition={prefill} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA — navy band ── */}
      <section style={{ background: T.navy, padding: "clamp(64px, 8vw, 104px) 0", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)",
          width: 680, height: 680, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 68%)`, pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Reveal>
            <Eyebrow color={T.redLight}>Join the Team</Eyebrow>
            <h2 style={{
              fontFamily: T.fontHead, fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800,
              lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 auto", maxWidth: 640,
            }}>
              Ready to build with us?
            </h2>
            <p style={{
              fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)", margin: "18px auto 32px", maxWidth: 520,
            }}>
              Explore open roles across engineering, AI, and delivery — or send your resume
              and we'll reach out when something fits.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              <Btn href="#positions">View open positions</Btn>
              <Btn href="mailto:info@xerxez.com" variant="outline" dark arrow={false}>Email your resume</Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </XerxezShell>
  );
};

export default CareersV2;
