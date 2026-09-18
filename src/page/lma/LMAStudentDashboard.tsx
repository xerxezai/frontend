import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen, Play,
  Award, ChevronRight,
  BookMarked, CheckCircle2,
  ClipboardList, Star, Clock,
  AlertCircle, RefreshCw, Sparkles,
  Eye, Share2, Download, X,
  GraduationCap,
} from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";
import { downloadCertificatePDF } from "./certificatePdf";

const GOLD  = "#D93522";
const AMBER = "#D93522";
const DARK  = "#071a33";
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

/* ── Motivational message based on progress ── */
const motivationFor = (pct: number) => {
  if (pct >= 100) return "🎉 Course complete — amazing work!";
  if (pct >= 70)  return "Almost there — keep it up!";
  if (pct >= 30)  return "You're making solid progress.";
  if (pct > 0)    return "Great start — keep the momentum going.";
  return "Let's get started on your first lesson.";
};

/* ── Assignment due-date badge: OVERDUE / DUE TODAY / DUE SOON (≤7 days) ── */
const dueBadge = (dueDate: string) => {
  const due = new Date(dueDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const daysUntil = Math.round((startOfDue.getTime() - startOfToday.getTime()) / 86400000);

  if (daysUntil < 0) return { label: "OVERDUE", bg: "#fee2e2", fg: "#dc2626", tile: "#fee2e2" };
  if (daysUntil === 0) return { label: "DUE TODAY", bg: "#ffedd5", fg: "#c2410c", tile: "#ffedd5" };
  if (daysUntil <= 7) return { label: "DUE SOON", bg: "#fef9c3", fg: "#a16207", tile: "#fef9c3" };
  return { label: null, bg: "rgba(217,53,34,0.10)", fg: GOLD, tile: "rgba(217,53,34,0.10)" };
};

/* ── Certificate preview modal ── */
const CertPreviewModal = ({ cert, studentName, onClose, onDownload }: {
  cert: { id: number; course_title: string; issued_at: string };
  studentName: string;
  onClose: () => void;
  onDownload: () => void;
}) => (
  <div
    onClick={onClose}
    style={{ position: "fixed", inset: 0, background: "rgba(7,26,51,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
  >
    <div onClick={e => e.stopPropagation()} style={{
      background: "#fff", borderRadius: 20, maxWidth: 520, width: "100%", overflow: "hidden",
      boxShadow: "0 40px 100px rgba(0,0,0,0.35)", animation: "lmaPage-in 0.24s ease both",
    }}>
      <div style={{
        position: "relative", background: `linear-gradient(135deg,${DARK},#04101f)`,
        padding: "40px 32px", textAlign: "center",
        border: `10px solid transparent`, borderImage: `linear-gradient(135deg,${AMBER},${GOLD}) 1`,
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.10)", border: "none",
          borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#fff",
        }}>
          <X size={16} />
        </button>
        <GraduationCap size={30} color={AMBER} style={{ marginBottom: 10 }} />
        <div style={{ fontSize: 10, color: AMBER, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
          Certificate of Completion
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>This certifies that</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10, fontFamily: FF }}>{studentName}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>has successfully completed</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: AMBER, marginBottom: 14, fontFamily: FF }}>{cert.course_title}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)" }}>
          Issued {new Date(cert.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, padding: 18 }}>
        <button onClick={onDownload} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: GOLD, color: "#fff", fontWeight: 700, fontSize: 13, border: "none",
          borderRadius: 10, padding: "12px", cursor: "pointer", fontFamily: FF, minHeight: 44,
        }}>
          <Download size={15} /> Download PDF
        </button>
      </div>
    </div>
  </div>
);

export default function LMAStudentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("lma_name") ?? "Student";
  const token = localStorage.getItem("lma_token");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [previewCert, setPreviewCert] = useState<{ id: number; course_title: string; issued_at: string } | null>(null);

  const loadDashboard = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true);
    setError(false);
    fetch(`${API}/lma/student/dashboard/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const firstEnrollment = data?.enrollments?.[0];
  const hasEnrollments = (data?.enrollments?.length ?? 0) > 0;

  const shareOnLinkedIn = (courseTitle: string) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://www.xerxez.com/lma")}&title=${encodeURIComponent(`I just earned a certificate in ${courseTitle} from XERXEZ Academy!`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <LMAStudentLayout pendingBadge={data?.stats?.pending_assignments}>
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>

        {/* ── Error state ── */}
        {error && !loading ? (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "56px 24px", textAlign: "center",
            border: "1px solid rgba(220,38,38,0.20)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}>
            <AlertCircle size={44} color="#dc2626" style={{ display: "block", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 8px", fontFamily: FF }}>
              Unable to load your dashboard
            </h3>
            <p style={{ color: "#9ca3af", fontSize: 13.5, margin: "0 0 24px", fontFamily: FF }}>
              Please refresh or try again.
            </p>
            <button onClick={loadDashboard} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: GOLD, color: "#fff", fontWeight: 700, fontSize: 13.5,
              border: "none", borderRadius: 10, padding: "11px 26px", cursor: "pointer",
              fontFamily: FF, minHeight: 44,
            }}>
              <RefreshCw size={15} /> Retry
            </button>
          </div>
        ) : (
        <>

        {/* ── Welcome Banner ── */}
        <div style={{
          background: `linear-gradient(135deg,${DARK} 0%,#04101f 100%)`,
          borderRadius: 20, padding: "28px 32px", marginBottom: 24,
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
        }}>
          <div style={{ position: "absolute", top: -40, right: 100, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(217,53,34,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 60, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(217,53,34,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 10, color: AMBER, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
              {hasEnrollments ? "Continue where you left off" : "Welcome"}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 6px", maxWidth: 380 }}>
              {loading
                ? "Loading…"
                : hasEnrollments
                  ? `Welcome back, ${name.split(" ")[0]}!`
                  : "Welcome to XERXEZ Academy!"}
            </h2>
            {!loading && (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "0 0 14px", maxWidth: 340, lineHeight: 1.5 }}>
                {hasEnrollments ? (
                  <>
                    {firstEnrollment?.course_title} — {motivationFor(firstEnrollment?.progress ?? 0)}
                  </>
                ) : (
                  "Browse our courses to get started."
                )}
              </p>
            )}
            {hasEnrollments && (
              <div style={{ marginBottom: 14, maxWidth: 280 }}>
                <ProgressBar value={firstEnrollment?.progress ?? 0} />
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", marginTop: 5 }}>
                  {firstEnrollment?.progress ?? 0}% complete
                </div>
              </div>
            )}
            {firstEnrollment ? (
              <Link to={`/lma/courses/${firstEnrollment?.course ?? 1}`} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                color: "#fff", fontSize: 13, fontWeight: 700,
                padding: "9px 20px", borderRadius: 9, textDecoration: "none",
                boxShadow: "0 4px 0 rgba(139,31,23,0.40)",
              }}>
                <Play size={14} fill="#fff" /> Resume Learning
              </Link>
            ) : (
              <Link to="/lma/student/browse" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                color: "#fff", fontSize: 13, fontWeight: 700,
                padding: "9px 20px", borderRadius: 9, textDecoration: "none",
                boxShadow: "0 4px 0 rgba(139,31,23,0.40)",
              }}>
                <BookOpen size={14} /> Browse Courses
              </Link>
            )}
          </div>

          {hasEnrollments && (
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CircleRing pct={firstEnrollment?.progress ?? 0} size={88} stroke={6} />
              <span style={{ position: "absolute", fontSize: 18, fontWeight: 900, color: AMBER, fontFamily: FF }}>
                {firstEnrollment?.progress ?? 0}%
              </span>
            </div>
          )}
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
            <div style={{ background: "#fff", borderRadius: 20, padding: "56px 24px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", background: "rgba(217,53,34,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
              }}>
                <Sparkles size={28} color={GOLD} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 8px", fontFamily: FF }}>
                Start your AI journey today
              </h3>
              <p style={{ color: "#9ca3af", fontSize: 13.5, margin: "0 0 22px", fontFamily: FF }}>
                Browse AI, MLOps and DevSecOps courses built by industry practitioners.
              </p>
              <Link to="/lma/student/browse" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: GOLD, color: "#fff", fontSize: 13.5, fontWeight: 700,
                padding: "11px 26px", borderRadius: 10, textDecoration: "none", minHeight: 44,
              }}>
                Browse Courses <ChevronRight size={15} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {(data?.enrollments ?? []).map((en: any, i: number) => {
                const durationHours: number | undefined = en.course_duration_hours ?? en.estimated_hours;
                const remainingHours = durationHours != null
                  ? Math.max(0, Math.round(durationHours * (1 - (en.progress ?? 0) / 100) * 10) / 10)
                  : null;
                return (
                  <div key={en.id} style={{
                    background: "#fff", borderRadius: 16, overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    animation: "lmaPage-in 0.40s ease both",
                    animationDelay: `${i * 80}ms`,
                  }}>
                    {en.course_thumbnail ? (
                      <div style={{ height: 110, background: `url(${en.course_thumbnail}) center/cover no-repeat`, position: "relative" }}>
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.35))" }} />
                      </div>
                    ) : (
                      <div style={{ height: 4, background: `linear-gradient(90deg,${AMBER},${GOLD})` }} />
                    )}
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

                      <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginBottom: 8 }}>
                        <Clock size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />
                        {en.completed ? "Completed" : `${en.progress ?? 0}% done`}
                        {en.course_instructor && <> · by {en.course_instructor}</>}
                      </div>
                      {!en.completed && remainingHours !== null && (
                        <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginBottom: 8 }}>
                          ~{remainingHours}h remaining
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <ProgressBar value={en.progress ?? 0} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, marginTop: 4, marginBottom: 10 }}>
                        {en.progress ?? 0}% complete
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        <Link to={`/lma/courses/${en.course ?? en.course_id ?? 1}`} style={{
                          flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center",
                          background: en.completed ? "rgba(5,150,105,0.10)" : GOLD,
                          color: en.completed ? "#059669" : "#fff",
                          fontSize: 13.5, fontWeight: 800,
                          padding: "12px", borderRadius: 10, textDecoration: "none", minHeight: 44,
                          border: en.completed ? "1.5px solid rgba(5,150,105,0.25)" : "none",
                          boxShadow: en.completed ? "none" : "0 6px 16px rgba(217,53,34,0.30)",
                        }}>
                          {en.completed ? "✓ Review" : en.progress === 0 ? "Start Course →" : "Continue Learning →"}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              <div style={{ background: "#fff", borderRadius: 16, padding: "32px 20px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(16,185,129,0.10)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <CheckCircle2 size={24} color="#10b981" />
                </div>
                <p style={{ color: "#141413", fontSize: 13.5, fontWeight: 700, margin: "0 0 4px", fontFamily: FF }}>All caught up!</p>
                <p style={{ color: "#9ca3af", fontSize: 12, margin: 0, fontFamily: FF }}>No pending assignments right now.</p>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                {[...(data.pending_assignments ?? [])]
                  .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                  .map((a: any, i: number, arr: any[]) => {
                    const badge = dueBadge(a.due_date);
                    return (
                      <div key={a.id} style={{
                        padding: "14px 18px",
                        borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                        display: "flex", gap: 12, alignItems: "flex-start",
                      }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: badge.tile, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <ClipboardList size={15} color={badge.fg} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#141413", fontFamily: FF }}>{a.title}</div>
                          <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 2, fontFamily: FF }}>{a.course_title}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                          {badge.label && (
                            <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 999, background: badge.bg, color: badge.fg, letterSpacing: "0.04em" }}>
                              {badge.label}
                            </span>
                          )}
                          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(20,20,19,0.45)", whiteSpace: "nowrap" }}>
                            {new Date(a.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </span>
                        </div>
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
              <div style={{ background: "#fff", borderRadius: 16, padding: "32px 20px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(139,92,246,0.10)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Award size={24} color="#8b5cf6" />
                </div>
                <p style={{ color: "#141413", fontSize: 13.5, fontWeight: 700, margin: "0 0 4px", fontFamily: FF }}>No certificates yet</p>
                <p style={{ color: "#9ca3af", fontSize: 12, margin: 0, fontFamily: FF }}>Complete a course to earn your first certificate.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(data.certificates ?? []).map((c: any) => (
                  <div key={c.id} style={{
                    background: "#fff", borderRadius: 14, padding: "16px 18px",
                    border: "1px solid rgba(217,53,34,0.25)",
                    boxShadow: "0 2px 0 rgba(217,53,34,0.12), 0 6px 20px rgba(217,53,34,0.08)",
                    display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap",
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#fef3c7,#fde68a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Award size={20} color="#d97706" />
                    </div>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FF }}>{c.course_title}</div>
                      <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 2, fontFamily: FF }}>
                        <Star size={9} color="#d97706" fill="#d97706" style={{ verticalAlign: "middle", marginRight: 3 }} />
                        Issued {new Date(c.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => setPreviewCert(c)}
                        aria-label="Preview certificate"
                        title="Preview"
                        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#6b7280", background: "#f4f7fa", border: "none", borderRadius: 8, cursor: "pointer" }}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => shareOnLinkedIn(c.course_title)}
                        aria-label="Share on LinkedIn"
                        title="Share on LinkedIn"
                        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0a66c2", background: "#eaf2fb", border: "none", borderRadius: 8, cursor: "pointer" }}
                      >
                        <Share2 size={15} />
                      </button>
                      <button
                        onClick={() => downloadCertificatePDF(c, name)}
                        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#d97706", background: "#fef3c7", border: "none", borderRadius: 8, padding: "0 12px", height: 36, cursor: "pointer", fontFamily: FF }}
                      >
                        <Download size={13} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        </>
        )}

        <style>{`
          @media (max-width:640px) {
            .lmad-2col { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {previewCert && (
          <CertPreviewModal
            cert={previewCert}
            studentName={name}
            onClose={() => setPreviewCert(null)}
            onDownload={() => downloadCertificatePDF(previewCert, name)}
          />
        )}
      </div>
    </LMAStudentLayout>
  );
}
