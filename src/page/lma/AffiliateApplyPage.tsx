import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Handshake, Check, X, ArrowRight, Building2, Globe, Users, Megaphone, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const DARK = "#071a33";
const DARK2 = "#04101f";
const FF = "'DM Sans', sans-serif";

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)",
  color: "#fff", fontSize: 13.5, fontFamily: FF, outline: "none", transition: "border-color 0.15s ease",
};
const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = GOLD; };
const blurGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.14)"; };

const AUDIENCE_SIZES = ["Under 1,000", "1,000 - 10,000", "10,000 - 100,000", "100,000+"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: 6, fontFamily: FF }}>{label}</label>
      {children}
    </div>
  );
}

type CodeStatus = "idle" | "too_short" | "invalid_chars" | "checking" | "available" | "taken" | "check_failed";

export default function AffiliateApplyPage() {
  const [form, setForm] = useState({
    full_name: "", email: "", affiliate_code: "", company_name: "",
    website: "", promotion_method: "", audience_size: AUDIENCE_SIZES[0],
    password: "", confirm_password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Real-time affiliate-code availability — the applicant picks this
  // themselves (it's their brand/name, not assigned to them), so they need
  // to see right away whether their choice is free to take.
  const [codeStatus, setCodeStatus] = useState<CodeStatus>("idle");
  const codeCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeCheckId = useRef(0);

  useEffect(() => {
    const code = form.affiliate_code;
    if (codeCheckTimer.current) clearTimeout(codeCheckTimer.current);

    if (!code) { setCodeStatus("idle"); return; }
    if (code.length < 3) { setCodeStatus("too_short"); return; }
    if (!/^[A-Z0-9]+$/.test(code)) { setCodeStatus("invalid_chars"); return; }

    setCodeStatus("checking");
    const myCheckId = ++codeCheckId.current;
    codeCheckTimer.current = setTimeout(() => {
      fetch(`${API}/affiliates/check-code/?code=${encodeURIComponent(code)}`)
        .then(r => r.json())
        .then(d => {
          if (myCheckId !== codeCheckId.current) return; // a newer keystroke superseded this check
          setCodeStatus(d.available ? "available" : "taken");
        })
        .catch(() => { if (myCheckId === codeCheckId.current) setCodeStatus("check_failed"); });
    }, 400);

    return () => { if (codeCheckTimer.current) clearTimeout(codeCheckTimer.current); };
  }, [form.affiliate_code]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    if (!form.full_name.trim() || !form.email.trim() || !form.affiliate_code.trim() || !form.promotion_method.trim()) {
      setError("Please fill in all required fields."); return;
    }
    if (!/^[A-Za-z0-9]{3,20}$/.test(form.affiliate_code.trim())) {
      setError("Affiliate code must be 3-20 letters/numbers, e.g. LINUXFOUNDATION."); return;
    }
    if (codeStatus === "taken") {
      setError("That affiliate code is already taken — please choose another."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (form.password !== form.confirm_password) {
      setError("Passwords don't match."); return;
    }
    setSubmitting(true);
    try {
      const r = await fetch(`${API}/affiliates/apply/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, affiliate_code: form.affiliate_code.trim().toUpperCase() }),
      });
      const d = await r.json();
      if (!r.ok) { setError(Object.values(d).flat().join(" ") || "Something went wrong."); return; }
      setDone(true);
    } catch { setError("Network error — please try again."); } finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,${DARK} 0%,${DARK2} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: FF }}>
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={30} color="#10b981" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Application received</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.60)", lineHeight: 1.7, margin: "0 0 24px" }}>
            We'll review your affiliate application and get back to you at <strong style={{ color: "#fff" }}>{form.email}</strong> shortly.
          </p>
          <Link to="/lma/login" style={{ color: GOLD, fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}>← Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,${DARK} 0%,${DARK2} 100%)`, fontFamily: FF, padding: "60px 20px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(217,53,34,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Handshake size={26} color={GOLD} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>Become a XERXEZ Academy Affiliate</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>
            Promote our courses to your audience and earn commission on every enrollment.
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "32px 28px" }}>
          {error && (
            <div style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.30)", color: "#fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 18 }}>
              {error}
            </div>
          )}

          {/* Decoy fields — Chrome autofills the first text/password inputs
              it finds regardless of autoComplete="off"; these invisible
              ones absorb that instead of the real fields below. */}
          <input type="text" name="fake-username" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />
          <input type="password" name="fake-password" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />

          <Field label="Full Name *">
            <input style={inputStyle} value={form.full_name} onChange={e => set("full_name", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="Jane Doe" autoComplete="off" />
          </Field>
          <Field label="Email *">
            <input type="email" style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="jane@example.com" autoComplete="off" />
          </Field>
          <Field label="Choose Your Affiliate Code *">
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, textTransform: "uppercase", paddingRight: 36 }}
                value={form.affiliate_code}
                onChange={e => set("affiliate_code", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                onFocus={focusGold} onBlur={blurGold}
                placeholder="e.g. JOHNSMITH or LINUXFOUNDATION"
                maxLength={20}
              />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
                {codeStatus === "checking" && <Loader2 size={16} color="rgba(255,255,255,0.45)" style={{ animation: "aa-spin 0.7s linear infinite" }} />}
                {codeStatus === "available" && <Check size={16} color="#10b981" />}
                {(codeStatus === "taken" || codeStatus === "invalid_chars") && <X size={16} color="#ef4444" />}
              </span>
            </div>
            <style>{`@keyframes aa-spin { to { transform: rotate(360deg); } }`}</style>
            {codeStatus === "taken" && (
              <p style={{ fontSize: 11.5, color: "#f87171", margin: "6px 0 0" }}>❌ This code is already taken — try another.</p>
            )}
            {codeStatus === "available" && (
              <p style={{ fontSize: 11.5, color: "#34d399", margin: "6px 0 0" }}>✅ This code is available!</p>
            )}
            {codeStatus === "too_short" && (
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.40)", margin: "6px 0 0" }}>Minimum 3 characters.</p>
            )}
            {codeStatus === "check_failed" && (
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.40)", margin: "6px 0 0" }}>Couldn't check availability — we'll verify again on submit.</p>
            )}
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: "6px 0 0" }}>
              This will be your unique tracking code. Choose something memorable — your name, brand or company name. Only letters and numbers, no spaces.
            </p>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Password * — minimum 8 characters">
              <div style={{ position: "relative" }}>
                <Lock size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={showPw ? "text" : "password"} style={{ ...inputStyle, paddingLeft: 34, paddingRight: 34 }}
                  value={form.password} onChange={e => set("password", e.target.value)}
                  onFocus={focusGold} onBlur={blurGold} placeholder="At least 8 characters" autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: 4, display: "flex" }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.password.length > 0 && form.password.length < 8 && (
                <p style={{ fontSize: 11.5, color: "#f87171", margin: "6px 0 0" }}>Minimum 8 characters.</p>
              )}
            </Field>
            <Field label="Confirm Password *">
              <div style={{ position: "relative" }}>
                <Lock size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={showPw ? "text" : "password"} style={{ ...inputStyle, paddingLeft: 34 }}
                  value={form.confirm_password} onChange={e => set("confirm_password", e.target.value)}
                  onFocus={focusGold} onBlur={blurGold} placeholder="Re-enter your password" autoComplete="new-password"
                />
              </div>
              {form.confirm_password.length > 0 && form.password !== form.confirm_password && (
                <p style={{ fontSize: 11.5, color: "#f87171", margin: "6px 0 0" }}>Passwords don't match.</p>
              )}
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Company / Organization">
              <div style={{ position: "relative" }}>
                <Building2 size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input style={{ ...inputStyle, paddingLeft: 34 }} value={form.company_name} onChange={e => set("company_name", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="Optional" />
              </div>
            </Field>
            <Field label="Website (optional)">
              <div style={{ position: "relative" }}>
                <Globe size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input style={{ ...inputStyle, paddingLeft: 34 }} value={form.website} onChange={e => set("website", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="https://yourwebsite.com or leave blank" />
              </div>
            </Field>
          </div>
          <Field label="How will you promote our courses? *">
            <div style={{ position: "relative" }}>
              <Megaphone size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: 14 }} />
              <textarea rows={3} style={{ ...inputStyle, paddingLeft: 34, resize: "vertical" }} value={form.promotion_method} onChange={e => set("promotion_method", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="Newsletter, YouTube channel, community, blog…" />
            </div>
          </Field>
          <Field label="Audience Size">
            <div style={{ position: "relative" }}>
              <Users size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
              <select style={{ ...inputStyle, paddingLeft: 34, cursor: "pointer" }} value={form.audience_size} onChange={e => set("audience_size", e.target.value)}>
                {AUDIENCE_SIZES.map(s => <option key={s} value={s} style={{ background: DARK }}>{s}</option>)}
              </select>
            </div>
          </Field>

          <button type="button" onClick={submit} disabled={submitting || codeStatus === "checking" || codeStatus === "taken"} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: `linear-gradient(135deg,${GOLD},#b32a1a)`, color: "#fff", border: "none",
            borderRadius: 11, padding: "13px", fontSize: 14, fontWeight: 700,
            cursor: submitting || codeStatus === "checking" || codeStatus === "taken" ? "not-allowed" : "pointer",
            marginTop: 8, opacity: submitting || codeStatus === "checking" || codeStatus === "taken" ? 0.7 : 1, fontFamily: FF,
          }}>
            {submitting ? "Submitting…" : "Submit Application"} <ArrowRight size={15} />
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 12.5, color: "rgba(255,255,255,0.40)", marginTop: 20 }}>
          Already approved? <Link to="/lma/login" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
