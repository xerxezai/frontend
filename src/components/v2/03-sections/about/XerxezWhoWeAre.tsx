// XerxezWhoWeAre.tsx
// Purpose: "Who we are" section — a heading block plus three red-ruled columns.
// Used in: page/v2/HomeV2.tsx
// Data source: the three column titles/bodies are the `aboutCompanyData` items
//              from src/data/index.ts (lightly re-cased). No new copy.

import { T, Eyebrow, LearnMore, Reveal, sectionPad } from "../../01-core/v2theme";

// Three positioning statements shown side by side.
const COLUMNS = [
  {
    title: "AI-driven enterprise transformation",
    body: "We build intelligent ERP systems and MLOps pipelines that evolve with your business, delivering measurable ROI from day one.",
  },
  {
    title: "Secure cloud architecture",
    body: "Our DevSecOps approach embeds security at every layer — from infrastructure to deployment — so you ship faster without compromising safety.",
  },
  {
    title: "End-to-end software delivery",
    body: "From consulting to custom development and AI training, we cover the full technology lifecycle for modern enterprises.",
  },
];

const XerxezWhoWeAre = () => (
  <section style={{ ...sectionPad, background: "#ffffff", borderTop: `4px solid ${T.red}` }}>
    <div className="container">
      <Reveal>
        <div>
          <Eyebrow color={T.red}>Who We Are</Eyebrow>
          <h2 style={{
            fontFamily: T.fontHead,
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            color: T.headNavy,
            margin: 0,
          }}>
            {/* <br> only shows at ≥lg so the mobile heading wraps naturally */}
            A technology partner built for<br className="d-none d-lg-inline" /> engineering-grade software
          </h2>
          <p style={{
            fontFamily: T.fontBody,
            fontSize: 17,
            lineHeight: 1.7,
            color: T.muted,
            margin: "18px 0 0",
            maxWidth: 640,
          }}>
            XERXEZ delivers AI-powered ERP, secure delivery pipelines, and cloud infrastructure for engineering, EPC, and industrial organisations across the UAE and India.
          </p>
        </div>
      </Reveal>

      <div className="row g-4 g-lg-5" style={{ marginTop: 40 }}>
        {COLUMNS.map((c, i) => (
          <div key={c.title} className="col-lg-4">
            {/* stagger each column's reveal by 70ms */}
            <Reveal delay={i * 70}>
              {/* red rule down the left edge */}
              <div style={{ borderLeft: `3px solid ${T.red}`, paddingLeft: 22 }}>
                <h3 style={{
                  fontFamily: T.fontHead,
                  fontSize: 19,
                  fontWeight: 700,
                  color: T.headNavy,
                  margin: "0 0 10px",
                  lineHeight: 1.35,
                }}>
                  {c.title}
                </h3>
                <p style={{
                  fontFamily: T.fontBody,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: T.muted,
                  margin: 0,
                }}>
                  {c.body}
                </p>
              </div>
            </Reveal>
          </div>
        ))}
      </div>

      <Reveal delay={80}>
        <div style={{ marginTop: 40 }}>
          <LearnMore to="/about" label="Learn more about us" />
        </div>
      </Reveal>
    </div>
  </section>
);

export default XerxezWhoWeAre;
