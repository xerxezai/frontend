import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, CheckCircle2, X, Loader } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

interface Assignment {
  id: number;
  title: string;
  description: string;
  course_title: string;
  course_id: number;
  due_date: string;
  submitted: boolean;
  submission_id: number | null;
  grade: number | null;
  overdue: boolean;
}

type FilterTab = "All" | "Pending" | "Submitted" | "Overdue";

/* ── Card3D ── */
const Card3D = ({ children, accent = GOLD, style = {}, p = "20px" }: {
  children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(false);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
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
        background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)",
        borderLeft: `4px solid ${accent}`,
        boxShadow: h ? BHOV : BCARD,
        transition: "box-shadow 0.28s ease",
        padding: p, position: "relative", willChange: "transform",
        display: "flex", alignItems: "flex-start", gap: 16,
        ...style,
      }}>
      {children}
    </div>
  );
};

/* ── Skeleton ── */
const SkeletonRow = () => (
  <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)", borderLeft: "4px solid #f0ede8", padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite", flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ height: 14, borderRadius: 7, width: "60%", marginBottom: 8, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
      <div style={{ height: 11, borderRadius: 5.5, width: "40%", background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    </div>
    <div style={{ width: 80, height: 30, borderRadius: 8, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite", flexShrink: 0 }} />
  </div>
);

/* ── Submit Modal ── */
const SubmitModal = ({ assignment, token, onClose, onSuccess }: {
  assignment: Assignment; token: string; onClose: () => void; onSuccess: (id: number) => void;
}) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!content.trim()) { setError("Please write your submission."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`${API}/lma/assignments/${assignment.id}/submit/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Submission failed");
      onSuccess(assignment.id);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: 28, width: "100%", maxWidth: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.20)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 4px", fontFamily: FF }}>Submit Assignment</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, fontFamily: FF }}>{assignment.title}</p>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#9ca3af" }}>
            <X size={20} />
          </button>
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your submission here…"
          rows={6}
          style={{
            width: "100%", padding: "12px 14px", borderRadius: 10,
            border: "1.5px solid rgba(0,0,0,0.12)", fontSize: 14, fontFamily: FF,
            resize: "vertical", outline: "none", color: "#141413",
            boxSizing: "border-box",
          }}
        />
        {error && <p style={{ color: "#dc2626", fontSize: 13, margin: "8px 0 0", fontFamily: FF }}>{error}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid rgba(0,0,0,0.12)", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>
            Cancel
          </button>
          <button type="button" onClick={submit} disabled={submitting} style={{
            flex: 2, padding: "10px", borderRadius: 9, border: "none",
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            color: "#0a0806", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: submitting ? 0.7 : 1,
          }}>
            {submitting ? <><Loader size={14} style={{ animation: "lma-spin 1s linear infinite" }} /> Submitting…</> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Status badge ── */
const StatusBadge = ({ a }: { a: Assignment }) => {
  if (a.grade !== null) return (
    <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.10)", padding: "3px 10px", borderRadius: 999 }}>
      Graded: {a.grade}/100
    </span>
  );
  if (a.submitted) return (
    <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.10)", padding: "3px 10px", borderRadius: 999 }}>
      Submitted
    </span>
  );
  if (a.overdue) return (
    <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.10)", padding: "3px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626", display: "inline-block", animation: "lma-pulse 1.2s infinite" }} />
      Overdue
    </span>
  );
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, background: "rgba(201,136,58,0.10)", padding: "3px 10px", borderRadius: 999 }}>
      Pending
    </span>
  );
};

const accentColor = (a: Assignment) => {
  if (a.overdue) return "#ef4444";
  if (a.submitted) return "#10b981";
  return GOLD;
};

export default function LMAAssignmentsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("All");
  const [modalItem, setModalItem] = useState<Assignment | null>(null);

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/student/assignments/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAssignments(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const filtered = assignments.filter(a => {
    if (tab === "All") return true;
    if (tab === "Pending") return !a.submitted && !a.overdue;
    if (tab === "Submitted") return a.submitted;
    if (tab === "Overdue") return a.overdue;
    return true;
  });

  const handleSubmitSuccess = (id: number) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, submitted: true } : a));
    setModalItem(null);
  };

  const tabs: FilterTab[] = ["All", "Pending", "Submitted", "Overdue"];

  const pendingCount = assignments.filter(a => !a.submitted && !a.overdue).length;

  return (
    <LMAStudentLayout pendingBadge={pendingCount}>
      {modalItem && (
        <SubmitModal
          assignment={modalItem}
          token={token}
          onClose={() => setModalItem(null)}
          onSuccess={handleSubmitSuccess}
        />
      )}
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Assignments</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map(t => (
              <button type="button" key={t} onClick={() => setTab(t)} style={{
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[0, 1, 2, 3].map(i => <SkeletonRow key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <CheckCircle2 size={48} color="#d1d5db" style={{ display: "block", margin: "0 auto 16px" }} />
            <p style={{ color: "#9ca3af", fontSize: 15, margin: 0, fontFamily: FF }}>
              {tab === "All" ? "No assignments from enrolled courses." : `No ${tab.toLowerCase()} assignments.`}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((a, i) => {
              const due = new Date(a.due_date);
              const accent = accentColor(a);
              return (
                <Card3D key={a.id} accent={accent}
                  style={{ animation: "lmaPage-in 0.40s ease both", animationDelay: `${i * 80}ms` }}>
                  {/* Icon */}
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ClipboardList size={18} color={accent} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", marginBottom: 3, fontFamily: FF }}>
                      {a.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8, fontFamily: FF }}>
                      {a.course_title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <StatusBadge a={a} />
                      <span style={{ fontSize: 11, color: a.overdue ? "#dc2626" : "#9ca3af", fontWeight: a.overdue ? 700 : 400, fontFamily: FF }}>
                        Due: {due.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    {a.description && (
                      <p style={{ fontSize: 12, color: "rgba(20,20,19,0.50)", margin: "8px 0 0", lineHeight: 1.5, fontFamily: FF, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {a.description}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  {!a.submitted && (
                    <button type="button" onClick={() => setModalItem(a)} style={{
                      flexShrink: 0, padding: "8px 16px", borderRadius: 9,
                      border: `1.5px solid ${GOLD}`,
                      background: "none", color: GOLD, fontSize: 12, fontWeight: 700,
                      cursor: "pointer", fontFamily: FF, whiteSpace: "nowrap",
                      transition: "all 0.18s ease",
                    }}>
                      Submit
                    </button>
                  )}
                </Card3D>
              );
            })}
          </div>
        )}
      </div>
    </LMAStudentLayout>
  );
}
