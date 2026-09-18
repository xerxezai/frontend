// NotFoundPage.tsx
// Purpose: The site-wide 404 — catches every unmatched route (App.tsx path="*").
//          A single-viewport navy hero (no scroll needed to read it) with the
//          v2 red/navy brand language: big "404", a route back home, a way to
//          talk to a human, and a quiet link to Services for anyone browsing.
// Used in: src/App.tsx (route: "*")

import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import { XerxezShell, T, DotGrid, LearnMore, V2_HEADER_H } from "../components/v2";

const NotFoundPage = () => {
  return (
    <XerxezShell>
      <SEO
        title="Page Not Found | XERXEZ"
        description="The page you're looking for doesn't exist or has been moved. Return to the XERXEZ homepage or browse our services."
        canonical="/404"
        noIndex
      />

      {/* Exactly one viewport tall below the fixed header — the 404 message
          never needs scrolling to be read in full; the footer follows after it. */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: T.navy,
          minHeight: `calc(100vh - ${V2_HEADER_H}px)`,
          paddingTop: V2_HEADER_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Red radial glow, top center */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(217,53,34,0.20) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        {/* Faint dot-grid texture */}
        <DotGrid opacity={0.5} size={34} />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "24px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: T.fontHead,
              fontWeight: 900,
              fontSize: "clamp(6rem, 16vh, 16rem)",
              lineHeight: 1,
              color: T.red,
              textShadow: "0 12px 48px rgba(217,53,34,0.35)",
            }}
          >
            404
          </h1>

          <div
            aria-hidden="true"
            style={{ width: 80, height: 2, background: T.red, margin: "20px 0 24px" }}
          />

          <h2
            style={{
              margin: 0,
              fontFamily: T.fontHead,
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "#ffffff",
            }}
          >
            Page Not Found
          </h2>

          <p
            style={{
              margin: "14px 0 0",
              maxWidth: 480,
              fontFamily: T.fontBody,
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: T.fontHead,
                fontSize: 15,
                fontWeight: 600,
                color: "#ffffff",
                background: T.red,
                padding: "15px 28px",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: `0 10px 26px ${T.redGlow}`,
                transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = T.redDark;
                e.currentTarget.style.boxShadow = `0 14px 34px ${T.redGlow}`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = T.red;
                e.currentTarget.style.boxShadow = `0 10px 26px ${T.redGlow}`;
              }}
            >
              ← Go to Homepage
            </Link>

            <Link
              to="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: T.fontHead,
                fontSize: 15,
                fontWeight: 600,
                color: "#ffffff",
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.45)",
                padding: "15px 28px",
                borderRadius: 12,
                textDecoration: "none",
                transition: "transform 160ms ease, border-color 160ms ease",
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "#ffffff";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
              }}
            >
              Contact Us
            </Link>
          </div>

          <div style={{ marginTop: 22 }}>
            <LearnMore to="/services" label="or browse our services" />
          </div>
        </div>
      </section>
    </XerxezShell>
  );
};

export default NotFoundPage;
