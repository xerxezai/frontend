// XerxezStakePromo.tsx
// Purpose: "Exclusive XERXEZ Offer" — a referral promo for Stake (UAE real
//          estate investment platform), sitting on the homepage right after
//          "Why XERXEZ". Dark navy band, 2-column benefits/steps, single CTA.
// Used in: page/v2/HomeV2.tsx (after XerxezWhyChoose)
// Data source: referral link, copy and reward amounts (AED 150 / AED 300) are
//              the XERXEZ affiliate terms with Stake, supplied directly — not
//              invented. The 6 benefit points and 3-step flow reflect the same.

import { Building2, TrendingUp, ShieldCheck, Briefcase, Globe2, Wallet, UserPlus, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { T, Eyebrow, Btn, Reveal, DotGrid, IconTile, sectionPad } from "../../01-core/v2theme";

export const STAKE_REFERRAL_URL = "https://app.getstake.com/rewards?c=MOHAMMED30798&n=Mohammed";

const BENEFITS: { icon: LucideIcon; text: string }[] = [
  { icon: Building2,   text: "Invest in premium UAE real estate from just AED 500" },
  { icon: TrendingUp,  text: "Earn quarterly rental income + capital appreciation" },
  { icon: ShieldCheck, text: "Regulated by Dubai Financial Services Authority (DFSA)" },
  { icon: Briefcase,   text: "Fully managed properties — no landlord responsibilities" },
  { icon: Globe2,      text: "Open to UAE residents and international investors worldwide" },
  { icon: Wallet,      text: "Average annual returns of 8–15% on investments" },
];

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: UserPlus, title: "Create Your Account",  desc: "Sign up using our exclusive XERXEZ referral link in minutes — fully digital, no paperwork." },
  { icon: Gift,      title: "Get AED 150 Reward",   desc: "Complete your account onboarding and verification — receive AED 150 reward credited to your wallet automatically." },
  { icon: TrendingUp, title: "Invest & Earn More",  desc: "Invest AED 2,000 or more in any UAE property — earn another AED 150 bonus plus ongoing rental income. Total rewards: AED 300!" },
];

const StepCard = ({ step, index }: { step: typeof STEPS[number]; index: number }) => {
  const Icon = step.icon;
  return (
    <div style={{
      position: "relative", display: "flex", gap: 18, alignItems: "flex-start",
      background: T.navy2, border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: T.rcard, padding: "22px 22px 22px 20px",
    }}>
      <span aria-hidden="true" style={{
        position: "absolute", top: 10, right: 16,
        fontFamily: T.fontHead, fontSize: 40, fontWeight: 800,
        color: "rgba(255,255,255,0.07)", lineHeight: 1,
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <IconTile active size={44}><Icon size={19} strokeWidth={2} /></IconTile>
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <h4 style={{ fontFamily: T.fontHead, fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
          {step.title}
        </h4>
        <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.68)", margin: 0 }}>
          {step.desc}
        </p>
      </div>
    </div>
  );
};

const XerxezStakePromo = () => (
  <section style={{ ...sectionPad, background: T.navy, position: "relative", overflow: "hidden" }}>
    <DotGrid opacity={0.35} />
    <div className="container" style={{ position: "relative" }}>
      {/* header */}
      <Reveal>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 52px" }}>
          <Eyebrow color={T.redLight}>Exclusive XERXEZ Offer</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead, fontWeight: 800, fontSize: "clamp(30px, 4vw, 52px)",
            lineHeight: 1.1, letterSpacing: "-0.015em", color: "#ffffff", margin: "0 0 18px",
          }}>
            Grow Your Wealth with Real Estate
          </h2>
          <p style={{
            fontFamily: T.fontBody, fontSize: 17, lineHeight: 1.7, color: T.mutedDark,
            margin: "0 auto 22px", maxWidth: 620,
          }}>
            XERXEZ members get exclusive access to UAE's leading real estate investment
            platform. Start investing from just AED 500 and earn passive income.
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", background: T.red, color: "#fff",
            fontFamily: T.fontHead, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase", padding: "7px 18px", borderRadius: 999,
            boxShadow: `0 8px 20px ${T.redGlow}`,
          }}>
            XERXEZ Exclusive
          </span>
        </div>
      </Reveal>

      {/* 2-column: benefits (left) / steps (right) */}
      <div className="row g-4 g-lg-5">
        <div className="col-lg-6">
          <Reveal fill>
            <div style={{
              height: "100%", background: T.navy2, border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: T.rcard, padding: "32px 28px",
            }}>
              <h3 style={{ fontFamily: T.fontHead, fontSize: 19, fontWeight: 700, color: "#fff", margin: "0 0 24px" }}>
                Why invest with us?
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 20 }}>
                {BENEFITS.map((b) => (
                  <li key={b.text} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <IconTile size={40}><b.icon size={17} strokeWidth={2} /></IconTile>
                    <span style={{
                      fontFamily: T.fontBody, fontSize: 14.5, lineHeight: 1.6,
                      color: "rgba(255,255,255,0.82)", paddingTop: 8,
                    }}>
                      {b.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="col-lg-6">
          <div style={{ display: "grid", gap: 16 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <StepCard step={s} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Reveal>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <Btn href={STAKE_REFERRAL_URL}>Start Investing in Real Estate</Btn>
          <p style={{
            fontFamily: T.fontBody, fontSize: 12.5, color: "rgba(255,255,255,0.45)",
            margin: "16px 0 0",
          }}>
            Exclusive to XERXEZ members · T&amp;Cs apply · You'll be redirected to complete your registration
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

export default XerxezStakePromo;
