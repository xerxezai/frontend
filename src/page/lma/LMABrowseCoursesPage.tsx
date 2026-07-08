import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import LMAStudentLayout from "./LMAStudentLayout";
import { CourseCard, SkeletonCourseCard, GOLD, AMBER, FF } from "./LMACourseCard";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number | string;
  badge: string;
  rating: number;
  total_ratings: number;
  total_students: number;
  hours: number;
  lessons: number;
  tech_stack: string;
  instructor_name: string;
  status: string;
}

export default function LMABrowseCoursesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("lma_token");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (!token) { navigate("/lma/login"); return; }
    setFetchError(false);
    fetch(`${API}/lma/courses/browse/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        const list = Array.isArray(d) ? d : Array.isArray(d?.results) ? d.results : [];
        setCourses(list);
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
    return ["All", ...cats];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = !search || (c.title ?? "").toLowerCase().includes(search.toLowerCase()) || (c.category ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || c.category === category;
      return matchSearch && matchCat;
    });
  }, [courses, search, category]);

  const handleEnroll = (id: number) => {
    if (!token) {
      navigate(`/lma/login?redirect=/lma/courses/${id}&action=enroll`);
    } else {
      navigate(`/lma/courses/${id}?action=enroll`);
    }
  };

  return (
    <LMAStudentLayout>
      <div style={{ fontFamily: FF }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#141413", margin: "0 0 20px", fontFamily: FF }}>
          Browse Courses
        </h2>

        {fetchError && (
          <div style={{ padding: "20px 24px", background: "rgba(239,68,68,0.08)", borderRadius: 12, border: "1px solid rgba(239,68,68,0.18)", marginBottom: 20, color: "#dc2626", fontSize: 14, fontWeight: 600, fontFamily: FF }}>
            Could not load courses. Please check your connection or try refreshing.
          </div>
        )}

        {/* Search + categories */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ position: "relative", maxWidth: 480, marginBottom: 16 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses…"
              style={{
                width: "100%", padding: "10px 14px 10px 40px",
                borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.10)",
                fontSize: 14, fontFamily: FF, outline: "none",
                background: "#fff", color: "#141413",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                border: "none", cursor: "pointer", fontFamily: FF,
                background: category === cat ? `linear-gradient(135deg,${AMBER},${GOLD})` : "rgba(0,0,0,0.06)",
                color: category === cat ? "#0a0806" : "#6b7280",
                transition: "all 0.18s ease",
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {[0, 1, 2, 3, 4, 5].map(i => <SkeletonCourseCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)" }}>
            <BookOpen size={48} color="#d1d5db" style={{ display: "block", margin: "0 auto 16px" }} />
            <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 6px", fontFamily: FF, fontWeight: 600 }}>
              {search || category !== "All"
                ? "No courses match your filters."
                : "No new courses available right now."}
            </p>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, fontFamily: FF }}>
              {search || category !== "All"
                ? "Try different keywords or clear the filter."
                : "Check back soon — new courses are added regularly."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {filtered.map((course, i) => (
              <CourseCard
                key={course.id}
                index={i}
                data={{
                  id: course.id,
                  title: course.title,
                  level: course.level,
                  instructor: course.instructor_name,
                  badge: course.badge,
                  price: course.price,
                  rating: course.rating,
                  totalRatings: course.total_ratings,
                  hours: course.hours,
                  lessons: course.lessons,
                  students: course.total_students,
                  onEnroll: () => handleEnroll(course.id),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </LMAStudentLayout>
  );
}
