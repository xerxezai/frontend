import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, ShieldAlert, Check, X } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const FF   = "'DM Sans', sans-serif";

interface PendingCourseRow {
  id: number;
  title: string;
  description: string;
  instructor_name: string;
  instructor_email: string;
  category: string;
  level: string;
  price: number;
  updated_at: string;
}

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{ height: 12, borderRadius: 6, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
      </td>
    ))}
  </tr>
);

export default function LMAAdminPendingCourses() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [rows, setRows] = useState<PendingCourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [acting, setActing] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingCourseRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true);
    setForbidden(false);
    fetch(`${API}/lma/admin/pending-courses/`, { headers: { Authorization: `Bearer ${token}` } })
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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const approve = async (row: PendingCourseRow) => {
    setActing(row.id);
    try {
      const r = await fetch(`${API}/lma/admin/courses/${row.id}/approve/`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (!r.ok) { setToast({ msg: d.error || "Approve failed", type: "error" }); return; }
      setToast({ msg: `"${row.title}" approved and published.`, type: "success" });
      setRows(prev => prev.filter(c => c.id !== row.id));
    } catch { setToast({ msg: "Network error", type: "error" }); } finally { setActing(null); }
  };

  const reject = async () => {
    if (!rejectTarget || !rejectReason.trim()) { setToast({ msg: "A rejection reason is required.", type: "error" }); return; }
    setActing(rejectTarget.id);
    try {
      const r = await fetch(`${API}/lma/admin/courses/${rejectTarget.id}/reject/`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });
      const d = await r.json();
      if (!r.ok) { setToast({ msg: d.error || "Reject failed", type: "error" }); return; }
      setToast({ msg: `"${rejectTarget.title}" rejected — instructor notified.`, type: "success" });
      setRows(prev => prev.filter(c => c.id !== rejectTarget.id));
      setRejectTarget(null); setRejectReason("");
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
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>
              Pending Courses
              {!loading && rows.length > 0 && (
                <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 700, color: GOLD, background: "#fef3c7", padding: "2px 10px", borderRadius: 999 }}>
                  {rows.length} pending
                </span>
              )}
            </h2>
            <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.45)", margin: "4px 0 0", fontFamily: FF }}>Courses submitted for review, across every instructor.</p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Course", "Instructor", "Category", "Submitted", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "56px 16px", textAlign: "center" }}>
                    <ClipboardCheck size={36} color="#d1d5db" style={{ display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>No courses awaiting review.</p>
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td style={{ padding: "12px 16px", maxWidth: 260 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{r.title}</div>
                      <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.45)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.description}</div>
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#141413" }}>{r.instructor_name}</div>
                      <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.45)" }}>{r.instructor_email}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#141413", whiteSpace: "nowrap", textTransform: "capitalize" }}>{r.category}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "rgba(20,20,19,0.55)", whiteSpace: "nowrap" }}>
                      {new Date(r.updated_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <>
          <div onClick={() => !acting && setRejectTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", zIndex: 700 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 701, width: 400, padding: "28px 26px", background: "#fff", borderRadius: 18, borderTop: "3px solid #dc2626", boxShadow: "0 24px 80px rgba(0,0,0,0.20)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 6px", fontFamily: FF }}>Reject "{rejectTarget.title}"</h3>
            <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 16px", fontFamily: FF }}>The instructor will see this reason and can fix and resubmit.</p>
            <textarea
              rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Explain what needs to change…" autoFocus
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: FF, resize: "vertical", marginBottom: 16, outline: "none" }}
              onFocus={e => { e.target.style.borderColor = GOLD; }}
              onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }}
            />
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

      {/* Toast */}
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
