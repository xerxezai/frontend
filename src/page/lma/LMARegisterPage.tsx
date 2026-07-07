import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const CREAM = "#F8F7F4";
const FF    = "'DM Sans', sans-serif";
const OD    = "#a06822"; // orangeDeep

/* ════════════════════════════════════════
   SUB-COMPONENTS  (ERP / LMA login parity)
════════════════════════════════════════ */

/* Glassmorphism stat tile */
const StatTile = ({ icon, value, label, color, delay }: {
  icon: string; value: string; label: string; color: string; delay: number;
}) => {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)",
        borderRadius: 14, padding: "14px 16px", flex: 1,
        border: "1px solid rgba(255,255,255,0.08)", borderTop: `2px solid ${color}`,
        animation: `lmarg-fadeUp 0.7s ease both ${delay}ms`,
        transform: h ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.22s ease",
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 8, marginBottom: 8,
        background: `${color}22`, border: `1px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={`fas fa-${icon}`} style={{ fontSize: 12, color }} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.1, fontFamily: FF }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", marginTop: 3, fontWeight: 600, letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
};

/* Gold-square icon bullet */
const Bullet = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, animation: `lmarg-fadeUp 0.65s ease both ${delay}ms` }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(135deg,${AMBER},${GOLD})`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <i className={`fas fa-${icon}`} style={{ fontSize: 11, color: "#0a0806" }} />
    </div>
    <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 13.5, fontFamily: FF, lineHeight: 1.45 }}>{text}</span>
  </div>
);

/* Gold-gradient square icon badge inside inputs */
const InputBadge = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <div style={{
    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
    background: focused
      ? `linear-gradient(135deg,${AMBER},${GOLD})`
      : "linear-gradient(135deg,rgba(0,0,0,0.08),rgba(0,0,0,0.05))",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: focused ? "0 2px 8px rgba(201,136,58,0.35)" : "none",
    transition: "all 0.20s ease",
  }}>
    <i className={`fas fa-${icon}`} style={{ fontSize: 11, color: focused ? "#0a0806" : "#9ca3af" }} />
  </div>
);

/* Spinning SVG loader */
const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" style={{ animation: "lmarg-spin 0.8s linear infinite" }}>
    <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(10,8,6,0.28)" strokeWidth="2" />
    <path d="M9 2 A7 7 0 0 1 16 9" fill="none" stroke="#0a0806" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* 3D-shadow primary button */
const PrimaryBtn = ({ label, onClick, busy, disabled }: {
  label: string; onClick: () => void; busy?: boolean; disabled?: boolean;
}) => {
  const [hov, setHov] = useState(false);
  const off = disabled || busy;
  return (
    <button
      type="button" onClick={onClick} disabled={!!off}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", height: 50, borderRadius: 12, border: "none",
        background: off ? "#e5e7eb" : `linear-gradient(135deg,${AMBER},${GOLD})`,
        color: off ? "#9ca3af" : "#0a0806",
        fontSize: 14.5, fontWeight: 800, cursor: off ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontFamily: FF, letterSpacing: "-0.01em",
        transform: hov && !off ? "translateY(-2px)" : "none",
        boxShadow: hov && !off
          ? `0 6px 0 ${OD},0 10px 28px rgba(201,136,58,0.35)`
          : off ? "none" : `0 4px 0 ${OD}`,
        transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
      }}
    >
      {busy ? <Spinner /> : <>{label} <i className="fas fa-arrow-right" style={{ fontSize: 12 }} /></>}
    </button>
  );
};

/* Input style */
const iCss = (rightPad = 12) => ({
  border: "none", outline: "none", background: "transparent",
  flex: 1, fontSize: 14, color: "#141413", fontFamily: FF,
  padding: `12px ${rightPad}px 12px 10px`,
});

/* Static label above input */
const labelCss = {
  fontSize: 12.5, fontWeight: 700, color: "rgba(20,20,19,0.65)",
  display: "block", marginBottom: 7, fontFamily: FF,
};

/* Wrapper for input row */
const InputRow = ({ foc }: { foc: boolean }) => ({
  display: "flex", alignItems: "center", gap: 10,
  border: `1.5px solid ${foc ? GOLD : "rgba(0,0,0,0.13)"}`,
  borderRadius: 11, padding: "0 10px 0 12px",
  background: foc ? "rgba(201,136,58,0.025)" : "#fff",
  transition: "border-color 0.20s ease, background 0.20s ease",
  boxShadow: foc ? "0 0 0 3px rgba(201,136,58,0.10)" : "none",
});

/* Error banner */
const ErrBanner = ({ msg }: { msg: string }) =>
  msg ? (
    <div style={{ background: "#FEF2F2", border: "1px solid rgba(239,68,68,0.22)", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: "#dc2626", fontFamily: FF, display: "flex", alignItems: "center", gap: 8 }}>
      <i className="fas fa-exclamation-circle" style={{ fontSize: 13, flexShrink: 0 }} />
      {msg}
    </div>
  ) : null;

/* Thin divider */
const Hr = () => <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "18px 0" }} />;

/* Password strength bar */
const PasswordStrength = ({ pw }: { pw: string }) => {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 6)             s++;
  if (pw.length >= 10)            s++;
  if (/[A-Z]/.test(pw))          s++;
  if (/[0-9]/.test(pw))          s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= s ? colors[s] : "#e5e7eb", transition: "background 0.25s ease" }} />
        ))}
      </div>
      {s > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: colors[s] }}>{labels[s]}</span>}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function LMARegisterPage() {
  const navigate          = useNavigate();
  const [params]          = useSearchParams();
  const redirect          = params.get("redirect") || "/lma/student/dashboard";
  const action            = params.get("action")   || "";

  const [name,    setName   ] = useState("");
  const [email,   setEmail  ] = useState("");
  const [pw,      setPw     ] = useState("");
  const [cf,      setCf     ] = useState("");
  const [showPw,  setShowPw ] = useState(false);
  const [showCf,  setShowCf ] = useState(false);
  const [busy,    setBusy   ] = useState(false);
  const [err,     setErr    ] = useState("");

  /* focus states */
  const [focName,  setFocName ] = useState(false);
  const [focEmail, setFocEmail] = useState(false);
  const [focPw,    setFocPw  ] = useState(false);
  const [focCf,    setFocCf  ] = useState(false);

  /* 3-D card tilt */
  const cardRef = useRef<HTMLDivElement>(null);
  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(10px)`;
    el.style.transition = "transform 0.08s linear";
  };
  const onCardLeave = () => {
    const el = cardRef.current; if (!el) return;
    el.style.transform = "";
    el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1)";
  };

  /* Particle canvas for left panel */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pref = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas || pref) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const N = 36, LINK = 110;
    let W = 0, H = 0, raf = 0;
    const pts = Array.from({ length: N }, () => ({
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 0.36,
      vy: (Math.random() - 0.5) * 0.36,
      r: Math.random() * 1.3 + 0.5,
    }));
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      pts.forEach(p => { p.x = Math.random() * W; p.y = Math.random() * H; });
    };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < LINK) {
          ctx.beginPath(); ctx.strokeStyle = `rgba(201,136,58,${0.14*(1-d/LINK)})`; ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = "rgba(201,136,58,0.28)"; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      raf = requestAnimationFrame(tick);
    };
    resize(); tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [pref]);

  /* Submit */
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !pw || !cf) { setErr("Please fill in all fields."); return; }
    if (pw !== cf)         { setErr("Passwords do not match."); return; }
    if (pw.length < 6)     { setErr("Password must be at least 6 characters."); return; }
    setBusy(true); setErr("");
    try {
      const res  = await fetch(`${API}/lma/auth/register/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pw }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Registration failed. Please try again."); return; }
      localStorage.setItem("lma_token",           data.lma_token);
      localStorage.setItem("lma_role",            data.lma_role);
      localStorage.setItem("lma_can_instructor",  String(data.can_access_instructor));
      localStorage.setItem("lma_name",            data.name);
      const dest = redirect.startsWith("/lma") ? redirect : "/lma/student/dashboard";
      navigate(action ? `${dest}?action=${action}` : dest);
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const loginUrl = `/lma/login?redirect=${encodeURIComponent(redirect)}${action ? `&action=${action}` : ""}`;

  return (
    <>
      <SEO title="Register | XERXEZ Academy" description="Create your XERXEZ Academy account and start learning." canonical="/lma/register" noIndex />

      <div style={{ minHeight: "100vh", display: "flex", fontFamily: FF, background: DARK }}>

        {/* ══════════════════════════════
            LEFT  HERO  PANEL
        ══════════════════════════════ */}
        <div className="lmarg-left" style={{
          flex: "0 0 52%", position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px clamp(32px,5vw,72px)",
        }}>
          {/* Particle canvas */}
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />

          {/* Dot grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,136,58,0.07) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0 }} />

          {/* Atmospheric orbs */}
          <div className="lmarg-orb lmarg-orb-1" />
          <div className="lmarg-orb lmarg-orb-2" />
          <div className="lmarg-orb lmarg-orb-3" />

          {/* Orbit ring */}
          <div style={{ position: "absolute", bottom: "-30%", right: "-20%", width: 420, height: 420, borderRadius: "50%", border: "1px solid rgba(201,136,58,0.09)", animation: "lmarg-orbit 50s linear infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(201,136,58,0.14)", animation: "lmarg-orbit 34s linear infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {/* Floating diamonds */}
          <div className="lmarg-geo lmarg-geo-1" />
          <div className="lmarg-geo lmarg-geo-2" />
          <div className="lmarg-geo lmarg-geo-3" />

          {/* ── Content ── */}
          <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>

            {/* Eyebrow chip */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px 6px 10px", borderRadius: 999, marginBottom: 24,
              border: "1px solid rgba(201,136,58,0.28)", background: "rgba(201,136,58,0.10)",
              animation: "lmarg-fadeUp 0.55s ease both",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, boxShadow: `0 0 0 3px rgba(201,136,58,0.26)`, animation: "lmarg-pulse 2s ease-in-out infinite", flexShrink: 0 }} />
              <i className="fas fa-graduation-cap" style={{ fontSize: 10, color: GOLD }} />
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD }}>
                Join XERXEZ Academy
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: "clamp(30px,3.4vw,46px)", fontWeight: 900, color: "#fff", lineHeight: 1.09, margin: "0 0 10px", letterSpacing: "-0.03em", animation: "lmarg-fadeUp 0.60s ease 0.08s both" }}>
              Start Learning
              <br />
              <em style={{ fontStyle: "normal", background: `linear-gradient(90deg,${AMBER},${GOLD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Today
              </em>
            </h1>

            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.65, marginBottom: 34, maxWidth: 400, animation: "lmarg-fadeUp 0.60s ease 0.16s both" }}>
              Your AI &amp; ML career starts here. Join students building real skills with real projects — guided by industry experts.
            </p>

            {/* Feature bullets */}
            <Bullet icon="check-circle" text="Free to sign up — pay only for courses you choose" delay={280} />
            <Bullet icon="play-circle"  text="Instant access to preview lessons and materials" delay={380} />
            <Bullet icon="certificate"  text="Earn verified certificates recognised industry-wide" delay={480} />

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.09)", margin: "30px 0 26px", animation: "lmarg-fadeUp 0.6s ease 0.55s both" }} />

            {/* Stat tiles */}
            <div style={{ display: "flex", gap: 12, animation: "lmarg-fadeUp 0.6s ease 0.62s both" }}>
              <StatTile icon="users"       value="500+"  label="Students"    color={GOLD}      delay={620} />
              <StatTile icon="book-open"   value="12+"   label="Courses"     color="#10b981"   delay={700} />
              <StatTile icon="star"        value="95%"   label="Satisfaction" color="#3b82f6"  delay={780} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            RIGHT  FORM  PANEL
        ══════════════════════════════ */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          background: CREAM, padding: "32px 24px",
        }}>
          <div
            ref={cardRef}
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
            style={{
              width: "100%", maxWidth: 430,
              background: "#fff", borderRadius: 20,
              borderTop: `3px solid ${GOLD}`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.04),0 8px 32px rgba(0,0,0,0.09),0 32px 64px rgba(0,0,0,0.05)",
              padding: "36px 34px 28px",
              animation: "lmarg-cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both",
              willChange: "transform",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: "0 0 5px", letterSpacing: "-0.01em", fontFamily: FF }}>
                Create your account
              </h2>
              <p style={{ fontSize: 13.5, color: "rgba(20,20,19,0.48)", margin: 0, fontFamily: FF }}>
                Join XERXEZ Academy — it's free
              </p>
            </div>

            <Hr />

            <ErrBanner msg={err} />

            {/* Full name */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelCss}>Full name</label>
              <div style={InputRow({ foc: focName })}>
                <InputBadge icon="user" focused={focName} />
                <input
                  type="text" value={name} placeholder="Your full name"
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocName(true)} onBlur={() => setFocName(false)}
                  style={iCss()}
                  onKeyDown={e => e.key === "Enter" && handleRegister()}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelCss}>Email address</label>
              <div style={InputRow({ foc: focEmail })}>
                <InputBadge icon="envelope" focused={focEmail} />
                <input
                  type="email" value={email} placeholder="you@example.com"
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocEmail(true)} onBlur={() => setFocEmail(false)}
                  style={iCss()}
                  onKeyDown={e => e.key === "Enter" && handleRegister()}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={labelCss}>Password</label>
              <div style={InputRow({ foc: focPw })}>
                <InputBadge icon="lock" focused={focPw} />
                <input
                  type={showPw ? "text" : "password"} value={pw} placeholder="At least 6 characters"
                  onChange={e => setPw(e.target.value)}
                  onFocus={() => setFocPw(true)} onBlur={() => setFocPw(false)}
                  style={iCss(4)}
                  onKeyDown={e => e.key === "Enter" && handleRegister()}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 8px", color: "#9ca3af", display: "flex" }}>
                  <i className={`fas fa-${showPw ? "eye-slash" : "eye"}`} style={{ fontSize: 13 }} />
                </button>
              </div>
            </div>
            <PasswordStrength pw={pw} />

            {/* Confirm password */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelCss}>Confirm password</label>
              <div style={InputRow({ foc: focCf })}>
                <InputBadge icon="lock" focused={focCf} />
                <input
                  type={showCf ? "text" : "password"} value={cf} placeholder="Re-enter your password"
                  onChange={e => setCf(e.target.value)}
                  onFocus={() => setFocCf(true)} onBlur={() => setFocCf(false)}
                  style={iCss(4)}
                  onKeyDown={e => e.key === "Enter" && handleRegister()}
                />
                <button type="button" onClick={() => setShowCf(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 8px", color: "#9ca3af", display: "flex" }}>
                  <i className={`fas fa-${showCf ? "eye-slash" : "eye"}`} style={{ fontSize: 13 }} />
                </button>
              </div>
              {cf && pw !== cf && (
                <p style={{ fontSize: 11.5, color: "#dc2626", margin: "6px 0 0", fontFamily: FF }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: 4 }} />Passwords do not match
                </p>
              )}
            </div>

            {/* CTA */}
            <PrimaryBtn label="Create Account" onClick={handleRegister} busy={busy} disabled={busy} />

            {/* Security badges */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <i className="fas fa-lock" style={{ fontSize: 11, color: "#22c55e" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.40)", fontFamily: FF }}>AES-256</span>
              </div>
              <div style={{ width: 1, height: 12, background: "rgba(0,0,0,0.10)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(20,20,19,0.40)", fontFamily: FF, background: "rgba(0,0,0,0.05)", padding: "2px 7px", borderRadius: 999 }}>ISO 27001</span>
              </div>
            </div>

            <Hr />

            {/* Already have account */}
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(20,20,19,0.50)", margin: 0, fontFamily: FF }}>
              Already have an account?{" "}
              <Link to={loginUrl} style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>

            <Hr />

            {/* Back to Website */}
            <div style={{ textAlign: "center" }}>
              <Link to="/" style={{ fontSize: 12, color: "rgba(20,20,19,0.38)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FF, transition: "color 0.18s ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(20,20,19,0.65)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(20,20,19,0.38)")}
              >
                <i className="fas fa-arrow-left" style={{ fontSize: 10 }} /> Back to Website
              </Link>
            </div>
          </div>
        </div>

        {/* ══ CSS ══ */}
        <style>{`
          /* Orbs */
          .lmarg-orb { position:absolute; border-radius:50%; pointer-events:none; }
          .lmarg-orb-1 { top:-10%;left:-8%;width:480px;height:480px;background:radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 65%);animation:lmarg-float1 11s ease-in-out infinite; }
          .lmarg-orb-2 { bottom:-15%;right:-5%;width:360px;height:360px;background:radial-gradient(circle,rgba(232,168,78,0.07) 0%,transparent 65%);animation:lmarg-float2 14s ease-in-out infinite; }
          .lmarg-orb-3 { top:42%;right:18%;width:140px;height:140px;background:radial-gradient(circle,rgba(201,136,58,0.16) 0%,transparent 70%);animation:lmarg-float3 8s ease-in-out infinite; }

          /* Floating diamonds */
          .lmarg-geo { position:absolute; pointer-events:none; transform:rotate(45deg); }
          .lmarg-geo-1 { right:10%;top:14%;width:13px;height:13px;background:rgba(201,136,58,0.28);border:1px solid rgba(201,136,58,0.52);animation:lmarg-diamond 6s ease-in-out infinite; }
          .lmarg-geo-2 { right:22%;bottom:28%;width:9px;height:9px;background:rgba(232,168,78,0.20);border:1px solid rgba(232,168,78,0.46);animation:lmarg-diamond 8s ease-in-out infinite 1.5s; }
          .lmarg-geo-3 { left:8%;bottom:20%;width:11px;height:11px;background:rgba(201,136,58,0.18);border:1px solid rgba(201,136,58,0.42);animation:lmarg-diamond 7s ease-in-out infinite 3s; }

          /* Keyframes */
          @keyframes lmarg-fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
          @keyframes lmarg-float1  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(26px,-36px)} }
          @keyframes lmarg-float2  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,28px)} }
          @keyframes lmarg-float3  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-18px)} }
          @keyframes lmarg-orbit   { to{transform:rotate(360deg)} }
          @keyframes lmarg-pulse   { 0%,100%{box-shadow:0 0 0 3px rgba(201,136,58,0.26)} 50%{box-shadow:0 0 0 6px rgba(201,136,58,0.07)} }
          @keyframes lmarg-diamond { 0%,100%{transform:rotate(45deg) translateY(0)} 50%{transform:rotate(45deg) translateY(-9px)} }
          @keyframes lmarg-cardIn  { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes lmarg-spin    { to{transform:rotate(360deg)} }

          /* Responsive — hide left panel on mobile */
          @media (max-width:991px) { .lmarg-left { display:none !important; } }

          /* Reduced motion */
          @media (prefers-reduced-motion:reduce) {
            .lmarg-orb,.lmarg-geo { animation:none !important; }
            * { transition-duration:0.01ms !important; }
          }
        `}</style>
      </div>
    </>
  );
}
