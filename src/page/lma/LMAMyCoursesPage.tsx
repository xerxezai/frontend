import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { CourseCard, SkeletonCourseCard, GOLD, AMBER, FF } from "./LMACourseCard";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";

interface Enrollment {
  id: number;
  course: number;
  course_title: string;
  course_level: string;
  course_instructor: string;
  course_header_color: string;
  progress: number;
  enrolled_at: string;
  completed: boolean;
  completed_at: string | null;
}

type FilterTab = "All" | "In Progress" | "Completed";

export default function LMAMyCoursesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("All");

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    fetch(`${API}/lma/student/my-courses/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setEnrollments(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const filtered = enrollments.filter(en => {
    if (tab === "All") return true;
    if (tab === "Completed") return en.completed;
    if (tab === "In Progress") return !en.completed;
    return true;
  });

  const tabs: FilterTab[] = ["All", "In Progress", "Completed"];

  return (
    <LMAStudentLayout>
      <div style={{ animation: "lmaPage-in 0.32s ease both", fontFamily: FF }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: 0, fontFamily: FF }}>My Courses</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer", fontFamily: FF,
                background: tab === t ? `linear-gradient(135deg,${AMBER},${GOLD})` : "rgba(0,0,0,0.06)",
                color: tab === t ? "#0a0806" : "#6b7280",
                transition: "all 0.18s ease",
              }}>{t}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {[0, 1, 2, 3, 4, 5].map(i => <SkeletonCourseCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <BookOpen size={48} color="#d1d5db" style={{ marginBottom: 16, display: "block", margin: "0 auto 16px" }} />
            <p style={{ color: "#9ca3af", fontSize: 15, margin: "0 0 20px", fontFamily: FF }}>
              {tab === "All" ? "You haven't enrolled in any courses yet." : `No ${tab.toLowerCase()} courses.`}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {filtered.map((en, i) => (
              <CourseCard
                key={en.id}
                index={i}
                data={{
                  id: en.course,
                  title: en.course_title,
                  level: en.course_level,
                  instructor: en.course_instructor,
                  accent: en.course_header_color,
                  progress: en.progress,
                  completed: en.completed,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </LMAStudentLayout>
  );
}
