import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ShieldAlert, Check, Download, Clock, CheckCircle2 } from "lucide-react";
import AffiliateAdminShell from "./AffiliateAdminShell";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const FF = "'DM Sans', sans-serif";

interface CommissionRow {
  id: number; affiliate: number; affiliate_name: string; affiliate_code: string;
  course: number; course_title: string; student_name: string; student_email: string;
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
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{ height: 12, borderRadius: 6, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
      </td>
    ))}
  </tr>
);

const selectStyle: React.CSSProperties = {
  padding: "7px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,0.12)", background: "#fff",
  fontSize: 12, fontWeight: 600, color: "#141413", fontFamily: FF, cursor: "pointer",
};

function toCsv(rows: CommissionRow[]): string {
  const header = ["Affiliate", "Code", "Course", "Student", "Student Email", "Course Price", "Rate %", "Commission", "Status", "Created", "Paid"];
  const lines = rows.map(r => [
    r.affiliate_name, r.affiliate_code, r.course_title, r.student_name, r.student_email, r.course_price,
    r.commission_rate, r.commission_amount, r.status, r.created_at, r.paid_at ?? "",
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
  const [affiliateFilter, setAffiliateFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [acting, setActing] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Fetched once, unfiltered — status/affiliate/course filtering all happen
  // client-side so the three filters can combine freely without round-trips,
  // and so the summary cards can reflect the exact rows on screen.
  const load = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true); setForbidden(false);
    fetch(`${API}/affiliates/admin/commissions/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 403) { setForbidden(true); return null; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { if (d) setRows(Array.isArray(d) ? d : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const affiliateOptions = useMemo(() => {
    const seen = new Map<string, string>();
    rows.forEach(r => seen.set(r.affiliate_code, r.affiliate_name));
    return Array.from(seen.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows]);

  const courseOptions = useMemo(() => {
    const seen = new Set<string>();
    rows.forEach(r => seen.add(r.course_title));
    return Array.from(seen).sort();
  }, [rows]);

  const filteredRows = useMemo(() => rows.filter(r =>
    (statusFilter === "all" || r.status === statusFilter) &&
    (affiliateFilter === "all" || r.affiliate_code === affiliateFilter) &&
    (courseFilter === "all" || r.course_title === courseFilter)
  ), [rows, statusFilter, affiliateFilter, courseFilter]);

  const totals = useMemo(() => {
    let pending = 0, paid = 0;
    for (const r of filteredRows) {
      const amt = Number(r.commission_amount) || 0;
      if (r.status === "paid") paid += amt;
      else pending += amt; // pending + approved, both still owed
    }
    return { pending, paid };
  }, [filteredRows]);

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
    const blob = new Blob([toCsv(filteredRows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `affiliate-commissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Affiliate Commissions</h2>
            <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.45)", margin: "4px 0 0", fontFamily: FF }}>All commission records across every affiliate.</p>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(217,53,34,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={16} color={GOLD} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#141413" }}>₹{totals.pending.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Total pending (owed)</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={16} color="#059669" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#141413" }}>₹{totals.paid.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Total paid out</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          {(["all", "pending", "approved", "paid"] as const).map(s => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)} style={{
              padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: FF,
              background: statusFilter === s ? GOLD : "#f3f4f6", color: statusFilter === s ? "#fff" : "#6b7280",
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
          <select value={affiliateFilter} onChange={e => setAffiliateFilter(e.target.value)} style={selectStyle}>
            <option value="all">All affiliates</option>
            {affiliateOptions.map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}
          </select>
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={selectStyle}>
            <option value="all">All courses</option>
            {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="button" onClick={exportCsv} disabled={filteredRows.length === 0} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,0.12)",
            background: "#fff", cursor: filteredRows.length ? "pointer" : "not-allowed", fontSize: 12, fontWeight: 700, color: "#141413", fontFamily: FF, opacity: filteredRows.length ? 1 : 0.5, marginLeft: "auto",
          }}>
            <Download size={13} /> Export CSV
          </button>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1020 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Affiliate", "Course", "Student", "Amount", "Rate", "Commission", "Status", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "56px 16px", textAlign: "center" }}>
                    <Wallet size={36} color="#d1d5db" style={{ display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>No commissions in this view.</p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < filteredRows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{r.affiliate_name}</div>
                      <div style={{ fontSize: 10.5, color: GOLD, fontWeight: 700 }}>{r.affiliate_code}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#141413", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.course_title}</td>
                    <td style={{ padding: "12px 16px", maxWidth: 180 }}>
                      <div style={{ fontSize: 12, color: "#141413", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.student_name}</div>
                      <div style={{ fontSize: 10.5, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.student_email}</div>
                    </td>
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
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: acting === r.id ? "not-allowed" : "pointer", fontFamily: FF, opacity: acting === r.id ? 0.6 : 1, whiteSpace: "nowrap" }}>
                          <Check size={13} /> Mark Paid
                        </button>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "#9ca3af", whiteSpace: "nowrap" }}>
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
    </AffiliateAdminShell>
  );
}
