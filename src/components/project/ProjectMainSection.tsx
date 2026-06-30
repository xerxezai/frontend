import React, { useRef, useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projectsData } from "../../data";
import Image from "../utils/Image";
import XzHeroSection from "../common/XzHeroSection";

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

// ── Project metadata with outcome stats ────────────────────────────────────
const projectMeta: Record<string, { desc: string; tags: string[]; stat: string; statLabel: string }> = {
  "ai-erp-platform":          { desc: "End-to-end AI ERP deployment with automated workflows and real-time business intelligence.", tags: ["Python", "TensorFlow", "SAP", "Azure"],       stat: "$2M",    statLabel: "First-year savings" },
  "mlops-pipeline":           { desc: "Scalable MLOps automation pipeline that cut model deployment cycles from weeks to hours.",  tags: ["Kubernetes", "MLflow", "Python", "AWS"],       stat: "95%",    statLabel: "Faster deployments" },
  "cloud-infrastructure":     { desc: "Zero-trust cloud architecture achieving 99.9% uptime with continuous compliance monitoring.", tags: ["Terraform", "AWS", "K8s", "Vault"],          stat: "99.9%",  statLabel: "Uptime achieved" },
  "enterprise-saas":          { desc: "Multi-tenant SaaS platform serving 500+ enterprise clients at 99.95% availability SLA.",    tags: ["React", "Node.js", "PostgreSQL", "GCP"],      stat: "500+",   statLabel: "Enterprise clients" },
  "ai-training-program":      { desc: "Upskilled 1,200+ corporate professionals in AI/ML fundamentals and applied LLM engineering.", tags: ["Python", "Jupyter", "LangChain", "OpenAI"], stat: "1,200+", statLabel: "Engineers trained" },
  "digital-transformation":   { desc: "Digital transformation roadmap that reduced operational costs by 38% across a 10,000-person org.", tags: ["Agile", "TOGAF", "AWS", "Power BI"],  stat: "38%",    statLabel: "Cost reduction" },
  "supply-chain-ai":          { desc: "AI-driven supply chain optimisation cutting inventory costs and improving fulfilment speed.",  tags: ["PySpark", "Snowflake", "Python", "Azure"],  stat: "28%",    statLabel: "Inventory savings" },
  "kubernetes-security":      { desc: "Hardened Kubernetes clusters across 3 cloud providers, achieving SOC 2 Type II certification.", tags: ["K8s", "Falco", "OPA", "AWS"],             stat: "SOC 2",  statLabel: "Type II certified" },
  "fraud-detection-mlops":    { desc: "Real-time fraud detection processing 10M+ daily transactions at sub-100ms latency.",          tags: ["Kafka", "PyTorch", "Flink", "GCP"],         stat: "10M+",   statLabel: "Daily detections" },
  "multi-cloud-finops":       { desc: "FinOps platform delivering $4M+ in annual cloud savings across AWS, Azure, and GCP.",        tags: ["Terraform", "Python", "Grafana", "Azure"],  stat: "$4M+",   statLabel: "Annual cloud savings" },
  "iot-data-platform":        { desc: "IoT data management platform ingesting 2B+ events daily with predictive maintenance.",        tags: ["MQTT", "TimescaleDB", "React", "Rust"],     stat: "2B+",    statLabel: "Events per day" },
  "llm-engineering-bootcamp": { desc: "Intensive LLM engineering programme graduating 300+ engineers into production-ready AI roles.", tags: ["Python", "LangChain", "OpenAI", "Pinecone"], stat: "300+", statLabel: "Engineers certified" },
};

// ── Hero cascade data ─────────────────────────────────────────────────────
const CASCADE_A = [
  "$4M+ Annual cloud savings",
  "99.9% Uptime achieved",
  "$2M First-year ERP savings",
  "38% Cost reduction",
  "10M+ Daily fraud detections",
  "2B+ Events daily",
  "SOC 2 Type II certified",
  "99.97% Model uptime",
  "500+ Enterprise clients",
];

const CASCADE_B = [
  "1,200+ Engineers trained",
  "95% Faster deployments",
  "300+ LLM engineers certified",
  "28% Inventory savings",
  "50M+ Predictions per day",
  "99.95% SLA guaranteed",
  "10,000-person org transformed",
  "3 cloud providers secured",
];

// ── Filter Button ─────────────────────────────────────────────────────────
const FilterBtn: React.FC<{
  label: string; count: number; active: boolean; onClick: () => void;
}> = ({ label, count, active, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-pressed={active}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px",
        borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
        border: active
          ? "1.5px solid transparent"
          : `1.5px solid ${hov ? "rgba(201,136,58,0.50)" : "rgba(26,18,8,0.15)"}`,
        background: active ? CG : hov ? "rgba(201,136,58,0.06)" : "rgba(255,255,255,0.82)",
        color: active ? "#fff" : hov ? OG : "#3A3530",
        fontFamily: "'DM Sans',sans-serif", fontSize: 13,
        fontWeight: active ? 700 : 600,
        boxShadow: active
          ? "0 4px 0 rgba(150,95,30,0.40),0 6px 18px rgba(201,136,58,0.22)"
          : hov ? "0 2px 10px rgba(0,0,0,0.07)" : "none",
        transform: active ? "translateY(-1px)" : "none",
        transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        minHeight: 44,
      }}
    >
      {label}
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 22, height: 22, padding: "0 6px", borderRadius: 999,
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
  const meta    = projectMeta[item.slug] ?? {
    desc: "Enterprise-grade solution delivering measurable business outcomes.",
    tags: ["React", "Python", "AWS"],
    stat: "—", statLabel: "Delivered",
  };

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = cardRef.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width;
    const y  = (e.clientY - r.top)  / r.height;
    el.style.transition = "transform 0.08s linear,box-shadow 0.08s linear";
    el.style.transform  = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-7px)`;
    el.style.boxShadow  = "0 22px 56px rgba(204,120,92,0.18),0 6px 20px rgba(0,0,0,0.09)";
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
        border: "1px solid rgba(0,0,0,0.055)",
        boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
        overflow: "hidden", display: "flex", flexDirection: "column", height: "100%",
        cursor: "pointer", willChange: "transform", transformStyle: "preserve-3d",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 210, overflow: "hidden", flexShrink: 0 }}>
        <div ref={imgRef} style={{ width: "100%", height: "100%", transition: "transform 0.45s ease" }}>
          <Image src={item.image} alt={item.title} width={416} height={210}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,10,5,0.60) 0%,transparent 55%)", pointerEvents: "none" }} />
        <span style={{
          position: "absolute", top: 14, left: 14,
          background: CG, color: "#fff", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.10em", textTransform: "uppercase",
          padding: "5px 12px", borderRadius: 999,
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 2px 10px rgba(204,120,92,0.38)",
        }}>
          {item.category}
        </span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 16px" }}>
          <Link to={`/project/${item.slug}`} style={{ color: "#fff", textDecoration: "none" }}>
            <h3 style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15,
              margin: 0, lineHeight: 1.3, textShadow: "0 1px 6px rgba(0,0,0,0.55)",
            }}>
              {item.title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Outcome stat */}
        <div style={{
          display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14,
          paddingBottom: 14, borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: OG, lineHeight: 1 }}>
            {meta.stat}
          </span>
          <span style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, fontWeight: 700, color: "#8A7D6E",
            textTransform: "uppercase", letterSpacing: "0.10em", lineHeight: 1.2,
          }}>
            {meta.statLabel}
          </span>
        </div>
        {/* Description */}
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
        {/* CTA */}
        <Link
          to={`/project/${item.slug}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: C, fontWeight: 700, fontSize: 12.5,
            textDecoration: "none", fontFamily: "'DM Sans',sans-serif",
            transition: "gap 0.2s ease",
          }}
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
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    style={{ textAlign: "center", padding: "72px 24px" }}
  >
    <div style={{
      width: 60, height: 60, borderRadius: 16,
      background: "rgba(201,136,58,0.08)", border: "1px solid rgba(201,136,58,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
    }}>
      <i className="fas fa-folder-open" style={{ fontSize: 24, color: OG }} />
    </div>
    <h4 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>
      No projects in this category yet
    </h4>
    <p style={{ fontSize: 14, color: "#6B6B6B", fontFamily: "'DM Sans',sans-serif", marginBottom: 20 }}>
      More case studies are on the way.
    </p>
    <button
      onClick={onReset}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        background: CG, color: "#fff", fontWeight: 600, fontSize: 13,
        padding: "10px 22px", borderRadius: 10, border: "none",
        fontFamily: "'DM Sans',sans-serif",
        boxShadow: "0 4px 0 rgba(150,95,30,0.42)", minHeight: 44,
      }}
    >
      Show all projects <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
    </button>
  </motion.div>
);

// ── Bottom CTA ────────────────────────────────────────────────────────────
const BottomCTA: React.FC = () => (
  <section style={{
    background: "linear-gradient(160deg,#1a1208 0%,#0f0a05 100%)",
    padding: "90px 0", position: "relative", overflow: "hidden",
  }}>
    <div aria-hidden="true" style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,136,58,0.11) 0%,transparent 65%)", pointerEvents: "none" }} />
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
    <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        <div style={{ marginBottom: 22 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(201,136,58,0.13)", border: "1px solid rgba(201,136,58,0.30)",
            borderRadius: 999, padding: "6px 18px",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#E5B460", fontFamily: "'DM Sans',sans-serif",
          }}>
            <i className="fas fa-file-alt" style={{ fontSize: 10 }} />
            Case Study Available
          </span>
        </div>
        <h2 style={{
          fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
          fontSize: "clamp(26px,4vw,46px)", color: "#fff",
          letterSpacing: "-0.03em", marginBottom: 16,
        }}>
          See How We Delivered{" "}
          <em style={{ color: OG, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
            $4M in Savings
          </em>
        </h2>
        <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.52)", lineHeight: 1.78, fontFamily: "'DM Sans',sans-serif", marginBottom: 36 }}>
          Download our latest enterprise case study — cloud transformation, AI in production, from plan to delivery in 90 days.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
            background: CG, color: "#fff", fontWeight: 700, fontSize: 14,
            padding: "14px 30px", borderRadius: 10, textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif",
            boxShadow: "0 4px 0 rgba(150,95,30,0.50),0 6px 20px rgba(201,136,58,0.28)", minHeight: 48,
          }}>
            Get the Case Study <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
          </Link>
          <Link to="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
            background: "rgba(255,255,255,0.07)", color: "#fff",
            fontWeight: 600, fontSize: 14, padding: "14px 30px",
            borderRadius: 10, textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif",
            border: "1px solid rgba(255,255,255,0.18)", minHeight: 48,
          }}>
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
      <XzHeroSection
        badgeText="Portfolio — Proven Outcomes"
        headline={
          <h1 style={{
            fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
            fontSize: "clamp(38px,5.5vw,72px)", lineHeight: 1.04,
            color: "#fff", margin: 0, letterSpacing: "-0.03em",
          }}>
            Results That{" "}
            <em style={{ color: OG, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>Speak</em>
            <br />For Themselves
          </h1>
        }
        description="Every project below is a quantified enterprise transformation — measured in cost savings, uptime, engineers trained, and models shipped."
        ctas={[
          { label: "Explore Work", href: "#project-grid", primary: true },
          { label: "Start a Project", to: "/contact", primary: false },
        ]}
        stats={[
          { raw: 50,  suffix: "+", label: "Projects Delivered" },
          { raw: 15,  suffix: "+", label: "Industries Served"  },
          { raw: 120, suffix: "+", label: "Enterprise Clients" },
        ]}
        cascadeA={CASCADE_A}
        cascadeB={CASCADE_B}
      />

      {/* ── Filter + Grid ── */}
      <section id="project-grid" style={{ background: "#F2EFE9", padding: "72px 0 96px" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 48 }}
          >
            {FILTERS.map(f => (
              <FilterBtn
                key={f.key} label={f.label} count={countFor(f)}
                active={activeFilter === f.key} onClick={() => handleFilter(f.key)}
              />
            ))}
            <span style={{
              marginLeft: "auto", fontSize: 12.5, color: "#8A7D6E",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 500, whiteSpace: "nowrap",
            }}>
              {filteredData.length} project{filteredData.length !== 1 ? "s" : ""}
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + "-" + currentPage}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                      initial={{ opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.42, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProjectCard item={item} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="page-nav-wrap mt-5 text-center"
            >
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

      <BottomCTA />
    </>
  );
};

export default ProjectMainSection;
