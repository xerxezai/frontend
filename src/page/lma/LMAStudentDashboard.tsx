import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Search, Play, ClipboardList,
  BarChart2, Award, MessageSquare, User, LogOut, ChevronRight,
  Bell, Menu, X, BookMarked, CheckCircle2,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD = "#C9883A";
const AMBER = "#E8A84E";
const DARK = "#1a1208";

/* ── Stat card with count-up ── */
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
      let start = 0;
      const step = value / 40;
      const iv = setInterval(() => { start = Math.min(start + step, value); setCount(Math.round(start)); if (start >= value) clearInterval(iv); }, 40);
    }, 200 + index * 90);
    return () => clearTimeout(t);
  }, [value, index]);

  const cardRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(700px) rotateX(${(0.5-y)*8}deg) rotateY(${(x-0.5)*8}deg) translateY(-4px)`;
    el.style.transition = "transform 0.10s ease";
  };
  const onLeave = () => {
    const el = cardRef.current; if (!el) return;
    el.style.transform = "none"; el.style.transition = "transform 0.28s ease";
  };

  return (
    <div ref={el => { (ref as React.MutableRefObject<HTMLDivElement | null>).current = el; (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el; }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        background: "#fff", borderRadius: 16, padding: "22px 20px",
        border: "1px solid rgba(0,0,0,0.07)",
        borderTop: `3px solid ${color}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        transformStyle: "preserve-3d", willChange: "transform", cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: "#141413", lineHeight: 1, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 12.5, color: "rgba(20,20,19,0.50)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    </div>
  );
};

/* ── Sidebar item ── */
const SideItem = ({ icon: Icon, label, to, active, badge, onClick }: {
  icon: React.ElementType; label: string; to?: string;
  active?: boolean; badge?: number; onClick?: () => void;
}) => {
  const style: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 16px", borderRadius: 10, cursor: "pointer",
    background: active ? "rgba(201,136,58,0.14)" : "transparent",
    borderLeft: `3px solid ${active ? GOLD : "transparent"}`,
    color: active ? AMBER : "rgba(255,255,255,0.60)",
    fontSize: 13.5, fontWeight: active ? 700 : 500,
    fontFamily: "'DM Sans', sans-serif",
    textDecoration: "none", marginBottom: 2,
    transition: "all 0.18s ease",
  };
  const inner = (
    <>
      <Icon size={16} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? <span style={{ background: GOLD, color: "#0a0806", fontSize: 10, fontWeight: 800, borderRadius: 999, padding: "1px 7px" }}>{badge}</span> : null}
      {active && <ChevronRight size={14} />}
    </>
  );
  if (onClick) return <div style={style} onClick={onClick}>{inner}</div>;
  return <Link to={to ?? "#"} style={style}>{inner}</Link>;
};

/* ── Progress bar ── */
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
  const [sideOpen, setSideOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/student/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const logout = () => {
    ["lma_token","lma_role","lma_can_instructor","lma_name"].forEach(k => localStorage.removeItem(k));
    navigate("/lma/login");
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const sideNav = [
    { section: "LEARN", items: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/lma/student/dashboard" },
      { icon: BookOpen, label: "My Courses", to: "/lma/courses" },
      { icon: Search, label: "Browse Courses", to: "/lma/courses" },
      { icon: Play, label: "Continue Learning", to: "/lma/courses" },
    ]},
    { section: "PROGRESS", items: [
      { icon: ClipboardList, label: "Assignments", to: "#" },
      { icon: BarChart2, label: "Progress Report", to: "#" },
      { icon: Award, label: "Certificates", to: "#" },
    ]},
    { section: "ACCOUNT", items: [
      { icon: MessageSquare, label: "Messages", to: "#", badge: 0 },
      { icon: User, label: "Profile", to: "#" },
    ]},
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f2ef", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, background: DARK, flexShrink: 0,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, height: "100vh",
        zIndex: 200, transition: "transform 0.30s cubic-bezier(0.22,1,0.36,1)",
        transform: sideOpen || window.innerWidth >= 1024 ? "none" : "translateX(-100%)",
        overflowY: "auto",
      }}>
        <div style={{ padding: "24px 16px 16px" }}>
          <Link to="/">
            <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 36, width: "auto" }} />
          </Link>
          <div style={{ marginTop: 8, fontSize: 10, color: AMBER, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Academy · Student
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {sideNav.map(({ section, items }) => (
            <div key={section}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 4px 6px" }}>{section}</div>
              {items.map(it => (
                <SideItem key={it.label} {...it} active={active === it.label} onClick={() => setActive(it.label)} />
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 12px 24px" }}>
          <SideItem icon={LogOut} label="Logout" onClick={logout} />
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, marginLeft: window.innerWidth >= 1024 ? 240 : 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Header */}
        <header style={{
          background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "0 28px", height: 64,
          display: "flex", alignItems: "center", gap: 16,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button onClick={() => setSideOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#141413" }} className="d-lg-none">
            {sideOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#141413" }}>
              {greeting}, <span style={{ color: GOLD }}>{name.split(" ")[0]}</span>! 👋
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f4f2ef", borderRadius: 10, padding: "8px 14px", maxWidth: 240 }} className="d-none d-md-flex">
            <Search size={14} color="#9ca3af" />
            <span style={{ fontSize: 13, color: "#9ca3af" }}>Search courses...</span>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#6b7280", position: "relative" }}>
            <Bell size={20} />
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0a0806", fontWeight: 800, fontSize: 14, cursor: "pointer",
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Body */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>

          {/* Welcome banner */}
          <div style={{
            background: `linear-gradient(135deg,${DARK} 0%,#100c07 100%)`,
            borderRadius: 20, padding: "28px 32px", marginBottom: 24,
            position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}>
            <div style={{ position: "absolute", top: -40, right: 80, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                Continue where you left off
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
                {data?.enrollments?.[0]?.course_title ?? "Full Stack AI Development"}
              </h2>
              <div style={{ marginBottom: 12, maxWidth: 260 }}>
                <ProgressBar value={data?.enrollments?.[0]?.progress ?? 32} />
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 5 }}>
                  {data?.enrollments?.[0]?.progress ?? 32}% complete
                </div>
              </div>
              <Link to="/lma/courses" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
                color: "#0a0806", fontSize: 13, fontWeight: 700,
                padding: "9px 20px", borderRadius: 9, textDecoration: "none",
                boxShadow: "0 4px 0 rgba(140,80,20,0.40)",
              }}>
                <Play size={14} /> Resume Learning
              </Link>
            </div>
            <div style={{
              width: 90, height: 90, borderRadius: "50%", flexShrink: 0,
              border: "6px solid rgba(201,136,58,0.20)",
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1,
            }}>
              <svg width="90" height="90" style={{ position: "absolute", top: -6, left: -6 }}>
                <circle cx="45" cy="45" r="39" fill="none" stroke="rgba(201,136,58,0.15)" strokeWidth="6" />
                <circle cx="45" cy="45" r="39" fill="none" stroke={GOLD} strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 39}`}
                  strokeDashoffset={`${2 * Math.PI * 39 * (1 - (data?.enrollments?.[0]?.progress ?? 32) / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 45 45)"
                  style={{ transition: "stroke-dashoffset 1.2s ease" }} />
              </svg>
              <span style={{ fontSize: 18, fontWeight: 900, color: AMBER }}>{data?.enrollments?.[0]?.progress ?? 32}%</span>
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ width: 32, height: 32, border: `3px solid rgba(201,136,58,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lma-spin 0.8s linear infinite", display: "inline-block" }} />
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard index={0} label="Courses Enrolled" value={data?.stats?.enrolled ?? 0} icon={BookMarked} color="#3b82f6" />
                <StatCard index={1} label="Courses Completed" value={data?.stats?.completed ?? 0} icon={CheckCircle2} color="#10b981" />
                <StatCard index={2} label="Assignments Pending" value={data?.stats?.pending_assignments ?? 0} icon={ClipboardList} color={GOLD} />
                <StatCard index={3} label="Certificates Earned" value={data?.stats?.certificates ?? 0} icon={Award} color="#8b5cf6" />
              </div>

              {/* My Courses */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", marginBottom: 16 }}>My Courses</h3>
                {data?.enrollments?.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 16, padding: "40px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <BookOpen size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
                    <p style={{ color: "#9ca3af", fontSize: 14 }}>No courses yet. <Link to="/lma/courses" style={{ color: GOLD }}>Browse courses →</Link></p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                    {(data?.enrollments ?? []).map((en: any) => (
                      <div key={en.id} style={{
                        background: "#fff", borderRadius: 16, overflow: "hidden",
                        border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}>
                        <div style={{ height: 6, background: en.course_header_color === "blue" ? "#3b82f6" : `linear-gradient(90deg,${AMBER},${GOLD})` }} />
                        <div style={{ padding: "18px 20px" }}>
                          <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                            {en.course_level}
                          </div>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#141413", margin: "0 0 10px", lineHeight: 1.3 }}>{en.course_title}</h4>
                          <div style={{ fontSize: 12, color: "rgba(20,20,19,0.45)", marginBottom: 12 }}>By {en.course_instructor}</div>
                          <ProgressBar value={en.progress} />
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                            <span style={{ fontSize: 11, color: "rgba(20,20,19,0.45)" }}>{en.progress}% complete</span>
                            <span style={{
                              fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "2px 8px",
                              background: en.completed ? "#d1fae5" : "rgba(201,136,58,0.10)",
                              color: en.completed ? "#059669" : GOLD,
                            }}>
                              {en.completed ? "✓ Completed" : "In Progress"}
                            </span>
                          </div>
                          <Link to="/lma/courses" style={{
                            display: "block", textAlign: "center", marginTop: 14,
                            background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
                            color: "#0a0806", fontSize: 13, fontWeight: 700,
                            padding: "9px", borderRadius: 9, textDecoration: "none",
                          }}>
                            {en.progress === 0 ? "Start" : "Continue"} →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignments */}
              {data?.pending_assignments?.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", marginBottom: 16 }}>Pending Assignments</h3>
                  <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          {["Assignment","Course","Due Date","Action"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.pending_assignments.map((a: any) => {
                          const due = new Date(a.due_date);
                          const overdue = due < new Date();
                          return (
                            <tr key={a.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                              <td style={{ padding: "12px 16px", fontSize: 13, color: "#141413", fontWeight: 600 }}>{a.title}</td>
                              <td style={{ padding: "12px 16px", fontSize: 13, color: "rgba(20,20,19,0.55)" }}>{a.course_title}</td>
                              <td style={{ padding: "12px 16px" }}>
                                <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: overdue ? "#fee2e2" : "rgba(201,136,58,0.10)", color: overdue ? "#dc2626" : GOLD }}>
                                  {due.toLocaleDateString()}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <button style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: "rgba(201,136,58,0.08)", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}>
                                  Submit
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Certificates */}
              {data?.certificates?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", marginBottom: 16 }}>Certificates</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                    {data.certificates.map((c: any) => (
                      <div key={c.id} style={{
                        background: "#fff", borderRadius: 16, padding: "20px",
                        border: `1px solid rgba(201,136,58,0.30)`,
                        boxShadow: `0 4px 0 rgba(201,136,58,0.15), 0 8px 24px rgba(201,136,58,0.10)`,
                      }}>
                        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#fef3c7,#fde68a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Award size={22} color="#d97706" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", marginBottom: 4 }}>{c.course_title}</div>
                            <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginBottom: 12 }}>Issued {new Date(c.issued_at).toLocaleDateString()}</div>
                            <button style={{ fontSize: 12, fontWeight: 700, color: "#d97706", background: "#fef3c7", border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer" }}>
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style>{`
        @keyframes lma-spin { to { transform: rotate(360deg); } }
        @media (min-width:1024px) { aside { transform: none !important; } main-wrapper { margin-left: 240px; } }
      `}</style>
    </div>
  );
}
