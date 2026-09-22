import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Handshake, MousePointerClick, Users, Wallet, TrendingUp, Copy, Check,
  LogOut, Share2, Building2, Globe, CreditCard, Save,
} from "lucide-react";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const GREEN = "#10b981";
const DARK = "#071a33";
const FF = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06)";

interface AffiliateData {
  id: number; full_name: string; email: string; affiliate_code: string;
  company_name: string; website: string; status: string; commission_rate: string;
  total_clicks: number; total_conversions: number; total_earnings: string;
  bank_details: Record<string, string>;
}
interface Commission {
  id: number; course_title: string; commission_amount: string; status: string; created_at: string;
}
interface LinkCourse { id: number; title: string; price: string }

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8,
  border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: FF, outline: "none",
};

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#141413", fontFamily: FF }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2, fontFamily: FF }}>{label}</div>
    </div>
  );
}

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#D93522" },
  approved: { bg: "#dbeafe", color: "#2563eb" },
  paid: { bg: "#d1fae5", color: "#059669" },
};

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [links, setLinks] = useState<LinkCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [bank, setBank] = useState<Record<string, string>>({ account_holder: "", account_number: "", ifsc: "", bank_name: "" });
  const [savingBank, setSavingBank] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/affiliates/dashboard/`, { headers }).then(r => (r.ok ? r.json() : null)),
      fetch(`${API}/affiliates/links/`, { headers }).then(r => (r.ok ? r.json() : null)),
      fetch(`${API}/affiliates/commissions/`, { headers }).then(r => (r.ok ? r.json() : [])),
    ]).then(([dash, linksData, commissionsData]) => {
      if (dash) {
        setAffiliate(dash.affiliate);
        setPendingEarnings(Number(dash.pending_earnings) || 0);
        setBank({ account_holder: "", account_number: "", ifsc: "", bank_name: "", ...(dash.affiliate?.bank_details ?? {}) });
      }
      if (linksData) setLinks(linksData.courses ?? []);
      setCommissions(Array.isArray(commissionsData) ? commissionsData : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [token, navigate]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); }, [toast]);

  const copyLink = (courseId: number) => {
    if (!affiliate) return;
    const url = `${window.location.origin}/lma/courses/${courseId}?ref=${affiliate.affiliate_code}`;
    navigator.clipboard.writeText(url).then(() => { setCopiedId(courseId); setTimeout(() => setCopiedId(null), 1800); });
  };

  const shareLink = (courseId: number, title: string, via: "whatsapp" | "linkedin") => {
    if (!affiliate) return;
    const url = `${window.location.origin}/lma/courses/${courseId}?ref=${affiliate.affiliate_code}`;
    const href = via === "whatsapp"
      ? `https://wa.me/?text=${encodeURIComponent(`Check out "${title}" on XERXEZ Academy: ${url}`)}`
      : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const saveBank = async () => {
    setSavingBank(true);
    try {
      const r = await fetch(`${API}/affiliates/bank-details/`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ bank_details: bank }),
      });
      if (r.ok) setToast("Bank details saved.");
    } catch { /* ignore */ } finally { setSavingBank(false); }
  };

  const logout = () => { localStorage.removeItem("lma_token"); localStorage.removeItem("lma_refresh"); navigate("/lma/login"); };

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#F4F7FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "3px solid rgba(217,53,34,0.2)", borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "aff-spin 0.8s linear infinite" }} />
      <style>{`@keyframes aff-spin{to{transform:rotate(360deg)}}`}</style>
    </div>;
  }

  if (!affiliate) {
    return <div style={{ minHeight: "100vh", background: "#F4F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FF }}>
      <p style={{ color: "#6b7280" }}>No affiliate profile found for this account.</p>
    </div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FA", fontFamily: FF }}>
      <header style={{ background: DARK, padding: "18px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(217,53,34,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Handshake size={17} color={GOLD} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{affiliate.full_name}</div>
          <div style={{ color: GOLD, fontSize: 11.5, fontWeight: 700 }}>Affiliate · {affiliate.affiliate_code}</div>
        </div>
        <button type="button" onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>
          <LogOut size={13} /> Logout
        </button>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 60px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
          <StatCard label="Total Clicks" value={affiliate.total_clicks.toLocaleString()} icon={MousePointerClick} color="#3b82f6" />
          <StatCard label="Conversions" value={affiliate.total_conversions.toLocaleString()} icon={Users} color="#10b981" />
          <StatCard label="Pending Earnings" value={`₹${pendingEarnings.toLocaleString()}`} icon={TrendingUp} color={GOLD} />
          <StatCard label="Total Earned" value={`₹${Number(affiliate.total_earnings).toLocaleString()}`} icon={Wallet} color="#8b5cf6" />
        </div>

        {/* My Links */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>My Links</h3>
          {links.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13, fontFamily: FF }}>No published courses to promote yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#f9f7f4", borderRadius: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>/lma/courses/{c.id}?ref={affiliate.affiliate_code}</div>
                  </div>
                  <button type="button" onClick={() => copyLink(c.id)} style={{ display: "flex", alignItems: "center", gap: 5, background: copiedId === c.id ? GREEN : "#fff", color: copiedId === c.id ? "#fff" : "#141413", border: "1.5px solid " + (copiedId === c.id ? GREEN : "rgba(0,0,0,0.12)"), borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>
                    {copiedId === c.id ? <Check size={13} /> : <Copy size={13} />} {copiedId === c.id ? "Copied" : "Copy"}
                  </button>
                  <button type="button" onClick={() => shareLink(c.id, c.title, "whatsapp")} style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>WhatsApp</button>
                  <button type="button" onClick={() => shareLink(c.id, c.title, "linkedin")} style={{ display: "flex", alignItems: "center", gap: 5, background: "#0a66c2", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>
                    <Share2 size={12} /> LinkedIn
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }} className="aff-2col">
          {/* Commissions */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 16px" }}>Commissions</h3>
            {commissions.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: 13, fontFamily: FF }}>No commissions yet — share your links to start earning.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      {["Course", "Amount", "Status", "Date"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map(c => (
                      <tr key={c.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                        <td style={{ padding: "10px", fontSize: 12.5, color: "#141413", fontWeight: 600 }}>{c.course_title}</td>
                        <td style={{ padding: "10px", fontSize: 12.5, fontWeight: 700, color: GOLD }}>₹{Number(c.commission_amount).toLocaleString()}</td>
                        <td style={{ padding: "10px" }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 999, ...STATUS_COLOR[c.status] }}>{c.status}</span>
                        </td>
                        <td style={{ padding: "10px", fontSize: 11.5, color: "#9ca3af" }}>{new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bank details + profile */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 7 }}>
                <CreditCard size={15} color={GOLD} /> Bank Details for Payout
              </h3>
              {(["account_holder", "account_number", "ifsc", "bank_name"] as const).map(k => (
                <input key={k} style={{ ...inputStyle, marginBottom: 8 }} placeholder={k.replace("_", " ")}
                  value={bank[k] ?? ""} onChange={e => setBank(b => ({ ...b, [k]: e.target.value }))} />
              ))}
              <button type="button" onClick={saveBank} disabled={savingBank} style={{ display: "flex", alignItems: "center", gap: 6, background: GOLD, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FF, opacity: savingBank ? 0.7 : 1 }}>
                <Save size={13} /> {savingBank ? "Saving…" : "Save"}
              </button>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: BCARD }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#141413", margin: "0 0 14px" }}>Profile</h3>
              <div style={{ fontSize: 12.5, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}><Users size={13} color="#9ca3af" /> {affiliate.full_name}</div>
              <div style={{ fontSize: 12.5, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}><Building2 size={13} color="#9ca3af" /> {affiliate.company_name || "—"}</div>
              <div style={{ fontSize: 12.5, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 7 }}><Globe size={13} color="#9ca3af" /> {affiliate.website || "—"}</div>
              <div style={{ fontSize: 12.5, color: "#374151", display: "flex", alignItems: "center", gap: 7 }}>Commission rate: <strong>{affiliate.commission_rate}%</strong></div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#059669", color: "#fff", padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>{toast}</div>
      )}
      <style>{`@media (max-width: 900px) { .aff-2col { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
