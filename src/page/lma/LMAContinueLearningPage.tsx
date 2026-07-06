import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD = "#C9883A";
const FF   = "'DM Sans', sans-serif";

export default function LMAContinueLearningPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token");

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/student/my-courses/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((enrollments: unknown) => {
        const list = Array.isArray(enrollments) ? enrollments : [];
        if (list.length > 0) {
          navigate(`/lma/courses/${list[0].course}`);
        } else {
          navigate("/lma/student/browse");
        }
      })
      .catch(() => navigate("/lma/student/browse"));
  }, [token, navigate]);

  return (
    <LMAStudentLayout>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "50vh", fontFamily: FF, gap: 16,
      }}>
        <Loader size={36} color={GOLD} style={{ animation: "lma-spin 1s linear infinite" }} />
        <p style={{ fontSize: 15, color: "#9ca3af", margin: 0, fontFamily: FF }}>
          Finding where you left off…
        </p>
      </div>
    </LMAStudentLayout>
  );
}
