import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Handshake, Check, X, ArrowRight, Building2, Globe, Megaphone, Loader2, Lock, Eye, EyeOff,
  FileEdit, ShieldCheck, TrendingUp, Link2, BarChart3, Wallet, CheckCircle2, MessageCircle,
  MousePointerClick, CreditCard, DollarSign,
} from "lucide-react";
import { V2_API_BASE as API, V2_HEADER_H } from "../../components/v2/01-core/v2theme";
import XerxezShell from "../../components/v2/02-layout/XerxezShell";

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

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

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
      <XerxezShell>
        <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,${DARK} 0%,${DARK2} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, paddingTop: V2_HEADER_H + 20, fontFamily: FF }}>
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
      </XerxezShell>
    );
  }

  return (
    <XerxezShell>
    <div style={{ fontFamily: FF }}>
      {/* ── Section 1 — Hero (dark navy) — unchanged ── */}
      <section style={{ background: `linear-gradient(160deg,${DARK} 0%,${DARK2} 100%)`, padding: `${V2_HEADER_H + 56}px 20px 56px` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(217,53,34,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Handshake size={26} color={GOLD} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>Become a XERXEZ Academy Affiliate</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 28px", lineHeight: 1.6 }}>
            Promote our courses to your audience and earn commission on every enrollment.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <button type="button" onClick={() => scrollToId("apply-form")} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg,${GOLD},#b32a1a)`, color: "#fff", border: "none",
              borderRadius: 11, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FF,
            }}>
              Apply Now <ArrowRight size={15} />
            </button>
            <button type="button" onClick={() => scrollToId("how-it-works")} style={{
              background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.35)",
              borderRadius: 11, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FF,
            }}>
              Learn How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 2 — How It Works (white) ── */}
      <section id="how-it-works" style={{ background: "#fff", padding: "72px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              How It Works
            </div>
            <h2 style={{ fontSize: "clamp(24px,3.4vw,32px)", fontWeight: 900, color: "#141413", margin: 0 }}>
              Simple, transparent process
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {[
              { icon: FileEdit, title: "Apply", desc: "Fill the application form below with your details and chosen affiliate code." },
              { icon: ShieldCheck, title: "Get Approved", desc: "Our team reviews your application within 48 hours and sends you login credentials." },
              { icon: TrendingUp, title: "Start Earning", desc: "Login to your affiliate dashboard, get your unique links and start promoting XERXEZ courses." },
            ].map((s, i) => (
              <div key={s.title} style={{ position: "relative", background: "#F4F7FA", borderRadius: 16, padding: "28px 24px 24px", border: "1px solid rgba(0,0,0,0.06)" }}>
                <span aria-hidden="true" style={{ position: "absolute", top: 10, right: 16, fontSize: 38, fontWeight: 900, color: "rgba(217,53,34,0.10)", lineHeight: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 8px 20px rgba(217,53,34,0.30)" }}>
                  <s.icon size={20} color="#fff" strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: "rgba(20,20,19,0.55)", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 — After Approval (light gray) ── */}
      <section style={{ background: "#F4F7FA", padding: "72px 20px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              After Approval
            </div>
            <h2 style={{ fontSize: "clamp(24px,3.4vw,32px)", fontWeight: 900, color: "#141413", margin: 0 }}>
              What happens when you're approved?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
            {[
              { icon: Lock, title: "Login", desc: "You'll receive login credentials via email. Login at xerxez.com/lma/login and select \"Affiliate\"." },
              { icon: Link2, title: "Get Your Links", desc: "Access your unique affiliate links for all XERXEZ courses from your dashboard." },
              { icon: BarChart3, title: "Track Performance", desc: "Monitor clicks, conversions and earnings in real time from your dashboard." },
              { icon: Wallet, title: "Get Paid", desc: "Add your bank details and earnings are paid monthly via bank transfer." },
            ].map(c => (
              <div key={c.title} style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(7,26,51,0.05)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(217,53,34,0.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <c.icon size={17} color={GOLD} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#141413", margin: "0 0 6px" }}>{c.title}</h3>
                <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.55)", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Affiliate Marketing Works (white) ── */}
      <section style={{ background: "#fff", padding: "72px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              How Affiliate Works
            </div>
            <h2 style={{ fontSize: "clamp(24px,3.4vw,32px)", fontWeight: 900, color: "#141413", margin: 0 }}>
              Share links. Students enroll. You earn.
            </h2>
          </div>

          {/* visual flow strip */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 48 }}>
            {["You share link", "Student clicks", "Student enrolls", "You earn commission"].map((label, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 12.5, fontWeight: 700, color: "#141413", background: "#F4F7FA",
                  border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, padding: "8px 16px", whiteSpace: "nowrap",
                }}>
                  {label}
                </span>
                {i < arr.length - 1 && <ArrowRight size={16} color={GOLD} style={{ flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          {/* detail cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              {
                icon: Link2, title: "You Get Unique Links",
                lines: [
                  "After approval you get a unique link for every XERXEZ course",
                  "Example: xerxez.com/lma/courses/1?ref=YOURCODE",
                  "Share on LinkedIn, WhatsApp, YouTube, Blog, Email",
                ],
              },
              {
                icon: MousePointerClick, title: "Student Clicks Your Link",
                lines: [
                  "When someone clicks your link — XERXEZ tracks it automatically",
                  "A tracking cookie is saved for 30 days",
                  "You get credit even if they don't enroll immediately",
                ],
              },
              {
                icon: CreditCard, title: "Student Enrolls & Pays",
                lines: [
                  "Student browses the course and decides to enroll",
                  "They pay for the course on XERXEZ",
                  "System automatically detects your referral",
                ],
              },
              {
                icon: DollarSign, title: "You Earn Commission",
                lines: [
                  "Commission is automatically calculated and added to your dashboard",
                  "You see pending earnings in real time",
                  "Paid monthly via bank transfer",
                ],
              },
            ].map(c => (
              <div key={c.title} style={{ background: "#F4F7FA", borderRadius: 14, padding: "22px 20px", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <c.icon size={17} color="#fff" strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#141413", margin: "0 0 10px" }}>{c.title}</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                  {c.lines.map(line => (
                    <li key={line} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, color: "rgba(20,20,19,0.58)", lineHeight: 1.55 }}>
                      <span style={{ color: GOLD, flexShrink: 0 }}>•</span>
                      <span style={{ fontFamily: line.startsWith("Example:") ? "monospace" : FF }}>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Commission (dark navy) ── */}
      <section style={{ background: `linear-gradient(160deg,${DARK} 0%,${DARK2} 100%)`, padding: "72px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
            Commission
          </div>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,32px)", fontWeight: 900, color: "#fff", margin: "0 0 18px" }}>
            Earn on every enrollment you refer
          </h2>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.60)", lineHeight: 1.75, margin: "0 0 32px" }}>
            Commission rates are discussed and agreed mutually between XERXEZ and each affiliate partner.
            We offer competitive rates based on your audience size, promotion method and performance.
          </p>
          <div style={{ display: "grid", gap: 14, textAlign: "left", maxWidth: 460, margin: "0 auto 24px" }}>
            {[
              "Competitive commission rates — discussed individually",
              "Monthly payouts via bank transfer",
              "Real-time earnings tracking in your dashboard",
            ].map(point => (
              <div key={point} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{point}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 999, padding: "8px 16px" }}>
            <MessageCircle size={13} color="rgba(255,255,255,0.45)" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Commission % is agreed during the approval process — not fixed upfront</span>
          </div>
        </div>

        {/* ── Application form — same section, same background, no seam ── */}
        <div id="apply-form" style={{ maxWidth: 560, margin: "56px auto 0", textAlign: "left", scrollMarginTop: 24 }}>
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
      </section>
    </div>
    </XerxezShell>
  );
}
