import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star, Users, Clock, BookOpen, ChevronDown, ChevronRight,
  Play, Lock, CheckCircle2, Award, Globe, ArrowLeft,
  ShoppingCart, Zap, Shield,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD = "#C9883A";
const AMBER = "#E8A84E";
const DARK = "#1a1208";

/* ── Mock payment modal ── */
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.60)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px", width: "100%", maxWidth: 440, boxShadow: "0 24px 64px rgba(0,0,0,0.30)" }}>
        {step === "confirm" && (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#141413", margin: "0 0 6px" }}>Confirm Enrollment</h3>
            <p style={{ fontSize: 13, color: "rgba(20,20,19,0.55)", margin: "0 0 20px" }}>You're about to enroll in:</p>
            <div style={{ background: "#f9f7f4", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#141413", marginBottom: 4 }}>{course.title}</div>
              <div style={{ fontSize: 12, color: "rgba(20,20,19,0.45)" }}>by {course.instructor_name}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", padding: "12px 0", margin: "0 0 20px" }}>
              <span style={{ fontSize: 14, color: "rgba(20,20,19,0.55)" }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: GOLD }}>₹{course.price?.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20 }}>
              <Shield size={13} color="#9ca3af" />
              <span style={{ fontSize: 11, color: "#9ca3af" }}>30-day money-back guarantee · Lifetime access</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 10, padding: 12, cursor: "pointer" }}>Cancel</button>
              <button onClick={pay} style={{ flex: 2, fontSize: 13, fontWeight: 700, color: "#0a0806", background: `linear-gradient(135deg,${AMBER},${GOLD})`, border: "none", borderRadius: 10, padding: 12, cursor: "pointer", boxShadow: "0 2px 0 rgba(140,80,20,0.35)" }}>
                Pay ₹{course.price?.toLocaleString()} →
              </button>
            </div>
          </>
        )}
        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 40, height: 40, border: `3px solid rgba(201,136,58,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lma-spin 0.8s linear infinite", display: "inline-block", marginBottom: 16 }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#141413" }}>Processing payment…</p>
          </div>
        )}
        {step === "done" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={28} color="#059669" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#141413", margin: "0 0 6px" }}>Enrolled Successfully!</h3>
            <p style={{ fontSize: 13, color: "rgba(20,20,19,0.55)" }}>Redirecting to your dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Module accordion ── */
const ModuleRow = ({ mod }: { mod: any }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", background: open ? "#f9f7f4" : "#fff", border: "none", cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#141413" }}>{mod.title}</span>
          <span style={{ fontSize: 11, color: "rgba(20,20,19,0.40)" }}>{mod.lessons?.length ?? 0} lessons</span>
        </div>
        {open ? <ChevronDown size={16} color="#9ca3af" /> : <ChevronRight size={16} color="#9ca3af" />}
      </button>
      {open && (
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {(mod.lessons ?? []).map((l: any) => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {l.is_free_preview
                ? <Play size={14} color={GOLD} style={{ flexShrink: 0 }} />
                : <Lock size={14} color="#d1d5db" style={{ flexShrink: 0 }} />}
              <span style={{ flex: 1, fontSize: 13, color: l.is_free_preview ? "#141413" : "rgba(20,20,19,0.50)" }}>{l.title}</span>
              {l.is_free_preview && <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>Free</span>}
              <span style={{ fontSize: 11, color: "rgba(20,20,19,0.35)" }}>{l.duration}m</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Star rating display ── */
const Stars = ({ rating }: { rating: number }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(n => (
      <Star key={n} size={14} color="#f59e0b" fill={n <= Math.round(rating) ? "#f59e0b" : "none"} />
    ))}
  </div>
);

export default function LMACourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");
  const [showPay, setShowPay] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/lma/courses/${id}/`)
      .then(r => r.json())
      .then(d => { setCourse(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = () => {
    if (!token) { navigate("/lma/login"); return; }
    setShowPay(true);
  };

  const totalLessons = course?.modules?.reduce((s: number, m: any) => s + (m.lessons?.length ?? 0), 0) ?? 0;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f4f2ef" }}>
      <div style={{ width: 36, height: 36, border: `3px solid rgba(201,136,58,0.20)`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lma-spin 0.8s linear infinite" }} />
      <style>{`@keyframes lma-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!course) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f4f2ef", fontFamily: "'DM Sans', sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#141413", marginBottom: 8 }}>Course not found</h2>
      <Link to="/lma/courses" style={{ color: GOLD, fontSize: 14, fontWeight: 600 }}>← Browse Courses</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f2ef", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${DARK} 0%,#100c07 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "30%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 60px", position: "relative", zIndex: 1 }}>
          <Link to="/lma/courses" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.50)", textDecoration: "none", marginBottom: 24, transition: "color 0.2s ease" }}>
            <ArrowLeft size={14} /> Back to Courses
          </Link>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              {course.badge && (
                <span style={{ display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.10em", padding: "3px 10px", borderRadius: 999, background: "rgba(255,193,0,0.18)", color: "#d97706", marginBottom: 12 }}>
                  {course.badge}
                </span>
              )}
              <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>{course.category}</div>
              <h1 style={{ fontSize: "clamp(22px,4vw,38px)", fontWeight: 900, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>{course.title}</h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 18px", lineHeight: 1.6, maxWidth: 600 }}>{course.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 14 }}>
                {course.rating && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Stars rating={course.rating} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b" }}>{course.rating}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.40)" }}>({course.total_ratings} ratings)</span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.50)", fontSize: 13 }}>
                  <Users size={14} /> {(course.total_students ?? 0).toLocaleString()} students
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={13} /> {course.hours}h total</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><BookOpen size={13} /> {totalLessons} lessons</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Globe size={13} /> English</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + content + sticky card */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 300, marginTop: 28 }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "2px solid rgba(0,0,0,0.08)", marginBottom: 28 }}>
            {(["overview","curriculum","instructor","reviews"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                fontSize: 13.5, fontWeight: tab === t ? 700 : 500,
                color: tab === t ? GOLD : "rgba(20,20,19,0.50)",
                borderBottom: `2px solid ${tab === t ? GOLD : "transparent"}`, marginBottom: -2,
                padding: "10px 18px", background: "none", border: "none", borderRadius: 0, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize",
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>What you'll learn</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
                {(course.tech_stack ?? []).map((t: string) => (
                  <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13.5, color: "#374151" }}>Hands-on with {t}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13.5, color: "#374151" }}>Build real production systems</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13.5, color: "#374151" }}>Certificate upon completion</span>
                </div>
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 12px" }}>Course Requirements</h2>
              <ul style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
                <li>Basic programming knowledge</li>
                <li>Computer with internet access</li>
                <li>Curiosity and willingness to learn</li>
              </ul>
            </div>
          )}

          {tab === "curriculum" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: 0 }}>Course Curriculum</h2>
                <span style={{ fontSize: 12, color: "rgba(20,20,19,0.45)" }}>{course.modules?.length ?? 0} modules · {totalLessons} lessons · {course.hours}h</span>
              </div>
              {(course.modules ?? []).map((m: any) => <ModuleRow key={m.id} mod={m} />)}
            </div>
          )}

          {tab === "instructor" && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>Your Instructor</h2>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg,${AMBER},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22, fontWeight: 800, color: "#0a0806" }}>
                  {(course.instructor_name ?? "I").charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#141413", marginBottom: 4 }}>{course.instructor_name}</div>
                  <div style={{ fontSize: 13, color: "rgba(20,20,19,0.55)" }}>Senior Instructor at XERXEZ Academy</div>
                  <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                    {course.rating && <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700 }}>★ {course.rating} Instructor Rating</span>}
                    <span style={{ fontSize: 12, color: "rgba(20,20,19,0.45)" }}>{(course.total_students ?? 0).toLocaleString()} Students</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7 }}>
                An expert practitioner with years of hands-on experience building enterprise AI systems. Passionate about making complex technology accessible through clear, practical teaching.
              </p>
            </div>
          )}

          {tab === "reviews" && (
            <div>
              <div style={{ display: "flex", gap: 28, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 56, fontWeight: 900, color: "#141413", lineHeight: 1 }}>{course.rating ?? "–"}</div>
                  <Stars rating={course.rating ?? 0} />
                  <div style={{ fontSize: 12, color: "rgba(20,20,19,0.45)", marginTop: 4 }}>Course Rating</div>
                </div>
              </div>
              {(course.reviews ?? []).length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#9ca3af", fontSize: 13 }}>No reviews yet. Be the first to review after enrolling!</div>
              ) : (
                (course.reviews ?? []).map((r: any) => (
                  <div key={r.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", paddingBottom: 20, marginBottom: 20 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {r.student_name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#141413" }}>{r.student_name}</div>
                        <Stars rating={r.rating} />
                        <p style={{ fontSize: 13.5, color: "#374151", margin: "8px 0 0", lineHeight: 1.6 }}>{r.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sticky price card */}
        <div ref={stickyRef} style={{ width: 300, flexShrink: 0, position: "sticky", top: 80, marginTop: -60 }}>
          <div style={{
            background: "#fff", borderRadius: 18, overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
            border: "1px solid rgba(0,0,0,0.07)",
          }}>
            <div style={{ height: 8, background: `linear-gradient(90deg,${AMBER},${GOLD})` }} />
            <div style={{ padding: "24px" }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: GOLD, marginBottom: 4 }}>
                ₹{course.price?.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "rgba(20,20,19,0.40)", marginBottom: 20 }}>One-time payment · Lifetime access</div>

              {enrolled ? (
                <Link to="/lma/student/dashboard" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "#d1fae5", color: "#059669", fontSize: 14, fontWeight: 700,
                  padding: "13px", borderRadius: 10, textDecoration: "none", marginBottom: 12,
                }}>
                  <CheckCircle2 size={16} /> Go to Dashboard
                </Link>
              ) : (
                <>
                  <button onClick={handleEnroll} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                    color: "#0a0806", fontSize: 14, fontWeight: 700,
                    border: "none", borderRadius: 10, padding: "13px", cursor: "pointer",
                    boxShadow: "0 4px 0 rgba(140,80,20,0.35)", marginBottom: 10, fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <ShoppingCart size={16} /> Enroll Now
                  </button>
                  <button onClick={handleEnroll} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "transparent", color: GOLD, fontSize: 13, fontWeight: 700,
                    border: `1.5px solid ${GOLD}`, borderRadius: 10, padding: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
                  }}>
                    <Zap size={14} /> Try Free Preview
                  </button>
                </>
              )}

              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 16 }}>
                <Shield size={12} color="#9ca3af" />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>30-day money-back guarantee</span>
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 14 }}>
                <h4 style={{ fontSize: 12, fontWeight: 800, color: "#141413", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>This course includes:</h4>
                {[
                  [Clock, `${course.hours}h on-demand video`],
                  [BookOpen, `${totalLessons} lessons`],
                  [Globe, "Full lifetime access"],
                  [Award, "Certificate of completion"],
                ].map(([Icon, text]) => {
                  const I = Icon as React.ElementType;
                  return (
                    <div key={text as string} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}>
                      <I size={13} color={GOLD} />
                      <span style={{ fontSize: 12.5, color: "rgba(20,20,19,0.60)" }}>{text as string}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 60 }} />

      {showPay && <PaymentModal course={course} token={token} onClose={() => setShowPay(false)} onEnrolled={() => setEnrolled(true)} />}

      <style>{`
        @keyframes lma-spin { to { transform: rotate(360deg); } }
        @media (max-width:768px) { [data-sticky] { position:static !important; width:100% !important; } }
      `}</style>
    </div>
  );
}
