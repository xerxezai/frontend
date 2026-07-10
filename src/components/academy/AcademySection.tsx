import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const OG = "#C9883A";
const C2 = "#cc785c";

const FEATURES = [
  "AI & ML courses",
  "DevSecOps training",
  "Certificates included",
  "Learn at your own pace",
];

const STATS = [
  { val: "100+", label: "Courses", wide: true },
  { val: "500+", label: "Students" },
  { val: "15+",  label: "Instructors" },
  { val: "4.8",  label: "Rating", star: true },
];

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <circle cx="7.5" cy="7.5" r="7.5" fill={OG} fillOpacity="0.16" />
    <path d="M4.3 7.7l2.1 2.1 4.3-4.5" stroke={OG} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill={OG} aria-hidden="true">
    <path d="M6.5 0.8l1.7 3.6 3.9.5-2.8 2.8.7 3.9-3.5-1.9-3.5 1.9.7-3.9L1 4.9l3.9-.5z" />
  </svg>
);

const StatIcon = ({ kind }: { kind: "courses" | "students" | "instructors" }) => {
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none" as const, "aria-hidden": true as const };
  if (kind === "courses") return (
    <svg {...common}><rect x="2" y="3" width="12" height="10" rx="1.5" stroke={C2} strokeWidth="1.3" /><path d="M2 6h12" stroke={C2} strokeWidth="1.3" /></svg>
  );
  if (kind === "students") return (
    <svg {...common}><circle cx="8" cy="5.2" r="2.4" stroke={C2} strokeWidth="1.3" /><path d="M2.8 13.5c0-2.7 2.3-4.3 5.2-4.3s5.2 1.6 5.2 4.3" stroke={C2} strokeWidth="1.3" strokeLinecap="round" /></svg>
  );
  return (
    <svg {...common}><path d="M8 2l6 2.8-6 2.8-6-2.8L8 2z" stroke={C2} strokeWidth="1.3" strokeLinejoin="round" /><path d="M4.3 6.6v3.3c0 1 1.7 1.9 3.7 1.9s3.7-.9 3.7-1.9V6.6" stroke={C2} strokeWidth="1.3" /></svg>
  );
};

const AcademySection = () => {
  const [prefersReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion:reduce)").matches : false
  );
  const [visible, setVisible] = useState(prefersReduced);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReduced || visible) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [prefersReduced, visible]);

  return (
    <section ref={sectionRef} style={{
      background: "linear-gradient(200deg,#1a1208 0%,#0f0a05 100%)",
      padding: "88px 0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow, bottom-left — mirrors hero's warmth without repeating its layout */}
      <div aria-hidden="true" style={{
        position: "absolute", left: "-8%", bottom: "-15%",
        width: 620, height: 620, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(201,136,58,0.14) 0%,transparent 68%)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)",
        backgroundSize: "30px 30px",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row g-5 align-items-center">

          {/* ── LEFT: content ── */}
          <div className="col-lg-6">
            <div className="aca-reveal" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(201,136,58,0.10)",
              border: "1.5px solid rgba(201,136,58,0.28)",
              borderRadius: 9999, padding: "7px 16px", marginBottom: 26,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: prefersReduced ? "none" : "opacity 0.5s ease, transform 0.5s ease",
            }}>
              <span style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: OG, animation: !prefersReduced && visible ? "acaBadgePing 1.8s ease-in-out infinite" : "none" }} />
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C2 }} />
              </span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)" }}>
                AI-Powered Learning
              </span>
            </div>

            <h2 className="aca-reveal" style={{
              fontFamily: "'Cormorant Garamond',Garamond,serif",
              fontWeight: 600, fontSize: "clamp(32px,4vw,48px)",
              lineHeight: 1.12, letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.94)", marginBottom: 18, maxWidth: 480,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: prefersReduced ? "none" : "opacity 0.5s ease 0.08s, transform 0.5s ease 0.08s",
            }}>
              Upskill your team with{" "}
              <em style={{ color: OG, fontStyle: "italic" }}>AI training</em>
            </h2>

            <p className="aca-reveal" style={{
              fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.68,
              color: "rgba(255,255,255,0.58)", maxWidth: 460, marginBottom: 30,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: prefersReduced ? "none" : "opacity 0.5s ease 0.14s, transform 0.5s ease 0.14s",
            }}>
              Access 100+ courses on AI, MLOps, DevSecOps, and enterprise software.
              Learn at your own pace with certificates.
            </p>

            <div className="aca-reveal" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px",
              marginBottom: 34, maxWidth: 460,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: prefersReduced ? "none" : "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
            }}>
              {FEATURES.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <CheckIcon />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.82)" }}>{f}</span>
                </div>
              ))}
            </div>

            <div className="aca-reveal" style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: prefersReduced ? "none" : "opacity 0.5s ease 0.26s, transform 0.5s ease 0.26s",
            }}>
              <Link
                to="/lma/student/dashboard"
                className="aca-btn-shimmer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: C2, color: "#ffffff",
                  fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, lineHeight: 1,
                  padding: "13px 24px", borderRadius: 8,
                  textDecoration: "none", position: "relative", overflow: "hidden",
                  transition: "background 150ms ease, transform 0.15s ease",
                  boxShadow: "0 4px 0 rgba(140,60,30,0.45),0 6px 22px rgba(204,120,92,0.32)",
                  cursor: "pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#a9583e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = C2; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  Explore Academy
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: stat panel ── */}
          <div className="col-lg-6">
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateAreas: `"a a" "b c"`,
              gap: 16,
            }}>
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="aca-reveal aca-stat-card"
                  style={{
                    gridArea: s.wide ? "a" : undefined,
                    position: "relative",
                    background: "linear-gradient(145deg,#231c0e 0%,#1e1509 100%)",
                    border: "1px solid rgba(180,140,100,0.22)",
                    borderRadius: 18,
                    padding: s.wide ? "28px 26px" : "22px 20px",
                    boxShadow: "0 20px 50px rgba(80,45,15,0.30),0 0 0 1px rgba(255,255,255,0.04) inset",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: prefersReduced ? "none" : `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s ease ${0.1 + i * 0.08}s, box-shadow 0.25s ease, border-color 0.25s ease`,
                  }}
                >
                  <div aria-hidden="true" style={{
                    position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none",
                    background: "radial-gradient(ellipse 80% 50% at 20% 0%,rgba(201,136,58,0.10) 0%,transparent 70%)",
                  }} />

                  {/* Certificate-seal motif on the rating card — the section's one signature flourish */}
                  {s.star && (
                    <div aria-hidden="true" style={{
                      position: "absolute", top: 14, right: 14,
                      width: 34, height: 34, borderRadius: "50%",
                      border: "1px dashed rgba(201,136,58,0.45)",
                    }} />
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, position: "relative" }}>
                    {s.star ? <StarIcon /> : <StatIcon kind={s.label === "Courses" ? "courses" : s.label === "Students" ? "students" : "instructors"} />}
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(180,140,100,0.62)" }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond',Garamond,serif", fontWeight: 700,
                    fontSize: s.wide ? "clamp(38px,4vw,50px)" : "clamp(26px,2.8vw,32px)",
                    color: "rgba(255,255,255,0.94)", letterSpacing: "-0.02em", lineHeight: 1,
                    display: "flex", alignItems: "baseline", gap: 6, position: "relative",
                  }}>
                    {s.val}
                    {s.star && <StarIcon />}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .aca-stat-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(201,136,58,0.42) !important;
          box-shadow: 0 26px 60px rgba(80,45,15,0.38),0 0 0 1px rgba(255,255,255,0.06) inset !important;
        }
        .aca-btn-shimmer::before {
          content:'';
          position:absolute;top:0;left:0;right:0;bottom:0;
          background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.26) 50%,transparent 62%);
          transform:translateX(-100%) skewX(-15deg);
          animation: acaShimmer 3.5s ease-in-out 1.5s infinite;
        }
        @keyframes acaShimmer {
          0%{transform:translateX(-100%) skewX(-15deg)}
          30%,100%{transform:translateX(220%) skewX(-15deg)}
        }
        @keyframes acaBadgePing {
          0%{transform:scale(1);opacity:0.8} 70%{transform:scale(2.4);opacity:0} 100%{transform:scale(1);opacity:0}
        }
        @media (prefers-reduced-motion:reduce) {
          .aca-btn-shimmer::before { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default AcademySection;
