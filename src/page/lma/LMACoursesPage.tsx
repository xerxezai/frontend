import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, Users, Clock, BookOpen, ChevronRight } from "lucide-react";

const API   = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";
const GOLD  = "#C9883A";
const AMBER = "#E8A84E";
const DARK  = "#1a1208";
const DARK2 = "#0f0a05";
const CREAM = "#F8F4EE";
const FF    = "'DM Sans', sans-serif";

interface Course {
  id: number; title: string; description: string; category: string; level: string;
  price: number; badge: string; header_color: string; rating: number; total_ratings: number;
  total_students: number; hours: number; lessons: number; tech_stack: string[];
  instructor_name: string; status: string;
}

/* ── Header gradient by course color ── */
const headerGrad = (hc: string) => {
  if (hc === "blue")   return "linear-gradient(135deg,#0f2460 0%,#1d4ed8 100%)";
  if (hc === "green")  return "linear-gradient(135deg,#064e3b 0%,#10b981 100%)";
  if (hc === "purple") return "linear-gradient(135deg,#2e1065 0%,#7c3aed 100%)";
  return `linear-gradient(135deg,${DARK} 0%,#2a1c0c 100%)`;
};

const levelCfg = (l: string) => {
  const lc = (l ?? "").toLowerCase();
  if (lc.includes("begin")) return { c: "#059669", bg: "#d1fae5" };
  if (lc.includes("inter")) return { c: "#2563eb", bg: "#dbeafe" };
  if (lc.includes("advan")) return { c: "#7c3aed", bg: "#ede9fe" };
  return { c: GOLD, bg: "rgba(201,136,58,0.12)" };
};

const badgeCfg = (b: string) => {
  if (b === "BESTSELLER") return { c: "#92400e", bg: "rgba(255,193,0,0.20)", border: "rgba(255,193,0,0.38)" };
  if (b === "NEW")        return { c: "#1e40af", bg: "rgba(59,130,246,0.16)", border: "rgba(59,130,246,0.38)" };
  return { c: GOLD, bg: "rgba(201,136,58,0.15)", border: "rgba(201,136,58,0.35)" };
};

/* ════════════════════════════════════════
   COURSE CARD — 3-D tilt + shimmer sweep
════════════════════════════════════════ */
const CourseCard = ({ course, idx }: { course: Course; idx: number }) => {
  const ref  = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);
  const pref = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  useEffect(() => {
    const el = ref.current;
    if (!el || pref) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    const tid = setTimeout(() => {
      el.style.transition = `opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 60 + idx * 70);
    return () => clearTimeout(tid);
  }, [idx, pref]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pref) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 11}deg) rotateX(${-y * 7}deg) translateY(-10px) translateZ(8px)`;
    el.style.transition = "transform 0.08s linear";
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "none";
    el.style.transition = "transform 0.42s cubic-bezier(0.22,1,0.36,1)";
    setHov(false);
  };

  const grad  = headerGrad(course.header_color ?? "");
  const lvl   = levelCfg(course.level);
  const bdg   = badgeCfg(course.badge ?? "");
  const price = Number(course.price) || 0;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHov(true)}
      style={{
        background: "#fff", borderRadius: 18, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.07)", borderTop: `3px solid ${GOLD}`,
        boxShadow: hov
          ? `0 24px 60px rgba(0,0,0,0.15),0 8px 24px rgba(201,136,58,0.16)`
          : `0 2px 8px rgba(0,0,0,0.06),0 8px 24px rgba(0,0,0,0.05)`,
        transition: "box-shadow 0.28s ease",
        display: "flex", flexDirection: "column",
        willChange: "transform", cursor: "pointer", position: "relative",
      }}
    >
      {/* Shimmer sweep */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:10, overflow:"hidden", borderRadius:18 }}>
        <div style={{
          position:"absolute", top:0,
          left: hov ? "120%" : "-60%",
          width:"40%", height:"100%",
          background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
          transition:"left 0.52s ease",
          transform:"skewX(-12deg)",
        }} />
      </div>

      {/* Header */}
      <div style={{ background: grad, padding:"20px 20px 18px", position:"relative", minHeight:110, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
        {course.badge && (
          <span style={{
            position:"absolute", top:12, right:12,
            fontSize:9.5, fontWeight:800, letterSpacing:"0.09em",
            padding:"3px 10px", borderRadius:999,
            background:bdg.bg, color:bdg.c, border:`1px solid ${bdg.border}`,
            backdropFilter:"blur(8px)",
          }}>
            {course.badge}
          </span>
        )}
        <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.46)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:5 }}>
          {course.category}
        </div>
        <h3 style={{ fontSize:15, fontWeight:800, color:"#fff", margin:"0 0 10px", lineHeight:1.32, fontFamily:FF }}>
          {course.title}
        </h3>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {(course.tech_stack ?? []).slice(0, 4).map((t: string) => (
            <span key={t} style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:999, background:"rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.80)", backdropFilter:"blur(4px)", border:"1px solid rgba(255,255,255,0.11)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:"16px 20px 20px", display:"flex", flexDirection:"column", flex:1 }}>
        <p style={{ fontSize:12.5, color:"rgba(20,20,19,0.52)", lineHeight:1.58, margin:"0 0 14px", flex:1, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", fontFamily:FF }}>
          {course.description}
        </p>

        <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:12, flexWrap:"wrap" }}>
          {course.rating > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Star size={12} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize:12, fontWeight:700, color:"#141413" }}>{course.rating}</span>
              <span style={{ fontSize:11, color:"rgba(20,20,19,0.40)" }}>({course.total_ratings})</span>
            </div>
          )}
          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:"rgba(20,20,19,0.46)" }}>
            <Users size={11} />{(course.total_students ?? 0).toLocaleString()} students
          </span>
        </div>

        <div style={{ display:"flex", gap:12, marginBottom:16, fontSize:11.5, color:"rgba(20,20,19,0.50)", alignItems:"center" }}>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={11} />{course.hours}h</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><BookOpen size={11} />{course.lessons} lessons</span>
          <span style={{ marginLeft:"auto", fontSize:10.5, fontWeight:700, padding:"2px 9px", borderRadius:999, background:lvl.bg, color:lvl.c }}>
            {course.level}
          </span>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:20, fontWeight:900, color:GOLD, fontFamily:FF }}>
            {price === 0
              ? <span style={{ fontSize:14, color:"#059669", fontWeight:700 }}>Free</span>
              : `₹${price.toLocaleString()}`}
          </div>
          <Link
            to={`/lma/courses/${course.id}`}
            style={{ display:"inline-flex", alignItems:"center", gap:6, background:`linear-gradient(135deg,${AMBER},${GOLD})`, color:"#0a0806", fontSize:13, fontWeight:700, padding:"9px 18px", borderRadius:9, textDecoration:"none", boxShadow:"0 3px 0 rgba(130,78,18,0.40)", transition:"transform 0.18s ease, box-shadow 0.18s ease", fontFamily:FF }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 5px 0 rgba(130,78,18,0.40)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ""; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 3px 0 rgba(130,78,18,0.40)"; }}
          >
            View <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton ── */
const Skeleton = () => (
  <div style={{ background:"#fff", borderRadius:18, overflow:"hidden", border:"1px solid rgba(0,0,0,0.06)" }}>
    <div style={{ height:110, background:`linear-gradient(90deg,#1e1710 25%,#2a2010 50%,#1e1710 75%)`, backgroundSize:"600px 100%", animation:"lmac-shimmer 1.6s infinite" }} />
    <div style={{ padding:"16px 20px 20px" }}>
      {([[60,13,8],[90,17,6],[45,12,18],[100,40,0]] as [number,number,number][]).map(([w,h,mb],i) => (
        <div key={i} style={{ width:`${w}%`, height:h, borderRadius:h/2, marginBottom:mb, background:"linear-gradient(90deg,#f0ede8 25%,#e8e4de 50%,#f0ede8 75%)", backgroundSize:"600px 100%", animation:"lmac-shimmer 1.6s infinite" }} />
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function LMACoursesPage() {
  const [courses,       setCourses      ] = useState<Course[]>([]);
  const [loading,       setLoading      ] = useState(true);
  const [search,        setSearch       ] = useState("");
  const [level,         setLevel        ] = useState("all");
  const [category,      setCategory     ] = useState("all");
  const [searchFocused, setSearchFocused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pref = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  useEffect(() => {
    fetch(`${API}/lma/courses/`)
      .then(r => r.json())
      .then(d => setCourses(Array.isArray(d) ? d : (d.results ?? [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pref) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const N = 44, LINK = 115;
    let W = 0, H = 0, raf = 0;
    const pts = Array.from({ length: N }, () => ({
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.4 + 0.6,
    }));
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      pts.forEach(p => { p.x = Math.random() * W; p.y = Math.random() * H; });
    };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(201,136,58,${0.14 * (1 - d / LINK)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201,136,58,0.30)"; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      raf = requestAnimationFrame(tick);
    };
    resize(); tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [pref]);

  const categories = useMemo(() =>
    ["all", ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))],
    [courses]);

  const filtered = useMemo(() => courses.filter(c => {
    const q  = search.toLowerCase();
    const mQ = !q || (c.title ?? "").toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q) || (c.category ?? "").toLowerCase().includes(q);
    const mL = level === "all"    || (c.level ?? "").toLowerCase() === level;
    const mC = category === "all" || c.category === category;
    return mQ && mL && mC;
  }), [courses, search, level, category]);

  const totalStudents = useMemo(() => courses.reduce((s, c) => s + (c.total_students ?? 0), 0), [courses]);

  return (
    <div style={{ minHeight:"100vh", background:CREAM, fontFamily:FF }}>

      {/* ══ HERO ══ */}
      <section style={{ background:`linear-gradient(160deg,${DARK} 0%,${DARK2} 100%)`, padding:"60px 0 72px", position:"relative", overflow:"hidden", minHeight:500 }}>

        {/* Canvas */}
        <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />

        {/* Dot grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(201,136,58,0.08) 1px,transparent 1px)", backgroundSize:"30px 30px", pointerEvents:"none", zIndex:0 }} />

        {/* Atmospheric orbs */}
        <div style={{ position:"absolute", top:"-18%", left:"-6%", width:520, height:520, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,136,58,0.12) 0%,transparent 65%)", animation:"lmac-float1 11s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-22%", right:"-6%", width:440, height:440, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,168,78,0.08) 0%,transparent 65%)", animation:"lmac-float2 14s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"38%", right:"24%", width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,136,58,0.16) 0%,transparent 70%)", animation:"lmac-float3 8s ease-in-out infinite", pointerEvents:"none" }} />

        {/* Orbit rings */}
        <div style={{ position:"absolute", right:-110, top:"50%", transform:"translateY(-50%)", width:520, height:520, borderRadius:"50%", border:"1px solid rgba(201,136,58,0.07)", animation:"lmac-orbit 58s linear infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:-65,  top:"50%", transform:"translateY(-50%)", width:380, height:380, borderRadius:"50%", border:"1px solid rgba(201,136,58,0.11)", animation:"lmac-orbit 38s linear infinite reverse", pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:-30,  top:"50%", transform:"translateY(-50%)", width:260, height:260, borderRadius:"50%", border:"1px solid rgba(201,136,58,0.16)", animation:"lmac-orbit 26s linear infinite", pointerEvents:"none" }} />

        {/* Diagonal rays */}
        <div style={{ position:"absolute", top:"-30%", left:"-8%", width:100, height:"220%", background:"linear-gradient(180deg,transparent,rgba(201,136,58,0.055),transparent)", transform:"rotate(-35deg)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"-20%", left:"22%", width:55, height:"200%", background:"linear-gradient(180deg,transparent,rgba(232,168,78,0.038),transparent)", transform:"rotate(-35deg)", pointerEvents:"none" }} />

        {/* Floating diamonds */}
        <div style={{ position:"absolute", right:"8%", top:"16%", width:14, height:14, background:"rgba(201,136,58,0.26)", border:"1px solid rgba(201,136,58,0.52)", transform:"rotate(45deg)", animation:"lmac-diamond 6s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:"26%", top:"68%", width:9, height:9, background:"rgba(232,168,78,0.20)", border:"1px solid rgba(232,168,78,0.46)", transform:"rotate(45deg)", animation:"lmac-diamond 8s ease-in-out infinite 1.5s", pointerEvents:"none" }} />
        <div style={{ position:"absolute", left:"5%", bottom:"18%", width:11, height:11, background:"rgba(201,136,58,0.18)", border:"1px solid rgba(201,136,58,0.42)", transform:"rotate(45deg)", animation:"lmac-diamond 7s ease-in-out infinite 3s", pointerEvents:"none" }} />

        {/* ← Back to Home */}
        <Link
          to="/"
          style={{ position:"absolute", top:24, left:"clamp(24px,5vw,80px)", display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.36)", textDecoration:"none", zIndex:10, transition:"color 0.18s ease" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.36)")}
        >
          <i className="fas fa-arrow-left" style={{ fontSize:10 }} />
          Back to Home
        </Link>

        {/* Centred content */}
        <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:640, margin:"0 auto", padding:"32px 24px 0", textAlign:"center" }}>

          {/* Eyebrow chip */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px 6px 11px",
            borderRadius:999, border:"1px solid rgba(201,136,58,0.30)",
            background:"rgba(201,136,58,0.10)", backdropFilter:"blur(8px)",
            marginBottom:20, animation: pref ? "none" : "lmac-fadeUp 0.5s ease both",
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:GOLD, boxShadow:"0 0 0 3px rgba(201,136,58,0.26)", animation:"lmac-pulse 2s ease-in-out infinite", flexShrink:0 }} />
            <i className="fas fa-graduation-cap" style={{ fontSize:10, color:GOLD }} />
            <span style={{ fontSize:10.5, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:GOLD }}>
              XERXEZ Academy
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize:"clamp(28px,4.8vw,50px)", fontWeight:900, color:"#fff", margin:"0 0 12px", lineHeight:1.1, letterSpacing:"-0.03em", animation: pref ? "none" : "lmac-fadeUp 0.6s ease 0.1s both" }}>
            Learn from the<br />
            <span style={{ background:`linear-gradient(90deg,${AMBER} 0%,${GOLD} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", display:"inline-block" }}>
              Best in the Industry
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.48)", margin:"0 auto 28px", maxWidth:440, lineHeight:1.65, animation: pref ? "none" : "lmac-fadeUp 0.6s ease 0.2s both" }}>
            Expert-led courses in AI, ML, and enterprise software engineering.
          </p>

          {/* Search bar */}
          <div style={{ position:"relative", maxWidth:520, margin:"0 auto 28px", animation: pref ? "none" : "lmac-fadeUp 0.6s ease 0.3s both" }}>
            <i className="fas fa-search" style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", fontSize:13, color: searchFocused ? GOLD : "#9ca3af", transition:"color 0.2s ease", pointerEvents:"none" }} />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, topics, technologies…"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width:"100%", padding:"15px 18px 15px 46px",
                borderRadius:14,
                border:`2px solid ${searchFocused ? GOLD : "transparent"}`,
                fontSize:14.5, fontFamily:FF, outline:"none",
                background: searchFocused ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.92)",
                boxShadow: searchFocused
                  ? `0 4px 24px rgba(201,136,58,0.26),0 0 0 2px rgba(201,136,58,0.14)`
                  : "0 4px 24px rgba(0,0,0,0.22)",
                transition:"border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                boxSizing:"border-box", color:"#141413",
              }}
            />
          </div>

          {/* Quick stats */}
          <div style={{ display:"inline-flex", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, overflow:"hidden", background:"rgba(255,255,255,0.03)", backdropFilter:"blur(8px)", animation: pref ? "none" : "lmac-fadeUp 0.6s ease 0.4s both" }}>
            {[
              { val: String(courses.length), label: "Courses" },
              { val: totalStudents > 0 ? `${totalStudents}+` : "Open", label: "Students" },
              { val: "Expert", label: "Instructors" },
            ].map((s, i) => (
              <div key={s.label} style={{ padding:"11px 24px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.09)" : "none", textAlign:"center" }}>
                <div style={{ fontSize:17, fontWeight:800, color:"#fff", lineHeight:1.1 }}>{s.val}</div>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.34)", textTransform:"uppercase", letterSpacing:"0.07em", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STICKY FILTER BAR ══ */}
      <div style={{ position:"sticky", top:0, zIndex:90, background:"rgba(255,255,255,0.96)", backdropFilter:"blur(14px)", borderBottom:"1px solid rgba(0,0,0,0.08)", boxShadow:"0 2px 14px rgba(0,0,0,0.07)", padding:"12px 28px", display:"flex", gap:10, alignItems:"center", overflowX:"auto" }}>
        <i className="fas fa-sliders-h" style={{ fontSize:13, color:"rgba(20,20,19,0.38)", flexShrink:0 }} />
        <span style={{ fontSize:11, fontWeight:700, color:"rgba(20,20,19,0.42)", flexShrink:0, textTransform:"uppercase", letterSpacing:"0.07em" }}>Level:</span>
        {["all","beginner","intermediate","advanced"].map(l => (
          <button key={l} onClick={() => setLevel(l)} style={{
            fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:999,
            cursor:"pointer", flexShrink:0, fontFamily:FF,
            border:`1.5px solid ${level === l ? GOLD : "rgba(0,0,0,0.10)"}`,
            background: level === l ? "rgba(201,136,58,0.10)" : "transparent",
            color: level === l ? GOLD : "rgba(20,20,19,0.52)",
            transition:"all 0.18s ease",
          }}>
            {l === "all" ? "All Levels" : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
        <div style={{ width:1, height:18, background:"rgba(0,0,0,0.09)", flexShrink:0, margin:"0 4px" }} />
        <span style={{ fontSize:11, fontWeight:700, color:"rgba(20,20,19,0.42)", flexShrink:0, textTransform:"uppercase", letterSpacing:"0.07em" }}>Category:</span>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:999,
            cursor:"pointer", flexShrink:0, fontFamily:FF,
            border:`1.5px solid ${category === c ? GOLD : "rgba(0,0,0,0.10)"}`,
            background: category === c ? "rgba(201,136,58,0.10)" : "transparent",
            color: category === c ? GOLD : "rgba(20,20,19,0.52)",
            transition:"all 0.18s ease",
          }}>
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {/* ══ COURSE GRID ══ */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"36px 24px 72px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <span style={{ fontSize:13.5, fontWeight:800, color:"#141413", fontFamily:FF }}>
              {loading ? "Loading courses…" : `${filtered.length} Course${filtered.length !== 1 ? "s" : ""}`}
            </span>
            {!loading && filtered.length < courses.length && (
              <span style={{ fontSize:12, color:"rgba(20,20,19,0.44)", marginLeft:8 }}>of {courses.length} total</span>
            )}
          </div>
          <Link to="/lma/login" style={{ fontSize:12.5, fontWeight:700, color:GOLD, textDecoration:"none", display:"flex", alignItems:"center", gap:5, fontFamily:FF }}>
            Sign in to enroll <ChevronRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:22 }}>
            {[0,1,2].map(i => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"72px 24px", background:"#fff", borderRadius:20, border:"1px solid rgba(0,0,0,0.07)" }}>
            <BookOpen size={44} color="#d1d5db" style={{ display:"block", margin:"0 auto 16px" }} />
            <p style={{ fontSize:15, fontWeight:700, color:"#374151", margin:"0 0 6px", fontFamily:FF }}>
              {search || level !== "all" || category !== "all" ? "No courses match your filters" : "No courses yet"}
            </p>
            <p style={{ fontSize:13, color:"#9ca3af", margin:0, fontFamily:FF }}>
              {search || level !== "all" || category !== "all"
                ? "Try clearing some filters or searching with different keywords."
                : "Check back soon — new courses are added regularly."}
            </p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:22 }}>
            {filtered.map((c, i) => <CourseCard key={c.id} course={c} idx={i} />)}
          </div>
        )}
      </div>

      <style>{`
        @keyframes lmac-fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lmac-float1  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(26px,-38px)} }
        @keyframes lmac-float2  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,30px)} }
        @keyframes lmac-float3  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-18px)} }
        @keyframes lmac-orbit   { to{transform:translateY(-50%) rotate(360deg)} }
        @keyframes lmac-pulse   { 0%,100%{box-shadow:0 0 0 3px rgba(201,136,58,0.26)} 50%{box-shadow:0 0 0 6px rgba(201,136,58,0.07)} }
        @keyframes lmac-diamond { 0%,100%{transform:rotate(45deg) translateY(0)} 50%{transform:rotate(45deg) translateY(-10px)} }
        @keyframes lmac-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @media (max-width:640px) {
          section { min-height:auto !important; padding:56px 0 56px !important; }
        }
        @media (prefers-reduced-motion:reduce) {
          * { animation:none !important; transition-duration:0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
