import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Download } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const FF    = "'DM Sans', sans-serif";
const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.20)";

interface Certificate {
  id: number;
  course: number;
  course_title: string;
  issued_at: string;
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
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/certificates/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setCerts(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleDownload = () => {
    setToast("Download feature coming soon — your certificate is recorded.");
  };

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
        ) : certs.length === 0 ? (
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
            {certs.map((cert, i) => (
              <Card3D key={cert.id} style={{ animation: "lmaPage-in 0.40s ease both", animationDelay: `${i * 80}ms` }}>
                {/* Gold shimmer decorative bar */}
                <div style={{
                  position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                  width: "60%", height: 3, background: `linear-gradient(90deg,transparent,${AMBER},transparent)`,
                  borderRadius: 0,
                }} />

                {/* Award icon */}
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: `linear-gradient(135deg,#fef3c7,#fde68a)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 16px rgba(201,136,58,0.25)",
                }}>
                  <Award size={36} color="#d97706" />
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                  Certificate of Completion
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#141413", margin: "0 0 10px", lineHeight: 1.3, fontFamily: FF }}>
                  {cert.course_title}
                </h3>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 20px", fontFamily: FF }}>
                  Issued: {new Date(cert.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                </p>

                <button onClick={handleDownload} style={{
                  width: "100%", padding: "10px", borderRadius: 10,
                  border: "none",
                  background: `linear-gradient(135deg,${AMBER},${GOLD})`,
                  color: "#0a0806", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: FF,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 0 rgba(140,80,20,0.25)",
                }}>
                  <Download size={14} /> Download PDF
                </button>
              </Card3D>
            ))}
          </div>
        )}
      </div>
    </LMAStudentLayout>
  );
}
