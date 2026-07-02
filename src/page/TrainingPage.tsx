import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";
import XzHeroSection from "../components/common/XzHeroSection";

const C  = "#C9883A";
const C2 = "#cc785c";
const CG = "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)";

const courses = [
  {
    icon: "fas fa-brain",
    title: "Full Stack AI Development",
    category: "AI & ML",
    level: "Intermediate",
    levelColor: "#C9883A",
    duration: "60 Hours",
    lessons: "48 Lessons",
    badge: "BESTSELLER",
    desc: "Build production-ready AI systems from scratch — LLMs, RAG pipelines, API development, and enterprise deployment patterns.",
    tags: ["Python", "LangChain", "OpenAI", "FastAPI"],
  },
  {
    icon: "fas fa-shield-alt",
    title: "MLOps – Machine Learning Operations",
    category: "DevSecOps & AI",
    level: "Advanced",
    levelColor: "#e63757",
    duration: "50 Hours",
    lessons: "40 Lessons",
    badge: "NEW",
    desc: "Automate the full ML lifecycle — from training pipelines to production monitoring with Kubernetes, MLflow, and cloud platforms.",
    tags: ["Kubernetes", "MLflow", "Docker", "AWS"],
  },
];

const features = [
  { icon: "fas fa-user-tie",    title: "Industry Expert Instructors", desc: "Real-world practitioners with 10+ years of enterprise deployment experience." },
  { icon: "fas fa-laptop-code", title: "Hands-on Projects",           desc: "Build real enterprise systems during the course — not toy examples." },
  { icon: "fas fa-certificate", title: "Certificate of Completion",   desc: "Industry-recognized certificates issued on successful course completion." },
  { icon: "fas fa-users",       title: "Enterprise Batch Training",   desc: "Custom training programs for your entire team, delivered at your pace." },
];

const badgeStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  border: "1px solid rgba(30,30,30,0.22)", borderRadius: 999,
  padding: "6px 18px", fontSize: 11, fontWeight: 700,
  letterSpacing: "0.16em", textTransform: "uppercase",
  color: "#1A1A1A", fontFamily: "'DM Sans',sans-serif",
  background: "rgba(201,136,58,0.08)",
};

const sectionHeadStyle: React.CSSProperties = {
  fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
  fontSize: "clamp(28px,4vw,44px)", color: "#1A1A1A",
  letterSpacing: "-0.02em", margin: 0,
};

// ── Hero cascade content ──────────────────────────────────────────────────
const TRAINING_CASCADE_A = [
  "LLM Engineering Mastery",
  "MLOps & Model Deployment",
  "Cloud Architecture Pro",
  "DevSecOps Fundamentals",
  "AI Automation Workflows",
  "Enterprise AI Strategy",
  "Prompt Engineering",
  "Production ML Systems",
  "Data Engineering at Scale",
];

const TRAINING_CASCADE_B = [
  "300+ Certified Engineers",
  "95% Satisfaction Rate",
  "500+ Professionals Trained",
  "12+ Active Programs",
  "60-hour Intensives",
  "Hands-On Projects Only",
  "Cohort-Based Learning",
  "Certificate Recognised",
  "July 2026 Cohort Open",
];

// ── Cohort card (hero right column) ───────────────────────────────────────
const CohortCard = () => {
  const [barW, setBarW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarW(68), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(155deg,#fdf9f4 0%,#f0e4d0 100%)",
      border: "1px solid rgba(201,136,58,0.18)",
      borderTop: "3px solid #C9883A",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95),0 8px 0 rgba(130,82,24,0.32),0 20px 60px rgba(0,0,0,0.18)",
      padding: "26px 24px 22px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: -50, right: -50,
        width: 160, height: 160, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(201,136,58,0.13) 0%,transparent 68%)",
        pointerEvents: "none",
      }} />

      {/* header row: icon + live badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, position: "relative" }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14,
          background: "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)",
          boxShadow: "0 4px 0 rgba(140,88,22,0.50),0 8px 18px rgba(201,136,58,0.38)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <i className="fas fa-graduation-cap" style={{ color: "#fff", fontSize: 21 }} />
        </div>

        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(201,136,58,0.09)",
          border: "1px solid rgba(201,136,58,0.26)",
          borderRadius: 20, padding: "4px 11px",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
          textTransform: "uppercase", color: "#C9883A",
          fontFamily: "'DM Sans',sans-serif",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px rgba(74,222,128,0.75)",
            display: "inline-block", flexShrink: 0,
          }} />
          Enrolling Now
        </span>
      </div>

      {/* eyebrow + title */}
      <p style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
        textTransform: "uppercase", color: "#cc785c",
        fontFamily: "'DM Sans',sans-serif", marginBottom: 4, position: "relative",
      }}>
        Next Cohort · July 2026
      </p>
      <h4 style={{
        fontSize: 20, fontWeight: 800, color: "#1A1208",
        lineHeight: 1.18, fontFamily: "'DM Sans',sans-serif",
        marginBottom: 8, letterSpacing: "-0.02em", position: "relative",
      }}>
        AI Practitioner<br />Program
      </h4>
      <p style={{
        fontSize: 12.5, color: "#5C5047", lineHeight: 1.65,
        fontFamily: "'DM Sans',sans-serif", marginBottom: 18, position: "relative",
      }}>
        Hands-on, certification-backed training for enterprise AI practitioners — live labs, real projects, no filler.
      </p>

      {/* 3 details grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 16, position: "relative" }}>
        {[
          { icon: "fas fa-chalkboard-teacher", label: "Format",   val: "Live + Labs" },
          { icon: "far fa-clock",              label: "Duration", val: "8 Weeks"     },
          { icon: "fas fa-users",              label: "Cohort",   val: "≤25 Seats"   },
        ].map(d => (
          <div key={d.label} style={{
            background: "rgba(255,255,255,0.80)",
            border: "1px solid rgba(201,136,58,0.14)",
            borderRadius: 11, padding: "10px 7px", textAlign: "center",
          }}>
            <i className={d.icon} style={{ color: "#C9883A", fontSize: 11, marginBottom: 5, display: "block" }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1208", fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>{d.val}</div>
            <div style={{ fontSize: 9, color: "#8B7A6A", fontFamily: "'DM Sans',sans-serif", marginTop: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.label}</div>
          </div>
        ))}
      </div>

      {/* seats meter */}
      <div style={{
        background: "rgba(255,255,255,0.65)",
        border: "1px solid rgba(201,136,58,0.14)",
        borderRadius: 12, padding: "12px 14px", marginBottom: 16, position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#5C5047", fontFamily: "'DM Sans',sans-serif" }}>
            Seats Filled
          </span>
          <span style={{ fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>
            <span style={{ fontWeight: 700, color: "#1A1208" }}>17</span>
            <span style={{ color: "#A09080" }}> / 25 — </span>
            <span style={{ fontWeight: 700, color: "#d64f38" }}>8 left</span>
          </span>
        </div>
        <div style={{ height: 5, background: "rgba(0,0,0,0.09)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${barW}%`,
            background: "linear-gradient(90deg,#e8a84e 0%,#C9883A 100%)",
            borderRadius: 3,
            boxShadow: "0 0 8px rgba(201,136,58,0.55)",
            transition: "width 1.3s cubic-bezier(0.22,1,0.36,1)",
          }} />
        </div>
      </div>

      {/* CTA button */}
      <Link to="/contact" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: "linear-gradient(135deg,#e8a84e 0%,#C9883A 100%)",
        color: "#fff", fontWeight: 700, fontSize: 14,
        padding: "13px 20px", borderRadius: 12, textDecoration: "none",
        fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.02em",
        boxShadow: "0 4px 0 rgba(130,78,18,0.50),0 8px 24px rgba(201,136,58,0.40)",
        cursor: "pointer", marginBottom: 14, position: "relative",
        transition: "box-shadow 0.2s ease,transform 0.2s ease",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 0 rgba(130,78,18,0.50),0 12px 32px rgba(201,136,58,0.50)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ""; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 0 rgba(130,78,18,0.50),0 8px 24px rgba(201,136,58,0.40)"; }}
      >
        Reserve Your Seat <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
      </Link>

      {/* trust strip */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <i className="fas fa-certificate" style={{ color: "#C9883A", fontSize: 10 }} />
          <span style={{ fontSize: 11, color: "#8B7A6A", fontFamily: "'DM Sans',sans-serif" }}>CPD Accredited</span>
        </div>
        <span style={{ color: "rgba(0,0,0,0.15)", fontSize: 14, lineHeight: 1 }}>·</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <i className="far fa-clock" style={{ color: "#C9883A", fontSize: 10 }} />
          <span style={{ fontSize: 11, color: "#8B7A6A", fontFamily: "'DM Sans',sans-serif" }}>Closes 30 Jun</span>
        </div>
      </div>
    </div>
  );
};

const TrainingPage: React.FC = () => (
  <CustomLayout>

    {/* ── 1. HERO (shared dark component) ──────────────────────────────── */}
    <XzHeroSection
      badgeText="AI Training & Upskilling"
      headline={
        <h1 style={{
          fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
          fontSize: "clamp(34px,5vw,64px)", lineHeight: 1.08,
          color: "#fff", margin: 0, letterSpacing: "-0.03em",
        }}>
          Master Enterprise AI<br />
          <em style={{ color: C2, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
            &amp; Cloud Technologies
          </em>
        </h1>
      }
      description="Industry-led training for IT teams and enterprises. Learn AI, DevSecOps, Cloud, and ERP — from practitioners who've shipped it in production."
      ctas={[
        { label: "Browse Courses", href: "#courses", primary: true },
        { label: "Enterprise Training", to: "/contact", primary: false },
      ]}
      stats={[
        { val: "500+", label: "Trained"      },
        { val: "12+",  label: "Programs"     },
        { val: "95%",  label: "Satisfaction" },
      ]}
      cascadeA={TRAINING_CASCADE_A}
      cascadeB={TRAINING_CASCADE_B}
      right={<CohortCard />}
    />

    {/* ── 2. FEATURED COURSES ───────────────────────────────────────────── */}
    <section id="courses" style={{ background: "#F2EFE9", padding: "80px 0" }}>
      <div className="container">
        <div style={{ marginBottom: 48 }} data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
          <div style={{ marginBottom: 14 }}>
            <span style={badgeStyle}>✦ WHAT WE OFFER</span>
          </div>
          <h2 style={sectionHeadStyle}>Featured Courses</h2>
        </div>

        <div className="row g-4 justify-content-center">
          {courses.map((course, i) => (
            <div
              key={i}
              className="col-lg-6 col-md-10"
              data-aos="fade-up"
              data-aos-delay={String(i * 100)}
              data-aos-duration="800"
              data-aos-once="true"
            >
              <div
                style={{
                  background: "#ffffff", borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  overflow: "hidden", display: "flex", flexDirection: "column",
                  height: "100%", position: "relative",
                  transition: "transform 0.28s ease,box-shadow 0.28s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 16px 48px rgba(201,136,58,0.18),0 4px 16px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "";
                  el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
                }}
              >
                <span style={{
                  position: "absolute", top: 16, right: 16,
                  background: CG, color: "#fff",
                  fontSize: 10, fontWeight: 700, padding: "4px 10px",
                  borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase",
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  {course.badge}
                </span>

                <div style={{ background: "linear-gradient(135deg,rgba(201,136,58,0.10) 0%,rgba(201,136,58,0.04) 100%)", padding: "32px 24px 24px", fontSize: 36, color: C }}>
                  <i className={course.icon} />
                </div>

                <div style={{ padding: "20px 24px 16px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C, background: "rgba(201,136,58,0.08)", padding: "3px 10px", borderRadius: 6, fontFamily: "'DM Sans',sans-serif" }}>
                      {course.category}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: course.levelColor, fontFamily: "'DM Sans',sans-serif" }}>
                      {course.level}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.65, marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>
                    {course.desc}
                  </p>
                  <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                    <i className="fas fa-chalkboard-teacher" style={{ marginRight: 6 }} />
                    XERXEZ Expert Team
                  </p>
                </div>

                <div style={{ padding: "14px 24px 20px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#888888", fontFamily: "'DM Sans',sans-serif" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <i className="far fa-clock" /> {course.duration}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <i className="fas fa-play-circle" /> {course.lessons}
                    </span>
                  </div>
                  <Link to="/contact" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: CG, color: "#fff", fontSize: 13, fontWeight: 600,
                    padding: "8px 18px", borderRadius: 8, textDecoration: "none",
                    fontFamily: "'DM Sans',sans-serif",
                    boxShadow: "0 3px 10px rgba(201,136,58,0.28)",
                  }}>
                    Enroll Now <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── 3. WHY XERXEZ TRAINING ───────────────────────────────────────── */}
    <section style={{ background: "#ffffff", padding: "80px 0" }}>
      <div className="container">
        <div style={{ marginBottom: 48 }} data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
          <div style={{ marginBottom: 14 }}>
            <span style={badgeStyle}>✦ OUR ADVANTAGE</span>
          </div>
          <h2 style={sectionHeadStyle}>Why XERXEZ Training</h2>
        </div>

        <div className="row g-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="col-xl-3 col-lg-6 col-md-6"
              data-aos="fade-up"
              data-aos-delay={String(i * 100)}
              data-aos-duration="800"
              data-aos-once="true"
            >
              <div
                style={{
                  background: "#ffffff", border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 16, padding: "28px 24px", height: "100%",
                  transition: "border-color 0.25s ease,transform 0.25s ease,box-shadow 0.25s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = C2;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "0 12px 40px rgba(204,120,92,0.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(0,0,0,0.06)";
                  el.style.transform = "";
                  el.style.boxShadow = "";
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: "rgba(201,136,58,0.08)", border: "1px solid rgba(201,136,58,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, color: C, marginBottom: 18,
                }}>
                  <i className={f.icon} />
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
                  {f.title}
                </h4>
                <p style={{ fontSize: 13, color: "#555555", lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── 4. ENTERPRISE CTA ────────────────────────────────────────────── */}
    <section style={{ background: "#1a1208", padding: "90px 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: 900, height: 700, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(201,136,58,0.13) 0%,transparent 65%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }} data-aos="fade-up" data-aos-duration="900" data-aos-once="true">
          <div style={{ marginBottom: 24 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(201,136,58,0.14)", border: "1px solid rgba(201,136,58,0.30)",
              borderRadius: 999, padding: "6px 18px",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#E5B460", fontFamily: "'DM Sans',sans-serif",
            }}>
              <i className="fas fa-building" style={{ fontSize: 10 }} />
              For Organisations
            </span>
          </div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", color: "#ffffff", letterSpacing: "-0.03em", marginBottom: 16 }}>
            Train Your Entire Team
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif", marginBottom: 36 }}>
            Get custom enterprise training programs for your organisation. We come to you — on-site, virtual, or hybrid delivery.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: CG, color: "#fff", fontWeight: 700, fontSize: 14,
              padding: "13px 30px", borderRadius: 10, textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.01em",
              boxShadow: "0 4px 0 rgba(150,95,30,0.5),0 6px 18px rgba(201,136,58,0.30)",
            }}>
              Request Enterprise Training <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
            </Link>
            <Link to="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.08)", color: "#ffffff",
              fontWeight: 600, fontSize: 14, padding: "13px 30px", borderRadius: 10,
              textDecoration: "none", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.01em",
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
            }}>
              Contact Us <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
            </Link>
          </div>
        </div>
      </div>
    </section>

  </CustomLayout>
);

export default TrainingPage;
