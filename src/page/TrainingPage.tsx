import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CustomLayout from "../components/layout/CustomLayout";
import XzHeroSection from "../components/common/XzHeroSection";

/* ── Brand tokens ── */
const GOLD   = "#C9883A";
const AMBER  = "#E8A84E";
const DARK   = "#0a0806";
const DARK2  = "#100c07";
const CREAM2 = "#FDFCFB";

/* ── Scroll-reveal hook ── */
const useReveal = (delay = 0, threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, threshold]);
  return ref;
};

/* ── 3D tilt utilities ── */
const makeTiltHandlers = (el: HTMLDivElement | null, dark = false) => ({
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(800px) rotateX(${(0.5-y)*10}deg) rotateY(${(x-0.5)*10}deg) translateY(-5px)`;
    el.style.transition = "transform 0.10s ease, box-shadow 0.10s ease";
    el.style.boxShadow = dark
      ? "0 24px 56px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(201,136,58,0.42)"
      : "0 20px 48px rgba(0,0,0,0.11), 0 0 0 1.5px rgba(201,136,58,0.30)";
  },
  onMouseLeave: () => {
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
    el.style.transition = "transform 0.28s ease, box-shadow 0.28s ease";
    el.style.boxShadow = dark
      ? "0 4px 28px rgba(0,0,0,0.42)"
      : "0 4px 22px rgba(0,0,0,0.07)";
  },
});

/* ── Eyebrow ── */
const Eyebrow = ({ label }: { label: string }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
    <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, display: "block" }} />
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, fontFamily: "'DM Sans', sans-serif" }}>
      {label}
    </span>
    <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, display: "block" }} />
  </div>
);

/* ══════════════════════════════════════════════
   SECTION 1 — DARK: HERO DATA
   (rendered by XzHeroSection — dark by default)
══════════════════════════════════════════════ */
const TRAINING_CASCADE_A = [
  "LLM Engineering Mastery", "MLOps & Model Deployment", "Cloud Architecture Pro",
  "DevSecOps Fundamentals", "AI Automation Workflows", "Enterprise AI Strategy",
  "Prompt Engineering", "Production ML Systems", "Data Engineering at Scale",
];
const TRAINING_CASCADE_B = [
  "300+ Certified Engineers", "95% Satisfaction Rate", "500+ Professionals Trained",
  "12+ Active Programs", "60-hour Intensives", "Hands-On Projects Only",
  "Cohort-Based Learning", "Certificate Recognised", "July 2026 Cohort Open",
];

const CohortCard = () => {
  const [barW, setBarW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setBarW(68), 500); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(155deg,#fdf9f4 0%,#f0e4d0 100%)",
      border: "1px solid rgba(201,136,58,0.18)",
      borderTop: "3px solid #C9883A",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95),0 8px 0 rgba(130,82,24,0.32),0 20px 60px rgba(0,0,0,0.18)",
      padding: "26px 24px 22px", position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden="true" style={{ position:"absolute", top:-50, right:-50, width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,136,58,0.13) 0%,transparent 68%)", pointerEvents:"none" }} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={{ width:50, height:50, borderRadius:14, background:"linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)", boxShadow:"0 4px 0 rgba(140,88,22,0.50),0 8px 18px rgba(201,136,58,0.38)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <i className="fas fa-graduation-cap" style={{ color:"#fff", fontSize:21 }} />
        </div>
        <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(201,136,58,0.09)", border:"1px solid rgba(201,136,58,0.26)", borderRadius:20, padding:"4px 11px", fontSize:10, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", color:GOLD, fontFamily:"'DM Sans',sans-serif" }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 6px rgba(74,222,128,0.75)", display:"inline-block" }} />
          Enrolling Now
        </span>
      </div>
      <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#cc785c", fontFamily:"'DM Sans',sans-serif", marginBottom:4 }}>Next Cohort · July 2026</p>
      <h4 style={{ fontSize:20, fontWeight:800, color:"#1A1208", lineHeight:1.18, fontFamily:"'DM Sans',sans-serif", marginBottom:8, letterSpacing:"-0.02em" }}>AI Practitioner<br />Program</h4>
      <p style={{ fontSize:12.5, color:"#5C5047", lineHeight:1.65, fontFamily:"'DM Sans',sans-serif", marginBottom:18 }}>
        Hands-on, certification-backed training for enterprise AI practitioners — live labs, real projects, no filler.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, marginBottom:16 }}>
        {[{icon:"fas fa-chalkboard-teacher",label:"Format",val:"Live + Labs"},{icon:"far fa-clock",label:"Duration",val:"8 Weeks"},{icon:"fas fa-users",label:"Cohort",val:"≤25 Seats"}].map(d=>(
          <div key={d.label} style={{ background:"rgba(255,255,255,0.80)", border:"1px solid rgba(201,136,58,0.14)", borderRadius:11, padding:"10px 7px", textAlign:"center" }}>
            <i className={d.icon} style={{ color:GOLD, fontSize:11, marginBottom:5, display:"block" }} />
            <div style={{ fontSize:12, fontWeight:700, color:"#1A1208", fontFamily:"'DM Sans',sans-serif", lineHeight:1 }}>{d.val}</div>
            <div style={{ fontSize:9, color:"#8B7A6A", fontFamily:"'DM Sans',sans-serif", marginTop:3, letterSpacing:"0.06em", textTransform:"uppercase" }}>{d.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"rgba(255,255,255,0.65)", border:"1px solid rgba(201,136,58,0.14)", borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
          <span style={{ fontSize:11, fontWeight:600, color:"#5C5047", fontFamily:"'DM Sans',sans-serif" }}>Seats Filled</span>
          <span style={{ fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>
            <span style={{ fontWeight:700, color:"#1A1208" }}>17</span>
            <span style={{ color:"#A09080" }}> / 25 — </span>
            <span style={{ fontWeight:700, color:"#d64f38" }}>8 left</span>
          </span>
        </div>
        <div style={{ height:5, background:"rgba(0,0,0,0.09)", borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${barW}%`, background:`linear-gradient(90deg,${AMBER} 0%,${GOLD} 100%)`, borderRadius:3, boxShadow:"0 0 8px rgba(201,136,58,0.55)", transition:"width 1.3s cubic-bezier(0.22,1,0.36,1)" }} />
        </div>
      </div>
      <Link to="/contact" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:`linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`, color:"#fff", fontWeight:700, fontSize:14, padding:"13px 20px", borderRadius:12, textDecoration:"none", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 0 rgba(130,78,18,0.50),0 8px 24px rgba(201,136,58,0.40)", marginBottom:14 }}>
        Reserve Your Seat <i className="far fa-arrow-right" style={{ fontSize:12 }} />
      </Link>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
        {[{icon:"fas fa-certificate",text:"CPD Accredited"},{icon:"far fa-clock",text:"Closes 30 Jun"}].map(t=>(
          <React.Fragment key={t.text}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <i className={t.icon} style={{ color:GOLD, fontSize:10 }} />
              <span style={{ fontSize:11, color:"#8B7A6A", fontFamily:"'DM Sans',sans-serif" }}>{t.text}</span>
            </div>
            {t.text === "CPD Accredited" && <span style={{ color:"rgba(0,0,0,0.15)", fontSize:14 }}>·</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   SECTION 2 — LIGHT: Featured Courses
══════════════════════════════════════════════ */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://backend-production-b9f2.up.railway.app/api/v1";

interface ApiCourse {
  id: number; title: string; description: string; category: string; level: string;
  price: number; badge: string; header_color: string; rating: number;
  total_students: number; hours: number; lessons: number; tech_stack: string[];
  instructor_name: string;
}

const ICON_MAP: Record<string, string> = {
  "AI & ML": "fas fa-brain",
  "DevSecOps & AI": "fas fa-shield-alt",
  "Web Development": "fas fa-code",
  "Data Science": "fas fa-chart-bar",
  "Cloud & DevOps": "fas fa-cloud",
};

const BADGE_COLOR_MAP: Record<string, string> = {
  BESTSELLER: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
  NEW: "linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)",
  HOT: "linear-gradient(135deg,#e63757 0%,#c42d48 100%)",
};
const LEVEL_COLOR_MAP: Record<string, string> = {
  beginner: "#10b981", intermediate: GOLD, advanced: "#e63757",
};

const CourseCard = ({ course, index }: { course: ApiCourse; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(36px)";
    el.style.transition = `opacity 0.65s ease ${index * 130}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 130}ms`;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity="1"; el.style.transform="translateY(0)"; obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const tilt = makeTiltHandlers(cardRef.current, true);

  return (
    <div
      ref={cardRef}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={() => { tilt.onMouseLeave(); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      style={{
        background: "linear-gradient(160deg, #1E1309 0%, #130D06 100%)",
        borderRadius: 22,
        border: `1px solid ${hov ? "rgba(201,136,58,0.55)" : "rgba(201,136,58,0.14)"}`,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        height: "100%", position: "relative",
        transformStyle: "preserve-3d",
        willChange: "transform",
        boxShadow: hov
          ? "0 0 0 1px rgba(201,136,58,0.28), 0 24px 64px rgba(0,0,0,0.60), 0 0 48px rgba(201,136,58,0.07)"
          : "0 4px 32px rgba(0,0,0,0.50)",
        transition: "border-color 0.30s ease, box-shadow 0.30s ease",
        cursor: "default",
      }}
    >
      {/* Gold top line on hover */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 3, pointerEvents: "none",
        background: hov ? `linear-gradient(90deg, transparent 0%, ${GOLD} 40%, ${AMBER} 60%, transparent 100%)` : "transparent",
        transition: "background 0.35s ease",
      }} />

      {/* Ambient corner glow */}
      <div style={{
        position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", pointerEvents: "none",
        background: hov
          ? "radial-gradient(circle, rgba(201,136,58,0.14) 0%, transparent 68%)"
          : "radial-gradient(circle, rgba(201,136,58,0.05) 0%, transparent 68%)",
        transition: "background 0.35s ease",
      }} />

      {/* Badge */}
      {course.badge && (
        <span style={{
          position: "absolute", top: 18, right: 18, zIndex: 4,
          background: BADGE_COLOR_MAP[course.badge] ?? `linear-gradient(135deg,${AMBER},${GOLD})`,
          color: "#fff", fontSize: 9.5, fontWeight: 800, padding: "4px 11px",
          borderRadius: 999, letterSpacing: "0.09em",
          textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 2px 10px rgba(0,0,0,0.40)",
        }}>
          {course.badge}
        </span>
      )}

      {/* Icon header */}
      <div style={{ padding: "28px 28px 20px", position: "relative" }}>
        <div style={{
          width: 58, height: 58, borderRadius: 16,
          background: `linear-gradient(145deg, rgba(232,168,78,0.16) 0%, rgba(201,136,58,0.07) 100%)`,
          border: `1px solid ${hov ? "rgba(201,136,58,0.50)" : "rgba(201,136,58,0.22)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: hov ? "0 0 22px rgba(201,136,58,0.22)" : "none",
          transition: "border-color 0.30s ease, box-shadow 0.30s ease, transform 0.30s ease",
          transform: hov ? "scale(1.06) translateY(-2px)" : "scale(1)",
        }}>
          <i className={ICON_MAP[course.category] ?? "fas fa-book"} style={{ color: GOLD, fontSize: 23 }} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 28px 20px", flex: 1, position: "relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: GOLD,
            background: "rgba(201,136,58,0.10)", border: "1px solid rgba(201,136,58,0.22)",
            padding: "3px 10px", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.03em",
          }}>
            {course.category}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: LEVEL_COLOR_MAP[course.level] ?? GOLD,
            fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize",
          }}>
            {course.level}
          </span>
        </div>
        <h3 style={{
          fontSize: 20, fontWeight: 800,
          color: hov ? "#fff" : "rgba(248,244,238,0.92)",
          lineHeight: 1.25, marginBottom: 12,
          fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.01em",
          transition: "color 0.25s ease",
        }}>
          {course.title}
        </h3>
        <p style={{
          fontSize: 13.5, color: "rgba(248,244,238,0.40)",
          lineHeight: 1.72, marginBottom: 18, fontFamily: "'DM Sans',sans-serif",
        }}>
          {course.description}
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {(course.tech_stack ?? []).slice(0, 4).map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 600, color: "rgba(201,136,58,0.75)",
              background: "rgba(201,136,58,0.08)", border: "1px solid rgba(201,136,58,0.16)",
              borderRadius: 6, padding: "3px 9px", fontFamily: "'DM Sans',sans-serif",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 28px 24px",
        borderTop: "1px solid rgba(201,136,58,0.10)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap", position: "relative",
      }}>
        <div style={{ display:"flex", gap:16, fontSize:12.5, color:"rgba(248,244,238,0.38)", fontFamily:"'DM Sans',sans-serif" }}>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <i className="far fa-clock" style={{ color: GOLD }} /> {course.hours}h
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <i className="fas fa-play-circle" style={{ color: GOLD }} /> {course.lessons} lessons
          </span>
        </div>
        <Link to={`/lma/courses/${course.id}`} style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: `linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
          color: "#fff", fontSize: 13, fontWeight: 700,
          padding: "9px 20px", borderRadius: 9, textDecoration: "none",
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 3px 0 rgba(130,78,18,0.50), 0 6px 18px rgba(201,136,58,0.30)",
          transition: "box-shadow 0.25s ease",
        }}>
          Enroll Now <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
        </Link>
      </div>
    </div>
  );
};

const CoursesSection = () => {
  const headRef = useReveal(0);
  const [apiCourses, setApiCourses] = useState<ApiCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/lma/courses/`)
      .then(r => r.json())
      .then(d => { const list = Array.isArray(d) ? d : d.results ?? []; setApiCourses(list.slice(0, 4)); })
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, []);

  return (
    <section style={{ background: `linear-gradient(180deg, ${DARK} 0%, ${DARK2} 100%)`, padding:"100px 0", position:"relative", overflow:"hidden" }}>
      {/* Subtle dot grid */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"radial-gradient(circle,rgba(201,136,58,0.05) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
      {/* Center ambient glow */}
      <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:800, height:400, background:"radial-gradient(ellipse 55% 45% at 50% 20%, rgba(201,136,58,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div className="container" style={{ position:"relative", zIndex:1 }}>
        <div ref={headRef} style={{ textAlign:"center", marginBottom:68 }}>
          <Eyebrow label="What We Offer" />
          <h2 style={{ fontSize:"clamp(28px,3.8vw,50px)", fontWeight:800, color:"rgba(248,244,238,0.95)", lineHeight:1.12, fontFamily:"'DM Sans',sans-serif", margin:"0 auto 16px", maxWidth:560 }}>
            Featured Courses
          </h2>
          <p style={{ color:"rgba(248,244,238,0.42)", fontSize:15, lineHeight:1.65, fontFamily:"'DM Sans',sans-serif", maxWidth:440, margin:"0 auto" }}>
            Practitioner-built programs covering every layer of enterprise AI — from strategy to shipping.
          </p>
        </div>
        {loadingCourses ? (
          <div style={{ display:"flex", justifyContent:"center", padding:"40px 0" }}>
            <div style={{ width:32, height:32, border:`3px solid rgba(201,136,58,0.15)`, borderTop:`3px solid ${GOLD}`, borderRadius:"50%", animation:"tp-spin 0.8s linear infinite" }} />
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {apiCourses.map((course, i) => (
              <div key={course.id} className="col-lg-6 col-md-10">
                <CourseCard course={course} index={i} />
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign:"center", marginTop:44 }}>
          <Link to="/lma/courses" style={{
            display:"inline-flex", alignItems:"center", gap:8,
            fontSize:14, fontWeight:700, color:GOLD,
            border:`1.5px solid rgba(201,136,58,0.40)`,
            background:"rgba(201,136,58,0.07)",
            padding:"11px 26px", borderRadius:10, textDecoration:"none",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            Browse All Courses <i className="far fa-arrow-right" style={{ fontSize:12 }} />
          </Link>
        </div>
      </div>
      <style>{`@keyframes tp-spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
};

/* ══════════════════════════════════════════════
   SECTION 3 — DARK: Why XERXEZ Training
══════════════════════════════════════════════ */
const features = [
  { icon:"fas fa-user-tie",    title:"Industry Expert Instructors", desc:"Real-world practitioners with 10+ years of enterprise deployment experience. No academics — engineers who've shipped it in production." },
  { icon:"fas fa-laptop-code", title:"Hands-On Projects Only",      desc:"Build real enterprise systems during the course, not toy examples. Every lab uses production-equivalent environments." },
  { icon:"fas fa-certificate", title:"XERXEZ AI Certification",     desc:"Role-specific certificates (AI Engineer, MLOps Practitioner, AI Leader) recognised by 40+ organisations in our network." },
  { icon:"fas fa-users",       title:"Enterprise Batch Training",   desc:"Custom cohort programs for your entire team — 8 to 500 people — delivered at your pace, in-person or virtually." },
];

const FeatureCard = ({ f, index }: { f: typeof features[number]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(36px)";
    el.style.transition = `opacity 0.65s ease ${index * 90}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity="1"; el.style.transform="translateY(0)"; obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const { onMouseMove, onMouseLeave } = makeTiltHandlers(cardRef.current, true);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { onMouseLeave(); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      style={{
        background:"linear-gradient(160deg, rgba(28,18,8,0.95) 0%, rgba(14,9,4,0.98) 100%)",
        border:"1px solid rgba(201,136,58,0.15)",
        borderTop:`2px solid ${hov ? "rgba(201,136,58,0.60)" : "rgba(201,136,58,0.22)"}`,
        borderRadius:20,
        padding:"30px 28px 26px",
        height:"100%",
        position:"relative",
        overflow:"hidden",
        transformStyle:"preserve-3d",
        willChange:"transform",
        boxShadow:"0 4px 28px rgba(0,0,0,0.42)",
        cursor:"default",
        transition:"border-top-color 0.25s ease",
      }}
    >
      {/* Hover glow */}
      <div style={{ position:"absolute", inset:0, background: hov ? "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,136,58,0.07) 0%, transparent 70%)" : "none", pointerEvents:"none", transition:"background 0.30s ease" }} />

      {/* Icon */}
      <div style={{
        width:52, height:52, borderRadius:14, flexShrink:0,
        background:`linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:`0 4px 16px rgba(201,136,58,0.30), inset 0 1px 0 rgba(255,255,255,0.18)`,
        marginBottom:22, position:"relative",
      }}>
        <i className={f.icon} style={{ color:"#fff", fontSize:20 }} />
      </div>

      {/* Text */}
      <h4 style={{ color: hov ? "#fff" : "rgba(240,237,230,0.92)", fontWeight:700, fontSize:18, margin:"0 0 12px", lineHeight:1.3, fontFamily:"'DM Sans',sans-serif", transition:"color 0.25s ease", position:"relative" }}>
        {f.title}
      </h4>
      <p style={{ color: hov ? "rgba(240,237,230,0.65)" : "rgba(240,237,230,0.40)", fontSize:14, lineHeight:1.72, margin:0, fontFamily:"'DM Sans',sans-serif", transition:"color 0.25s ease", position:"relative" }}>
        {f.desc}
      </p>
    </div>
  );
};

const WhySection = () => {
  const headRef = useReveal(0);
  return (
    <section style={{ background:`linear-gradient(180deg,${DARK2} 0%,${DARK} 100%)`, padding:"100px 0", position:"relative", overflow:"hidden" }}>
      {/* Ambient glow */}
      <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:900, height:500, background:"radial-gradient(ellipse 60% 50% at 50% 20%, rgba(201,136,58,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div className="container" style={{ position:"relative", zIndex:1 }}>
        <div ref={headRef} style={{ textAlign:"center", marginBottom:72 }}>
          <Eyebrow label="Our Advantage" />
          <h2 style={{ fontSize:"clamp(28px,3.8vw,50px)", fontWeight:800, color:"rgba(240,237,230,0.95)", lineHeight:1.12, fontFamily:"'DM Sans',sans-serif", margin:"0 auto 16px", maxWidth:560 }}>
            Why XERXEZ Training
          </h2>
          <p style={{ color:"rgba(240,237,230,0.42)", fontSize:15, lineHeight:1.65, fontFamily:"'DM Sans',sans-serif", maxWidth:440, margin:"0 auto" }}>
            The difference between knowing AI and being able to build with it — that's what our programs create.
          </p>
        </div>
        <div className="row g-4">
          {features.map((f, i) => (
            <div key={i} className="col-xl-3 col-lg-6 col-md-6">
              <FeatureCard f={f} index={i} />
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div style={{ marginTop:72, display:"flex", justifyContent:"center", flexWrap:"wrap", gap:0 }}>
          {[
            { val:"500+", label:"Professionals Trained" },
            { val:"95%",  label:"Satisfaction Rate"     },
            { val:"12+",  label:"Active Programs"       },
            { val:"F500", label:"Client Organisations"  },
          ].map((stat, i) => (
            <div key={i} style={{
              textAlign:"center", padding:"28px 48px",
              borderRight: i < 3 ? "1px solid rgba(201,136,58,0.14)" : "none",
            }}>
              <div style={{ fontSize:38, fontWeight:900, background:`linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontFamily:"'DM Sans',sans-serif", lineHeight:1, marginBottom:6 }}>
                {stat.val}
              </div>
              <div style={{ fontSize:12, color:"rgba(240,237,230,0.42)", fontFamily:"'DM Sans',sans-serif", fontWeight:500, letterSpacing:"0.04em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════
   SECTION 4 — LIGHT: Enterprise CTA
══════════════════════════════════════════════ */
const CtaSection = () => {
  const leftRef  = useReveal(0);
  const rightRef = useReveal(140);

  return (
    <section style={{ background: CREAM2, padding:"100px 0", position:"relative", overflow:"hidden" }}>
      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"radial-gradient(circle,rgba(201,136,58,0.07) 1px,transparent 1px)", backgroundSize:"36px 36px" }} />

      <div className="container" style={{ position:"relative", zIndex:1 }}>
        <div className="row align-items-center g-5">

          {/* Left — headline + CTAs */}
          <div className="col-lg-6">
            <div ref={leftRef}>
              <Eyebrow label="For Organisations" />
              <h2 style={{ fontSize:"clamp(28px,3.8vw,52px)", fontWeight:800, color:"#141413", lineHeight:1.1, fontFamily:"'DM Sans',sans-serif", margin:"0 0 20px", letterSpacing:"-0.02em", maxWidth:520 }}>
                Train Your Entire Team —<br />
                <span style={{ color: GOLD }}>We Come to You.</span>
              </h2>
              <p style={{ fontSize:15, color:"rgba(20,20,19,0.52)", lineHeight:1.72, fontFamily:"'DM Sans',sans-serif", marginBottom:36, maxWidth:460 }}>
                Custom enterprise programs for 8 to 500 people. On-site, virtual, or hybrid — built around your team's exact AI priorities, tools, and knowledge gaps.
              </p>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                <Link to="/contact" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:`linear-gradient(135deg,${AMBER} 0%,${GOLD} 100%)`,
                  color:"#0a0806", fontWeight:700, fontSize:14,
                  padding:"13px 28px", borderRadius:10, textDecoration:"none",
                  fontFamily:"'DM Sans',sans-serif",
                  boxShadow:`0 4px 0 rgba(140,80,20,0.42), 0 8px 24px rgba(201,136,58,0.30)`,
                }}>
                  Request Enterprise Training <i className="far fa-arrow-right" style={{ fontSize:12 }} />
                </Link>
                <Link to="/contact" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"transparent",
                  color:"#141413", fontWeight:600, fontSize:14,
                  padding:"13px 24px", borderRadius:10, textDecoration:"none",
                  fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.01em",
                  border:"1px solid rgba(20,20,19,0.18)",
                }}>
                  Contact Us <i className="far fa-arrow-right" style={{ fontSize:12 }} />
                </Link>
              </div>

              {/* Trust pills */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:32 }}>
                {["CPD Accredited","Custom Curriculum","Hands-On Labs","ISO 27001"].map(tag => (
                  <span key={tag} style={{
                    fontSize:11, fontWeight:600, color:GOLD,
                    background:"rgba(201,136,58,0.08)",
                    border:"1px solid rgba(201,136,58,0.20)",
                    borderRadius:999, padding:"5px 14px",
                    fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.04em",
                    display:"inline-flex", alignItems:"center", gap:6,
                  }}>
                    <i className="fas fa-check" style={{ fontSize:9 }} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — impact metrics */}
          <div className="col-lg-6">
            <div ref={rightRef}>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { icon:"fas fa-tachometer-alt", headline:"60% faster", sub:"time-to-deploy first AI feature", bg:"linear-gradient(135deg,rgba(201,136,58,0.12) 0%,rgba(201,136,58,0.05) 100%)", border:"rgba(201,136,58,0.22)" },
                  { icon:"fas fa-chart-line",     headline:"45% less",   sub:"external AI consulting spend in year 1", bg:"linear-gradient(135deg,rgba(63,131,248,0.10) 0%,rgba(63,131,248,0.04) 100%)", border:"rgba(63,131,248,0.18)" },
                  { icon:"fas fa-rocket",          headline:"3× more",    sub:"AI projects reaching production after training", bg:"linear-gradient(135deg,rgba(74,222,128,0.10) 0%,rgba(74,222,128,0.04) 100%)", border:"rgba(74,222,128,0.18)" },
                ].map((m, i) => (
                  <MetricRow key={i} {...m} index={i} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const MetricRow = ({ icon, headline, sub, bg, border, index }: {
  icon: string; headline: string; sub: string; bg: string; border: string; index: number
}) => {
  const ref = useReveal(index * 110 + 200, 0.12);
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:20,
        background: hov ? "#fff" : "#fff",
        border:`1px solid ${hov ? "rgba(201,136,58,0.30)" : "rgba(0,0,0,0.08)"}`,
        borderLeft: `3px solid ${hov ? GOLD : "rgba(201,136,58,0.25)"}`,
        borderRadius:16, padding:"22px 24px",
        boxShadow: hov ? "0 12px 32px rgba(0,0,0,0.09)" : "0 2px 12px rgba(0,0,0,0.05)",
        transition:"border-color 0.25s ease, border-left-color 0.25s ease, box-shadow 0.25s ease",
        cursor:"default",
      }}
    >
      <div style={{
        width:50, height:50, borderRadius:13, flexShrink:0,
        background: bg,
        border:`1px solid ${border}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:18, color: GOLD,
      }}>
        <i className={icon} />
      </div>
      <div>
        <div style={{ fontSize:26, fontWeight:900, color:"#141413", lineHeight:1, fontFamily:"'DM Sans',sans-serif", marginBottom:4 }}>
          {headline}
        </div>
        <div style={{ fontSize:13, color:"rgba(20,20,19,0.50)", fontFamily:"'DM Sans',sans-serif", lineHeight:1.4 }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
const TrainingPage: React.FC = () => (
  <CustomLayout>
    {/* 1. DARK — Hero */}
    <XzHeroSection
      badgeText="AI Training & Upskilling"
      headline={
        <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:"clamp(34px,5vw,64px)", lineHeight:1.08, color:"#fff", margin:0, letterSpacing:"-0.03em" }}>
          Master Enterprise AI<br />
          <em style={{ color:"#cc785c", fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif", fontWeight:700 }}>
            &amp; Cloud Technologies
          </em>
        </h1>
      }
      description="Industry-led training for IT teams and enterprises. Learn AI, DevSecOps, Cloud, and ERP — from practitioners who've shipped it in production."
      ctas={[
        { label:"Browse Courses", href:"#courses", primary:true },
        { label:"Enterprise Training", to:"/contact", primary:false },
      ]}
      stats={[
        { val:"500+", label:"Trained"      },
        { val:"12+",  label:"Programs"     },
        { val:"95%",  label:"Satisfaction" },
      ]}
      cascadeA={TRAINING_CASCADE_A}
      cascadeB={TRAINING_CASCADE_B}
      right={<CohortCard />}
    />

    {/* 2. LIGHT — Featured Courses */}
    <div id="courses"><CoursesSection /></div>

    {/* 3. DARK — Why XERXEZ Training */}
    <WhySection />

    {/* 4. LIGHT — Enterprise CTA */}
    <CtaSection />
  </CustomLayout>
);

export default TrainingPage;
