import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Download, Share2, Clock } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { V2_API_BASE as API } from "../../components/v2/01-core/v2theme";

const GOLD  = "#D93522";
const AMBER = "#D93522";
const GREEN = "#10b981";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(217,53,34,0.20)";

interface Certificate {
  id: number;
  course: number;
  course_title: string;
  student_name: string;
  issued_at: string;
  certificate_file: string | null;
  unique_id: string;
}

interface Enrollment {
  id: number;
  course: number;
  course_title: string;
  progress: number;
  completed: boolean;
}

interface Row {
  courseId: number;
  courseTitle: string;
  progress: number;
  certificate: Certificate | null;
}

/* ── Toast ── */
const Toast = ({ msg, onDone }: { msg: string; onDone: () => void }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 2000,
      background: "#059669", color: "#fff", padding: "12px 20px",
      borderRadius: 12, fontSize: 13.5, fontWeight: 600, fontFamily: FF,
      boxShadow: "0 8px 32px rgba(5,150,105,0.25)",
      animation: "lmaPage-in 0.28s ease both",
    }}>
      {msg}
    </div>
  );
};

/* ── Card3D ── */
const Card3D = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(false);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 7}deg) translateY(-7px)`;
    el.style.transition = "transform 0.08s ease";
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) { el.style.transform = "translateY(0)"; el.style.transition = "transform 0.32s cubic-bezier(0.22,1,0.36,1)"; }
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={() => setH(true)} onMouseOut={() => setH(false)}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)",
        borderTop: `3px solid ${GOLD}`,
        boxShadow: h ? BHOV : BCARD,
        transition: "box-shadow 0.28s ease",
        padding: "28px 24px", position: "relative", willChange: "transform",
        textAlign: "center",
        ...style,
      }}>
      {children}
    </div>
  );
};

/* ── Skeleton ── */
const SkeletonCertCard = () => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid #f0ede8`, padding: "28px 24px", textAlign: "center" }}>
    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite", margin: "0 auto 16px" }} />
    <div style={{ height: 12, borderRadius: 6, width: "60%", margin: "0 auto 10px", background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    <div style={{ height: 16, borderRadius: 8, width: "80%", margin: "0 auto 10px", background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    <div style={{ height: 11, borderRadius: 5.5, width: "50%", margin: "0 auto 20px", background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    <div style={{ height: 38, borderRadius: 10, width: "100%", background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
  </div>
);

export default function LMACertificatesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [generating, setGenerating] = useState<number | null>(null);

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/lma/student/my-courses/`, { headers }).then(r => (r.ok ? r.json() : [])),
      fetch(`${API}/lma/certificates/`, { headers }).then(r => (r.ok ? r.json() : [])),
    ])
      .then(([enrollments, certs]: [Enrollment[], Certificate[]]) => {
        const certByCourse = new Map((Array.isArray(certs) ? certs : []).map(c => [c.course, c]));
        const merged: Row[] = (Array.isArray(enrollments) ? enrollments : []).map(e => ({
          courseId: e.course,
          courseTitle: e.course_title,
          progress: e.progress,
          certificate: certByCourse.get(e.course) ?? null,
        }));
        setRows(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleDownload = (cert: Certificate) => {
    if (!cert.certificate_file) return;
    window.open(`${API}/lma/certificates/${cert.id}/download/`, "_blank");
  };

  const handleShareLinkedIn = (cert: Certificate) => {
    if (!cert.certificate_file) return;
    const shareUrl = `${API}/lma/certificates/${cert.id}/download/`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
  };

  const handleGenerate = async (row: Row) => {
    if (!token) return;
    setGenerating(row.courseId);
    try {
      const r = await fetch(`${API}/lma/courses/${row.courseId}/generate-certificate/`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setToast(d.error || "Certificate coming soon — the instructor hasn't uploaded a template yet."); return; }
      setRows(prev => prev.map(x => (x.courseId === row.courseId ? { ...x, certificate: d } : x)));
    } catch { setToast("Network error"); } finally { setGenerating(null); }
  };

  const certifiable = rows.filter(r => r.progress >= 100 || r.certificate);
  const inProgress = rows.filter(r => r.progress < 100 && !r.certificate);

  return (
    <LMAStudentLayout>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>
          My Certificates
        </h2>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {[0, 1, 2, 3, 4, 5].map(i => <SkeletonCertCard key={i} />)}
          </div>
        ) : rows.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <Award size={64} color="#d1d5db" style={{ display: "block", margin: "0 auto 20px", filter: "grayscale(1)" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#6b7280", margin: "0 0 8px", fontFamily: FF }}>
              No certificates yet
            </h3>
            <p style={{ color: "#9ca3af", fontSize: 14, margin: "0 0 24px", fontFamily: FF }}>
              Complete a course to earn your first certificate.
            </p>
            <Link to="/lma/student/browse" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg,${AMBER},${GOLD})`,
              color: "#0a0806", fontSize: 13, fontWeight: 700,
              padding: "10px 24px", borderRadius: 10, textDecoration: "none",
            }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {[...certifiable, ...inProgress].map((row, i) => {
              const ready = !!row.certificate?.certificate_file;
              return (
                <Card3D key={row.courseId} style={{ animation: "lmaPage-in 0.40s ease both", animationDelay: `${i * 80}ms` }}>
                  <div style={{
                    position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                    width: "60%", height: 3, background: `linear-gradient(90deg,transparent,${ready ? GREEN : AMBER},transparent)`,
                  }} />

                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: ready
                      ? "linear-gradient(135deg,rgba(16,185,129,0.14),rgba(16,185,129,0.24))"
                      : "linear-gradient(135deg,rgba(217,53,34,0.10),rgba(217,53,34,0.18))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: ready ? "0 4px 16px rgba(16,185,129,0.25)" : "0 4px 16px rgba(217,53,34,0.15)",
                  }}>
                    {ready ? <Award size={36} color={GREEN} /> : <Clock size={32} color={GOLD} />}
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: ready ? GREEN : GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                    {ready ? "Certificate of Completion" : row.progress >= 100 ? "Certificate Pending" : "In Progress"}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 10px", lineHeight: 1.3, fontFamily: FF }}>
                    {row.courseTitle}
                  </h3>

                  {ready && row.certificate ? (
                    <>
                      <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px", fontFamily: FF }}>
                        Issued: {new Date(row.certificate.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                      <p style={{ fontSize: 10.5, color: "#c5c1ba", margin: "0 0 20px", fontFamily: "monospace" }}>
                        ID: {row.certificate.unique_id}
                      </p>
                      <button onClick={() => handleDownload(row.certificate!)} style={{
                        width: "100%", padding: "10px", borderRadius: 10, border: "none",
                        background: `linear-gradient(135deg,${GREEN},#059669)`,
                        color: "#fff", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: FF, marginBottom: 8,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: "0 4px 0 rgba(5,150,105,0.25)",
                      }}>
                        <Download size={14} /> Download Certificate
                      </button>
                      <button onClick={() => handleShareLinkedIn(row.certificate!)} style={{
                        width: "100%", padding: "9px", borderRadius: 10, border: "1.5px solid #0a66c2",
                        background: "#fff", color: "#0a66c2", fontSize: 12.5, fontWeight: 700,
                        cursor: "pointer", fontFamily: FF,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}>
                        <Share2 size={14} /> Share on LinkedIn
                      </button>
                    </>
                  ) : row.progress >= 100 ? (
                    <>
                      <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 20px", fontFamily: FF, lineHeight: 1.6 }}>
                        Certificate coming soon — the instructor hasn't uploaded a certificate template for this course yet.
                      </p>
                      <button onClick={() => handleGenerate(row)} disabled={generating === row.courseId} style={{
                        width: "100%", padding: "10px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.12)",
                        background: "#fff", color: "#6b7280", fontSize: 12.5, fontWeight: 700,
                        cursor: generating === row.courseId ? "not-allowed" : "pointer", fontFamily: FF,
                        opacity: generating === row.courseId ? 0.6 : 1,
                      }}>
                        {generating === row.courseId ? "Checking…" : "Check again"}
                      </button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 12px", fontFamily: FF }}>
                        {row.progress}% complete
                      </p>
                      <div style={{ height: 6, borderRadius: 999, background: "#e5e7eb", overflow: "hidden", marginBottom: 16 }}>
                        <div style={{ height: "100%", width: `${row.progress}%`, background: GOLD, borderRadius: 999 }} />
                      </div>
                      <Link to={`/lma/courses/${row.courseId}?tab=curriculum`} style={{
                        display: "block", width: "100%", boxSizing: "border-box", padding: "10px", borderRadius: 10,
                        background: `linear-gradient(135deg,${AMBER},${GOLD})`, textDecoration: "none",
                        color: "#0a0806", fontSize: 12.5, fontWeight: 700, fontFamily: FF,
                        boxShadow: "0 4px 0 rgba(139,31,23,0.25)",
                      }}>
                        Continue Course
                      </Link>
                    </>
                  )}
                </Card3D>
              );
            })}
          </div>
        )}
      </div>
    </LMAStudentLayout>
  );
}
