/**
 * AITrainingPage — Coursera-style course showcase, XERXEZ branded.
 * Fetches live data from /api/v1/lma/courses/ + course detail.
 * No new deps: IntersectionObserver reveals, CSS max-height accordion,
 * CSS keyframe orbs for hero atmosphere.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";

/* ── Brand tokens ──────────────────────────────────────────────────────────── */
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const DARK2 = "#100c07";
const CREAM = "#F8F4EE";

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ?? "https://backend-production-b9f2.up.railway.app/api/v1";

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface Lesson {
  id: number; title: string; duration: number; order: number; is_free_preview: boolean;
}
interface Module {
  id: number; title: string; order: number; duration: number; lessons: Lesson[];
}
interface CourseDetail {
  id: number; title: string; description: string; category: string; level: string;
  price: number; badge: string; rating: number; total_ratings: number;
  total_students: number; hours: number; lessons: number;
  tech_stack: string[]; instructor_name: string; modules: Module[];
}
interface CourseListItem {
  id: number; title: string; badge: string; category: string; level: string;
  rating: number; total_students: number; hours: number; lessons: number; instructor_name: string;
}

/* ── Module thumbnail palette ──────────────────────────────────────────────── */
const THUMB_GRADS = [
  ["#1e3a5f", "#3b82f6"],
  ["#3b1f6e", "#8b5cf6"],
  ["#0f3d30", "#10b981"],
  ["#5a3200", "#C9883A"],
  ["#5a1020", "#f43f5e"],
  ["#0f2040", "#60a5fa"],
];
const THUMB_ICONS = [
  "fas fa-brain", "fas fa-code", "fas fa-cogs",
  "fas fa-chart-bar", "fas fa-cloud", "fas fa-shield-alt",
];

/* ── ModuleThumbnail ───────────────────────────────────────────────────────── */
const ModuleThumbnail = ({ index, size = 80 }: { index: number; size?: number }) => {
  const [a, b] = THUMB_GRADS[index % THUMB_GRADS.length];
  return (
    <div style={{
      width: size, height: Math.round(size * 0.7), borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)" }} />
      <i className={THUMB_ICONS[index % THUMB_ICONS.length]}
        style={{ color: "rgba(255,255,255,0.92)", fontSize: size * 0.25, position: "relative", zIndex: 1 }} />
    </div>
  );
};

/* ── Star rating (hero, dark bg) ───────────────────────────────────────────── */
const StarRating = ({ rating }: { rating: number }) => (
  <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
    {[1, 2, 3, 4, 5].map(n => (
      <i key={n} className="fas fa-star"
        style={{ fontSize: 12, color: n <= Math.round(rating) ? "#f59e0b" : "rgba(255,255,255,0.22)" }} />
    ))}
    <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginLeft: 5 }}>{rating}</span>
  </span>
);

/* ── Lesson row (inside accordion) ────────────────────────────────────────── */
const LessonRow = ({ lesson }: { lesson: Lesson }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
  }}>
    {lesson.is_free_preview
      ? <i className="fas fa-play-circle" style={{ fontSize: 14, color: GOLD, flexShrink: 0, width: 16 }} />
      : <i className="fas fa-lock" style={{ fontSize: 12, color: "#c5bfba", flexShrink: 0, width: 16 }} />}
    <span style={{
      flex: 1, fontSize: 13, lineHeight: 1.45,
      color: lesson.is_free_preview ? "#141413" : "rgba(20,20,19,0.52)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {lesson.title}
    </span>
    {lesson.is_free_preview && (
      <span style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase",
        color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 4, padding: "1px 6px", flexShrink: 0,
      }}>
        Free
      </span>
    )}
    <span style={{ fontSize: 11.5, color: "rgba(20,20,19,0.38)", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
      {lesson.duration}m
    </span>
  </div>
);

/* ── Module accordion row ──────────────────────────────────────────────────── */
const ModuleRow = ({
  mod, modIndex, isOpen, toggle, revealDelay,
}: {
  mod: Module; modIndex: number; isOpen: boolean; toggle: () => void; revealDelay: number;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current; if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = `opacity 0.48s ease ${revealDelay}ms, transform 0.48s cubic-bezier(0.22,1,0.36,1) ${revealDelay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [revealDelay]);

  const totalMins = mod.lessons?.reduce((s, l) => s + (l.duration ?? 0), 0) ?? mod.duration ?? 0;
  const h = Math.floor(totalMins / 60), m = totalMins % 60;
  const durStr = h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;

  return (
    <div ref={rowRef} style={{
      border: "1px solid rgba(0,0,0,0.09)",
      borderLeft: `3px solid ${isOpen ? GOLD : "transparent"}`,
      borderRadius: 10, marginBottom: 8, overflow: "hidden", background: "#fff",
      transition: "border-left-color 0.22s ease",
    }}>
      {/* Header button */}
      <button onClick={toggle} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14,
        padding: "13px 16px", border: "none", cursor: "pointer",
        background: isOpen ? "#fdfaf6" : "#fff",
        fontFamily: "'DM Sans', sans-serif", textAlign: "left",
        transition: "background 0.18s ease",
      }}>
        <ModuleThumbnail index={modIndex} size={80} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", marginBottom: 3, lineHeight: 1.3 }}>
            {mod.title}
          </div>
          <div style={{ fontSize: 12, color: "rgba(20,20,19,0.44)", fontFamily: "'DM Sans', sans-serif" }}>
            Course {modIndex + 1} · {mod.lessons?.length ?? 0} lessons · {durStr}
          </div>
        </div>
        <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}
          style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0, transition: "transform 0.22s ease" }} />
      </button>

      {/* Lesson list — max-height accordion */}
      <div style={{
        maxHeight: isOpen ? "3000px" : "0px",
        overflow: "hidden",
        transition: isOpen
          ? "max-height 0.55s cubic-bezier(0.4,0,0.2,1)"
          : "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div className="at-lesson-indent" style={{
          padding: "2px 16px 12px",
          paddingLeft: 110,
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}>
          {(mod.lessons ?? []).map(l => <LessonRow key={l.id} lesson={l} />)}
        </div>
      </div>
    </div>
  );
};

/* ── Instructor item (right sidebar) ───────────────────────────────────────── */
const InstructorItem = ({
  name, designation, courses, learners,
}: {
  name: string; designation: string; courses: number; learners: string;
}) => {
  const [hov, setHov] = useState(false);
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${AMBER}, ${GOLD})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#0a0806", fontWeight: 800, fontSize: 15, cursor: "pointer",
          boxShadow: hov ? `0 0 0 3px ${GOLD}, 0 0 18px rgba(201,136,58,0.40)` : "none",
          transition: "box-shadow 0.22s ease",
        }}
      >{initials}</div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>{name}</div>
        <div style={{ fontSize: 12, color: "rgba(20,20,19,0.52)", marginBottom: 3, fontFamily: "'DM Sans', sans-serif" }}>{designation}</div>
        <div style={{ fontSize: 11, color: "rgba(20,20,19,0.38)", fontFamily: "'DM Sans', sans-serif" }}>
          {courses} Course{courses !== 1 ? "s" : ""} · {learners} learners
        </div>
      </div>
    </div>
  );
};

/* ── What You'll Learn ─────────────────────────────────────────────────────── */
const WhatYouLearnBox = ({ techStack }: { techStack: string[] }) => {
  const items = [
    `Hands-on with ${techStack[0] ?? "Python"} from day one`,
    "Build production-ready AI systems end-to-end",
    `Deploy and monitor with ${techStack[1] ?? "cloud platforms"}`,
    "Earn XERXEZ AI certification",
    `Work with real enterprise ${techStack[2] ?? "data pipelines"}`,
    "Master industry deployment patterns and MLOps",
  ];
  return (
    <div style={{
      border: "1px solid rgba(0,0,0,0.09)", borderRadius: 14,
      padding: "22px 26px", marginBottom: 24, background: "#fff",
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>
        What you'll learn
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }} className="at-learn-grid">
        {items.map(item => (
          <div key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <i className="fas fa-check" style={{ color: "#10b981", fontSize: 12, marginTop: 4, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Skills pills ──────────────────────────────────────────────────────────── */
const SkillsPills = ({ items, heading }: { items: string[]; heading: string }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>
      {heading}
    </h3>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map(t => (
        <span key={t} style={{
          fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 999,
          background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb",
          fontFamily: "'DM Sans', sans-serif",
        }}>{t}</span>
      ))}
    </div>
  </div>
);

/* ── Details to know ───────────────────────────────────────────────────────── */
const DetailsToKnow = ({ hours, lessonsCount, level }: { hours: number; lessonsCount: number; level: string }) => (
  <div style={{ marginBottom: 28 }}>
    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>
      Details to know
    </h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {[
        { icon: "fab fa-linkedin", label: "Shareable certificate", sub: "Add to LinkedIn profile", iconColor: "#0077b5" },
        { icon: "fas fa-globe", label: "Taught in English", sub: "Certificate in English", iconColor: GOLD },
        { icon: "far fa-clock", label: `${hours} hours`, sub: "Flexible schedule", iconColor: GOLD },
        { icon: "fas fa-layer-group", label: `${lessonsCount} lessons`, sub: level.charAt(0).toUpperCase() + level.slice(1) + " level", iconColor: GOLD },
      ].map(d => (
        <div key={d.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <i className={d.icon} style={{ fontSize: 20, color: d.iconColor, width: 24, textAlign: "center", marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: "'DM Sans', sans-serif" }}>{d.label}</div>
            <div style={{ fontSize: 12, color: "rgba(20,20,19,0.48)", fontFamily: "'DM Sans', sans-serif" }}>{d.sub}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════════════════════════════════════════════════════ */
const AITrainingPage = () => {
  const [courseList, setCourseList]     = useState<CourseListItem[]>([]);
  const [selectedId, setSelectedId]     = useState<number | null>(null);
  const [detail, setDetail]             = useState<CourseDetail | null>(null);
  const [loadingList, setLoadingList]   = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [openModules, setOpenModules]   = useState<Set<number>>(new Set([0]));
  const [activeTab, setActiveTab]       = useState<"about" | "curriculum">("about");

  /* Fetch course list on mount */
  useEffect(() => {
    fetch(`${API_BASE}/lma/courses/`)
      .then(r => r.json())
      .then(d => {
        const list: CourseListItem[] = Array.isArray(d) ? d : (d.results ?? []);
        setCourseList(list);
        if (list.length > 0) setSelectedId(list[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  /* Fetch course detail when selection changes */
  useEffect(() => {
    if (!selectedId) return;
    setLoadingDetail(true);
    setDetail(null);
    setOpenModules(new Set([0]));
    fetch(`${API_BASE}/lma/courses/${selectedId}/`)
      .then(r => r.json())
      .then(d => setDetail(d))
      .catch(() => {})
      .finally(() => setLoadingDetail(false));
  }, [selectedId]);

  const toggleModule = useCallback((idx: number) => {
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (!detail) return;
    setOpenModules(new Set((detail.modules ?? []).map((_, i) => i)));
  }, [detail]);

  const collapseAll = useCallback(() => setOpenModules(new Set()), []);

  const totalLessons = detail?.modules?.reduce((s, m) => s + (m.lessons?.length ?? 0), 0) ?? 0;

  return (
    <CustomLayout>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="at-hero">
        {/* Ambient orbs */}
        <div className="at-orb at-orb-1" />
        <div className="at-orb at-orb-2" />
        <div className="at-orb at-orb-3" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginBottom: 22, fontFamily: "'DM Sans', sans-serif" }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.38)", textDecoration: "none" }}>Home</Link>
            {" › "}
            <Link to="/service" style={{ color: "rgba(255,255,255,0.38)", textDecoration: "none" }}>Services</Link>
            {" › "}
            <span style={{ color: "rgba(255,255,255,0.65)" }}>AI Training &amp; Consulting</span>
          </div>

          {/* Course selector tabs */}
          {!loadingList && courseList.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 26, flexWrap: "wrap" }}>
              {courseList.map(c => (
                <button key={c.id} onClick={() => setSelectedId(c.id)} style={{
                  fontSize: 12, fontWeight: 700, padding: "7px 16px",
                  borderRadius: 999, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  border: `1.5px solid ${selectedId === c.id ? GOLD : "rgba(255,255,255,0.18)"}`,
                  background: selectedId === c.id ? "rgba(201,136,58,0.18)" : "rgba(255,255,255,0.06)",
                  color: selectedId === c.id ? AMBER : "rgba(255,255,255,0.55)",
                  transition: "all 0.18s ease",
                }}>
                  {c.title}
                </button>
              ))}
            </div>
          )}

          {/* Hero content */}
          {(loadingList || loadingDetail) && !detail ? (
            <div style={{ padding: "40px 0", display: "flex", gap: 12, alignItems: "center" }}>
              <div className="at-spinner" />
              <span style={{ color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                Loading program…
              </span>
            </div>
          ) : detail ? (
            <div style={{ maxWidth: 740 }}>
              {detail.badge && (
                <span style={{
                  display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
                  textTransform: "uppercase", padding: "3px 10px", borderRadius: 999, marginBottom: 12,
                  background: "rgba(255,193,0,0.18)", color: "#f59e0b",
                }}>
                  {detail.badge}
                </span>
              )}

              <h1 style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
                fontSize: "clamp(26px,4vw,48px)", lineHeight: 1.1,
                color: "#fff", margin: "0 0 14px", letterSpacing: "-0.025em",
              }}>
                {detail.title}
              </h1>

              <p style={{
                fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.68,
                margin: "0 0 18px", maxWidth: 620, fontFamily: "'DM Sans', sans-serif",
              }}>
                {detail.description}
              </p>

              {/* Rating + students */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 16 }}>
                {detail.rating > 0 && (
                  <>
                    <StarRating rating={detail.rating} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif" }}>
                      ({detail.total_ratings?.toLocaleString()} ratings)
                    </span>
                  </>
                )}
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif" }}>
                  <i className="fas fa-users" style={{ fontSize: 12 }} />
                  {detail.total_students?.toLocaleString()} already enrolled
                </span>
              </div>

              {/* XERXEZ Academy badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif" }}>
                  Included with
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase",
                  padding: "2px 10px", borderRadius: 4,
                  background: `linear-gradient(135deg, ${AMBER}, ${GOLD})`, color: "#0a0806",
                }}>
                  XERXEZ Academy
                </span>
                <span style={{ fontSize: 12, color: GOLD, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  · Learn more
                </span>
              </div>

              {/* Category + level + duration chips */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 13px", borderRadius: 999, border: `1px solid rgba(201,136,58,0.55)`, color: AMBER, fontFamily: "'DM Sans', sans-serif" }}>
                  {detail.category}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 13px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                  {detail.level} level
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 13px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.50)", fontFamily: "'DM Sans', sans-serif" }}>
                  {detail.hours}h · {totalLessons} lessons
                </span>
              </div>

              {/* Tech stack pills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(detail.tech_stack ?? []).map(t => (
                  <span key={t} style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 11px", borderRadius: 999,
                    background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.62)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ══ TRUST BAR ═════════════════════════════════════════════════════════ */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "13px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: "fas fa-award",          label: "CPD Accredited"     },
              { icon: "fas fa-certificate",     label: "AWS Certified"      },
              { icon: "fas fa-shield-alt",      label: "ISO 27001"          },
              { icon: "fas fa-graduation-cap",  label: "Hands-On Labs"      },
              { icon: "fas fa-users",           label: "500+ Trained"       },
              { icon: "fas fa-brain",           label: "OpenAI Partner"     },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.52)", fontFamily: "'DM Sans', sans-serif" }}>
                <i className={t.icon} style={{ color: GOLD, fontSize: 13 }} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STICKY TAB NAV ════════════════════════════════════════════════════ */}
      <div className="at-tab-nav">
        <div className="container">
          <div style={{ display: "flex" }}>
            {(["about", "curriculum"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                fontSize: 13.5, fontWeight: activeTab === t ? 700 : 500,
                color: activeTab === t ? GOLD : "rgba(20,20,19,0.48)",
                borderBottom: `2px solid ${activeTab === t ? GOLD : "transparent"}`,
                marginBottom: -2, padding: "13px 20px",
                background: "none", border: "none", borderRadius: 0, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize",
                transition: "color 0.18s ease",
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT AREA ══════════════════════════════════════════════════════ */}
      <div style={{ background: CREAM, minHeight: 500 }}>
        <div className="container">
          <div className="at-body-row">

            {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {loadingDetail || (!detail && !loadingList) ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                  {(loadingDetail || loadingList) && <div className="at-spinner at-spinner-gold" />}
                </div>
              ) : detail ? (
                <>
                  {activeTab === "about" && (
                    <>
                      <WhatYouLearnBox techStack={detail.tech_stack ?? []} />
                      <SkillsPills items={detail.tech_stack ?? []} heading="Skills you'll gain" />
                      <DetailsToKnow hours={detail.hours} lessonsCount={totalLessons} level={detail.level} />
                      <button
                        onClick={() => setActiveTab("curriculum")}
                        style={{
                          fontSize: 14, fontWeight: 700, color: GOLD,
                          background: "transparent", border: `1.5px solid ${GOLD}`,
                          borderRadius: 9, padding: "10px 22px", cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          display: "inline-flex", alignItems: "center", gap: 8,
                        }}
                      >
                        View full curriculum <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
                      </button>
                    </>
                  )}

                  {activeTab === "curriculum" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                          {detail.modules?.length ?? 0}-Course Program
                        </h2>
                        <span style={{ fontSize: 12, color: "rgba(20,20,19,0.42)", fontFamily: "'DM Sans', sans-serif" }}>
                          {detail.modules?.length ?? 0} modules · {totalLessons} lessons · {detail.hours}h
                        </span>
                      </div>

                      {/* Expand / collapse */}
                      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                        <button onClick={expandAll} style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                          Expand all
                        </button>
                        <span style={{ color: "rgba(20,20,19,0.22)", fontSize: 14 }}>·</span>
                        <button onClick={collapseAll} style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                          Collapse all
                        </button>
                      </div>

                      {(detail.modules ?? []).map((mod, i) => (
                        <ModuleRow
                          key={mod.id}
                          mod={mod}
                          modIndex={i}
                          isOpen={openModules.has(i)}
                          toggle={() => toggleModule(i)}
                          revealDelay={Math.min(i * 45, 280)}
                        />
                      ))}

                      <div style={{ marginTop: 24, textAlign: "center" }}>
                        <Link to={`/lma/courses/${detail.id}`} style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          background: `linear-gradient(135deg, ${AMBER}, ${GOLD})`,
                          color: "#0a0806", fontSize: 14, fontWeight: 700,
                          padding: "12px 28px", borderRadius: 10, textDecoration: "none",
                          boxShadow: "0 4px 0 rgba(140,80,20,0.38), 0 8px 24px rgba(201,136,58,0.22)",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          Enroll in this course <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: "rgba(20,20,19,0.40)", fontFamily: "'DM Sans', sans-serif", padding: "40px 0" }}>
                  No course data available yet — check back after Railway deploys.
                </p>
              )}
            </div>

            {/* ── RIGHT COLUMN (sticky) ────────────────────────────────────── */}
            <div className="at-right-col">

              {/* Instructors card */}
              <div className="at-sidebar-card">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 18px", fontFamily: "'DM Sans', sans-serif" }}>
                  Instructors
                </h3>
                {detail?.instructor_name ? (
                  <>
                    <InstructorItem
                      name={detail.instructor_name}
                      designation="Senior AI Instructor · XERXEZ Academy"
                      courses={2}
                      learners="1,650"
                    />
                    <InstructorItem
                      name="Danish Sheikh"
                      designation="Chief AI Officer · XERXEZ"
                      courses={2}
                      learners="500"
                    />
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: "rgba(20,20,19,0.42)", fontFamily: "'DM Sans', sans-serif" }}>
                    {loadingDetail ? "Loading…" : "—"}
                  </p>
                )}
                <button style={{
                  fontSize: 12.5, fontWeight: 700, color: GOLD,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", padding: 0, marginTop: 4,
                }}>
                  View all instructors →
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 0 16px" }} />

              {/* Offered by */}
              <div className="at-sidebar-card">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: "'DM Sans', sans-serif" }}>
                  Offered by
                </h3>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 30, width: "auto" }} />
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.52)", lineHeight: 1.62, margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif" }}>
                  Enterprise AI training and software solutions across UAE, India, and UK.
                </p>
                <Link to="/about" style={{ fontSize: 12.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
                  Learn more →
                </Link>
              </div>

              <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 0 16px" }} />

              {/* Enroll price card */}
              <div style={{
                background: `linear-gradient(160deg, ${DARK} 0%, ${DARK2} 100%)`,
                borderRadius: 16, padding: "20px 22px",
                border: `1px solid rgba(201,136,58,0.22)`,
              }}>
                {detail ? (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.36)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                      One-time · Lifetime access
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: GOLD, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>
                      ₹{detail.price?.toLocaleString()}
                    </div>
                    <Link to={`/lma/courses/${detail.id}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: `linear-gradient(135deg, ${AMBER}, ${GOLD})`,
                      color: "#0a0806", fontSize: 14, fontWeight: 800,
                      padding: "12px", borderRadius: 10, textDecoration: "none",
                      boxShadow: "0 4px 0 rgba(140,80,20,0.50)", marginBottom: 10,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      Enroll for free
                      <span style={{ fontSize: 11, opacity: 0.7 }}>Starts Jul 2026</span>
                    </Link>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.32)", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
                      30-day money-back guarantee
                    </div>
                  </>
                ) : (
                  <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="at-spinner" />
                  </div>
                )}
              </div>

            </div>{/* end right col */}
          </div>{/* end body row */}
        </div>
      </div>

      {/* ══ COMPANY SOCIAL PROOF ══════════════════════════════════════════════ */}
      <div style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "40px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 40, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", maxWidth: 400 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif" }}>
                See how top teams master AI faster with XERXEZ
              </h3>
              <Link to="/contact" style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
                Request enterprise training →
              </Link>
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
              {["Tata", "Capgemini", "P&G", "L'Oréal", "Danone", "HCL"].map(co => (
                <span key={co} style={{ fontSize: 14, fontWeight: 700, color: "rgba(20,20,19,0.30)", fontFamily: "'DM Sans', sans-serif" }}>
                  {co}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ ADVANCE EXPERTISE STRIP ═══════════════════════════════════════════ */}
      <div style={{ background: CREAM, padding: "56px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: "'DM Sans', sans-serif" }}>
                Advance your team's AI expertise
              </h2>
              <ul style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.82, paddingLeft: 20, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>
                <li>Learn from practitioners with real production deployments</li>
                <li>Master models and tools in hands-on labs from day one</li>
                <li>Build deep understanding of production AI systems</li>
                <li>Earn XERXEZ AI certification recognised at 40+ organisations</li>
              </ul>
              <Link to="/contact" style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
                Learn more about enterprise plans →
              </Link>
            </div>

            {/* Course list preview card */}
            <div style={{ flexShrink: 0, maxWidth: 400, width: "100%" }}>
              <div style={{
                background: "#fff", borderRadius: 16, overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
              }}>
                {courseList.map((c, i) => (
                  <React.Fragment key={c.id}>
                    <button
                      onClick={() => { setSelectedId(c.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      style={{
                        width: "100%", display: "flex", gap: 14, padding: "16px 18px",
                        background: selectedId === c.id ? "#fdfaf6" : "#fff",
                        border: "none", cursor: "pointer", textAlign: "left",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "background 0.18s ease",
                      }}
                    >
                      <ModuleThumbnail index={i} size={70} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", lineHeight: 1.3, marginBottom: 3 }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(20,20,19,0.44)" }}>
                          Course {i + 1} · {c.hours} hours
                        </div>
                      </div>
                      <i className="fas fa-chevron-down" style={{ fontSize: 12, color: "#9ca3af", marginTop: 6, flexShrink: 0 }} />
                    </button>
                    {i < courseList.length - 1 && (
                      <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {detail && (
                <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.48)", margin: "10px 4px 0", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                  {detail.description?.substring(0, 90)}…
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ STYLES ════════════════════════════════════════════════════════════ */}
      <style>{`
        /* Hero */
        .at-hero {
          background: linear-gradient(160deg, ${DARK} 0%, ${DARK2} 100%);
          padding: 80px 0 56px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient orbs */
        .at-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .at-orb-1 {
          top: 8%; left: 4%; width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(201,136,58,0.10) 0%, transparent 70%);
          animation: at-float1 9s ease-in-out infinite;
        }
        .at-orb-2 {
          bottom: 4%; right: 6%; width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(232,168,78,0.07) 0%, transparent 70%);
          animation: at-float2 13s ease-in-out infinite;
        }
        .at-orb-3 {
          top: 48%; right: 22%; width: 110px; height: 110px;
          background: radial-gradient(circle, rgba(201,136,58,0.13) 0%, transparent 70%);
          animation: at-float3 7s ease-in-out infinite;
        }

        /* Sticky tab nav */
        .at-tab-nav {
          background: #fff;
          border-bottom: 2px solid rgba(0,0,0,0.08);
          position: sticky;
          top: 72px;
          z-index: 90;
        }

        /* Body row */
        .at-body-row {
          display: flex;
          gap: 40px;
          align-items: flex-start;
          padding: 32px 0 60px;
        }

        /* Right sidebar */
        .at-right-col {
          width: 300px;
          flex-shrink: 0;
          position: sticky;
          top: 132px;
        }
        .at-sidebar-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 22px 18px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          margin-bottom: 16px;
        }

        /* Spinner */
        .at-spinner {
          width: 28px; height: 28px;
          border: 3px solid rgba(201,136,58,0.18);
          border-top-color: ${GOLD};
          border-radius: 50%;
          animation: at-spin 0.8s linear infinite;
          display: inline-block;
        }
        .at-spinner-gold {
          width: 32px; height: 32px;
        }

        /* Keyframes */
        @keyframes at-float1 {
          0%,100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(22px, -32px) scale(1.06); }
        }
        @keyframes at-float2 {
          0%,100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-20px, 26px) scale(0.95); }
        }
        @keyframes at-float3 {
          0%,100% { transform: translate(0, 0); }
          50%      { transform: translate(14px, -18px); }
        }
        @keyframes at-spin { to { transform: rotate(360deg); } }

        /* Focus states — keyboard nav (ux-guidelines: focus-states HIGH) */
        .at-hero button:focus-visible,
        .at-tab-nav button:focus-visible {
          outline: 2px solid ${GOLD};
          outline-offset: 2px;
          border-radius: 6px;
        }
        button:focus-visible {
          outline: 2px solid ${GOLD};
          outline-offset: 2px;
        }

        /* Smooth scroll (ux-guidelines: smooth-scroll HIGH) */
        html { scroll-behavior: smooth; }

        /* Responsive */
        @media (max-width: 960px) {
          .at-body-row { flex-direction: column; }
          .at-right-col { width: 100%; position: static; }
          .at-tab-nav { top: 0; }
        }
        @media (max-width: 600px) {
          .at-learn-grid { grid-template-columns: 1fr !important; }
          .at-hero { padding: 56px 0 36px; }
          /* Reduce lesson indent on small screens to prevent overflow */
          .at-lesson-indent { padding-left: 16px !important; }
        }

        /* Reduced motion — UX compliance (continuous animation: medium severity) */
        @media (prefers-reduced-motion: reduce) {
          .at-orb { animation: none !important; }
          .at-spinner { animation-duration: 0.01ms !important; }
          * { transition-duration: 0.01ms !important; }
        }
      `}</style>

    </CustomLayout>
  );
};

export default AITrainingPage;
