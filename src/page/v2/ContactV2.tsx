// ContactV2.tsx
// Purpose: The /contact page — a confident hero with 3 stat cards, a
//          two-panel band (contact methods | "book a walkthrough" card), the
//          full enquiry form (<XerxezContactForm>), and a "what you can expect" trio.
//          Structure mirrors etiot.in's contact page.
// Used in: src/App.tsx  (route: /contact)
// Data source: contact details (email/phone/WhatsApp/LinkedIn) are XERXEZ's real
//              details. The 3 "expect" points paraphrase existing site copy
//              (ReadyCTA / ContactTrustBar). The form itself owns its data.

import { useState } from "react";
import { Mail, Phone, MessageCircle, Zap, HardHat, ShieldCheck, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "../../components/seo/SEO";
import {
  XerxezShell, XerxezContactForm, V2_HEADER_H,
  T, Btn, Eyebrow, SectionHeading, Reveal, DotGrid, sectionPad, IconTile,
} from "../../components/v2";

// Three trust-signal cards under the hero CTAs.
const TRUST_SIGNALS: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,         text: "Fast response — within 24 hours" },
  { icon: HardHat,     text: "Solution architect assigned" },
  { icon: ShieldCheck, text: "Enterprise-grade security" },
];

// Contact-method cards in the left panel of the two-panel band. `icon` is a
// lucide component, except LinkedIn — lucide dropped brand icons, so that
// one row falls back to the FontAwesome class in `fa` instead.
const METHODS: { icon?: LucideIcon; fa?: string; title: string; label: string; href: string }[] = [
  { icon: Mail,          title: "Email",    label: "info@xerxez.com",  href: "mailto:info@xerxez.com" },
  { icon: Phone,         title: "Phone",    label: "+971 56 786 7451", href: "tel:+971567867451" },
  { icon: MessageCircle, title: "WhatsApp", label: "Chat with us",     href: "https://wa.me/971567867451" },
  { fa: "fab fa-linkedin-in", title: "LinkedIn", label: "Connect with us", href: "https://www.linkedin.com/in/er-mohammed-tanzeem-agra-be-mtech-cse-438b1b74/" },
];

// The "what you can expect" columns.
const EXPECT = [
  { title: "Strategic alignment", body: "We map your goals to business outcomes and recommend the delivery model that fits your team." },
  { title: "Faster response",     body: "We reply every business day, with a tailored proposal within one business day of your enquiry." },
  { title: "Clear next steps",    body: "You'll leave with a concrete next-phase plan your team can act on — no ambiguity." },
];

// One hero trust-signal card — centered text, translucent white on navy,
// 3D lift + red glow on hover, no rotation.
const TrustCard = ({ icon: Icon, text }: { icon: LucideIcon; text: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: T.rcard, padding: "20px 18px", textAlign: "center",
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? `0 20px 40px ${T.redGlow}` : "none",
        transition: "transform 260ms ease, box-shadow 260ms ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <IconTile active={hover} size={40}><Icon size={18} strokeWidth={2} /></IconTile>
      </div>
      <div style={{ fontFamily: T.fontHead, fontSize: 14, fontWeight: 600, color: "#fff" }}>
        {text}
      </div>
    </div>
  );
};

// One contact-method card — dark background, white border, red icon, bold
// white label + link text, clickable in full. `icon` is a lucide component;
// `fa` is a FontAwesome class fallback for LinkedIn (lucide has no brand icons).
const MethodCard = ({ icon: Icon, fa, title, label, href }: { icon?: LucideIcon; fa?: string; title: string; label: string; href: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        background: "rgba(255,255,255,0.04)", border: `1px solid ${hover ? T.red : "rgba(255,255,255,0.3)"}`,
        borderRadius: T.rcard, padding: "16px 16px", textDecoration: "none", minHeight: 64,
        transition: "border-color 200ms ease, transform 200ms ease",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <span style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "rgba(217,53,34,0.16)", color: T.redLight, fontSize: 16,
      }}>
        {Icon ? <Icon size={18} strokeWidth={2} /> : <i className={fa} />}
      </span>
      <span>
        <span style={{ display: "block", fontFamily: T.fontHead, fontSize: 14, fontWeight: 700, color: "#fff" }}>
          {title}
        </span>
        <span style={{ display: "block", fontFamily: T.fontBody, fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
          {label}
        </span>
      </span>
    </a>
  );
};

const ContactV2 = () => (
  <XerxezShell>
    <SEO
      title="Contact XERXEZ | Book Free ERP Demo | Abu Dhabi & India"
      description="Contact XERXEZ for AI-powered ERP solutions in UAE & India. Book a free demo for EPC, Construction, Manufacturing ERP. Abu Dhabi office available."
      canonical="/contact"
      noIndex
    />

    {/* ── Hero — centred, navy, fixed to exactly one viewport (height +
        minHeight: 100svh, overflow: hidden) so eyebrow, H1, subtitle, both
        CTAs and the 3 trust-signal cards are visible without scrolling. ── */}
    <section style={{
      position: "relative", background: T.navy, overflow: "hidden",
      minHeight: "100svh", height: "100svh", display: "flex", alignItems: "center",
      paddingTop: V2_HEADER_H + 24, paddingBottom: 24,
    }}>
      <DotGrid />
      <div aria-hidden="true" style={{
        position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
        width: 720, height: 720, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(12,76,143,0.28) 0%, transparent 68%)",
        filter: "blur(20px)", pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Eyebrow color={T.redLight} mb={0}>XERXEZ · CONTACT US</Eyebrow>
          <h1 style={{
            fontFamily: T.fontHead, fontWeight: 800,
            fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", lineHeight: 1.1,
            letterSpacing: "-0.02em", color: "#fff", margin: 0, maxWidth: 800,
          }}>
            Let&apos;s build something that works
          </h1>
          <p style={{
            fontFamily: T.fontBody, fontSize: "1.05rem", lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)", margin: 0, maxWidth: 620,
          }}>
            Book a strategy session, share your requirements, or start a pilot — with a team
            that delivers enterprise-grade AI platforms on time and within budget.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 14 }}>
            <Btn href="#enquiry">Request a demo</Btn>
            <Btn href="mailto:info@xerxez.com" variant="outline" dark arrow={false}>Email us</Btn>
          </div>

          {/* 3 trust-signal cards — centered text, 3D lift on hover */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16, marginTop: 22, maxWidth: 900, width: "100%",
          }}>
            {TRUST_SIGNALS.map((s) => <TrustCard key={s.text} icon={s.icon} text={s.text} />)}
          </div>
        </div>
      </div>
    </section>

    {/* ── Two-panel band: contact methods (left) | walkthrough card (right) —
        dark navy section (#071a33) ── */}
    <section style={{ ...sectionPad, background: "#071a33", position: "relative", overflow: "hidden" }}>
      <DotGrid opacity={0.25} size={34} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row g-4 g-lg-5 align-items-stretch">
          {/* Left: "Get in touch" — heading + 4 contact-method cards */}
          <div className="col-lg-6">
            <Reveal>
              <Eyebrow color={T.redLight} mb={14}>Contact Us</Eyebrow>
              <h2 style={{
                fontFamily: T.fontHead, fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800,
                color: "#fff", margin: "0 0 14px", lineHeight: 1.2,
              }}>
                Enterprise support for complex programs
              </h2>
              <p style={{
                fontFamily: T.fontBody, fontSize: 15.5, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: "0 0 28px",
              }}>
                Work with our team to accelerate approvals, align stakeholders, and deploy
                secure, scalable AI platforms across your organisation.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                {METHODS.map((m) => <MethodCard key={m.title} icon={m.icon} fa={m.fa} title={m.title} label={m.label} href={m.href} />)}
              </div>
            </Reveal>
          </div>

          {/* Right: navy "book a walkthrough" card with a red glow */}
          <div className="col-lg-6">
            <Reveal delay={80}>
              <div style={{
                height: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(217,53,34,0.3)",
                borderRadius: 20, padding: "clamp(28px, 4vw, 44px)", display: "flex", flexDirection: "column",
                boxShadow: `0 0 60px ${T.redGlow}`,
              }}>
                <IconTile active><Monitor size={22} strokeWidth={2} /></IconTile>
                <h2 style={{
                  fontFamily: T.fontHead, fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800,
                  color: "#fff", margin: "20px 0 16px", lineHeight: 1.2,
                }}>
                  Live Product Walkthrough
                </h2>
                <p style={{
                  fontFamily: T.fontBody, fontSize: 16, lineHeight: 1.7,
                  color: "rgba(255,255,255,0.75)", margin: "0 0 28px",
                }}>
                  See how XERXEZ delivers AI-powered platforms at scale. Book a session with our
                  team — we&apos;ll map your use case, review platform capabilities, and outline a
                  practical path to pilot or production.
                </p>
                {/* margin-top:auto pins this row to the bottom of the card */}
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <Btn to="/contact#enquiry">Request a demo</Btn>
                  <span style={{ fontFamily: T.fontBody, fontSize: 13, color: "rgba(255,255,255,0.6)", maxWidth: 200 }}>
                    No commitment. Pick a time that works for you.
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* ── Enquiry form ── id="enquiry" is the scroll target for every "Request a demo" button */}
    <section id="enquiry" style={{ ...sectionPad, background: "#fff", scrollMarginTop: V2_HEADER_H + 20 }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Send Your Requirements"
            title="Tell us what you're building"
            subtitle="The more you share, the more precise our proposal. It takes about two minutes."
          />
        </Reveal>
        <Reveal delay={60}>
          <div style={{ marginTop: 48 }}>
            <XerxezContactForm />
          </div>
        </Reveal>
      </div>
    </section>

    {/* ── What you can expect — 3 red-ruled columns ── */}
    <section style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="After You Reach Out" title="What you can expect" />
        </Reveal>
        <div className="row g-4 g-lg-5" style={{ marginTop: 48 }}>
          {EXPECT.map((e, i) => (
            <div key={e.title} className="col-lg-4">
              <Reveal delay={i * 70}>
                <div style={{ borderLeft: `3px solid ${T.red}`, paddingLeft: 22 }}>
                  <h3 style={{ fontFamily: T.fontHead, fontSize: 19, fontWeight: 700, color: T.headNavy, margin: "0 0 10px" }}>
                    {e.title}
                  </h3>
                  <p style={{ fontFamily: T.fontBody, fontSize: 15, lineHeight: 1.7, color: T.muted, margin: 0 }}>
                    {e.body}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  </XerxezShell>
);

export default ContactV2;
