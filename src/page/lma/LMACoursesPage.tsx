import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Users, Clock, BookOpen, Filter, ChevronRight } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD = "#C9883A";
const AMBER = "#E8A84E";
const DARK = "#1a1208";
const CREAM = "#F8F4EE";

interface Course {
  id: number; title: string; description: string; category: string; level: string;
  price: number; badge: string; header_color: string; rating: number; total_ratings: number;
  total_students: number; hours: number; lessons: number; tech_stack: string[];
  instructor_name: string; status: string;
}

/* ── Course card with 3D tilt ── */
const CourseCard = ({ course, index }: { course: Course; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.5s ease ${index * 60}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 60}ms`;
    setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, 100 + index * 60);
  }, [index]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(800px) rotateX(${(0.5-y)*7}deg) rotateY(${(x-0.5)*7}deg) translateY(-4px)`;
    el.style.transition = "transform 0.10s ease";
  };
  const onLeave = () => { if (ref.current) { ref.current.style.transform = "none"; ref.current.style.transition = "transform 0.28s ease"; } };

  const headerGrad = course.header_color === "blue"
    ? "linear-gradient(135deg,#1e40af 0%,#3b82f6 100%)"
    : `linear-gradient(135deg,${DARK} 0%,#2a1c0c 100%)`;

  const badgeColor = course.badge === "BESTSELLER" ? { bg: "rgba(255,193,0,0.18)", c: "#b45309" }
    : course.badge === "NEW" ? { bg: "rgba(59,130,246,0.15)", c: "#1d4ed8" }
    : { bg: "rgba(201,136,58,0.14)", c: GOLD };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", transformStyle: "preserve-3d", willChange: "transform", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: headerGrad, padding: "20px 20px 16px", position: "relative", minHeight: 100 }}>
        {course.badge && (
          <span style={{ position: "absolute", top: 12, right: 12, fontSize: 10, fontWeight: 800, letterSpacing: "0.10em", padding: "3px 9px", borderRadius: 999, background: badgeColor.bg, color: badgeColor.c }}>
            {course.badge}
          </span>
        )}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.50)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{course.category}</div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.35 }}>{course.title}</h3>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(course.tech_stack ?? []).slice(0, 4).map(t => (
            <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.80)" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.55)", lineHeight: 1.55, margin: "0 0 14px", flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {course.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          {course.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={13} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{course.rating}</span>
              <span style={{ fontSize: 11, color: "rgba(20,20,19,0.45)" }}>({course.total_ratings})</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Users size={13} color="rgba(20,20,19,0.40)" />
            <span style={{ fontSize: 12, color: "rgba(20,20,19,0.55)" }}>{(course.total_students ?? 0).toLocaleString()} students</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 12, color: "rgba(20,20,19,0.55)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{course.hours}h</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BookOpen size={12} />{course.lessons} lessons</span>
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: course.level === "beginner" ? "#d1fae5" : course.level === "intermediate" ? "#dbeafe" : "#fde68a", color: course.level === "beginner" ? "#059669" : course.level === "intermediate" ? "#2563eb" : "#d97706" }}>
            {course.level}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>₹{course.price?.toLocaleString()}</span>
          </div>
          <Link to={`/lma/courses/${course.id}`} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            color: "#0a0806", fontSize: 13, fontWeight: 700,
            padding: "9px 16px", borderRadius: 9, textDecoration: "none",
            boxShadow: "0 2px 0 rgba(140,80,20,0.35)",
          }}>
            View <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function LMACoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetch(`${API}/lma/courses/`)
      .then(r => r.json())
      .then(d => setCourses(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
    const matchL = level === "all" || c.level === level;
    const matchC = category === "all" || c.category === category;
    return matchQ && matchL && matchC;
  });

  const categories = ["all", ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero banner */}
      <div style={{ background: `linear-gradient(135deg,${DARK} 0%,#100c07 100%)`, padding: "64px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
        <Link to="/" style={{ display: "inline-block", marginBottom: 20 }}>
          <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 44, width: "auto" }} />
        </Link>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, position: "relative" }}>
          XERXEZ Academy
        </div>
        <h1 style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.15, position: "relative" }}>
          Learn from the<br />
          <span style={{ background: `linear-gradient(90deg,${AMBER},${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Best in the Industry</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.50)", margin: "0 auto 28px", maxWidth: 480, position: "relative" }}>
          Expert-led courses in AI, ML, and enterprise software engineering.
        </p>

        {/* Search */}
        <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
          <Search size={16} color="#9ca3af" style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text" placeholder="Search courses, topics, technologies…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "14px 18px 14px 44px", borderRadius: 12, border: "none", fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif", background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 24px rgba(0,0,0,0.20)", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "14px 28px", display: "flex", gap: 12, alignItems: "center", overflowX: "auto" }}>
        <Filter size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.45)", flexShrink: 0 }}>Level:</span>
        {["all","beginner","intermediate","advanced"].map(l => (
          <button key={l} onClick={() => setLevel(l)} style={{
            fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 999, cursor: "pointer", flexShrink: 0,
            border: `1.5px solid ${level === l ? GOLD : "rgba(0,0,0,0.10)"}`,
            background: level === l ? `rgba(201,136,58,0.10)` : "transparent",
            color: level === l ? GOLD : "rgba(20,20,19,0.55)",
          }}>
            {l === "all" ? "All Levels" : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.45)", marginLeft: 8, flexShrink: 0 }}>Category:</span>
        {categories.slice(0, 5).map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 999, cursor: "pointer", flexShrink: 0,
            border: `1.5px solid ${category === c ? GOLD : "rgba(0,0,0,0.10)"}`,
            background: category === c ? `rgba(201,136,58,0.10)` : "transparent",
            color: category === c ? GOLD : "rgba(20,20,19,0.55)",
          }}>
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: 0 }}>
            {loading ? "Loading…" : `${filtered.length} Course${filtered.length !== 1 ? "s" : ""}`}
          </h2>
          <Link to="/lma/login" style={{ fontSize: 13, fontWeight: 700, color: GOLD, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
            Sign in to enroll <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: "#fff", borderRadius: 18, height: 360, animation: "lma-pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <BookOpen size={48} color="#d1d5db" style={{ marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
            <p style={{ color: "#9ca3af", fontSize: 15 }}>No courses match your search. Try different keywords.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {filtered.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        )}
      </div>

      <style>{`
        @keyframes lma-pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
      `}</style>
    </div>
  );
}
