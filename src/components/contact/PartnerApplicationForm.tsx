import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput, { isValidPhone } from "../common/PhoneInput";

// ── option lists ─────────────────────────────────────────────────────────────
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
  "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia",
  "Cameroon","Canada","Chad","Chile","China","Colombia","Costa Rica","Croatia","Cuba","Cyprus",
  "Czech Republic","Denmark","Djibouti","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia",
  "Ethiopia","Fiji","Finland","France","Gabon","Georgia","Germany","Ghana","Greece","Guatemala",
  "Guinea","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait",
  "Kyrgyzstan","Laos","Latvia","Lebanon","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico",
  "Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal",
  "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman",
  "Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland",
  "Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Seychelles",
  "Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea",
  "South Sudan","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tajikistan",
  "Tanzania","Thailand","Togo","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Venezuela","Vietnam","Yemen","Zambia","Zimbabwe","Other",
];
const LANGUAGES = ["English", "Arabic", "Hindi", "French", "Spanish", "Other"];
const MODULES = [
  "HR & Payroll", "CRM (Customer Management)", "Sales Management",
  "Procurement & Purchase Orders", "Document Management", "Logistics & Shipments",
  "Accounting & Finance", "Project Management", "Asset Management",
  "QHSE (Safety & Compliance)", "Full ERP Suite (All Modules)",
];
const YEARS_EXPERIENCE = ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
const ESTIMATED_DEALS = ["1-2 deals", "3-5 deals", "5-10 deals", "10+ deals"];

interface PF {
  fullName: string; email: string; phone: string; linkedin: string;
  country: string; city: string; targetMarket: string; languages: string[];
  profession: string; yearsExperience: string; modules: string[]; estimatedDeals: string;
  networkDescription: string; agreedToNda: boolean;
}
const EMPTY: PF = {
  fullName: "", email: "", phone: "", linkedin: "",
  country: "", city: "", targetMarket: "", languages: [],
  profession: "", yearsExperience: "", modules: [], estimatedDeals: "",
  networkDescription: "", agreedToNda: false,
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://backend-production-b9f2.up.railway.app/api/v1";

const PartnerApplicationForm = () => {
  const [form, setForm] = useState<PF>(EMPTY);
  const [foc, setFoc] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [btnHov, setBtnHov] = useState(false);

  const set = <K extends keyof PF>(k: K, v: PF[K]) => setForm(f => ({ ...f, [k]: v }));
  const toggleLanguage = (v: string) => set("languages", form.languages.includes(v) ? form.languages.filter(x => x !== v) : [...form.languages, v]);
  const toggleModule = (v: string) => set("modules", form.modules.includes(v) ? form.modules.filter(x => x !== v) : [...form.modules, v]);

  const fldBase = (name: string): React.CSSProperties => ({
    width: "100%", boxSizing: "border-box" as const,
    border: `1.5px solid ${foc === name ? "#C9883A" : "#E4DFD8"}`,
    borderRadius: 10, padding: "9px 14px 9px 44px",
    fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: "#141413",
    background: foc === name ? "#FFFDF9" : "#fafaf8",
    outline: "none", display: "block",
    transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
    boxShadow: foc === name ? "0 0 0 3px rgba(201,136,58,0.12)" : "none",
  });
  const selBase = (name: string): React.CSSProperties => ({ ...fldBase(name), cursor: "pointer" });
  const lbl: React.CSSProperties = {
    display: "block", fontFamily: "'DM Sans',sans-serif",
    fontSize: 11, fontWeight: 700, color: "#5a5650",
    letterSpacing: "0.07em", textTransform: "uppercase" as const, marginBottom: 5,
  };
  const InputBadge = ({ icon, active }: { icon: string; active: boolean }) => (
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: active ? "linear-gradient(145deg,#e8a84e,#C9883A)" : "linear-gradient(145deg,#e2ddd8,#ccc8c2)",
      boxShadow: active ? "0 3px 0 rgba(130,80,20,0.48)" : "0 2px 0 rgba(0,0,0,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background 200ms, box-shadow 200ms",
    }}>
      <i className={icon} style={{ color: "#fff", fontSize: 11 }} />
    </div>
  );
  const fw = (name: string, icon: string, el: React.ReactNode) => (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1 }}>
        <InputBadge icon={icon} active={foc === name} />
      </span>
      {el}
    </div>
  );
  const sectionHeader = (n: number, title: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%",
        background: "linear-gradient(145deg,#e8a84e,#C9883A)",
        boxShadow: "0 3px 0 rgba(130,80,20,0.50)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "#fff" }}>{n}</span>
      </div>
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: "#141413" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "#F0EBE4" }} />
    </div>
  );
  const chip = (selected: boolean) => ({
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 20,
    border: `1.5px solid ${selected ? "#C9883A" : "#E4DFD8"}`,
    background: selected ? "rgba(201,136,58,0.10)" : "#fafaf8",
    color: selected ? "#C9883A" : "#5a5650",
    fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600,
    cursor: sending ? "not-allowed" : "pointer",
    transition: "border-color 0.15s, background 0.15s, color 0.15s",
  } as React.CSSProperties);

  const handleSubmit = async () => {
    if (!form.fullName.trim()) { toast.error("Full name is required."); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Please enter a valid email address."); return; }
    if (!form.phone.trim() || !isValidPhone(form.phone)) { toast.error("Please enter a valid phone number with country code."); return; }
    if (!form.country) { toast.error("Please select your country."); return; }
    if (!form.city.trim()) { toast.error("Please enter your city."); return; }
    if (!form.targetMarket.trim()) { toast.error("Please enter which market/country you will sell in."); return; }
    if (form.languages.length === 0) { toast.error("Select at least one language."); return; }
    if (!form.profession.trim()) { toast.error("Please enter your current profession."); return; }
    if (!form.yearsExperience) { toast.error("Please select your years of B2B sales experience."); return; }
    if (form.modules.length === 0) { toast.error("Select at least one module."); return; }
    if (!form.estimatedDeals) { toast.error("Please select your estimated deals per month."); return; }
    if (form.networkDescription.trim().length < 100) { toast.error("Please describe your network in at least 100 characters."); return; }
    if (!form.agreedToNda) { toast.error("Please agree to maintain confidentiality to apply."); return; }

    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/partners/apply/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName, email: form.email, phone: form.phone, linkedin_url: form.linkedin,
          country: form.country, city: form.city, target_market: form.targetMarket, languages: form.languages,
          current_profession: form.profession, years_experience: form.yearsExperience,
          modules: form.modules, estimated_deals: form.estimatedDeals,
          network_description: form.networkDescription, agreed_to_nda: form.agreedToNda,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubmittedName(form.fullName.split(" ")[0] || form.fullName);
        setSubmittedEmail(form.email);
        setSent(true);
        setForm(EMPTY);
        toast.success("Application received!");
      } else {
        const firstErr = data && typeof data === "object"
          ? Object.values(data).flat().find((v): v is string => typeof v === "string")
          : null;
        toast.error(firstErr || data.message || "Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Network error — please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center", padding: "60px 20px",
        animation: "xzCtSuccessIn 0.55s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg,#22c55e,#4ade80)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px", boxShadow: "0 8px 32px rgba(34,197,94,0.30)",
          animation: "xzCtCheckPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
        }}>
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
            <path d="M7 16.5l6.5 6.5L25 10" stroke="#fff" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "xzCtCheckDraw 0.45s ease 0.55s forwards" }} />
          </svg>
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 700, color: "#141413", marginBottom: 14 }}>
          Application Received!
        </h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "#6B6B6B", lineHeight: 1.7, maxWidth: 380, marginBottom: 10 }}>
          Thank you{submittedName ? `, ${submittedName}` : ""}! We have received your partner application.
          Our team will review it and contact you at <strong style={{ color: "#141413" }}>{submittedEmail}</strong> within 48 hours.
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#9b9690", marginBottom: 22 }}>
          In the meantime, explore our ERP:
        </p>
        <Link
          to="/ai-erp"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            background: "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)", color: "#fff", textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
            padding: "13px 26px", borderRadius: 10,
            boxShadow: "0 4px 0 rgba(120,70,15,0.50), 0 8px 24px rgba(201,136,58,0.25)",
          }}
        >
          See XERXEZ ERP <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
        </Link>
      </div>
    );
  }

  return (
    <form method="POST" noValidate>
      {/* ① Personal Info */}
      <div style={{ marginBottom: 18 }}>
        {sectionHeader(1, "Personal Information")}
        <div className="row g-3">
          <div className="col-md-6">
            <label style={lbl}>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
            {fw("fullName", "fas fa-user",
              <input type="text" placeholder="John Smith" value={form.fullName} style={fldBase("fullName")} disabled={sending}
                onChange={e => set("fullName", e.target.value)} onFocus={() => setFoc("fullName")} onBlur={() => setFoc(null)} />
            )}
          </div>
          <div className="col-md-6">
            <label style={lbl}>Email Address <span style={{ color: "#ef4444" }}>*</span></label>
            {fw("email", "fas fa-envelope",
              <input type="email" placeholder="john@company.com" value={form.email} style={fldBase("email")} disabled={sending}
                onChange={e => set("email", e.target.value)} onFocus={() => setFoc("email")} onBlur={() => setFoc(null)} />
            )}
          </div>
          <div className="col-md-6">
            <label style={lbl}>Phone Number <span style={{ color: "#ef4444" }}>*</span></label>
            <PhoneInput value={form.phone} disabled={sending} onChange={v => set("phone", v)} />
          </div>
          <div className="col-md-6">
            <label style={lbl}>LinkedIn Profile</label>
            {fw("linkedin", "fab fa-linkedin",
              <input type="text" placeholder="linkedin.com/in/johnsmith" value={form.linkedin} style={fldBase("linkedin")} disabled={sending}
                onChange={e => set("linkedin", e.target.value)} onFocus={() => setFoc("linkedin")} onBlur={() => setFoc(null)} />
            )}
          </div>
        </div>
      </div>

      {/* ② Location & Market */}
      <div style={{ marginBottom: 18 }}>
        {sectionHeader(2, "Location & Market")}
        <div className="row g-3">
          <div className="col-md-6">
            <label style={lbl}>Country <span style={{ color: "#ef4444" }}>*</span></label>
            {fw("country", "fas fa-globe",
              <select value={form.country} style={selBase("country")} disabled={sending}
                onChange={e => set("country", e.target.value)} onFocus={() => setFoc("country")} onBlur={() => setFoc(null)}>
                <option value="">Select country…</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
          <div className="col-md-6">
            <label style={lbl}>City <span style={{ color: "#ef4444" }}>*</span></label>
            {fw("city", "fas fa-map-marker-alt",
              <input type="text" placeholder="Dubai" value={form.city} style={fldBase("city")} disabled={sending}
                onChange={e => set("city", e.target.value)} onFocus={() => setFoc("city")} onBlur={() => setFoc(null)} />
            )}
          </div>
          <div className="col-12">
            <label style={lbl}>Which market/country will you sell in? <span style={{ color: "#ef4444" }}>*</span></label>
            {fw("targetMarket", "fas fa-map-marked-alt",
              <input type="text" placeholder="e.g. Saudi Arabia, Egypt, India, UK…" value={form.targetMarket} style={fldBase("targetMarket")} disabled={sending}
                onChange={e => set("targetMarket", e.target.value)} onFocus={() => setFoc("targetMarket")} onBlur={() => setFoc(null)} />
            )}
          </div>
          <div className="col-12">
            <label style={lbl}>Languages Spoken <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {LANGUAGES.map(l => (
                <button type="button" key={l} disabled={sending} onClick={() => toggleLanguage(l)} style={chip(form.languages.includes(l))}>
                  <i className={form.languages.includes(l) ? "fas fa-check-circle" : "far fa-circle"} style={{ fontSize: 11 }} />
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ③ Sales Experience */}
      <div style={{ marginBottom: 18 }}>
        {sectionHeader(3, "Sales Experience")}
        <div className="row g-3">
          <div className="col-md-6">
            <label style={lbl}>Current Profession <span style={{ color: "#ef4444" }}>*</span></label>
            {fw("profession", "fas fa-briefcase",
              <input type="text" placeholder="e.g. Sales Manager, Business Development Consultant" value={form.profession} style={fldBase("profession")} disabled={sending}
                onChange={e => set("profession", e.target.value)} onFocus={() => setFoc("profession")} onBlur={() => setFoc(null)} />
            )}
          </div>
          <div className="col-md-6">
            <label style={lbl}>Years of B2B Sales Experience <span style={{ color: "#ef4444" }}>*</span></label>
            {fw("yearsExperience", "fas fa-chart-line",
              <select value={form.yearsExperience} style={selBase("yearsExperience")} disabled={sending}
                onChange={e => set("yearsExperience", e.target.value)} onFocus={() => setFoc("yearsExperience")} onBlur={() => setFoc(null)}>
                <option value="">Select experience…</option>
                {YEARS_EXPERIENCE.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            )}
          </div>
          <div className="col-12">
            <label style={lbl}>Which XERXEZ Modules Can You Sell? <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, padding: 14, background: "#fafaf8", border: "1.5px solid #E4DFD8", borderRadius: 10 }}>
              {MODULES.map(m => (
                <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, cursor: sending ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: "#5a5650" }}>
                  <input type="checkbox" checked={form.modules.includes(m)} disabled={sending} onChange={() => toggleModule(m)} style={{ accentColor: "#C9883A", width: 15, height: 15 }} />
                  {m}
                </label>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <label style={lbl}>Estimated Deals You Can Close Per Month <span style={{ color: "#ef4444" }}>*</span></label>
            {fw("estimatedDeals", "fas fa-handshake",
              <select value={form.estimatedDeals} style={selBase("estimatedDeals")} disabled={sending}
                onChange={e => set("estimatedDeals", e.target.value)} onFocus={() => setFoc("estimatedDeals")} onBlur={() => setFoc(null)}>
                <option value="">Select an option…</option>
                {ESTIMATED_DEALS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ④ About Your Network */}
      <div style={{ marginBottom: 18 }}>
        {sectionHeader(4, "About Your Network")}
        <label style={lbl}>Describe your network and why you want to partner with XERXEZ <span style={{ color: "#ef4444" }}>*</span></label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: 13, pointerEvents: "none", zIndex: 1 }}>
            <InputBadge icon="fas fa-comment-alt" active={foc === "networkDescription"} />
          </span>
          <textarea rows={5} placeholder="Tell us about your professional network, which companies you can approach for HR/Sales/Procurement software, and why you want to partner with XERXEZ…"
            value={form.networkDescription}
            style={{ ...fldBase("networkDescription"), padding: "9px 14px 9px 44px", resize: "vertical" as const, minHeight: 100 }}
            disabled={sending}
            onChange={e => set("networkDescription", e.target.value)}
            onFocus={() => setFoc("networkDescription")} onBlur={() => setFoc(null)} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: form.networkDescription.trim().length >= 100 ? "#22c55e" : "#b8b2ab" }}>
            {form.networkDescription.trim().length} / 100 min
          </span>
        </div>
      </div>

      {/* ⑤ Commission Agreement */}
      <div style={{ marginBottom: 18 }}>
        {sectionHeader(5, "Commission Agreement")}
        <div style={{
          background: "rgba(201,136,58,0.08)", border: "1.5px solid rgba(201,136,58,0.30)",
          borderRadius: 12, padding: "16px 20px", marginBottom: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <i className="fas fa-hand-holding-usd" style={{ color: "#C9883A", fontSize: 16 }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 700, color: "#141413" }}>Commission Structure (Confirmed)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {[
              { tier: "1-2 Modules Sold", pct: "10%" },
              { tier: "3-5 Modules Sold", pct: "20%" },
              { tier: "Full ERP Suite (All Modules)", pct: "30%" },
            ].map(row => (
              <div key={row.tier} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#fff", border: "1px solid rgba(201,136,58,0.20)", borderRadius: 8,
                padding: "9px 14px",
              }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600, color: "#5a5650" }}>{row.tier}</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 800, color: "#C9883A" }}>{row.pct} commission</span>
              </div>
            ))}
          </div>

          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              "Paid within 30 days of client payment",
              "No cap on earnings",
              "Full product training provided",
              "Demo support from XERXEZ team",
              "Marketing materials provided",
              "Higher modules sold = Higher commission earned",
            ].map(line => (
              <li key={line} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#5a5650" }}>
                <i className="fas fa-check" style={{ color: "#C9883A", fontSize: 10, marginTop: 4, flexShrink: 0 }} />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: sending ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: "#5a5650" }}>
          <input type="checkbox" checked={form.agreedToNda} disabled={sending} onChange={e => set("agreedToNda", e.target.checked)}
            style={{ accentColor: "#C9883A", width: 16, height: 16, marginTop: 1, flexShrink: 0 }} />
          I agree to maintain confidentiality about XERXEZ products, pricing, and client information. I understand the commission
          structure is 10% for 1-2 modules, 20% for 3-5 modules, and 30% for the full ERP suite. <span style={{ color: "#ef4444" }}>*</span>
        </label>
      </div>

      {/* submit */}
      <button type="button" onClick={handleSubmit} disabled={sending}
        onMouseEnter={() => setBtnHov(true)} onMouseLeave={() => setBtnHov(false)}
        style={{
          width: "100%", height: 52,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          background: sending ? "rgba(201,136,58,0.55)" : "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)",
          color: "#fff", fontFamily: "'DM Sans',sans-serif",
          fontSize: 14.5, fontWeight: 700, letterSpacing: "0.02em",
          border: "none", borderRadius: 12,
          cursor: sending ? "not-allowed" : "pointer",
          opacity: sending ? 0.88 : 1,
          boxShadow: btnHov && !sending
            ? "0 7px 0 rgba(120,70,15,0.55), 0 14px 36px rgba(201,136,58,0.35)"
            : "0 4px 0 rgba(120,70,15,0.50), 0 8px 24px rgba(201,136,58,0.25)",
          transform: btnHov && !sending ? "translateY(-3px)" : "translateY(0)",
          transition: "transform 200ms cubic-bezier(0.22,1,0.36,1), box-shadow 200ms ease, background 180ms",
        }}
      >
        {sending ? (
          <>
            <svg width="15" height="15" viewBox="0 0 18 18" style={{ animation: "xzCtSpin 1s linear infinite", flexShrink: 0 }}>
              <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <path d="M9 2a7 7 0 0 1 7 7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Submitting…
          </>
        ) : (
          <>Apply to Become a Partner <i className="fas fa-arrow-right" style={{ fontSize: 13 }} /></>
        )}
      </button>
      <p style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#b8b2ab", margin: "12px 0 0" }}>
        We review all applications within 48 hours and will contact you via email.
      </p>
    </form>
  );
};

export default PartnerApplicationForm;
