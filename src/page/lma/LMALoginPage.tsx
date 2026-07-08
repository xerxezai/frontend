import { useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";

// ── colour tokens — identical to ERPLogin ────────────────────────────────────
const C = {
  orange:      "#C9883A",
  orangeGrad:  "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)",
  orangeDeep:  "rgba(150,95,30,0.50)",
  orangeLight: "rgba(201,136,58,0.09)",
  warmDark:    "#1a1208",
  warmDarker:  "#0f0a05",
  cream:       "#F8F7F4",
  white:       "#FFFFFF",
  dark:        "#1A1A1A",
  muted:       "#6B6B6B",
};
const shadow = {
  card:  "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.03)",
  badge: "0 4px 0 rgba(150,95,30,0.50), 0 6px 20px rgba(201,136,58,0.30)",
};
const FF = "'DM Sans', sans-serif";

type Role = "student" | "instructor";

// ── StatTile — exact ERP copy ─────────────────────────────────────────────────
const StatTile = ({ val, label, icon, color, delay }: {
  val: string; label: string; icon: string; color: string; delay: number;
}) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.08)", borderTop: `2px solid ${color}`,
        borderRadius: 14, padding: "16px 14px", cursor: "default",
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hov ? "0 16px 40px rgba(0,0,0,0.35)" : "0 4px 14px rgba(0,0,0,0.20)",
        transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms cubic-bezier(0.22,1,0.36,1)",
        animation: `lmaFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
      }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}20`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <i className={icon} style={{ color, fontSize: 12 }} />
      </div>
      <div style={{ color, fontWeight: 800, fontSize: 20, lineHeight: 1, marginBottom: 4, fontFamily: FF }}>{val}</div>
      <div style={{ color: "rgba(255,255,255,0.50)", fontSize: 11, fontFamily: FF, lineHeight: 1.35 }}>{label}</div>
    </div>
  );
};

// ── Bullet — exact ERP copy ───────────────────────────────────────────────────
const Bullet = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, animation: `lmaFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s both` }}>
    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: C.orangeGrad, boxShadow: shadow.badge, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <i className={icon} style={{ color: "#fff", fontSize: 11 }} />
    </div>
    <span style={{ color: "rgba(255,255,255,0.72)", fontSize: 13.5, fontFamily: FF }}>{text}</span>
  </div>
);

// ── InputBadge — exact ERP copy ───────────────────────────────────────────────
const InputBadge = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <span style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, borderRadius: 7,
    background: focused ? C.orangeGrad : "linear-gradient(145deg, #e2e8f0, #cbd5e1)",
    boxShadow: focused ? shadow.badge : "0 2px 0 rgba(0,0,0,0.12)",
    transition: "background 200ms, box-shadow 200ms", flexShrink: 0,
  }}>
    <i className={icon} style={{ color: "#fff", fontSize: 10 }} />
  </span>
);

// ── Spinner — exact ERP copy ──────────────────────────────────────────────────
const Spinner = () => (
  <svg className="lma-spin-svg" width={17} height={17} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.30)" strokeWidth="2.5" />
    <path d="M9 2a7 7 0 0 1 7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ── PrimaryBtn — exact ERP copy ───────────────────────────────────────────────
const PrimaryBtn = ({ label, onClick, busy, disabled: dis }: {
  label: string; onClick?: () => void; busy: boolean; disabled?: boolean;
}) => {
  const [hov, setHov] = useState(false);
  const off = busy || !!dis;
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={off}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", height: 50,
        background: off ? "#e5e7eb" : C.orangeGrad,
        color: off ? "#9ca3af" : "#fff",
        border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
        fontFamily: FF, cursor: off ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        boxShadow: hov && !off
          ? `0 6px 0 ${C.orangeDeep}, 0 10px 28px rgba(201,136,58,0.35)`
          : off ? "none" : `0 4px 0 ${C.orangeDeep}, 0 6px 20px rgba(201,136,58,0.28)`,
        transform: hov && !off ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 180ms cubic-bezier(0.22,1,0.36,1), box-shadow 180ms cubic-bezier(0.22,1,0.36,1)",
        opacity: busy ? 0.88 : 1,
      }}
    >
      {busy
        ? <><Spinner />{label}…</>
        : <>{label}<i className="fas fa-arrow-right" style={{ fontSize: 12 }} /></>
      }
    </button>
  );
};

// ── shared input styles (exact ERP) ──────────────────────────────────────────
const iBorder  = (foc: boolean) => foc ? C.orange : "rgba(0,0,0,0.11)";
const iShadow  = (foc: boolean) => foc ? "0 0 0 3px rgba(201,136,58,0.14)" : "none";
const iCss = (foc: boolean, rp = 0): React.CSSProperties => ({
  width: "100%", boxSizing: "border-box",
  padding: `12px ${12 + rp}px 12px 46px`,
  border: `1.5px solid ${iBorder(foc)}`,
  borderRadius: 11, fontSize: 14,
  color: C.dark, background: C.white,
  boxShadow: iShadow(foc),
  transition: "border-color 200ms, box-shadow 200ms",
  fontFamily: FF, outline: "none",
});
const labelCss: React.CSSProperties = {
  display: "block", fontSize: 12.5, fontWeight: 700,
  color: C.dark, marginBottom: 7, fontFamily: FF,
};

const ErrBanner = ({ msg }: { msg: string }) => !msg ? null : (
  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#DC2626", fontFamily: FF, display: "flex", alignItems: "center", gap: 8 }}>
    <i className="fas fa-exclamation-circle" style={{ flexShrink: 0 }} />{msg}
  </div>
);

const Hr = () => <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "10px 0" }} />;

// ════════════════════════════════════════════════════════════════════════════════
export default function LMALoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/lma/student/dashboard";
  const action   = params.get("action")   || "";

  const [step, setStep]         = useState<1 | 2>(1);
  const [role, setRole]         = useState<Role | null>(null);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [remember, setRemember] = useState(false);
  const [shaking, setShaking]   = useState(false);
  const [slideDir, setSlideDir] = useState<"fwd" | "bck">("fwd");
  const [slideKey, setSlideKey] = useState(0);
  const [eFoc, setEFoc] = useState(false);
  const [pFoc, setPFoc] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const shake = () => { setShaking(true); setTimeout(() => setShaking(false), 520); };

  const go = (s: 1 | 2, dir: "fwd" | "bck") => {
    setSlideDir(dir); setSlideKey(k => k + 1); setStep(s); setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); shake(); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1"}/lma/auth/login/`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, role }) }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed."); shake(); return; }
      localStorage.setItem("lma_token",            data.lma_token);
      localStorage.setItem("lma_role",             data.lma_role);
      localStorage.setItem("lma_can_instructor",   String(data.can_access_instructor));
      localStorage.setItem("lma_instructor_level", data.instructor_level || "regular");
      localStorage.setItem("lma_name",             data.name);
      const level = data.instructor_level || "regular";
      if (level === "super") {
        navigate("/home", { replace: true });
      } else if (data.lma_role === "instructor" && level === "regular") {
        navigate("/lma/instructor/dashboard", { replace: true });
      } else if (data.can_access_student === true) {
        navigate("/lma/student/dashboard", { replace: true });
      } else {
        navigate("/lma/login", { replace: true });
      }
    } catch {
      setError("Network error. Please try again."); shake();
    } finally {
      setLoading(false);
    }
  };

  // 3D mouse-tracking tilt
  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform  = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(10px)`;
    el.style.transition = "transform 0.07s linear";
    el.style.boxShadow  = `0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)`;
  };
  const onCardLeave = () => {
    const el = cardRef.current; if (!el) return;
    el.style.transform  = "perspective(1200px) rotateY(0) rotateX(0) translateZ(0)";
    el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s cubic-bezier(0.22,1,0.36,1)";
    el.style.boxShadow  = shadow.card;
  };

  return (
    <>
      <SEO title="Login | XERXEZ Academy" description="Sign in to your XERXEZ Academy account." canonical="/lma/login" noIndex />

      <style>{`
        @keyframes lmaFadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lmaOrbPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.09);opacity:0.82} }
        @keyframes lmaCardIn   { from{opacity:0;transform:perspective(1200px) translateY(28px) scale(0.97)} to{opacity:1;transform:perspective(1200px) translateY(0) scale(1)} }
        @keyframes lmaStepFwd  { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lmaStepBck  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lmaShake    { 0%,100%{transform:translateX(0)} 15%,55%{transform:translateX(-7px)} 35%,75%{transform:translateX(7px)} }
        @keyframes lmaSpin     { to{transform:rotate(360deg)} }
        .lma-spin-svg { animation: lmaSpin 0.75s linear infinite; }
        .lma-shake    { animation: lmaShake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both !important; }
        .lma-step-fwd { animation: lmaStepFwd 0.30s cubic-bezier(0.22,1,0.36,1) both; }
        .lma-step-bck { animation: lmaStepBck 0.30s cubic-bezier(0.22,1,0.36,1) both; }
        .lma-card     { animation: lmaCardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .lma-orb-1    { animation: lmaOrbPulse 8s ease-in-out infinite; }
        .lma-orb-2    { animation: lmaOrbPulse 10s 2.5s ease-in-out infinite; }
        .lma-orb-3    { animation: lmaOrbPulse 12s 5s ease-in-out infinite; }
        .lma-input::placeholder { color: #BBBBBB; }
        .lma-input:focus { outline: none; }
        .lma-right { background: ${C.cream}; }
        .lma-left  { display: flex; }
        .lma-role-btn { transition: border-color 180ms, background 180ms, box-shadow 180ms; }
        .lma-role-btn:hover:not(.lma-role-selected) { border-color: rgba(201,136,58,0.45) !important; background: rgba(201,136,58,0.04) !important; }
        @media(max-width:991px) {
          .lma-left  { display: none !important; }
          .lma-right { background: linear-gradient(150deg,#1a1208 0%,#0f0a05 100%) !important; }
          .lma-card  { box-shadow: 0 8px 48px rgba(0,0,0,0.52), 0 2px 8px rgba(0,0,0,0.32) !important; }
        }
        @media(prefers-reduced-motion:reduce) {
          .lma-orb-1,.lma-orb-2,.lma-orb-3,.lma-card { animation: none !important; }
          * { transition-duration: 0ms !important; animation-duration: 0ms !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", fontFamily: FF }}>

        {/* ══ LEFT PANEL — mirrors ERP layout ════════════════════════════════ */}
        <div className="lma-left" style={{
          flex: "0 0 56%", flexDirection: "column", justifyContent: "flex-start",
          padding: "34px 60px 48px", position: "relative", overflow: "hidden",
          background: `linear-gradient(150deg, ${C.warmDark} 0%, ${C.warmDarker} 100%)`,
        }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <span className="lma-orb-1" style={{ position: "absolute", top: "-10%", left: "-8%", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.15) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
          <span className="lma-orb-2" style={{ position: "absolute", bottom: "-18%", right: "-4%", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.10) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
          <span className="lma-orb-3" style={{ position: "absolute", top: "38%", right: "10%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,136,58,0.08) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div style={{ marginBottom: 24, animation: "lmaFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}>
              <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ" style={{ height: 75, width: "auto" }} />
            </div>

            {/* Chip — same shape as ERP */}
            <div style={{ marginBottom: 18, animation: "lmaFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.07s both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,136,58,0.13)", border: "1px solid rgba(201,136,58,0.35)", color: "#E5B460", fontSize: 11, fontWeight: 700, padding: "6px 16px", borderRadius: 20, fontFamily: FF, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                <i className="fas fa-graduation-cap" style={{ fontSize: 9, color: C.orange }} />
                Enterprise Learning Platform
              </span>
            </div>

            {/* Headline — same structure as ERP */}
            <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(28px,2.8vw,44px)", lineHeight: 1.1, marginBottom: 18, fontFamily: FF, letterSpacing: "-0.025em", animation: "lmaFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both" }}>
              Learn from the<br />
              <em style={{ color: C.orange, fontStyle: "italic" }}>world's best</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14.5, lineHeight: 1.72, maxWidth: 420, marginBottom: 34, fontFamily: FF, animation: "lmaFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.19s both" }}>
              AI-powered courses, expert instructors, and industry certificates — built to enterprise and global standards.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 38 }}>
              <Bullet icon="fas fa-brain"      text="World-class AI & cloud technology courses"  delay={0.25} />
              <Bullet icon="fas fa-shield-alt" text="ISO 27001 & certified curriculum"            delay={0.30} />
              <Bullet icon="fas fa-chart-bar"  text="Expert instructors — built what they teach"  delay={0.35} />
            </div>

            {/* Stat tiles — exact ERP StatTile component */}
            <div style={{ display: "flex", gap: 12 }}>
              <StatTile val="500+" label="Students enrolled" icon="fas fa-users"      color={C.orange} delay={0.41} />
              <StatTile val="12+"  label="Active courses"    icon="fas fa-book-open"  color="#10b981"  delay={0.47} />
              <StatTile val="95%"  label="Satisfaction rate" icon="fas fa-star"       color="#3b82f6"  delay={0.53} />
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
        <div className="lma-right" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 52, paddingBottom: 32, paddingLeft: 28, paddingRight: 28, minHeight: "100vh" }}>

          {/* 3D card */}
          <div
            ref={cardRef}
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
            className={`lma-card${shaking ? " lma-shake" : ""}`}
            style={{
              background: C.white, borderRadius: 20,
              padding: "24px 28px 20px",
              width: "100%", maxWidth: 460,
              boxShadow: shadow.card,
              border: "1px solid rgba(0,0,0,0.06)",
              borderTop: `3px solid ${C.orange}`,
              overflow: "hidden", willChange: "transform",
            }}
          >
            {/* animated step wrapper */}
            <div key={slideKey} className={`lma-step-${slideDir}`}>

              {/* ══ STEP 1: Role picker ═══════════════════════════════════════ */}
              {step === 1 && (
                <>
                  <div style={{ textAlign: "center", marginBottom: 14 }}>
                    <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 20, margin: "0 0 4px", fontFamily: FF, letterSpacing: "-0.02em" }}>XERXEZ Academy</h2>
                    <p style={{ color: C.muted, fontSize: 12.5, margin: 0, fontFamily: FF }}>Select your role to sign in</p>
                  </div>
                  <Hr />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    {(["student", "instructor"] as Role[]).map(r => {
                      const sel = role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className={`lma-role-btn${sel ? " lma-role-selected" : ""}`}
                          style={{
                            border: `1.5px solid ${sel ? C.orange : "rgba(0,0,0,0.11)"}`,
                            borderRadius: 12, padding: "18px 14px", cursor: "pointer",
                            background: sel ? C.orangeLight : C.white,
                            textAlign: "left", outline: "none",
                            boxShadow: sel ? `0 0 0 3px rgba(201,136,58,0.14), ${shadow.card}` : shadow.card,
                          }}
                        >
                          <div style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 10, background: sel ? C.orangeGrad : "linear-gradient(145deg,#e2e8f0,#cbd5e1)", boxShadow: sel ? shadow.badge : "0 2px 0 rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 180ms, box-shadow 180ms" }}>
                            <i className={r === "student" ? "fas fa-graduation-cap" : "fas fa-chalkboard-teacher"} style={{ color: "#fff", fontSize: 14 }} />
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 3, fontFamily: FF }}>{r === "student" ? "Student" : "Instructor"}</div>
                          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4, fontFamily: FF }}>{r === "student" ? "Access courses & progress" : "Create & manage courses"}</div>
                        </button>
                      );
                    })}
                  </div>

                  <PrimaryBtn label="Continue" onClick={() => role && go(2, "fwd")} busy={false} disabled={!role} />

                  <Hr />
                  <div style={{ textAlign: "center" }}>
                    <Link to="/training"
                      style={{ fontSize: 13, color: "#999", textDecoration: "none", fontFamily: FF, display: "inline-flex", alignItems: "center", gap: 6, transition: "color 150ms" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                      onMouseLeave={e => (e.currentTarget.style.color = "#999")}>
                      <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />Back to Website
                    </Link>
                  </div>
                </>
              )}

              {/* ══ STEP 2: Sign in form ══════════════════════════════════════ */}
              {step === 2 && (
                <>
                  <div style={{ textAlign: "center", marginBottom: 14 }}>
                    <h2 style={{ color: C.dark, fontWeight: 800, fontSize: 20, margin: "0 0 4px", fontFamily: FF, letterSpacing: "-0.02em" }}>
                      {role === "student" ? "XERXEZ Academy" : "Instructor Portal"}
                    </h2>
                    <p style={{ color: C.muted, fontSize: 12.5, margin: 0, fontFamily: FF }}>
                      {role === "student" ? "Sign in to access your courses" : "Sign in to manage your courses"}
                    </p>
                  </div>
                  <Hr />

                  <ErrBanner msg={error} />

                  <form onSubmit={handleLogin} noValidate>
                    {/* Email */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelCss}>Email Address</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                          <InputBadge icon="fas fa-envelope" focused={eFoc} />
                        </span>
                        <input
                          className="lma-input" type="email" value={email}
                          placeholder="Enter your email address" autoComplete="email"
                          onChange={e => setEmail(e.target.value)}
                          onFocus={() => setEFoc(true)} onBlur={() => setEFoc(false)}
                          style={iCss(eFoc)}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelCss}>Password</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                          <InputBadge icon="fas fa-lock" focused={pFoc} />
                        </span>
                        <input
                          className="lma-input"
                          type={showPw ? "text" : "password"} value={password}
                          placeholder="Enter your password" autoComplete="current-password"
                          onChange={e => setPassword(e.target.value)}
                          onFocus={() => setPFoc(true)} onBlur={() => setPFoc(false)}
                          style={iCss(pFoc, 32)}
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide" : "Show"}
                          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#AAA", padding: 4, fontSize: 13, lineHeight: 1 }}>
                          <i className={`fas fa-eye${showPw ? "-slash" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", userSelect: "none" }}>
                        <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 15, height: 15, accentColor: C.orange, cursor: "pointer" }} />
                        <span style={{ fontSize: 12.5, color: C.muted, fontFamily: FF }}>Remember me</span>
                      </label>
                      <a href="#" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: C.orange, fontWeight: 600, fontFamily: FF, textDecoration: "none" }}>
                        Forgot Password?
                      </a>
                    </div>

                    <PrimaryBtn label="Sign In" busy={loading} />
                  </form>

                  {/* Security badges — exact ERP layout */}
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#9B9B9B", fontSize: 11.5, fontFamily: FF }}>
                      <i className="fas fa-lock" style={{ color: "#4ade80", fontSize: 11 }} />AES-256 Encrypted
                    </span>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.cream, border: "1px solid rgba(201,136,58,0.20)", borderRadius: 20, padding: "3px 12px" }}>
                      <i className="fas fa-certificate" style={{ color: C.orange, fontSize: 10 }} />
                      <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, fontFamily: FF }}>ISO 27001</span>
                    </div>
                  </div>

                  <Hr />

                  {/* Role-conditional section */}
                  {role === "student" ? (
                    <div style={{ textAlign: "center", marginBottom: 2 }}>
                      <span style={{ fontSize: 12.5, color: C.muted, fontFamily: FF }}>
                        Don't have an account?{" "}
                        <Link
                          to={`/lma/register?redirect=${encodeURIComponent(redirect)}${action ? `&action=${action}` : ""}`}
                          style={{ color: C.orange, fontWeight: 700, fontSize: 12.5, fontFamily: FF, textDecoration: "none" }}
                        >Register</Link>
                      </span>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", marginBottom: 2 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, fontFamily: FF }}>
                        <i className="fas fa-shield-alt" style={{ color: C.orange, fontSize: 11 }} />
                        Access restricted to invited instructors only
                      </span>
                      <div style={{ marginTop: 10 }}>
                        <Link
                          to="/lma/become-instructor"
                          style={{
                            fontSize: 12.5, color: C.orange, fontWeight: 700,
                            fontFamily: FF, textDecoration: "none",
                            display: "inline-flex", alignItems: "center", gap: 5,
                            transition: "gap 180ms, opacity 180ms",
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = "8px"; (e.currentTarget as HTMLElement).style.opacity = "0.82"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = "5px"; (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                        >
                          Want to teach? Apply as Instructor
                          <i className="fas fa-arrow-right" style={{ fontSize: 10 }} />
                        </Link>
                      </div>
                    </div>
                  )}

                  <Hr />

                  {/* Back links row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button type="button" onClick={() => go(1, "bck")}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: C.muted, fontFamily: FF, display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 0", transition: "color 150ms" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                      <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />Back
                    </button>
                    <Link to="/training"
                      style={{ fontSize: 13, color: "#999", textDecoration: "none", fontFamily: FF, display: "inline-flex", alignItems: "center", gap: 6, transition: "color 150ms" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                      onMouseLeave={e => (e.currentTarget.style.color = "#999")}>
                      <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />Back to Website
                    </Link>
                  </div>
                </>
              )}

            </div>
          </div>

          <p style={{ marginTop: 20, color: "rgba(0,0,0,0.28)", fontSize: 11.5, fontFamily: FF, textAlign: "center" }}>
            © {new Date().getFullYear()} XERXEZ. All Rights Reserved.
          </p>
        </div>
      </div>
    </>
  );
}
