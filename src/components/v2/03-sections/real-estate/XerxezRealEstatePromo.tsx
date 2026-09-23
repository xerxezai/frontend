// XerxezRealEstatePromo.tsx
// Purpose: "Coming Soon" teaser for XERXEZ's own real estate investment
//          platform (still in development — no external link, no referral
//          program), sitting on the homepage right after "Why XERXEZ". Dark
//          navy band, 3 feature cards, single CTA to /contact.
// Used in: page/v2/HomeV2.tsx (after XerxezWhyChoose)
// Note: this replaces an earlier Stake-referral version of this section —
//       that program is no longer being promoted here; this is now a plain
//       "register your interest" teaser for a XERXEZ-built platform.

import { Building2, LineChart, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { T, Eyebrow, Btn, Reveal, DotGrid, sectionPad } from "../../01-core/v2theme";
import { V2FeatureCard } from "../../01-core/v2page";

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Building2,  title: "Digital Property Investment", desc: "Invest in premium real estate from anywhere in UAE & India." },
  { icon: LineChart,  title: "AI-Powered Analytics",         desc: "Smart insights to help you make better investment decisions." },
  { icon: ShieldCheck, title: "Secure & Regulated",           desc: "Fully compliant with UAE and India financial regulations." },
];

const XerxezRealEstatePromo = () => (
  <section style={{ ...sectionPad, background: T.navy, position: "relative", overflow: "hidden" }}>
    <DotGrid opacity={0.35} />
    <div className="container" style={{ position: "relative" }}>
      <Reveal>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 52px" }}>
          <Eyebrow color={T.redLight}>Coming Soon</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(30px, 4vw, 52px)",
            lineHeight: 1.1, letterSpacing: "-0.015em", color: "#ffffff", margin: "0 0 18px",
          }}>
            Real Estate Investment Platform
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7, color: T.mutedDark,
            margin: 0, maxWidth: 620, marginLeft: "auto", marginRight: "auto",
          }}>
            XERXEZ is expanding into real estate investment — enabling UAE &amp; India professionals
            to invest in premium properties digitally, transparently and efficiently.
          </p>
        </div>
      </Reveal>

      {/* 3 feature cards */}
      <div className="row g-4">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="col-lg-4 col-md-6">
            <Reveal delay={i * 70} fill>
              <V2FeatureCard
                icon={<f.icon size={22} strokeWidth={2} />}
                title={f.title}
                desc={f.desc}
                dark
              />
            </Reveal>
          </div>
        ))}
      </div>

      {/* badge + CTA */}
      <Reveal>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)", color: "#fff",
            fontFamily: T.fontHead, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase", padding: "7px 18px", borderRadius: 999, marginBottom: 24,
          }}>
            Coming Soon
          </span>
          <div>
            <Btn to="/contact">Register Interest</Btn>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default XerxezRealEstatePromo;
