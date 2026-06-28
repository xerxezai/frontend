import React, { useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { projectsData } from "../../data";
import Image from "../utils/Image";

const C  = "#cc785c";
const CG = "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)";

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const projectMeta: Record<string, { desc: string; tags: string[] }> = {
  "ai-erp-platform":        { desc: "End-to-end AI ERP deployment with automated workflows and real-time business intelligence across all units.", tags: ["Python", "TensorFlow", "SAP", "Azure"] },
  "mlops-pipeline":         { desc: "Scalable MLOps automation pipeline that cut model deployment cycles from weeks to hours.", tags: ["Kubernetes", "MLflow", "Python", "AWS"] },
  "cloud-infrastructure":   { desc: "Zero-trust cloud architecture achieving 99.9% uptime with continuous compliance monitoring.", tags: ["Terraform", "AWS", "K8s", "Vault"] },
  "enterprise-saas":        { desc: "Multi-tenant SaaS platform serving 500+ enterprise clients at 99.95% availability SLA.", tags: ["React", "Node.js", "PostgreSQL", "GCP"] },
  "ai-training-program":    { desc: "Upskilled 1,200+ corporate professionals in AI/ML fundamentals and applied LLM engineering.", tags: ["Python", "Jupyter", "LangChain", "OpenAI"] },
  "digital-transformation": { desc: "Digital transformation roadmap that reduced operational costs by 38% across a 10,000-person organisation.", tags: ["Agile", "TOGAF", "AWS", "Power BI"] },
  "supply-chain-ai":        { desc: "AI-driven supply chain optimisation cutting inventory costs by 28% and improving fulfilment speed.", tags: ["PySpark", "Snowflake", "Python", "Azure"] },
  "kubernetes-security":    { desc: "Hardened Kubernetes clusters across 3 cloud providers, achieving SOC 2 Type II certification.", tags: ["K8s", "Falco", "OPA", "AWS"] },
  "fraud-detection-mlops":  { desc: "Real-time fraud detection processing 10M+ daily transactions at sub-100ms latency.", tags: ["Kafka", "PyTorch", "Flink", "GCP"] },
  "multi-cloud-finops":     { desc: "FinOps platform delivering $4M+ in annual cloud savings across AWS, Azure, and GCP.", tags: ["Terraform", "Python", "Grafana", "Azure"] },
  "iot-data-platform":      { desc: "IoT data management platform ingesting 2B+ events daily with predictive maintenance features.", tags: ["MQTT", "TimescaleDB", "React", "Rust"] },
  "llm-engineering-bootcamp": { desc: "Intensive LLM engineering programme graduating 300+ engineers into production-ready AI roles.", tags: ["Python", "LangChain", "OpenAI", "Pinecone"] },
};

const headerStats = [
  { val: "50+",  label: "Projects" },
  { val: "15+",  label: "Industries" },
  { val: "120+", label: "Clients" },
];

// ── Single portfolio card ──────────────────────────────────────────────────
const ProjectCard: React.FC<{ item: typeof projectsData[0]; index: number }> = ({
  item,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);
  const meta    = projectMeta[item.slug] ?? {
    desc: "Enterprise-grade solution delivering measurable business outcomes.",
    tags: ["React", "Python", "AWS"],
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = cardRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width;
    const y  = (e.clientY - r.top)  / r.height;
    const rY = (x - 0.5) * 10;
    const rX = (0.5 - y) * 6;
    el.style.transition = "transform 0.08s linear, box-shadow 0.08s linear";
    el.style.transform  = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-8px) scale(1.01)`;
    el.style.boxShadow  = "0 20px 60px rgba(204,120,92,0.20), 0 8px 24px rgba(0,0,0,0.10)";
  };

  const onEnter = () => {
    if (prefersReduced) return;
    const img = imgRef.current;
    if (img) img.style.transform = "scale(1.05)";
  };

  const onLeave = () => {
    if (prefersReduced) return;
    const el  = cardRef.current;
    const img = imgRef.current;
    if (el) {
      el.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease";
      el.style.transform  = "";
      el.style.boxShadow  = "";
      setTimeout(() => { if (el) el.style.transition = ""; }, 510);
    }
    if (img) img.style.transform = "scale(1)";
  };

  return (
    <div
      className="col-xl-4 col-lg-4 col-md-6 col-12"
      data-aos="fade-up"
      data-aos-delay={String(index * 100)}
      data-aos-duration="800"
      data-aos-easing="ease-out-cubic"
      data-aos-once="true"
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
          willChange: "transform",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: 220, overflow: "hidden", borderRadius: "12px 12px 0 0", flexShrink: 0 }}>
          <div
            ref={imgRef}
            style={{ width: "100%", height: "100%", transition: "transform 0.4s ease" }}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={416}
              height={220}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          {/* Bottom gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.40) 0%, transparent 55%)",
            pointerEvents: "none",
          }} />
          {/* Category badge */}
          <span style={{
            position: "absolute", top: 16, left: 16,
            background: CG,
            color: "#fff", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.10em", textTransform: "uppercase",
            padding: "5px 12px", borderRadius: 999,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 2px 8px rgba(204,120,92,0.35)",
          }}>
            {item.category}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{
            fontSize: 18, fontWeight: 700, color: "#1A1A1A",
            marginBottom: 8, lineHeight: 1.3,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <Link to={`/project/${item.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
              {item.title}
            </Link>
          </h3>

          <p style={{
            fontSize: 14, color: "#6B6B6B", lineHeight: 1.65,
            marginBottom: 16, fontFamily: "'DM Sans', sans-serif",
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          } as React.CSSProperties}>
            {meta.desc}
          </p>

          {/* Tech tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {meta.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 600, color: "#5A5A5A",
                background: "#F3F3F3", borderRadius: 6,
                padding: "4px 10px", fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.02em",
              }}>{tag}</span>
            ))}
          </div>

          {/* CTA */}
          <Link
            to={`/project/${item.slug}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: C, fontWeight: 700, fontSize: 13,
              textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
              transition: "gap 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
            onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
          >
            View Case Study
            <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────
const ProjectMainSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { totalPages, currentItems } = useMemo(() => {
    const tp    = Math.ceil(projectsData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return { totalPages: tp, currentItems: projectsData.slice(start, start + itemsPerPage) };
  }, [currentPage]);

  return (
    <section style={{ background: "#F2EFE9", padding: "150px 0 100px" }}>
      <div className="container">

        {/* ── Hero header ── */}
        <div
          style={{ marginBottom: 64 }}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", flexWrap: "wrap", gap: 32,
          }}>
            {/* Left: heading + stats */}
            <div style={{ flex: "1 1 460px" }}>
              {/* Badge */}
              <div style={{ marginBottom: 22 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  border: "1px solid rgba(30,30,30,0.22)", borderRadius: 999,
                  padding: "6px 18px", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(201,136,58,0.08)",
                }}>
                  ✦ OUR WORK
                </span>
              </div>

              <h1 style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
                fontSize: "clamp(34px, 5vw, 64px)", lineHeight: 1.08,
                color: "#1A1A1A", margin: 0, letterSpacing: "-0.03em",
              }}>
                Results That Speak<br />
                <em style={{ color: C, fontStyle: "italic", fontWeight: 800 }}>For Themselves</em>
              </h1>

              <p style={{
                marginTop: 20, color: "#4B4B4B", fontSize: 16, lineHeight: 1.75,
                maxWidth: 560, fontFamily: "'DM Sans', sans-serif",
              }}>
                From AI-powered ERP to MLOps and DevSecOps — every project here represents
                a measurable transformation for an enterprise that trusted us to deliver.
              </p>

              {/* Stats */}
              <div style={{ display: "flex", gap: 36, marginTop: 28, flexWrap: "wrap" }}>
                {headerStats.map((s) => (
                  <div key={s.val} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                      {s.val}
                    </span>
                    <span style={{ fontSize: 13, color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA card */}
            <div style={{ flex: "0 1 300px", alignSelf: "center" }}>
              <div style={{
                borderRadius: 18,
                background: "linear-gradient(160deg, #faf7f3 0%, #e8e0d4 100%)",
                border: "1px solid rgba(210,195,175,0.6)",
                boxShadow: "0 6px 0 rgba(155,130,100,0.45), 0 12px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
                padding: "28px 26px",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: CG,
                  boxShadow: "0 4px 0 rgba(150,95,30,0.5), 0 6px 14px rgba(201,136,58,0.30)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className="far fa-file-alt" style={{ color: "#fff", fontSize: 18 }} />
                </div>

                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: C,
                  fontFamily: "'DM Sans', sans-serif", marginBottom: 6,
                }}>
                  Case Study Available
                </p>

                <h4 style={{
                  fontSize: 18, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.25,
                  fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
                }}>
                  Download Our Latest<br />Enterprise Case Study
                </h4>

                <p style={{
                  fontSize: 13, color: "#6B6B6B", lineHeight: 1.65,
                  fontFamily: "'DM Sans', sans-serif", marginBottom: 20,
                }}>
                  See how we helped a global enterprise cut cloud costs by $4M and ship AI in 90 days.
                </p>

                <Link
                  to="/contact"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: CG,
                    color: "#fff", fontWeight: 700, fontSize: 13,
                    padding: "11px 22px", borderRadius: 10, textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 4px 0 rgba(150,95,30,0.5), 0 6px 18px rgba(201,136,58,0.30)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Get the Case Study
                  <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="row g-4">
          {currentItems.map((item, index) => (
            <ProjectCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="page-nav-wrap mt-5 text-center">
            <ul>
              <li>
                <a
                  className={`page-numbers${currentPage === 1 ? " disabled-btn" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((p) => p - 1);
                  }}
                >
                  <i className="fal fa-long-arrow-left" />
                </a>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <a
                    className={`page-numbers${currentPage === page ? " active" : ""}`}
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                  >
                    {page.toString().padStart(2, "0")}
                  </a>
                </li>
              ))}
              <li>
                <a
                  className={`page-numbers${currentPage === totalPages ? " disabled-btn" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                  }}
                >
                  <i className="fal fa-long-arrow-right" />
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectMainSection;
