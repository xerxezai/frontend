import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star, Users, Clock, BookOpen, ChevronDown,
  Play, Lock, CheckCircle2, Award, Globe, ArrowLeft,
  ShoppingCart, Zap, Shield,
} from "lucide-react";

const API  = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const CREAM = "#F8F4EE";
const FF    = "'DM Sans', sans-serif";

/* ── Module thumbnail palettes (6, cycling by index) ── */
const PALETTES = [
  { bg: "linear-gradient(145deg,#2b1b09 0%,#1c1006 100%)", icon: "fas fa-brain",      ac: "#C9883A" },
  { bg: "linear-gradient(145deg,#0e2040 0%,#091428 100%)", icon: "fas fa-code",       ac: "#3b82f6" },
  { bg: "linear-gradient(145deg,#0c2212 0%,#07160b 100%)", icon: "fas fa-server",     ac: "#10b981" },
  { bg: "linear-gradient(145deg,#1e0d2c 0%,#140820 100%)", icon: "fas fa-database",   ac: "#a855f7" },
  { bg: "linear-gradient(145deg,#280d0d 0%,#1b0808 100%)", icon: "fas fa-chart-line", ac: "#ef4444" },
  { bg: "linear-gradient(145deg,#0d2024 0%,#081518 100%)", icon: "fas fa-robot",      ac: "#14b8a6" },
];

/* ── Scroll-reveal stagger helper ── */
const useStagger = (index: number, delay = 70) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = `opacity 0.50s ease ${index * delay}ms, transform 0.50s cubic-bezier(0.22,1,0.36,1) ${index * delay}ms`;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, delay]);
  return ref;
};

/* ── Star rating ── */
const Stars = ({ rating }: { rating: number }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(n => (
      <Star key={n} size={13} color="#f59e0b" fill={n <= Math.round(rating) ? "#f59e0b" : "none"} />
    ))}
  </div>
);

/* ── Payment modal ── */
const PaymentModal = ({ course, token, onClose, onEnrolled }: {
  course: any; token: string; onClose: () => void; onEnrolled: () => void;
}) => {
  const [step, setStep] = useState<"confirm" | "processing" | "done">("confirm");

  const pay = async () => {
    setStep("processing");
    try {
      const r = await fetch(`${API}/lma/courses/${course.id}/mock-payment/`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (r.ok) { setStep("done"); setTimeout(() => { onEnrolled(); onClose(); }, 2000); }
      else setStep("confirm");
    } catch { setStep("confirm"); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 22, padding: 32, width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(0,0,0,0.30)" }}>
        {step === "confirm" && (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Confirm Enrollment</h3>
            <p style={{ fontSize: 13, color: "rgba(20,20,19,0.55)", margin: "0 0 20px", fontFamily: FF }}>You're enrolling in:</p>
            <div style={{ background: CREAM, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", marginBottom: 4, fontFamily: FF }}>{course.title}</div>
              <div style={{ fontSize: 12, color: "rgba(20,20,19,0.45)", fontFamily: FF }}>by {course.instructor_name}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "12px 0", margin: "0 0 20px" }}>
              <span style={{ fontSize: 14, color: "rgba(20,20,19,0.55)", fontFamily: FF }}>Total</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: GOLD, fontFamily: FF }}>₹{course.price?.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20 }}>
              <Shield size={12} color="#9ca3af" />
              <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: FF }}>30-day money-back guarantee · Lifetime access</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 11, padding: 13, cursor: "pointer", fontFamily: FF }}>Cancel</button>
              <button onClick={pay} style={{ flex: 2, fontSize: 13, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg,${AMBER},${GOLD})`, border: "none", borderRadius: 11, padding: 13, cursor: "pointer", fontFamily: FF, boxShadow: "0 3px 0 rgba(140,80,20,0.40)" }}>
                Pay ₹{course.price?.toLocaleString()} →
              </button>
            </div>
          </>
        )}
        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 40, height: 40, border: `3px solid rgba(201,136,58,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lmacd-spin 0.8s linear infinite", display: "inline-block", marginBottom: 16 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#141413", fontFamily: FF }}>Processing…</p>
          </div>
        )}
        {step === "done" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={28} color="#059669" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Enrolled!</h3>
            <p style={{ fontSize: 13, color: "rgba(20,20,19,0.55)", fontFamily: FF }}>Redirecting to your dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Module accordion row ── */
const ModuleRow = ({ mod, index }: { mod: any; index: number }) => {
  const [open, setOpen] = useState(index === 0);
  const ref = useStagger(index, 65);
  const pal = PALETTES[index % PALETTES.length];
  const totalMins = (mod.lessons ?? []).reduce((s: number, l: any) => s + (l.duration ?? 0), 0);

  return (
    <div ref={ref} style={{
      borderRadius: 14,
      border: `1px solid ${open ? "rgba(201,136,58,0.30)" : "rgba(0,0,0,0.07)"}`,
      borderLeft: `3px solid ${open ? GOLD : "rgba(0,0,0,0.07)"}`,
      background: "#fff",
      marginBottom: 10,
      overflow: "hidden",
      transition: "border-color 0.25s ease, border-left-color 0.25s ease",
    }}>
      {/* Header button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 14,
          padding: "14px 18px", background: open ? "#fdfaf5" : "#fff",
          border: "none", cursor: "pointer", fontFamily: FF,
          transition: "background 0.20s ease",
        }}
      >
        {/* Thumbnail */}
        <div style={{
          width: 54, height: 54, borderRadius: 12, flexShrink: 0,
          background: pal.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
          <i className={pal.icon} style={{ color: pal.ac, fontSize: 21 }} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", lineHeight: 1.3, marginBottom: 4 }}>
            {mod.title}
          </div>
          <div style={{ fontSize: 12, color: "rgba(20,20,19,0.42)" }}>
            {mod.lessons?.length ?? 0} lessons
            {totalMins > 0 && ` · ${Math.floor(totalMins / 60)}h ${totalMins % 60}m`}
          </div>
        </div>
        {/* Chevron chip */}
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: open ? "rgba(201,136,58,0.12)" : "rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.20s ease",
        }}>
          <ChevronDown
            size={15}
            color={open ? GOLD : "#9ca3af"}
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
          />
        </div>
      </button>

      {/* Lesson list — CSS max-height accordion */}
      <div style={{
        maxHeight: open ? "3000px" : "0px",
        overflow: "hidden",
        transition: open
          ? "max-height 0.50s cubic-bezier(0.4,0,0.2,1)"
          : "max-height 0.32s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {(mod.lessons ?? []).map((l: any, li: number) => (
            <div
              key={l.id ?? li}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 18px 10px 86px",
                borderBottom: li < (mod.lessons.length - 1) ? "1px solid rgba(0,0,0,0.045)" : "none",
                background: l.is_free_preview ? "rgba(201,136,58,0.025)" : "transparent",
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: l.is_free_preview ? "rgba(201,136,58,0.12)" : "rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {l.is_free_preview
                  ? <Play size={12} color={GOLD} />
                  : <Lock size={12} color="#bcc0c8" />}
              </div>
              <span style={{
                flex: 1, fontSize: 13,
                color: l.is_free_preview ? "#2d2a27" : "rgba(20,20,19,0.50)",
                lineHeight: 1.4,
              }}>
                {l.title}
              </span>
              {l.is_free_preview && (
                <span style={{
                  fontSize: 10, fontWeight: 700, color: GOLD, flexShrink: 0,
                  background: "rgba(201,136,58,0.10)", border: "1px solid rgba(201,136,58,0.24)",
                  borderRadius: 5, padding: "2px 8px", letterSpacing: "0.05em",
                }}>
                  FREE
                </span>
              )}
              {l.duration > 0 && (
                <span style={{ fontSize: 11, color: "rgba(20,20,19,0.30)", flexShrink: 0, minWidth: 32, textAlign: "right" }}>
                  {l.duration}m
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Price sidebar card ── */
const PriceCard = ({ course, enrolled, totalLessons, onEnroll }: {
  course: any; enrolled: boolean; totalLessons: number; onEnroll: () => void;
}) => (
  <div style={{
    background: "#fff", borderRadius: 20, overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.06)",
  }}>
    <div style={{ height: 5, background: `linear-gradient(90deg,${AMBER},${GOLD})` }} />
    <div style={{ padding: "24px 22px" }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 38, fontWeight: 900, color: GOLD, fontFamily: FF, lineHeight: 1 }}>
          ₹{course.price?.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: "rgba(20,20,19,0.38)", fontFamily: FF, marginTop: 5 }}>
          One-time payment · Lifetime access
        </div>
      </div>

      {enrolled ? (
        <Link to="/lma/student/dashboard" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "#d1fae5", color: "#059669", fontSize: 14, fontWeight: 700,
          padding: "13px", borderRadius: 12, textDecoration: "none", marginBottom: 10,
          fontFamily: FF,
        }}>
          <CheckCircle2 size={16} /> Go to Dashboard
        </Link>
      ) : (
        <>
          <button onClick={onEnroll} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
            color: "#fff", fontSize: 14, fontWeight: 700,
            border: "none", borderRadius: 12, padding: "14px", cursor: "pointer",
            boxShadow: "0 4px 0 rgba(130,78,18,0.45), 0 8px 24px rgba(201,136,58,0.28)",
            marginBottom: 10, fontFamily: FF,
          }}>
            <ShoppingCart size={16} /> Enroll Now
          </button>
          <button onClick={onEnroll} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "transparent", color: GOLD, fontSize: 13, fontWeight: 700,
            border: "1.5px solid rgba(201,136,58,0.40)", borderRadius: 12, padding: "12px",
            cursor: "pointer", fontFamily: FF, marginBottom: 14,
          }}>
            <Zap size={14} /> Try Free Preview
          </button>
        </>
      )}

      <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <Shield size={12} color="#9ca3af" />
        <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: FF }}>30-day money-back guarantee</span>
      </div>

      <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 18 }}>
        <h5 style={{ fontSize: 11, fontWeight: 700, color: "#141413", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FF }}>
          This course includes
        </h5>
        {([
          [Clock, `${course.hours}h on-demand video`],
          [BookOpen, `${totalLessons} lessons`],
          [Globe, "Full lifetime access"],
          [Award, "Certificate of completion"],
        ] as [React.ElementType, string][]).map(([Icon, text]) => (
          <div key={text} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <Icon size={13} color={GOLD} />
            <span style={{ fontSize: 13, color: "rgba(20,20,19,0.58)", fontFamily: FF }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── Instructor sidebar card ── */
const InstructorCard = ({ course }: { course: any }) => {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", padding: "20px 20px 18px", marginTop: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <h4 style={{ fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.40)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FF }}>
        Instructor
      </h4>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: "#0a0806",
            boxShadow: hov ? `0 0 0 3px ${GOLD}` : "0 0 0 3px rgba(201,136,58,0.18)",
            transition: "box-shadow 0.25s ease", cursor: "default",
          }}
        >
          {(course.instructor_name ?? "I").charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 2, fontFamily: FF }}>{course.instructor_name}</div>
          <div style={{ fontSize: 12, color: "rgba(20,20,19,0.45)", fontFamily: FF }}>Senior Instructor</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "rgba(20,20,19,0.40)", lineHeight: 1.55, marginBottom: 14, fontFamily: FF }}>
        ★ {course.rating} rating · {(course.total_students ?? 0).toLocaleString()} learners
      </div>

      {/* Offered by */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10, fontFamily: FF }}>
          Offered by
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: DARK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="fas fa-graduation-cap" style={{ color: GOLD, fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>XERXEZ Academy</div>
            <span style={{ fontSize: 12, color: GOLD, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>Learn more</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */

export default function LMACourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");
  const [showPay, setShowPay] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/lma/courses/${id}/`)
      .then(r => r.json())
      .then(d => setCourse(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const onScroll = () => setShowStickyHeader(window.scrollY > 260);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleEnroll = () => {
    if (!token) { navigate("/lma/login"); return; }
    setShowPay(true);
  };

  const totalLessons = course?.modules?.reduce((s: number, m: any) => s + (m.lessons?.length ?? 0), 0) ?? 0;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: CREAM }}>
      <div style={{ width: 36, height: 36, border: "3px solid rgba(201,136,58,0.18)", borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lmacd-spin 0.8s linear infinite" }} />
      <style>{`@keyframes lmacd-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!course) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: CREAM, fontFamily: FF }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#141413", marginBottom: 10 }}>Course not found</h2>
      <Link to="/lma/courses" style={{ color: GOLD, fontSize: 14, fontWeight: 600 }}>← Browse Courses</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: FF }}>

      {/* ══ STICKY SCROLL HEADER ══ */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: DARK, borderBottom: "1px solid rgba(201,136,58,0.18)",
        transform: showStickyHeader ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", alignItems: "center", gap: 20,
        padding: "10px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
        fontFamily: FF, pointerEvents: showStickyHeader ? "auto" : "none",
      }}>
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
            {course?.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <Stars rating={course?.rating ?? 0} />
            <span style={{ fontSize: 12, fontWeight: 700, color: AMBER }}>{course?.rating}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
              ({(course?.total_ratings ?? Math.round((course?.rating ?? 4) * 50)).toLocaleString()} ratings)
            </span>
          </div>
        </div>
        {!enrolled && (
          <button onClick={handleEnroll} style={{
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            color: "#0a0806", fontSize: 13, fontWeight: 800,
            border: "none", borderRadius: 9, padding: "9px 22px",
            cursor: "pointer", flexShrink: 0, fontFamily: FF,
            boxShadow: "0 2px 0 rgba(130,78,18,0.40)",
          }}>
            Enroll Now
          </button>
        )}
      </div>

      {/* ══ HERO ══ */}
      <div style={{ background: `linear-gradient(160deg,${DARK} 0%,#0e0905 100%)`, position: "relative", overflow: "hidden" }}>
        {/* Ambient glow orbs */}
        <div aria-hidden="true" style={{ position: "absolute", top: "20%", left: "15%", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: "-30%", right: "5%",  width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.04) 0%,transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px 72px", position: "relative", zIndex: 1 }}>
          {/* Back link */}
          <Link to="/lma/courses" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.40)",
            textDecoration: "none", marginBottom: 32,
            transition: "color 0.20s ease",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.40)")}
          >
            <ArrowLeft size={14} /> Back to Courses
          </Link>

          {/* Badge */}
          {course.badge && (
            <span style={{
              display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
              padding: "4px 13px", borderRadius: 999, marginBottom: 14,
              background: "rgba(201,136,58,0.14)", color: AMBER,
              border: "1px solid rgba(201,136,58,0.28)",
            }}>
              {course.badge}
            </span>
          )}

          {/* Category */}
          <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", marginBottom: 12 }}>
            {course.category}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(26px, 3.8vw, 44px)", fontWeight: 900, color: "#fff",
            margin: "0 0 18px", lineHeight: 1.16, letterSpacing: "-0.025em",
            maxWidth: 700,
          }}>
            {course.title}
          </h1>

          {/* Description */}
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.50)", margin: "0 0 22px", lineHeight: 1.68, maxWidth: 620 }}>
            {course.description}
          </p>

          {/* Rating + students */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 18 }}>
            {course.rating && (
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Stars rating={course.rating} />
                <span style={{ fontSize: 14, fontWeight: 800, color: "#f59e0b" }}>{course.rating}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.32)" }}>
                  ({(course.total_ratings ?? Math.round(course.rating * 50)).toLocaleString()} ratings)
                </span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
              <Users size={13} /> {(course.total_students ?? 0).toLocaleString()} students
            </div>
          </div>

          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, color: "rgba(255,255,255,0.36)", fontSize: 13, marginBottom: 22 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={13} /> {course.hours}h total</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><BookOpen size={13} /> {totalLessons} lessons</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Globe size={13} /> English</span>
          </div>

          {/* Tech stack pills */}
          {(course.tech_stack ?? []).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(course.tech_stack ?? []).map((t: string) => (
                <span key={t} style={{
                  fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)",
                  borderRadius: 7, padding: "4px 13px",
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY — 70/30 layout ══ */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 80px", display: "flex", gap: 28, alignItems: "flex-start" }} className="lmacd-body">

        {/* ── LEFT: tabs + content ── */}
        <div style={{ flex: 1, minWidth: 0, marginTop: 32 }}>

          {/* Sticky tab nav */}
          <div style={{
            position: "sticky", top: showStickyHeader ? 52 : 0, zIndex: 90,
            transition: "top 0.26s ease",
            background: CREAM,
            borderBottom: "2px solid rgba(0,0,0,0.07)",
            margin: "0 -24px 28px",
            padding: "0 24px",
          }}>
            <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
              {(["overview", "curriculum", "instructor", "reviews"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  fontSize: 13.5, fontWeight: tab === t ? 700 : 500,
                  color: tab === t ? GOLD : "rgba(20,20,19,0.48)",
                  borderBottom: `2px solid ${tab === t ? GOLD : "transparent"}`,
                  marginBottom: -2,
                  padding: "14px 20px",
                  background: "none", border: "none", borderRadius: 0,
                  cursor: "pointer", fontFamily: FF, whiteSpace: "nowrap",
                  textTransform: "capitalize",
                  transition: "color 0.18s ease",
                }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Overview ── */}
          {tab === "overview" && (
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#141413", margin: "0 0 18px" }}>What you'll learn</h2>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", padding: "24px 26px", marginBottom: 28, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px" }} className="lmacd-learn-grid">
                  {[...(course.tech_stack ?? []).map((t: string) => `Hands-on with ${t}`), "Build real production systems", "Certificate of completion", "Enterprise-grade best practices"].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.52 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills you'll gain */}
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#141413", margin: "0 0 14px" }}>Skills you'll gain</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                {[...(course.tech_stack ?? []), "Problem Solving", "System Design", "API Integration", "CI/CD", "Cloud Deployment"].slice(0, 10).map((skill: string) => (
                  <span key={skill} style={{
                    fontSize: 13, fontWeight: 500, padding: "7px 18px", borderRadius: 999,
                    background: "rgba(201,136,58,0.09)", color: "#5c3d1a",
                    border: "1px solid rgba(201,136,58,0.24)", fontFamily: FF,
                  }}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* Details to know */}
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>Details to know</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }} className="lmacd-details-grid">
                {[
                  { icon: "fab fa-linkedin", title: "Shareable certificate", sub: "Add to your LinkedIn profile", iconBg: "#e8f1fb", iconColor: "#0077b5" },
                  { icon: "fas fa-globe", title: "Taught in English", sub: "Certificate in English", iconBg: "rgba(201,136,58,0.12)", iconColor: GOLD },
                  { icon: "far fa-clock", title: `${course.hours} hours to complete`, sub: "Learn at your own pace", iconBg: "rgba(201,136,58,0.12)", iconColor: GOLD },
                  { icon: "fas fa-layer-group", title: `${totalLessons} lessons`, sub: `${(course.level ?? "").charAt(0).toUpperCase() + (course.level ?? "").slice(1)} level`, iconBg: "rgba(201,136,58,0.12)", iconColor: GOLD },
                ].map(d => (
                  <div key={d.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: d.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={d.icon} style={{ fontSize: 18, color: d.iconColor }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", marginBottom: 3, fontFamily: FF }}>{d.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(20,20,19,0.50)", fontFamily: FF }}>{d.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>Requirements</h2>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", padding: "20px 26px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <ul style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.78, paddingLeft: 20, margin: 0 }}>
                  <li>Basic programming knowledge</li>
                  <li>Computer with stable internet access</li>
                  <li>No prior {course.category} experience required</li>
                  <li>Willingness to work on real-world projects</li>
                </ul>
              </div>
            </div>
          )}

          {/* ── Curriculum ── */}
          {tab === "curriculum" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <h2 style={{ fontSize: 19, fontWeight: 800, color: "#141413", margin: "0 0 4px" }}>Course Curriculum</h2>
                  <span style={{ fontSize: 13, color: "rgba(20,20,19,0.40)" }}>
                    {course.modules?.length ?? 0} modules · {totalLessons} lessons · {course.hours}h total
                  </span>
                </div>
              </div>
              {(course.modules ?? []).map((m: any, i: number) => (
                <ModuleRow key={m.id ?? i} mod={m} index={i} />
              ))}
            </div>
          )}

          {/* ── Instructor ── */}
          {tab === "instructor" && (
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#141413", margin: "0 0 22px" }}>Your Instructor</h2>
              <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", padding: "26px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{
                    width: 76, height: 76, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, fontWeight: 800, color: "#0a0806",
                    boxShadow: `0 0 0 4px rgba(201,136,58,0.18)`,
                  }}>
                    {(course.instructor_name ?? "I").charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 800, color: GOLD, marginBottom: 4 }}>{course.instructor_name}</div>
                    <div style={{ fontSize: 13.5, color: "rgba(20,20,19,0.50)", marginBottom: 12 }}>Senior Instructor · XERXEZ Academy</div>
                    <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                      {[
                        { icon: "fas fa-star",  val: `${course.rating} Instructor Rating`, col: "#f59e0b" },
                        { icon: "fas fa-users", val: `${(course.total_students ?? 0).toLocaleString()} Students`, col: "rgba(20,20,19,0.42)" },
                        { icon: "fas fa-book",  val: "3 Courses", col: "rgba(20,20,19,0.42)" },
                      ].map(s => (
                        <span key={s.val} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: s.col, fontWeight: 600 }}>
                          <i className={s.icon} style={{ fontSize: 12 }} /> {s.val}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.74, margin: 0 }}>
                  An expert practitioner with years of hands-on experience building enterprise AI and cloud systems at scale. No fluff — just what you need to ship real systems in production. Passionate about making complex technology accessible through clear, practical teaching that directly transfers to your work.
                </p>
              </div>
            </div>
          )}

          {/* ── Reviews ── */}
          {tab === "reviews" && (
            <div>
              <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 28, flexWrap: "wrap" }}>
                <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", padding: "24px 32px", textAlign: "center", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 60, fontWeight: 900, color: "#141413", lineHeight: 1, fontFamily: FF }}>{course.rating ?? "–"}</div>
                  <div style={{ margin: "8px 0 6px" }}><Stars rating={course.rating ?? 0} /></div>
                  <div style={{ fontSize: 12, color: "rgba(20,20,19,0.40)" }}>Course Rating</div>
                </div>
              </div>
              {(course.reviews ?? []).length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", padding: "40px", textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 13.5, color: "#9ca3af" }}>No reviews yet — be the first after enrolling!</div>
                </div>
              ) : (
                (course.reviews ?? []).map((r: any) => (
                  <div key={r.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)", padding: "20px 22px", marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#0a0806", flexShrink: 0 }}>
                        {r.student_name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", marginBottom: 4 }}>{r.student_name}</div>
                        <Stars rating={r.rating} />
                        <p style={{ fontSize: 13.5, color: "#4b5563", margin: "10px 0 0", lineHeight: 1.66 }}>{r.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: sticky sidebar ── */}
        <div style={{ width: 310, flexShrink: 0, position: "sticky", top: 20, marginTop: -48 }} className="lmacd-sidebar">
          <PriceCard course={course} enrolled={enrolled} totalLessons={totalLessons} onEnroll={handleEnroll} />
          <InstructorCard course={course} />
        </div>
      </div>

      {showPay && (
        <PaymentModal
          course={course}
          token={token}
          onClose={() => setShowPay(false)}
          onEnrolled={() => setEnrolled(true)}
        />
      )}

      <style>{`
        @keyframes lmacd-spin { to { transform: rotate(360deg); } }

        @media (max-width: 560px) {
          .lmacd-details-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 860px) {
          .lmacd-body { flex-direction: column !important; }
          .lmacd-sidebar { width: 100% !important; position: static !important; margin-top: 24px !important; order: -1; }
          .lmacd-learn-grid { grid-template-columns: 1fr !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
