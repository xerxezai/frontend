import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Users, Star, CheckCircle2, Play } from "lucide-react";

export const GOLD  = "#C9883A";
export const AMBER = "#E8A84E";
export const DARK  = "#1a1208";
export const FF    = "'DM Sans', sans-serif";
export const BCARD = "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06),0 16px 32px rgba(0,0,0,0.03)";
export const BHOV  = "0 2px 4px rgba(0,0,0,0.05),0 12px 36px rgba(0,0,0,0.10),0 28px 64px rgba(201,136,58,0.12)";

/* ── Card3D — shared tilt-card shell used across all LMA student pages ── */
export const Card3D = ({ children, accent = GOLD, style = {}, p = "22px 20px", onClick }: {
  children: React.ReactNode; accent?: string; style?: React.CSSProperties; p?: string; onClick?: () => void;
}) => {
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
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseOut={() => setH(false)}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)",
        borderTop: `3px solid ${accent}`,
        boxShadow: h ? BHOV : BCARD,
        transition: "box-shadow 0.28s ease",
        padding: p, position: "relative", willChange: "transform", overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>
      {children}
    </div>
  );
};

/* ── ProgressBar ── */
export const ProgressBar = ({ value, color = GOLD, h = 6 }: { value: number; color?: string; h?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.width = "0%";
    const t = setTimeout(() => { el.style.width = `${value}%`; el.style.transition = "width 1.1s cubic-bezier(0.22,1,0.36,1)"; }, 250);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div style={{ height: h, borderRadius: h / 2, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div ref={ref} style={{ height: "100%", borderRadius: h / 2, background: `linear-gradient(90deg,${color},${AMBER})` }} />
    </div>
  );
};

/* ── Skeleton primitives ── */
export const Skeleton = ({ h = 14, w = "100%", mb = 12 }: { h?: number; w?: string; mb?: number }) => (
  <div style={{ height: h, width: w, borderRadius: h / 2, marginBottom: mb, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
);

export const SkeletonCourseCard = () => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", padding: "20px" }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 16, background: "linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize: "800px 100%", animation: "lma-shimmer 1.4s infinite" }} />
    <Skeleton h={12} w="40%" mb={8} />
    <Skeleton h={16} w="80%" mb={6} />
    <Skeleton h={12} w="55%" mb={16} />
    <Skeleton h={6} w="100%" mb={12} />
    <Skeleton h={36} w="100%" mb={0} />
  </div>
);

export const levelColor = (level: string) => {
  const l = (level ?? "").toLowerCase();
  if (l.includes("beginner"))     return { color: "#059669", bg: "rgba(5,150,105,0.10)" };
  if (l.includes("intermediate")) return { color: "#3b82f6", bg: "rgba(59,130,246,0.10)" };
  if (l.includes("advanced"))     return { color: "#8b5cf6", bg: "rgba(139,92,246,0.10)" };
  return { color: GOLD, bg: "rgba(201,136,58,0.10)" };
};

const StarRating = ({ value }: { value: number }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={11} color="#f59e0b" fill={s <= Math.round(value) ? "#f59e0b" : "none"} />
    ))}
  </span>
);

/* ── Icon tile — the shared signature element replacing the old gradient banner ──
   A compact dark tile (matches the sidebar's own dark surface) sits top-left,
   with a slim accent-colored corner fold to signal category/level at a glance. */
const IconTile = ({ accent, badge }: { accent: string; badge?: string }) => (
  <div style={{ position: "relative", flexShrink: 0 }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: `linear-gradient(135deg,${DARK},#2d1c0a)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 4px 14px rgba(0,0,0,0.22)`,
    }}>
      <BookOpen size={20} color={accent} />
    </div>
    {badge && (
      <div style={{
        position: "absolute", top: -6, right: -6,
        width: 20, height: 20, borderRadius: "50%",
        background: accent, border: "2px solid #fff",
        display: "flex", alignItems: "center", justifyContent: "center",
      }} title={badge} />
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   Unified CourseCard — one component, three "modes" driven by props so
   My Courses / Continue Learning / Browse Courses stay visually identical.
   ═══════════════════════════════════════════════════════════════════════════ */
export interface CourseCardData {
  id: number;                 // course id (for routing)
  title: string;
  level: string;
  instructor: string;
  accent?: string;            // course_header_color, falls back to GOLD
  // progress mode (My Courses / Continue Learning)
  progress?: number;
  completed?: boolean;
  // browse mode (catalog)
  price?: number | string;
  rating?: number;
  totalRatings?: number;
  hours?: number;
  lessons?: number;
  students?: number;
  badge?: string;
  onEnroll?: () => void;
}

export const CourseCard = ({ data, index = 0 }: { data: CourseCardData; index?: number }) => {
  const accent = data.accent || GOLD;
  const lvl = levelColor(data.level);
  const isBrowseMode = data.price !== undefined;
  const statusBadge = data.completed
    ? { label: "Completed", color: "#059669", bg: "rgba(5,150,105,0.10)" }
    : (data.progress ?? 0) > 0
      ? { label: "In Progress", color: GOLD, bg: "rgba(201,136,58,0.10)" }
      : { label: "Not Started", color: "#6b7280", bg: "rgba(107,114,128,0.10)" };

  return (
    <Card3D accent={accent} style={{ animation: "lmaPage-in 0.40s ease both", animationDelay: `${index * 80}ms` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <IconTile accent={accent} badge={data.badge} />
        <span style={{ fontSize: 10, fontWeight: 700, color: lvl.color, background: lvl.bg, padding: "3px 9px", borderRadius: 999, letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>
          {data.level || "Course"}
        </span>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 800, color: "#141413", margin: "0 0 4px", lineHeight: 1.35, fontFamily: FF, minHeight: 40 }}>
        {data.title}
      </h3>
      <div style={{ fontSize: 12, color: "rgba(20,20,19,0.50)", marginBottom: 14, fontFamily: FF }}>
        by {data.instructor || "Instructor"}
      </div>

      {isBrowseMode ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <StarRating value={Number(data.rating) || 0} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>{(Number(data.rating) || 0).toFixed(1)}</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>({Number(data.totalRatings) || 0})</span>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#9ca3af", marginBottom: 16 }}>
            <span><Clock size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />{Number(data.hours) || 0}h</span>
            <span><BookOpen size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />{Number(data.lessons) || 0} lessons</span>
            <span><Users size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />{Number(data.students) || 0}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: GOLD, fontFamily: FF }}>
              {data.price === 0 || data.price === "0" || data.price === "0.00"
                ? <span style={{ fontSize: 14, color: "#059669", fontWeight: 700 }}>Free</span>
                : `₹${data.price}`}
            </div>
            <button onClick={data.onEnroll} style={{
              background: `linear-gradient(135deg,${AMBER},${GOLD})`,
              color: "#0a0806", fontSize: 13, fontWeight: 700,
              padding: "9px 18px", borderRadius: 9, border: "none",
              cursor: "pointer", fontFamily: FF,
              boxShadow: "0 4px 0 rgba(140,80,20,0.30)",
            }}>
              Enroll Now
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}><ProgressBar value={data.progress ?? 0} color={accent} /></div>
            <span style={{ fontSize: 12, fontWeight: 800, color: accent, flexShrink: 0, fontFamily: FF }}>
              {data.progress ?? 0}%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: statusBadge.color, background: statusBadge.bg, padding: "3px 10px", borderRadius: 999 }}>
              {statusBadge.label}
            </span>
            <Link to={`/lma/courses/${data.id}`} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 700, textDecoration: "none",
              background: data.completed ? "rgba(5,150,105,0.10)" : `linear-gradient(135deg,${AMBER},${GOLD})`,
              color: data.completed ? "#059669" : "#0a0806",
              padding: "7px 14px", borderRadius: 8,
              border: data.completed ? "1.5px solid rgba(5,150,105,0.25)" : "none",
            }}>
              {data.completed ? (
                <><CheckCircle2 size={12} /> Review</>
              ) : (data.progress ?? 0) === 0 ? (
                <><Play size={12} fill="#0a0806" /> Start</>
              ) : (
                <><Play size={12} fill="#0a0806" /> Continue</>
              )}
            </Link>
          </div>
        </>
      )}
    </Card3D>
  );
};
