import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock, Play } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

interface Enrollment {
  id: number;
  course: number;
  course_title: string;
  course_level: string;
  course_instructor: string;
  course_header_color: string;
  progress: number;
  enrolled_at: string;
  completed: boolean;
  completed_at: string | null;
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

/* ── CircleRing ── */
const CircleRing = ({ pct, size = 64, stroke = 5, color = GOLD }: { pct: number; size?: number; stroke?: number; color?: string }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);
  useEffect(() => { const t = setTimeout(() => setOff(circ - (pct / 100) * circ), 350); return () => clearTimeout(t); }, [pct, circ]);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off}
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }} strokeLinecap="round" />
    </svg>
  );
};

/* ── ProgressBar ── */
const ProgressBar = ({ value, color = GOLD }: { value: number; color?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.width = "0%";
    setTimeout(() => { el.style.width = `${value}%`; el.style.transition = "width 1.1s cubic-bezier(0.22,1,0.36,1)"; }, 300);
  }, [value]);
  return (
    <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div ref={ref} style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${color},${AMBER})` }} />
    </div>
  );
};

/* ── Skeleton ── */
const Skeleton = ({ h = 14, w = "100%", mb = 12 }: { h?: number; w?: string; mb?: number }) => (
  <div style={{ height: h, width: w, borderRadius: h / 2, marginBottom: mb, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
);

const SkeletonCourseCard = () => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
    <div style={{ height: 80, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    <div style={{ padding: 20 }}>
      <Skeleton h={12} w="40%" mb={8} />
      <Skeleton h={16} w="80%" mb={6} />
      <Skeleton h={12} w="55%" mb={16} />
      <Skeleton h={6} w="100%" mb={12} />
      <Skeleton h={36} w="100%" mb={0} />
    </div>
  </div>
);

type FilterTab = "All" | "In Progress" | "Completed";

const statusBadge = (en: Enrollment) => {
  if (en.completed) return { label: "Completed", color: "#059669", bg: "rgba(5,150,105,0.10)" };
  if (en.progress > 0) return { label: "In Progress", color: GOLD, bg: "rgba(201,136,58,0.10)" };
  return { label: "Not Started", color: "#6b7280", bg: "rgba(107,114,128,0.10)" };
};

export default function LMAMyCoursesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("All");

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/student/my-courses/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setEnrollments(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const filtered = enrollments.filter(en => {
    if (tab === "All") return true;
    if (tab === "Completed") return en.completed;
    if (tab === "In Progress") return !en.completed;
    return true;
  });

  const tabs: FilterTab[] = ["All", "In Progress", "Completed"];

  return (
    <LMAStudentLayout>
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>My Courses</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer", fontFamily: FF,
                background: tab === t ? `linear-gradient(135deg,${AMBER},${GOLD})` : "rgba(0,0,0,0.06)",
                color: tab === t ? "#0a0806" : "#6b7280",
                transition: "all 0.18s ease",
              }}>{t}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {[0, 1, 2, 3, 4, 5].map(i => <SkeletonCourseCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <BookOpen size={48} color="#d1d5db" style={{ marginBottom: 16, display: "block", margin: "0 auto 16px" }} />
            <p style={{ color: "#9ca3af", fontSize: 15, margin: "0 0 20px", fontFamily: FF }}>
              {tab === "All" ? "You haven't enrolled in any courses yet." : `No ${tab.toLowerCase()} courses.`}
            </p>
            <Link to="/lma/student/browse" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg,${AMBER},${GOLD})`,
              color: "#0a0806", fontSize: 13, fontWeight: 700,
              padding: "10px 24px", borderRadius: 10, textDecoration: "none",
            }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {filtered.map((en, i) => {
              const badge = statusBadge(en);
              const headerColor = en.course_header_color ?? GOLD;
              return (
                <Card3D key={en.id} accent={headerColor} p="0"
                  style={{ animation: "lmaPage-in 0.40s ease both", animationDelay: `${i * 80}ms` }}>

                  {/* Gradient header strip */}
                  <div style={{
                    height: 90, background: `linear-gradient(135deg,${headerColor},${AMBER})`,
                    position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-end",
                    padding: "0 20px",
                  }}>
                    <div style={{ position: "absolute", bottom: -28, right: 20 }}>
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircleRing pct={en.progress} size={60} stroke={5} color={headerColor} />
                        <span style={{ position: "absolute", fontSize: 11, fontWeight: 800, color: "#141413", fontFamily: FF }}>
                          {en.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "36px 20px 20px" }}>
                    {/* Level badge */}
                    <span style={{ fontSize: 10, fontWeight: 700, color: headerColor, background: `${headerColor}18`, padding: "3px 9px", borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {en.course_level || "Course"}
                    </span>

                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "10px 0 4px", lineHeight: 1.35, fontFamily: FF }}>
                      {en.course_title}
                    </h3>

                    <div style={{ fontSize: 12, color: "rgba(20,20,19,0.50)", marginBottom: 14, fontFamily: FF }}>
                      <Clock size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />
                      by {en.course_instructor || "Instructor"}
                    </div>

                    <ProgressBar value={en.progress} color={headerColor} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: badge.color, background: badge.bg, padding: "3px 10px", borderRadius: 999 }}>
                        {badge.label}
                      </span>
                      <Link to={`/lma/courses/${en.course}`} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontSize: 12, fontWeight: 700, textDecoration: "none",
                        background: en.completed ? "rgba(5,150,105,0.10)" : `linear-gradient(135deg,${AMBER},${GOLD})`,
                        color: en.completed ? "#059669" : "#0a0806",
                        padding: "7px 14px", borderRadius: 8,
                        border: en.completed ? "1.5px solid rgba(5,150,105,0.25)" : "none",
                      }}>
                        {en.completed ? (
                          <><CheckCircle2 size={12} /> Review</>
                        ) : en.progress === 0 ? (
                          <><Play size={12} fill="#0a0806" /> Start</>
                        ) : (
                          <><Play size={12} fill="#0a0806" /> Continue</>
                        )}
                      </Link>
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
