import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Users, BookOpen, Clock } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number | string;
  badge: string;
  rating: number;
  total_ratings: number;
  total_students: number;
  hours: number;
  lessons: number;
  tech_stack: string;
  instructor_name: string;
  status: string;
}

/* ── Card3D ── */
const Card3D = ({ children, accent = GOLD, style = {}, p = "22px 20px" }: {
  children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(false);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 7}deg) translateY(-7px)`;
    el.style.transition = "transform 0.08s ease";
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) { el.style.transform = "translateY(0)"; el.style.transition = "transform 0.32s cubic-bezier(0.22,1,0.36,1)"; }
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={() => setH(true)} onMouseOut={() => setH(false)}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)",
        borderTop: `3px solid ${accent}`,
        boxShadow: h ? BHOV : BCARD,
        transition: "box-shadow 0.28s ease",
        padding: p, position: "relative", willChange: "transform", overflow: "hidden",
        ...style,
      }}>
      {children}
    </div>
  );
};

/* ── Skeleton ── */
const SkeletonCourseCard = () => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
    <div style={{ height: 90, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    <div style={{ padding: 20 }}>
      {[["40%", 12, 8], ["80%", 16, 6], ["55%", 12, 16], ["100%", 36, 0]].map(([w, h, mb], idx) => (
        <div key={idx} style={{ height: h as number, width: w as string, borderRadius: (h as number) / 2, marginBottom: mb as number, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
      ))}
    </div>
  </div>
);

/* ── Star Rating ── */
const StarRating = ({ value }: { value: number }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={11} color="#f59e0b" fill={s <= Math.round(value) ? "#f59e0b" : "none"} />
    ))}
  </span>
);

const levelColor = (level: string) => {
  const l = level?.toLowerCase() ?? "";
  if (l.includes("beginner")) return { color: "#059669", bg: "rgba(5,150,105,0.10)" };
  if (l.includes("intermediate")) return { color: "#3b82f6", bg: "rgba(59,130,246,0.10)" };
  if (l.includes("advanced")) return { color: "#8b5cf6", bg: "rgba(139,92,246,0.10)" };
  return { color: GOLD, bg: "rgba(201,136,58,0.10)" };
};

export default function LMABrowseCoursesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    setFetchError(false);
    fetch(`${API}/lma/courses/browse/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        const list = Array.isArray(d) ? d : Array.isArray(d?.results) ? d.results : [];
        setCourses(list);
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
    return ["All", ...cats];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = !search || (c.title ?? "").toLowerCase().includes(search.toLowerCase()) || (c.category ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || c.category === category;
      return matchSearch && matchCat;
    });
  }, [courses, search, category]);

  const handleEnroll = (id: number) => {
    if (!token) {
      navigate(`/lma/login?redirect=/lma/courses/${id}&action=enroll`);
    } else {
      navigate(`/lma/courses/${id}?action=enroll`);
    }
  };

  return (
    <LMAStudentLayout>
      <div style={{ fontFamily: FF }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>
          Browse Courses
        </h2>

        {fetchError && (
          <div style={{ padding: "20px 24px", background: "rgba(239,68,68,0.08)", borderRadius: 12, border: "1px solid rgba(239,68,68,0.18)", marginBottom: 20, color: "#dc2626", fontSize: 14, fontWeight: 600, fontFamily: FF }}>
            Could not load courses. Please check your connection or try refreshing.
          </div>
        )}

        {/* Search + categories */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ position: "relative", maxWidth: 480, marginBottom: 16 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses…"
              style={{
                width: "100%", padding: "10px 14px 10px 40px",
                borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.10)",
                fontSize: 14, fontFamily: FF, outline: "none",
                background: "#fff", color: "#141413",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                border: "none", cursor: "pointer", fontFamily: FF,
                background: category === cat ? `linear-gradient(135deg,${AMBER},${GOLD})` : "rgba(0,0,0,0.06)",
                color: category === cat ? "#0a0806" : "#6b7280",
                transition: "all 0.18s ease",
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {[0, 1, 2, 3, 4, 5].map(i => <SkeletonCourseCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)" }}>
            <BookOpen size={48} color="#d1d5db" style={{ display: "block", margin: "0 auto 16px" }} />
            <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 6px", fontFamily: FF, fontWeight: 600 }}>
              {search || category !== "All"
                ? "No courses match your filters."
                : "No new courses available right now."}
            </p>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, fontFamily: FF }}>
              {search || category !== "All"
                ? "Try different keywords or clear the filter."
                : "Check back soon — new courses are added regularly."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {filtered.map((course, i) => {
              const lvl = levelColor(course.level);
              return (
                <Card3D key={course.id} accent={GOLD} p="0"
                  style={{ animation: "lmaPage-in 0.40s ease both", animationDelay: `${i * 80}ms` }}>

                  {/* Gradient header */}
                  <div style={{
                    height: 90, background: `linear-gradient(135deg,${GOLD},${AMBER})`,
                    position: "relative", padding: "16px 20px",
                    display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  }}>
                    {course.badge && (
                      <span style={{ position: "absolute", top: 12, right: 12, fontSize: 10, fontWeight: 800, color: "#0a0806", background: "rgba(255,255,255,0.90)", padding: "3px 9px", borderRadius: 999 }}>
                        {course.badge}
                      </span>
                    )}
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.90)", background: "rgba(0,0,0,0.20)", padding: "2px 8px", borderRadius: 999 }}>
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "16px 20px 20px" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 6px", lineHeight: 1.35, fontFamily: FF }}>
                      {course.title}
                    </h3>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: lvl.color, background: lvl.bg, padding: "2px 8px", borderRadius: 999 }}>
                        {course.level}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: "rgba(20,20,19,0.50)", marginBottom: 10, fontFamily: FF }}>
                      by {course.instructor_name}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <StarRating value={Number(course.rating) || 0} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>{(Number(course.rating) || 0).toFixed(1)}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>({Number(course.total_ratings) || 0})</span>
                    </div>

                    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#9ca3af", marginBottom: 14 }}>
                      <span><Clock size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />{Number(course.hours) || 0}h</span>
                      <span><BookOpen size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />{Number(course.lessons) || 0} lessons</span>
                      <span><Users size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />{Number(course.total_students) || 0}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: GOLD, fontFamily: FF }}>
                        {course.price === 0 || course.price === "0" || course.price === "0.00"
                          ? <span style={{ fontSize: 14, color: "#059669", fontWeight: 700 }}>Free</span>
                          : `₹${course.price}`}
                      </div>
                      <button onClick={() => handleEnroll(course.id)} style={{
                        background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                        color: "#0a0806", fontSize: 13, fontWeight: 700,
                        padding: "9px 18px", borderRadius: 9, border: "none",
                        cursor: "pointer", fontFamily: FF,
                        boxShadow: "0 4px 0 rgba(140,80,20,0.30)",
                      }}>
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        )}
      </div>
    </LMAStudentLayout>
  );
}
