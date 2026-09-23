import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Handshake, ShieldAlert, Check, X, MousePointerClick, TrendingUp, Edit3,
  Eye, Trash2, Globe, Building2, Megaphone, Users2,
} from "lucide-react";
import AffiliateAdminShell from "./AffiliateAdminShell";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const FF = "'DM Sans', sans-serif";

interface AffiliateRow {
  id: number; full_name: string; email: string; affiliate_code: string;
  company_name: string; website: string; promotion_method: string; audience_size: string;
  status: "pending" | "approved" | "rejected"; commission_rate: string;
  total_clicks: number; total_conversions: number; total_earnings: string; created_at: string;
}

interface DetailCommission {
  id: number; course_title: string; student_name: string; student_email: string;
  course_price: string; commission_rate: string; commission_amount: string;
  status: "pending" | "approved" | "paid"; paid_at: string | null; created_at: string;
}

interface ClickByCourse { course_id: number; course_title: string; clicks: number; conversions: number }

interface AffiliateDetail {
  affiliate: AffiliateRow & { rejection_reason: string; approved_at: string | null };
  commissions: DetailCommission[];
  clicks_by_course: ClickByCourse[];
}

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#D93522" },
  approved: { bg: "#d1fae5", color: "#059669" },
  rejected: { bg: "#fee2e2", color: "#dc2626" },
  paid: { bg: "#d1fae5", color: "#059669" },
};

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 9 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{ height: 12, borderRadius: 6, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
      </td>
    ))}
  </tr>
);

const actionBtn = (color: string, filled = false): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 7,
  border: filled ? "none" : `1.5px solid ${color}`, background: filled ? color : "transparent",
  color: filled ? "#fff" : color, fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: FF,
});

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
  const [deleteTarget, setDeleteTarget] = useState<AffiliateRow | null>(null);
  const [viewTarget, setViewTarget] = useState<AffiliateRow | null>(null);
  const [viewDetail, setViewDetail] = useState<AffiliateDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
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

  const openView = (row: AffiliateRow) => {
    setViewTarget(row); setViewDetail(null); setViewLoading(true);
    fetch(`${API}/affiliates/admin/${row.id}/detail/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : null))
      .then(d => setViewDetail(d))
      .catch(() => {})
      .finally(() => setViewLoading(false));
  };

  const deleteAffiliate = async () => {
    if (!deleteTarget) return;
    setActing(deleteTarget.id);
    try {
      const r = await fetch(`${API}/affiliates/admin/${deleteTarget.id}/delete/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok && r.status !== 204) { const d = await r.json().catch(() => ({})); setToast({ msg: d.error || "Delete failed", type: "error" }); return; }
      setToast({ msg: `${deleteTarget.affiliate_code} deleted.`, type: "success" });
      setRows(prev => prev.filter(x => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch { setToast({ msg: "Network error", type: "error" }); } finally { setActing(null); }
  };

  if (forbidden) {
    return (
      <AffiliateAdminShell>
        <div style={{ background: "#fff", borderRadius: 16, padding: "64px 24px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
          <ShieldAlert size={40} color="#dc2626" style={{ display: "block", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Access denied</h3>
          <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>This page is only available to admins.</p>
        </div>
      </AffiliateAdminShell>
    );
  }

  return (
    <AffiliateAdminShell>
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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1180 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Email", "Code", "Rate", "Clicks", "Conversions", "Earnings", "Status", "Join Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: "56px 16px", textAlign: "center" }}>
                    <Handshake size={36} color="#d1d5db" style={{ display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>No affiliates in this view.</p>
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#141413", whiteSpace: "nowrap" }}>{r.full_name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "rgba(20,20,19,0.55)", whiteSpace: "nowrap" }}>{r.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: 11.5, color: GOLD, fontWeight: 700, whiteSpace: "nowrap" }}>{r.affiliate_code}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button type="button" onClick={() => { setRateTarget(r); setRateInput(r.commission_rate); }} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "#141413", cursor: "pointer", fontFamily: FF, whiteSpace: "nowrap" }}>
                        {r.commission_rate}% <Edit3 size={11} />
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#141413", whiteSpace: "nowrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MousePointerClick size={11} color="#9ca3af" /> {r.total_clicks}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#141413", whiteSpace: "nowrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}><TrendingUp size={11} color="#9ca3af" /> {r.total_conversions}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 700, color: GOLD, whiteSpace: "nowrap" }}>₹{Number(r.total_earnings).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap", ...STATUS_COLOR[r.status] }}>{r.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 11.5, color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button type="button" onClick={() => openView(r)} style={actionBtn("#2563eb")}><Eye size={12} /> View</button>
                        {r.status === "pending" && (
                          <>
                            <button type="button" onClick={() => approve(r)} disabled={acting === r.id} style={{ ...actionBtn("#059669", true), opacity: acting === r.id ? 0.6 : 1 }}>
                              <Check size={12} /> Approve
                            </button>
                            <button type="button" onClick={() => { setRejectTarget(r); setRejectReason(""); }} disabled={acting === r.id} style={{ ...actionBtn("#dc2626"), opacity: acting === r.id ? 0.6 : 1 }}>
                              <X size={12} /> Reject
                            </button>
                          </>
                        )}
                        <button type="button" onClick={() => setDeleteTarget(r)} disabled={acting === r.id} style={{ ...actionBtn("#dc2626"), opacity: acting === r.id ? 0.6 : 1 }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
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

      {/* Reject modal */}
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

      {/* Commission rate modal */}
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

      {/* Delete confirmation */}
      {deleteTarget && (
        <>
          <div onClick={() => !acting && setDeleteTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 700 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 701, width: 400, padding: "28px 26px", background: "#fff", borderRadius: 18, borderTop: "3px solid #dc2626", boxShadow: "0 24px 80px rgba(0,0,0,0.20)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Delete {deleteTarget.affiliate_code}?</h3>
            <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 20px", fontFamily: FF }}>
              This permanently removes {deleteTarget.full_name}'s affiliate account, along with its click and commission history. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setDeleteTarget(null)} disabled={acting !== null}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: "#6b7280" }}>Cancel</button>
              <button type="button" onClick={deleteAffiliate} disabled={acting !== null}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FF, color: "#fff", opacity: acting !== null ? 0.7 : 1 }}>
                {acting !== null ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* View detail panel */}
      {viewTarget && (
        <>
          <div onClick={() => setViewTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 700 }} />
          <div style={{
            position: "fixed", top: 0, right: 0, height: "100vh", width: "min(560px, 100vw)", zIndex: 701,
            background: "#F4F7FA", boxShadow: "-24px 0 60px rgba(0,0,0,0.25)", overflowY: "auto",
          }}>
            <div style={{ background: "#071a33", padding: "22px 24px", position: "sticky", top: 0, zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>{viewTarget.full_name}</div>
                  <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, marginTop: 2 }}>{viewTarget.affiliate_code}</div>
                </div>
                <button type="button" onClick={() => setViewTarget(null)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", color: "#fff" }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ padding: "22px 24px 60px" }}>
              {viewLoading || !viewDetail ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                  <div style={{ width: 32, height: 32, border: "3px solid rgba(217,53,34,0.2)", borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "lma-spin 0.8s linear infinite" }} />
                </div>
              ) : (
                <>
                  {/* Profile */}
                  <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)", marginBottom: 20 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#141413", margin: "0 0 12px", fontFamily: FF }}>Profile</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12.5 }}>
                      <div><span style={{ color: "#9ca3af" }}>Email</span><div style={{ color: "#141413", fontWeight: 600 }}>{viewDetail.affiliate.email}</div></div>
                      <div><span style={{ color: "#9ca3af" }}>Status</span><div><span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999, ...STATUS_COLOR[viewDetail.affiliate.status] }}>{viewDetail.affiliate.status}</span></div></div>
                      <div><span style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}><Building2 size={11} /> Company</span><div style={{ color: "#141413", fontWeight: 600 }}>{viewDetail.affiliate.company_name || "—"}</div></div>
                      <div><span style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}><Globe size={11} /> Website</span><div style={{ color: "#141413", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{viewDetail.affiliate.website || "—"}</div></div>
                      <div><span style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}><Megaphone size={11} /> Promotion</span><div style={{ color: "#141413", fontWeight: 600 }}>{viewDetail.affiliate.promotion_method || "—"}</div></div>
                      <div><span style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}><Users2 size={11} /> Audience</span><div style={{ color: "#141413", fontWeight: 600 }}>{viewDetail.affiliate.audience_size || "—"}</div></div>
                      <div><span style={{ color: "#9ca3af" }}>Commission rate</span><div style={{ color: GOLD, fontWeight: 700 }}>{viewDetail.affiliate.commission_rate}%</div></div>
                      <div><span style={{ color: "#9ca3af" }}>Joined</span><div style={{ color: "#141413", fontWeight: 600 }}>{new Date(viewDetail.affiliate.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div></div>
                      {viewDetail.affiliate.status === "rejected" && viewDetail.affiliate.rejection_reason && (
                        <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "#9ca3af" }}>Rejection reason</span><div style={{ color: "#dc2626", fontWeight: 600 }}>{viewDetail.affiliate.rejection_reason}</div></div>
                      )}
                    </div>
                  </div>

                  {/* Courses sold */}
                  <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)", marginBottom: 20 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#141413", margin: "0 0 12px", fontFamily: FF }}>Courses sold ({viewDetail.commissions.length})</h4>
                    {viewDetail.commissions.length === 0 ? (
                      <p style={{ fontSize: 12.5, color: "#9ca3af", margin: 0 }}>No sales yet via this affiliate.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {viewDetail.commissions.map(c => (
                          <div key={c.id} style={{ background: "#f9f7f4", borderRadius: 10, padding: "12px 14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#141413" }}>{c.course_title}</div>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap", height: "fit-content", ...STATUS_COLOR[c.status] }}>{c.status}</span>
                            </div>
                            <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 3 }}>{c.student_name} · {c.student_email}</div>
                            <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 3, display: "flex", gap: 14 }}>
                              <span>Paid ₹{Number(c.course_price).toLocaleString()}</span>
                              <span style={{ color: GOLD, fontWeight: 700 }}>Commission ₹{Number(c.commission_amount).toLocaleString()}</span>
                              <span>{new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Click history per course */}
                  <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#141413", margin: "0 0 12px", fontFamily: FF, display: "flex", alignItems: "center", gap: 6 }}>
                      <MousePointerClick size={13} color={GOLD} /> Clicks by course
                    </h4>
                    {viewDetail.clicks_by_course.length === 0 ? (
                      <p style={{ fontSize: 12.5, color: "#9ca3af", margin: 0 }}>No tracked clicks yet.</p>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                          {viewDetail.clicks_by_course.map(c => (
                            <tr key={c.course_id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                              <td style={{ padding: "8px 0", fontSize: 12, color: "#141413" }}>{c.course_title}</td>
                              <td style={{ padding: "8px 0", fontSize: 12, color: "#6b7280", textAlign: "right" }}>{c.clicks} clicks</td>
                              <td style={{ padding: "8px 0", fontSize: 12, color: "#059669", textAlign: "right", fontWeight: 700 }}>{c.conversions} conv.</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
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
    </AffiliateAdminShell>
  );
}
