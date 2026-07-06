import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, TrendingUp, Award } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import LMAStudentLayout from "./LMAStudentLayout";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

interface CourseProgress {
  course_id: number;
  course_title: string;
  progress: number;
  completed: boolean;
  enrolled_at: string;
}
interface TimelinePoint { date: string; lessons: number; }
interface ProgressData {
  stats: { total_courses: number; completed_courses: number; avg_progress: number; certificates: number; };
  courses: CourseProgress[];
  timeline: TimelinePoint[];
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
        padding: p, position: "relative", willChange: "transform",
        ...style,
      }}>
      {children}
    </div>
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

/* ── Count-up stat card ── */
const StatCard = ({ label, value, icon: Icon, color, suffix = "", index }: {
  label: string; value: number; icon: React.ElementType;
  color: string; suffix?: string; index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.5s ease ${index * 90}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`;
    const t = setTimeout(() => {
      el.style.opacity = "1"; el.style.transform = "translateY(0)";
      let s = 0; const step = Math.max(value / 40, 0.1);
      const iv = setInterval(() => { s = Math.min(s + step, value); setCount(Math.round(s)); if (s >= value) clearInterval(iv); }, 40);
    }, 150 + index * 90);
    return () => clearTimeout(t);
  }, [value, index]);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`;
    el.style.transition = "transform 0.10s ease";
  };
  const onLeave = () => { if (ref.current) { ref.current.style.transform = "none"; ref.current.style.transition = "transform 0.28s ease"; } };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      background: "#fff", borderRadius: 16, padding: "22px 20px",
      border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${color}`,
      boxShadow: BCARD, willChange: "transform", cursor: "default",
    }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: "#141413", lineHeight: 1, marginBottom: 4, fontFamily: FF }}>{count}{suffix}</div>
      <div style={{ fontSize: 12.5, color: "rgba(20,20,19,0.50)", fontFamily: FF }}>{label}</div>
    </div>
  );
};

/* ── Skeleton ── */
const SkeletonBox = ({ h = 120 }: { h?: number }) => (
  <div style={{ height: h, borderRadius: 16, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
);

export default function LMAProgressPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token");
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/student/progress/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const stats = data?.stats;
  const courses = data?.courses ?? [];
  const timeline = data?.timeline ?? [];

  return (
    <LMAStudentLayout>
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>
          Progress Report
        </h2>

        {/* ── Stat cards ── */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
            {[0, 1, 2, 3].map(i => <SkeletonBox key={i} h={110} />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard index={0} label="Total Courses"      value={stats?.total_courses ?? 0}     icon={BookOpen}      color="#3b82f6" />
            <StatCard index={1} label="Completed"          value={stats?.completed_courses ?? 0}  icon={CheckCircle2}  color="#10b981" />
            <StatCard index={2} label="Avg Progress"       value={Math.round(stats?.avg_progress ?? 0)} icon={TrendingUp} color={GOLD} suffix="%" />
            <StatCard index={3} label="Certificates"       value={stats?.certificates ?? 0}       icon={Award}         color="#8b5cf6" />
          </div>
        )}

        {/* ── Activity Chart ── */}
        <Card3D accent={GOLD} p="24px" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>
            Learning Activity (Last 30 Days)
          </h3>
          {loading ? (
            <SkeletonBox h={200} />
          ) : timeline.length === 0 ? (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14, fontFamily: FF, flexDirection: "column", gap: 8 }}>
              <TrendingUp size={36} color="#d1d5db" />
              No learning activity in the past 30 days
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={timeline} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="lmaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={GOLD}  stopOpacity={0.25} />
                    <stop offset="95%" stopColor={AMBER} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: FF }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", fontFamily: FF, fontSize: 12 }}
                  labelStyle={{ fontWeight: 700, color: DARK }}
                  itemStyle={{ color: GOLD }}
                  formatter={(v) => [`${v} lessons`, "Completed"]}
                />
                <Area type="monotone" dataKey="lessons" stroke={AMBER} strokeWidth={2.5} fill="url(#lmaAreaGrad)" dot={false} activeDot={{ r: 4, fill: GOLD, stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card3D>

        {/* ── Per-course list ── */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: FF }}>
            Course Progress
          </h3>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[0, 1, 2].map(i => <SkeletonBox key={i} h={88} />)}
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 24px", background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)" }}>
              <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>
                No enrolled courses. Enroll in a course to track your progress.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {courses.map((c, i) => (
                <Card3D key={c.course_id} accent={c.completed ? "#10b981" : GOLD} p="18px 20px"
                  style={{ animation: "lmaPage-in 0.40s ease both", animationDelay: `${i * 80}ms` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", fontFamily: FF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.course_title}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, fontFamily: FF }}>
                        Enrolled {new Date(c.enrolled_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    {c.completed ? (
                      <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.10)", padding: "3px 10px", borderRadius: 999 }}>
                        Completed
                      </span>
                    ) : (
                      <span style={{ flexShrink: 0, fontSize: 15, fontWeight: 900, color: GOLD, fontFamily: FF }}>
                        {c.progress}%
                      </span>
                    )}
                  </div>
                  <ProgressBar value={c.progress} color={c.completed ? "#10b981" : GOLD} />
                </Card3D>
              ))}
            </div>
          )}
        </div>
      </div>
    </LMAStudentLayout>
  );
}
