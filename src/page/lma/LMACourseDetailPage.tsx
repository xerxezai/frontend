import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Shield, ShieldCheck } from "lucide-react";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const DARK2 = "#100c07";
const CREAM = "#F8F4EE";
const FF    = "'DM Sans', sans-serif";

const THUMB_GRADS = [
  ["#1e3a5f", "#3b82f6"],
  ["#3b1f6e", "#8b5cf6"],
  ["#0f3d30", "#10b981"],
  ["#5a3200", "#C9883A"],
  ["#5a1020", "#f43f5e"],
  ["#0f2040", "#60a5fa"],
];
const THUMB_ICONS = [
  "fas fa-brain", "fas fa-code", "fas fa-cogs",
  "fas fa-chart-bar", "fas fa-cloud", "fas fa-shield-alt",
];

/* ── Module thumbnail ── */
const ModuleThumbnail = ({ index, size = 80 }: { index: number; size?: number }) => {
  const [a, b] = THUMB_GRADS[index % THUMB_GRADS.length];
  return (
    <div style={{
      width: size, height: Math.round(size * 0.7), borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(135deg,${a} 0%,${b} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%,rgba(255,255,255,0.18) 0%,transparent 60%)" }} />
      <i className={THUMB_ICONS[index % THUMB_ICONS.length]}
        style={{ color: "rgba(255,255,255,0.92)", fontSize: size * 0.25, position: "relative", zIndex: 1 }} />
    </div>
  );
};

/* ── Star rating ── */
const StarRating = ({ rating }: { rating: number }) => (
  <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
    {[1,2,3,4,5].map(n => (
      <i key={n} className="fas fa-star"
        style={{ fontSize: 12, color: n <= Math.round(rating) ? "#f59e0b" : "rgba(255,255,255,0.22)" }} />
    ))}
    <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginLeft: 5 }}>{rating}</span>
  </span>
);

/* ── Lesson row ── */
const LessonRow = ({ lesson }: { lesson: any }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
    {lesson.is_free_preview
      ? <i className="fas fa-play-circle" style={{ fontSize: 14, color: GOLD, flexShrink: 0, width: 16 }} />
      : <i className="fas fa-lock" style={{ fontSize: 12, color: "#c5bfba", flexShrink: 0, width: 16 }} />}
    <span style={{ flex: 1, fontSize: 13, lineHeight: 1.45, color: lesson.is_free_preview ? "#141413" : "rgba(20,20,19,0.52)", fontFamily: FF }}>
      {lesson.title}
    </span>
    {lesson.is_free_preview && (
      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 4, padding: "1px 6px", flexShrink: 0 }}>
        Free
      </span>
    )}
    <span style={{ fontSize: 11.5, color: "rgba(20,20,19,0.38)", flexShrink: 0 }}>{lesson.duration}m</span>
  </div>
);

/* ── Module accordion row ── */
const ModuleRow = ({ mod, modIndex, isOpen, toggle, revealDelay }: {
  mod: any; modIndex: number; isOpen: boolean; toggle: () => void; revealDelay: number;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current; if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = `opacity 0.48s ease ${revealDelay}ms, transform 0.48s cubic-bezier(0.22,1,0.36,1) ${revealDelay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [revealDelay]);

  const totalMins = mod.lessons?.reduce((s: number, l: any) => s + (l.duration ?? 0), 0) ?? mod.duration ?? 0;
  const h = Math.floor(totalMins / 60), m = totalMins % 60;
  const durStr = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;

  return (
    <div ref={rowRef} style={{
      border: "1px solid rgba(0,0,0,0.09)",
      borderLeft: `3px solid ${isOpen ? GOLD : "transparent"}`,
      borderRadius: 10, marginBottom: 8, overflow: "hidden", background: "#fff",
      transition: "border-left-color 0.22s ease",
    }}>
      <button onClick={toggle} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14,
        padding: "13px 16px", border: "none", cursor: "pointer",
        background: isOpen ? "#fdfaf6" : "#fff", fontFamily: FF, textAlign: "left",
        transition: "background 0.18s ease",
      }}>
        <ModuleThumbnail index={modIndex} size={80} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", marginBottom: 3, lineHeight: 1.3 }}>{mod.title}</div>
          <div style={{ fontSize: 12, color: "rgba(20,20,19,0.44)" }}>
            Course {modIndex + 1} · {mod.lessons?.length ?? 0} lessons · {durStr}
          </div>
        </div>
        <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}
          style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0 }} />
      </button>
      <div style={{
        maxHeight: isOpen ? "3000px" : "0px", overflow: "hidden",
        transition: isOpen ? "max-height 0.55s cubic-bezier(0.4,0,0.2,1)" : "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div className="lmacd-lesson-indent" style={{ padding: "2px 16px 12px", paddingLeft: 110, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {(mod.lessons ?? []).map((l: any) => <LessonRow key={l.id} lesson={l} />)}
        </div>
      </div>
    </div>
  );
};

/* ── Instructor item ── */
const InstructorItem = ({ name, designation, courses, learners }: {
  name: string; designation: string; courses: number; learners: string;
}) => {
  const [hov, setHov] = useState(false);
  const initials = name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg,${AMBER},${GOLD})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#0a0806", fontWeight: 800, fontSize: 15, cursor: "pointer",
          boxShadow: hov ? `0 0 0 3px ${GOLD},0 0 18px rgba(201,136,58,0.40)` : "none",
          transition: "box-shadow 0.22s ease",
        }}
      >{initials}</div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, marginBottom: 2, fontFamily: FF }}>{name}</div>
        <div style={{ fontSize: 12, color: "rgba(20,20,19,0.52)", marginBottom: 3, fontFamily: FF }}>{designation}</div>
        <div style={{ fontSize: 11, color: "rgba(20,20,19,0.38)", fontFamily: FF }}>
          {courses} Course{courses !== 1 ? "s" : ""} · {learners} learners
        </div>
      </div>
    </div>
  );
};

/* ── What you'll learn ── */
const WhatYouLearnBox = ({ techStack }: { techStack: string[] }) => {
  const items = [
    `Hands-on with ${techStack[0] ?? "Python"} from day one`,
    "Build production-ready AI systems end-to-end",
    `Deploy and monitor with ${techStack[1] ?? "cloud platforms"}`,
    "Earn XERXEZ AI certification",
    `Work with real enterprise ${techStack[2] ?? "data pipelines"}`,
    "Master industry deployment patterns and MLOps",
  ];
  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.09)", borderRadius: 14, padding: "22px 26px", marginBottom: 24, background: "#fff" }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: FF }}>What you'll learn</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }} className="lmacd-learn-grid">
        {items.map(item => (
          <div key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <i className="fas fa-check" style={{ color: GOLD, fontSize: 12, marginTop: 4, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, fontFamily: FF }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Skills pills ── */
const SkillsPills = ({ items, heading }: { items: string[]; heading: string }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 12px", fontFamily: FF }}>{heading}</h3>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map(t => (
        <span key={t} style={{
          fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 999,
          background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", fontFamily: FF,
        }}>{t}</span>
      ))}
    </div>
  </div>
);

/* ── Details to know ── */
const DetailsToKnow = ({ hours, lessonsCount, level }: { hours: number; lessonsCount: number; level: string }) => (
  <div style={{ marginBottom: 28 }}>
    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: FF }}>Details to know</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {[
        { icon: "fab fa-linkedin", label: "Shareable certificate", sub: "Add to LinkedIn profile",  iconColor: "#0077b5" },
        { icon: "fas fa-globe",    label: "Taught in English",     sub: "Certificate in English",   iconColor: GOLD     },
        { icon: "far fa-clock",    label: `${hours} hours`,        sub: "Flexible schedule",        iconColor: GOLD     },
        { icon: "fas fa-layer-group", label: `${lessonsCount} lessons`, sub: level.charAt(0).toUpperCase() + level.slice(1) + " level", iconColor: GOLD },
      ].map(d => (
        <div key={d.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <i className={d.icon} style={{ fontSize: 20, color: d.iconColor, width: 24, textAlign: "center" as const, marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>{d.label}</div>
            <div style={{ fontSize: 12, color: "rgba(20,20,19,0.48)", fontFamily: FF }}>{d.sub}</div>
          </div>
        </div>
      ))}
    </div>
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
            <div className="lmacd-spinner" style={{ margin: "0 auto 16px" }} />
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

/* ════════════════════════════════════════════════════════════════════════════
   3-D HERO COURSE CARD
════════════════════════════════════════════════════════════════════════════ */
const HeroCourseCard = ({ course, totalLessons, onEnroll, onPreview }: {
  course: any; totalLessons: number; onEnroll: () => void; onPreview?: () => void;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current; if (!card) return;
    const wrap = wrapRef.current; if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
  };

  const onLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div ref={wrapRef} className="lmacd-hcard-wrap" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={cardRef} className="lmacd-hcard">
        {/* Gold top stripe */}
        <div style={{ height: 4, background: `linear-gradient(90deg,${AMBER},${GOLD})`, margin: "-24px -24px 22px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="fas fa-graduation-cap" style={{ color: "#0a0806", fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: AMBER, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>XERXEZ ACADEMY</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", fontFamily: FF }}>Certified Professional Program</div>
          </div>
        </div>

        {/* Course title */}
        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 5, lineHeight: 1.25, fontFamily: FF }}>
          {course.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
          {[1,2,3,4,5].map(n => (
            <i key={n} className="fas fa-star" style={{ fontSize: 10, color: n <= Math.round(course.rating ?? 4) ? "#f59e0b" : "rgba(255,255,255,0.15)" }} />
          ))}
          <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginLeft: 4 }}>{course.rating ?? 4.8}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginLeft: 2 }}>
            ({(course.total_ratings ?? 247).toLocaleString()} reviews)
          </span>
        </div>

        {/* Stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
          {[
            { val: `${course.hours}h`,   label: "Duration" },
            { val: String(totalLessons), label: "Lessons"  },
            { val: ((course.level ?? "Int").charAt(0).toUpperCase() + (course.level ?? "Int").slice(1)), label: "Level" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 6px",
              textAlign: "center", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: AMBER, fontFamily: FF }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", marginTop: 2, fontFamily: FF }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Completion bar */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", fontFamily: FF }}>Avg. Completion</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, fontFamily: FF }}>94%</span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "94%", borderRadius: 99, background: `linear-gradient(90deg,${AMBER},${GOLD})`, boxShadow: `0 0 8px rgba(201,136,58,0.50)` }} />
          </div>
        </div>

        {/* Certificate badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
          borderRadius: 12, background: "rgba(201,136,58,0.08)",
          border: "1px solid rgba(201,136,58,0.20)", marginBottom: 18,
        }}>
          <i className="fas fa-certificate" style={{ color: GOLD, fontSize: 22, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: FF }}>Certificate of Completion</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", fontFamily: FF }}>Shareable · LinkedIn-ready</div>
          </div>
        </div>

        {/* Enroll CTA */}
        <button onClick={onEnroll} style={{
          width: "100%", padding: "13px", borderRadius: 11,
          background: `linear-gradient(135deg,${AMBER},${GOLD})`,
          color: "#0a0806", fontWeight: 800, fontSize: 13, fontFamily: FF,
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 0 rgba(130,78,18,0.45),0 8px 24px rgba(201,136,58,0.28)",
        }}>
          Enroll Now — ₹{course.price?.toLocaleString() ?? "–"}
        </button>
        <button onClick={onPreview} className="lmacd-preview-btn" style={{
          width: "100%", padding: "11px", borderRadius: 11, marginTop: 10,
          background: "transparent", color: GOLD, fontWeight: 700, fontSize: 12, fontFamily: FF,
          border: `2px solid ${GOLD}`, cursor: "pointer",
          transition: "background 0.20s ease",
        }}>
          <i className="fas fa-play-circle" style={{ fontSize: 11, marginRight: 6 }} />
          Try Free Preview
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */
export default function LMACourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [course, setCourse]         = useState<any>(null);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([0]));
  const [activeTab, setActiveTab]   = useState<"about" | "curriculum">("about");
  const [showPay, setShowPay]       = useState(false);
  const [enrolled, setEnrolled]     = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [hovCourse, setHovCourse] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/lma/courses/${id}/`)
      .then(r => r.json())
      .then(d => setCourse(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch(`${API}/lma/courses/`)
      .then(r => r.json())
      .then(d => setCourseList(Array.isArray(d) ? d : (d.results ?? [])))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleModule = useCallback((idx: number) => {
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }, []);

  const expandAll  = useCallback(() => {
    if (!course) return;
    setOpenModules(new Set((course.modules ?? []).map((_: any, i: number) => i)));
  }, [course]);

  const collapseAll = useCallback(() => setOpenModules(new Set()), []);

  const tabNavRef  = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const N = 55, LINK = 130;
    let W = 0, H = 0, raf = 0;
    const pts = Array.from({ length: N }, () => ({
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      r: Math.random() * 1.6 + 0.7,
    }));
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      pts.forEach(p => { p.x = Math.random() * W; p.y = Math.random() * H; });
    };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(201,136,58,${0.18 * (1 - d / LINK)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201,136,58,0.36)"; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      raf = requestAnimationFrame(tick);
    };
    resize(); tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const scrollToCurriculum = useCallback(() => {
    setActiveTab("curriculum");
    setTimeout(() => tabNavRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, []);

  const handleEnroll = () => {
    if (!token) { navigate("/lma/login"); return; }
    setShowPay(true);
  };

  const totalLessons = course?.modules?.reduce((s: number, m: any) => s + (m.lessons?.length ?? 0), 0) ?? 0;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: CREAM }}>
      <div className="lmacd-spinner" />
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

      {/* ══ STICKY SCROLL BAR ══ */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: DARK, borderBottom: "1px solid rgba(201,136,58,0.18)",
        transform: showStickyBar ? "translateY(0)" : "translateY(-100%)",
        opacity: showStickyBar ? 1 : 0,
        transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1), opacity 0.20s ease",
        display: "flex", alignItems: "center", gap: 20,
        padding: "10px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        fontFamily: FF, pointerEvents: showStickyBar ? "auto" : "none",
      }}>
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
            {course.title}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>
            {course.modules?.length ?? 0} modules · {totalLessons} lessons · {course.hours}h total
          </div>
        </div>
        {!enrolled && (
          <button onClick={handleEnroll} className="lmacd-shimmer-btn" style={{
            background: `linear-gradient(135deg,${AMBER},${GOLD})`,
            color: "#0a0806", fontSize: 13, fontWeight: 800,
            border: "none", borderRadius: 9, padding: "9px 22px",
            cursor: "pointer", flexShrink: 0, fontFamily: FF,
            boxShadow: "0 2px 0 rgba(130,78,18,0.40)",
            position: "relative", overflow: "hidden",
          }}>
            Enroll Now
          </button>
        )}
      </div>

      {/* ══ HERO ══ */}
      <section className="lmacd-hero">
        <canvas ref={canvasRef} className="lmacd-particles" />
        <div className="lmacd-orb lmacd-orb-1" />
        <div className="lmacd-orb lmacd-orb-2" />
        <div className="lmacd-orb lmacd-orb-3" />
        {/* Floating geometric shapes */}
        <div className="lmacd-geo lmacd-geo-1" />
        <div className="lmacd-geo lmacd-geo-2" />
        <div className="lmacd-geo lmacd-geo-3" />
        <div className="lmacd-geo lmacd-geo-4" />

        <div className="lmacd-container" style={{ position: "relative", zIndex: 1 }}>
          <Link to="/lma/courses" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "rgba(255,255,255,0.38)", textDecoration: "none",
            marginBottom: 22, fontFamily: FF, transition: "color 0.18s ease",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
          >
            ← Back to Courses
          </Link>

          <div className="lmacd-hero-row"><div className="lmacd-hero-text">
            {course.badge && (
              <span style={{
                display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
                textTransform: "uppercase", padding: "3px 10px", borderRadius: 999, marginBottom: 16,
                background: "rgba(255,193,0,0.18)", color: "#f59e0b",
              }}>
                {course.badge}
              </span>
            )}

            <h1 style={{
              fontFamily: FF, fontWeight: 900,
              fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.1,
              color: "#fff", margin: "0 0 20px", letterSpacing: "-0.025em",
            }}>
              {course.title}
            </h1>

            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.68, margin: "0 0 24px", maxWidth: 620, fontFamily: FF }}>
              {course.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 20 }}>
              {course.rating > 0 && (
                <>
                  <StarRating rating={course.rating} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: FF }}>
                    ({(course.total_ratings ?? Math.round(course.rating * 50)).toLocaleString()} ratings)
                  </span>
                </>
              )}
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", display: "flex", alignItems: "center", gap: 6, fontFamily: FF }}>
                <i className="fas fa-users" style={{ fontSize: 12 }} />
                {(course.total_students ?? 0).toLocaleString()} already enrolled
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: FF }}>Included with</span>
              <span style={{
                fontSize: 11, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase",
                padding: "2px 10px", borderRadius: 4,
                background: `linear-gradient(135deg,${AMBER},${GOLD})`, color: "#0a0806",
              }}>
                XERXEZ Academy
              </span>
              <span style={{ fontSize: 12, color: GOLD, fontFamily: FF, cursor: "pointer" }}>· Learn more</span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 13px", borderRadius: 999, border: `1px solid rgba(201,136,58,0.55)`, color: AMBER, fontFamily: FF }}>
                {course.category}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 13px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.55)", fontFamily: FF, textTransform: "capitalize" }}>
                {course.level} level
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 13px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.50)", fontFamily: FF }}>
                {course.hours}h · {totalLessons} lessons
              </span>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 32 }}>
              {(course.tech_stack ?? []).map((t: string) => (
                <span key={t} style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 11px", borderRadius: 999,
                  background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.62)", fontFamily: FF,
                }}>{t}</span>
              ))}
            </div>

            {/* Hero CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {enrolled ? (
                <Link to="/lma/student/dashboard" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#d1fae5", color: "#059669", fontSize: 14, fontWeight: 800,
                  padding: "13px 28px", borderRadius: 11, textDecoration: "none", fontFamily: FF,
                }}>
                  <CheckCircle2 size={16} /> Go to Dashboard
                </Link>
              ) : (
                <>
                  <button onClick={handleEnroll} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                    color: "#0a0806", fontSize: 14, fontWeight: 800,
                    height: "52px", padding: "0 28px", borderRadius: 11, border: "none", cursor: "pointer",
                    boxShadow: "0 4px 0 rgba(130,78,18,0.45),0 10px 32px rgba(201,136,58,0.25)",
                    fontFamily: FF,
                  }}>
                    <i className="fas fa-graduation-cap" style={{ fontSize: 13 }} />
                    Enroll Now
                    {course.price ? (
                      <span style={{ fontSize: 12, opacity: 0.70, marginLeft: 4 }}>₹{course.price.toLocaleString()}</span>
                    ) : null}
                  </button>
                  <button onClick={scrollToCurriculum} className="lmacd-preview-btn" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "transparent", color: GOLD,
                    fontSize: 14, fontWeight: 700, height: "52px", padding: "0 24px", borderRadius: 11,
                    border: `2px solid ${GOLD}`, cursor: "pointer", fontFamily: FF,
                    transition: "background 0.20s ease",
                  }}>
                    <i className="fas fa-list-ul" style={{ fontSize: 12 }} />
                    View Curriculum
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="lmacd-hero-card-col">
            <HeroCourseCard course={course} totalLessons={totalLessons} onEnroll={handleEnroll} onPreview={scrollToCurriculum} />
          </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR ══ */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "13px 0" }}>
        <div className="lmacd-container">
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: "fas fa-award",         label: "CPD Accredited" },
              { icon: "fas fa-certificate",    label: "AWS Certified"  },
              { icon: "fas fa-shield-alt",     label: "ISO 27001"      },
              { icon: "fas fa-graduation-cap", label: "Hands-On Labs"  },
              { icon: "fas fa-users",          label: "500+ Trained"   },
              { icon: "fas fa-brain",          label: "OpenAI Partner" },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(20,20,19,0.52)", fontFamily: FF }}>
                <i className={t.icon} style={{ color: GOLD, fontSize: 13 }} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STICKY TAB NAV ══ */}
      <div ref={tabNavRef} className="lmacd-tab-nav" style={{ top: showStickyBar ? 52 : 0, transition: "top 0.26s ease" }}>
        <div className="lmacd-container">
          <div style={{ display: "flex" }}>
            {(["about", "curriculum"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                fontSize: 13.5, fontWeight: activeTab === t ? 700 : 500,
                color: activeTab === t ? GOLD : "rgba(20,20,19,0.48)",
                borderBottom: `2px solid ${activeTab === t ? GOLD : "transparent"}`,
                marginBottom: -2, padding: "13px 20px",
                background: "none", border: "none", borderRadius: 0, cursor: "pointer",
                fontFamily: FF, textTransform: "capitalize",
                transition: "color 0.18s ease",
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT AREA ══ */}
      <div style={{ background: CREAM, minHeight: 500 }}>
        <div className="lmacd-container">
          <div className="lmacd-body-row">

            {/* ── LEFT COLUMN ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {activeTab === "about" && (
                <>
                  <WhatYouLearnBox techStack={course.tech_stack ?? []} />
                  <SkillsPills items={course.tech_stack ?? []} heading="Skills you'll gain" />
                  <DetailsToKnow hours={course.hours} lessonsCount={totalLessons} level={course.level ?? ""} />
                  <button onClick={scrollToCurriculum} style={{
                    fontSize: 14, fontWeight: 700, color: GOLD,
                    background: "transparent", border: `1.5px solid ${GOLD}`,
                    borderRadius: 9, padding: "10px 22px", cursor: "pointer", fontFamily: FF,
                    display: "inline-flex", alignItems: "center", gap: 8,
                  }}>
                    View full curriculum <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
                  </button>

                  {/* ── Student outcomes ── */}
                  <div style={{ marginTop: 36 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: FF }}>What students achieve</h3>
                    <div className="lmacd-outcomes-grid">
                      {[
                        { num: "94%",    label: "Completion rate", icon: "fas fa-chart-line" },
                        { num: "4.8★",   label: "Average rating",  icon: "fas fa-star"       },
                        { num: "1,200+", label: "Active learners", icon: "fas fa-users"      },
                      ].map(s => (
                        <div key={s.label} className="lmacd-outcome-card">
                          <i className={s.icon} style={{ color: GOLD, fontSize: 18, marginBottom: 8, display: "block" }} />
                          <div style={{ fontSize: 22, fontWeight: 900, color: "#141413", lineHeight: 1, fontFamily: FF }}>{s.num}</div>
                          <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", marginTop: 4, fontFamily: FF }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginTop: 14 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                        {[1,2,3,4,5].map(n => <i key={n} className="fas fa-star" style={{ fontSize: 12, color: "#f59e0b" }} />)}
                      </div>
                      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.72, margin: "0 0 16px", fontFamily: FF, fontStyle: "italic" }}>
                        "The hands-on approach is what sets this apart. I deployed my first RAG pipeline in three weeks. The XERXEZ certification opened doors I didn't expect."
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#0a0806", flexShrink: 0, fontFamily: FF }}>R</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#141413", fontFamily: FF }}>Rahul Sharma</div>
                          <div style={{ fontSize: 11, color: "rgba(20,20,19,0.45)", fontFamily: FF }}>ML Engineer · Tata Consultancy Services</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "curriculum" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: 0, fontFamily: FF }}>
                      {course.modules?.length ?? 0}-Module Program
                    </h2>
                    <span style={{ fontSize: 12, color: "rgba(20,20,19,0.42)", fontFamily: FF }}>
                      {course.modules?.length ?? 0} modules · {totalLessons} lessons · {course.hours}h
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                    <button onClick={expandAll} style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: "none", border: "none", cursor: "pointer", fontFamily: FF, padding: 0 }}>
                      Expand all
                    </button>
                    <span style={{ color: "rgba(20,20,19,0.22)", fontSize: 14 }}>·</span>
                    <button onClick={collapseAll} style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: "none", border: "none", cursor: "pointer", fontFamily: FF, padding: 0 }}>
                      Collapse all
                    </button>
                  </div>
                  {(course.modules ?? []).map((mod: any, i: number) => (
                    <ModuleRow
                      key={mod.id ?? i}
                      mod={mod}
                      modIndex={i}
                      isOpen={openModules.has(i)}
                      toggle={() => toggleModule(i)}
                      revealDelay={Math.min(i * 45, 280)}
                    />
                  ))}
                  <div style={{ marginTop: 24, textAlign: "center" }}>
                    <button onClick={handleEnroll} style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                      color: "#0a0806", fontSize: 14, fontWeight: 700,
                      padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                      boxShadow: "0 4px 0 rgba(140,80,20,0.38),0 8px 24px rgba(201,136,58,0.22)",
                      fontFamily: FF,
                    }}>
                      Enroll in this course <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lmacd-right-col">

              <div className="lmacd-sidebar-card">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 18px", fontFamily: FF }}>Instructors</h3>
                <InstructorItem
                  name={course.instructor_name ?? "Expert Instructor"}
                  designation="Senior AI Instructor · XERXEZ Academy"
                  courses={2}
                  learners="1,650"
                />
                <InstructorItem
                  name="Danish Sheikh"
                  designation="Chief AI Officer · XERXEZ"
                  courses={2}
                  learners="500"
                />
                <button style={{ fontSize: 12.5, fontWeight: 700, color: GOLD, background: "none", border: "none", cursor: "pointer", fontFamily: FF, padding: 0, marginTop: 4 }}>
                  View all instructors →
                </button>
              </div>

              <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 0 16px" }} />

              <div className="lmacd-sidebar-card">
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: FF }}>Offered by</h3>
                <div style={{ background: DARK, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, border: "1px solid rgba(201,136,58,0.20)" }}>
                  <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 28, width: "auto" }} />
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.52)", lineHeight: 1.62, margin: "0 0 10px", fontFamily: FF }}>
                  Enterprise AI training and software solutions across UAE, India, and UK.
                </p>
                <Link to="/about" style={{ fontSize: 12.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: FF }}>
                  Learn more →
                </Link>
              </div>

              <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 0 16px" }} />

              <div style={{ background: `linear-gradient(160deg,${DARK} 0%,${DARK2} 100%)`, borderRadius: 16, padding: "20px 22px", border: `1px solid rgba(201,136,58,0.22)` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.36)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6, fontFamily: FF }}>
                  One-time · Lifetime access
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: GOLD, marginBottom: 14, fontFamily: FF }}>
                  ₹{course.price?.toLocaleString()}
                </div>
                {enrolled ? (
                  <Link to="/lma/student/dashboard" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#d1fae5", color: "#059669", fontSize: 14, fontWeight: 700,
                    padding: "12px", borderRadius: 10, textDecoration: "none", marginBottom: 10, fontFamily: FF,
                  }}>
                    <CheckCircle2 size={16} /> Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button onClick={handleEnroll} style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                      color: "#0a0806", fontSize: 14, fontWeight: 700,
                      border: "none", borderRadius: 10, padding: "12px", cursor: "pointer",
                      boxShadow: "0 4px 0 rgba(130,78,18,0.45)", marginBottom: 10, fontFamily: FF,
                    }}>
                      Enroll Now
                    </button>
                    <button onClick={handleEnroll} className="lmacd-preview-btn" style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: "transparent", color: GOLD, fontSize: 13, fontWeight: 600,
                      border: `2px solid ${GOLD}`, borderRadius: 10, padding: "11px",
                      cursor: "pointer", fontFamily: FF, marginBottom: 12,
                      transition: "background 0.20s ease",
                    }}>
                      Try Free Preview
                    </button>
                  </>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.42)", fontFamily: FF }}>
                  <ShieldCheck size={13} color="rgba(201,136,58,0.65)" />
                  30-day money-back guarantee
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ══ SOCIAL PROOF ══ */}
      <div style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "40px 0" }}>
        <div className="lmacd-container">
          <div style={{ display: "flex", gap: 40, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", maxWidth: 400 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 10px", fontFamily: FF }}>
                See how top teams master AI faster with XERXEZ
              </h3>
              <Link to="/contact" style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: FF }}>
                Request enterprise training →
              </Link>
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
              {["Tata", "Capgemini", "P&G", "L'Oréal", "Danone", "HCL"].map(co => (
                <span key={co} style={{
                  fontSize: 13, fontWeight: 600, color: "#3d2a10",
                  background: "rgba(201,136,58,0.10)",
                  border: "1px solid rgba(201,136,58,0.20)",
                  borderRadius: 8, padding: "6px 16px", fontFamily: FF,
                }}>{co}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ ADVANCE EXPERTISE STRIP ══ */}
      <div style={{ background: CREAM, padding: "56px 0" }}>
        <div className="lmacd-container">
          <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#141413", margin: "0 0 14px", fontFamily: FF }}>
                Advance your team's AI expertise
              </h2>
              <ul style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.82, paddingLeft: 20, margin: "0 0 20px", fontFamily: FF }}>
                <li>Learn from practitioners with real production deployments</li>
                <li>Master models and tools in hands-on labs from day one</li>
                <li>Build deep understanding of production AI systems</li>
                <li>Earn XERXEZ AI certification recognised at 40+ organisations</li>
              </ul>
              <Link to="/contact" style={{ fontSize: 13.5, fontWeight: 700, color: GOLD, textDecoration: "none", fontFamily: FF }}>
                Learn more about enterprise plans →
              </Link>
            </div>
            {courseList.length > 0 && (
              <div style={{ flexShrink: 0, maxWidth: 400, width: "100%" }}>
                <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
                  {courseList.map((c: any, i: number) => (
                    <Link key={c.id} to={`/lma/courses/${c.id}`}
                      onMouseEnter={() => setHovCourse(c.id)}
                      onMouseLeave={() => setHovCourse(null)}
                      style={{
                        display: "flex", gap: 14, padding: "16px 18px", textDecoration: "none",
                        background: c.id === course.id ? "#fdfaf6" : "#fff",
                        borderLeft: `4px solid ${GOLD}`,
                        borderBottom: i < courseList.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                        transform: hovCourse === c.id ? "translateX(4px)" : "translateX(0)",
                        transition: "transform 0.20s ease",
                      }}>
                      <ModuleThumbnail index={i} size={70} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#141413", lineHeight: 1.3, marginBottom: 3 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: "rgba(20,20,19,0.44)" }}>Course {i + 1} · {c.hours} hours</div>
                      </div>
                      <i className="fas fa-chevron-right" style={{ fontSize: 12, color: "#9ca3af", alignSelf: "center", flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.48)", margin: "10px 4px 0", lineHeight: 1.6, fontFamily: FF }}>
                  {course.description?.substring(0, 90)}…
                </p>
              </div>
            )}
          </div>
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
        .lmacd-container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

        .lmacd-hero {
          background: linear-gradient(160deg,${DARK} 0%,${DARK2} 100%);
          padding: 100px 0 72px;
          min-height: 85vh;
          position: relative;
        }
        /* Dot grid overlay */
        .lmacd-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(201,136,58,0.09) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }
        /* Particle canvas */
        .lmacd-particles { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }
        .lmacd-orb { position: absolute; border-radius: 50%; pointer-events: none; }
        .lmacd-orb-1 { top:8%;left:4%;width:360px;height:360px;background:radial-gradient(circle,rgba(201,136,58,0.10) 0%,transparent 70%);animation:lmacd-float1 9s ease-in-out infinite; }
        .lmacd-orb-2 { bottom:4%;right:6%;width:240px;height:240px;background:radial-gradient(circle,rgba(232,168,78,0.07) 0%,transparent 70%);animation:lmacd-float2 13s ease-in-out infinite; }
        .lmacd-orb-3 { top:48%;right:22%;width:110px;height:110px;background:radial-gradient(circle,rgba(201,136,58,0.13) 0%,transparent 70%);animation:lmacd-float3 7s ease-in-out infinite; }

        /* Floating geometric shapes */
        .lmacd-geo { position:absolute; pointer-events:none; }
        .lmacd-geo-1 { right:8%;top:15%;width:130px;height:130px;border:1.5px solid rgba(201,136,58,0.18);transform:rotate(45deg);animation:lmacd-geo-rot 20s linear infinite; }
        .lmacd-geo-2 { right:15%;top:55%;width:58px;height:58px;border:1.5px solid rgba(232,168,78,0.20);transform:rotate(45deg);animation:lmacd-geo-rot 14s linear infinite reverse; }
        .lmacd-geo-3 { right:4%;bottom:12%;width:180px;height:180px;border:1px solid rgba(201,136,58,0.10);border-radius:50%;animation:lmacd-float2 16s ease-in-out infinite; }
        .lmacd-geo-4 { right:28%;top:10%;width:30px;height:30px;background:rgba(201,136,58,0.12);border:1px solid rgba(201,136,58,0.35);transform:rotate(45deg);animation:lmacd-geo-pulse 4s ease-in-out infinite,lmacd-geo-glow 3s ease-in-out infinite; }
        @keyframes lmacd-geo-rot { to{transform:rotate(405deg);} }
        @keyframes lmacd-geo-pulse { 0%,100%{opacity:0.8} 50%{opacity:0.18} }
        @keyframes lmacd-geo-glow { 0%,100%{box-shadow:0 0 6px rgba(201,136,58,0.20),0 0 18px rgba(201,136,58,0.08)} 50%{box-shadow:0 0 22px rgba(201,136,58,0.80),0 0 50px rgba(201,136,58,0.40)} }

        .lmacd-tab-nav { background:#fff; border-bottom:2px solid rgba(0,0,0,0.08); position:sticky; z-index:90; }

        .lmacd-body-row { display:flex; gap:40px; align-items:flex-start; padding:32px 0 60px; }

        .lmacd-right-col { width:300px; flex-shrink:0; position:sticky; top:132px; }
        .lmacd-sidebar-card { background:#fff; border-radius:16px; padding:22px 22px 18px; border:1px solid rgba(0,0,0,0.08); box-shadow:0 4px 20px rgba(0,0,0,0.07); margin-bottom:16px; }

        .lmacd-spinner { width:36px; height:36px; border:3px solid rgba(201,136,58,0.18); border-top-color:${GOLD}; border-radius:50%; animation:lmacd-spin 0.8s linear infinite; display:inline-block; }

        @keyframes lmacd-float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-32px) scale(1.06)} }
        @keyframes lmacd-float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,26px) scale(0.95)} }
        @keyframes lmacd-float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(14px,-18px)} }
        @keyframes lmacd-spin { to{transform:rotate(360deg)} }

        button:focus-visible { outline:2px solid ${GOLD}; outline-offset:2px; }
        html { scroll-behavior:smooth; }

        @media (max-width:960px) {
          .lmacd-body-row { flex-direction:column; }
          .lmacd-right-col { width:100%; position:static; }
          .lmacd-tab-nav { top:0 !important; }
        }
        @media (max-width:600px) {
          .lmacd-learn-grid { grid-template-columns:1fr !important; }
          .lmacd-hero { padding:72px 0 48px; min-height:auto; }
          .lmacd-lesson-indent { padding-left:16px !important; }
        }
        /* Shimmer on sticky Enroll Now */
        .lmacd-shimmer-btn::after {
          content:'';
          position:absolute;
          top:0;left:-100%;
          width:55%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent);
          animation:lmacd-shimmer 2.4s ease-in-out infinite 0.8s;
          pointer-events:none;
        }
        @keyframes lmacd-shimmer { to{left:200%;} }

        /* Try Free Preview hover fill */
        .lmacd-preview-btn:hover { background:rgba(201,136,58,0.14) !important; }

        /* 375px mobile */
        @media (max-width:420px) {
          .lmacd-hero { padding:64px 0 40px; }
          .lmacd-container { padding:0 16px; }
          .lmacd-body-row { gap:24px; padding:20px 0 40px; }
        }

        @media (prefers-reduced-motion:reduce) {
          .lmacd-orb,.lmacd-geo { animation:none !important; }
          .lmacd-shimmer-btn::after { animation:none !important; }
          .lmacd-spinner { animation-duration:0.01ms !important; }
          .lmacd-hcard-wrap { animation:none !important; }
          .lmacd-particles { display:none !important; }
          * { transition-duration:0.01ms !important; }
        }

        /* ── Hero 2-col row ── */
        .lmacd-hero-row { display:flex; gap:48px; align-items:flex-start; }
        .lmacd-hero-text { flex:1; min-width:0; padding-top:8px; }
        .lmacd-hero-card-col { width:360px; flex-shrink:0; position:sticky; top:20px; align-self:flex-start; }

        /* ── 3-D floating card ── */
        .lmacd-hcard-wrap { animation:lmacd-card-float 4s ease-in-out infinite; }
        .lmacd-hcard {
          background:linear-gradient(145deg,#1f1507 0%,#120e05 100%);
          border-radius:18px; padding:24px; overflow:hidden;
          border:1px solid rgba(201,136,58,0.22);
          box-shadow:0 20px 60px rgba(0,0,0,0.50),inset 0 1px 0 rgba(255,255,255,0.05);
          transition:transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94);
          will-change:transform;
        }
        @keyframes lmacd-card-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

        /* ── Student outcomes ── */
        .lmacd-outcomes-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .lmacd-outcome-card { background:#fff; border-radius:14px; padding:18px 14px; border:1px solid rgba(0,0,0,0.07); text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05); }

        @media (max-width:1000px) {
          .lmacd-hero-row { flex-direction:column; }
          .lmacd-hero-card-col { width:100%; max-width:440px; margin:0 auto; position:static; }
        }
        @media (max-width:600px) {
          .lmacd-outcomes-grid { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  );
}
