import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Play, BookOpen, Search, TrendingUp } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
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

const levelColor = (level: string) => {
  const l = (level ?? "").toLowerCase();
  if (l.includes("beginner"))     return { color: "#059669", bg: "rgba(5,150,105,0.12)" };
  if (l.includes("intermediate")) return { color: "#3b82f6", bg: "rgba(59,130,246,0.12)" };
  if (l.includes("advanced"))     return { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" };
  return { color: GOLD, bg: "rgba(201,136,58,0.12)" };
};

const ProgressBar = ({ value, color = GOLD }: { value: number; color?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.width = "0%";
    setTimeout(() => { el.style.width = `${value}%`; el.style.transition = "width 1.1s cubic-bezier(0.22,1,0.36,1)"; }, 200);
  }, [value]);
  return (
    <div style={{ height: 5, borderRadius: 3, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div ref={ref} style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${color},${AMBER})` }} />
    </div>
  );
};

const SkeletonCard = ({ h = 180 }: { h?: number }) => (
  <div style={{ height: h, borderRadius: 16, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
);

export default function LMAContinueLearningPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/student/my-courses/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setEnrollments(Array.isArray(d) ? d : []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const inProgress = enrollments.filter(e => !e.completed);
  const completed  = enrollments.filter(e => e.completed);
  const hero       = inProgress[0] ?? null;
  const rest       = inProgress.slice(1);

  return (
    <LMAStudentLayout>
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: "0 0 22px", fontFamily: FF }}>
          Continue Learning
        </h2>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SkeletonCard h={220} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {[0, 1].map(i => <SkeletonCard key={i} h={130} />)}
            </div>
          </div>
        ) : enrollments.length === 0 ? (

          /* ── Empty state ── */
          <div style={{
            textAlign: "center", padding: "72px 24px",
            background: "#fff", borderRadius: 20,
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: BCARD,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: `linear-gradient(135deg,${AMBER}22,${GOLD}18)`,
              border: `2px solid rgba(201,136,58,0.20)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <BookOpen size={36} color={GOLD} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#141413", margin: "0 0 10px", fontFamily: FF }}>
              No courses in progress
            </h3>
            <p style={{ fontSize: 14, color: "rgba(20,20,19,0.50)", margin: "0 0 28px", maxWidth: 340, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6, fontFamily: FF }}>
              You haven't enrolled in any courses yet. Browse our catalog and start your learning journey.
            </p>
            <Link to="/lma/student/browse" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg,${AMBER},${GOLD})`,
              color: "#0a0806", fontSize: 14, fontWeight: 700,
              padding: "13px 28px", borderRadius: 12, textDecoration: "none",
              boxShadow: `0 4px 0 rgba(140,80,20,0.35), 0 8px 24px rgba(201,136,58,0.24)`,
            }}>
              <Search size={16} /> Browse Courses
            </Link>
          </div>

        ) : (
          <>
            {/* ── Hero: last in-progress course ── */}
            {hero && (
              <div
                onMouseEnter={() => setHovered(-1)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "#fff", borderRadius: 20, overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${GOLD}`,
                  boxShadow: hovered === -1 ? BHOV : BCARD,
                  transition: "box-shadow 0.28s ease",
                  marginBottom: 28,
                }}
              >
                {/* Color header */}
                <div style={{
                  height: 8,
                  background: `linear-gradient(90deg,${GOLD},${AMBER})`,
                }} />

                <div style={{ padding: "28px 32px 32px", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>
                  {/* Course icon */}
                  <div style={{
                    width: 72, height: 72, borderRadius: 16, flexShrink: 0,
                    background: `linear-gradient(135deg,${DARK},#2d1c0a)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.20)",
                  }}>
                    <BookOpen size={30} color={AMBER} />
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, background: "rgba(201,136,58,0.10)", padding: "3px 10px", borderRadius: 999, letterSpacing: "0.06em" }}>
                        IN PROGRESS
                      </span>
                      {(() => { const lc = levelColor(hero.course_level); return (
                        <span style={{ fontSize: 10, fontWeight: 700, color: lc.color, background: lc.bg, padding: "3px 10px", borderRadius: 999 }}>
                          {hero.course_level}
                        </span>
                      ); })()}
                    </div>

                    <h3 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: "0 0 6px", fontFamily: FF, lineHeight: 1.2 }}>
                      {hero.course_title}
                    </h3>
                    <p style={{ fontSize: 13, color: "rgba(20,20,19,0.50)", margin: "0 0 16px", fontFamily: FF }}>
                      by {hero.course_instructor}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <ProgressBar value={hero.progress} />
                      <span style={{ fontSize: 14, fontWeight: 900, color: GOLD, flexShrink: 0, fontFamily: FF }}>
                        {hero.progress}%
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(20,20,19,0.40)", margin: "0 0 20px", fontFamily: FF }}>
                      {hero.progress === 0 ? "Not started yet" : `${hero.progress}% complete`}
                    </p>

                    <button
                      onClick={() => navigate(`/lma/courses/${hero.course}`)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                        color: "#0a0806", fontSize: 14, fontWeight: 800,
                        padding: "13px 28px", borderRadius: 12, border: "none",
                        cursor: "pointer", fontFamily: FF,
                        boxShadow: `0 4px 0 rgba(140,80,20,0.35), 0 8px 24px rgba(201,136,58,0.24)`,
                        transition: "transform 0.15s ease",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
                    >
                      <Play size={15} fill="#0a0806" />
                      {hero.progress === 0 ? "Start Course" : "Continue Learning"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Other in-progress courses ── */}
            {rest.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(20,20,19,0.55)", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 14px", fontFamily: FF }}>
                  Also In Progress
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
                  {rest.map((e, i) => (
                    <div
                      key={e.id}
                      onClick={() => navigate(`/lma/courses/${e.course}`)}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        background: "#fff", borderRadius: 14, padding: "18px 20px",
                        border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${GOLD}`,
                        boxShadow: hovered === i ? BHOV : BCARD,
                        cursor: "pointer", transition: "box-shadow 0.22s ease",
                        animation: "lmaPage-in 0.40s ease both",
                        animationDelay: `${i * 80}ms`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", fontFamily: FF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {e.course_title}
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 3, fontFamily: FF }}>
                            by {e.course_instructor}
                          </div>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 900, color: GOLD, flexShrink: 0, fontFamily: FF }}>
                          {e.progress}%
                        </span>
                      </div>
                      <ProgressBar value={e.progress} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Completed courses ── */}
            {completed.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(20,20,19,0.55)", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 14px", fontFamily: FF }}>
                  Completed
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {completed.map(e => (
                    <div key={e.id} style={{
                      background: "#fff", borderRadius: 12, padding: "14px 20px",
                      border: "1px solid rgba(0,0,0,0.07)", borderLeft: "3px solid #10b981",
                      display: "flex", alignItems: "center", gap: 14,
                    }}>
                      <TrendingUp size={18} color="#10b981" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", fontFamily: FF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.course_title}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 2, fontFamily: FF }}>
                          by {e.course_instructor}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.10)", padding: "3px 10px", borderRadius: 999, flexShrink: 0 }}>
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Browse more ── */}
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <Link to="/lma/student/browse" style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 13, fontWeight: 600, color: GOLD, textDecoration: "none",
                padding: "9px 20px", borderRadius: 10,
                border: "1.5px solid rgba(201,136,58,0.35)",
                background: "rgba(201,136,58,0.06)",
                transition: "all 0.18s ease",
              }}>
                <Search size={14} /> Discover More Courses
              </Link>
            </div>
          </>
        )}
      </div>
    </LMAStudentLayout>
  );
}
