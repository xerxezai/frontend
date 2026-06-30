import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { projectsData } from "../../data";
import Image from "../utils/Image";

// ── Brand tokens ──────────────────────────────────────────────────────────
const C  = "#cc785c";
const CG = "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)";
const OG = "#C9883A";

// ── Motion safety ─────────────────────────────────────────────────────────
const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Filter config ─────────────────────────────────────────────────────────
type FilterKey = "All" | "ERP" | "MLOps" | "SecOps" | "Cloud";

const FILTERS: { key: FilterKey; label: string; match: string[] }[] = [
  { key: "All",    label: "All Projects", match: [] },
  { key: "ERP",    label: "ERP",          match: ["AI & ERP"] },
  { key: "MLOps",  label: "MLOps",        match: ["MLOPS"] },
  { key: "SecOps", label: "SecOps",       match: ["DEVSECOPS"] },
  { key: "Cloud",  label: "Cloud",        match: ["CLOUD"] },
];

// ── Project metadata ───────────────────────────────────────────────────────
const projectMeta: Record<string, { desc: string; tags: string[] }> = {
  "ai-erp-platform":          { desc: "End-to-end AI ERP deployment with automated workflows and real-time business intelligence across all units.", tags: ["Python", "TensorFlow", "SAP", "Azure"] },
  "mlops-pipeline":           { desc: "Scalable MLOps automation pipeline that cut model deployment cycles from weeks to hours.", tags: ["Kubernetes", "MLflow", "Python", "AWS"] },
  "cloud-infrastructure":     { desc: "Zero-trust cloud architecture achieving 99.9% uptime with continuous compliance monitoring.", tags: ["Terraform", "AWS", "K8s", "Vault"] },
  "enterprise-saas":          { desc: "Multi-tenant SaaS platform serving 500+ enterprise clients at 99.95% availability SLA.", tags: ["React", "Node.js", "PostgreSQL", "GCP"] },
  "ai-training-program":      { desc: "Upskilled 1,200+ corporate professionals in AI/ML fundamentals and applied LLM engineering.", tags: ["Python", "Jupyter", "LangChain", "OpenAI"] },
  "digital-transformation":   { desc: "Digital transformation roadmap that reduced operational costs by 38% across a 10,000-person organisation.", tags: ["Agile", "TOGAF", "AWS", "Power BI"] },
  "supply-chain-ai":          { desc: "AI-driven supply chain optimisation cutting inventory costs by 28% and improving fulfilment speed.", tags: ["PySpark", "Snowflake", "Python", "Azure"] },
  "kubernetes-security":      { desc: "Hardened Kubernetes clusters across 3 cloud providers, achieving SOC 2 Type II certification.", tags: ["K8s", "Falco", "OPA", "AWS"] },
  "fraud-detection-mlops":    { desc: "Real-time fraud detection processing 10M+ daily transactions at sub-100ms latency.", tags: ["Kafka", "PyTorch", "Flink", "GCP"] },
  "multi-cloud-finops":       { desc: "FinOps platform delivering $4M+ in annual cloud savings across AWS, Azure, and GCP.", tags: ["Terraform", "Python", "Grafana", "Azure"] },
  "iot-data-platform":        { desc: "IoT data management platform ingesting 2B+ events daily with predictive maintenance features.", tags: ["MQTT", "TimescaleDB", "React", "Rust"] },
  "llm-engineering-bootcamp": { desc: "Intensive LLM engineering programme graduating 300+ engineers into production-ready AI roles.", tags: ["Python", "LangChain", "OpenAI", "Pinecone"] },
};


// ── Count-up hook ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, active = false) {
  const [v, setV] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setV(Math.round(e * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);
  return v;
}

// ── 3D Wireframe Cube ─────────────────────────────────────────────────────
const WireframeCube: React.FC<{ size?: number }> = ({ size = 180 }) => {
  const h = size / 2;
  const face = (transform: string): React.CSSProperties => ({
    position: "absolute", width: size, height: size,
    border: "1px solid rgba(201,136,58,0.30)",
    background: "rgba(201,136,58,0.02)",
    transform,
  });
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d", animation: prefersReduced ? "none" : "xzCubeRotate 28s linear infinite" }}>
      <div style={face(`translateZ(${h}px)`)} />
      <div style={face(`rotateY(180deg) translateZ(${h}px)`)} />
      <div style={face(`rotateY(-90deg) translateZ(${h}px)`)} />
      <div style={face(`rotateY(90deg) translateZ(${h}px)`)} />
      <div style={face(`rotateX(90deg) translateZ(${h}px)`)} />
      <div style={face(`rotateX(-90deg) translateZ(${h}px)`)} />
    </div>
  );
};

// ── Hero 3D Background ────────────────────────────────────────────────────
const HeroBackground: React.FC = () => (
  <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    {/* Ambient orange glow top-left */}
    <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.15) 0%,transparent 60%)", animation: prefersReduced ? "none" : "xzOrbDrift1 18s ease-in-out infinite" }} />
    {/* Ambient coral glow bottom-right */}
    <div style={{ position: "absolute", bottom: "-15%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,120,92,0.12) 0%,transparent 60%)", animation: prefersReduced ? "none" : "xzOrbDrift2 22s ease-in-out infinite" }} />
    {/* Dot grid texture */}
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
    {/* Large rotating cube — desktop only via CSS class */}
    <div className="xz-cube-scene" style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: 200, height: 200, perspective: 700 }}>
      <WireframeCube size={200} />
    </div>
    {/* Small cube top-left */}
    <div className="xz-cube-scene" style={{ position: "absolute", left: "4%", top: "18%", width: 80, height: 80, perspective: 350 }}>
      <WireframeCube size={80} />
    </div>
    {/* Floating node dots */}
    {[
      { left: "22%", top: "25%", size: 6, color: OG, delay: "0s" },
      { left: "45%", top: "70%", size: 4, color: C, delay: "1.2s" },
      { left: "68%", top: "20%", size: 5, color: OG, delay: "2.4s" },
      { left: "80%", top: "60%", size: 3, color: "rgba(255,255,255,0.5)", delay: "0.8s" },
      { left: "12%", top: "65%", size: 4, color: C, delay: "1.8s" },
      { left: "55%", top: "40%", size: 3, color: OG, delay: "3s" },
    ].map((n, i) => (
      <div key={i} style={{
        position: "absolute", left: n.left, top: n.top,
        width: n.size, height: n.size, borderRadius: "50%",
        background: n.color,
        boxShadow: `0 0 ${n.size * 3}px ${n.color}`,
        animation: prefersReduced ? "none" : `xzNodePulse 3s ease-in-out ${n.delay} infinite`,
      }} />
    ))}
    {/* Horizontal scan line */}
    <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(201,136,58,0.12),transparent)", animation: prefersReduced ? "none" : "xzScanLine 8s ease-in-out infinite", top: "50%" }} />
  </div>
);

// ── Stat tile ─────────────────────────────────────────────────────────────
const StatTile: React.FC<{ raw: number; suffix: string; label: string; active: boolean; index: number }> = ({ raw, suffix, label, active, index }) => {
  const val = useCountUp(raw, 1400, active);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.12 }}
      style={{
        textAlign: "center", padding: "18px 28px",
        borderLeft: index > 0 ? "1px solid rgba(255,255,255,0.10)" : "none",
      }}
    >
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 700, color: OG, lineHeight: 1 }}>
        {val}{suffix}
      </div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginTop: 6 }}>
        {label}
      </div>
    </motion.div>
  );
};

// ── Hero Section ──────────────────────────────────────────────────────────
const HeroSection: React.FC = () => {
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsActive(true); obs.disconnect(); } }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const statNums: { raw: number; suffix: string; label: string }[] = [
    { raw: 50, suffix: "+", label: "Projects Delivered" },
    { raw: 15, suffix: "+", label: "Industries Served" },
    { raw: 120, suffix: "+", label: "Enterprise Clients" },
  ];

  return (
    <section style={{ background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)", padding: "140px 0 100px", position: "relative", overflow: "hidden", minHeight: "62vh", display: "flex", alignItems: "center" }}>
      <HeroBackground />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 680 }}>
          {/* Eyebrow badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 24 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(201,136,58,0.12)", border: "1px solid rgba(201,136,58,0.28)",
              borderRadius: 999, padding: "6px 18px",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
              color: OG, fontFamily: "'DM Sans',sans-serif",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: OG, display: "inline-block", animation: "xzNodePulse 2s ease-in-out infinite" }} />
              Portfolio — Our Work
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(36px,5vw,68px)", lineHeight: 1.06, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.03em" }}
          >
            Results That{" "}
            <em style={{ color: OG, fontStyle: "italic" }}>Speak</em>
            <br />For Themselves
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.78, color: "rgba(255,255,255,0.52)", marginBottom: 40, maxWidth: 520 }}
          >
            From AI-powered ERP to MLOps and DevSecOps — every project here represents a measurable transformation for an enterprise that trusted us to deliver.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}
          >
            <a href="#project-grid" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: CG, color: "#fff", fontWeight: 700, fontSize: 14,
              padding: "13px 28px", borderRadius: 10, textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif",
              boxShadow: "0 4px 0 rgba(150,95,30,0.50), 0 6px 20px rgba(201,136,58,0.30)",
            }}>
              Browse Work <i className="far fa-arrow-down" style={{ fontSize: 12 }} />
            </a>
            <Link to="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.07)", color: "#fff",
              fontWeight: 600, fontSize: 14,
              padding: "13px 28px", borderRadius: 10, textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif",
              border: "1px solid rgba(255,255,255,0.16)",
            }}>
              Start a Project <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
            </Link>
          </motion.div>

          {/* Stats strip */}
          <div ref={statsRef} style={{
            display: "inline-flex", flexWrap: "wrap",
            background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
          }}>
            {statNums.map((s, i) => (
              <StatTile key={s.label} raw={s.raw} suffix={s.suffix} label={s.label} active={statsActive} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Filter Button ─────────────────────────────────────────────────────────
const FilterBtn: React.FC<{ label: string; count: number; active: boolean; onClick: () => void }> = ({ label, count, active, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px",
        borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
        border: active ? "1.5px solid transparent" : `1.5px solid ${hov ? "rgba(201,136,58,0.45)" : "rgba(26,18,8,0.16)"}`,
        background: active ? CG : hov ? "rgba(201,136,58,0.06)" : "rgba(255,255,255,0.8)",
        color: active ? "#fff" : hov ? OG : "#3A3530",
        fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: active ? 700 : 600,
        boxShadow: active ? "0 4px 0 rgba(150,95,30,0.40),0 6px 18px rgba(201,136,58,0.22)" : hov ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
        transform: active ? "translateY(-1px)" : "none",
        transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
        backdropFilter: "blur(6px)",
      }}
    >
      {label}
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 20, height: 20, padding: "0 6px", borderRadius: 999,
        background: active ? "rgba(255,255,255,0.22)" : "rgba(26,18,8,0.07)",
        color: active ? "#fff" : "#6B5E50", fontSize: 11, fontWeight: 700,
        transition: "all 200ms",
      }}>
        {count}
      </span>
    </button>
  );
};

// ── Project Card ──────────────────────────────────────────────────────────
const ProjectCard: React.FC<{ item: typeof projectsData[0] }> = ({ item }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);
  const meta    = projectMeta[item.slug] ?? { desc: "Enterprise-grade solution delivering measurable business outcomes.", tags: ["React", "Python", "AWS"] };

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = cardRef.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width;
    const y  = (e.clientY - r.top)  / r.height;
    el.style.transition = "transform 0.08s linear,box-shadow 0.08s linear";
    el.style.transform  = `perspective(1000px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-8px) scale(1.01)`;
    el.style.boxShadow  = "0 24px 64px rgba(204,120,92,0.22),0 8px 24px rgba(0,0,0,0.10)";
  }, []);

  const onLeave = useCallback(() => {
    if (prefersReduced) return;
    const el  = cardRef.current;
    const img = imgRef.current;
    if (el) {
      el.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1),box-shadow 0.5s ease";
      el.style.transform  = "";
      el.style.boxShadow  = "";
      setTimeout(() => { if (el) el.style.transition = ""; }, 510);
    }
    if (img) img.style.transform = "scale(1)";
  }, []);

  const onEnter = useCallback(() => {
    if (prefersReduced) return;
    const img = imgRef.current;
    if (img) img.style.transform = "scale(1.05)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: "#fff", borderRadius: 18,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        overflow: "hidden", display: "flex", flexDirection: "column", height: "100%",
        cursor: "pointer", willChange: "transform", transformStyle: "preserve-3d",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 218, overflow: "hidden", flexShrink: 0 }}>
        <div ref={imgRef} style={{ width: "100%", height: "100%", transition: "transform 0.45s ease" }}>
          <Image src={item.image} alt={item.title} width={416} height={218}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,10,5,0.55) 0%,transparent 50%)", pointerEvents: "none" }} />
        {/* Category badge */}
        <span style={{
          position: "absolute", top: 14, left: 14,
          background: CG, color: "#fff", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.11em", textTransform: "uppercase",
          padding: "5px 12px", borderRadius: 999,
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 2px 10px rgba(204,120,92,0.40)",
        }}>{item.category}</span>
        {/* Bottom-left title overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 14px" }}>
          <Link to={`/project/${item.slug}`} style={{ color: "#fff", textDecoration: "none" }}>
            <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15, margin: 0, lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {item.title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{
          fontSize: 13.5, color: "#6B6B6B", lineHeight: 1.68,
          marginBottom: 16, fontFamily: "'DM Sans',sans-serif", flex: 1,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        } as React.CSSProperties}>
          {meta.desc}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {meta.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10.5, fontWeight: 600, color: "#5A5A5A",
              background: "#F2EFE9", borderRadius: 6, padding: "4px 9px",
              fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.02em",
              border: "1px solid rgba(0,0,0,0.05)",
            }}>{tag}</span>
          ))}
        </div>

        {/* CTA link */}
        <Link
          to={`/project/${item.slug}`}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C, fontWeight: 700, fontSize: 12.5, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", transition: "gap 0.2s ease" }}
          onMouseEnter={e => (e.currentTarget.style.gap = "10px")}
          onMouseLeave={e => (e.currentTarget.style.gap = "6px")}
        >
          View Case Study <i className="far fa-arrow-right" style={{ fontSize: 10 }} />
        </Link>
      </div>
    </div>
  );
};

// ── Empty state ────────────────────────────────────────────────────────────
const EmptyFilter: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "72px 24px" }}>
    <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(201,136,58,0.08)", border: "1px solid rgba(201,136,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
      <i className="fas fa-folder-open" style={{ fontSize: 26, color: OG }} />
    </div>
    <h4 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>No projects in this category</h4>
    <p style={{ fontSize: 14, color: "#6B6B6B", fontFamily: "'DM Sans',sans-serif", marginBottom: 20 }}>More case studies are on the way.</p>
    <button onClick={onReset} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: CG, color: "#fff", fontWeight: 600, fontSize: 13, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 0 rgba(150,95,30,0.4)" }}>
      Show all projects <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
    </button>
  </motion.div>
);

// ── Bottom CTA ────────────────────────────────────────────────────────────
const BottomCTA: React.FC = () => (
  <section style={{ background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)", padding: "80px 0", position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.12) 0%,transparent 65%)", pointerEvents: "none" }} />
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
    <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div style={{ marginBottom: 22 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,136,58,0.14)", border: "1px solid rgba(201,136,58,0.30)", borderRadius: 999, padding: "6px 18px", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5B460", fontFamily: "'DM Sans',sans-serif" }}>
            <i className="fas fa-file-alt" style={{ fontSize: 10 }} />
            Case Study Available
          </span>
        </div>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(26px,4vw,44px)", color: "#fff", letterSpacing: "-0.03em", marginBottom: 14 }}>
          See How We Delivered{" "}
          <em style={{ color: OG, fontStyle: "italic" }}>$4M in Savings</em>
        </h2>
        <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif", marginBottom: 34 }}>
          Download our latest enterprise case study. AI-powered cloud transformation from plan to production in 90 days.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: CG, color: "#fff", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.30)" }}>
            Get the Case Study <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
          </Link>
          <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, fontSize: 14, padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", border: "1px solid rgba(255,255,255,0.18)" }}>
            Talk to Us <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

// ── Main ──────────────────────────────────────────────────────────────────
const ProjectMainSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const filteredData = useMemo(() => {
    const f = FILTERS.find(f => f.key === activeFilter);
    if (!f || f.match.length === 0) return projectsData;
    return projectsData.filter(p => f.match.includes(p.category));
  }, [activeFilter]);

  const { totalPages, currentItems } = useMemo(() => {
    const tp    = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return { totalPages: tp, currentItems: filteredData.slice(start, start + ITEMS_PER_PAGE) };
  }, [filteredData, currentPage]);

  const handleFilter = useCallback((key: FilterKey) => {
    setActiveFilter(key);
    setCurrentPage(1);
  }, []);

  const countFor = (f: typeof FILTERS[0]) =>
    f.match.length === 0 ? projectsData.length : projectsData.filter(p => f.match.includes(p.category)).length;

  return (
    <>
      {/* ── Global keyframe styles ── */}
      <style>{`
        @keyframes xzCubeRotate {
          0%   { transform: rotateX(18deg) rotateY(0deg) rotateZ(0deg); }
          33%  { transform: rotateX(24deg) rotateY(120deg) rotateZ(4deg); }
          66%  { transform: rotateX(14deg) rotateY(240deg) rotateZ(-3deg); }
          100% { transform: rotateX(18deg) rotateY(360deg) rotateZ(0deg); }
        }
        @keyframes xzOrbDrift1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(30px,-40px) scale(1.12); }
        }
        @keyframes xzOrbDrift2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-24px,32px) scale(0.92); }
        }
        @keyframes xzNodePulse {
          0%,100% { opacity:0.4; transform:scale(1); }
          50%     { opacity:1;   transform:scale(1.5); }
        }
        @keyframes xzScanLine {
          0%,100% { opacity:0; top:20%; }
          50%     { opacity:1; top:80%; }
        }
        /* Hide heavy 3D on mobile for performance */
        @media (max-width: 767px) {
          .xz-cube-scene { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .xz-cube-scene * { animation: none !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Filter + Grid ── */}
      <section id="project-grid" style={{ background: "#F2EFE9", padding: "70px 0 90px" }}>
        <div className="container">

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 44 }}
          >
            {FILTERS.map(f => (
              <FilterBtn key={f.key} label={f.label} count={countFor(f)} active={activeFilter === f.key} onClick={() => handleFilter(f.key)} />
            ))}
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#8A7D6E", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, whiteSpace: "nowrap" }}>
              {filteredData.length} project{filteredData.length !== 1 ? "s" : ""}
            </span>
          </motion.div>

          {/* Card grid with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + "-" + currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {currentItems.length === 0 ? (
                <EmptyFilter onReset={() => handleFilter("All")} />
              ) : (
                <div className="row g-4">
                  {currentItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="col-xl-4 col-lg-4 col-md-6 col-12"
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProjectCard item={item} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="page-nav-wrap mt-5 text-center">
              <ul>
                <li>
                  <a className={`page-numbers${currentPage === 1 ? " disabled-btn" : ""}`} href="#"
                    onClick={e => { e.preventDefault(); if (currentPage > 1) setCurrentPage(p => p - 1); }}>
                    <i className="fal fa-long-arrow-left" />
                  </a>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page}>
                    <a className={`page-numbers${currentPage === page ? " active" : ""}`} href="#"
                      onClick={e => { e.preventDefault(); setCurrentPage(page); }}>
                      {page.toString().padStart(2, "0")}
                    </a>
                  </li>
                ))}
                <li>
                  <a className={`page-numbers${currentPage === totalPages ? " disabled-btn" : ""}`} href="#"
                    onClick={e => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1); }}>
                    <i className="fal fa-long-arrow-right" />
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <BottomCTA />
    </>
  );
};

export default ProjectMainSection;
