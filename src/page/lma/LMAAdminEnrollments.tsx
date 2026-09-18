import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ClipboardList, ShieldAlert } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD = "#D93522";
const FF   = "'DM Sans', sans-serif";

interface AdminEnrollmentRow {
  id: number;
  student_name: string;
  student_email: string;
  course_title: string;
  course_id: number;
  instructor_name: string;
  progress: number;
  enrolled_at: string;
  completed: boolean;
}

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{ height: 12, borderRadius: 6, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
      </td>
    ))}
  </tr>
);

/** Quotes a field for CSV, escaping embedded quotes per RFC 4180. */
function csvField(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadEnrollmentsCSV(rows: AdminEnrollmentRow[]) {
  const header = ["Student Name", "Email", "Course", "Instructor", "Progress %", "Enrolled Date", "Status"];
  const lines = [
    header.join(","),
    ...rows.map(r => [
      csvField(r.student_name),
      csvField(r.student_email),
      csvField(r.course_title),
      csvField(r.instructor_name),
      csvField(r.progress),
      csvField(new Date(r.enrolled_at).toLocaleDateString("en-IN")),
      csvField(r.completed ? "Completed" : "Active"),
    ].join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `xerxez-enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function LMAAdminEnrollments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token") ?? "";

  const [rows, setRows] = useState<AdminEnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(() => {
    if (!token) { navigate("/lma/login"); return; }
    setLoading(true);
    setForbidden(false);
    fetch(`${API}/lma/admin/enrollments/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 403) { setForbidden(true); return []; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: AdminEnrollmentRow[]) => setRows(Array.isArray(d) ? d : []))
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>Enrollments</h2>
            <p style={{ fontSize: 12.5, color: "rgba(20,20,19,0.45)", margin: "4px 0 0", fontFamily: FF }}>Every enrollment across every course, most recent first.</p>
          </div>
          <button
            type="button"
            onClick={() => downloadEnrollmentsCSV(rows)}
            disabled={loading || rows.length === 0}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: GOLD, color: "#fff", fontSize: 13, fontWeight: 700,
              border: "none", borderRadius: 9, padding: "10px 18px",
              cursor: loading || rows.length === 0 ? "not-allowed" : "pointer",
              opacity: loading || rows.length === 0 ? 0.5 : 1, fontFamily: FF,
              boxShadow: "0 4px 0 rgba(139,31,23,0.30)",
            }}
          >
            <Download size={15} /> Export to CSV
          </button>
        </div>

        {!loading && (
          <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.42)", marginBottom: 10 }}>
            {rows.length} enrollment{rows.length !== 1 ? "s" : ""}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 16, overflow: "auto", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr style={{ background: "#f9f7f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Student", "Course", "Instructor", "Progress", "Enrolled", "Status"].map(h => (
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
                    <ClipboardList size={36} color="#d1d5db" style={{ display: "block", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9ca3af", fontSize: 13.5, margin: 0, fontFamily: FF }}>No enrollments yet.</p>
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#141413" }}>{r.student_name}</div>
                      <div style={{ fontSize: 11.5, color: "rgba(20,20,19,0.45)" }}>{r.student_email}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#141413", maxWidth: 220 }}>{r.course_title}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#141413", whiteSpace: "nowrap" }}>{r.instructor_name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 700, color: GOLD, whiteSpace: "nowrap" }}>{r.progress}%</td>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, color: "rgba(20,20,19,0.55)", whiteSpace: "nowrap" }}>
                      {new Date(r.enrolled_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, textTransform: "uppercase",
                        background: r.completed ? "rgba(5,150,105,0.10)" : "rgba(217,53,34,0.10)",
                        color: r.completed ? "#059669" : GOLD,
                      }}>
                        {r.completed ? "completed" : "active"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LMAStudentLayout>
  );
}
