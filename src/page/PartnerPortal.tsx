import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../components/seo/SEO";

const FF = "'DM Sans',sans-serif";
const OG = "#C9883A";
const DARK = "#1a1208";
const CREAM = "#F8F7F4";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://backend-production-b9f2.up.railway.app/api/v1";
const EMAIL_KEY = "xerxez_partner_email";
const TOKEN_KEY = "xerxez_partner_token";

// Kept in sync with backend PACKAGE_CHOICES/COMMISSION_RATES (apps/partners/models.py)
// and ContactSection2.tsx's Plan Interest tiers.
const PACKAGES = [
  { value: "basic", label: "Basic", range: "10–50 employees", pct: 10 },
  { value: "professional", label: "Professional", range: "50–200 employees", pct: 20 },
  { value: "enterprise", label: "Enterprise", range: "200+ employees", pct: 30 },
];
const MODULES = [
  "Dashboard & Analytics", "CRM", "Sales", "Procurement", "Logistics",
  "Accounting", "HR & Payroll", "Document Management", "Project Management",
  "Asset Management", "QHSE", "MLM / Network",
];
const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  submitted: { label: "Submitted", bg: "#fff3e0", color: "#e65100" },
  contacted: { label: "Contacted", bg: "#dbeafe", color: "#1d4ed8" },
  won: { label: "Won", bg: "#d1fae5", color: "#065f46" },
  lost: { label: "Lost", bg: "#fee2e2", color: "#991b1b" },
};

interface Partner { id: number; full_name: string; email: string; total_leads: number; won_leads: number; total_commission: string; pending_commission: string; }
interface Lead {
  id: number; client_name: string; company: string; country: string; phone: string; email: string;
  package: string; modules_needed: string[]; notes: string; deal_value: string | null;
  commission_amount: string; status: string; created_at: string;
}

async function partnerFetch(path: string, options: RequestInit = {}) {
  const email = localStorage.getItem(EMAIL_KEY);
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_BASE}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(email ? { "X-Partner-Email": email } : {}),
      ...(token ? { "X-Partner-Token": token } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  return data;
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #E4DFD8", fontSize: 13.5, fontFamily: FF, color: "#141413",
  background: "#fafaf8", outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 700, color: "#5a5650",
  letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: FF,
};
const cardStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${OG}`,
  boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)", padding: "24px 28px", marginBottom: 24,
};

// ── login gate ──────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email.trim() || !token.trim()) { setError("Enter your email and access code."); return; }
    setLoading(true);
    setError("");
    try {
      const data = await partnerFetch("partners/login/", { method: "POST", body: JSON.stringify({ email, token }) });
      localStorage.setItem(EMAIL_KEY, data.email);
      localStorage.setItem(TOKEN_KEY, token);
      onSuccess();
    } catch (e: any) {
      setError(e.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(170deg,${DARK} 0%,#0f0a05 100%)`, padding: "60px 20px 50px", textAlign: "center" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,136,58,0.12)",
          border: "1px solid rgba(201,136,58,0.30)", borderRadius: 100, padding: "6px 18px", marginBottom: 18,
          fontFamily: FF, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: OG,
        }}>Partner Program</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(30px,4vw,44px)", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
          Partner Portal
        </h1>
        <p style={{ fontFamily: FF, fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>
          Log in with the email and access code from your approval email.
        </p>
      </div>
      <div style={{ flex: 1, background: CREAM, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ ...cardStyle, maxWidth: 420, width: "100%", marginBottom: 0 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} style={inputStyle} disabled={loading}
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Access Code</label>
            <input type="text" placeholder="From your approval email" value={token} style={inputStyle} disabled={loading}
              onChange={e => setToken(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: 13, fontFamily: FF, marginBottom: 14 }}>{error}</p>}
          <button onClick={submit} disabled={loading} style={{
            width: "100%", height: 48, background: loading ? "rgba(201,136,58,0.6)" : `linear-gradient(145deg,#e8a84e,${OG})`,
            color: "#fff", border: "none", borderRadius: 12, fontFamily: FF, fontWeight: 700, fontSize: 14,
            cursor: loading ? "wait" : "pointer",
          }}>
            {loading ? "Logging in…" : "Log In"}
          </button>
          <p style={{ textAlign: "center", fontFamily: FF, fontSize: 12.5, color: "#9b9690", marginTop: 18, marginBottom: 0 }}>
            Not a partner yet? <Link to="/contact" style={{ color: OG, fontWeight: 700, textDecoration: "none" }}>Apply here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── dashboard ─────────────────────────────────────────────────────────────
const EMPTY_LEAD = {
  client_name: "", company: "", country: "", phone: "", email: "",
  package: "", modules_needed: [] as string[], notes: "", deal_value: "",
};

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadForm, setLeadForm] = useState(EMPTY_LEAD);
  const [submitting, setSubmitting] = useState(false);
  const [calcValue, setCalcValue] = useState("");
  const [calcPackage, setCalcPackage] = useState("basic");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([partnerFetch("partners/me/"), partnerFetch("partners/leads/")])
      .then(([me, l]) => { setPartner(me); setLeads(Array.isArray(l) ? l : []); })
      .catch((e: any) => toast.error(e.message || "Could not load your data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const setField = (k: keyof typeof EMPTY_LEAD, v: any) => setLeadForm(f => ({ ...f, [k]: v }));
  const toggleModule = (m: string) => setField("modules_needed", leadForm.modules_needed.includes(m) ? leadForm.modules_needed.filter(x => x !== m) : [...leadForm.modules_needed, m]);

  const submitLead = async () => {
    if (!leadForm.client_name.trim()) { toast.error("Client name is required."); return; }
    if (!leadForm.package) { toast.error("Select a package."); return; }
    setSubmitting(true);
    try {
      await partnerFetch("partners/leads/", {
        method: "POST",
        body: JSON.stringify({ ...leadForm, deal_value: leadForm.deal_value || null }),
      });
      toast.success("Lead submitted!");
      setLeadForm(EMPTY_LEAD);
      load();
    } catch (e: any) {
      toast.error(e.message || "Could not submit lead");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(TOKEN_KEY);
    onLogout();
  };

  const calcPct = PACKAGES.find(p => p.value === calcPackage)?.pct || 0;
  const calcAmount = (parseFloat(calcValue) || 0) * (calcPct / 100);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: CREAM }}>
        <div className="spinner-border" style={{ color: OG }} role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: CREAM }}>
      <div style={{ background: `linear-gradient(170deg,${DARK} 0%,#0f0a05 100%)`, padding: "32px 20px" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: OG }}>Partner Portal</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#fff", margin: "4px 0 0" }}>
              Welcome, {partner?.full_name.split(" ")[0]}
            </h1>
          </div>
          <button onClick={logout} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
            padding: "9px 18px", color: "#fff", fontFamily: FF, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>
            <i className="fas fa-sign-out-alt" style={{ marginRight: 7 }} />Log Out
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: "28px 20px 60px" }}>
        {/* stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          {[
            { label: "Total Leads", value: partner?.total_leads ?? 0, color: OG },
            { label: "Won Leads", value: partner?.won_leads ?? 0, color: "#16a34a" },
            { label: "Commission Earned", value: `$${partner?.total_commission ?? "0"}`, color: "#16a34a" },
            { label: "Pending Commission", value: `$${partner?.pending_commission ?? "0"}`, color: "#e65100" },
          ].map(s => (
            <div key={s.label} style={{ ...cardStyle, flex: "1 1 200px", marginBottom: 0, padding: "18px 22px", borderTopColor: s.color }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", fontFamily: FF }}>{s.value}</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FF, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* lead submission form */}
          <div className="col-lg-6">
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#141413", margin: "0 0 16px" }}>Submit a Lead</h3>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Client Name *</label>
                <input value={leadForm.client_name} onChange={e => setField("client_name", e.target.value)} style={inputStyle} placeholder="John Smith" />
              </div>
              <div className="row g-2" style={{ marginBottom: 12 }}>
                <div className="col-6">
                  <label style={labelStyle}>Company</label>
                  <input value={leadForm.company} onChange={e => setField("company", e.target.value)} style={inputStyle} placeholder="Acme Corp" />
                </div>
                <div className="col-6">
                  <label style={labelStyle}>Country</label>
                  <input value={leadForm.country} onChange={e => setField("country", e.target.value)} style={inputStyle} placeholder="UAE" />
                </div>
              </div>
              <div className="row g-2" style={{ marginBottom: 12 }}>
                <div className="col-6">
                  <label style={labelStyle}>Phone</label>
                  <input value={leadForm.phone} onChange={e => setField("phone", e.target.value)} style={inputStyle} placeholder="+971…" />
                </div>
                <div className="col-6">
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={leadForm.email} onChange={e => setField("email", e.target.value)} style={inputStyle} placeholder="client@company.com" />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Package Interested In *</label>
                <select value={leadForm.package} onChange={e => setField("package", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select package…</option>
                  {PACKAGES.map(p => <option key={p.value} value={p.value}>{p.label} ({p.range})</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Modules Needed</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {MODULES.map(m => {
                    const selected = leadForm.modules_needed.includes(m);
                    return (
                      <button type="button" key={m} onClick={() => toggleModule(m)} style={{
                        display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 16,
                        border: `1.5px solid ${selected ? OG : "#E4DFD8"}`, background: selected ? "rgba(201,136,58,0.10)" : "#fafaf8",
                        color: selected ? OG : "#5a5650", fontFamily: FF, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                      }}>
                        <i className={selected ? "fas fa-check-circle" : "far fa-circle"} style={{ fontSize: 9 }} />{m}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Estimated Deal Value ($)</label>
                <input type="number" value={leadForm.deal_value} onChange={e => setField("deal_value", e.target.value)} style={inputStyle} placeholder="50000" />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Notes</label>
                <textarea rows={3} value={leadForm.notes} onChange={e => setField("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} placeholder="Any relevant context…" />
              </div>
              <button onClick={submitLead} disabled={submitting} style={{
                width: "100%", height: 46, background: submitting ? "rgba(201,136,58,0.6)" : `linear-gradient(145deg,#e8a84e,${OG})`,
                color: "#fff", border: "none", borderRadius: 10, fontFamily: FF, fontWeight: 700, fontSize: 13.5,
                cursor: submitting ? "wait" : "pointer",
              }}>
                {submitting ? "Submitting…" : "Submit Lead"}
              </button>
            </div>
          </div>

          {/* right column */}
          <div className="col-lg-6">
            {/* commission calculator */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#141413", margin: "0 0 16px" }}>Commission Calculator</h3>
              <div className="row g-2" style={{ marginBottom: 14 }}>
                <div className="col-6">
                  <label style={labelStyle}>Deal Value ($)</label>
                  <input type="number" value={calcValue} onChange={e => setCalcValue(e.target.value)} style={inputStyle} placeholder="50000" />
                </div>
                <div className="col-6">
                  <label style={labelStyle}>Package</label>
                  <select value={calcPackage} onChange={e => setCalcPackage(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    {PACKAGES.map(p => <option key={p.value} value={p.value}>{p.label} ({p.pct}%)</option>)}
                  </select>
                </div>
              </div>
              <div style={{ background: "rgba(201,136,58,0.08)", border: "1.5px solid rgba(201,136,58,0.30)", borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
                <div style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "#8B5E1A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                  Estimated Commission ({calcPct}%)
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: OG }}>
                  ${calcAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* package reference */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#141413", margin: "0 0 16px" }}>Package Reference</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PACKAGES.map(p => (
                  <div key={p.value} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafaf8", border: "1px solid #F0EBE4", borderRadius: 10, padding: "12px 16px" }}>
                    <div>
                      <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 14, color: "#141413" }}>{p.label}</div>
                      <div style={{ fontFamily: FF, fontSize: 12, color: "#9b9690" }}>{p.range} · All 12 XERXEZ modules included</div>
                    </div>
                    <span style={{ fontFamily: FF, fontWeight: 800, fontSize: 16, color: OG }}>{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* support */}
            <a href="mailto:info@xerxez.com" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9, textDecoration: "none",
              background: "#fff", border: `1.5px solid ${OG}`, borderRadius: 12, padding: "13px 20px",
              color: OG, fontFamily: FF, fontWeight: 700, fontSize: 13.5,
            }}>
              <i className="fas fa-headset" />Contact XERXEZ Support
            </a>
          </div>
        </div>

        {/* leads table */}
        <div style={{ ...cardStyle, marginTop: 24, marginBottom: 0 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#141413", margin: "0 0 16px" }}>Your Leads</h3>
          {leads.length === 0 ? (
            <p style={{ fontFamily: FF, fontSize: 13.5, color: "#9b9690", textAlign: "center", padding: "24px 0" }}>No leads submitted yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, fontFamily: FF }}>
                <thead>
                  <tr style={{ background: "#fafaf8" }}>
                    {["Client", "Package", "Deal Value", "Commission", "Status", "Date"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10.5, fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F0EBE4", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => {
                    const s = STATUS_LABEL[l.status] ?? { label: l.status, bg: "#f1f5f9", color: "#64748b" };
                    return (
                      <tr key={l.id}>
                        <td style={{ padding: "9px 12px", borderBottom: "1px solid #F5F2ED" }}>
                          <div style={{ fontWeight: 700, color: "#141413" }}>{l.client_name}</div>
                          {l.company && <div style={{ fontSize: 11, color: "#9b9690" }}>{l.company}</div>}
                        </td>
                        <td style={{ padding: "9px 12px", borderBottom: "1px solid #F5F2ED", textTransform: "capitalize" }}>{l.package}</td>
                        <td style={{ padding: "9px 12px", borderBottom: "1px solid #F5F2ED" }}>{l.deal_value ? `$${l.deal_value}` : "—"}</td>
                        <td style={{ padding: "9px 12px", borderBottom: "1px solid #F5F2ED", fontWeight: 700, color: OG }}>${l.commission_amount}</td>
                        <td style={{ padding: "9px 12px", borderBottom: "1px solid #F5F2ED" }}>
                          <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>
                        </td>
                        <td style={{ padding: "9px 12px", borderBottom: "1px solid #F5F2ED", whiteSpace: "nowrap" }}>{new Date(l.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────
const PartnerPortal = () => {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(EMAIL_KEY) && !!localStorage.getItem(TOKEN_KEY));

  return (
    <>
      <SEO title="Partner Portal | XERXEZ" description="XERXEZ Partner Portal — submit leads and track your commission." canonical="/partner-portal" noIndex />
      {authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <LoginForm onSuccess={() => setAuthed(true)} />}
    </>
  );
};

export default PartnerPortal;
