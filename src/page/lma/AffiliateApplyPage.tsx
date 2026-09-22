import { useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, Check, ArrowRight, Building2, Globe, Users, Megaphone } from "lucide-react";
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

export default function AffiliateApplyPage() {
  const [form, setForm] = useState({
    full_name: "", email: "", affiliate_code: "", company_name: "",
    website: "", promotion_method: "", audience_size: AUDIENCE_SIZES[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    if (!form.full_name.trim() || !form.email.trim() || !form.affiliate_code.trim() || !form.promotion_method.trim()) {
      setError("Please fill in all required fields."); return;
    }
    if (!/^[A-Za-z0-9]{3,20}$/.test(form.affiliate_code.trim())) {
      setError("Affiliate code must be 3-20 letters/numbers, e.g. LINUXFOUNDATION."); return;
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

          <Field label="Full Name *">
            <input style={inputStyle} value={form.full_name} onChange={e => set("full_name", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="Jane Doe" />
          </Field>
          <Field label="Email *">
            <input type="email" style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="jane@example.com" />
          </Field>
          <Field label="Affiliate Code * — this becomes your link, e.g. xerxez.com/lma/courses/1?ref=CODE">
            <input style={{ ...inputStyle, textTransform: "uppercase" }} value={form.affiliate_code} onChange={e => set("affiliate_code", e.target.value.toUpperCase())} onFocus={focusGold} onBlur={blurGold} placeholder="LINUXFOUNDATION" maxLength={20} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Company / Organization">
              <div style={{ position: "relative" }}>
                <Building2 size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input style={{ ...inputStyle, paddingLeft: 34 }} value={form.company_name} onChange={e => set("company_name", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="Optional" />
              </div>
            </Field>
            <Field label="Website">
              <div style={{ position: "relative" }}>
                <Globe size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input style={{ ...inputStyle, paddingLeft: 34 }} value={form.website} onChange={e => set("website", e.target.value)} onFocus={focusGold} onBlur={blurGold} placeholder="https://" />
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

          <button type="button" onClick={submit} disabled={submitting} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: `linear-gradient(135deg,${GOLD},#b32a1a)`, color: "#fff", border: "none",
            borderRadius: 11, padding: "13px", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
            marginTop: 8, opacity: submitting ? 0.7 : 1, fontFamily: FF,
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
