import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, Shield } from "lucide-react";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";

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
    <div style={{ position: "relative", marginBottom: 20 }}>
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

/* ── Password strength indicator ── */
const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = getStrength();
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
  if (!password) return null;
  return (
    <div style={{ marginTop: -12, marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i <= strength ? colors[strength] : "#e5e7eb",
            transition: "background 0.25s ease",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: colors[strength] || "#9ca3af" }}>
        {labels[strength]}
      </span>
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

export default function LMARegisterPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/lma/student/dashboard";
  const action   = params.get("action")   || "";

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields."); return;
    }
    if (password !== confirm) {
      setError("Passwords do not match."); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/lma/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }

      localStorage.setItem("lma_token", data.lma_token);
      localStorage.setItem("lma_role", data.lma_role);
      localStorage.setItem("lma_can_instructor", String(data.can_access_instructor));
      localStorage.setItem("lma_name", data.name);

      const dest = redirect.startsWith("/lma") ? redirect : "/lma/student/dashboard";
      navigate(action ? `${dest}?action=${action}` : dest);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginUrl = `/lma/login?redirect=${encodeURIComponent(redirect)}${action ? `&action=${action}` : ""}`;

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: "0 0 55%", background: `linear-gradient(160deg, ${DARK} 0%, #100a05 100%)`,
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 64px",
      }} className="lmarg-panel-left">
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
            <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 48, width: "auto" }} />
          </div>

          <h1 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Start Learning Today
          </h1>
          <p style={{ fontSize: 18, color: AMBER, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, marginBottom: 40 }}>
            Join thousands of learners
          </p>

          <Feature text="Free to sign up — pay only for courses you choose" delay={300} />
          <Feature text="Instant access to preview lessons and course materials" delay={450} />
          <Feature text="Earn verified certificates recognised industry-wide" delay={600} />

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
        <div style={{
          width: "100%", maxWidth: 440,
          background: "#fff",
          borderRadius: 20,
          borderTop: `3px solid ${GOLD}`,
          boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.04)",
          padding: "40px 36px",
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#141413", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
            Create your account
          </h2>
          <p style={{ color: "rgba(20,20,19,0.50)", fontSize: 14, marginBottom: 28 }}>
            Join XERXEZ Academy — it's free
          </p>

          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#dc2626" }}>
              {error}
            </div>
          )}

          <FloatInput id="name" label="Full name" value={name} onChange={setName} icon={User} />
          <FloatInput id="email" label="Email address" type="email" value={email} onChange={setEmail} icon={Mail} />
          <FloatInput
            id="password" label="Password" type={showPw ? "text" : "password"}
            value={password} onChange={setPassword} icon={Lock}
            right={
              <button onClick={() => setShowPw(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 14px", color: "#9ca3af" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <PasswordStrength password={password} />
          <FloatInput
            id="confirm" label="Confirm password" type={showCf ? "text" : "password"}
            value={confirm} onChange={setConfirm} icon={Lock}
            right={
              <button onClick={() => setShowCf(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 14px", color: "#9ca3af" }}>
                {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%", height: 52, borderRadius: 12, border: "none",
              background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
              color: "#0a0806", fontSize: 15, fontWeight: 800, cursor: loading ? "wait" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4,
              boxShadow: `0 4px 0 rgba(140,80,20,0.40), 0 8px 24px rgba(201,136,58,0.30)`,
            }}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, border: "2.5px solid rgba(10,8,6,0.30)", borderTop: "2.5px solid #0a0806", borderRadius: "50%", animation: "lmarg-spin 0.8s linear infinite" }} />
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(20,20,19,0.50)", marginTop: 20 }}>
            Already have an account?{" "}
            <Link to={loginUrl} style={{ color: GOLD, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            {[{ text: "AES-256" }, { text: "ISO 27001" }].map(({ text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Shield size={12} color={GOLD} />
                <span style={{ fontSize: 11, color: "rgba(20,20,19,0.40)", fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/training" style={{ fontSize: 12, color: "rgba(20,20,19,0.40)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <ArrowLeft size={11} /> Back to Website
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lmarg-spin { to { transform: rotate(360deg); } }
        @media (max-width: 991px) { .lmarg-panel-left { display: none !important; } }
      `}</style>
    </div>
  );
}
