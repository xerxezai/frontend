import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  LayoutDashboard, BookOpen, Users, DollarSign, Star,
  ClipboardList, TrendingUp, PlusCircle, ChevronRight, ChevronDown,
  Bell, Menu, X, User, LogOut, Edit3, Trash2, GraduationCap,
  Check, BarChart2, Award, Eye, Clock, AlertCircle, BookMarked,
  Play, Plus, Save, Layers,
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────
const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.06),0 12px 40px rgba(201,136,58,0.14)";

type Section = "Dashboard" | "My Courses" | "Students" | "Earnings" | "Analytics" | "Reviews" | "Assignments";

const CATEGORIES = ["AI & ML", "DevSecOps & AI", "Web Development", "Data Science", "Cloud & DevOps", "Mobile Dev", "Business"];
const LEVELS     = ["beginner", "intermediate", "advanced"];
const BADGES     = ["", "Bestseller", "New", "Hot", "Top Rated", "Free"];
const COLORS_MAP: Record<string, string> = { beginner: "#059669", intermediate: "#2563eb", advanced: "#7c3aed" };
const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  published: { bg: "#d1fae5", color: "#059669" },
  draft:     { bg: "#f3f4f6", color: "#6b7280" },
};

// ── Utility ──────────────────────────────────────────────────────────────────
const hdr = (token: string) => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" });

function avatarInit(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "I";
  if (p.length === 1) return p[0][0].toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }: { msg: string; type: "success" | "error"; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: type === "success" ? "#059669" : "#dc2626",
      color: "#fff", padding: "13px 22px", borderRadius: 12,
      fontSize: 13.5, fontWeight: 600, fontFamily: FF,
      boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
      animation: "lmai-slideUp 0.28s cubic-bezier(0.22,1,0.36,1)",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, prefix = "", suffix = "", index }: {
  label: string; value: number; icon: React.ElementType;
  color: string; prefix?: string; suffix?: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.55s ease ${index * 90}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`;
    const t = setTimeout(() => {
      el.style.opacity = "1"; el.style.transform = "translateY(0)";
      if (value === 0) return;
      let s = 0; const step = value / 45;
      const iv = setInterval(() => { s = Math.min(s + step, value); setCount(Math.round(s)); if (s >= value) clearInterval(iv); }, 35);
    }, 200 + index * 90);
    return () => clearTimeout(t);
  }, [value, index]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 9}deg) rotateY(${(x - 0.5) * 9}deg) translateY(-4px)`;
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
      <div style={{ fontSize: 28, fontWeight: 900, color: "#141413", lineHeight: 1, marginBottom: 4, fontFamily: FF }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 12.5, color: "rgba(20,20,19,0.50)", fontFamily: FF }}>{label}</div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonBox = ({ h = 80, radius = 12 }: { h?: number; radius?: number }) => (
  <div style={{ height: h, borderRadius: radius, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lmai-shimmer 1.4s infinite" }} />
);

// ── ConfirmDialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ title, body, onConfirm, onCancel, danger = true }: {
  title: string; body: string; onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 28px 24px", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.20)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 8px", fontFamily: FF }}>{title}</h3>
        <p style={{ fontSize: 13, color: "rgba(20,20,19,0.55)", margin: "0 0 24px", fontFamily: FF, lineHeight: 1.5 }}>{body}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: danger ? "#dc2626" : `linear-gradient(135deg,${AMBER},${GOLD})`, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#fff" }}>
            {danger ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SideItem ─────────────────────────────────────────────────────────────────
function SideItem({ icon: Icon, label, active, onClick, danger }: {
  icon: React.ElementType; label: string; active?: boolean; onClick?: () => void; danger?: boolean;
}) {
  return (
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
}

// ── Field helper ──────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.50)", display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: FF }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle: React.CSSProperties = {
  width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10,
  padding: "10px 14px", fontSize: 13.5, outline: "none", fontFamily: FF,
  boxSizing: "border-box", color: "#141413",
};
const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = GOLD; };
const blurGold  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "#e5e7eb"; };

// ── GradePanel ───────────────────────────────────────────────────────────────
function GradePanel({ sub, token, onClose, showToast }: {
  sub: any; token: string; onClose: () => void; showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [grade, setGrade] = useState<number>(sub.grade ?? 75);
  const [feedback, setFeedback] = useState(sub.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const gc = grade >= 80 ? "#10b981" : grade >= 60 ? GOLD : "#ef4444";

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/lma/submissions/${sub.id}/grade/`, {
        method: "PUT", headers: hdr(token),
        body: JSON.stringify({ grade, feedback }),
      });
      setDone(true);
      setTimeout(() => { showToast("Grade saved!"); onClose(); }, 900);
    } catch { showToast("Save failed", "error"); } finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 700, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: "20px 20px 16px 16px", padding: "28px 28px 32px", width: "100%", maxWidth: 520, boxShadow: "0 -8px 40px rgba(0,0,0,0.20)", animation: "lmai-slideUp 0.30s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 4px", fontFamily: FF }}>Grade Submission</h3>
            <p style={{ fontSize: 12, color: "rgba(20,20,19,0.50)", margin: 0, fontFamily: FF }}>{sub.student_name} · {sub.assignment_title}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}><X size={18} /></button>
        </div>
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Check size={26} color="#059669" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#059669", margin: 0, fontFamily: FF }}>Grade saved!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.50)", letterSpacing: "0.06em", fontFamily: FF }}>SCORE</label>
                <span style={{ fontSize: 26, fontWeight: 900, color: gc, fontFamily: FF, transition: "color 0.25s" }}>{grade}<span style={{ fontSize: 14 }}>/100</span></span>
              </div>
              <input type="range" min={0} max={100} value={grade} onChange={e => setGrade(Number(e.target.value))} style={{ width: "100%", accentColor: gc, cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 600 }}>Fail</span>
                <span style={{ fontSize: 10, color: GOLD, fontWeight: 600 }}>Pass 60</span>
                <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>Excellent 80+</span>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.50)", display: "block", marginBottom: 6, letterSpacing: "0.06em", fontFamily: FF }}>FEEDBACK (OPTIONAL)</label>
              <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Suggestions for the student…"
                style={{ ...inputStyle, resize: "vertical" }} onFocus={focusGold} onBlur={blurGold} />
            </div>
            <button onClick={save} disabled={saving} style={{
              width: "100%", fontSize: 14, fontWeight: 700, color: "#0a0806",
              background: `linear-gradient(135deg,${AMBER},${GOLD})`,
              border: "none", borderRadius: 10, padding: "13px", cursor: "pointer",
              boxShadow: "0 4px 0 rgba(140,80,20,0.35)", opacity: saving ? 0.7 : 1, fontFamily: FF,
            }}>{saving ? "Saving…" : `Submit Grade · ${grade}/100`}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── CreateEditCoursePanel ────────────────────────────────────────────────────
function CourseFormPanel({ token, course, onClose, showToast, onSaved }: {
  token: string; course?: any; onClose: () => void;
  showToast: (m: string, t?: "success" | "error") => void; onSaved: () => void;
}) {
  const editing = !!course;
  const [form, setForm] = useState({
    title:       course?.title ?? "",
    description: course?.description ?? "",
    category:    course?.category ?? "AI & ML",
    level:       course?.level ?? "beginner",
    price:       String(course?.price ?? "4999"),
    badge:       course?.badge ?? "",
    status:      course?.status ?? "draft",
    tech_stack:  (course?.tech_stack as string[]) ?? [],
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string | string[]) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim(); if (!t || form.tech_stack.includes(t)) return;
    set("tech_stack", [...form.tech_stack, t]); setTagInput("");
  };
  const removeTag = (t: string) => set("tech_stack", form.tech_stack.filter(x => x !== t));

  const save = async () => {
    if (!form.title.trim()) { showToast("Title is required", "error"); return; }
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price) };
      const r = await fetch(
        editing ? `${API}/lma/courses/${course.id}/update/` : `${API}/lma/courses/create/`,
        { method: editing ? "PUT" : "POST", headers: hdr(token), body: JSON.stringify(body) }
      );
      if (!r.ok) { const d = await r.json(); showToast(Object.values(d).flat().join(", "), "error"); return; }
      showToast(editing ? "Course updated!" : "Course created!");
      onSaved();
    } catch { showToast("Network error", "error"); } finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "flex-end" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 500, height: "100vh", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", animation: "lmai-slideIn 0.30s cubic-bezier(0.22,1,0.36,1)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 26px 18px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: 0, fontFamily: FF }}>{editing ? "Edit Course" : "Create New Course"}</h3>
            <p style={{ fontSize: 12, color: "rgba(20,20,19,0.45)", margin: "3px 0 0", fontFamily: FF }}>Fill out the course details</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}><X size={20} /></button>
        </div>

        <div style={{ flex: 1, padding: "22px 26px", overflowY: "auto" }}>
          <Field label="Course Title">
            <input style={inputStyle} value={form.title} placeholder="e.g. Mastering Python for AI" onChange={e => set("title", e.target.value)} onFocus={focusGold} onBlur={blurGold} />
          </Field>
          <Field label="Description">
            <textarea rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.description} placeholder="What will students learn?" onChange={e => set("description", e.target.value)} onFocus={focusGold} onBlur={blurGold} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Category">
              <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)} onFocus={focusGold} onBlur={blurGold}>
                {CATEGORIES.map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Level">
              <select style={inputStyle} value={form.level} onChange={e => set("level", e.target.value)} onFocus={focusGold} onBlur={blurGold}>
                {LEVELS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Price (₹)">
              <input type="number" style={inputStyle} value={form.price} placeholder="4999" onChange={e => set("price", e.target.value)} onFocus={focusGold} onBlur={blurGold} />
            </Field>
            <Field label="Badge">
              <select style={inputStyle} value={form.badge} onChange={e => set("badge", e.target.value)} onFocus={focusGold} onBlur={blurGold}>
                {BADGES.map(o => <option key={o} value={o}>{o || "None"}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Tech Stack (press Enter to add)">
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              {form.tech_stack.map(t => (
                <span key={t} style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: "rgba(201,136,58,0.12)", padding: "3px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6 }}>
                  {t}
                  <button onClick={() => removeTag(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af", lineHeight: 1 }}><X size={12} /></button>
                </span>
              ))}
            </div>
            <input style={inputStyle} value={tagInput} placeholder="e.g. Python, TensorFlow…" onChange={e => setTagInput(e.target.value)}
              onFocus={focusGold} onBlur={blurGold}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
          </Field>
          <Field label="Status">
            <div style={{ display: "flex", gap: 0, background: "#f3f4f6", borderRadius: 10, padding: 3 }}>
              {["draft", "published"].map(s => (
                <button key={s} onClick={() => set("status", s)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: FF,
                  fontSize: 13, fontWeight: 600, transition: "all 0.18s ease",
                  background: form.status === s ? (s === "published" ? "#059669" : "#fff") : "transparent",
                  color: form.status === s ? (s === "published" ? "#fff" : "#141413") : "#9ca3af",
                  boxShadow: form.status === s ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
              ))}
            </div>
          </Field>
        </div>

        <div style={{ padding: "14px 26px 26px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontFamily: FF }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{
            flex: 2, fontSize: 13, fontWeight: 700, color: "#0a0806",
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            border: "none", borderRadius: 10, padding: "12px", cursor: "pointer",
            boxShadow: "0 4px 0 rgba(140,80,20,0.35)", opacity: saving ? 0.7 : 1, fontFamily: FF,
          }}>{saving ? "Saving…" : editing ? "Save Changes →" : "Create Course →"}</button>
        </div>
      </div>
    </div>
  );
}

// ── ManageCurriculumPanel ────────────────────────────────────────────────────
function ManageCurriculumPanel({ course, token, onClose, showToast }: {
  course: any; token: string; onClose: () => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const [modForm, setModForm] = useState<{ show: boolean; id: number | null; title: string; order: string }>({ show: false, id: null, title: "", order: "0" });
  const [lesForm, setLesForm] = useState<{
    show: boolean; modId: number | null; id: number | null;
    title: string; duration: string; order: string; content: string; video_url: string; is_free_preview: boolean;
  }>({ show: false, modId: null, id: null, title: "", duration: "0", order: "0", content: "", video_url: "", is_free_preview: false });

  const [saving, setSaving] = useState(false);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/lma/courses/${course.id}/modules/`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setModules(Array.isArray(d) ? d : []);
    } catch { /* silent */ }
    setLoading(false);
  }, [course.id, token]);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const saveModule = async () => {
    const { id, title, order } = modForm;
    if (!title.trim()) return;
    setSaving(true);
    try {
      const url = id ? `${API}/lma/modules/${id}/` : `${API}/lma/courses/${course.id}/modules/`;
      const r = await fetch(url, { method: id ? "PUT" : "POST", headers: hdr(token), body: JSON.stringify({ title, order: Number(order) }) });
      if (!r.ok) { showToast("Failed to save module", "error"); return; }
      showToast(id ? "Module updated!" : "Module added!");
      setModForm({ show: false, id: null, title: "", order: "0" });
      fetchModules();
    } catch { showToast("Network error", "error"); } finally { setSaving(false); }
  };

  const deleteModule = async (id: number) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    await fetch(`${API}/lma/modules/${id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    showToast("Module deleted");
    if (expanded === id) setExpanded(null);
    fetchModules();
  };

  const saveLesson = async () => {
    const { id, modId, title, duration, order, content, video_url, is_free_preview } = lesForm;
    if (!title.trim() || !modId) return;
    setSaving(true);
    try {
      const url = id ? `${API}/lma/lessons/${id}/` : `${API}/lma/modules/${modId}/lessons/`;
      const r = await fetch(url, {
        method: id ? "PUT" : "POST", headers: hdr(token),
        body: JSON.stringify({ title, duration: Number(duration), order: Number(order), content, video_url, is_free_preview }),
      });
      if (!r.ok) { showToast("Failed to save lesson", "error"); return; }
      showToast(id ? "Lesson updated!" : "Lesson added!");
      setLesForm({ show: false, modId: null, id: null, title: "", duration: "0", order: "0", content: "", video_url: "", is_free_preview: false });
      fetchModules();
    } catch { showToast("Network error", "error"); } finally { setSaving(false); }
  };

  const deleteLesson = async (id: number) => {
    if (!confirm("Delete this lesson?")) return;
    await fetch(`${API}/lma/lessons/${id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    showToast("Lesson deleted");
    fetchModules();
  };

  const openEditLesson = (mod: any, lesson: any) => setLesForm({
    show: true, modId: mod.id, id: lesson.id,
    title: lesson.title, duration: String(lesson.duration), order: String(lesson.order),
    content: lesson.content ?? "", video_url: lesson.video_url ?? "",
    is_free_preview: lesson.is_free_preview,
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 650, display: "flex", alignItems: "stretch", justifyContent: "flex-end" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 620, height: "100vh", display: "flex", flexDirection: "column", boxShadow: "-8px 0 48px rgba(0,0,0,0.22)", animation: "lmai-slideIn 0.30s cubic-bezier(0.22,1,0.36,1)" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", background: DARK, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Layers size={18} color="#0a0806" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0, fontFamily: FF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Manage Curriculum</h3>
            <p style={{ fontSize: 11, color: AMBER, margin: 0, fontFamily: FF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{course.title}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.10)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.70)", padding: 8, borderRadius: 8 }}><X size={18} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* Add Module button */}
          {!modForm.show && (
            <button onClick={() => setModForm({ show: true, id: null, title: "", order: String(modules.length) })} style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
              background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806",
              border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer",
              fontSize: 13, fontWeight: 700, fontFamily: FF, boxShadow: "0 4px 0 rgba(140,80,20,0.30)",
            }}>
              <Plus size={15} /> Add Module
            </button>
          )}

          {/* Module form (add/edit) */}
          {modForm.show && (
            <div style={{ background: "#f9f7f4", borderRadius: 12, padding: "16px 18px", marginBottom: 20, border: `1.5px solid rgba(201,136,58,0.30)` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(20,20,19,0.50)", margin: "0 0 10px", letterSpacing: "0.06em", fontFamily: FF }}>{modForm.id ? "EDIT MODULE" : "NEW MODULE"}</p>
              <input style={{ ...inputStyle, marginBottom: 10 }} value={modForm.title} placeholder="Module title…" autoFocus
                onChange={e => setModForm(f => ({ ...f, title: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
              <input type="number" style={{ ...inputStyle, marginBottom: 12 }} value={modForm.order} placeholder="Order"
                onChange={e => setModForm(f => ({ ...f, order: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setModForm({ show: false, id: null, title: "", order: "0" })} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
                <button onClick={saveModule} disabled={saving} style={{ flex: 2, padding: "9px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${AMBER},${GOLD})`, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#0a0806", opacity: saving ? 0.7 : 1 }}>
                  <Save size={13} style={{ verticalAlign: "middle", marginRight: 6 }} />{saving ? "Saving…" : "Save Module"}
                </button>
              </div>
            </div>
          )}

          {/* Modules list */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[0, 1, 2].map(i => <SkeletonBox key={i} h={60} />)}
            </div>
          ) : modules.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 24px", background: "#f9f7f4", borderRadius: 14, border: "1.5px dashed rgba(0,0,0,0.10)" }}>
              <BookMarked size={36} color="#d1d5db" style={{ marginBottom: 10, display: "block", margin: "0 auto 10px" }} />
              <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, fontFamily: FF }}>No modules yet. Add your first module above.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {modules.map(mod => (
                <div key={mod.id} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, overflow: "hidden", boxShadow: BCARD }}>
                  {/* Module row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: "#fff" }}>
                    <button onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, padding: 0, display: "flex", alignItems: "center", gap: 6, flex: 1, textAlign: "left" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(201,136,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <BookOpen size={13} color={GOLD} />
                      </div>
                      <div>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", fontFamily: FF }}>{mod.title}</span>
                        <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8, fontFamily: FF }}>{mod.lessons?.length ?? 0} lesson{mod.lessons?.length !== 1 ? "s" : ""}</span>
                      </div>
                      <ChevronDown size={15} style={{ marginLeft: "auto", transform: expanded === mod.id ? "rotate(180deg)" : "none", transition: "transform 0.22s ease" }} />
                    </button>
                    <button onClick={() => { setModForm({ show: true, id: mod.id, title: mod.title, order: String(mod.order) }); setExpanded(null); }}
                      style={{ background: "rgba(201,136,58,0.10)", border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: GOLD }}>
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => deleteModule(mod.id)}
                      style={{ background: "rgba(239,68,68,0.08)", border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "#dc2626" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Expanded lessons */}
                  {expanded === mod.id && (
                    <div style={{ background: "#f9f7f4", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "10px 16px 14px" }}>
                      {(mod.lessons ?? []).length === 0 ? (
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 10px", fontFamily: FF }}>No lessons. Add your first lesson below.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                          {(mod.lessons ?? []).map((les: any) => (
                            <div key={les.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#fff", borderRadius: 9, border: "1px solid rgba(0,0,0,0.06)" }}>
                              <Play size={12} color={GOLD} fill={GOLD} style={{ flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#141413", fontFamily: FF }}>{les.title}</span>
                                <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>{les.duration}min</span>
                                {les.is_free_preview && <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.10)", padding: "1px 7px", borderRadius: 999, marginLeft: 6 }}>FREE</span>}
                                {les.video_url && <span style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.10)", padding: "1px 7px", borderRadius: 999, marginLeft: 4 }}>VIDEO</span>}
                              </div>
                              <button onClick={() => openEditLesson(mod, les)}
                                style={{ background: "rgba(201,136,58,0.10)", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: GOLD }}>
                                <Edit3 size={12} />
                              </button>
                              <button onClick={() => deleteLesson(les.id)}
                                style={{ background: "rgba(239,68,68,0.08)", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#dc2626" }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Lesson form */}
                      {lesForm.show && lesForm.modId === mod.id ? (
                        <div style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: `1.5px solid rgba(201,136,58,0.25)` }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.50)", margin: "0 0 10px", letterSpacing: "0.06em", fontFamily: FF }}>
                            {lesForm.id ? "EDIT LESSON" : "NEW LESSON"}
                          </p>
                          <input style={{ ...inputStyle, marginBottom: 8 }} value={lesForm.title} placeholder="Lesson title…" autoFocus
                            onChange={e => setLesForm(f => ({ ...f, title: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                            <input type="number" style={inputStyle} value={lesForm.duration} placeholder="Duration (min)"
                              onChange={e => setLesForm(f => ({ ...f, duration: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
                            <input type="number" style={inputStyle} value={lesForm.order} placeholder="Order"
                              onChange={e => setLesForm(f => ({ ...f, order: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
                          </div>
                          <input style={{ ...inputStyle, marginBottom: 8 }} value={lesForm.video_url} placeholder="Video URL (YouTube, Vimeo…)"
                            onChange={e => setLesForm(f => ({ ...f, video_url: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
                          <textarea rows={3} style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }} value={lesForm.content} placeholder="Lesson content / notes…"
                            onChange={e => setLesForm(f => ({ ...f, content: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
                          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, cursor: "pointer", fontSize: 13, color: "#141413", fontFamily: FF }}>
                            <input type="checkbox" checked={lesForm.is_free_preview} onChange={e => setLesForm(f => ({ ...f, is_free_preview: e.target.checked }))} style={{ accentColor: GOLD, width: 16, height: 16 }} />
                            Free Preview (visible without enrollment)
                          </label>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setLesForm({ show: false, modId: null, id: null, title: "", duration: "0", order: "0", content: "", video_url: "", is_free_preview: false })}
                              style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
                            <button onClick={saveLesson} disabled={saving}
                              style={{ flex: 2, padding: "8px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${AMBER},${GOLD})`, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#0a0806", opacity: saving ? 0.7 : 1 }}>
                              <Save size={12} style={{ verticalAlign: "middle", marginRight: 5 }} />{saving ? "Saving…" : "Save Lesson"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setLesForm({ show: true, modId: mod.id, id: null, title: "", duration: "0", order: String((mod.lessons ?? []).length), content: "", video_url: "", is_free_preview: false })}
                          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(201,136,58,0.10)", border: "1.5px dashed rgba(201,136,58,0.35)", borderRadius: 9, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, color: GOLD, fontFamily: FF }}>
                          <Plus size={13} /> Add Lesson
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px 24px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: "none",
            background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF,
            boxShadow: "0 4px 0 rgba(140,80,20,0.30)",
          }}>Done — Close Curriculum</button>
        </div>
      </div>
    </div>
  );
}

// ── Section views ─────────────────────────────────────────────────────────────

function DashboardView({ data, earningsChart, onGrade }: { data: any; earningsChart: any[]; onGrade: (s: any) => void }) {
  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard index={0} label="Total Courses"  value={data?.stats?.total_courses ?? 0}  icon={BookOpen}     color="#3b82f6" />
        <StatCard index={1} label="Total Students" value={data?.stats?.total_students ?? 0} icon={Users}        color="#10b981" />
        <StatCard index={2} label="Pending Reviews" value={data?.stats?.pending_reviews ?? 0} icon={ClipboardList} color="#f59e0b" />
        <StatCard index={3} label="Total Earnings" value={data?.stats?.total_earnings ?? 0} icon={DollarSign}   color="#8b5cf6" prefix="₹" />
      </div>

      {/* Chart + Queue */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }} className="lmai-2col">
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: 0, fontFamily: FF }}>Monthly Earnings</h3>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, background: "rgba(201,136,58,0.10)", padding: "3px 10px", borderRadius: 999 }}>6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={earningsChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(20,20,19,0.40)", fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(20,20,19,0.40)", fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={v => `₹${((v as number) / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, fontFamily: FF, fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]} />
              <Area type="monotone" dataKey="value" stroke={GOLD} strokeWidth={2.5} fill="url(#eg)" dot={{ fill: GOLD, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: AMBER }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: FF }}>Assignment Review Queue</h3>
          {(data?.pending_submissions ?? []).length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <Check size={32} color="#d1d5db" style={{ display: "block", margin: "0 auto 8px" }} />
              <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, fontFamily: FF }}>All caught up!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
              {(data?.pending_submissions ?? []).map((s: any) => (
                <div key={s.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", background: "#f9f7f4", borderRadius: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#fef3c7,#fde68a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ClipboardList size={15} color="#d97706" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#141413", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FF }}>{s.student_name}</div>
                    <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FF }}>{s.assignment_title}</div>
                  </div>
                  <button onClick={() => onGrade(s)} style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg,${AMBER},${GOLD})`, border: "none", borderRadius: 7, padding: "5px 10px", cursor: "pointer", flexShrink: 0 }}>Grade</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent courses */}
      {(data?.courses ?? []).length > 0 && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: FF }}>Recent Courses</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
            {(data?.courses ?? []).slice(0, 4).map((c: any) => (
              <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD, borderTop: `3px solid ${GOLD}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", marginBottom: 4, fontFamily: FF }}>{c.title}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ ...STATUS_COLOR[c.status as string], fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>{c.status}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{c.total_students} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CoursesView({ courses, loading, onEdit, onManage, onDelete, onCreate }: {
  courses: any[]; loading: boolean;
  onEdit: (c: any) => void; onManage: (c: any) => void;
  onDelete: (c: any) => void; onCreate: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>My Courses</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses…"
            style={{ ...inputStyle, width: 220, padding: "8px 14px" }} onFocus={focusGold} onBlur={blurGold} />
          <button onClick={onCreate} style={{ display: "flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806", border: "none", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FF, boxShadow: "0 4px 0 rgba(140,80,20,0.30)", whiteSpace: "nowrap" }}>
            <PlusCircle size={15} /> Add Course
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[0,1,2,3].map(i => <SkeletonBox key={i} h={68} />)}</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "56px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <BookOpen size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: "0 0 20px", fontFamily: FF }}>
            {search ? "No courses match your search." : "No courses yet. Create your first!"}
          </p>
          {!search && <button onClick={onCreate} style={{ background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FF }}>Create Course</button>}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Course", "Level", "Students", "Rating", "Revenue", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any, i: number) => (
                <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }} className="lmai-tr">
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 2, fontFamily: FF }}>{c.category}</div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: `${COLORS_MAP[c.level] ?? GOLD}18`, color: COLORS_MAP[c.level] ?? GOLD }}>{c.level}</span>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#141413", fontWeight: 600, fontFamily: FF }}>{(c.total_students ?? 0).toLocaleString()}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#141413", fontFamily: FF }}>
                    {c.rating ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color="#f59e0b" fill="#f59e0b" />{c.rating}</span> : "—"}
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>
                    ₹{((c.total_students ?? 0) * (parseFloat(c.price) ?? 0) * 0.7).toLocaleString()}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ ...STATUS_COLOR[c.status as string], fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link to={`/lma/courses/${c.id}`} title="Preview" style={{ display: "inline-flex", color: "#6b7280", background: "#f3f4f6", borderRadius: 7, padding: 7, textDecoration: "none" }}><Eye size={13} /></Link>
                      <button title="Edit" onClick={() => onEdit(c)} style={{ color: GOLD, background: "rgba(201,136,58,0.10)", border: "none", borderRadius: 7, padding: 7, cursor: "pointer" }}><Edit3 size={13} /></button>
                      <button title="Manage Curriculum" onClick={() => onManage(c)} style={{ color: "#3b82f6", background: "rgba(59,130,246,0.10)", border: "none", borderRadius: 7, padding: 7, cursor: "pointer" }}><Layers size={13} /></button>
                      <button title="Delete" onClick={() => onDelete(c)} style={{ color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "none", borderRadius: 7, padding: 7, cursor: "pointer" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StudentsView({ token }: { token: string }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/lma/instructor/students/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setStudents(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const filtered = students.filter(s =>
    s.student_name.toLowerCase().includes(search.toLowerCase()) ||
    s.course_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Students</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students or courses…"
          style={{ ...inputStyle, width: 260, padding: "8px 14px" }} onFocus={focusGold} onBlur={blurGold} />
      </div>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[0,1,2,3,4].map(i => <SkeletonBox key={i} h={60} />)}</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "56px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <Users size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>{search ? "No students match your search." : "No students enrolled yet."}</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Student", "Course", "Enrolled", "Progress", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: any, i: number) => (
                <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }} className="lmai-tr">
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#0a0806", flexShrink: 0 }}>{avatarInit(s.student_name)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#141413", fontFamily: FF }}>{s.student_name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.student_email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#141413", fontFamily: FF }}>{s.course_title}</td>
                  <td style={{ padding: "12px 16px", fontSize: 11.5, color: "#9ca3af" }}>{new Date(s.enrolled_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.08)", overflow: "hidden", maxWidth: 80 }}>
                        <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${AMBER},${GOLD})`, width: `${s.progress}%` }} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: GOLD }}>{s.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: s.completed ? "#d1fae5" : "#f3f4f6", color: s.completed ? "#059669" : "#6b7280" }}>
                      {s.completed ? "Completed" : "In Progress"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EarningsView({ data, earningsChart }: { data: any; earningsChart: any[] }) {
  const courses = data?.courses ?? [];
  const total = data?.stats?.total_earnings ?? 0;

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>Earnings</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard index={0} label="Total Earnings" value={total} icon={DollarSign} color="#8b5cf6" prefix="₹" />
        <StatCard index={1} label="Total Students" value={data?.stats?.total_students ?? 0} icon={Users} color="#10b981" />
        <StatCard index={2} label="Total Courses" value={data?.stats?.total_courses ?? 0} icon={BookOpen} color="#3b82f6" />
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD, marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>Monthly Revenue (6 months)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={earningsChart} margin={{ top: 4, right: 4, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GOLD} stopOpacity={0.22} />
                <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(20,20,19,0.40)", fontFamily: FF }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(20,20,19,0.40)", fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={v => `₹${((v as number) / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ borderRadius: 10, fontFamily: FF, fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
            <Area type="monotone" dataKey="value" stroke={GOLD} strokeWidth={2.5} fill="url(#eg2)" dot={{ fill: GOLD, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: AMBER }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {courses.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Course", "Students", "Price", "Revenue (70%)"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((c: any, i: number) => (
                <tr key={c.id} style={{ borderBottom: i < courses.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }} className="lmai-tr">
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#141413", fontFamily: FF }}>{c.title}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#141413" }}>{(c.total_students ?? 0).toLocaleString()}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#141413" }}>₹{parseFloat(c.price ?? 0).toLocaleString()}</td>
                  <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 800, color: "#8b5cf6", fontFamily: FF }}>
                    ₹{((c.total_students ?? 0) * parseFloat(c.price ?? 0) * 0.7).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ token }: { token: string }) {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/lma/instructor/analytics/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setAnalytics(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>Analytics</h2>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[0,1,2].map(i => <SkeletonBox key={i} h={100} />)}</div>
      ) : analytics.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "56px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <BarChart2 size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>No data yet. Create courses and get students enrolled.</p>
        </div>
      ) : (
        <>
          <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD, marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>Enrollments by Course</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics} margin={{ top: 4, right: 4, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="title" tick={{ fontSize: 10, fill: "rgba(20,20,19,0.40)", fontFamily: FF }} axisLine={false} tickLine={false}
                  tickFormatter={v => v.length > 12 ? v.slice(0, 12) + "…" : v} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(20,20,19,0.40)", fontFamily: FF }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontFamily: FF, fontSize: 12 }} formatter={(v: number) => [v, "Students"]} />
                <Bar dataKey="total_students" fill={GOLD} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
            {analytics.map((c: any, i: number) => (
              <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${GOLD}`, boxShadow: BCARD, animation: "lmai-pageIn 0.40s ease both", animationDelay: `${i * 60}ms` }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", marginBottom: 12, fontFamily: FF }}>{c.title}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Students", value: c.total_students, color: "#3b82f6" },
                    { label: "Completion", value: `${c.completion_rate}%`, color: "#10b981" },
                    { label: "Avg Rating", value: c.avg_rating ? `${c.avg_rating}★` : "—", color: "#f59e0b" },
                    { label: "Revenue", value: `₹${c.revenue.toLocaleString()}`, color: "#8b5cf6" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: `${color}08`, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(20,20,19,0.40)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: FF }}>{label}</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color, fontFamily: FF, marginTop: 3 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ReviewsView({ token }: { token: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/lma/instructor/reviews/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setReviews(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>Reviews</h2>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[0,1,2].map(i => <SkeletonBox key={i} h={90} />)}</div>
      ) : reviews.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "56px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <Star size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>No reviews yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map((r: any, i: number) => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD, animation: "lmai-pageIn 0.40s ease both", animationDelay: `${i * 60}ms` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: r.comment ? 10 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#0a0806", flexShrink: 0 }}>{avatarInit(r.student_name)}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>{r.student_name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.course_title}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#f59e0b" fill={s <= r.rating ? "#f59e0b" : "none"} />)}
                  </div>
                  <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </div>
              {r.comment && <p style={{ fontSize: 13, color: "rgba(20,20,19,0.60)", margin: 0, lineHeight: 1.55, fontFamily: FF }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AssignmentsView({ data, onGrade }: { data: any; onGrade: (s: any) => void }) {
  const subs = data?.pending_submissions ?? [];
  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>Assignment Submissions</h2>
      {subs.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "56px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <Check size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>No pending submissions — all caught up!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {subs.map((s: any, i: number) => (
            <div key={s.id} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)", borderLeft: `4px solid ${GOLD}`, boxShadow: BCARD, display: "flex", alignItems: "center", gap: 14, animation: "lmai-pageIn 0.40s ease both", animationDelay: `${i * 60}ms` }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#fef3c7,#fde68a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ClipboardList size={18} color="#d97706" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", fontFamily: FF }}>{s.student_name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2, fontFamily: FF }}>{s.assignment_title}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                  <Clock size={10} style={{ verticalAlign: "middle", marginRight: 4 }} />
                  Submitted {new Date(s.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </div>
              </div>
              {s.content && (
                <div style={{ maxWidth: 200, fontSize: 11.5, color: "rgba(20,20,19,0.50)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontFamily: FF }}>
                  {s.content}
                </div>
              )}
              <button onClick={() => onGrade(s)} style={{
                flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff",
                background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                border: "none", borderRadius: 9, padding: "9px 18px", cursor: "pointer",
                fontFamily: FF, boxShadow: "0 3px 0 rgba(140,80,20,0.30)",
              }}>Grade →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LMAInstructorDashboard() {
  const navigate = useNavigate();
  const name         = localStorage.getItem("lma_name") ?? "Instructor";
  const token        = localStorage.getItem("lma_token") ?? "";
  const canInstructor = localStorage.getItem("lma_can_instructor") === "true";

  const [sideOpen, setSideOpen] = useState(false);
  const [active, setActive] = useState<Section>("Dashboard");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Panels
  const [showCreate, setShowCreate]         = useState(false);
  const [editCourse, setEditCourse]         = useState<any | null>(null);
  const [manageCourse, setManageCourse]     = useState<any | null>(null);
  const [gradingSub, setGradingSub]         = useState<any | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<any | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
  }, []);

  // Guard
  useEffect(() => {
    if (!token || !canInstructor) { navigate("/lma/instructor-access"); return; }
  }, [token, canInstructor, navigate]);

  // Load dashboard
  const loadDashboard = useCallback(() => {
    setLoading(true);
    fetch(`${API}/lma/instructor/dashboard/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { if (token && canInstructor) loadDashboard(); }, [loadDashboard, token, canInstructor]);

  const logout = () => {
    ["lma_token", "lma_role", "lma_can_instructor", "lma_name"].forEach(k => localStorage.removeItem(k));
    navigate("/lma/login");
  };

  // Earnings chart
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  const totalE = data?.stats?.total_earnings ?? 0;
  const earningsChart = Array.from({ length: 6 }, (_, i) => {
    const idx = (now.getMonth() - 5 + i + 12) % 12;
    const base = totalE / 6;
    const v = Math.round(base * (0.55 + Math.abs(Math.sin(i * 1.4 + 0.5)) * 0.9));
    return { month: months[idx], value: v };
  });

  const courses: any[] = data?.courses ?? [];

  const onDeleteConfirm = async () => {
    if (!deletingCourse) return;
    try {
      await fetch(`${API}/lma/courses/${deletingCourse.id}/delete/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      showToast("Course deleted");
      loadDashboard();
    } catch { showToast("Delete failed", "error"); }
    setDeletingCourse(null);
  };

  const sideNav = [
    { section: "MANAGE", items: [
      { icon: LayoutDashboard, label: "Dashboard" as Section },
      { icon: BookOpen,        label: "My Courses" as Section },
      { icon: Users,           label: "Students" as Section },
    ]},
    { section: "ANALYTICS", items: [
      { icon: DollarSign, label: "Earnings" as Section },
      { icon: BarChart2,  label: "Analytics" as Section },
      { icon: Star,       label: "Reviews" as Section },
    ]},
    { section: "TEACHING", items: [
      { icon: ClipboardList, label: "Assignments" as Section },
    ]},
  ];

  const renderSection = () => {
    if (loading) return (
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: `3px solid rgba(201,136,58,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lmai-spin 0.8s linear infinite", display: "inline-block" }} />
      </div>
    );
    switch (active) {
      case "Dashboard":   return <DashboardView data={data} earningsChart={earningsChart} onGrade={setGradingSub} />;
      case "My Courses":  return <CoursesView courses={courses} loading={false} onEdit={setEditCourse} onManage={setManageCourse} onDelete={setDeletingCourse} onCreate={() => setShowCreate(true)} />;
      case "Students":    return <StudentsView token={token} />;
      case "Earnings":    return <EarningsView data={data} earningsChart={earningsChart} />;
      case "Analytics":   return <AnalyticsView token={token} />;
      case "Reviews":     return <ReviewsView token={token} />;
      case "Assignments": return <AssignmentsView data={data} onGrade={setGradingSub} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f2ef", fontFamily: FF }}>
      {sideOpen && <div onClick={() => setSideOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.40)", zIndex: 199 }} />}

      {/* Sidebar */}
      <aside className={`lmai-sidebar${sideOpen ? " open" : ""}`} style={{ width: 240, background: DARK, flexShrink: 0, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 200, overflowY: "auto" }}>
        <div style={{ padding: "22px 16px 14px" }}>
          <Link to="/"><img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 34, width: "auto" }} /></Link>
          <div style={{ marginTop: 7, fontSize: 10, color: AMBER, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Academy · Instructor</div>
        </div>

        <nav style={{ flex: 1, padding: "6px 12px" }}>
          {sideNav.map(({ section, items }) => (
            <div key={section}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "10px 4px 5px", fontFamily: FF }}>{section}</div>
              {items.map(it => (
                <SideItem key={it.label} icon={it.icon} label={it.label} active={active === it.label}
                  onClick={() => { setActive(it.label); setSideOpen(false); }} />
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: "0 12px 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "10px 4px 5px" }}>SWITCH PORTAL</div>
          <Link to="/lma/student/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10, textDecoration: "none", background: "linear-gradient(135deg,rgba(201,136,58,0.20),rgba(232,168,78,0.10))", border: "1px solid rgba(201,136,58,0.35)", color: AMBER, fontSize: 13.5, fontWeight: 700, marginBottom: 8 }}>
            <GraduationCap size={16} /><span style={{ flex: 1 }}>Student Portal</span><ChevronRight size={14} />
          </Link>
        </div>
        <div style={{ padding: "0 12px 24px" }}>
          <SideItem icon={LogOut} label="Logout" danger onClick={logout} />
        </div>
      </aside>

      {/* Main */}
      <div className="lmai-main" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 28px", height: 64, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
          <button onClick={() => setSideOpen(o => !o)} className="lmai-menu-btn"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#141413", display: "none" }}>
            {sideOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#141413", fontFamily: FF }}>
              Instructor · <span style={{ color: GOLD, fontWeight: 800 }}>{name.split(" ")[0]}</span>
            </span>
          </div>
          <button onClick={() => { setShowCreate(true); setActive("My Courses"); }} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806",
            fontSize: 13, fontWeight: 700, border: "none", borderRadius: 9, padding: "9px 18px",
            cursor: "pointer", boxShadow: "0 2px 0 rgba(140,80,20,0.35)", fontFamily: FF,
          }}>
            <PlusCircle size={15} /> New Course
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#6b7280" }}><Bell size={20} /></button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0806", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            {avatarInit(name)}
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px" }}>{renderSection()}</main>
      </div>

      {/* Panels & Dialogs */}
      {showCreate && (
        <CourseFormPanel token={token} onClose={() => setShowCreate(false)} showToast={showToast}
          onSaved={() => { setShowCreate(false); loadDashboard(); setActive("My Courses"); }} />
      )}
      {editCourse && (
        <CourseFormPanel token={token} course={editCourse} onClose={() => setEditCourse(null)} showToast={showToast}
          onSaved={() => { setEditCourse(null); loadDashboard(); }} />
      )}
      {manageCourse && (
        <ManageCurriculumPanel course={manageCourse} token={token} onClose={() => setManageCourse(null)} showToast={showToast} />
      )}
      {gradingSub && (
        <GradePanel sub={gradingSub} token={token} onClose={() => setGradingSub(null)} showToast={showToast} />
      )}
      {deletingCourse && (
        <ConfirmDialog
          title="Delete Course"
          body={`Delete "${deletingCourse.title}"? This will remove all modules, lessons and enrollment data permanently.`}
          onConfirm={onDeleteConfirm}
          onCancel={() => setDeletingCourse(null)}
        />
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <style>{`
        @keyframes lmai-spin     { to { transform: rotate(360deg); } }
        @keyframes lmai-slideIn  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes lmai-slideUp  { from { transform: translateY(60px); opacity:0; } to { transform: translateY(0); opacity:1; } }
        @keyframes lmai-pageIn   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes lmai-shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .lmai-tr:hover { background:#fafaf9 !important; }
        .lmai-sidebar { transition: transform 0.30s cubic-bezier(0.22,1,0.36,1); }
        @media (max-width:1023px) {
          .lmai-sidebar  { transform: translateX(-100%); }
          .lmai-sidebar.open { transform: none; }
          .lmai-main     { margin-left: 0 !important; }
          .lmai-menu-btn { display: flex !important; }
        }
        @media (min-width:1024px) { .lmai-main { margin-left:240px; } }
        @media (max-width:640px)  { .lmai-2col { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}
