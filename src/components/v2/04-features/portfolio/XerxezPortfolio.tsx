// XerxezPortfolio.tsx
// Purpose: Portfolio page body — two "live product" links, a category filter bar
//          with counts, a paginated card grid (9/page), and page buttons.
// Used in: page/v2/PortfolioV2.tsx
// Data source: `projectsData` from src/data/index.ts (id, slug, title, category,
//              image). The `projectMeta` map (outcome stat + tags + blurb per
//              slug) is copied verbatim from the existing
//              src/components/project/ProjectMainSection.tsx. Filtering /
//              pagination logic mirrors that component. Purely client-side.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layers, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { projectsData } from "../../../../data";
import Image from "../../../utils/Image";
import { T, Reveal, ArrowRight, IconTile, SectionHeading, sectionPad, V2_HEADER_H } from "../../01-core/v2theme";

type Project = (typeof projectsData)[number];
type FilterKey = "All" | "ERP" | "MLOps" | "SecOps" | "Cloud" | "Industry" | "Healthcare";

// Each filter maps to the project `category` values it should show. Empty = show all.
const FILTERS: { key: FilterKey; label: string; match: string[] }[] = [
  { key: "All",        label: "All Projects",       match: [] },
  { key: "ERP",        label: "ERP",                match: ["AI & ERP"] },
  { key: "MLOps",      label: "MLOps",              match: ["MLOPS"] },
  { key: "SecOps",     label: "SecOps",             match: ["DEVSECOPS"] },
  { key: "Cloud",      label: "Cloud",              match: ["CLOUD"] },
  { key: "Industry",   label: "Industry Solutions", match: ["Industry Solutions"] },
  { key: "Healthcare", label: "Healthcare",         match: ["Healthcare"] },
];

// Does a project belong to this filter? `projectsData` mixes casings for the
// same category ("MLOps" and "MLOPS", "Cloud" and "CLOUD"), so compare
// case-insensitively — otherwise the differently-cased projects silently
// vanish from both the grid and the tab's count.
const matchesFilter = (match: string[], category: string) =>
  match.some((m) => m.toUpperCase() === category.toUpperCase());

// Project counts per filter tab. These depend only on the module-level
// `projectsData` / `FILTERS`, so they're computed once at import rather than
// re-filtering the whole dataset for every button on every render.
const FILTER_COUNTS: Record<FilterKey, number> = Object.fromEntries(
  FILTERS.map((f) => [
    f.key,
    f.match.length === 0 ? projectsData.length : projectsData.filter((p) => matchesFilter(f.match, p.category)).length,
  ]),
) as Record<FilterKey, number>;

// slug → outcome stat + tech tags + blurb (verbatim from ProjectMainSection).
const projectMeta: Record<string, { desc: string; tags: string[]; stat: string; statLabel: string }> = {
  "ai-erp-platform":               { desc: "End-to-end AI ERP deployment with automated workflows and real-time business intelligence.", tags: ["Python", "TensorFlow", "SAP", "Azure"], stat: "40%", statLabel: "Cost reduction" },
  "mlops-pipeline":                 { desc: "Scalable MLOps automation pipeline that cut model deployment cycles from weeks to hours.", tags: ["Kubernetes", "MLflow", "Python", "AWS"], stat: "95%", statLabel: "Faster deployments" },
  "cloud-infrastructure":          { desc: "Zero-trust cloud architecture achieving 99.9% uptime with continuous compliance monitoring.", tags: ["Terraform", "AWS", "K8s", "Vault"], stat: "99.9%", statLabel: "Uptime achieved" },
  "enterprise-saas":               { desc: "Multi-tenant SaaS platform delivering enterprise-grade 99.9% uptime for growing organizations.", tags: ["React", "Node.js", "PostgreSQL", "GCP"], stat: "99.9%", statLabel: "Uptime" },
  "ai-training-program":           { desc: "Upskilled 75+ corporate professionals in AI/ML fundamentals and applied LLM engineering.", tags: ["Python", "Jupyter", "LangChain", "OpenAI"], stat: "75+", statLabel: "Engineers trained" },
  "digital-transformation":        { desc: "Digital transformation roadmap that reduced operational costs by 38% across a large enterprise org.", tags: ["Agile", "TOGAF", "AWS", "Power BI"], stat: "38%", statLabel: "Cost reduction" },
  "supply-chain-ai":               { desc: "AI-driven supply chain optimisation cutting inventory costs and improving fulfilment speed.", tags: ["PySpark", "Snowflake", "Python", "Azure"], stat: "28%", statLabel: "Inventory savings" },
  "kubernetes-security":           { desc: "Hardened Kubernetes clusters across 3 cloud providers, achieving SOC 2 Type II certification.", tags: ["K8s", "Falco", "OPA", "AWS"], stat: "SOC 2", statLabel: "Type II certified" },
  "fraud-detection-mlops":         { desc: "Real-time fraud detection processing 10M+ daily transactions at sub-100ms latency.", tags: ["Kafka", "PyTorch", "Flink", "GCP"], stat: "10M+", statLabel: "Daily detections" },
  "multi-cloud-finops":            { desc: "FinOps platform delivering $500K+ in annual cloud savings across AWS, Azure, and GCP.", tags: ["Terraform", "Python", "Grafana", "Azure"], stat: "$500K+", statLabel: "Annual cloud savings" },
  "iot-data-platform":             { desc: "IoT data management platform ingesting 2B+ events daily with predictive maintenance.", tags: ["MQTT", "TimescaleDB", "React", "Rust"], stat: "2B+", statLabel: "Events per day" },
  "llm-engineering-bootcamp":      { desc: "Intensive LLM engineering programme graduating engineers into production-ready AI roles.", tags: ["Python", "LangChain", "OpenAI", "Pinecone"], stat: "75+", statLabel: "Engineers certified" },
  "oil-gas-digital-transformation":{ desc: "AI-powered digital transformation for Oil & Gas operations — predictive maintenance, real-time pipeline monitoring, and operational analytics.", tags: ["Oil & Gas", "AI", "IoT"], stat: "47%", statLabel: "Efficiency gain" },
  "healthcare-management-system":  { desc: "End-to-end healthcare management platform covering patient records, scheduling, billing, and clinical workflows.", tags: ["Healthcare", "ERP", "Cloud"], stat: "99.5%", statLabel: "Records accuracy" },
};

// Used when a project slug has no entry in projectMeta above.
const DEFAULT_META = { desc: "Enterprise-grade solution delivering measurable business outcomes.", tags: ["React", "Python", "AWS"], stat: "—", statLabel: "Delivered" };

// The two live XERXEZ products showcased at the top of the page.
const LIVE_PRODUCTS: {
  key: string; icon: LucideIcon; name: string; subtitle: string;
  desc: string; domain: string; url: string; cta: string;
}[] = [
  {
    key: "erp", icon: Layers, name: "Xerxez ERP", subtitle: "AI-Powered ERP Platform",
    desc: "Enterprise resource planning with AI-driven forecasting, automated workflows and real-time analytics — live and running for engineering and industrial clients.",
    domain: "xerxez.com/erp", url: "/erp/login", cta: "Try live",
  },
  {
    key: "academy", icon: GraduationCap, name: "Xerxez Academy", subtitle: "AI Training Platform",
    desc: "Courses in AI, MLOps, DevSecOps, Full Stack Development and Cloud Architecture — taught by practitioners, with certificates on completion.",
    domain: "xerxez.com/lma", url: "/lma/courses", cta: "Explore",
  },
];

// One "live product" showcase card — white, lifts + gains a red top border on hover.
const LiveProductCard = ({ p }: { p: (typeof LIVE_PRODUCTS)[number] }) => {
  const [hover, setHover] = useState(false);
  const Icon = p.icon;
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block", height: "100%", background: "#fff",
        borderRadius: 16, borderTop: `4px solid ${hover ? T.red : "transparent"}`,
        boxShadow: hover ? "0 24px 48px rgba(7,26,51,0.16)" : "0 10px 30px rgba(7,26,51,0.08)",
        padding: "32px 30px", textDecoration: "none",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        transition: "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms ease, border-color 200ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <IconTile active={hover}><Icon size={22} /></IconTile>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#16a34a", color: "#fff",
          fontFamily: T.fontHead, fontSize: 10.5, fontWeight: 700,
          letterSpacing: "0.08em", padding: "5px 11px", borderRadius: 999,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
          LIVE
        </span>
      </div>
      <h3 style={{ fontFamily: T.fontHead, fontSize: 22, fontWeight: 800, color: T.headNavy, margin: "20px 0 4px" }}>
        {p.name}
      </h3>
      <div style={{ fontFamily: T.fontBody, fontSize: 13.5, fontWeight: 600, color: T.red, marginBottom: 14 }}>
        {p.subtitle}
      </div>
      <p style={{ fontFamily: T.fontBody, fontSize: 14.5, lineHeight: 1.7, color: T.muted, margin: "0 0 22px" }}>
        {p.desc}
      </p>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        paddingTop: 18, borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ fontFamily: T.fontBody, fontSize: 12.5, color: "#5b6b7c" }}>{p.domain}</span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 700, color: T.red, whiteSpace: "nowrap",
        }}>
          {p.cta}
          <ArrowRight size={14} style={{ transform: hover ? "translateX(4px)" : "none", transition: "transform 200ms ease" }} />
        </span>
      </div>
    </a>
  );
};

const ITEMS_PER_PAGE = 9;   // cards per page

// These 3 projects now have real /v2 case-study pages; every other slug still
// falls back to the v1 project detail route until its /v2 page exists.
const V2_CASE_STUDIES = new Set([
  "ai-erp-platform", "mlops-pipeline", "cloud-infrastructure",
  "enterprise-saas", "ai-training-program", "digital-transformation",
  "supply-chain-ai", "kubernetes-security", "fraud-detection-mlops",
]);

// One project card — links to its case study; hover lifts + zooms the image.
const Card = ({ item }: { item: Project }) => {
  const [hover, setHover] = useState(false);
  const meta = projectMeta[item.slug] ?? DEFAULT_META;   // outcome data for this project
  const href = V2_CASE_STUDIES.has(item.slug) ? `/project/${item.slug}` : `/project/${item.slug}`;
  return (
    <Link
      to={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.rcard,
        overflow: "hidden", textDecoration: "none",
        boxShadow: hover ? "0 20px 44px rgba(16,42,77,0.12)" : T.cardShadow,
        transform: hover ? "translateY(-6px)" : "none",
        transition: "transform 220ms cubic-bezier(0.22,1,0.36,1), box-shadow 220ms ease",
      }}
    >
      {/* image + category badge */}
      <div style={{ position: "relative", height: 190, overflow: "hidden", flexShrink: 0 }}>
        <Image src={item.image} alt={item.title} width={440} height={190}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hover ? "scale(1.05)" : "none",
            transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }} />
        <span style={{
          position: "absolute", top: 14, left: 14,
          background: T.red, color: "#fff",
          fontFamily: T.fontHead, fontSize: 10.5, fontWeight: 600,
          letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "5px 12px", borderRadius: 999,
        }}>
          {item.category}
        </span>
      </div>
      {/* body */}
      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontFamily: T.fontHead, fontSize: 18, fontWeight: 700,
          color: T.headNavy, margin: "0 0 8px", lineHeight: 1.3,
        }}>
          {item.title}
        </h3>
        <p style={{
          fontFamily: T.fontBody, fontSize: 14, lineHeight: 1.65,
          color: T.muted, margin: "0 0 16px", flex: 1,
        }}>
          {meta.desc}
        </p>
        {/* tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {meta.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: T.fontBody, fontSize: 11, fontWeight: 600, color: "#5b6b7c",
              background: T.lightAlt, border: `1px solid ${T.border}`,
              borderRadius: 6, padding: "3px 9px",
            }}>
              {tag}
            </span>
          ))}
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: T.fontHead, fontSize: 13.5, fontWeight: 600, color: T.red,
        }}>
          View case study
          {/* arrow nudges right on card hover */}
          <ArrowRight size={14} style={{
            transform: hover ? "translateX(4px)" : "none",
            transition: "transform 200ms ease",
          }} />
        </span>
      </div>
    </Link>
  );
};

const XerxezPortfolio = () => {
  const [active, setActive] = useState<FilterKey>("All");   // selected filter
  const [page, setPage] = useState(1);                      // current page (1-based)

  // Projects matching the active filter (recomputed only when `active` changes).
  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.key === active);
    if (!f || f.match.length === 0) return projectsData;    // "All"
    return projectsData.filter((p) => matchesFilter(f.match, p.category));
  }, [active]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const current = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);   // this page's cards

  // Choose a filter and reset to page 1.
  const pick = (k: FilterKey) => { setActive(k); setPage(1); };

  return (
    <>
      {/* ── Live products ── */}
      <section style={{ ...sectionPad, background: "#F4F7FA" }}>
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="Live Products" title="Built and running in production" />
            <div className="row g-4" style={{ marginTop: 40 }}>
              {LIVE_PRODUCTS.map((p) => (
                <div key={p.key} className="col-lg-6">
                  <LiveProductCard p={p} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

    {/* id="project-grid" is the scroll target for the page hero's "Explore work" button;
        scrollMarginTop keeps the heading clear of the fixed header when it lands */}
    <section id="project-grid" style={{ ...sectionPad, background: "#fff", scrollMarginTop: V2_HEADER_H + 24 }}>
      <div className="container">
        {/* ── Filter bar ── */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 44 }}>
            {FILTERS.map((f) => {
              const on = active === f.key;   // is this the selected filter?
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => pick(f.key)}
                  aria-pressed={on}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 18px", borderRadius: 999,
                    border: `1.5px solid ${on ? T.red : T.border}`,
                    background: on ? T.red : "#fff",
                    color: on ? "#fff" : "#42566b",
                    fontFamily: T.fontHead, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", minHeight: 44,          // touch target
                    transition: "background 160ms ease, border-color 160ms ease, color 160ms ease",
                  }}
                >
                  {f.label}
                  {/* count badge */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: 20, height: 20, padding: "0 6px", borderRadius: 999,
                    background: on ? "rgba(255,255,255,0.22)" : T.lightAlt,
                    color: on ? "#fff" : "#5b6b7c", fontSize: 11, fontWeight: 700,
                  }}>
                    {FILTER_COUNTS[f.key]}
                  </span>
                </button>
              );
            })}
            {/* result count, pushed to the right */}
            <span style={{
              marginLeft: "auto", fontFamily: T.fontBody, fontSize: 12.5,
              color: "#5b6b7c", fontWeight: 500, whiteSpace: "nowrap",
            }}>
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </Reveal>

        {/* ── Card grid (this page's slice) ── */}
        <div className="row g-4">
          {current.map((item, i) => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <Reveal delay={(i % 3) * 50}>
                <Card item={item} />
              </Reveal>
            </div>
          ))}
        </div>

        {/* ── Pagination (only if more than one page) — "< 1 2 >" ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 48 }}>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 44, height: 44, borderRadius: T.rx,
                border: `1.5px solid ${T.border}`, background: "#fff",
                color: page === 1 ? "#c3ccd6" : "#42566b",
                fontSize: 16, fontWeight: 600, cursor: page === 1 ? "default" : "pointer",
              }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === page ? "page" : undefined}
                style={{
                  minWidth: 44, height: 44, borderRadius: T.rx,   // 44px touch target
                  border: `1.5px solid ${p === page ? T.red : T.border}`,
                  background: p === page ? T.red : "#fff",
                  color: p === page ? "#fff" : "#42566b",
                  fontFamily: T.fontHead, fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 44, height: 44, borderRadius: T.rx,
                border: `1.5px solid ${T.border}`, background: "#fff",
                color: page === totalPages ? "#c3ccd6" : "#42566b",
                fontSize: 16, fontWeight: 600, cursor: page === totalPages ? "default" : "pointer",
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default XerxezPortfolio;
