import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { GraduationCap, BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import SEO from "../../components/seo/SEO";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD = "#C9883A";
const AMBER = "#E8A84E";
const DARK = "#1a1208";

type Role = "student" | "instructor";

/* ── Floating label input ── */
const FloatInput = ({
  id, label, type = "text", value, onChange, icon: Icon, right,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; icon: React.ElementType; right?: React.ReactNode;
}) => {
  const [focus, setFocus] = useState(false);
  const raised = focus || value.length > 0;
  return (
    <div style={{ position: "relative", marginBottom: 22 }}>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1.5px solid ${focus ? GOLD : "rgba(0,0,0,0.14)"}`,
        borderRadius: 12, background: focus ? "rgba(201,136,58,0.03)" : "#fafaf9",
        transition: "border-color 0.20s ease, background 0.20s ease",
        paddingLeft: 14,
      }}>
        <Icon size={16} color={focus ? GOLD : "#9ca3af"} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, position: "relative", paddingTop: 18, paddingBottom: 6 }}>
          <label htmlFor={id} style={{
            position: "absolute", left: 10,
            top: raised ? 4 : "50%", transform: raised ? "none" : "translateY(-50%)",
            fontSize: raised ? 10 : 14,
            color: raised ? GOLD : "#9ca3af",
            fontWeight: raised ? 700 : 400,
            letterSpacing: raised ? "0.06em" : "normal",
            transition: "all 0.18s ease",
            fontFamily: "'DM Sans', sans-serif",
            pointerEvents: "none",
          }}>{label}</label>
          <input
            id={id}
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{
              border: "none", outline: "none", background: "transparent",
              width: "100%", fontSize: 14, color: "#141413",
              fontFamily: "'DM Sans', sans-serif", paddingLeft: 10,
            }}
          />
        </div>
        {right}
      </div>
    </div>
  );
};

/* ── Left panel feature row ── */
const Feature = ({ text, delay }: { text: string; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "0"; el.style.transform = "translateX(-24px)";
    el.style.transition = `opacity 0.60s ease ${delay}ms, transform 0.60s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const t = setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateX(0)"; }, 100);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: "rgba(201,136,58,0.16)", border: "1px solid rgba(201,136,58,0.32)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <CheckCircle size={14} color={AMBER} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.80)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
        {text}
      </span>
    </div>
  );
};

export default function LMALoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/lma/student/dashboard";
  const action   = params.get("action")   || "";

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

  /* Slide animation for step 2 */
  const formRef = useRef<HTMLDivElement>(null);
  const goStep2 = () => {
    const el = formRef.current;
    if (el) { el.style.opacity = "0"; el.style.transform = "translateX(40px)"; }
    setTimeout(() => {
      setStep(2);
      if (el) {
        el.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)";
        requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateX(0)"; });
      }
    }, 180);
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

      localStorage.setItem("lma_token", data.lma_token);
      localStorage.setItem("lma_role", data.lma_role);
      localStorage.setItem("lma_can_instructor", String(data.can_access_instructor));
      localStorage.setItem("lma_name", data.name);

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
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: "0 0 55%", background: `linear-gradient(160deg, ${DARK} 0%, #100a05 100%)`,
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 64px",
      }} className="d-none d-lg-flex">
        {/* Orb */}
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
            <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 70, width: "auto" }} />
          </div>

          <h1 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            XERXEZ Academy
          </h1>
          <p style={{ fontSize: 18, color: AMBER, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, marginBottom: 40 }}>
            Enterprise AI Learning Platform
          </p>

          <Feature text="World-class AI & cloud technology courses" delay={300} />
          <Feature text="Industry expert instructors — built what they teach" delay={450} />
          <Feature text="Certified on completion, recognised by 40+ enterprises" delay={600} />

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
            {[{ v: "500+", l: "Students" }, { v: "12+", l: "Courses" }, { v: "95%", l: "Satisfaction" }].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 26, fontWeight: 900, background: `linear-gradient(135deg, ${AMBER} 0%, ${GOLD} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 500, marginTop: 4, letterSpacing: "0.06em" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f9f7f4", padding: "40px 24px",
      }}>
        <div ref={formRef} style={{
          width: "100%", maxWidth: 440,
          background: "#fff",
          borderRadius: 20,
          borderTop: `3px solid ${GOLD}`,
          boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.04)",
          padding: "40px 36px",
        }}>

          {step === 1 ? (
            <>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#141413", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                Welcome to XERXEZ Academy
              </h2>
              <p style={{ color: "rgba(20,20,19,0.50)", fontSize: 14, marginBottom: 32 }}>
                Select your role to continue
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                {([
                  { r: "student" as Role, Icon: GraduationCap, title: "Student", sub: "Access courses & track progress", badgeBg: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)` },
                  { r: "instructor" as Role, Icon: BookOpen, title: "Instructor", sub: "Create & manage courses", badgeBg: `linear-gradient(135deg,#2d2d2d 0%,${DARK} 100%)` },
                ]).map(({ r, Icon, title, sub, badgeBg }) => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    border: `2px solid ${role === r ? GOLD : "rgba(0,0,0,0.10)"}`,
                    borderRadius: 16, padding: "20px 16px", cursor: "pointer",
                    background: role === r ? "rgba(201,136,58,0.05)" : "#fafaf9",
                    textAlign: "left", transition: "all 0.20s ease",
                    outline: "none",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, marginBottom: 14,
                      background: badgeBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 4px 0 rgba(0,0,0,0.25), 0 6px 16px rgba(0,0,0,0.15)`,
                    }}>
                      <Icon size={20} color="#fff" />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#141413", marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.50)", lineHeight: 1.4 }}>{sub}</div>
                  </button>
                ))}
              </div>

              <button onClick={goStep2} disabled={!role} style={{
                width: "100%", height: 50, borderRadius: 12, border: "none", cursor: role ? "pointer" : "not-allowed",
                background: role ? `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)` : "#e5e7eb",
                color: role ? "#0a0806" : "#9ca3af", fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: role ? `0 4px 0 rgba(140,80,20,0.40), 0 8px 24px rgba(201,136,58,0.28)` : "none",
                transition: "all 0.20s ease",
              }}>
                Continue <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Link to="/training" style={{ fontSize: 12, color: "rgba(20,20,19,0.45)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <ArrowLeft size={12} /> Back to Website
                </Link>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
                <ArrowLeft size={14} /> Back
              </button>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,136,58,0.08)", border: "1px solid rgba(201,136,58,0.24)", borderRadius: 999, padding: "4px 14px", marginBottom: 20 }}>
                {role === "student" ? <GraduationCap size={13} color={GOLD} /> : <BookOpen size={13} color={GOLD} />}
                <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {role === "student" ? "Student Login" : "Instructor Login"}
                </span>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#141413", margin: "0 0 6px" }}>Sign In</h2>
              <p style={{ color: "rgba(20,20,19,0.50)", fontSize: 13, marginBottom: 28 }}>
                Enter your XERXEZ credentials
              </p>

              {error && (
                <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <FloatInput id="email" label="Email address" value={email} onChange={setEmail} icon={Mail} />
              <FloatInput
                id="password" label="Password" type={showPw ? "text" : "password"}
                value={password} onChange={setPassword} icon={Lock}
                right={
                  <button onClick={() => setShowPw(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 14px", color: "#9ca3af" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "rgba(20,20,19,0.60)" }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: GOLD }} />
                  Remember me
                </label>
                <a href="#" style={{ fontSize: 13, color: GOLD, textDecoration: "none", fontWeight: 600 }}>Forgot password?</a>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: "100%", height: 52, borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
                  color: "#0a0806", fontSize: 15, fontWeight: 800, cursor: loading ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: `0 4px 0 rgba(140,80,20,0.40), 0 8px 24px rgba(201,136,58,0.30)`,
                  position: "relative", overflow: "hidden",
                }}
              >
                {loading ? (
                  <div style={{ width: 20, height: 20, border: "2.5px solid rgba(10,8,6,0.30)", borderTop: "2.5px solid #0a0806", borderRadius: "50%", animation: "lma-spin 0.8s linear infinite" }} />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: 13, color: "rgba(20,20,19,0.50)", marginTop: 20 }}>
                Don't have an account?{" "}
                <Link to={`/lma/register?redirect=${encodeURIComponent(redirect)}${action ? `&action=${action}` : ""}`} style={{ color: GOLD, fontWeight: 600, textDecoration: "none" }}>Register</Link>
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                {[{ icon: Shield, text: "AES-256" }, { icon: Shield, text: "ISO 27001" }].map(({ icon: I, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <I size={12} color={GOLD} />
                    <span style={{ fontSize: 11, color: "rgba(20,20,19,0.40)", fontWeight: 600 }}>{text}</span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Link to="/training" style={{ fontSize: 12, color: "rgba(20,20,19,0.40)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <ArrowLeft size={11} /> Back to Website
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes lma-spin { to { transform: rotate(360deg); } }
        @media (max-width: 991px) { .d-none.d-lg-flex { display: none !important; } }
      `}</style>
    </div>
    </>
  );
}
