import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, BookOpen, FileText, MessageSquare,
  Check, ArrowRight, Users, IndianRupee, Award, ChevronRight, ChevronLeft, Lock,
  Building2, Link2, Globe, GraduationCap, Clock, Target, ShieldCheck,
} from "lucide-react";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";
import PhoneInput, { isValidPhone } from "../../components/common/PhoneInput";

const EXPERTISE_OPTIONS = ["AI & ML", "DevSecOps", "Cloud", "Web Dev", "Data Science", "Business", "Other"];
const COMPANY_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "200+"];
const URL_RE = /^https?:\/\/.+\..+/i;

// ── Brand tokens ──────────────────────────────────────────────────────────────
const GOLD      = "#D93522";
const GOLD_G    = "#D93522";
const GOLD_DEEP = "rgba(139,31,23,0.50)";
const DARK      = "#0f2c4d";
const DARKER    = "#071a33";
const CREAM     = "#F4F7FA";
const WHITE     = "#FFFFFF";
const FF        = "'DM Sans', sans-serif";

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
    const colors = [GOLD, "#ff6b52", "#fff", "#8B1F17", "#ffffff", "#b02d1a"];
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

// ── Shared field primitives ───────────────────────────────────────────────────
function fieldBorderColor(error?: string, focused?: boolean, valid?: boolean): string {
  if (error) return "#ef4444";
  if (focused) return GOLD;
  if (valid) return "#10b981";
  return "rgba(0,0,0,0.13)";
}

function fieldIconColor(error?: string, focused?: boolean, valid?: boolean): string {
  if (focused) return GOLD;
  if (error) return "#ef4444";
  if (valid) return "#10b981";
  return "#aaa";
}

function fieldLabelColor(error?: string, focused?: boolean, lifted = true): string {
  if (!lifted) return "#aaa";
  if (error) return "#ef4444";
  if (focused) return GOLD;
  return "#6b7280";
}

function fieldShellStyle(error?: string, focused?: boolean, valid?: boolean): React.CSSProperties {
  return {
    position: "relative",
    border: `1.5px solid ${fieldBorderColor(error, focused, valid)}`,
    borderRadius: 11, background: WHITE,
    boxShadow: focused ? `0 0 0 3px ${error ? "rgba(239,68,68,0.12)" : "rgba(217,53,34,0.14)"}` : "none",
    transition: "border-color 200ms, box-shadow 200ms",
  };
}

function charCounterColor(error: string | undefined, length: number, minChars: number): string {
  if (error) return "#ef4444";
  if (length >= minChars) return "#10b981";
  if (length > 0) return GOLD;
  return "#ccc";
}

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div style={{
      fontSize: 11.5, color: "#ef4444", marginTop: 5, paddingLeft: 4,
      fontFamily: FF, display: "flex", alignItems: "center", gap: 4,
      animation: "biSlideDown 0.18s ease both",
    }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontSize: 8, fontWeight: 900 }}>!</span>
      </span>
      {message}
    </div>
  );
};

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
      <div style={fieldShellStyle(error, foc, valid)}>
        {/* Floating label */}
        <label htmlFor={id} style={{
          position: "absolute", left: 42, pointerEvents: "none",
          top: lifted ? 7 : "50%",
          transform: lifted ? "translateY(0) scale(0.82)" : "translateY(-50%) scale(1)",
          transformOrigin: "left",
          fontSize: 13.5, fontWeight: lifted ? 700 : 500,
          color: fieldLabelColor(error, foc, lifted),
          fontFamily: FF, transition: "all 200ms cubic-bezier(0.22,1,0.36,1)", zIndex: 1,
        }}>{label}</label>
        {/* Icon */}
        <span style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          color: fieldIconColor(error, foc, valid),
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
      <FieldError message={error} />
    </div>
  );
};

// ── Floating label textarea ────────────────────────────────────────────────────
type FLTAProps = {
  id: string; label: string; value: string; onChange: (v: string) => void;
  icon: React.ReactNode; rows?: number; error?: string; valid?: boolean;
  minChars?: number; maxChars?: number; onBlur?: () => void;
};
const FloatTextarea = ({ id, label, value, onChange, icon, rows = 3, error, valid, minChars, maxChars, onBlur }: FLTAProps) => {
  const [foc, setFoc] = useState(false);
  const lifted = foc || value.length > 0;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={fieldShellStyle(error, foc, valid)}>
        <label htmlFor={id} style={{
          position: "absolute", left: 42, top: lifted ? 8 : 14, pointerEvents: "none",
          fontSize: 13.5, fontWeight: lifted ? 700 : 500,
          color: fieldLabelColor(error, foc, lifted),
          fontFamily: FF, transition: "all 200ms cubic-bezier(0.22,1,0.36,1)", zIndex: 1,
          transform: lifted ? "scale(0.82)" : "scale(1)", transformOrigin: "left",
        }}>{label}</label>
        <span style={{
          position: "absolute", left: 12, top: 14,
          color: fieldIconColor(error, foc, valid),
          display: "flex", transition: "color 200ms", zIndex: 2,
        }}>{icon}</span>
        {valid && !error && (
          <span style={{ position: "absolute", right: 12, top: 12, color: "#10b981", display: "flex", zIndex: 2 }}>
            <Check size={15} strokeWidth={2.5} />
          </span>
        )}
        <textarea
          id={id} value={value} rows={rows} maxLength={maxChars}
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
        {maxChars !== undefined ? (
          <div style={{
            position: "absolute", bottom: 8, right: 12, fontSize: 10.5, fontFamily: FF,
            color: charCounterColor(error, value.length, minChars ?? 0),
            fontWeight: 600, transition: "color 200ms",
          }}>
            {value.length} / {maxChars}
          </div>
        ) : minChars !== undefined && (
          <div style={{
            position: "absolute", bottom: 8, right: 12, fontSize: 10.5, fontFamily: FF,
            color: charCounterColor(error, value.length, minChars),
            fontWeight: 600, transition: "color 200ms",
          }}>
            {value.length} / {minChars} characters minimum
          </div>
        )}
      </div>
      <FieldError message={error} />
    </div>
  );
};

// ── Floating label select ──────────────────────────────────────────────────────
type FSProps = {
  id: string; label: string; value: string; onChange: (v: string) => void;
  icon: React.ReactNode; options: string[]; error?: string; valid?: boolean; onBlur?: () => void;
};
const FloatSelect = ({ id, label, value, onChange, icon, options, error, valid, onBlur }: FSProps) => {
  // The label always sits lifted above a select — an empty option reads worse floating.
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={fieldShellStyle(error, foc, valid)}>
        <label htmlFor={id} style={{
          position: "absolute", left: 42, top: 7, pointerEvents: "none",
          fontSize: 13.5 * 0.82, fontWeight: 700,
          color: fieldLabelColor(error, foc),
          fontFamily: FF, transition: "color 200ms", zIndex: 1, transformOrigin: "left",
        }}>{label}</label>
        <span style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          color: fieldIconColor(error, foc, valid),
          display: "flex", transition: "color 200ms", zIndex: 2,
        }}>{icon}</span>
        {valid && !error && (
          <span style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", color: "#10b981", display: "flex", zIndex: 2 }}>
            <Check size={15} strokeWidth={2.5} />
          </span>
        )}
        <select
          id={id} value={value} aria-label={label}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFoc(true)}
          onBlur={() => { setFoc(false); onBlur?.(); }}
          style={{
            width: "100%", boxSizing: "border-box", appearance: "none",
            padding: "22px 34px 8px 42px",
            border: "none", background: "transparent", outline: "none", cursor: "pointer",
            fontSize: 14, color: value ? DARK : "#aaa", fontFamily: FF,
          }}
        >
          <option value="" disabled>Select…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <FieldError message={error} />
    </div>
  );
};

// ── Yes/No toggle ──────────────────────────────────────────────────────────────
const YesNoToggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#6b7280", fontFamily: FF, marginBottom: 8 }}>{label}</div>
    <div style={{ display: "flex", gap: 10 }}>
      {[{ v: true, label: "Yes" }, { v: false, label: "No" }].map(opt => {
        const active = value === opt.v;
        return (
          <button
            key={opt.label} type="button" onClick={() => onChange(opt.v)}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 10, fontFamily: FF, fontSize: 13.5, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              border: `1.5px solid ${active ? GOLD : "rgba(0,0,0,0.13)"}`,
              background: active ? "rgba(217,53,34,0.08)" : WHITE,
              color: active ? GOLD : "#6b7280",
              transition: "border-color 150ms, background 150ms, color 150ms",
            }}
          >
            {active && <Check size={14} strokeWidth={3} />} {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

// ── Agreement checkbox row ──────────────────────────────────────────────────────
const AgreeCheckbox = ({ id, checked, onChange, error, children }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode;
}) => (
  <div style={{ marginBottom: 16 }}>
    <label htmlFor={id} style={{
      display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
      padding: "12px 14px", borderRadius: 10,
      border: `1.5px solid ${error ? "#ef4444" : checked ? "#10b981" : "rgba(0,0,0,0.13)"}`,
      background: checked ? "rgba(16,185,129,0.05)" : WHITE,
      transition: "border-color 150ms, background 150ms",
    }}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ width: 18, height: 18, marginTop: 1, accentColor: "#10b981", cursor: "pointer", flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: DARK, fontFamily: FF, lineHeight: 1.5 }}>{children}</span>
    </label>
    <FieldError message={error} />
  </div>
);

// ── Step progress indicator ─────────────────────────────────────────────────────
const STEP_LABELS = ["Personal & Company", "Expertise", "Course Intent", "Agreement"];

// Fields grouped by the step they live on, so "Continue" can validate just the
// visible fields instead of the whole form at once.
const STEP_FIELDS: Record<number, string[]> = {
  1: ["fullName", "companyName", "companySize", "email", "phone", "linkedinUrl", "website", "password"],
  2: ["expertise", "yearsExperience", "bio", "whyTeach"],
  3: ["courseTitle", "courseDescription", "targetAudience", "estimatedDuration"],
  4: ["agreeTerms", "confirmRights"],
};
const STEP_NUMBERS = Object.keys(STEP_FIELDS).map(Number);

const StepProgress = ({ step }: { step: number }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
    {STEP_LABELS.map((label, i) => {
      const n = i + 1;
      const done = n < step, active = n === step;
      return (
        <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEP_LABELS.length - 1 ? 1 : "0 0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11.5, fontWeight: 800, fontFamily: FF,
              background: done ? "#10b981" : active ? GOLD : "rgba(0,0,0,0.08)",
              color: done || active ? "#fff" : "#9ca3af",
              transition: "background 200ms",
            }}>
              {done ? <Check size={13} strokeWidth={3} /> : n}
            </div>
            <div style={{
              fontSize: 9.5, fontWeight: 700, fontFamily: FF, textAlign: "center", whiteSpace: "nowrap",
              color: active ? GOLD : done ? "#10b981" : "#9ca3af",
            }}>{label}</div>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div style={{ flex: 1, height: 2, margin: "0 4px 16px", background: n < step ? "#10b981" : "rgba(0,0,0,0.08)", transition: "background 200ms" }} />
          )}
        </div>
      );
    })}
  </div>
);

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
            boxShadow: `0 4px 0 ${GOLD_DEEP}, 0 6px 20px rgba(217,53,34,0.28)`,
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
  // Step 0 = "Who are you?" selector, 1-4 = the wizard.
  const [step, setStep] = useState(0);
  const [accountKind, setAccountKind] = useState<"individual" | "company" | null>(null);
  const isCompany = accountKind === "company";

  // Form state — step 1: personal & company
  const [fullName,    setFullName]    = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [website,     setWebsite]     = useState("");
  const [password,    setPassword]    = useState("");

  // step 2: expertise
  const [expertise,       setExpertise]       = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [bio,              setBio]              = useState("");
  const [prevTeaching,     setPrevTeaching]     = useState(false);
  const [whyTeach,         setWhyTeach]         = useState("");

  // step 3: course intent
  const [courseTitle,       setCourseTitle]       = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [targetAudience,    setTargetAudience]    = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");

  // step 4: agreement
  const [agreeTerms,    setAgreeTerms]    = useState(false);
  const [confirmRights, setConfirmRights] = useState(false);

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

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!fullName.trim())                                   e.fullName = "Full name is required.";
    if (isCompany && !companyName.trim())                   e.companyName = "Company name is required.";
    if (isCompany && !companySize)                          e.companySize = "Select a company size.";
    if (!email.trim())                                      e.email = "Email is required.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))           e.email = "Enter a valid email address.";
    if (!phone.trim())                                      e.phone = "Phone number is required.";
    else if (!isValidPhone(phone))                          e.phone = "Enter a valid phone number for the selected country.";
    if (linkedinUrl.trim() && !URL_RE.test(linkedinUrl))    e.linkedinUrl = "Enter a full URL, e.g. https://linkedin.com/in/you";
    if (website.trim() && !URL_RE.test(website))            e.website = "Enter a full URL, e.g. https://example.com";
    if (!password)                                          e.password = "Password is required.";
    else if (password.length < 6)                           e.password = "Password must be at least 6 characters.";

    if (!expertise)                                         e.expertise = "Select an area of expertise.";
    if (yearsExperience === "" || Number(yearsExperience) < 0) e.yearsExperience = "Enter years of experience.";
    if (!bio.trim())                                        e.bio = "Bio is required.";
    else if (bio.trim().length < 10)                        e.bio = `Bio must be at least 10 characters (${bio.trim().length}/10).`;
    if (!whyTeach.trim())                                   e.whyTeach = "This field is required.";
    else if (whyTeach.trim().length < 10)                   e.whyTeach = `Must be at least 10 characters (${whyTeach.trim().length}/10).`;

    if (!courseTitle.trim())                                e.courseTitle = "Proposed course title is required.";
    if (!courseDescription.trim())                          e.courseDescription = "Course description is required.";
    if (!targetAudience.trim())                             e.targetAudience = "Target audience is required.";
    if (!estimatedDuration.trim())                          e.estimatedDuration = "Estimated duration is required.";

    if (!agreeTerms)                                        e.agreeTerms = "You must agree to continue.";
    if (!confirmRights)                                     e.confirmRights = "You must confirm content ownership to continue.";
    return e;
  }, [isCompany, fullName, companyName, companySize, email, phone, linkedinUrl, website, password, expertise, yearsExperience, bio, whyTeach, courseTitle, courseDescription, targetAudience, estimatedDuration, agreeTerms, confirmRights]);

  const errsFor = (field: string) => touched[field] ? (errors[field] || "") : "";
  const validFor = (field: string) => touched[field] && !errors[field];
  const touch = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  // `validate` is memoised on every form value, so this re-runs exactly when
  // one of them changes — but only once the user has touched something.
  useEffect(() => {
    if (Object.keys(touched).length > 0) setErrors(validate());
  }, [validate]); // eslint-disable-line react-hooks/exhaustive-deps

  const shake = () => { setShaking(true); setTimeout(() => setShaking(false), 520); };

  const goNext = () => {
    const fields = STEP_FIELDS[step];
    setTouched(t => ({ ...t, ...Object.fromEntries(fields.map(f => [f, true])) }));
    const errs = validate();
    setErrors(errs);
    if (fields.some(f => errs[f])) { shake(); return; }
    setStep(s => s + 1);
  };
  const goBack = () => setStep(s => Math.max(0, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allFields = Object.values(STEP_FIELDS).flat();
    setTouched(Object.fromEntries(allFields.map(f => [f, true])));
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Jump back to the earliest step that still has an error
      const badStep = STEP_NUMBERS.find(s => STEP_FIELDS[s].some(f => errs[f]));
      if (badStep) setStep(badStep);
      shake();
      return;
    }
    setLoading(true); setApiErr("");
    try {
      const res = await fetch(`${API}/lma/become-instructor/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_type: accountKind ?? "individual", company_size: isCompany ? companySize : "",
          full_name: fullName, company_name: isCompany ? companyName : "", email, phone,
          linkedin_url: linkedinUrl, website, password,
          expertise, years_experience: Number(yearsExperience) || 0, bio,
          previous_teaching_experience: prevTeaching, why_teach: whyTeach,
          proposed_course_title: courseTitle, course_description: courseDescription,
          target_audience: targetAudience, estimated_duration: estimatedDuration,
          agree_terms: agreeTerms, confirm_rights: confirmRights,
        }),
      });

      // The backend can fail before it ever produces JSON (proxy/CORS error,
      // a 500 with an HTML traceback page, etc.) — parse the body separately
      // from the fetch itself so those cases get a distinct, honest message
      // instead of being lumped into the network-error catch below.
      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("[BecomeInstructor] Response was not valid JSON", { status: res.status, statusText: res.statusText, parseErr });
        setApiErr(`Server returned an unexpected response (HTTP ${res.status}). Please try again or contact support.`);
        shake();
        return;
      }

      console.log("[BecomeInstructor] Submit response", { status: res.status, data }); // TEMP: remove once submission is confirmed working end-to-end

      if (!res.ok) { setApiErr(data.error || `Submission failed (HTTP ${res.status}). Please try again.`); shake(); return; }
      setSuccess(true);
    } catch (err) {
      console.error("[BecomeInstructor] Network/fetch error", err); // TEMP: remove once submission is confirmed working end-to-end
      const detail = err instanceof Error ? err.message : String(err);
      setApiErr(`Couldn't reach the server (${detail}). Check your connection and try again.`);
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
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
        @keyframes biSlideLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes biSlideRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes biShimmer   { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        .bi-left  { animation: biSlideLeft 0.4s ease-out both; }
        .bi-right { animation: biSlideRight 0.4s ease-out both; }
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
          <span style={{ position:"absolute", top:"-12%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(217,53,34,0.16) 0%, transparent 65%)", animation:"biOrb1 8s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />
          <span style={{ position:"absolute", bottom:"-18%", right:"-8%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle, rgba(217,53,34,0.10) 0%, transparent 65%)", animation:"biOrb1 11s 3s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />
          <span style={{ position:"absolute", top:"42%", right:"12%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(217,53,34,0.08) 0%, transparent 65%)", animation:"biOrb1 9s 5s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />

          {/* Floating particles */}
          {[
            { top:"18%", left:"80%", d:6, a:"biFloat1 6s ease-in-out infinite" },
            { top:"52%", left:"8%",  d:4, a:"biFloat2 8s 1.5s ease-in-out infinite" },
            { top:"72%", left:"72%", d:5, a:"biFloat3 7s 0.8s ease-in-out infinite" },
            { top:"30%", left:"20%", d:3, a:"biFloat4 9s 2.2s ease-in-out infinite" },
          ].map((p, i) => (
            <span key={i} style={{ position:"absolute", top:p.top, left:p.left, width:p.d, height:p.d, borderRadius:"50%", background:`rgba(217,53,34,0.55)`, animation:p.a, pointerEvents:"none", zIndex:0 }} />
          ))}

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div style={{ marginBottom: 28, animation: "biFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}>
              <Link to="/">
                <img src="/assets/img/logo/xerxez_logo.png" alt="XERXEZ Academy" style={{ height: 70, width: "auto" }} />
              </Link>
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
              width: "100%", maxWidth: 520,
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
                <div style={{ marginBottom: 16, animation: "biFadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}>
                  <h1 style={{ fontSize: 22, fontWeight: 900, color: DARK, fontFamily: FF, margin: "0 0 4px", letterSpacing: "-0.022em" }}>
                    Become an Instructor
                  </h1>
                  <p style={{ fontSize: 13, color: "#6b7280", fontFamily: FF, margin: "0 0 10px" }}>
                    Apply to join XERXEZ Academy
                  </p>
                  {/* Orange underline draw */}
                  <div style={{ height: 3, background: GOLD_G, borderRadius: 2, animation: "biUnderline 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both", width: 0 }} />
                </div>

                {step >= 1 && <StepProgress step={step} />}

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

                {step === 0 && (
                  <div key="step0" style={{ animation: "biFadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both" }}>
                    <p style={{ fontSize: 12.5, color: "#6b7280", fontFamily: FF, margin: "0 0 14px" }}>Who are you applying as?</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {([
                        { kind: "individual" as const, icon: "👤", title: "Individual Instructor", desc: "I'm an individual expert or freelancer who wants to teach" },
                        { kind: "company" as const, icon: "🏢", title: "Company / Organisation", desc: "We're a company or institution that wants to offer courses" },
                      ]).map(opt => (
                        <button
                          key={opt.kind} type="button"
                          onClick={() => { setAccountKind(opt.kind); setStep(1); }}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 14, textAlign: "left",
                            padding: "18px 20px", borderRadius: 14, cursor: "pointer",
                            border: `1.5px solid ${accountKind === opt.kind ? GOLD : "rgba(0,0,0,0.12)"}`,
                            background: accountKind === opt.kind ? "rgba(217,53,34,0.05)" : WHITE,
                            transition: "border-color 150ms, background 150ms",
                          }}
                        >
                          <span style={{ fontSize: 26, lineHeight: 1 }}>{opt.icon}</span>
                          <span>
                            <div style={{ fontSize: 14.5, fontWeight: 800, color: DARK, fontFamily: FF, marginBottom: 3 }}>{opt.title}</div>
                            <div style={{ fontSize: 12.5, color: "#6b7280", fontFamily: FF, lineHeight: 1.5 }}>{opt.desc}</div>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate autoComplete="off" style={{ display: step === 0 ? "none" : "block" }}>
                  {step === 1 && (
                    <div key="step1" style={{ animation: "biFadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both" }}>
                      <FloatLabel id="fullName" label={isCompany ? "Contact Person Full Name" : "Full Name"} value={fullName} onChange={setFullName}
                        icon={<User size={16} strokeWidth={2} />}
                        error={errsFor("fullName")} valid={validFor("fullName")}
                        autoComplete="off" onBlur={() => touch("fullName")} />
                      {isCompany && (
                        <>
                          <FloatLabel id="companyName" label="Company Name" value={companyName} onChange={setCompanyName}
                            icon={<Building2 size={16} strokeWidth={2} />}
                            error={errsFor("companyName")} valid={validFor("companyName")}
                            autoComplete="off" onBlur={() => touch("companyName")} />
                          <FloatSelect id="companySize" label="Company Size" value={companySize} onChange={v => { setCompanySize(v); touch("companySize"); }}
                            icon={<Building2 size={16} strokeWidth={2} />} options={COMPANY_SIZE_OPTIONS}
                            error={errsFor("companySize")} valid={validFor("companySize")} onBlur={() => touch("companySize")} />
                        </>
                      )}
                      <FloatLabel id="email" label={isCompany ? "Company Email" : "Email Address"} type="email" value={email} onChange={setEmail}
                        icon={<Mail size={16} strokeWidth={2} />}
                        error={errsFor("email")} valid={validFor("email")}
                        autoComplete="off" onBlur={() => touch("email")} />
                      <div style={{ marginBottom: 18 }}>
                        <label htmlFor="phone" style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", fontFamily: FF, marginBottom: 6 }}>Phone Number</label>
                        <PhoneInput id="phone" value={phone} required onChange={setPhone} onBlur={() => touch("phone")} error={errsFor("phone")} />
                      </div>
                      <FloatLabel id="website" label={isCompany ? "Company Website (optional)" : "Personal Website (optional)"} type="url" value={website} onChange={setWebsite}
                        icon={<Globe size={16} strokeWidth={2} />} placeholder="https://example.com"
                        error={errsFor("website")} valid={!!website && validFor("website")}
                        autoComplete="off" onBlur={() => touch("website")} />
                      <FloatLabel id="linkedinUrl" label={isCompany ? "LinkedIn Company Page (optional)" : "LinkedIn Profile URL (optional)"} type="url" value={linkedinUrl} onChange={setLinkedinUrl}
                        icon={<Link2 size={16} strokeWidth={2} />} placeholder="https://linkedin.com/in/you"
                        error={errsFor("linkedinUrl")} valid={!!linkedinUrl && validFor("linkedinUrl")}
                        autoComplete="off" onBlur={() => touch("linkedinUrl")} />
                      <FloatLabel id="password" label="Choose a Password" type="password" value={password} onChange={setPassword}
                        icon={<Lock size={16} strokeWidth={2} />}
                        error={errsFor("password")} valid={validFor("password")}
                        autoComplete="new-password" onBlur={() => touch("password")} />
                    </div>
                  )}

                  {step === 2 && (
                    <div key="step2" style={{ animation: "biFadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both" }}>
                      <FloatSelect id="expertise" label="Area of Expertise" value={expertise} onChange={v => { setExpertise(v); touch("expertise"); }}
                        icon={<GraduationCap size={16} strokeWidth={2} />} options={EXPERTISE_OPTIONS}
                        error={errsFor("expertise")} valid={validFor("expertise")} onBlur={() => touch("expertise")} />
                      <FloatLabel id="yearsExperience" label="Years of Experience" type="number" value={yearsExperience} onChange={setYearsExperience}
                        icon={<Clock size={16} strokeWidth={2} />} placeholder="e.g. 5"
                        error={errsFor("yearsExperience")} valid={validFor("yearsExperience")}
                        autoComplete="off" onBlur={() => touch("yearsExperience")} />
                      <FloatTextarea id="bio" label="Bio / About You" value={bio} onChange={setBio}
                        icon={<FileText size={16} strokeWidth={2} />}
                        rows={6} minChars={10} maxChars={500}
                        error={errsFor("bio")} valid={validFor("bio")}
                        onBlur={() => touch("bio")} />
                      <YesNoToggle label="Previous teaching experience?" value={prevTeaching} onChange={setPrevTeaching} />
                      <FloatTextarea id="whyTeach" label="Why do you want to teach?" value={whyTeach} onChange={setWhyTeach}
                        icon={<MessageSquare size={16} strokeWidth={2} />}
                        rows={6} minChars={10} maxChars={500}
                        error={errsFor("whyTeach")} valid={validFor("whyTeach")}
                        onBlur={() => touch("whyTeach")} />
                    </div>
                  )}

                  {step === 3 && (
                    <div key="step3" style={{ animation: "biFadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both" }}>
                      <FloatLabel id="courseTitle" label="Proposed Course Title" value={courseTitle} onChange={setCourseTitle}
                        icon={<BookOpen size={16} strokeWidth={2} />} placeholder="e.g. Advanced Cloud Security"
                        error={errsFor("courseTitle")} valid={validFor("courseTitle")}
                        autoComplete="off" onBlur={() => touch("courseTitle")} />
                      <FloatTextarea id="courseDescription" label="Course Description" value={courseDescription} onChange={setCourseDescription}
                        icon={<FileText size={16} strokeWidth={2} />} rows={3}
                        error={errsFor("courseDescription")} valid={validFor("courseDescription")}
                        onBlur={() => touch("courseDescription")} />
                      <FloatLabel id="targetAudience" label="Target Audience" value={targetAudience} onChange={setTargetAudience}
                        icon={<Target size={16} strokeWidth={2} />} placeholder="e.g. Mid-level backend engineers"
                        error={errsFor("targetAudience")} valid={validFor("targetAudience")}
                        autoComplete="off" onBlur={() => touch("targetAudience")} />
                      <FloatLabel id="estimatedDuration" label="Estimated Duration" value={estimatedDuration} onChange={setEstimatedDuration}
                        icon={<Clock size={16} strokeWidth={2} />} placeholder="e.g. 6 weeks, 20 hours"
                        error={errsFor("estimatedDuration")} valid={validFor("estimatedDuration")}
                        autoComplete="off" onBlur={() => touch("estimatedDuration")} />
                    </div>
                  )}

                  {step === 4 && (
                    <div key="step4" style={{ animation: "biFadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both" }}>
                      <AgreeCheckbox id="agreeTerms" checked={agreeTerms} onChange={v => { setAgreeTerms(v); touch("agreeTerms"); }} error={errsFor("agreeTerms")}>
                        I agree to XERXEZ Academy terms and revenue sharing policy
                      </AgreeCheckbox>
                      <AgreeCheckbox id="confirmRights" checked={confirmRights} onChange={v => { setConfirmRights(v); touch("confirmRights"); }} error={errsFor("confirmRights")}>
                        I confirm I own the rights to all course content I will upload
                      </AgreeCheckbox>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 4, marginBottom: 4 }}>
                        <ShieldCheck size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 11.5, color: "#9ca3af", fontFamily: FF, lineHeight: 1.5 }}>
                          Your application is reviewed by our team before any account or revenue terms are finalized.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step nav */}
                  <div style={{ display: "flex", gap: 10, marginTop: 6, animation: "biFadeUp 0.38s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}>
                    {step >= 1 && (
                      <button type="button" onClick={goBack} style={{
                        flex: "0 0 auto", height: 52, padding: "0 18px", borderRadius: 12,
                        border: "1.5px solid rgba(0,0,0,0.13)", background: WHITE, color: "#6b7280",
                        fontSize: 14, fontWeight: 700, fontFamily: FF, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <ChevronLeft size={16} /> Back
                      </button>
                    )}
                    <div style={{ flex: 1 }}>
                      {step < STEP_LABELS.length
                        ? <SubmitBtn loading={false} label="Continue" onClick={goNext} />
                        : <SubmitBtn loading={loading} label="Submit Application" />}
                    </div>
                  </div>
                </form>

                {/* Footer links */}
                <div style={{ marginTop: 18, textAlign: "center", animation: "biFadeUp 0.38s cubic-bezier(0.22,1,0.36,1) 0.65s both" }}>
                  <div style={{ fontSize: 12.5, color: "#6b7280", fontFamily: FF, marginBottom: 8 }}>
                    Already have an account?{" "}
                    <Link to="/lma/login" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
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

// ── Submit / Continue button (extracted to avoid hook rules issues) ──────────
function SubmitBtn({ loading, label = "Submit Application", onClick }: {
  loading: boolean; label?: string; onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  const off = loading;

  let boxShadow = `0 4px 0 ${GOLD_DEEP}, 0 6px 20px rgba(217,53,34,0.28)`;
  if (off) boxShadow = "none";
  else if (hov) boxShadow = `0 6px 0 ${GOLD_DEEP}, 0 10px 28px rgba(217,53,34,0.35)`;

  return (
    <button
      type={onClick ? "button" : "submit"} disabled={off}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", height: 52, borderRadius: 12, border: "none",
        background: off ? "#e5e7eb" : GOLD_G,
        color: off ? "#9ca3af" : WHITE,
        fontSize: 15, fontWeight: 700, fontFamily: FF,
        cursor: off ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
        boxShadow,
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
          animation: "biShimmer 0.6s ease",
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
        <>{label} <ChevronRight size={16} /></>
      )}
    </button>
  );
}
