// XerxezCourses.tsx
// Purpose: Training page "Featured courses" section — fetches the first 3
//          courses from the live LMA API and renders them as 3D-lift cards,
//          with loading / empty states and a 2-course hardcoded fallback if
//          the request fails.
// Used in: page/v2/TrainingV2.tsx
// Data source: GET {V2_API_BASE}/lma/courses/ — the same endpoint the existing
//              TrainingPage uses (src/page/TrainingPage.tsx). FALLBACK_COURSES
//              is only ever shown when that request fails.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Shield, Code, BarChart3, Cloud, BookOpen, Clock, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { T, SectionHeading, Reveal, sectionPad, V2_API_BASE } from "../../01-core/v2theme";

// Shape of one course object from the API (only the fields we render).
interface ApiCourse {
  id: number; title: string; description: string; category: string; level: string;
  badge: string; hours: number; lessons: number; tech_stack: string[];
}

// Shown only if the API request fails, so the section never renders empty.
const FALLBACK_COURSES: ApiCourse[] = [
  {
    id: -1, title: "AI Practitioner Program", category: "AI & ML", level: "intermediate", badge: "",
    description: "Hands-on training in applied AI — from model development to production deployment.",
    hours: 40, lessons: 32, tech_stack: ["Python", "TensorFlow", "LangChain", "AWS"],
  },
  {
    id: -2, title: "DevSecOps & MLOps Fundamentals", category: "DevSecOps & AI", level: "advanced", badge: "",
    description: "Practical DevSecOps and MLOps training covering CI/CD, security and automated deployment pipelines.",
    hours: 32, lessons: 24, tech_stack: ["Kubernetes", "Docker", "Terraform", "GitHub Actions"],
  },
];

// category → header icon; unknown categories fall back to <BookOpen>.
const CAT_ICON: Record<string, LucideIcon> = {
  "AI & ML": Brain,
  "DevSecOps & AI": Shield,
  "Web Development": Code,
  "Data Science": BarChart3,
  "Cloud & DevOps": Cloud,
};
// level → text/pill colour.
const LEVEL_COLOR: Record<string, string> = {
  beginner: "#16a34a", intermediate: T.red, advanced: "#e11d2e",
};

const CourseCard = ({ c }: { c: ApiCourse }) => {
  const [hover, setHover] = useState(false);
  const Icon = CAT_ICON[c.category] ?? BookOpen;
  const levelColor = LEVEL_COLOR[c.level] ?? T.red;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "100%", display: "flex", flexDirection: "column",
        background: "#fff", borderRadius: 16,
        overflow: "hidden", position: "relative",
        borderTop: `3px solid ${hover ? T.red : "transparent"}`,
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hover
          ? "0 25px 50px rgba(7,26,51,0.22)"
          : "0 2px 6px rgba(7,26,51,0.05), 0 12px 28px rgba(7,26,51,0.09)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* optional badge (e.g. "BESTSELLER") top-right */}
      {c.badge && (
        <span style={{
          position: "absolute", top: 16, right: 16,
          background: T.red, color: "#fff",
          fontFamily: T.fontHead, fontSize: 10, fontWeight: 700,
          padding: "4px 12px", borderRadius: 999,
          letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          {c.badge}
        </span>
      )}
      {/* pale banner with the category icon */}
      <div style={{ background: T.lightAlt, padding: "30px 28px 22px" }}>
        <span style={{
          width: 60, height: 60, borderRadius: 16,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "#fff", color: T.headNavy,
          boxShadow: "0 8px 20px rgba(7,26,51,0.10)",
        }}>
          <Icon size={26} strokeWidth={2} />
        </span>
      </div>
      {/* body: category + level (opposite ends of the row so they never run
          together regardless of how long the category name is), title,
          description, tech tags */}
      <div style={{ padding: "20px 28px 16px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <span style={{
            fontFamily: T.fontHead, fontSize: 11, fontWeight: 700, color: T.red,
            background: "rgba(217,53,34,0.08)", padding: "3px 10px", borderRadius: 6,
          }}>
            {c.category}
          </span>
          <span style={{
            fontFamily: T.fontHead, fontSize: 10.5, fontWeight: 700, color: levelColor,
            background: `${levelColor}14`, padding: "3px 10px", borderRadius: 999,
            textTransform: "capitalize", flexShrink: 0,
          }}>
            {c.level}
          </span>
        </div>
        <h3 style={{ fontFamily: T.fontHead, fontSize: 19, fontWeight: 700, color: T.headNavy, margin: "0 0 10px", lineHeight: 1.3 }}>
          {c.title}
        </h3>
        <p style={{ fontFamily: T.fontBody, fontSize: 13.5, lineHeight: 1.7, color: T.muted, margin: "0 0 14px" }}>
          {c.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {/* first 4 tech-stack tags */}
          {(c.tech_stack ?? []).slice(0, 4).map((t) => (
            <span key={t} style={{
              fontFamily: T.fontBody, fontSize: 11, fontWeight: 600, color: "#5b6b7c",
              background: T.lightAlt, border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 9px",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      {/* footer: hours · lessons on top, full-width enroll button below */}
      <div style={{ padding: "14px 28px 24px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: T.fontBody, fontSize: 12.5, color: "#5b6b7c", marginBottom: 14 }}>
          <Clock size={13} color={T.red} /> {c.hours}h
          <span style={{ color: T.border }}>·</span>
          <PlayCircle size={13} color={T.red} /> {c.lessons} lessons
        </div>
        <Link to={`/lma/courses/${c.id}`} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          background: T.red, color: "#fff",
          fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 600,
          padding: "12px 18px", borderRadius: T.rx, textDecoration: "none",
        }}>
          Enroll now →
        </Link>
      </div>
    </div>
  );
};

const XerxezCourses = () => {
  const [courses, setCourses] = useState<ApiCourse[]>([]);   // fetched courses (max 3)
  const [loading, setLoading] = useState(true);              // request in flight
  const [usingFallback, setUsingFallback] = useState(false); // API failed → showing FALLBACK_COURSES

  // Fetch once on mount. Accept either a bare array or a paginated { results }.
  useEffect(() => {
    fetch(`${V2_API_BASE}/lma/courses/`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d) => { const list = Array.isArray(d) ? d : d.results ?? []; setCourses(list.slice(0, 3)); })
      .catch(() => setUsingFallback(true))
      .finally(() => setLoading(false));
  }, []);

  const shown = usingFallback ? FALLBACK_COURSES : courses;
  // 3 courses → 3-up; exactly 2 (a short API response, or the fallback) → 2-up, centered.
  const colClass = shown.length === 2 ? "col-lg-6 col-md-8" : "col-lg-4 col-md-6";

  // The grid body for the current fetch state, checked in order:
  // still loading → nothing came back at all → the cards (live or fallback).
  const renderCourses = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{
            width: 30, height: 30, margin: "0 auto",
            border: `3px solid ${T.border}`, borderTopColor: T.red,
            borderRadius: "50%", animation: "v2spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes v2spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }
    if (shown.length === 0) {
      return (
        <p style={{ textAlign: "center", fontFamily: T.fontBody, fontSize: 14, color: T.muted }}>
          New courses are on the way — check back soon.
        </p>
      );
    }
    return (
      <div className="row g-4 justify-content-center">
        {shown.map((c, i) => (
          <div key={c.id} className={colClass}>
            <Reveal delay={(i % 3) * 60} fill><CourseCard c={c} /></Reveal>
          </div>
        ))}
      </div>
    );
  };

  return (
    // id="courses" is the scroll target if a page links to #courses
    <section id="courses" style={{ ...sectionPad, background: T.lightAlt }}>
      <div className="container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="What We Offer"
            title="Featured courses"
            subtitle="Practitioner-built programs covering every layer of enterprise AI — from strategy to shipping."
          />
        </Reveal>

        <div style={{ marginTop: 52 }}>{renderCourses()}</div>

        {/* always show the catalog link */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/lma/courses" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: T.fontHead, fontSize: 14, fontWeight: 600, color: T.red,
            border: `1.5px solid ${T.red}`, padding: "11px 24px", borderRadius: T.rx, textDecoration: "none",
          }}>
            Browse all courses →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default XerxezCourses;
