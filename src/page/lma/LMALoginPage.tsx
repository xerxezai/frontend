import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  GraduationCap, BookOpen, Mail, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, Shield, CheckCircle,
} from "lucide-react";
import SEO from "../../components/seo/SEO";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const FF    = "'DM Sans', sans-serif";
const CREAM = "#f9f7f4";

type Role = "student" | "instructor";

/* ── 3D card tilt ── */
function useCardTilt(intensity = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform  = `perspective(1400px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(16px)`;
    el.style.transition = "transform 0.07s linear";
    el.style.boxShadow  = `0 32px 72px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.06), 0 ${Math.abs(y * 18) + 8}px ${Math.abs(x * 28) + 32}px rgba(0,0,0,0.10)`;
  };
  const onMouseLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform  = "perspective(1400px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s cubic-bezier(0.22,1,0.36,1)";
    el.style.boxShadow  = "0 4px 6px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.10), 0 40px 80px rgba(0,0,0,0.06)";
  };
  return { ref, onMouseMove, onMouseLeave };
}

/* ── Floating label input with gold glow ── */
const FloatInput = ({
  id, label, type = "text", value, onChange, icon: Icon, right,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; icon: React.ElementType; right?: React.ReactNode;
}) => {
  const [focus, setFocus] = useState(false);
  const raised = focus || value.length > 0;
  return (
    <div style={{ position: "relative", marginBottom: 18 }}>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1.5px solid ${focus ? GOLD : "rgba(0,0,0,0.12)"}`,
        borderRadius: 12,
        background: focus ? "rgba(201,136,58,0.025)" : "#fafaf9",
        boxShadow: focus
          ? `0 0 0 3px rgba(201,136,58,0.15), 0 1px 3px rgba(0,0,0,0.06)`
          : `0 1px 2px rgba(0,0,0,0.04)`,
        transition: "all 0.20s ease",
        paddingLeft: 14,
      }}>
        <Icon size={16} color={focus ? GOLD : "#b0b8c4"} style={{ flexShrink: 0, transition: "color 0.20s ease" }} />
        <div style={{ flex: 1, position: "relative", paddingTop: 18, paddingBottom: 6 }}>
          <label htmlFor={id} style={{
            position: "absolute", left: 10,
            top: raised ? 4 : "50%", transform: raised ? "none" : "translateY(-50%)",
            fontSize: raised ? 10 : 14,
            color: raised ? GOLD : "#9ca3af",
            fontWeight: raised ? 700 : 400,
            letterSpacing: raised ? "0.06em" : "normal",
            transition: "all 0.18s ease",
            fontFamily: FF, pointerEvents: "none",
          }}>{label}</label>
          <input
            id={id} type={type} value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{
              border: "none", outline: "none", background: "transparent",
              width: "100%", fontSize: 14, color: "#141413",
              fontFamily: FF, paddingLeft: 10,
            }}
          />
        </div>
        {right}
      </div>
    </div>
  );
};

/* ── Left panel feature bullet ── */
const Feature = ({ text, delay }: { text: string; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateX(-28px)";
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const t = setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateX(0)"; }, 80);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: "rgba(201,136,58,0.16)", border: "1px solid rgba(201,136,58,0.28)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <CheckCircle size={14} color={AMBER} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.80)", fontSize: 14, fontFamily: FF }}>{text}</span>
    </div>
  );
};

/* ── 3D role selection card ── */
const RoleCard3D = ({
  Icon, title, sub, badgeBg, selected, onClick,
}: {
  Icon: React.ElementType; title: string; sub: string;
  badgeBg: string; selected: boolean; onClick: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform  = `perspective(600px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateZ(10px)`;
    el.style.transition = "transform 0.07s linear";
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform  = "perspective(600px) rotateY(0) rotateX(0) translateZ(0)";
    el.style.transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1)";
  };
  return (
    <button
      ref={ref} onClick={onClick}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        border: `2px solid ${selected ? GOLD : "rgba(0,0,0,0.09)"}`,
        borderRadius: 16, padding: "20px 16px", cursor: "pointer",
        background: selected ? "rgba(201,136,58,0.05)" : "#fafaf9",
        textAlign: "left", outline: "none", willChange: "transform",
        boxShadow: selected
          ? `0 0 0 3px rgba(201,136,58,0.14), 0 8px 20px rgba(0,0,0,0.09)`
          : `0 2px 8px rgba(0,0,0,0.06)`,
        transition: "border-color 0.20s ease, background 0.20s ease, box-shadow 0.20s ease",
      }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, marginBottom: 14,
        background: badgeBg, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 4px 0 rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.12)`,
      }}>
        <Icon size={20} color="#fff" />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#141413", marginBottom: 4, fontFamily: FF }}>{title}</div>
      <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.50)", lineHeight: 1.4, fontFamily: FF }}>{sub}</div>
    </button>
  );
};

/* ── Animated stat counter (left panel) ── */
const StatCounter = ({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateY(14px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)";
      el.style.opacity = "1"; el.style.transform = "translateY(0)";
      let s = 0;
      const step = target / 40;
      const iv = setInterval(() => {
        s = Math.min(s + step, target);
        setCount(Math.round(s));
        if (s >= target) clearInterval(iv);
      }, 28);
    }, 820);
    return () => clearTimeout(t);
  }, [target]);
  return (
    <div ref={ref}>
      <div style={{
        fontSize: 26, fontWeight: 900, lineHeight: 1,
        background: `linear-gradient(135deg,${AMBER},${GOLD})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{count}{suffix}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 500, marginTop: 4, letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
};

/* ── Security badge row ── */
const SecurityBadges = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
    {[
      { dot: "#22c55e", text: "AES-256 Encrypted" },
      { dot: AMBER,     text: "ISO 27001"         },
    ].map(b => (
      <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: b.dot, boxShadow: `0 0 6px ${b.dot}80` }} />
        <span style={{ fontSize: 11, color: "rgba(20,20,19,0.42)", fontWeight: 600, fontFamily: FF }}>{b.text}</span>
      </div>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════════ */
export default function LMALoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/lma/student/dashboard";
  const action   = params.get("action")   || "";

  const [step, setStep]       = useState<1 | 2>(1);
  const [role, setRole]       = useState<Role | null>(null);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [remember, setRemember] = useState(false);

  const card = useCardTilt(6);

  /* Step transition — slide card out then swap content */
  const goStep2 = () => {
    const el = card.ref.current;
    if (el) {
      el.style.opacity   = "0";
      el.style.transform = "perspective(1400px) translateX(36px) scale(0.97)";
      el.style.transition = "opacity 0.18s ease, transform 0.18s ease";
    }
    setTimeout(() => {
      setStep(2);
      requestAnimationFrame(() => {
        if (!el) return;
        el.style.transition = "opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1)";
        el.style.opacity   = "1";
        el.style.transform = "perspective(1400px) translateX(0) scale(1)";
      });
    }, 190);
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/lma/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed."); return; }
      localStorage.setItem("lma_token",          data.lma_token);
      localStorage.setItem("lma_role",           data.lma_role);
      localStorage.setItem("lma_can_instructor", String(data.can_access_instructor));
      localStorage.setItem("lma_name",           data.name);
      if (role === "instructor" && data.can_access_instructor) {
        navigate("/lma/instructor/dashboard");
      } else {
        const dest = redirect.startsWith("/lma") ? redirect : "/lma/student/dashboard";
        navigate(action ? `${dest}?action=${action}` : dest);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login | XERXEZ Academy" description="Sign in to your XERXEZ Academy account." canonical="/lma/login" noIndex />
      <div style={{ minHeight: "100vh", display: "flex", fontFamily: FF }}>

        {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
        <div className="lma-left" style={{
          flex: "0 0 55%",
          background: `linear-gradient(158deg, ${DARK} 0%, #0d0702 100%)`,
          position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px 64px",
        }}>
          {/* Atmospheric orbs */}
          <div style={{ position: "absolute", top: "12%", left: "22%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.14) 0%, transparent 66%)", pointerEvents: "none", animation: "lma-float 9s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "6%", right: "4%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.08) 0%, transparent 70%)", pointerEvents: "none", animation: "lma-float 7s ease-in-out infinite reverse" }} />
          <div style={{ position: "absolute", top: "62%", left: "-6%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,168,78,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          {/* Dot grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
            {/* Logo */}
            <div style={{ marginBottom: 48, animation: "lma-fadeSlideIn 0.7s ease both" }}>
              <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 70, width: "auto" }} />
            </div>

            <h1 style={{
              fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 800, color: "#fff",
              lineHeight: 1.1, margin: "0 0 8px", letterSpacing: "-0.02em",
              animation: "lma-fadeSlideIn 0.7s ease 0.1s both",
            }}>
              XERXEZ Academy
            </h1>
            <p style={{
              fontSize: 18, color: AMBER, fontStyle: "italic",
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, marginBottom: 40,
              animation: "lma-fadeSlideIn 0.7s ease 0.2s both",
            }}>
              Enterprise AI Learning Platform
            </p>

            <Feature text="World-class AI & cloud technology courses"         delay={350} />
            <Feature text="Industry expert instructors — built what they teach" delay={500} />
            <Feature text="Certified on completion, recognised by 40+ enterprises" delay={650} />

            {/* Stats */}
            <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.09)" }}>
              <StatCounter target={500} label="Students"     suffix="+" />
              <StatCounter target={12}  label="Courses"      suffix="+" />
              <StatCounter target={95}  label="Satisfaction" suffix="%" />
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ═════════════════════════════════════════════ */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: CREAM, padding: "40px 24px",
        }}>

          {/* ── 3D CARD ── */}
          <div
            ref={card.ref}
            onMouseMove={card.onMouseMove}
            onMouseLeave={card.onMouseLeave}
            style={{
              width: "100%", maxWidth: 444,
              background: "#fff",
              borderRadius: 22,
              borderTop: `3px solid ${GOLD}`,
              boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.10), 0 40px 80px rgba(0,0,0,0.06)",
              padding: "40px 36px",
              willChange: "transform, box-shadow",
              animation: "lma-cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {/* ── STEP 1: Role picker ── */}
            {step === 1 ? (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#141413", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                  Welcome to XERXEZ Academy
                </h2>
                <p style={{ color: "rgba(20,20,19,0.50)", fontSize: 14, marginBottom: 32 }}>
                  Select your role to continue
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                  <RoleCard3D
                    Icon={GraduationCap} title="Student"
                    sub="Access courses & track progress"
                    badgeBg={`linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`}
                    selected={role === "student"} onClick={() => setRole("student")}
                  />
                  <RoleCard3D
                    Icon={BookOpen} title="Instructor"
                    sub="Create & manage courses"
                    badgeBg={`linear-gradient(135deg,#2d2d2d 0%,${DARK} 100%)`}
                    selected={role === "instructor"} onClick={() => setRole("instructor")}
                  />
                </div>

                <button onClick={goStep2} disabled={!role} style={{
                  width: "100%", height: 52, borderRadius: 12, border: "none",
                  cursor: role ? "pointer" : "not-allowed",
                  background: role ? `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)` : "#e5e7eb",
                  color: role ? "#0a0806" : "#9ca3af",
                  fontSize: 15, fontWeight: 700, fontFamily: FF,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: role ? `0 4px 0 rgba(140,80,20,0.38), 0 8px 24px rgba(201,136,58,0.26)` : "none",
                  transition: "all 0.20s ease",
                }}>
                  Continue <ArrowRight size={16} />
                </button>

                <div style={{ textAlign: "center", marginTop: 22 }}>
                  <Link to="/training" style={{ fontSize: 12, color: "rgba(20,20,19,0.40)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <ArrowLeft size={11} /> Back to Website
                  </Link>
                </div>
              </>
            ) : (
              /* ── STEP 2: Sign in form ── */
              <>
                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, padding: 0, fontFamily: FF }}>
                  <ArrowLeft size={14} /> Back
                </button>

                {/* Role pill */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,136,58,0.08)", border: "1px solid rgba(201,136,58,0.22)", borderRadius: 999, padding: "4px 14px", marginBottom: 20 }}>
                  {role === "student"
                    ? <GraduationCap size={13} color={GOLD} />
                    : <BookOpen size={13} color={GOLD} />}
                  <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF }}>
                    {role === "student" ? "Student Login" : "Instructor Login"}
                  </span>
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Sign In</h2>
                <p style={{ color: "rgba(20,20,19,0.50)", fontSize: 13, marginBottom: 28, fontFamily: FF }}>
                  {role === "student"
                    ? "Enter your XERXEZ Academy credentials"
                    : "Enter your instructor credentials"}
                </p>

                {error && (
                  <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#dc2626", fontFamily: FF }}>
                    {error}
                  </div>
                )}

                <FloatInput id="email"    label="Email address" value={email}    onChange={setEmail}    icon={Mail} />
                <FloatInput id="password" label="Password"
                  type={showPw ? "text" : "password"}
                  value={password} onChange={setPassword} icon={Lock}
                  right={
                    <button onClick={() => setShowPw(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 14px", color: "#9ca3af" }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "rgba(20,20,19,0.60)", fontFamily: FF }}>
                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: GOLD }} />
                    Remember me
                  </label>
                  <a href="#" style={{ fontSize: 13, color: GOLD, textDecoration: "none", fontWeight: 600, fontFamily: FF }}>Forgot Password?</a>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="lma-signin-btn"
                  style={{
                    width: "100%", height: 52, borderRadius: 12, border: "none",
                    background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
                    color: "#0a0806", fontSize: 15, fontWeight: 800,
                    cursor: loading ? "wait" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: `0 4px 0 rgba(140,80,20,0.38), 0 8px 24px rgba(201,136,58,0.28)`,
                    position: "relative", overflow: "hidden", fontFamily: FF,
                    transition: "transform 0.12s ease, box-shadow 0.12s ease",
                  }}
                >
                  {loading ? (
                    <div style={{ width: 20, height: 20, border: "2.5px solid rgba(10,8,6,0.25)", borderTop: "2.5px solid #0a0806", borderRadius: "50%", animation: "lma-spin 0.8s linear infinite" }} />
                  ) : (
                    <>Sign In <ArrowRight size={16} /></>
                  )}
                </button>

                {/* ── Role-conditional bottom section ── */}
                {role === "student" ? (
                  <p style={{ textAlign: "center", fontSize: 13, color: "rgba(20,20,19,0.50)", marginTop: 20, fontFamily: FF }}>
                    Don't have an account?{" "}
                    <Link
                      to={`/lma/register?redirect=${encodeURIComponent(redirect)}${action ? `&action=${action}` : ""}`}
                      style={{ color: GOLD, fontWeight: 600, textDecoration: "none" }}
                    >Register</Link>
                  </p>
                ) : (
                  /* Instructor: restricted access notice, no register link */
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginTop: 20, padding: "11px 16px", borderRadius: 10,
                    background: "rgba(201,136,58,0.06)", border: "1px solid rgba(201,136,58,0.18)",
                  }}>
                    <Shield size={13} color={GOLD} />
                    <span style={{ fontSize: 12, color: "rgba(20,20,19,0.55)", fontFamily: FF }}>
                      Access restricted to invited instructors only
                    </span>
                  </div>
                )}

                <SecurityBadges />

                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Link to="/training" style={{ fontSize: 12, color: "rgba(20,20,19,0.36)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FF }}>
                    <ArrowLeft size={11} /> Back to Website
                  </Link>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: 28, fontSize: 11.5, color: "rgba(20,20,19,0.28)", fontFamily: FF }}>
            © 2026 XERXEZ. All Rights Reserved.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lma-spin        { to { transform: rotate(360deg); } }
        @keyframes lma-float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
        @keyframes lma-fadeSlideIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lma-cardIn      {
          from { opacity:0; transform:perspective(1400px) translateY(30px) scale(0.96); }
          to   { opacity:1; transform:perspective(1400px) translateY(0)    scale(1);    }
        }
        .lma-left { display: flex; }
        .lma-signin-btn:active:not(:disabled) {
          transform: translateY(2px) !important;
          box-shadow: 0 2px 0 rgba(140,80,20,0.38) !important;
        }
        @media (max-width: 991px) { .lma-left { display: none !important; } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </>
  );
}
