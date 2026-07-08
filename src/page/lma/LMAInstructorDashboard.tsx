import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  LayoutDashboard, BookOpen, Users, DollarSign, Star,
  ClipboardList, PlusCircle, ChevronRight, ChevronDown,
  Bell, Menu, X, LogOut, Edit3, Trash2, GraduationCap,
  Check, BarChart2, Eye, Clock, AlertCircle, BookMarked,
  Play, Plus, Save, Layers, Award, UserX, Search, FileCheck,
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────
const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06)";

type Section = "Dashboard" | "My Courses" | "Students" | "Earnings" | "Analytics" | "Reviews" | "Assignments" | "Instructors" | "Pending Reviews" | "Applications";

const CATEGORIES = ["AI & ML", "DevSecOps & AI", "Web Development", "Data Science", "Cloud & DevOps", "Mobile Dev", "Business"];
const LEVELS     = ["beginner", "intermediate", "advanced"];
const BADGES     = ["", "Bestseller", "New", "Hot", "Top Rated", "Free"];
const COLORS_MAP: Record<string, string> = { beginner: "#059669", intermediate: "#2563eb", advanced: "#7c3aed" };
const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  published:      { bg: "#d1fae5", color: "#059669" },
  draft:          { bg: "#f3f4f6", color: "#6b7280" },
  pending_review: { bg: "#fef3c7", color: "#d97706" },
  rejected:       { bg: "#fee2e2", color: "#dc2626" },
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
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
          <button type="button" onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: danger ? "#dc2626" : `linear-gradient(135deg,${AMBER},${GOLD})`, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#fff" }}>
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
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}><X size={18} /></button>
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
            <button type="button" onClick={save} disabled={saving} style={{
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
function CourseFormPanel({ token, course, onClose, showToast, onSaved, isSuperInstructor }: {
  token: string; course?: any; onClose: () => void; isSuperInstructor: boolean;
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
    console.log("[LMA] CourseFormPanel.save called", { editing, form });
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
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}><X size={20} /></button>
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
                  <button type="button" onClick={() => removeTag(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af", lineHeight: 1 }}><X size={12} /></button>
                </span>
              ))}
            </div>
            <input style={inputStyle} value={tagInput} placeholder="e.g. Python, TensorFlow…" onChange={e => setTagInput(e.target.value)}
              onFocus={focusGold} onBlur={blurGold}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
          </Field>
          {isSuperInstructor ? (
          <Field label="Status">
            <div style={{ display: "flex", gap: 0, background: "#f3f4f6", borderRadius: 10, padding: 3 }}>
              {["draft", "published"].map(s => (
                <button type="button" key={s} onClick={() => set("status", s)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: FF,
                  fontSize: 13, fontWeight: 600, transition: "all 0.18s ease",
                  background: form.status === s ? (s === "published" ? "#059669" : "#fff") : "transparent",
                  color: form.status === s ? (s === "published" ? "#fff" : "#141413") : "#9ca3af",
                  boxShadow: form.status === s ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
              ))}
            </div>
          </Field>
          ) : (
          <Field label="Status">
            <div style={{ background: "#f3f4f6", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#6b7280", fontFamily: FF }}>
              Draft — submit for review to publish
            </div>
          </Field>
          )}
        </div>

        <div style={{ padding: "14px 26px 26px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", fontFamily: FF }}>Cancel</button>
          <button type="button" onClick={save} disabled={saving} style={{
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
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setModules(Array.isArray(d) ? d : []);
    } catch (e) {
      console.error("[LMA] fetchModules error:", e);
      // Don't clear existing modules on refresh failure
    } finally {
      setLoading(false);
    }
  }, [course.id, token]);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const saveModule = async () => {
    console.log("[LMA] saveModule called", { courseId: course.id, modForm });
    const { id, title, order } = modForm;
    if (!title.trim()) { showToast("Module title is required", "error"); return; }
    setSaving(true);
    try {
      const url = id ? `${API}/lma/modules/${id}/` : `${API}/lma/courses/${course.id}/modules/`;
      const r = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: hdr(token),
        body: JSON.stringify({ title, order: Number(order), duration: 0 }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        const msg = err.error ?? err.detail ?? Object.values(err).flat().join(", ") ?? "Failed to save module";
        console.error("[LMA] saveModule failed:", r.status, err);
        showToast(String(msg), "error");
        return;
      }
      showToast(id ? "Module updated!" : "Module added!");
      setModForm({ show: false, id: null, title: "", order: "0" });
      fetchModules();
    } catch (e) {
      console.error("[LMA] saveModule network error:", e);
      showToast("Network error — check console", "error");
    } finally { setSaving(false); }
  };

  const deleteModule = async (id: number) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    await fetch(`${API}/lma/modules/${id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    showToast("Module deleted");
    if (expanded === id) setExpanded(null);
    fetchModules();
  };

  const saveLesson = async () => {
    console.log("[LMA] saveLesson called", { lesForm });
    const { id, modId, title, duration, order, content, video_url, is_free_preview } = lesForm;
    if (!title.trim()) { showToast("Lesson title is required", "error"); return; }
    if (!modId) { showToast("Module not selected", "error"); return; }
    setSaving(true);
    try {
      const url = id ? `${API}/lma/lessons/${id}/` : `${API}/lma/modules/${modId}/lessons/`;
      const r = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: hdr(token),
        body: JSON.stringify({
          title,
          duration: Number(duration) || 0,
          order: Number(order) || 0,
          content: content || "",
          video_url: video_url || "",
          is_free_preview,
        }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        const msg = err.error ?? err.detail ?? Object.values(err).flat().join(", ") ?? "Failed to save lesson";
        console.error("[LMA] saveLesson failed:", r.status, err);
        showToast(String(msg), "error");
        return;
      }
      showToast(id ? "Lesson updated!" : "Lesson added!");
      setLesForm({ show: false, modId: null, id: null, title: "", duration: "0", order: "0", content: "", video_url: "", is_free_preview: false });
      fetchModules();
    } catch (e) {
      console.error("[LMA] saveLesson network error:", e);
      showToast("Network error — check console", "error");
    } finally { setSaving(false); }
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
          <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.10)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.70)", padding: 8, borderRadius: 8 }}><X size={18} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* Add Module button */}
          {!modForm.show && (
            <button type="button" onClick={() => setModForm({ show: true, id: null, title: "", order: String(modules.length) })} style={{
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
                <button type="button" onClick={() => setModForm({ show: false, id: null, title: "", order: "0" })} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
                <button type="button" onClick={saveModule} disabled={saving} style={{ flex: 2, padding: "9px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${AMBER},${GOLD})`, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#0a0806", opacity: saving ? 0.7 : 1 }}>
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
                    <button type="button" onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}
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
                    <button type="button" onClick={() => { setModForm({ show: true, id: mod.id, title: mod.title, order: String(mod.order) }); setExpanded(null); }}
                      style={{ background: "rgba(201,136,58,0.10)", border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: GOLD }}>
                      <Edit3 size={13} />
                    </button>
                    <button type="button" onClick={() => deleteModule(mod.id)}
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
                              <button type="button" onClick={() => openEditLesson(mod, les)}
                                style={{ background: "rgba(201,136,58,0.10)", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: GOLD }}>
                                <Edit3 size={12} />
                              </button>
                              <button type="button" onClick={() => deleteLesson(les.id)}
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
                            <button type="button" onClick={() => setLesForm({ show: false, modId: null, id: null, title: "", duration: "0", order: "0", content: "", video_url: "", is_free_preview: false })}
                              style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
                            <button type="button" onClick={saveLesson} disabled={saving}
                              style={{ flex: 2, padding: "8px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${AMBER},${GOLD})`, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#0a0806", opacity: saving ? 0.7 : 1 }}>
                              <Save size={12} style={{ verticalAlign: "middle", marginRight: 5 }} />{saving ? "Saving…" : "Save Lesson"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setLesForm({ show: true, modId: mod.id, id: null, title: "", duration: "0", order: String((mod.lessons ?? []).length), content: "", video_url: "", is_free_preview: false })}
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
          <button type="button" onClick={onClose} style={{
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

function DashboardView({ data, earningsChart, onGrade, isSuperInstructor }: {
  data: any; earningsChart: any[]; onGrade: (s: any) => void; isSuperInstructor: boolean;
}) {
  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard index={0} label="Total Courses"   value={data?.stats?.total_courses ?? 0}  icon={BookOpen}     color="#3b82f6" />
        <StatCard index={1} label="Total Students"  value={data?.stats?.total_students ?? 0} icon={Users}        color="#10b981" />
        <StatCard index={2} label="Pending Reviews" value={data?.stats?.pending_reviews ?? 0} icon={ClipboardList} color="#f59e0b" />
        {isSuperInstructor && (
          <StatCard index={3} label="Total Earnings" value={data?.stats?.total_earnings ?? 0} icon={DollarSign} color="#8b5cf6" prefix="₹" />
        )}
      </div>

      {/* Chart + Queue */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }} className="lmai-2col">
        {isSuperInstructor && (
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
              <Tooltip contentStyle={{ borderRadius: 10, fontFamily: FF, fontSize: 12 }} formatter={(v) => [`₹${Number(v ?? 0).toLocaleString()}`, "Earnings"]} />
              <Area type="monotone" dataKey="value" stroke={GOLD} strokeWidth={2.5} fill="url(#eg)" dot={{ fill: GOLD, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: AMBER }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}

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
                  <button type="button" onClick={() => onGrade(s)} style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg,${AMBER},${GOLD})`, border: "none", borderRadius: 7, padding: "5px 10px", cursor: "pointer", flexShrink: 0 }}>Grade</button>
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

function CoursesView({ courses, loading, onEdit, onManage, onDelete, onCreate, onSubmitReview, isSuperInstructor }: {
  courses: any[]; loading: boolean; isSuperInstructor: boolean;
  onEdit: (c: any) => void; onManage: (c: any) => void;
  onDelete: (c: any) => void; onCreate: () => void;
  onSubmitReview: (c: any) => void;
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
          <button type="button" onClick={onCreate} style={{ display: "flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806", border: "none", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FF, boxShadow: "0 4px 0 rgba(140,80,20,0.30)", whiteSpace: "nowrap" }}>
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
          {!search && <button type="button" onClick={onCreate} style={{ background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FF }}>Create Course</button>}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Course", "Level", "Students", "Rating", ...(isSuperInstructor ? ["Revenue"] : []), "Status", "Actions"].map(h => (
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
                  {isSuperInstructor && (
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>
                    ₹{((c.total_students ?? 0) * (parseFloat(c.price) ?? 0) * 0.7).toLocaleString()}
                  </td>
                  )}
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ ...(STATUS_COLOR[c.status as string] ?? { bg: "#f3f4f6", color: "#6b7280" }), fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
                        {c.status === "pending_review" ? "Pending Review" : c.status === "rejected" ? "Rejected" : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                      {c.status === "rejected" && c.rejection_reason && (
                        <span title={c.rejection_reason} style={{ cursor: "help", color: "#dc2626", fontSize: 11 }}>ℹ</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <a href={`/lma/courses/${c.id}`} title="Preview" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", color: "#6b7280", background: "#f3f4f6", borderRadius: 7, padding: 7, textDecoration: "none" }}><Eye size={13} /></a>
                      <button type="button" title="Edit" onClick={() => onEdit(c)} style={{ color: GOLD, background: "rgba(201,136,58,0.10)", border: "none", borderRadius: 7, padding: 7, cursor: "pointer" }}><Edit3 size={13} /></button>
                      <button type="button" title="Manage Curriculum" onClick={() => onManage(c)} style={{ color: "#3b82f6", background: "rgba(59,130,246,0.10)", border: "none", borderRadius: 7, padding: 7, cursor: "pointer" }}><Layers size={13} /></button>
                      {isSuperInstructor ? (
                        <button type="button" title="Delete" onClick={() => onDelete(c)} style={{ color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "none", borderRadius: 7, padding: 7, cursor: "pointer" }}><Trash2 size={13} /></button>
                      ) : (c.status === "draft" || c.status === "rejected") && (
                        <button type="button" title="Submit for Review" onClick={() => onSubmitReview(c)} style={{ color: "#d97706", background: "rgba(217,119,6,0.10)", border: "none", borderRadius: 7, padding: "7px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: FF }}>Submit</button>
                      )}
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

// ── Student types ─────────────────────────────────────────────────────────────
interface EnrollmentRow {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  course_id: number;
  course_title: string;
  enrolled_at: string;
  progress: number;
  completed: boolean;
}

// ── UnenrollConfirmModal ───────────────────────────────────────────────────────
function UnenrollConfirmModal({
  courseName, studentName, onConfirm, onCancel, loading,
}: {
  courseName: string; studentName: string;
  onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onCancel]);

  return (
    <>
      <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 700, animation: "lmai-fadeIn 0.2s ease both" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 701, width: 360, padding: "32px 28px",
        background: "#fff", borderRadius: 18, border: "1px solid rgba(0,0,0,0.08)",
        borderTop: `3px solid #dc2626`,
        boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
        animation: "lmai-scaleIn 0.22s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(220,38,38,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <UserX size={24} color="#dc2626" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#141413", fontFamily: FF, marginBottom: 10 }}>Unenroll Student?</div>
          <div style={{ fontSize: 13.5, color: "rgba(20,20,19,0.55)", fontFamily: FF, lineHeight: 1.6 }}>
            Remove <strong style={{ color: "#141413" }}>{studentName}</strong> from{" "}
            <strong style={{ color: "#141413" }}>{courseName}</strong>?{" "}
            All lesson progress for this course will be deleted.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "#dc2626", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: FF, opacity: loading ? 0.65 : 1 }}>
            {loading ? "Removing…" : "Unenroll"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── StudentDetailPanel ─────────────────────────────────────────────────────────
function StudentDetailPanel({ studentId, token, onClose, onUnenrolled, studentName }: {
  studentId: number; token: string; onClose: () => void;
  onUnenrolled: (enrollmentId: number) => void; studentName: string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [unenrolling, setUnenrolling] = useState<{ enrollment_id: number; course_title: string } | null>(null);
  const [unenrollLoading, setUnenrollLoading] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true); setData(null); setEnrollments([]);
    fetch(`${API}/lma/instructor/students/${studentId}/details/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setData(d); setEnrollments(d.enrollments ?? []); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId, token]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape" && !unenrolling) onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, unenrolling]);

  const confirmUnenroll = async () => {
    if (!unenrolling) return;
    setUnenrollLoading(true);
    const eid = unenrolling.enrollment_id;
    const r = await fetch(`${API}/lma/instructor/enrollments/${eid}/`, { method: "DELETE", headers: hdr(token) });
    setUnenrollLoading(false);
    setUnenrolling(null);
    if (r.ok || r.status === 204) {
      setRemovingId(eid);
      setTimeout(() => { setEnrollments(prev => prev.filter(e => e.enrollment_id !== eid)); setRemovingId(null); onUnenrolled(eid); }, 320);
    }
  };

  const reltime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000), hrs = Math.floor(mins / 60), days = Math.floor(hrs / 24);
    if (days > 30) return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "Just now";
  };

  const actIcon = (type: string) => {
    if (type === "enrolled")             return <BookOpen size={12} color={GOLD} />;
    if (type === "completed_lesson")     return <Check size={12} color="#059669" />;
    if (type === "completed_course")     return <GraduationCap size={12} color="#7c3aed" />;
    if (type === "submitted_assignment") return <ClipboardList size={12} color="#2563eb" />;
    if (type === "earned_certificate")   return <Award size={12} color={GOLD} />;
    return <Clock size={12} color="#9ca3af" />;
  };

  const actColor = (type: string) => {
    if (type === "completed_lesson")     return "#059669";
    if (type === "completed_course")     return "#7c3aed";
    if (type === "submitted_assignment") return "#2563eb";
    return GOLD;
  };

  const gradeBadge = (grade: number | null) => {
    if (grade === null) return { bg: "#f3f4f6", color: "#6b7280", text: "Pending" };
    if (grade >= 70)    return { bg: "#d1fae5", color: "#059669", text: `${grade}%` };
    if (grade >= 40)    return { bg: "#fef3c7", color: "#d97706", text: `${grade}%` };
    return               { bg: "rgba(220,38,38,0.08)", color: "#dc2626", text: `${grade}%` };
  };

  const C3D = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)",
      borderTop: `3px solid ${GOLD}`, boxShadow: BCARD,
      padding: "20px 18px", marginBottom: 14,
      animation: "lmai-pageIn 0.35s ease both", animationDelay: `${delay}ms`,
    }}>
      {children}
    </div>
  );

  const SLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(20,20,19,0.38)", fontFamily: FF, marginBottom: 14, textTransform: "uppercase" as const }}>{children}</div>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.40)", zIndex: 500, animation: "lmai-fadeIn 0.3s ease both" }} />

      <div style={{
        position: "fixed", top: 0, right: 0, width: "min(480px, 100vw)", height: "100dvh",
        background: "#F8F7F4", zIndex: 501,
        animation: "lmai-slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
        overflowY: "auto", boxShadow: "-8px 0 48px rgba(0,0,0,0.14)",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#F8F7F4", position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#141413", fontFamily: FF }}>{studentName}</div>
            <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.45)", fontFamily: FF }}>Student Detail</div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.10)", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <X size={15} color="#141413" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 18px 48px" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[100, 180, 140, 220].map((h, i) => <SkeletonBox key={i} h={h} />)}
            </div>
          ) : !data ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontFamily: FF, fontSize: 13 }}>Could not load student data.</div>
          ) : (
            <>
              {/* Contact */}
              <C3D delay={0}>
                <SLabel>Contact Info</SLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#0a0806", flexShrink: 0 }}>
                    {avatarInit(data.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: "#141413", fontFamily: FF }}>{data.name}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", fontFamily: FF }}>@{data.username}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <div style={{ fontSize: 12.5, color: "rgba(20,20,19,0.65)", fontFamily: FF }}>
                    <span style={{ color: "rgba(20,20,19,0.40)", marginRight: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>EMAIL</span>{data.email}
                  </div>
                  <div style={{ fontSize: 12.5, color: "rgba(20,20,19,0.65)", fontFamily: FF }}>
                    <span style={{ color: "rgba(20,20,19,0.40)", marginRight: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>MEMBER SINCE</span>
                    {new Date(data.date_joined).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
              </C3D>

              {/* Enrolled Courses */}
              <C3D delay={80}>
                <SLabel>Enrolled Courses ({enrollments.length})</SLabel>
                {enrollments.length === 0 ? (
                  <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: FF, textAlign: "center", padding: "10px 0" }}>No enrollments</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {enrollments.map(enr => (
                      <div key={enr.enrollment_id} style={{ opacity: removingId === enr.enrollment_id ? 0 : 1, maxHeight: removingId === enr.enrollment_id ? 0 : 300, overflow: "hidden", transition: "opacity 0.3s ease, max-height 0.32s ease", pointerEvents: removingId === enr.enrollment_id ? "none" : "auto" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#141413", fontFamily: FF, marginBottom: 3 }}>{enr.course_title}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: FF }}>
                              {enr.completed_lessons}/{enr.total_lessons} lessons ·{" "}
                              <span style={{ fontWeight: 700, color: enr.completed ? "#059669" : "#d97706" }}>
                                {enr.completed ? "Completed" : "In Progress"}
                              </span>
                            </div>
                          </div>
                          <button
                            title="Unenroll from this course"
                            onClick={() => setUnenrolling({ enrollment_id: enr.enrollment_id, course_title: enr.course_title })}
                            style={{ width: 28, height: 28, borderRadius: 7, border: "1.5px solid rgba(220,38,38,0.18)", background: "rgba(220,38,38,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.2s, border-color 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.14)"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.40)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,38,38,0.06)"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.18)"; }}
                          >
                            <Trash2 size={12} color="#dc2626" />
                          </button>
                        </div>
                        <div style={{ height: 5, borderRadius: 3, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${AMBER},${GOLD})`, width: `${enr.progress}%`, transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)" }} />
                        </div>
                        <div style={{ fontSize: 10.5, color: "rgba(20,20,19,0.38)", fontFamily: FF, marginTop: 3, textAlign: "right" }}>{enr.progress}%</div>
                      </div>
                    ))}
                  </div>
                )}
              </C3D>

              {/* Assignment Scores */}
              <C3D delay={160}>
                <SLabel>Assignment Scores</SLabel>
                {(data.submissions as any[]).length === 0 ? (
                  <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: FF, textAlign: "center", padding: "10px 0" }}>No submissions yet</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          {["Assignment", "Course", "Grade"].map(h => (
                            <th key={h} style={{ padding: "5px 8px 8px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "rgba(20,20,19,0.38)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(data.submissions as any[]).map((s: any) => {
                          const g = gradeBadge(s.grade);
                          return (
                            <tr key={s.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                              <td style={{ padding: "8px 8px", fontSize: 12, color: "#141413", fontFamily: FF }}>{s.assignment_title}</td>
                              <td style={{ padding: "8px 8px", fontSize: 11, color: "#9ca3af", fontFamily: FF, whiteSpace: "nowrap", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>{s.course_title}</td>
                              <td style={{ padding: "8px 8px" }}>
                                <span style={{ padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: g.bg, color: g.color, whiteSpace: "nowrap" }}>{g.text}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </C3D>

              {/* Activity Log */}
              <C3D delay={240}>
                <SLabel>Activity Log</SLabel>
                {(data.activity as any[]).length === 0 ? (
                  <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: FF, textAlign: "center", padding: "10px 0" }}>No activity recorded</div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: `linear-gradient(180deg,${GOLD},rgba(201,136,58,0.12))`, borderRadius: 2 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {(data.activity as any[]).map((a: any, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", animation: "lmai-pageIn 0.3s ease both", animationDelay: `${260 + i * 35}ms` }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#F8F7F4", border: `2px solid ${actColor(a.type)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, position: "relative" }}>
                            {actIcon(a.type)}
                          </div>
                          <div style={{ paddingTop: 2 }}>
                            <div style={{ fontSize: 12.5, color: "#141413", fontFamily: FF, lineHeight: 1.5 }}>{a.description}</div>
                            <div style={{ fontSize: 11, color: "rgba(20,20,19,0.40)", fontFamily: FF, marginTop: 2 }}>{reltime(a.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </C3D>
            </>
          )}
        </div>
      </div>

      {unenrolling && (
        <UnenrollConfirmModal
          courseName={unenrolling.course_title}
          studentName={data?.name ?? studentName}
          onConfirm={confirmUnenroll}
          onCancel={() => setUnenrolling(null)}
          loading={unenrollLoading}
        />
      )}
    </>
  );
}

// ── StudentsView (enhanced) ────────────────────────────────────────────────────
function StudentsView({ token }: { token: string }) {
  const [students, setStudents] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [filterKey, setFilterKey] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/lma/instructor/students/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setStudents(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setFilterKey(k => k + 1); }, [search, courseFilter, statusFilter]);

  const courses = useMemo(() => {
    const s = new Set<string>();
    students.forEach(st => s.add(st.course_title));
    return Array.from(s).sort();
  }, [students]);

  const filtered = useMemo(() => students.filter(s => {
    const q = search.toLowerCase();
    const ok = !q || s.student_name.toLowerCase().includes(q) || s.student_email.toLowerCase().includes(q) || s.course_title.toLowerCase().includes(q);
    const okC = courseFilter === "All" || s.course_title === courseFilter;
    const okS = statusFilter === "All"
      || (statusFilter === "Completed"   &&  s.completed)
      || (statusFilter === "In Progress" && !s.completed && s.progress > 0)
      || (statusFilter === "Not Started" && !s.completed && s.progress === 0);
    return ok && okC && okS;
  }), [students, search, courseFilter, statusFilter]);

  const selectStyle: React.CSSProperties = {
    ...inputStyle, padding: "8px 28px 8px 10px", fontSize: 13, cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 9px center",
    appearance: "none",
  };

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Students</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} color="#9ca3af" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
              style={{ ...inputStyle, width: 190, padding: "8px 12px 8px 30px" }} onFocus={focusGold} onBlur={blurGold} />
          </div>
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={{ ...selectStyle, width: 160 }} onFocus={focusGold} onBlur={blurGold}>
            <option value="All">All Courses</option>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...selectStyle, width: 136 }} onFocus={focusGold} onBlur={blurGold}>
            {(["All", "In Progress", "Completed", "Not Started"] as const).map(v => (
              <option key={v} value={v}>{v === "All" ? "All Status" : v}</option>
            ))}
          </select>
        </div>
      </div>

      {!loading && (
        <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.42)", fontFamily: FF, marginBottom: 10 }}>
          {filtered.length === students.length
            ? `${students.length} enrollment${students.length !== 1 ? "s" : ""}`
            : `${filtered.length} of ${students.length} showing`}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[0,1,2,3,4].map(i => <SkeletonBox key={i} h={60} />)}</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "56px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <Users size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>
            {search || courseFilter !== "All" || statusFilter !== "All" ? "No students match your filters." : "No students enrolled yet."}
          </p>
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
            <tbody key={filterKey}>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => { setSelectedStudentId(s.student_id); setSelectedStudentName(s.student_name); }}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", cursor: "pointer", animation: "lmai-rowIn 0.28s ease both", animationDelay: `${Math.min(i * 45, 450)}ms` }}
                  className="lmai-tr"
                >
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
                  <td style={{ padding: "12px 16px", fontSize: 11.5, color: "#9ca3af", whiteSpace: "nowrap" }}>{new Date(s.enrolled_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.08)", overflow: "hidden", maxWidth: 80 }}>
                        <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${AMBER},${GOLD})`, width: `${s.progress}%` }} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: GOLD }}>{s.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: s.completed ? "#d1fae5" : s.progress > 0 ? "#fef3c7" : "#f3f4f6", color: s.completed ? "#059669" : s.progress > 0 ? "#d97706" : "#6b7280" }}>
                      {s.completed ? "Completed" : s.progress > 0 ? "In Progress" : "Not Started"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedStudentId !== null && (
        <StudentDetailPanel
          studentId={selectedStudentId}
          token={token}
          studentName={selectedStudentName}
          onClose={() => setSelectedStudentId(null)}
          onUnenrolled={enrollmentId => setStudents(prev => prev.filter(r => r.id !== enrollmentId))}
        />
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
            <Tooltip contentStyle={{ borderRadius: 10, fontFamily: FF, fontSize: 12 }} formatter={(v) => [`₹${Number(v ?? 0).toLocaleString()}`, "Revenue"]} />
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

function AnalyticsView({ token, isSuperInstructor }: { token: string; isSuperInstructor: boolean }) {
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
                <Tooltip contentStyle={{ borderRadius: 10, fontFamily: FF, fontSize: 12 }} formatter={(v) => [Number(v ?? 0), "Students"]} />
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
                    ...(isSuperInstructor ? [{ label: "Revenue", value: `₹${(c.revenue ?? 0).toLocaleString()}`, color: "#8b5cf6" }] : []),
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
              <button type="button" onClick={() => onGrade(s)} style={{
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

// ── ManageInstructorsView ─────────────────────────────────────────────────────
function ManageInstructorsView({ token, showToast }: { token: string; showToast: (m: string, t?: "success" | "error") => void }) {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/lma/instructor/instructors/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setInstructors(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const createInstructor = async () => {
    if (!form.name || !form.email || !form.password) { showToast("Name, email and password required", "error"); return; }
    setSaving(true);
    try {
      const r = await fetch(`${API}/lma/instructor/create-instructor/`, {
        method: "POST", headers: hdr(token), body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) { showToast(d.error || "Failed to create instructor", "error"); return; }
      showToast(`Instructor ${form.name} created!`);
      setShowForm(false);
      setForm({ name: "", email: "", password: "", bio: "" });
      load();
    } catch { showToast("Network error", "error"); } finally { setSaving(false); }
  };

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Manage Instructors</h2>
        <button type="button" onClick={() => setShowForm(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806", border: "none", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FF, boxShadow: "0 4px 0 rgba(140,80,20,0.30)" }}>
          <PlusCircle size={15} /> Add Instructor
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: FF }}>New Regular Instructor</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <Field label="Full Name">
              <input style={inputStyle} value={form.name} placeholder="e.g. Sarah Khan" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
            </Field>
            <Field label="Email">
              <input type="email" style={inputStyle} value={form.email} placeholder="e.g. sarah@company.com" onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <Field label="Temporary Password">
              <input type="password" style={inputStyle} value={form.password} placeholder="Min 6 characters" onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
            </Field>
            <Field label="Bio (optional)">
              <input style={inputStyle} value={form.bio} placeholder="Brief introduction…" onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} onFocus={focusGold} onBlur={blurGold} />
            </Field>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
            <button type="button" onClick={createInstructor} disabled={saving} style={{ flex: 2, padding: "10px", borderRadius: 9, border: "none", background: `linear-gradient(135deg,${AMBER},${GOLD})`, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#0a0806", opacity: saving ? 0.7 : 1 }}>{saving ? "Creating…" : "Create Instructor →"}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[0,1,2].map(i => <SkeletonBox key={i} h={70} />)}</div>
      ) : instructors.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "56px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <Users size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>No instructors yet. Add your first one above.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Instructor", "Email", "Level", "Courses", "Joined"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instructors.map((ins: any, i: number) => (
                <tr key={ins.id} style={{ borderBottom: i < instructors.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }} className="lmai-tr">
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#0a0806" }}>{avatarInit(ins.name)}</div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#141413", fontFamily: FF }}>{ins.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#6b7280", fontFamily: FF }}>{ins.email}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: ins.instructor_level === "super" ? "rgba(139,92,246,0.10)" : "rgba(201,136,58,0.10)", color: ins.instructor_level === "super" ? "#7c3aed" : GOLD }}>
                      {ins.instructor_level}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#141413", fontFamily: FF }}>{ins.course_count}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "#9ca3af" }}>{new Date(ins.date_joined).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── PendingReviewsView ────────────────────────────────────────────────────────
function PendingReviewsView({ token, showToast, initialCourses, onRefresh }: {
  token: string;
  showToast: (m: string, t?: "success" | "error") => void;
  initialCourses: any[];
  onRefresh: () => void;
}) {
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actioning, setActioning] = useState<number | null>(null);

  // Keep in sync when parent re-fetches dashboard data
  useEffect(() => { setCourses(initialCourses); }, [initialCourses]);

  const publish = async (id: number) => {
    setActioning(id);
    try {
      const r = await fetch(`${API}/lma/courses/${id}/publish/`, { method: "PUT", headers: hdr(token) });
      const d = await r.json();
      if (!r.ok) { showToast(d.error || "Failed", "error"); return; }
      showToast("Course published!"); onRefresh();
    } catch { showToast("Network error", "error"); } finally { setActioning(null); }
  };

  const reject = async (id: number) => {
    if (!rejectReason.trim()) { showToast("Enter a rejection reason", "error"); return; }
    setActioning(id);
    try {
      const r = await fetch(`${API}/lma/courses/${id}/reject/`, {
        method: "PUT", headers: hdr(token), body: JSON.stringify({ reason: rejectReason }),
      });
      const d = await r.json();
      if (!r.ok) { showToast(d.error || "Failed", "error"); return; }
      showToast("Course rejected — instructor notified.");
      setRejectingId(null); setRejectReason(""); onRefresh();
    } catch { showToast("Network error", "error"); } finally { setActioning(null); }
  };

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>
        Pending Reviews
        {courses.length > 0 && <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 700, color: "#d97706", background: "#fef3c7", padding: "3px 10px", borderRadius: 999 }}>{courses.length}</span>}
      </h2>
      {courses.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "56px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <Check size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>No courses awaiting review.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {courses.map((c: any, i: number) => (
            <div key={c.id} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid rgba(0,0,0,0.07)", borderLeft: `4px solid #d97706`, boxShadow: BCARD, animation: "lmai-pageIn 0.40s ease both", animationDelay: `${i * 60}ms` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#141413", marginBottom: 4, fontFamily: FF }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, fontFamily: FF }}>By {c.instructor_name} · {c.category} · {c.level}</div>
                  <div style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.5, fontFamily: FF }}>{c.description}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "flex-start" }}>
                  <button type="button" onClick={() => publish(c.id)} disabled={actioning === c.id}
                    style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FF, opacity: actioning === c.id ? 0.7 : 1 }}>
                    {actioning === c.id ? "…" : "Publish ✓"}
                  </button>
                  <button type="button" onClick={() => { setRejectingId(c.id); setRejectReason(""); }}
                    style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1.5px solid rgba(220,38,38,0.20)", borderRadius: 9, padding: "9px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FF }}>
                    Reject
                  </button>
                </div>
              </div>
              {rejectingId === c.id && (
                <div style={{ marginTop: 14, borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 14 }}>
                  <textarea rows={2} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection (required)…"
                    style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }} onFocus={focusGold} onBlur={blurGold} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => { setRejectingId(null); setRejectReason(""); }} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
                    <button type="button" onClick={() => reject(c.id)} disabled={actioning === c.id} style={{ flex: 2, padding: "9px", borderRadius: 8, border: "none", background: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#fff", opacity: actioning === c.id ? 0.7 : 1 }}>
                      {actioning === c.id ? "Rejecting…" : "Send Rejection"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ApplicationsView ─────────────────────────────────────────────────────────
function ApplicationsView({ token, showToast }: {
  token: string; showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [apps, setApps]             = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [expanded, setExpanded]     = useState<Record<number, boolean>>({});
  const [actioning, setActioning]   = useState<number | null>(null);
  const [rejectId, setRejectId]     = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}/lma/instructor/applications/`, { headers: hdr(token) });
      if (!r.ok) return;
      const d = await r.json();
      setApps(Array.isArray(d) ? d : (d.applications ?? []));
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const visible = apps.filter(a => filter === "all" || a.status === filter);

  const approve = async (id: number) => {
    setActioning(id);
    try {
      const r = await fetch(`${API}/lma/instructor/applications/${id}/approve/`, { method: "POST", headers: hdr(token) });
      const d = await r.json();
      if (!r.ok) { showToast(d.error || "Approve failed", "error"); return; }
      showToast("Application approved — credentials sent via email!");
      load();
    } catch { showToast("Network error", "error"); } finally { setActioning(null); }
  };

  const reject = async () => {
    if (!rejectId || !rejectReason.trim()) { showToast("Rejection reason required", "error"); return; }
    setActioning(rejectId);
    try {
      const r = await fetch(`${API}/lma/instructor/applications/${rejectId}/reject/`, {
        method: "POST", headers: hdr(token), body: JSON.stringify({ reason: rejectReason }),
      });
      if (!r.ok) { showToast("Reject failed", "error"); return; }
      showToast("Application rejected — applicant notified.");
      setRejectId(null); setRejectReason(""); load();
    } catch { showToast("Network error", "error"); } finally { setActioning(null); }
  };

  const STATUS_PILL: Record<string, { bg: string; color: string; label: string }> = {
    pending:  { bg: "#fef3c7", color: "#d97706", label: "Pending" },
    approved: { bg: "#d1fae5", color: "#059669", label: "Approved" },
    rejected: { bg: "#fee2e2", color: "#dc2626", label: "Rejected" },
  };

  return (
    <div style={{ animation: "lmai-pageIn 0.32s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>
          Instructor Applications
          {apps.filter(a => a.status === "pending").length > 0 && (
            <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 700, color: "#d97706", background: "#fef3c7", padding: "2px 10px", borderRadius: 999 }}>
              {apps.filter(a => a.status === "pending").length} pending
            </span>
          )}
        </h2>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "pending", "approved", "rejected"] as const).map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              style={{ padding: "6px 14px", borderRadius: 9, border: `1.5px solid ${filter === f ? GOLD : "rgba(0,0,0,0.10)"}`, background: filter === f ? "rgba(201,136,58,0.10)" : "#fff", fontSize: 12.5, fontWeight: filter === f ? 700 : 500, color: filter === f ? GOLD : "#6b7280", cursor: "pointer", fontFamily: FF, transition: "all 150ms" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[0,1,2].map(i => <SkeletonBox key={i} h={80} />)}</div>
      ) : visible.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "60px 32px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <FileCheck size={44} color="#d1d5db" style={{ display: "block", margin: "0 auto 14px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0, fontFamily: FF }}>
            {filter === "all" ? "No applications yet." : `No ${filter} applications.`}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {visible.map((app: any, i: number) => {
            const pill = STATUS_PILL[app.status] ?? STATUS_PILL.pending;
            const isExp = !!expanded[app.id];
            return (
              <div key={app.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", borderLeft: `4px solid ${pill.color}`, boxShadow: BCARD, animation: "lmai-pageIn 0.38s ease both", animationDelay: `${i * 50}ms` }}>
                {/* Card header */}
                <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => setExpanded(e => ({ ...e, [app.id]: !e[app.id] }))}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, fontWeight: 800, color: "#0a0806" }}>
                    {avatarInit(app.full_name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#141413", fontFamily: FF }}>{app.full_name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", fontFamily: FF, marginTop: 2 }}>{app.email}{app.expertise ? ` · ${app.expertise}` : ""}</div>
                  </div>
                  <span style={{ ...pill, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, flexShrink: 0 }}>{pill.label}</span>
                  <ChevronDown size={16} color="#9ca3af" style={{ transition: "transform 200ms", transform: isExp ? "rotate(180deg)" : "none", flexShrink: 0 }} />
                </div>

                {/* Expandable body */}
                {isExp && (
                  <div style={{ padding: "0 20px 18px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ paddingTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      {app.phone && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(20,20,19,0.40)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FF, marginBottom: 3 }}>Phone</div>
                          <div style={{ fontSize: 13, color: "#141413", fontFamily: FF }}>{app.phone}</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(20,20,19,0.40)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FF, marginBottom: 3 }}>Applied</div>
                        <div style={{ fontSize: 13, color: "#141413", fontFamily: FF }}>{new Date(app.applied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>
                    </div>

                    {app.bio && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(20,20,19,0.40)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FF, marginBottom: 4 }}>Bio</div>
                        <p style={{ fontSize: 13, color: "#374151", fontFamily: FF, lineHeight: 1.6, margin: 0, background: "#f9f7f4", borderRadius: 8, padding: "10px 12px" }}>{app.bio}</p>
                      </div>
                    )}

                    {app.why_teach && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(20,20,19,0.40)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FF, marginBottom: 4 }}>Why They Want to Teach</div>
                        <p style={{ fontSize: 13, color: "#374151", fontFamily: FF, lineHeight: 1.6, margin: 0, background: "#f9f7f4", borderRadius: 8, padding: "10px 12px" }}>{app.why_teach}</p>
                      </div>
                    )}

                    {app.rejection_reason && app.status === "rejected" && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FF, marginBottom: 4 }}>Rejection Reason</div>
                        <p style={{ fontSize: 13, color: "#dc2626", fontFamily: FF, lineHeight: 1.6, margin: 0, background: "#fee2e2", borderRadius: 8, padding: "10px 12px" }}>{app.rejection_reason}</p>
                      </div>
                    )}

                    {app.status === "pending" && (
                      <div style={{ display: "flex", gap: 10 }}>
                        <button type="button" onClick={() => approve(app.id)} disabled={actioning === app.id}
                          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, opacity: actioning === app.id ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <Check size={14} />{actioning === app.id ? "Processing…" : "Approve & Send Credentials"}
                        </button>
                        <button type="button" onClick={() => setRejectId(app.id)}
                          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #dc2626", background: "transparent", color: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject modal */}
      {rejectId !== null && (
        <>
          <div onClick={() => { setRejectId(null); setRejectReason(""); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 700 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 701, width: 380, padding: "28px 26px", background: "#fff", borderRadius: 18, borderTop: "3px solid #dc2626", boxShadow: "0 24px 80px rgba(0,0,0,0.20)", animation: "lmai-scaleIn 0.22s cubic-bezier(0.22,1,0.36,1) both" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Reject Application</h3>
            <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 16px", fontFamily: FF }}>The applicant will receive an email with this reason.</p>
            <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Explain why the application was not accepted…"
              style={{ ...inputStyle, resize: "vertical", marginBottom: 16 }} onFocus={focusGold} onBlur={blurGold} />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => { setRejectId(null); setRejectReason(""); }} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
              <button type="button" onClick={reject} disabled={actioning !== null} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#fff", opacity: actioning !== null ? 0.7 : 1 }}>
                {actioning !== null ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LMAInstructorDashboard() {
  const navigate = useNavigate();
  const name            = localStorage.getItem("lma_name") ?? "Instructor";
  const token           = localStorage.getItem("lma_token") ?? "";
  const canInstructor   = localStorage.getItem("lma_can_instructor") === "true";
  const instructorLevel = localStorage.getItem("lma_instructor_level") ?? "regular";
  const isSuperInstructor = instructorLevel === "super";

  const [sideOpen, setSideOpen] = useState(false);
  const [active, setActive] = useState<Section>("Dashboard");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [bellOpen, setBellOpen]           = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    if (!token) return;
    fetch(`${API}/lma/notifications/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setNotifications(d.notifications ?? []); setUnreadCount(d.unread_count ?? 0); } })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(iv);
  }, [fetchNotifications]);

  // Close bell dropdown when clicking outside
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const markRead = async (id: number) => {
    await fetch(`${API}/lma/notifications/${id}/read/`, { method: "POST", headers: hdr(token) });
    fetchNotifications();
  };

  const markAllRead = async () => {
    await fetch(`${API}/lma/notifications/read-all/`, { method: "POST", headers: hdr(token) });
    fetchNotifications();
  };

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

  useEffect(() => {
    if (!token || !canInstructor) return;
    loadDashboard();
    const iv = setInterval(loadDashboard, 30_000);
    return () => clearInterval(iv);
  }, [loadDashboard, token, canInstructor]);

  const logout = () => {
    ["lma_token", "lma_role", "lma_can_instructor", "lma_instructor_level", "lma_name"].forEach(k => localStorage.removeItem(k));
    navigate("/lma/login");
  };

  const handleSubmitReview = async (course: any) => {
    try {
      const r = await fetch(`${API}/lma/courses/${course.id}/submit-for-review/`, {
        method: "POST", headers: hdr(token),
      });
      const d = await r.json();
      if (!r.ok) { showToast(d.error || "Failed to submit", "error"); return; }
      showToast("Course submitted for review!");
      loadDashboard();
    } catch { showToast("Network error", "error"); }
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
  const pendingReviewCourses: any[] = courses.filter((c: any) => c.status === "pending_review");

  const onDeleteConfirm = async () => {
    if (!deletingCourse) return;
    try {
      const r = await fetch(`${API}/lma/courses/${deletingCourse.id}/delete/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (r.status === 400) {
        const body = await r.json().catch(() => ({}));
        showToast(body.error ?? "Cannot delete this course.", "error");
        setDeletingCourse(null);
        return;
      }
      if (!r.ok) throw new Error("Delete failed");
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
    ...(isSuperInstructor ? [{ section: "REVIEW", items: [
      { icon: ClipboardList, label: "Pending Reviews" as Section },
    ]}] : []),
    ...(isSuperInstructor ? [{ section: "ANALYTICS", items: [
      { icon: DollarSign, label: "Earnings" as Section },
      { icon: BarChart2,  label: "Analytics" as Section },
      { icon: Star,       label: "Reviews" as Section },
    ]}] : [{ section: "ANALYTICS", items: [
      { icon: BarChart2, label: "Analytics" as Section },
      { icon: Star,      label: "Reviews" as Section },
    ]}]),
    { section: "TEACHING", items: [
      { icon: ClipboardList, label: "Assignments" as Section },
    ]},
    ...(isSuperInstructor ? [{ section: "ADMIN", items: [
      { icon: Users,      label: "Instructors" as Section },
      { icon: FileCheck,  label: "Applications" as Section },
    ]}] : []),
  ];

  const renderSection = () => {
    if (loading && active === "Dashboard") return (
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: `3px solid rgba(201,136,58,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lmai-spin 0.8s linear infinite", display: "inline-block" }} />
      </div>
    );
    switch (active) {
      case "Dashboard":      return <DashboardView data={data} earningsChart={earningsChart} onGrade={setGradingSub} isSuperInstructor={isSuperInstructor} />;
      case "My Courses":     return <CoursesView courses={courses} loading={false} isSuperInstructor={isSuperInstructor} onEdit={setEditCourse} onManage={setManageCourse} onDelete={setDeletingCourse} onCreate={() => setShowCreate(true)} onSubmitReview={handleSubmitReview} />;
      case "Students":       return <StudentsView token={token} />;
      case "Earnings":       return isSuperInstructor ? <EarningsView data={data} earningsChart={earningsChart} /> : null;
      case "Analytics":      return <AnalyticsView token={token} isSuperInstructor={isSuperInstructor} />;
      case "Reviews":        return <ReviewsView token={token} />;
      case "Assignments":    return <AssignmentsView data={data} onGrade={setGradingSub} />;
      case "Instructors":    return isSuperInstructor ? <ManageInstructorsView token={token} showToast={showToast} /> : null;
      case "Pending Reviews": return isSuperInstructor ? <PendingReviewsView token={token} showToast={showToast} initialCourses={pendingReviewCourses} onRefresh={loadDashboard} /> : null;
      case "Applications":   return isSuperInstructor ? <ApplicationsView token={token} showToast={showToast} /> : null;
      default:               return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f2ef", fontFamily: FF }}>
      {sideOpen && <div onClick={() => setSideOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.40)", zIndex: 199 }} />}

      {/* Sidebar */}
      <aside className={`lmai-sidebar${sideOpen ? " open" : ""}`} style={{ width: 240, background: DARK, flexShrink: 0, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 200, overflowY: "auto" }}>
        <div style={{ padding: "22px 16px 14px" }}>
          <Link to="/"><img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 60, width: "auto" }} /></Link>
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
          <button type="button" onClick={() => setSideOpen(o => !o)} className="lmai-menu-btn"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#141413", display: "none" }}>
            {sideOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#141413", fontFamily: FF }}>
              Instructor · <span style={{ color: GOLD, fontWeight: 800 }}>{name.split(" ")[0]}</span>
            </span>
          </div>
          <button type="button" onClick={() => { setShowCreate(true); setActive("My Courses"); }} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806",
            fontSize: 13, fontWeight: 700, border: "none", borderRadius: 9, padding: "9px 18px",
            cursor: "pointer", boxShadow: "0 2px 0 rgba(140,80,20,0.35)", fontFamily: FF,
          }}>
            <PlusCircle size={15} /> New Course
          </button>
          {/* Bell with dropdown */}
          <div ref={bellRef} style={{ position: "relative" }}>
            <button type="button" onClick={() => setBellOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#6b7280", position: "relative" }}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {bellOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320, background: "#fff", borderRadius: 14, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.08)", zIndex: 500, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#141413", fontFamily: FF }}>Notifications</span>
                  {unreadCount > 0 && <button type="button" onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: GOLD, fontWeight: 700, fontFamily: FF }}>Mark all read</button>}
                </div>
                <div style={{ maxHeight: 320, overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "28px 16px", textAlign: "center", color: "#9ca3af", fontSize: 13, fontFamily: FF }}>No notifications</div>
                  ) : notifications.map((n: any) => (
                    <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer", background: n.is_read ? "#fff" : "rgba(201,136,58,0.05)", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f9f7f4")}
                      onMouseLeave={e => (e.currentTarget.style.background = n.is_read ? "#fff" : "rgba(201,136,58,0.05)")}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        {!n.is_read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, flexShrink: 0, marginTop: 5 }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#141413", fontFamily: FF, marginBottom: 2 }}>{n.title}</div>
                          <div style={{ fontSize: 11.5, color: "#6b7280", fontFamily: FF, lineHeight: 1.4 }}>{n.message}</div>
                          <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0806", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            {avatarInit(name)}
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px" }}>{renderSection()}</main>
      </div>

      {/* Panels & Dialogs */}
      {showCreate && (
        <CourseFormPanel token={token} isSuperInstructor={isSuperInstructor} onClose={() => setShowCreate(false)} showToast={showToast}
          onSaved={() => { setShowCreate(false); loadDashboard(); setActive("My Courses"); }} />
      )}
      {editCourse && (
        <CourseFormPanel token={token} isSuperInstructor={isSuperInstructor} course={editCourse} onClose={() => setEditCourse(null)} showToast={showToast}
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
        @keyframes lmai-fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes lmai-rowIn    { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes lmai-scaleIn  { from { opacity:0; transform:translate(-50%,-48%) scale(0.94); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }
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
