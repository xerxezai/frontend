import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ShieldAlert, Check, Download } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const FF = "'DM Sans', sans-serif";

interface CommissionRow {
  id: number; affiliate_name: string; affiliate_code: string; course_title: string;
  course_price: string; commission_rate: string; commission_amount: string;
  status: "pending" | "approved" | "paid"; paid_at: string | null; created_at: string;
}

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#D93522" },
  approved: { bg: "#dbeafe", color: "#2563eb" },
  paid: { bg: "#d1fae5", color: "#059669" },
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

function toCsv(rows: CommissionRow[]): string {
  const header = ["Affiliate", "Code", "Course", "Course Price", "Rate %", "Commission", "Status", "Created", "Paid"];
  const lines = rows.map(r => [
    r.affiliate_name, r.affiliate_code, r.course_title, r.course_price, r.commission_rate,
    r.commission_amount, r.status, r.created_at, r.paid_at ?? "",
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  return [header.join(","), ...lines].join("\n");
}

export default function LMAAdminAffiliateCommissions() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [rows, setRows] = useState<CommissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "paid">("all");
  const [acting, setActing] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true); setForbidden(false);
    const qs = statusFilter !== "all" ? `?status=${statusFilter}` : "";
    fetch(`${API}/affiliates/admin/commissions/${qs}`, { headers: { Authorization: `Bearer ${token}` } })
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

  const markPaid = async (row: CommissionRow) => {
    setActing(row.id);
    try {
      const r = await fetch(`${API}/affiliates/admin/commissions/${row.id}/pay/`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (!r.ok) { setToast({ msg: d.error || "Failed to mark paid", type: "error" }); return; }
      setRows(prev => prev.map(x => (x.id === row.id ? { ...x, status: "paid", paid_at: d.paid_at } : x)));
      setToast({ msg: "Marked as paid.", type: "success" });
    } catch { setToast({ msg: "Network error", type: "error" }); } finally { setActing(null); }
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `affiliate-commissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Affiliate Commissions</h2>
            <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.45)", margin: "4px 0 0", fontFamily: FF }}>All commission records across every affiliate.</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {(["all", "pending", "approved", "paid"] as const).map(s => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)} style={{
                padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: FF,
                background: statusFilter === s ? GOLD : "#f3f4f6", color: statusFilter === s ? "#fff" : "#6b7280",
              }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
            <button type="button" onClick={exportCsv} disabled={rows.length === 0} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,0.12)",
              background: "#fff", cursor: rows.length ? "pointer" : "not-allowed", fontSize: 12, fontWeight: 700, color: "#141413", fontFamily: FF, opacity: rows.length ? 1 : 0.5,
            }}>
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Affiliate", "Course", "Price", "Rate", "Commission", "Status", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "56px 16px", textAlign: "center" }}>
                    <Wallet size={36} color="#d1d5db" style={{ display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>No commissions in this view.</p>
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{r.affiliate_name}</div>
                      <div style={{ fontSize: 10.5, color: GOLD, fontWeight: 700 }}>{r.affiliate_code}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#141413", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.course_title}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#6b7280", whiteSpace: "nowrap" }}>₹{Number(r.course_price).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#6b7280", whiteSpace: "nowrap" }}>{r.commission_rate}%</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: GOLD, whiteSpace: "nowrap" }}>₹{Number(r.commission_amount).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, ...STATUS_COLOR[r.status] }}>{r.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 11.5, color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {r.status !== "paid" ? (
                        <button type="button" onClick={() => markPaid(r)} disabled={acting === r.id}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: acting === r.id ? "not-allowed" : "pointer", fontFamily: FF, opacity: acting === r.id ? 0.6 : 1 }}>
                          <Check size={13} /> Mark Paid
                        </button>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "#9ca3af" }}>
                          Paid {r.paid_at ? new Date(r.paid_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : ""}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
