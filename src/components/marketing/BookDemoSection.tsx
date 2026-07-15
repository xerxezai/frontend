import { useState } from "react";
import apiService from "../../services/api";

const OG    = "#C9883A";
const OG_G  = "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)";
const DBG   = "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)";
const FF    = "'DM Sans',sans-serif";

const INDUSTRIES = ["Engineering & EPC", "Oil & Gas", "Construction", "Manufacturing", "Facilities Management", "Other"];

const BULLETS = [
  "No commitment required",
  "Live ERP module walkthrough",
  "UAE-based support team",
];

interface FormState {
  fullName: string; company: string; industry: string; phone: string; email: string;
}
const EMPTY: FormState = { fullName: "", company: "", industry: "", phone: "", email: "" };

/** Homepage "Book a Demo" section — sits just above the footer. Submits to the
 *  same /contact/ endpoint ContactSection2.tsx uses, so leads land as real
 *  ContactMessage rows and trigger the existing admin/auto-reply emails. */
const BookDemoSection = () => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.company.trim() || !form.industry || !form.phone.trim() || !form.email.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const result = await apiService.post("/contact/", {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        company: form.company,
        service: "AI-Powered ERP",
        subject: `Demo Request — ${form.industry}`,
        message: `Homepage "Book a Demo" request.\nIndustry: ${form.industry}`,
      });
      if ((result as any).success) {
        setSent(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.08)", background: "#F8F7F4",
    color: "#1A1A1A", fontFamily: FF, fontSize: 14, outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: FF,
  };

  return (
    <section style={{ background: DBG, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: -80, left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row align-items-center g-5">
          {/* LEFT */}
          <div className="col-lg-6">
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(28px,3.5vw,44px)", lineHeight: 1.15, marginBottom: 18, fontFamily: FF, letterSpacing: "-0.02em" }}>
              Ready to See It in Action?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 16.5, lineHeight: 1.7, maxWidth: 480, marginBottom: 28, fontFamily: FF }}>
              Book a free 30-minute demo. We'll show you exactly how XERXEZ ERP works for Engineering & EPC companies in the UAE.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {BULLETS.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <i className="fas fa-check-circle" style={{ color: OG, fontSize: 15 }} />
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, fontFamily: FF }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — form card */}
          <div className="col-lg-6">
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              borderTop: `2px solid ${OG}`, borderRadius: 16, padding: "34px 30px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.20)",
            }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,222,128,0.14)", border: "1px solid rgba(74,222,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                    <i className="fas fa-check" style={{ color: "#4ade80", fontSize: 22 }} />
                  </div>
                  <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: FF, margin: 0 }}>
                    Thank you! We'll contact you within 24 hours to confirm your demo.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Your full name" style={fieldStyle} disabled={sending} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Company Name *</label>
                    <input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Company name" style={fieldStyle} disabled={sending} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Work Email *</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com" style={fieldStyle} disabled={sending} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Industry *</label>
                    <select value={form.industry} onChange={e => set("industry", e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }} disabled={sending}>
                      <option value="">Select your industry…</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Phone Number *</label>
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+971 XX XXX XXXX" style={fieldStyle} disabled={sending} />
                  </div>
                  {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 14, fontFamily: FF }}>{error}</p>}
                  <button type="submit" disabled={sending} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: OG_G, color: "#fff", fontWeight: 700, fontSize: 15,
                    padding: "14px 20px", borderRadius: 10, border: "none",
                    cursor: sending ? "wait" : "pointer", fontFamily: FF,
                    boxShadow: "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)",
                    opacity: sending ? 0.75 : 1,
                  }}>
                    {sending ? "Sending…" : <>Request My Free Demo <i className="far fa-arrow-right" style={{ fontSize: 13 }} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDemoSection;
