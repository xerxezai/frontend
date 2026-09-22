import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Handshake, ShieldAlert, Check, X, MousePointerClick, TrendingUp, Edit3 } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const FF = "'DM Sans', sans-serif";

interface AffiliateRow {
  id: number; full_name: string; email: string; affiliate_code: string;
  company_name: string; website: string; promotion_method: string; audience_size: string;
  status: "pending" | "approved" | "rejected"; commission_rate: string;
  total_clicks: number; total_conversions: number; total_earnings: string; created_at: string;
}

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#D93522" },
  approved: { bg: "#d1fae5", color: "#059669" },
  rejected: { bg: "#fee2e2", color: "#dc2626" },
};

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{ height: 12, borderRadius: 6, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
      </td>
    ))}
  </tr>
);

export default function LMAAdminAffiliates() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [rows, setRows] = useState<AffiliateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [acting, setActing] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AffiliateRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rateTarget, setRateTarget] = useState<AffiliateRow | null>(null);
  const [rateInput, setRateInput] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true); setForbidden(false);
    const qs = statusFilter !== "all" ? `?status=${statusFilter}` : "";
    fetch(`${API}/affiliates/admin/list/${qs}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 403) { setForbidden(true); return null; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { if (d) setRows(Array.isArray(d) ? d : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const approve = async (row: AffiliateRow) => {
    setActing(row.id);
    try {
      const r = await fetch(`${API}/affiliates/admin/${row.id}/approve/`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (!r.ok) { setToast({ msg: d.error || "Approve failed", type: "error" }); return; }
      setToast({ msg: `${row.affiliate_code} approved — login email sent.`, type: "success" });
      setRows(prev => prev.map(x => (x.id === row.id ? { ...x, status: "approved" } : x)));
    } catch { setToast({ msg: "Network error", type: "error" }); } finally { setActing(null); }
  };

  const reject = async () => {
    if (!rejectTarget) return;
    setActing(rejectTarget.id);
    try {
      const r = await fetch(`${API}/affiliates/admin/${rejectTarget.id}/reject/`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });
      const d = await r.json();
      if (!r.ok) { setToast({ msg: d.error || "Reject failed", type: "error" }); return; }
      setToast({ msg: `${rejectTarget.affiliate_code} rejected.`, type: "success" });
      setRows(prev => prev.map(x => (x.id === rejectTarget.id ? { ...x, status: "rejected" } : x)));
      setRejectTarget(null); setRejectReason("");
    } catch { setToast({ msg: "Network error", type: "error" }); } finally { setActing(null); }
  };

  const saveRate = async () => {
    if (!rateTarget) return;
    const rate = Number(rateInput);
    if (Number.isNaN(rate) || rate < 0 || rate > 100) { setToast({ msg: "Enter a rate between 0 and 100.", type: "error" }); return; }
    setActing(rateTarget.id);
    try {
      const r = await fetch(`${API}/affiliates/admin/${rateTarget.id}/commission/`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ commission_rate: rate }),
      });
      const d = await r.json();
      if (!r.ok) { setToast({ msg: d.error || "Update failed", type: "error" }); return; }
      setRows(prev => prev.map(x => (x.id === rateTarget.id ? { ...x, commission_rate: d.commission_rate } : x)));
      setToast({ msg: "Commission rate updated.", type: "success" });
      setRateTarget(null);
    } catch { setToast({ msg: "Network error", type: "error" }); } finally { setActing(null); }
  };

  if (forbidden) {
    return (
      <LMAStudentLayout>
        <div style={{ background: "#fff", borderRadius: 16, padding: "64px 24px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <ShieldAlert size={40} color="#dc2626" style={{ display: "block", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Access denied</h3>
          <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>This page is only available to admins.</p>
        </div>
      </LMAStudentLayout>
    );
  }

  return (
    <LMAStudentLayout>
      <div style={{ fontFamily: FF }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Affiliates</h2>
            <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.45)", margin: "4px 0 0", fontFamily: FF }}>Review applications, approve, and manage commission rates.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["pending", "approved", "rejected", "all"] as const).map(s => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)} style={{
                padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: FF,
                background: statusFilter === s ? GOLD : "#f3f4f6", color: statusFilter === s ? "#fff" : "#6b7280",
              }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Affiliate", "Promotion", "Performance", "Commission", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "56px 16px", textAlign: "center" }}>
                    <Handshake size={36} color="#d1d5db" style={{ display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>No affiliates in this view.</p>
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td style={{ padding: "12px 16px", maxWidth: 220 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{r.full_name}</div>
                      <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.45)" }}>{r.email}</div>
                      <div style={{ fontSize: 10.5, color: GOLD, fontWeight: 700, marginTop: 2 }}>{r.affiliate_code}</div>
                    </td>
                    <td style={{ padding: "12px 16px", maxWidth: 220 }}>
                      <div style={{ fontSize: 12, color: "#141413", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.promotion_method}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.audience_size}</div>
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 12, color: "#141413", display: "flex", alignItems: "center", gap: 5 }}><MousePointerClick size={11} color="#9ca3af" /> {r.total_clicks} clicks</div>
                      <div style={{ fontSize: 12, color: "#141413", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}><TrendingUp size={11} color="#9ca3af" /> {r.total_conversions} conv · ₹{Number(r.total_earnings).toLocaleString()}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button type="button" onClick={() => { setRateTarget(r); setRateInput(r.commission_rate); }} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "#141413", cursor: "pointer", fontFamily: FF }}>
                        {r.commission_rate}% <Edit3 size={11} />
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, ...STATUS_COLOR[r.status] }}>{r.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {r.status === "pending" ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button type="button" onClick={() => approve(r)} disabled={acting === r.id}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: acting === r.id ? "not-allowed" : "pointer", fontFamily: FF, opacity: acting === r.id ? 0.6 : 1 }}>
                            <Check size={13} /> Approve
                          </button>
                          <button type="button" onClick={() => { setRejectTarget(r); setRejectReason(""); }} disabled={acting === r.id}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8, border: "1.5px solid #dc2626", background: "transparent", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: acting === r.id ? "not-allowed" : "pointer", fontFamily: FF, opacity: acting === r.id ? 0.6 : 1 }}>
                            <X size={13} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 16, fontSize: 12.5, color: "rgba(20,20,19,0.45)", fontFamily: FF }}>
          <Link to="/lma/admin/affiliate-commissions" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>View all commissions →</Link>
        </p>
      </div>

      {rejectTarget && (
        <>
          <div onClick={() => !acting && setRejectTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 700 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 701, width: 400, padding: "28px 26px", background: "#fff", borderRadius: 18, borderTop: "3px solid #dc2626", boxShadow: "0 24px 80px rgba(0,0,0,0.20)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Reject {rejectTarget.affiliate_code}</h3>
            <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 16px", fontFamily: FF }}>Optional — the applicant will see this reason by email.</p>
            <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason (optional)…" autoFocus
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: FF, resize: "vertical", marginBottom: 16, outline: "none" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setRejectTarget(null)} disabled={acting !== null}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
              <button type="button" onClick={reject} disabled={acting !== null}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#fff", opacity: acting !== null ? 0.7 : 1 }}>
                {acting !== null ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </>
      )}

      {rateTarget && (
        <>
          <div onClick={() => !acting && setRateTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 700 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 701, width: 340, padding: "26px 24px", background: "#fff", borderRadius: 18, borderTop: `3px solid ${GOLD}`, boxShadow: "0 24px 80px rgba(0,0,0,0.20)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 16px", fontFamily: FF }}>Commission rate — {rateTarget.affiliate_code}</h3>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input type="number" min={0} max={100} step={0.5} value={rateInput} onChange={e => setRateInput(e.target.value)} autoFocus
                style={{ width: "100%", boxSizing: "border-box", padding: "10px 30px 10px 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 14, fontFamily: FF, outline: "none" }} />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }}>%</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setRateTarget(null)} disabled={acting !== null}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
              <button type="button" onClick={saveRate} disabled={acting !== null}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#fff", opacity: acting !== null ? 0.7 : 1 }}>
                {acting !== null ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 900,
          background: toast.type === "success" ? "#059669" : "#dc2626", color: "#fff",
          padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: FF,
          boxShadow: "0 10px 30px rgba(0,0,0,0.20)", display: "flex", alignItems: "center", gap: 8,
        }}>
          {toast.type === "success" ? <Check size={15} /> : <ShieldAlert size={15} />}
          {toast.msg}
        </div>
      )}
    </LMAStudentLayout>
  );
}
