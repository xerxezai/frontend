import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, BookOpen, FileText, MessageSquare,
  Check, ArrowRight, Users, IndianRupee, Award, ChevronRight, Lock,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const GOLD      = "#C9883A";
const GOLD_G    = "linear-gradient(145deg, #e8a84e 0%, #C9883A 100%)";
const GOLD_DEEP = "rgba(150,95,30,0.50)";
const DARK      = "#1a1208";
const DARKER    = "#0f0a05";
const CREAM     = "#F8F7F4";
const WHITE     = "#FFFFFF";
const FF        = "'DM Sans', sans-serif";
const API       = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";

// ── DC (dark glass card) — copied exactly from AIERPPage ─────────────────────
const DC = ({ children, accent = GOLD, style = {}, p = "20px 18px" }: {
  children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string;
}) => {
  const [h, setH] = useState(false);
  return (
    <div style={{
      background: h ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderTop: `2px solid ${accent}`,
      borderRadius: 14, padding: p,
      transform: h ? "translateY(-5px)" : "translateY(0)",
      boxShadow: h
        ? "0 20px 60px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.06)"
        : "0 4px 20px rgba(0,0,0,0.20)",
      transition: "transform 280ms cubic-bezier(0.22,1,0.36,1),box-shadow 280ms ease,background 200ms ease",
      cursor: "default", position: "relative", ...style,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </div>
  );
};

// ── Count-up hook ──────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, delay = 0, suffix = "") {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return val + suffix;
}

// ── Confetti canvas ───────────────────────────────────────────────────────────
function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const colors = [GOLD, "#e8a84e", "#fff", "#f59e0b", "#fbbf24", "#d97706"];
    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vrot: number; };
    const particles: P[] = Array.from({ length: 90 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 60,
      y: canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 6 + 3),
      r: Math.random() * 5 + 2,
      c: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12,
    }));
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height);
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      });
      if (particles.some(p => p.y < canvas.height + 20)) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }} />;
}

// ── Floating label input ──────────────────────────────────────────────────────
type FLProps = {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; icon: React.ReactNode;
  error?: string; valid?: boolean; placeholder?: string;
  onBlur?: () => void; autoComplete?: string;
};
const FloatLabel = ({ id, label, type = "text", value, onChange, icon, error, valid, placeholder, onBlur, autoComplete }: FLProps) => {
  const [foc, setFoc] = useState(false);
  const lifted = foc || value.length > 0;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        position: "relative",
        border: `1.5px solid ${error ? "#ef4444" : foc ? GOLD : valid ? "#10b981" : "rgba(0,0,0,0.13)"}`,
        borderRadius: 11, background: WHITE,
        boxShadow: foc ? `0 0 0 3px ${error ? "rgba(239,68,68,0.12)" : "rgba(201,136,58,0.14)"}` : "none",
        transition: "border-color 200ms, box-shadow 200ms",
      }}>
        {/* Floating label */}
        <label htmlFor={id} style={{
          position: "absolute", left: 42, pointerEvents: "none",
          top: lifted ? 7 : "50%",
          transform: lifted ? "translateY(0) scale(0.82)" : "translateY(-50%) scale(1)",
          transformOrigin: "left",
          fontSize: 13.5, fontWeight: lifted ? 700 : 500,
          color: lifted ? (error ? "#ef4444" : foc ? GOLD : "#6b7280") : "#aaa",
          fontFamily: FF, transition: "all 200ms cubic-bezier(0.22,1,0.36,1)", zIndex: 1,
        }}>{label}</label>
        {/* Icon */}
        <span style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          color: foc ? GOLD : error ? "#ef4444" : valid ? "#10b981" : "#aaa",
          display: "flex", transition: "color 200ms", zIndex: 2,
        }}>{icon}</span>
        {/* Valid tick */}
        {valid && !error && (
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#10b981", display: "flex", zIndex: 2 }}>
            <Check size={15} strokeWidth={2.5} />
          </span>
        )}
        <input
          id={id} type={type} value={value} autoComplete={autoComplete}
          placeholder={foc ? placeholder : ""}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFoc(true)}
          onBlur={() => { setFoc(false); onBlur?.(); }}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: lifted ? "22px 40px 8px 42px" : "15px 40px 15px 42px",
            border: "none", background: "transparent", outline: "none",
            fontSize: 14, color: DARK, fontFamily: FF, transition: "padding 200ms",
          }}
        />
      </div>
      {error && (
        <div style={{
          fontSize: 11.5, color: "#ef4444", marginTop: 5, paddingLeft: 4,
          fontFamily: FF, display: "flex", alignItems: "center", gap: 4,
          animation: "biSlideDown 0.18s ease both",
        }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 8, fontWeight: 900 }}>!</span>
          </span>
          {error}
        </div>
      )}
    </div>
  );
};

// ── Floating label textarea ────────────────────────────────────────────────────
type FLTAProps = {
  id: string; label: string; value: string; onChange: (v: string) => void;
  icon: React.ReactNode; rows?: number; error?: string; valid?: boolean;
  minChars?: number; onBlur?: () => void;
};
const FloatTextarea = ({ id, label, value, onChange, icon, rows = 3, error, valid, minChars, onBlur }: FLTAProps) => {
  const [foc, setFoc] = useState(false);
  const lifted = foc || value.length > 0;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        position: "relative",
        border: `1.5px solid ${error ? "#ef4444" : foc ? GOLD : valid ? "#10b981" : "rgba(0,0,0,0.13)"}`,
        borderRadius: 11, background: WHITE,
        boxShadow: foc ? `0 0 0 3px ${error ? "rgba(239,68,68,0.12)" : "rgba(201,136,58,0.14)"}` : "none",
        transition: "border-color 200ms, box-shadow 200ms",
      }}>
        <label htmlFor={id} style={{
          position: "absolute", left: 42, top: lifted ? 8 : 14, pointerEvents: "none",
          fontSize: 13.5, fontWeight: lifted ? 700 : 500,
          color: lifted ? (error ? "#ef4444" : foc ? GOLD : "#6b7280") : "#aaa",
          fontFamily: FF, transition: "all 200ms cubic-bezier(0.22,1,0.36,1)", zIndex: 1,
          transform: lifted ? "scale(0.82)" : "scale(1)", transformOrigin: "left",
        }}>{label}</label>
        <span style={{
          position: "absolute", left: 12, top: 14,
          color: foc ? GOLD : error ? "#ef4444" : valid ? "#10b981" : "#aaa",
          display: "flex", transition: "color 200ms", zIndex: 2,
        }}>{icon}</span>
        {valid && !error && (
          <span style={{ position: "absolute", right: 12, top: 12, color: "#10b981", display: "flex", zIndex: 2 }}>
            <Check size={15} strokeWidth={2.5} />
          </span>
        )}
        <textarea
          id={id} value={value} rows={rows}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFoc(true)}
          onBlur={() => { setFoc(false); onBlur?.(); }}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: lifted ? "24px 40px 10px 42px" : "16px 40px 16px 42px",
            border: "none", background: "transparent", outline: "none",
            fontSize: 14, color: DARK, fontFamily: FF, resize: "vertical",
            minHeight: rows * 26 + 32, lineHeight: 1.65, transition: "padding 200ms",
          }}
        />
        {minChars !== undefined && (
          <div style={{
            position: "absolute", bottom: 8, right: 12, fontSize: 10.5, fontFamily: FF,
            color: value.length >= minChars ? "#10b981" : value.length > 0 ? "#f59e0b" : "#ccc",
            fontWeight: 600, transition: "color 200ms",
          }}>
            {value.length} / {minChars} min
          </div>
        )}
      </div>
      {error && (
        <div style={{
          fontSize: 11.5, color: "#ef4444", marginTop: 5, paddingLeft: 4,
          fontFamily: FF, display: "flex", alignItems: "center", gap: 4,
          animation: "biSlideDown 0.18s ease both",
        }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 8, fontWeight: 900 }}>!</span>
          </span>
          {error}
        </div>
      )}
    </div>
  );
};

// ── Success state ─────────────────────────────────────────────────────────────
const SuccessState = ({ email }: { email: string }) => {
  const nav = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "8px 0 0", position: "relative", overflow: "hidden", minHeight: 460 }}>
      <Confetti />
      <div style={{ position: "relative", zIndex: 5 }}>
        {/* Animated checkmark */}
        <div style={{
          width: 76, height: 76, borderRadius: "50%",
          background: "linear-gradient(145deg, #10b981, #059669)",
          boxShadow: "0 6px 0 rgba(5,150,105,0.35), 0 10px 32px rgba(16,185,129,0.32)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          animation: "biCheckPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
        }}>
          <Check size={36} color="#fff" strokeWidth={3} />
        </div>

        <h2 style={{
          fontSize: 24, fontWeight: 900, color: DARK, fontFamily: FF,
          margin: "0 0 8px", letterSpacing: "-0.02em",
          animation: "biSlideDown 0.4s cubic-bezier(0.22,1,0.36,1) 0.35s both",
        }}>Application Submitted!</h2>
        <p style={{
          fontSize: 13.5, color: "#6b7280", fontFamily: FF, margin: "0 0 28px", lineHeight: 1.65,
          animation: "biSlideDown 0.4s cubic-bezier(0.22,1,0.36,1) 0.45s both",
        }}>
          We'll review your application and contact you at<br />
          <strong style={{ color: DARK }}>{email}</strong> within 2–3 business days.
        </p>

        {/* Progress steps */}
        <div style={{
          background: CREAM, borderRadius: 14, padding: "18px 20px",
          marginBottom: 24, textAlign: "left",
          animation: "biSlideDown 0.4s cubic-bezier(0.22,1,0.36,1) 0.55s both",
        }}>
          {[
            { done: true,  label: "Application received",         sub: "Just now" },
            { done: false, label: "Under review (2–3 days)",      sub: "Our team will reach out" },
            { done: false, label: "Account created + email sent", sub: "If approved" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 2 ? 14 : 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: s.done ? "linear-gradient(145deg,#10b981,#059669)" : "rgba(0,0,0,0.07)",
                boxShadow: s.done ? "0 3px 0 rgba(5,150,105,0.30)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {s.done
                  ? <Check size={13} color="#fff" strokeWidth={3} />
                  : <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(0,0,0,0.20)", display: "block" }} />
                }
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.done ? DARK : "#6b7280", fontFamily: FF }}>{s.label}</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af", fontFamily: FF, marginTop: 1 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => nav("/lma/login")}
          style={{
            width: "100%", height: 50, background: GOLD_G, color: WHITE,
            border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
            fontFamily: FF, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: `0 4px 0 ${GOLD_DEEP}, 0 6px 20px rgba(201,136,58,0.28)`,
          }}
        >
          Sign In to Academy <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
export default function BecomeInstructorPage() {
  // Form state
  const [fullName,  setFullName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [expertise, setExpertise] = useState("");
  const [bio,       setBio]       = useState("");
  const [whyTeach,  setWhyTeach]  = useState("");
  const [password,  setPassword]  = useState("");

  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [touched,  setTouched]  = useState<Record<string, boolean>>({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [apiErr,   setApiErr]   = useState("");
  const [shaking,  setShaking]  = useState(false);

  // Card 3D tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform  = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(10px)`;
    el.style.transition = "transform 0.07s linear";
  };
  const onCardLeave = () => {
    const el = cardRef.current; if (!el) return;
    el.style.transform  = "perspective(1200px) rotateY(0) rotateX(0) translateZ(0)";
    el.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1)";
  };

  // Count-up stats
  const s1 = useCountUp(500, 1200, 800, "+");
  const s2 = useCountUp(12,  900,  950, "+");
  const s3 = useCountUp(95,  1100, 1050, "%");

  // Validation
  const validate = useCallback((fields = { fullName, email, phone, expertise, bio, whyTeach, password }) => {
    const e: Record<string, string> = {};
    if (!fields.fullName.trim())                              e.fullName  = "Full name is required.";
    if (!fields.email.trim())                                 e.email     = "Email is required.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(fields.email))    e.email     = "Enter a valid email address.";
    if (!fields.password)                                     e.password  = "Password is required.";
    else if (fields.password.length < 6)                      e.password  = "Password must be at least 6 characters.";
    if (fields.bio.trim().length > 0 && fields.bio.trim().length < 30)
                                                              e.bio       = `Bio must be at least 30 characters (${fields.bio.trim().length}/30).`;
    else if (!fields.bio.trim())                              e.bio       = "Bio is required.";
    if (fields.whyTeach.trim().length > 0 && fields.whyTeach.trim().length < 50)
                                                              e.whyTeach  = `Must be at least 50 characters (${fields.whyTeach.trim().length}/50).`;
    else if (!fields.whyTeach.trim())                         e.whyTeach  = "This field is required.";
    return e;
  }, [fullName, email, phone, expertise, bio, whyTeach, password]);

  const errsFor = (field: string) => touched[field] ? (errors[field] || "") : "";
  const validFor = (field: string) => touched[field] && !errors[field] && !!{ fullName, email, bio, whyTeach, phone, expertise, password }[field as keyof typeof errors];
  const touch = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) setErrors(validate());
  }, [fullName, email, phone, expertise, bio, whyTeach, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { fullName: true, email: true, phone: true, expertise: true, bio: true, whyTeach: true, password: true };
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setShaking(true); setTimeout(() => setShaking(false), 520); return;
    }
    setLoading(true); setApiErr("");
    try {
      const res = await fetch(`${API}/lma/become-instructor/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, phone, expertise, bio, why_teach: whyTeach, password }),
      });
      const data = await res.json();
      if (!res.ok) { setApiErr(data.error || "Submission failed. Please try again."); setShaking(true); setTimeout(() => setShaking(false), 520); return; }
      setSuccess(true);
    } catch {
      setApiErr("Network error. Please check your connection and try again.");
      setShaking(true); setTimeout(() => setShaking(false), 520);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes biOrbPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.09);opacity:0.82} }
        @keyframes biCardIn   { from{opacity:0;transform:perspective(1200px) translateY(28px) scale(0.97)} to{opacity:1;transform:perspective(1200px) translateY(0) scale(1)} }
        @keyframes biShake    { 0%,100%{transform:translateX(0)} 15%,55%{transform:translateX(-7px)} 35%,75%{transform:translateX(7px)} }
        @keyframes biFadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes biSlideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes biCheckPop { from{opacity:0;transform:scale(0.4)} to{opacity:1;transform:scale(1)} }
        @keyframes biLetterIn { from{opacity:0;transform:rotateX(-80deg) translateY(10px)} to{opacity:1;transform:rotateX(0) translateY(0)} }
        @keyframes biSpin     { to{transform:rotate(360deg)} }
        @keyframes biFloat1   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(8px,-14px)} }
        @keyframes biFloat2   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-12px,10px)} }
        @keyframes biFloat3   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,12px)} }
        @keyframes biFloat4   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,-10px)} }
        @keyframes biUnderline{ from{width:0} to{width:100%} }
        @keyframes biOrb1 { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.09);opacity:0.82} }
        .bi-card  { animation: biCardIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .bi-shake { animation: biShake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both !important; }
        .bi-spin  { animation: biSpin 0.75s linear infinite; }
        .bi-spin-wrap { display:inline-flex; flex-shrink:0; }
        @media(max-width:991px) {
          .bi-left  { display:none !important; }
          .bi-right { background: linear-gradient(150deg,${DARK} 0%,${DARKER} 100%) !important; }
          .bi-card  { box-shadow: 0 8px 48px rgba(0,0,0,0.52), 0 2px 8px rgba(0,0,0,0.32) !important; }
        }
        @media(prefers-reduced-motion:reduce) {
          * { animation-duration:0ms !important; transition-duration:0ms !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", fontFamily: FF }}>

        {/* ══ LEFT PANEL ═══════════════════════════════════════════════════════ */}
        <div className="bi-left" style={{
          flex: "0 0 45%", flexDirection: "column", justifyContent: "flex-start",
          padding: "52px 52px 44px", position: "relative", overflow: "hidden",
          background: `linear-gradient(150deg, ${DARK} 0%, ${DARKER} 100%)`,
          display: "flex",
        }}>
          {/* Dot grid */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

          {/* Orbs */}
          <span style={{ position:"absolute", top:"-12%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(201,136,58,0.16) 0%, transparent 65%)", animation:"biOrb1 8s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />
          <span style={{ position:"absolute", bottom:"-18%", right:"-8%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle, rgba(201,136,58,0.10) 0%, transparent 65%)", animation:"biOrb1 11s 3s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />
          <span style={{ position:"absolute", top:"42%", right:"12%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(201,136,58,0.08) 0%, transparent 65%)", animation:"biOrb1 9s 5s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />

          {/* Floating particles */}
          {[
            { top:"18%", left:"80%", d:6, a:"biFloat1 6s ease-in-out infinite" },
            { top:"52%", left:"8%",  d:4, a:"biFloat2 8s 1.5s ease-in-out infinite" },
            { top:"72%", left:"72%", d:5, a:"biFloat3 7s 0.8s ease-in-out infinite" },
            { top:"30%", left:"20%", d:3, a:"biFloat4 9s 2.2s ease-in-out infinite" },
          ].map((p, i) => (
            <span key={i} style={{ position:"absolute", top:p.top, left:p.left, width:p.d, height:p.d, borderRadius:"50%", background:`rgba(201,136,58,0.55)`, animation:p.a, pointerEvents:"none", zIndex:0 }} />
          ))}

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div style={{ marginBottom: 28, animation: "biFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}>
              <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ Academy" style={{ height: 52, width: "auto" }} />
            </div>

            {/* Headline — letter-by-letter rotateX reveal */}
            <div style={{ marginBottom: 10, overflow: "hidden", perspective: "600px" }}>
              {"Teach on XERXEZ Academy".split("").map((ch, i) => (
                <span key={i} style={{
                  display: "inline-block",
                  color: "#fff", fontWeight: 900,
                  fontSize: "clamp(26px, 2.6vw, 38px)",
                  fontFamily: FF, letterSpacing: "-0.025em", lineHeight: 1.15,
                  animation: `biLetterIn 0.45s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.035}s both`,
                  whiteSpace: ch === " " ? "pre" : "normal",
                }}>
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </div>

            <p style={{
              color: GOLD, fontStyle: "italic", fontSize: 14, fontFamily: FF,
              marginBottom: 32, letterSpacing: "0.01em",
              animation: "biFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 1.0s both",
            }}>
              Share your expertise with thousands of students
            </p>

            {/* 3 DC benefit cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {[
                { icon: <Users size={16} color="#fff" />, accent: "#3b82f6", label: "Reach Students Across India", sub: "Thousands of learners on one platform", delay: 1.1 },
                { icon: <IndianRupee size={16} color="#fff" />, accent: "#10b981", label: "Earn From Your Expertise", sub: "Get paid every time someone enrolls", delay: 1.2 },
                { icon: <Award size={16} color="#fff" />, accent: GOLD, label: "Build Your Teaching Portfolio", sub: "Track record, ratings & certificates", delay: 1.3 },
              ].map((b, i) => (
                <div key={i} style={{ animation: `biFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) ${b.delay}s both` }}>
                  <DC accent={b.accent} p="14px 16px">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: b.accent, opacity: 0.9,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 4px 12px ${b.accent}55`,
                      }}>{b.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: FF, marginBottom: 2 }}>{b.label}</div>
                        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.50)", fontFamily: FF }}>{b.sub}</div>
                      </div>
                    </div>
                  </DC>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 10, animation: "biFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 1.4s both" }}>
              {[
                { val: s1, label: "Students",    color: GOLD },
                { val: s2, label: "Courses",     color: "#10b981" },
                { val: s3, label: "Satisfaction", color: "#3b82f6" },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)",
                  border: `1px solid rgba(255,255,255,0.08)`, borderTop: `2px solid ${s.color}`,
                  borderRadius: 12, padding: "14px 12px",
                }}>
                  <div style={{ color: s.color, fontWeight: 800, fontSize: 20, fontFamily: FF, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ color: "rgba(255,255,255,0.48)", fontSize: 10.5, fontFamily: FF, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══════════════════════════════════════════════════════ */}
        <div className="bi-right" style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start",
          paddingTop: 44, paddingBottom: 36, paddingLeft: 28, paddingRight: 28,
          minHeight: "100vh", background: CREAM, overflowY: "auto",
        }}>
          {/* 3D Card */}
          <div
            ref={cardRef}
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
            className={`bi-card${shaking ? " bi-shake" : ""}`}
            style={{
              background: WHITE, borderRadius: 20,
              padding: "28px 30px 24px",
              width: "100%", maxWidth: 480,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderTop: `3px solid ${GOLD}`,
              willChange: "transform",
            }}
          >
            {success ? (
              <SuccessState email={email} />
            ) : (
              <>
                {/* Header */}
                <div style={{ marginBottom: 22, animation: "biFadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}>
                  <h1 style={{ fontSize: 22, fontWeight: 900, color: DARK, fontFamily: FF, margin: "0 0 4px", letterSpacing: "-0.022em" }}>
                    Become an Instructor
                  </h1>
                  <p style={{ fontSize: 13, color: "#6b7280", fontFamily: FF, margin: "0 0 10px" }}>
                    Apply to join XERXEZ Academy
                  </p>
                  {/* Orange underline draw */}
                  <div style={{ height: 3, background: GOLD_G, borderRadius: 2, animation: "biUnderline 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both", width: 0 }} />
                </div>

                {/* API error */}
                {apiErr && (
                  <div style={{
                    background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
                    padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626",
                    fontFamily: FF, display: "flex", alignItems: "center", gap: 8,
                    animation: "biSlideDown 0.18s ease both",
                  }}>
                    <span style={{ flexShrink: 0, fontWeight: 800 }}>!</span>{apiErr}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Fields stagger in */}
                  {[0,1,6,2,3,4,5].map(i => (
                    <div key={i} style={{ animation: `biFadeUp 0.38s cubic-bezier(0.22,1,0.36,1) ${0.22 + i * 0.06}s both` }}>
                      {i === 0 && (
                        <FloatLabel id="fullName" label="Full Name" value={fullName} onChange={setFullName}
                          icon={<User size={16} strokeWidth={2} />}
                          error={errsFor("fullName")} valid={validFor("fullName") as boolean}
                          autoComplete="name" onBlur={() => touch("fullName")} />
                      )}
                      {i === 6 && (
                        <FloatLabel id="password" label="Choose a Password" type="password" value={password} onChange={setPassword}
                          icon={<Lock size={16} strokeWidth={2} />}
                          error={errsFor("password")} valid={validFor("password") as boolean}
                          autoComplete="new-password" onBlur={() => touch("password")} />
                      )}
                      {i === 1 && (
                        <FloatLabel id="email" label="Email Address" type="email" value={email} onChange={setEmail}
                          icon={<Mail size={16} strokeWidth={2} />}
                          error={errsFor("email")} valid={validFor("email") as boolean}
                          autoComplete="email" onBlur={() => touch("email")} />
                      )}
                      {i === 2 && (
                        <FloatLabel id="phone" label="Phone Number (optional)" value={phone} onChange={setPhone}
                          icon={<Phone size={16} strokeWidth={2} />}
                          valid={phone.length > 6} autoComplete="tel" />
                      )}
                      {i === 3 && (
                        <FloatLabel id="expertise" label="Expertise / Subject" value={expertise} onChange={setExpertise}
                          icon={<BookOpen size={16} strokeWidth={2} />}
                          placeholder="e.g. AI & ML, Full Stack, DevOps…"
                          valid={expertise.length > 3} />
                      )}
                      {i === 4 && (
                        <FloatTextarea id="bio" label="Short Bio" value={bio} onChange={setBio}
                          icon={<FileText size={16} strokeWidth={2} />}
                          rows={3} minChars={30}
                          error={errsFor("bio")} valid={validFor("bio") as boolean}
                          onBlur={() => touch("bio")} />
                      )}
                      {i === 5 && (
                        <FloatTextarea id="whyTeach" label="Why do you want to teach?" value={whyTeach} onChange={setWhyTeach}
                          icon={<MessageSquare size={16} strokeWidth={2} />}
                          rows={4} minChars={50}
                          error={errsFor("whyTeach")} valid={validFor("whyTeach") as boolean}
                          onBlur={() => touch("whyTeach")} />
                      )}
                    </div>
                  ))}

                  {/* Submit button */}
                  <div style={{ animation: "biFadeUp 0.38s cubic-bezier(0.22,1,0.36,1) 0.6s both" }}>
                    <SubmitBtn loading={loading} disabled={false} />
                  </div>
                </form>

                {/* Footer links */}
                <div style={{ marginTop: 18, textAlign: "center", animation: "biFadeUp 0.38s cubic-bezier(0.22,1,0.36,1) 0.65s both" }}>
                  <div style={{ fontSize: 12.5, color: "#6b7280", fontFamily: FF, marginBottom: 8 }}>
                    Already have an account?{" "}
                    <Link to="/lma/login" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Link to="/training" style={{ fontSize: 12, color: "#aaa", textDecoration: "none", fontFamily: FF, display: "inline-flex", alignItems: "center", gap: 5 }}
                      onMouseEnter={e => (e.currentTarget.style.color = DARK)}
                      onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>
                      ← Back to Website
                    </Link>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    {["AES-256", "ISO 27001"].map(b => (
                      <span key={b} style={{ fontSize: 10, color: "#ccc", border: "1px solid #e5e7eb", borderRadius: 5, padding: "2px 8px", fontFamily: FF, fontWeight: 600 }}>{b}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

// ── Submit button (extracted to avoid hook rules issues) ─────────────────────
function SubmitBtn({ loading, disabled }: { loading: boolean; disabled: boolean }) {
  const [hov, setHov] = useState(false);
  const off = loading || disabled;
  return (
    <button
      type="submit" disabled={off}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", height: 52, borderRadius: 12, border: "none",
        background: off ? "#e5e7eb" : GOLD_G,
        color: off ? "#9ca3af" : WHITE,
        fontSize: 15, fontWeight: 700, fontFamily: FF,
        cursor: off ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
        boxShadow: hov && !off
          ? `0 6px 0 ${GOLD_DEEP}, 0 10px 28px rgba(201,136,58,0.35)`
          : off ? "none" : `0 4px 0 ${GOLD_DEEP}, 0 6px 20px rgba(201,136,58,0.28)`,
        transform: hov && !off ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 180ms cubic-bezier(0.22,1,0.36,1), box-shadow 180ms, background 180ms",
        overflow: "hidden", position: "relative",
      }}
    >
      {/* Shimmer sweep on hover */}
      {hov && !off && (
        <span style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
          animation: "biShimmer 0.6s ease once",
        }} />
      )}
      {loading ? (
        <>
          <span className="bi-spin-wrap"><svg className="bi-spin" width={17} height={17} viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.30)" strokeWidth="2.5" />
            <path d="M9 2a7 7 0 0 1 7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg></span>
          Submitting…
        </>
      ) : (
        <>Submit Application <ChevronRight size={16} /></>
      )}
    </button>
  );
}
