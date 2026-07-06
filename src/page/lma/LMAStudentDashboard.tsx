import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen, Play,
  Award, ChevronRight,
  BookMarked, CheckCircle2,
  ClipboardList, Star, Clock,
} from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const FF    = "'DM Sans', sans-serif";

/* ── Circular SVG progress ring ── */
const CircleRing = ({ pct, size = 72, stroke = 5, color = GOLD }: {
  pct: number; size?: number; stroke?: number; color?: string;
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (pct / 100) * circ), 300);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        strokeLinecap="round" />
    </svg>
  );
};

/* ── Skeleton shimmer card ── */
const SkeletonCard = ({ h = 120 }: { h?: number }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid rgba(0,0,0,0.07)", height: h, overflow: "hidden", position: "relative" }}>
    <div style={{ height: 14, borderRadius: 7, width: "55%", marginBottom: 12, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    <div style={{ height: 10, borderRadius: 5, width: "80%", marginBottom: 8, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    <div style={{ height: 10, borderRadius: 5, width: "40%", background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
  </div>
);

/* ── Stat card with count-up + 3D tilt ── */
const StatCard = ({ label, value, icon: Icon, color, suffix = "", index }: {
  label: string; value: number; icon: React.ElementType;
  color: string; suffix?: string; index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.55s ease ${index * 90}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`;
    const t = setTimeout(() => {
      el.style.opacity = "1"; el.style.transform = "translateY(0)";
      let s = 0; const step = value / 40;
      const iv = setInterval(() => { s = Math.min(s + step, value); setCount(Math.round(s)); if (s >= value) clearInterval(iv); }, 40);
    }, 200 + index * 90);
    return () => clearTimeout(t);
  }, [value, index]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`;
    el.style.transition = "transform 0.10s ease";
  };
  const onLeave = () => {
    if (ref.current) { ref.current.style.transform = "none"; ref.current.style.transition = "transform 0.28s ease"; }
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      background: "#fff", borderRadius: 16, padding: "22px 20px",
      border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${color}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transformStyle: "preserve-3d",
      willChange: "transform", cursor: "default",
    }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: "#141413", lineHeight: 1, marginBottom: 4, fontFamily: FF }}>{count}{suffix}</div>
      <div style={{ fontSize: 12.5, color: "rgba(20,20,19,0.50)", fontFamily: FF }}>{label}</div>
    </div>
  );
};

/* ── Animated progress bar ── */
const ProgressBar = ({ value, color = GOLD }: { value: number; color?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.width = "0%";
    setTimeout(() => { el.style.width = `${value}%`; el.style.transition = "width 1.2s cubic-bezier(0.22,1,0.36,1)"; }, 400);
  }, [value]);
  return (
    <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div ref={ref} style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${color},${AMBER})`, boxShadow: `0 0 8px ${color}55` }} />
    </div>
  );
};

export default function LMAStudentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("lma_name") ?? "Student";
  const token = localStorage.getItem("lma_token");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/student/dashboard/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, [token, navigate]);

  const firstEnrollment = data?.enrollments?.[0];

  return (
    <LMAStudentLayout pendingBadge={data?.stats?.pending_assignments}>
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>

        {/* ── Welcome Banner ── */}
        <div style={{
          background: `linear-gradient(135deg,${DARK} 0%,#100c07 100%)`,
          borderRadius: 20, padding: "28px 32px", marginBottom: 24,
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
        }}>
          <div style={{ position: "absolute", top: -40, right: 100, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 60, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 10, color: AMBER, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Continue where you left off</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", maxWidth: 340 }}>
              {firstEnrollment?.course_title ?? (loading ? "Loading…" : "Browse courses to get started")}
            </h2>
            <div style={{ marginBottom: 14, maxWidth: 280 }}>
              <ProgressBar value={firstEnrollment?.progress ?? 0} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", marginTop: 5 }}>
                {firstEnrollment?.progress ?? 0}% complete
              </div>
            </div>
            {firstEnrollment ? (
              <Link to={`/lma/courses/${firstEnrollment?.course ?? 1}`} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                color: "#0a0806", fontSize: 13, fontWeight: 700,
                padding: "9px 20px", borderRadius: 9, textDecoration: "none",
                boxShadow: "0 4px 0 rgba(140,80,20,0.40)",
              }}>
                <Play size={14} fill="#0a0806" /> Resume Learning
              </Link>
            ) : (
              <Link to="/lma/student/browse" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                color: "#0a0806", fontSize: 13, fontWeight: 700,
                padding: "9px 20px", borderRadius: 9, textDecoration: "none",
                boxShadow: "0 4px 0 rgba(140,80,20,0.40)",
              }}>
                <BookOpen size={14} /> Browse Courses
              </Link>
            )}
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CircleRing pct={firstEnrollment?.progress ?? 0} size={88} stroke={6} />
            <span style={{ position: "absolute", fontSize: 18, fontWeight: 900, color: AMBER, fontFamily: FF }}>
              {firstEnrollment?.progress ?? 0}%
            </span>
          </div>
        </div>

        {/* ── Stat Cards / Skeleton ── */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
            {[0, 1, 2, 3].map(i => <SkeletonCard key={i} h={110} />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard index={0} label="Courses Enrolled"     value={data?.stats?.enrolled ?? 0}             icon={BookMarked}   color="#3b82f6" />
            <StatCard index={1} label="Courses Completed"    value={data?.stats?.completed ?? 0}            icon={CheckCircle2} color="#10b981" />
            <StatCard index={2} label="Assignments Pending"  value={data?.stats?.pending_assignments ?? 0}  icon={ClipboardList} color={GOLD} />
            <StatCard index={3} label="Certificates Earned"  value={data?.stats?.certificates ?? 0}         icon={Award}        color="#8b5cf6" />
          </div>
        )}

        {/* ── My Courses ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: 0, fontFamily: FF }}>My Courses</h3>
            <Link to="/lma/student/courses" style={{ fontSize: 12, fontWeight: 700, color: GOLD, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Browse all <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {[0, 1, 2].map(i => <SkeletonCard key={i} h={200} />)}
            </div>
          ) : data?.enrollments?.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "48px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
              <BookOpen size={40} color="#d1d5db" style={{ marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
              <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
                No courses yet.{" "}
                <Link to="/lma/student/browse" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Browse courses →</Link>
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {(data?.enrollments ?? []).map((en: any, i: number) => (
                <div key={en.id} style={{
                  background: "#fff", borderRadius: 16, overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease",
                  animation: "lmaPage-in 0.40s ease both",
                  animationDelay: `${i * 80}ms`,
                }}>
                  <div style={{ height: 4, background: `linear-gradient(90deg,${AMBER},${GOLD})` }} />
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>{en.course_level ?? "Course"}</div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#141413", margin: 0, lineHeight: 1.35, fontFamily: FF }}>{en.course_title}</h4>
                      </div>
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CircleRing pct={en.progress ?? 0} size={52} stroke={4} />
                        <span style={{ position: "absolute", fontSize: 10, fontWeight: 800, color: en.progress >= 100 ? "#059669" : "#141413", fontFamily: FF }}>
                          {en.progress ?? 0}%
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginBottom: 12 }}>
                      <Clock size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />
                      {en.completed ? "Completed" : `${en.progress ?? 0}% done`}
                      {en.course_instructor && <> · by {en.course_instructor}</>}
                    </div>

                    <ProgressBar value={en.progress ?? 0} />

                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                      <Link to={`/lma/courses/${en.course ?? en.course_id ?? 1}`} style={{
                        flex: 1, textAlign: "center", display: "block",
                        background: en.completed
                          ? "rgba(5,150,105,0.10)"
                          : `linear-gradient(135deg,${AMBER},${GOLD})`,
                        color: en.completed ? "#059669" : "#0a0806",
                        fontSize: 12, fontWeight: 700,
                        padding: "8px", borderRadius: 8, textDecoration: "none",
                        border: en.completed ? "1.5px solid rgba(5,150,105,0.25)" : "none",
                      }}>
                        {en.completed ? "✓ Review" : en.progress === 0 ? "Start →" : "Continue →"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Two column: Assignments + Certificates ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}
          className="lmad-2col">

          {/* Assignments */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", marginBottom: 14, fontFamily: FF }}>Pending Assignments</h3>
            {loading ? (
              <SkeletonCard h={180} />
            ) : (data?.pending_assignments ?? []).length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "28px 20px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                <CheckCircle2 size={28} color="#d1d5db" style={{ marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, fontFamily: FF }}>All caught up!</p>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                {(data.pending_assignments ?? []).map((a: any, i: number) => {
                  const due = new Date(a.due_date);
                  const overdue = due < new Date();
                  return (
                    <div key={a.id} style={{
                      padding: "14px 18px",
                      borderBottom: i < (data.pending_assignments.length - 1) ? "1px solid rgba(0,0,0,0.05)" : "none",
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: overdue ? "#fee2e2" : "rgba(201,136,58,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ClipboardList size={15} color={overdue ? "#dc2626" : GOLD} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#141413", fontFamily: FF }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 2, fontFamily: FF }}>{a.course_title}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: overdue ? "#fee2e2" : "rgba(201,136,58,0.10)", color: overdue ? "#dc2626" : GOLD, whiteSpace: "nowrap", alignSelf: "center" }}>
                        {due.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Certificates */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", marginBottom: 14, fontFamily: FF }}>Certificates</h3>
            {loading ? (
              <SkeletonCard h={180} />
            ) : (data?.certificates ?? []).length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "28px 20px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                <Award size={28} color="#d1d5db" style={{ marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, fontFamily: FF }}>Complete a course to earn a certificate.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(data.certificates ?? []).map((c: any) => (
                  <div key={c.id} style={{
                    background: "#fff", borderRadius: 14, padding: "16px 18px",
                    border: "1px solid rgba(201,136,58,0.25)",
                    boxShadow: "0 2px 0 rgba(201,136,58,0.12), 0 6px 20px rgba(201,136,58,0.08)",
                    display: "flex", gap: 14, alignItems: "center",
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#fef3c7,#fde68a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Award size={20} color="#d97706" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FF }}>{c.course_title}</div>
                      <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 2, fontFamily: FF }}>
                        <Star size={9} color="#d97706" fill="#d97706" style={{ verticalAlign: "middle", marginRight: 3 }} />
                        Issued {new Date(c.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <button style={{ fontSize: 11, fontWeight: 700, color: "#d97706", background: "#fef3c7", border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", flexShrink: 0, fontFamily: FF }}>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width:640px) {
            .lmad-2col { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Use name to suppress unused warning */}
        <span style={{ display: "none" }}>{name}</span>
      </div>
    </LMAStudentLayout>
  );
}
