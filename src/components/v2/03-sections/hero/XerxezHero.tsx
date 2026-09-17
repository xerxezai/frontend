// XerxezHero.tsx
// Purpose: Hero band for the /v2 homepage — eyebrow, H1, subtitle, two CTAs,
//          a reassurance line, and a 4-stat strip, over a full-screen looping
//          background video + navy overlay.
// Used in: page/v2/HomeV2.tsx
// Data source: headline / paragraph / stat numbers are copied from the existing
//              homepage hero (src/components/hero/HeroSection.tsx). No new claims.
//              Video is the client-supplied src/assets/video/hero2.mp4.

import { useState } from "react";
import { T, Btn, Eyebrow, V2_HEADER_H, prefersReducedMotion } from "../../01-core/v2theme";   // tokens + button + kicker + header height + motion check
import heroVideo from "../../../../assets/video/hero2.mp4";   // client-supplied background video

// The 4 metrics shown under the CTAs (conservative numbers, same as the live site).
const METRICS = [
  { v: "4+",    l: "Client projects delivered" },
  { v: "6+",    l: "Industries served" },
  { v: "12+",   l: "ERP modules" },
  { v: "99.9%", l: "Frontend Uptime" },
];

// Shown as the <video>'s poster (visible while it loads) and as the background
// itself when the video can't play — a failed load/decode, or the visitor has
// asked for reduced motion (autoplaying full-bleed video is exactly the kind
// of motion that setting exists to suppress).
const HERO_PHOTO = "/assets/img/hero/hero-2-photo.jpg";

const XerxezHero = () => {
  // True once the <video> fails to load/decode — falls back to the navy
  // gradient (not the video) per the brief. Also skip the video outright
  // under prefers-reduced-motion, without needing a render to detect it.
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = !videoFailed && !prefersReducedMotion();

  return (
    <section
      style={{
        position: "relative",            // anchor for the absolute video / overlay / glow layers
        // svh = mobile-safe vh. minHeight is a floor, not a fixed height — the content
        // stack below was shrunk (font sizes + gaps) specifically so its natural height
        // stays under 100svh on a ~1080p screen, so this floor is what actually renders
        // and the whole hero — including the stat strip — fits without scrolling.
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",            // vertically centre the content
        background: showVideo ? T.navy : T.navyGrad,   // gradient fallback when there's no video layer
        overflow: "hidden",              // clip the glow circle
        paddingTop: V2_HEADER_H + 24,    // clear the fixed header
        paddingBottom: 24,
      }}
    >
      {/* Layer 1 — full-screen background video (skipped on error / reduced-motion,
          leaving the navy gradient set on the section above as the background) */}
      {showVideo && (
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_PHOTO}
          onError={() => setVideoFailed(true)}   // → falls back to the navy gradient, not the photo
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      )}
      {/* Layer 2 — navy overlay so the white hero text stays readable over the video */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: T.scrim(0.45) }} />
      {/* Layer 3 — soft blue accent glow, top-right */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: 720, height: 720, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(12,76,143,0.28) 0%, transparent 68%)",
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* constrain the text block — same 680px width as the careers hero's text column */}
        <div style={{ maxWidth: 680 }}>
          {/* eyebrow — lighter red for contrast on navy; tightened from 22px (so the full
              stack down to the stat strip fits one screen), eased back up slightly to 16px */}
          <Eyebrow color={T.redLight} mb={16}>XERXEZ · AI-Powered ERP</Eyebrow>

          <h1 style={{
            fontFamily: T.fontHead,
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",   // fluid 32px → 56px — smaller than before, so the stack fits one screen
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: 0,
          }}>
            AI-powered ERP for engineering
            &amp; industrial enterprises
          </h1>

          <p style={{
            fontFamily: T.fontBody,
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.78)",
            margin: "16px 0 0",
            maxWidth: 620,
          }}>
            XERXEZ helps engineering, EPC, and industrial companies in the UAE &amp; India
            eliminate manual approvals, Excel dependency, and document chaos — with an
            AI-native platform built for how these teams actually work.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 18 }}>
            {/* primary CTA → /v2 contact page; outline CTA → /v2 services page */}
            <Btn to="/contact">See ERP in action</Btn>
            <Btn to="/services" variant="outline" dark arrow={false}>Explore our solutions</Btn>
          </div>

          <p style={{
            fontFamily: T.fontBody,
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            margin: "16px 0 0",
          }}>
            Enterprise deployment · UAE &amp; India based · 24/7 support
          </p>

          {/* Metric strip — now part of the same one-screen hero, not a section below it.
              A bit more breathing room than the first compact pass, and a wider min column
              (150px) so "Client Projects Delivered" stops wrapping to a 2nd line. */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px 20px",
            marginTop: 20,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.14)",
          }}>
            {METRICS.map((m) => (
              <div key={m.l}>
                <div style={{
                  fontFamily: T.fontHead,
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}>
                  {m.v}
                </div>
                <div style={{
                  fontFamily: T.fontBody,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 5,
                }}>
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default XerxezHero;
