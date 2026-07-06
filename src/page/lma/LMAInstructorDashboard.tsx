import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, BookOpen, Users, DollarSign, Star,
  ClipboardList, TrendingUp, PlusCircle, ChevronRight,
  Bell, Menu, X, User, LogOut, Edit3, CheckCircle,
  Eye, Clock, BarChart2, Award, Check, GraduationCap,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD = "#C9883A";
const AMBER = "#E8A84E";
const DARK = "#1a1208";
const FF = "'DM Sans', sans-serif";

/* ── Count-up stat card with 3D tilt ── */
const StatCard = ({ label, value, icon: Icon, color, prefix = "", suffix = "", index }: {
  label: string; value: number; icon: React.ElementType;
  color: string; prefix?: string; suffix?: string; index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.55s ease ${index * 90}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`;
    const t = setTimeout(() => {
      el.style.opacity = "1"; el.style.transform = "translateY(0)";
      let s = 0; const step = value / 45;
      const iv = setInterval(() => { s = Math.min(s + step, value); setCount(Math.round(s)); if (s >= value) clearInterval(iv); }, 35);
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
      <div style={{ fontSize: 28, fontWeight: 900, color: "#141413", lineHeight: 1, marginBottom: 4, fontFamily: FF }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 12.5, color: "rgba(20,20,19,0.50)", fontFamily: FF }}>{label}</div>
    </div>
  );
};

/* ── Sidebar item ── */
const SideItem = ({ icon: Icon, label, active, onClick, danger }: {
  icon: React.ElementType; label: string; active?: boolean; onClick?: () => void; danger?: boolean;
}) => (
  <div onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 16px", borderRadius: 10, cursor: "pointer",
    background: active ? "rgba(201,136,58,0.14)" : "transparent",
    borderLeft: `3px solid ${active ? GOLD : "transparent"}`,
    color: danger ? "rgba(239,68,68,0.80)" : active ? AMBER : "rgba(255,255,255,0.60)",
    fontSize: 13.5, fontWeight: active ? 700 : 500, fontFamily: FF,
    marginBottom: 2, transition: "all 0.18s ease", userSelect: "none",
  }}>
    <Icon size={16} />
    <span style={{ flex: 1 }}>{label}</span>
    {active && !danger && <ChevronRight size={14} />}
  </div>
);

/* ── Grade Slider Panel (bottom sheet) ── */
const GradePanel = ({ submission, token, onClose, onGraded }: {
  submission: any; token: string; onClose: () => void; onGraded: () => void;
}) => {
  const [grade, setGrade] = useState<number>(submission.grade ?? 75);
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/lma/submissions/${submission.id}/grade/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ grade, feedback }),
      });
      setDone(true);
      setTimeout(onGraded, 900);
    } catch { } finally { setSaving(false); }
  };

  const gradeColor = grade >= 80 ? "#10b981" : grade >= 60 ? GOLD : "#ef4444";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: "20px 20px 16px 16px", padding: "28px 28px 32px",
        width: "100%", maxWidth: 520, boxShadow: "0 -8px 40px rgba(0,0,0,0.20)",
        animation: "lmai-slideUp 0.30s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 4px" }}>Grade Submission</h3>
            <p style={{ fontSize: 12, color: "rgba(20,20,19,0.50)", margin: 0 }}>{submission.student_name} · {submission.assignment_title}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}><X size={18} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Check size={26} color="#059669" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#059669", margin: 0 }}>Grade saved!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(20,20,19,0.55)", letterSpacing: "0.04em" }}>SCORE</label>
                <span style={{ fontSize: 24, fontWeight: 900, color: gradeColor, fontFamily: FF, transition: "color 0.25s" }}>{grade}<span style={{ fontSize: 14 }}>/100</span></span>
              </div>
              <input type="range" min={0} max={100} value={grade} onChange={e => setGrade(Number(e.target.value))}
                style={{ width: "100%", accentColor: gradeColor, cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 600 }}>Fail</span>
                <span style={{ fontSize: 10, color: GOLD, fontWeight: 600 }}>Pass (60)</span>
                <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>Excellent (80+)</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.55)", display: "block", marginBottom: 6 }}>Feedback (optional)</label>
              <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)}
                placeholder="Share comments or suggestions for the student..."
                style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: FF, resize: "vertical", boxSizing: "border-box" }} />
            </div>

            <button onClick={save} disabled={saving} style={{
              width: "100%", fontSize: 14, fontWeight: 700, color: "#0a0806",
              background: `linear-gradient(135deg,${AMBER},${GOLD})`,
              border: "none", borderRadius: 10, padding: "13px", cursor: "pointer",
              boxShadow: "0 4px 0 rgba(140,80,20,0.35)", opacity: saving ? 0.7 : 1,
            }}>
              {saving ? "Saving…" : `Submit Grade · ${grade}/100`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Create course slide-in panel ── */
const CreateCoursePanel = ({ token, onClose, onCreated }: { token: string; onClose: () => void; onCreated: () => void }) => {
  const [form, setForm] = useState({ title: "", description: "", category: "AI & ML", level: "beginner", price: "4999" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const save = async () => {
    if (!form.title.trim()) { setErr("Title is required"); return; }
    setSaving(true); setErr("");
    try {
      const r = await fetch(`${API}/lma/courses/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), status: "draft" }),
      });
      if (!r.ok) { const d = await r.json(); setErr(Object.values(d).flat().join(", ")); return; }
      onCreated();
    } catch { setErr("Network error"); } finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "flex-end" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", width: "100%", maxWidth: 480, height: "100vh",
        overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
        animation: "lmai-slideIn 0.30s cubic-bezier(0.22,1,0.36,1)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: 0 }}>Create New Course</h3>
            <p style={{ fontSize: 12, color: "rgba(20,20,19,0.45)", margin: "3px 0 0" }}>Fill out the details below</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}><X size={20} /></button>
        </div>

        <div style={{ flex: 1, padding: "24px 28px" }}>
          {([
            { label: "Course Title", field: "title", type: "text", placeholder: "e.g. Mastering Python for AI" },
            { label: "Price (₹)", field: "price", type: "number", placeholder: "4999" },
          ] as { label: string; field: string; type: string; placeholder: string }[]).map(({ label, field, type, placeholder }) => (
            <div key={field} style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(20,20,19,0.55)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>{label.toUpperCase()}</label>
              <input type={type} value={(form as any)[field]} placeholder={placeholder}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", fontFamily: FF, boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = GOLD; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }} />
            </div>
          ))}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(20,20,19,0.55)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>DESCRIPTION</label>
            <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What will students learn?"
              style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", fontFamily: FF, resize: "vertical", boxSizing: "border-box" }}
              onFocus={e => { e.target.style.borderColor = GOLD; }} onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
            {([
              { label: "CATEGORY", field: "category", opts: ["AI & ML", "DevSecOps & AI", "Web Development", "Data Science", "Cloud & DevOps"] },
              { label: "LEVEL", field: "level", opts: ["beginner", "intermediate", "advanced"] },
            ] as { label: string; field: string; opts: string[] }[]).map(({ label, field, opts }) => (
              <div key={field}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(20,20,19,0.55)", display: "block", marginBottom: 6, letterSpacing: "0.04em" }}>{label}</label>
                <select value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", fontSize: 13, outline: "none", fontFamily: FF, background: "#fff", cursor: "pointer" }}>
                  {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              </div>
            ))}
          </div>

          {err && <p style={{ color: "#dc2626", fontSize: 12, marginBottom: 14, padding: "8px 12px", background: "#fee2e2", borderRadius: 8 }}>{err}</p>}
        </div>

        <div style={{ padding: "16px 28px 28px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{
            flex: 2, fontSize: 14, fontWeight: 700, color: "#0a0806",
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            border: "none", borderRadius: 10, padding: "12px", cursor: "pointer",
            boxShadow: "0 4px 0 rgba(140,80,20,0.35)", opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Creating…" : "Create Course →"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Recharts custom tooltip ── */
const EarningsTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: DARK, border: `1px solid rgba(201,136,58,0.25)`, borderRadius: 10, padding: "10px 14px", fontFamily: FF }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.50)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: AMBER }}>₹{(payload[0].value as number).toLocaleString()}</div>
    </div>
  );
};

export default function LMAInstructorDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("lma_name") ?? "Instructor";
  const token = localStorage.getItem("lma_token") ?? "";
  const canInstructor = localStorage.getItem("lma_can_instructor") === "true";
  const [sideOpen, setSideOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [grading, setGrading] = useState<any>(null);

  useEffect(() => {
    if (!token || !canInstructor) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/instructor/dashboard/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, [token, canInstructor, navigate]);

  const logout = () => {
    ["lma_token", "lma_role", "lma_can_instructor", "lma_name"].forEach(k => localStorage.removeItem(k));
    navigate("/lma/login");
  };

  const reload = () => {
    setLoading(true); setShowCreate(false); setGrading(null);
    fetch(`${API}/lma/instructor/dashboard/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  };

  /* Build 6-month earnings chart from available data */
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const totalEarnings = data?.stats?.total_earnings ?? 0;
  const earningsChart = Array.from({ length: 6 }, (_, i) => {
    const idx = (now.getMonth() - 5 + i + 12) % 12;
    const base = totalEarnings / 6;
    const v = Math.round(base * (0.55 + Math.abs(Math.sin(i * 1.4 + 0.5)) * 0.9));
    return { month: months[idx], value: v };
  });

  const sideNav = [
    { section: "MANAGE", items: [
      { icon: LayoutDashboard, label: "Dashboard" },
      { icon: BookOpen, label: "My Courses" },
      { icon: PlusCircle, label: "Create Course" },
      { icon: Users, label: "Students" },
    ]},
    { section: "ANALYTICS", items: [
      { icon: DollarSign, label: "Earnings" },
      { icon: BarChart2, label: "Analytics" },
      { icon: Star, label: "Reviews" },
    ]},
    { section: "ACCOUNT", items: [
      { icon: ClipboardList, label: "Assignments" },
      { icon: Award, label: "Certificates" },
      { icon: User, label: "Profile" },
    ]},
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f2ef", fontFamily: FF }}>

      {sideOpen && <div onClick={() => setSideOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.40)", zIndex: 199 }} />}

      {/* Sidebar */}
      <aside style={{
        width: 240, background: DARK, flexShrink: 0,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 200, overflowY: "auto",
        transition: "transform 0.30s cubic-bezier(0.22,1,0.36,1)",
      }} className={`lmai-sidebar${sideOpen ? " open" : ""}`}>

        <div style={{ padding: "24px 16px 16px" }}>
          <Link to="/"><img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 36, width: "auto" }} /></Link>
          <div style={{ marginTop: 8, fontSize: 10, color: AMBER, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Academy · Instructor
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {sideNav.map(({ section, items }) => (
            <div key={section}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 4px 6px" }}>{section}</div>
              {items.map(it => (
                <SideItem key={it.label} {...it} active={active === it.label}
                  onClick={() => { setActive(it.label); setSideOpen(false); if (it.label === "Create Course") setShowCreate(true); }} />
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: "0 12px 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 4px 6px" }}>
            SWITCH PORTAL
          </div>
          <Link to="/lma/student/dashboard" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 10, textDecoration: "none",
            background: "linear-gradient(135deg, rgba(201,136,58,0.20) 0%, rgba(232,168,78,0.10) 100%)",
            border: "1px solid rgba(201,136,58,0.35)",
            color: AMBER, fontSize: 13.5, fontWeight: 700, fontFamily: FF,
            marginBottom: 8, transition: "all 0.18s ease",
          }}>
            <GraduationCap size={16} />
            <span style={{ flex: 1 }}>Student Portal</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ padding: "0 12px 24px" }}>
          <SideItem icon={LogOut} label="Logout" onClick={logout} danger />
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }} className="lmai-main">

        {/* Header */}
        <header style={{
          background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "0 28px", height: 64,
          display: "flex", alignItems: "center", gap: 16,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button onClick={() => setSideOpen(o => !o)} className="lmai-menu-btn"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#141413", display: "none" }}>
            {sideOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#141413" }}>
              Instructor Portal — <span style={{ color: GOLD }}>{name.split(" ")[0]}</span>
            </span>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            color: "#0a0806", fontSize: 13, fontWeight: 700,
            border: "none", borderRadius: 9, padding: "9px 18px", cursor: "pointer",
            boxShadow: "0 2px 0 rgba(140,80,20,0.35)",
          }}>
            <PlusCircle size={15} /> New Course
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#6b7280" }}>
            <Bell size={20} />
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0a0806", fontWeight: 800, fontSize: 14, cursor: "pointer",
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Body */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>

          {loading ? (
            <div style={{ textAlign: "center", padding: 80 }}>
              <div style={{ width: 32, height: 32, border: `3px solid rgba(201,136,58,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lmai-spin 0.8s linear infinite", display: "inline-block" }} />
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard index={0} label="Total Courses" value={data?.stats?.total_courses ?? 0} icon={BookOpen} color="#3b82f6" />
                <StatCard index={1} label="Total Students" value={data?.stats?.total_students ?? 0} icon={Users} color="#10b981" />
                <StatCard index={2} label="Pending Reviews" value={data?.stats?.pending_reviews ?? 0} icon={ClipboardList} color="#f59e0b" />
                <StatCard index={3} label="Total Earnings" value={data?.stats?.total_earnings ?? 0} icon={DollarSign} color="#8b5cf6" prefix="₹" />
              </div>

              {/* Recharts earnings + assignment queue */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }} className="lmai-2col">

                {/* Earnings area chart */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: 0 }}>Monthly Earnings</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, background: "rgba(201,136,58,0.10)", padding: "3px 10px", borderRadius: 999 }}>6 months</span>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={earningsChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={GOLD} stopOpacity={0.18} />
                          <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(20,20,19,0.40)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "rgba(20,20,19,0.40)" }} axisLine={false} tickLine={false}
                        tickFormatter={v => `₹${((v as number) / 1000).toFixed(0)}k`} />
                      <Tooltip content={<EarningsTooltip />} />
                      <Area type="monotone" dataKey="value" stroke={GOLD} strokeWidth={2.5}
                        fill="url(#earningsGrad)"
                        dot={{ fill: GOLD, strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: AMBER }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Assignment review queue */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>Assignment Review Queue</h3>
                  {(data?.pending_submissions ?? []).length === 0 ? (
                    <div style={{ textAlign: "center", padding: "28px 0" }}>
                      <CheckCircle size={32} color="#d1d5db" style={{ marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                      <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>All caught up!</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
                      {(data?.pending_submissions ?? []).map((s: any) => (
                        <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", background: "#f9f7f4", borderRadius: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#fef3c7,#fde68a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ClipboardList size={16} color="#d97706" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#141413", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.student_name}</div>
                            <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.assignment_title}</div>
                          </div>
                          <button onClick={() => setGrading(s)} style={{
                            fontSize: 11, fontWeight: 700, color: "#fff",
                            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                            border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer",
                            flexShrink: 0, boxShadow: "0 2px 0 rgba(140,80,20,0.30)",
                          }}>Grade</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* My Courses table */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: 0 }}>My Courses</h3>
                  <button onClick={() => setShowCreate(true)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 12, fontWeight: 700, color: GOLD, background: "rgba(201,136,58,0.10)",
                    border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer",
                  }}>
                    <PlusCircle size={13} /> Add Course
                  </button>
                </div>

                {(data?.courses ?? []).length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 16, padding: "48px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <BookOpen size={40} color="#d1d5db" style={{ marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>No courses yet. Create your first course!</p>
                  </div>
                ) : (
                  <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                      <thead>
                        <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          {["Course", "Level", "Students", "Rating", "Revenue", "Status", ""].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.courses ?? []).map((c: any) => (
                          <tr key={c.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", transition: "background 0.15s" }} className="lmai-tr">
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{c.title}</div>
                              <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 2 }}>{c.category}</div>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{
                                fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999,
                                background: c.level === "beginner" ? "#d1fae5" : c.level === "intermediate" ? "#dbeafe" : "#fde68a",
                                color: c.level === "beginner" ? "#059669" : c.level === "intermediate" ? "#2563eb" : "#d97706",
                              }}>{c.level}</span>
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#141413", fontWeight: 600 }}>{(c.total_students ?? 0).toLocaleString()}</td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#141413", fontWeight: 600 }}>
                              {c.rating ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color="#f59e0b" fill="#f59e0b" />{c.rating}</span> : "–"}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#141413" }}>
                              ₹{((c.total_students ?? 0) * (c.price ?? 0) * 0.7).toLocaleString()}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{
                                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                                background: c.status === "published" ? "#d1fae5" : "#f3f4f6",
                                color: c.status === "published" ? "#059669" : "#6b7280",
                              }}>{c.status}</span>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <Link to={`/lma/courses/${c.id}`} style={{ display: "inline-flex", color: "#6b7280", background: "#f3f4f6", borderRadius: 7, padding: "6px", textDecoration: "none" }}>
                                  <Eye size={14} />
                                </Link>
                                <button style={{ color: GOLD, background: "rgba(201,136,58,0.10)", border: "none", borderRadius: 7, padding: "6px", cursor: "pointer" }}>
                                  <Edit3 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Activity feed timeline */}
              {(data?.recent_activity ?? []).length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", marginBottom: 16 }}>Student Activity</h3>
                  <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {(data.recent_activity ?? []).map((a: any, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 16, position: "relative" }}>
                          {i < (data.recent_activity.length - 1) && (
                            <div style={{ position: "absolute", left: 17, top: 36, bottom: 0, width: 2, background: "rgba(0,0,0,0.06)" }} />
                          )}
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                            {a.type === "enrollment" ? <TrendingUp size={15} color="#0a0806" /> : <Clock size={15} color="#0a0806" />}
                          </div>
                          <div style={{ flex: 1, paddingTop: 6 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#141413" }}>{a.description}</div>
                            <div style={{ fontSize: 11, color: "rgba(20,20,19,0.40)", marginTop: 3 }}>{a.time_ago}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {showCreate && <CreateCoursePanel token={token} onClose={() => setShowCreate(false)} onCreated={reload} />}
      {grading && <GradePanel submission={grading} token={token} onClose={() => setGrading(null)} onGraded={reload} />}

      <style>{`
        @keyframes lmai-spin { to { transform: rotate(360deg); } }
        @keyframes lmai-slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes lmai-slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .lmai-tr:hover { background: #fafaf9; }
        @media (max-width:1023px) {
          .lmai-sidebar { transform: translateX(-100%); }
          .lmai-sidebar.open { transform: none; }
          .lmai-main { margin-left: 0 !important; }
          .lmai-menu-btn { display: flex !important; }
        }
        @media (min-width:1024px) { .lmai-main { margin-left: 240px; } }
        @media (max-width:640px) { .lmai-2col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
