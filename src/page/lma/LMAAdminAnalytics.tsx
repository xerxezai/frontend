import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, ShieldAlert, Users, TrendingUp, IndianRupee } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const FF   = "'DM Sans', sans-serif";

interface CourseAnalyticsRow {
  id: number;
  title: string;
  instructor_name: string;
  status: string;
  enrollments: number;
  completion_rate: number;
  price: number;
  revenue: number;
}

interface Totals {
  total_courses: number;
  total_enrollments: number;
  total_revenue: number;
  avg_completion_rate: number;
}

const STATUS_C: Record<string, { bg: string; color: string }> = {
  published:      { bg: "#d1fae5", color: "#059669" },
  draft:          { bg: "#f3f4f6", color: "#6b7280" },
  pending_review: { bg: "#fef3c7", color: GOLD },
  rejected:       { bg: "#fee2e2", color: "#dc2626" },
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

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${color}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#141413", lineHeight: 1, marginBottom: 4, fontFamily: FF }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.45)", fontFamily: FF }}>{label}</div>
    </div>
  );
}

export default function LMAAdminAnalytics() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [rows, setRows] = useState<CourseAnalyticsRow[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true);
    setForbidden(false);
    fetch(`${API}/lma/admin/analytics/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 403) { setForbidden(true); return null; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        if (!d) return;
        setRows(Array.isArray(d.courses) ? d.courses : []);
        setTotals(d.totals ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  useEffect(() => { load(); }, [load]);

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
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Course Analytics</h2>
          <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.45)", margin: "4px 0 0", fontFamily: FF }}>Enrollments, completion and revenue across every course.</p>
        </div>

        {!loading && totals && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
            <StatCard label="Total Courses" value={String(totals.total_courses)} icon={BarChart3} color="#3b82f6" />
            <StatCard label="Total Enrollments" value={totals.total_enrollments.toLocaleString()} icon={Users} color="#10b981" />
            <StatCard label="Avg. Completion" value={`${totals.avg_completion_rate}%`} icon={TrendingUp} color={GOLD} />
            <StatCard label="Total Revenue" value={`₹${totals.total_revenue.toLocaleString()}`} icon={IndianRupee} color="#8b5cf6" />
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Course", "Instructor", "Status", "Enrollments", "Completion", "Revenue"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "rgba(20,20,19,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FF, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "56px 16px", textAlign: "center" }}>
                    <BarChart3 size={36} color="#d1d5db" style={{ display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>No courses yet.</p>
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => {
                  const sc = STATUS_C[r.status] ?? STATUS_C.draft;
                  return (
                    <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#141413", maxWidth: 240 }}>{r.title}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#141413", whiteSpace: "nowrap" }}>{r.instructor_name}</td>
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ ...sc, fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999, textTransform: "capitalize" }}>
                          {r.status.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#141413", whiteSpace: "nowrap" }}>{r.enrollments}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 700, color: GOLD, whiteSpace: "nowrap" }}>{r.completion_rate}%</td>
                      <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 700, color: "#8b5cf6", whiteSpace: "nowrap" }}>₹{r.revenue.toLocaleString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LMAStudentLayout>
  );
}
