import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, DollarSign, Star,
  ClipboardList, TrendingUp, PlusCircle, ChevronRight,
  Bell, Menu, X, User, LogOut, Edit3, CheckCircle,
  Eye, Clock, BarChart2, Award,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD = "#C9883A";
const AMBER = "#E8A84E";
const DARK = "#1a1208";

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
    el.style.transform = `perspective(700px) rotateX(${(0.5-y)*8}deg) rotateY(${(x-0.5)*8}deg) translateY(-4px)`;
    el.style.transition = "transform 0.10s ease";
  };
  const onLeave = () => {
    if (ref.current) { ref.current.style.transform = "none"; ref.current.style.transition = "transform 0.28s ease"; }
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        background: "#fff", borderRadius: 16, padding: "22px 20px",
        border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${color}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transformStyle: "preserve-3d",
        willChange: "transform", cursor: "default",
      }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#141413", lineHeight: 1, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 12.5, color: "rgba(20,20,19,0.50)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    </div>
  );
};

/* ── Simple bar chart ── */
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const bars = el.querySelectorAll<HTMLDivElement>("[data-bar]");
    bars.forEach((b, i) => {
      const h = b.dataset.h ?? "0";
      b.style.height = "0px";
      b.style.transition = `height 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms`;
      setTimeout(() => { b.style.height = h + "px"; }, 200 + i * 60);
    });
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, padding: "0 4px" }}>
      {data.map(d => {
        const h = Math.max(4, Math.round((d.value / max) * 100));
        return (
          <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#141413" }}>₹{d.value >= 1000 ? `${(d.value/1000).toFixed(0)}k` : d.value}</div>
            <div data-bar data-h={h} style={{ width: "100%", background: `linear-gradient(180deg,${AMBER},${GOLD})`, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
            <div style={{ fontSize: 10, color: "rgba(20,20,19,0.40)", whiteSpace: "nowrap" }}>{d.label}</div>
          </div>
        );
      })}
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
    borderLeft: `3px solid ${active ? GOLD : danger ? "transparent" : "transparent"}`,
    color: danger ? "rgba(239,68,68,0.80)" : active ? AMBER : "rgba(255,255,255,0.60)",
    fontSize: 13.5, fontWeight: active ? 700 : 500, fontFamily: "'DM Sans', sans-serif",
    marginBottom: 2, transition: "all 0.18s ease", userSelect: "none",
  }}>
    <Icon size={16} />
    <span style={{ flex: 1 }}>{label}</span>
    {active && !danger && <ChevronRight size={14} />}
  </div>
);

/* ── Create course modal ── */
const CreateCourseModal = ({ token, onClose, onCreated }: { token: string; onClose: () => void; onCreated: () => void }) => {
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
      if (!r.ok) { const d = await r.json(); setErr(JSON.stringify(d)); return; }
      onCreated();
    } catch { setErr("Network error"); } finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px", width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#141413", margin: "0 0 20px" }}>Create New Course</h3>
        {[
          { label: "Course Title", field: "title", type: "text" },
          { label: "Price (₹)", field: "price", type: "number" },
        ].map(({ label, field, type }) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.55)", display: "block", marginBottom: 4 }}>{label}</label>
            <input type={type} value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 9, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.55)", display: "block", marginBottom: 4 }}>Description</label>
          <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 9, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          {[
            { label: "Category", field: "category", opts: ["AI & ML", "DevSecOps & AI", "Web Development", "Data Science", "Cloud & DevOps"] },
            { label: "Level", field: "level", opts: ["beginner", "intermediate", "advanced"] },
          ].map(({ label, field, opts }) => (
            <div key={field} style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.55)", display: "block", marginBottom: 4 }}>{label}</label>
              <select value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 9, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
                {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
            </div>
          ))}
        </div>
        {err && <p style={{ color: "#dc2626", fontSize: 12, marginBottom: 10 }}>{err}</p>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 9, padding: "10px 18px", cursor: "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{
            fontSize: 13, fontWeight: 700, color: "#0a0806",
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            border: "none", borderRadius: 9, padding: "10px 22px", cursor: "pointer", opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Creating…" : "Create Course"}
          </button>
        </div>
      </div>
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

  useEffect(() => {
    if (!token || !canInstructor) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/instructor/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, canInstructor, navigate]);

  const logout = () => {
    ["lma_token","lma_role","lma_can_instructor","lma_name"].forEach(k => localStorage.removeItem(k));
    navigate("/lma/login");
  };

  const reload = () => {
    setLoading(true); setShowCreate(false);
    fetch(`${API}/lma/instructor/dashboard/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  };

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

  /* Dummy earnings chart data */
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const earningsChart = data?.courses?.map((c: any, i: number) => ({
    label: months[i % 6], value: c.total_students * Math.floor(c.price * 0.7),
  })) ?? months.map((m, i) => ({ label: m, value: 4200 + i * 800 }));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f2ef", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: 240, background: DARK, flexShrink: 0,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, height: "100vh",
        zIndex: 200, overflowY: "auto",
        transition: "transform 0.30s cubic-bezier(0.22,1,0.36,1)",
      }} className="lma-sidebar">
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
                  onClick={() => { setActive(it.label); if (it.label === "Create Course") setShowCreate(true); }} />
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 12px 24px" }}>
          <SideItem icon={LogOut} label="Logout" onClick={logout} danger />
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 240, display: "flex", flexDirection: "column", minHeight: "100vh" }} className="lma-main">

        {/* Header */}
        <header style={{
          background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "0 28px", height: 64,
          display: "flex", alignItems: "center", gap: 16,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button onClick={() => setSideOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#141413" }} className="d-lg-none">
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
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0806", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            {name.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Body */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ width: 32, height: 32, border: `3px solid rgba(201,136,58,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lma-spin 0.8s linear infinite", display: "inline-block" }} />
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard index={0} label="Total Courses" value={data?.stats?.total_courses ?? 0} icon={BookOpen} color="#3b82f6" />
                <StatCard index={1} label="Total Students" value={data?.stats?.total_students ?? 0} icon={Users} color="#10b981" />
                <StatCard index={2} label="Avg. Rating" value={data?.stats?.avg_rating ?? 0} icon={Star} color="#f59e0b" suffix="★" />
                <StatCard index={3} label="Total Revenue (₹)" value={data?.stats?.total_revenue ?? 0} icon={DollarSign} color="#8b5cf6" prefix="₹" />
              </div>

              {/* Earnings chart + pending */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }} className="lma-2col">
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>Monthly Earnings</h3>
                  <BarChart data={earningsChart.slice(0, 6)} />
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>Assignment Review Queue</h3>
                  {(data?.pending_submissions ?? []).length === 0 ? (
                    <div style={{ textAlign: "center", padding: "28px 0", color: "#9ca3af", fontSize: 13 }}>
                      <CheckCircle size={32} color="#d1d5db" style={{ marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                      All caught up! No pending submissions.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 180, overflowY: "auto" }}>
                      {(data?.pending_submissions ?? []).map((s: any) => (
                        <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px", background: "#f9f7f4", borderRadius: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#fef3c7,#fde68a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ClipboardList size={16} color="#d97706" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#141413", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.student_name}</div>
                            <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.assignment_title}</div>
                          </div>
                          <button style={{ fontSize: 11, fontWeight: 700, color: GOLD, background: "rgba(201,136,58,0.10)", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", flexShrink: 0 }}>
                            Grade
                          </button>
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
                  <div style={{ background: "#fff", borderRadius: 16, padding: "40px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <BookOpen size={40} color="#d1d5db" style={{ marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 14 }}>No courses yet. Create your first course!</p>
                  </div>
                ) : (
                  <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                      <thead>
                        <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          {["Course","Level","Students","Rating","Revenue","Status",""].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.courses ?? []).map((c: any) => (
                          <tr key={c.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{c.title}</div>
                              <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 2 }}>{c.category}</div>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: c.level === "beginner" ? "#d1fae5" : c.level === "intermediate" ? "#dbeafe" : "#fde68a", color: c.level === "beginner" ? "#059669" : c.level === "intermediate" ? "#2563eb" : "#d97706" }}>
                                {c.level}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#141413", fontWeight: 600 }}>{c.total_students?.toLocaleString() ?? 0}</td>
                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#141413", fontWeight: 600 }}>
                              {c.rating ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color="#f59e0b" fill="#f59e0b" />{c.rating}</span> : "–"}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#141413" }}>
                              ₹{((c.total_students ?? 0) * (c.price ?? 0) * 0.7).toLocaleString()}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: c.status === "published" ? "#d1fae5" : "#f3f4f6", color: c.status === "published" ? "#059669" : "#6b7280" }}>
                                {c.status}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <Link to={`/lma/courses/${c.id}`} style={{ display: "inline-flex", color: "#6b7280", background: "#f3f4f6", borderRadius: 7, padding: "6px", border: "none", cursor: "pointer", textDecoration: "none" }}>
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

              {/* Student activity timeline */}
              {data?.recent_activity?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", marginBottom: 16 }}>Student Activity</h3>
                  <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {(data?.recent_activity ?? []).map((a: any, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 16, position: "relative" }}>
                          {i < (data?.recent_activity?.length ?? 0) - 1 && (
                            <div style={{ position: "absolute", left: 17, top: 34, bottom: 0, width: 2, background: "rgba(0,0,0,0.06)" }} />
                          )}
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                            {a.type === "enrollment" ? <TrendingUp size={15} color="#0a0806" /> : <Clock size={15} color="#0a0806" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#141413" }}>{a.description}</div>
                            <div style={{ fontSize: 11, color: "rgba(20,20,19,0.40)", marginTop: 2 }}>{a.time_ago}</div>
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

      {showCreate && <CreateCourseModal token={token} onClose={() => setShowCreate(false)} onCreated={reload} />}

      <style>{`
        @keyframes lma-spin { to { transform: rotate(360deg); } }
        @media (max-width:1023px) { .lma-sidebar { transform: translateX(-100%); } .lma-main { margin-left: 0 !important; } }
        @media (max-width:640px) { .lma-2col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
