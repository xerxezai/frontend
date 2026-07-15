import { Link } from "react-router-dom";
import { services } from "../../data";
import { useMemo } from "react";
import Image from "../utils/Image";
import { Warp } from "@paper-design/shaders-react";
import XzHeroSection from "../common/XzHeroSection";

// ── Service card shader config ─────────────────────────────────────────────
const faIcons: Record<string, string> = {
  "devsecops-mlops-solutions": "fas fa-shield-alt",
  "cloud-service-storage":     "fas fa-cloud",
  "software-development":      "fas fa-code",
  "software-consulting":       "fas fa-comments",
  "ai-training-consulting":    "fas fa-chalkboard-teacher",
  "quantum-computing":         "fas fa-atom",
  "mobile-application":        "fas fa-mobile-alt",
  "web-mobile-hosting":        "fas fa-server",
  "erp-industries":            "fas fa-building",
};

const shaderColors: Record<string, string[]> = {
  "devsecops-mlops-solutions": ["hsl(215,60%,22%)", "hsl(210,75%,42%)", "hsl(220,65%,28%)", "hsl(200,80%,52%)"],
  "cloud-service-storage":     ["hsl(185,55%,25%)", "hsl(178,70%,42%)", "hsl(192,60%,30%)", "hsl(170,75%,52%)"],
  "software-development":      ["hsl(32,70%,32%)",  "hsl(42,80%,52%)",  "hsl(28,65%,38%)",  "hsl(48,85%,62%)"],
  "software-consulting":       ["hsl(205,58%,22%)", "hsl(198,72%,42%)", "hsl(212,63%,28%)", "hsl(192,80%,52%)"],
  "ai-training-consulting":    ["hsl(250,55%,25%)", "hsl(262,65%,48%)", "hsl(244,60%,30%)", "hsl(268,72%,58%)"],
  "quantum-computing":         ["hsl(340,55%,30%)", "hsl(352,68%,52%)", "hsl(334,60%,36%)", "hsl(358,75%,62%)"],
  "mobile-application":        ["hsl(150,55%,20%)", "hsl(144,68%,40%)", "hsl(156,60%,26%)", "hsl(138,74%,50%)"],
  "web-mobile-hosting":        ["hsl(20,60%,28%)",  "hsl(28,72%,48%)",  "hsl(14,55%,34%)",  "hsl(35,78%,58%)"],
  "erp-industries":            ["hsl(32,65%,24%)",  "hsl(38,78%,46%)",  "hsl(26,60%,30%)",  "hsl(44,82%,56%)"],
};

const shaderShapes: Record<string, "checks" | "stripes" | "edge"> = {
  "devsecops-mlops-solutions": "stripes",
  "cloud-service-storage":     "edge",
  "software-development":      "stripes",
  "software-consulting":       "edge",
  "ai-training-consulting":    "edge",
  "quantum-computing":         "stripes",
  "mobile-application":        "edge",
  "web-mobile-hosting":        "stripes",
  "erp-industries":            "checks",
};

// Marketing framing per service: the problem it solves, who it's for, and a
// measurable benefit + stat pair shown as chips on the card.
const serviceMeta: Record<string, { problem: string; audience: string; benefit?: string; stat?: string }> = {
  "devsecops-mlops-solutions": { problem: "Slow deployments and security vulnerabilities",          audience: "Tech teams shipping products fast",            benefit: "Accelerated deployment cycles" },
  "cloud-service-storage":     { problem: "Overpaying for cloud with poor performance",             audience: "Enterprises on AWS, Azure, GCP",               benefit: "Optimised cloud costs",         stat: "Enterprise-grade uptime" },
  "software-development":      { problem: "Can't find reliable tech partners",                      audience: "Enterprises needing custom solutions",         stat: "Custom apps delivered" },
  "ai-training-consulting":    { problem: "Teams not ready for AI adoption",                        audience: "Corporate teams and enterprises",              stat: "75+ professionals trained" },
  "quantum-computing":         { problem: "Complex optimisation problems unsolvable classically",   audience: "Research, finance, logistics enterprises",     benefit: "Quantum-speed optimisation",    stat: "Cloud quantum access" },
  "mobile-application":        { problem: "Poor mobile experience losing customers",                audience: "Enterprises needing mobile-first solutions",   stat: "iOS · Android · Cross-platform" },
  "web-mobile-hosting":        { problem: "Downtime costing you revenue",                           audience: "Businesses needing reliable hosting",          benefit: "Enterprise-grade uptime",       stat: "Global CDN delivery" },
  "software-consulting":       { problem: "Technology decisions costing millions",                  audience: "CXOs and technology leaders" },
  "erp-industries":            { problem: "Generic ERP that fights your industry's workflow",       audience: "Healthcare, manufacturing, logistics, EPC & more", benefit: "Phased deployment approach", stat: "8 industry verticals" },
};

interface Props {
  mainSection?: boolean;
}

const otherServices = services.filter((s) => s.slug !== "ai-powered-erp");

// ERP Industries has its own dedicated page outside the generic /service/:slug
// template — every other card follows the default pattern.
const detailHref = (slug: string) => (slug === "erp-industries" ? "/erp-industries" : `/service/${slug}`);

const erpModules = [
  { icon: "fas fa-chart-bar",           label: "Finance & Accounting",     to: "/service/ai-powered-erp" },
  { icon: "fas fa-users",               label: "Human Resources",          to: "/service/ai-powered-erp" },
  { icon: "fas fa-boxes",               label: "Inventory & Supply Chain", to: "/service/ai-powered-erp" },
  { icon: "fas fa-handshake",           label: "CRM & Sales",              to: "/service/ai-powered-erp" },
  { icon: "fas fa-file-invoice-dollar", label: "Invoicing & Purchases",    to: "/service/ai-powered-erp" },
  { icon: "fas fa-brain",               label: "AI Analytics & Forecasting", to: "/service/ai-powered-erp" },
];

const erpStats = [
  { val: "AI-First",  label: "Architecture" },
  { val: "<6 mo",     label: "Typical Deployment" },
  { val: "99.9%",     label: "System Uptime SLA" },
];

// ── Hero cascade content ──────────────────────────────────────────────────
const SVC_CASCADE_A = [
  "Intelligent ERP Systems",
  "Zero-Trust DevSecOps",
  "Multi-Cloud Infrastructure",
  "MLOps Automation",
  "AI Training Programs",
  "Quantum Computing",
  "Mobile Applications",
  "Software Consulting",
  "Web & Mobile Hosting",
];

const SVC_CASCADE_B = [
  "Terraform · Kubernetes",
  "Apache Kafka Streams",
  "PyTorch & TensorFlow",
  "LangChain & OpenAI",
  "AWS · Azure · GCP",
  "Docker & Helm Charts",
  "Snowflake · BigQuery",
  "Python & FastAPI",
  "React & TypeScript",
  "MLflow & DVC",
];

// ── Floating consultation card (hero right column) ─────────────────────────
const ConsultationCard = () => (
  <div style={{
    borderRadius: 20,
    background: "linear-gradient(155deg,#fdf9f4 0%,#f0e4d0 100%)",
    border: "1px solid rgba(201,136,58,0.18)",
    borderTop: "3px solid #C9883A",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95),0 8px 0 rgba(130,82,24,0.32),0 20px 60px rgba(0,0,0,0.18)",
    padding: "26px 24px 22px",
    position: "relative",
    overflow: "hidden",
  }}>

    {/* ambient glow top-right */}
    <div aria-hidden="true" style={{
      position: "absolute", top: -50, right: -50,
      width: 160, height: 160, borderRadius: "50%",
      background: "radial-gradient(circle,rgba(201,136,58,0.13) 0%,transparent 68%)",
      pointerEvents: "none",
    }} />

    {/* header: icon + live badge */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, position: "relative" }}>
      <div style={{
        width: 50, height: 50, borderRadius: 14,
        background: "linear-gradient(145deg,#e8a84e 0%,#C9883A 100%)",
        boxShadow: "0 4px 0 rgba(140,88,22,0.50),0 8px 18px rgba(201,136,58,0.38)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <i className="fas fa-rocket" style={{ color: "#fff", fontSize: 21 }} />
      </div>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: "rgba(74,222,128,0.10)",
        border: "1px solid rgba(74,222,128,0.30)",
        borderRadius: 20, padding: "4px 11px",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
        textTransform: "uppercase", color: "#15803d",
        fontFamily: "'DM Sans',sans-serif",
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#4ade80",
          boxShadow: "0 0 6px rgba(74,222,128,0.75)",
          display: "inline-block", flexShrink: 0,
        }} />
        Responds in 24h
      </span>
    </div>

    {/* eyebrow + title */}
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
      textTransform: "uppercase", color: "#C9883A",
      fontFamily: "'DM Sans',sans-serif", marginBottom: 4, position: "relative",
    }}>
      Free Consultation
    </p>
    <h4 style={{
      fontSize: 20, fontWeight: 800, color: "#1A1208",
      lineHeight: 1.18, fontFamily: "'DM Sans',sans-serif",
      marginBottom: 8, letterSpacing: "-0.02em", position: "relative",
    }}>
      Let's Build<br />Something Great
    </h4>
    <p style={{
      fontSize: 12.5, color: "#5C5047", lineHeight: 1.65,
      fontFamily: "'DM Sans',sans-serif", marginBottom: 18, position: "relative",
    }}>
      Talk to our experts and get a tailored solution designed around your enterprise goals.
    </p>

    {/* 3 trust chips */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 18, position: "relative" }}>
      {[
        { icon: "fas fa-briefcase",   val: "4+",   label: "Projects" },
        { icon: "far fa-clock",       val: "24h",  label: "Response" },
        { icon: "fas fa-lock",        val: "NDA",  label: "Protected" },
      ].map(d => (
        <div key={d.label} style={{
          background: "rgba(255,255,255,0.80)",
          border: "1px solid rgba(201,136,58,0.14)",
          borderRadius: 11, padding: "10px 7px", textAlign: "center",
        }}>
          <i className={d.icon} style={{ color: "#C9883A", fontSize: 11, marginBottom: 5, display: "block" }} />
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1A1208", fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>{d.val}</div>
          <div style={{ fontSize: 9, color: "#8B7A6A", fontFamily: "'DM Sans',sans-serif", marginTop: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.label}</div>
        </div>
      ))}
    </div>

    {/* CTA button */}
    <Link
      to="/contact"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: "linear-gradient(135deg,#e8a84e 0%,#C9883A 100%)",
        color: "#fff", fontWeight: 700, fontSize: 14,
        padding: "13px 20px", borderRadius: 12, textDecoration: "none",
        fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.02em",
        boxShadow: "0 4px 0 rgba(130,78,18,0.50),0 8px 24px rgba(201,136,58,0.40)",
        cursor: "pointer", marginBottom: 14, position: "relative",
        transition: "box-shadow 0.2s ease,transform 0.2s ease",
      }}
      onMouseEnter={e => { const a = e.currentTarget; a.style.transform = "translateY(-2px)"; a.style.boxShadow = "0 6px 0 rgba(130,78,18,0.50),0 12px 32px rgba(201,136,58,0.50)"; }}
      onMouseLeave={e => { const a = e.currentTarget; a.style.transform = ""; a.style.boxShadow = "0 4px 0 rgba(130,78,18,0.50),0 8px 24px rgba(201,136,58,0.40)"; }}
    >
      Book a Free Demo <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
    </Link>

    {/* trust strip */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, position: "relative" }}>
      <i className="fas fa-lock" style={{ color: "#C9883A", fontSize: 10 }} />
      <span style={{ fontSize: 11, color: "#8B7A6A", fontFamily: "'DM Sans',sans-serif" }}>All enquiries handled under strict NDA</span>
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────
const ServiceSection3 = ({ mainSection }: Props) => {
  const displayedOthers = useMemo(
    () => (mainSection ? otherServices : otherServices.slice(0, 3)),
    [mainSection]
  );

  return (
    <>
      {/* ── Dark hero with shared XzHeroSection ── */}
      {mainSection && (
        <XzHeroSection
          urgencyText="Limited onboarding slots available this quarter"
          trustLine="NDA Protected · 24h Response"
          badgeText="End-to-End Enterprise Solutions"
          headline={
            <h1 style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
              fontSize: "clamp(36px,5vw,68px)", lineHeight: 1.06,
              color: "#fff", margin: 0, letterSpacing: "-0.03em",
            }}>
              Intelligent Services<br />
              <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
                Built for Scale
              </em>
            </h1>
          }
          description="From AI-powered ERP to cloud infrastructure and mobile platforms — XERXEZ delivers enterprise-grade technology that learns, adapts, and grows with your business."
          ctas={[
            { label: "Explore Services", href: "#services", primary: true },
            { label: "Book a Demo", to: "/contact", primary: false },
          ]}
          stats={[
            { val: "8+",       label: "Services" },
            { val: "4+",       label: "Projects Delivered" },
            { val: "AI-First", label: "Architecture" },
          ]}
          cascadeA={SVC_CASCADE_A}
          cascadeB={SVC_CASCADE_B}
          right={<ConsultationCard />}
        />
      )}

      {/* ── Cream section: Flagship ERP + service cards ── */}
      <section
        id="services"
        className="service-section-2 section-padding fix"
        style={{ background: "#F2EFE9" }}
      >
        {!mainSection && (
          <>
            <div className="left-shape">
              <Image src="assets/img/service/left-shape.png" alt="img" width={30} height={30} />
            </div>
            <div className="right-shape">
              <Image src="assets/img/service/right-shape-3.png" alt="img" width={42} height={44} />
            </div>
          </>
        )}

        <div className="container position-relative z-1">
          {/* Section header — shown when not mainSection (homepage embed) */}
          {!mainSection && (
            <div style={{ marginBottom: 56 }} data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
              <div style={{ marginBottom: 22 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  border: "1px solid rgba(30,30,30,0.22)", borderRadius: 999,
                  padding: "6px 18px", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "#1A1A1A", fontFamily: "'DM Sans',sans-serif",
                  background: "rgba(201,136,58,0.08)",
                }}>
                  <i className="fas fa-sparkles" style={{ color: "#C9883A", fontSize: 10 }} />
                  End-to-End Enterprise Solutions
                </span>
              </div>
              <h2 style={{
                fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.08,
                color: "#1A1A1A", margin: 0, letterSpacing: "-0.03em",
              }}>
                Intelligent Services<br />
                <span style={{ color: "#C9883A" }}>Built for Scale</span>
              </h2>
            </div>
          )}

          {/* ── FLAGSHIP: AI-Powered ERP ── */}
          <div className="row mb-4" data-aos="fade-up" data-aos-duration="900" data-aos-once="true">
            <div className="col-12">
              <div style={{
                background: "linear-gradient(145deg,#081828 0%,#0F2741 35%,#132E50 70%,#0E2240 100%)",
                borderRadius: 22, padding: "52px 56px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 40, flexWrap: "wrap",
                position: "relative", overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.07)",
                borderTop: "1px solid rgba(255,255,255,0.18)",
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.10)",
                  "0 8px 0 rgba(0,0,0,0.40)",
                  "0 20px 60px rgba(0,0,0,0.50)",
                  "0 0 100px rgba(240,202,122,0.07)",
                ].join(", "),
              }}>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
                <div style={{ position: "absolute", bottom: -120, left: "25%", zIndex: 0, width: 420, height: 420, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(240,202,122,0.10) 0%,transparent 68%)" }} />
                <div style={{ position: "absolute", top: -100, right: -80, zIndex: 0, width: 320, height: 320, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(100,160,255,0.06) 0%,transparent 65%)" }} />

                {/* Left: text + CTAs */}
                <div style={{ flex: "1 1 420px", zIndex: 1, position: "relative" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 26, flexWrap: "wrap" }}>
                    <span style={{ background: "linear-gradient(135deg,#4ade80 0%,#22c55e 100%)", color: "#052e12", fontSize: 10, fontWeight: 800, padding: "5px 14px", borderRadius: 20, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 3px 0 rgba(20,90,45,0.55),0 5px 12px rgba(74,222,128,0.28)" }}>Most Popular</span>
                    <span style={{ background: "linear-gradient(135deg,#F0CA7A 0%,#d4a33a 100%)", color: "#4A2800", fontSize: 10, fontWeight: 800, padding: "5px 14px", borderRadius: 20, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 3px 0 rgba(120,70,0,0.55),0 5px 12px rgba(240,202,122,0.28)" }}>New</span>
                    <span style={{ background: "rgba(255,255,255,0.09)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "5px 14px", borderRadius: 20, letterSpacing: "0.10em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.20)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18),0 2px 6px rgba(0,0,0,0.25)", fontFamily: "'DM Sans',sans-serif" }}>AI Powered</span>
                    <span style={{ background: "rgba(240,202,122,0.10)", color: "#F0CA7A", fontSize: 10, fontWeight: 700, padding: "5px 14px", borderRadius: 20, letterSpacing: "0.10em", textTransform: "uppercase", border: "1px solid rgba(240,202,122,0.30)", boxShadow: "inset 0 1px 0 rgba(240,202,122,0.15)", fontFamily: "'DM Sans',sans-serif" }}>Flagship Service</span>
                  </div>
                  <h2 style={{ color: "#fff", fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 14, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.03em", textShadow: "0 2px 24px rgba(240,202,122,0.10)" }}>
                    AI-Powered<br /><span style={{ color: "#F0CA7A" }}>ERP System</span>
                  </h2>
                  <p style={{ color: "#F0CA7A", fontSize: 14.5, fontStyle: "italic", lineHeight: 1.6, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
                    “Legacy ERP systems are slowing you down.”
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>
                    <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>For:</span>
                    {" "}Mid to large manufacturing, logistics &amp; retail enterprises · Deployed in &lt;6 months
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.78, marginBottom: 32, maxWidth: 520, fontFamily: "'DM Sans',sans-serif" }}>
                    Purpose-built or layered onto your existing SAP, Oracle, or Microsoft Dynamics — XERXEZ delivers intelligent ERP that learns, adapts, and scales with your enterprise operations.
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
                    {erpStats.map((stat) => (
                      <div key={stat.val} style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.10)", borderTop: "1px solid rgba(255,255,255,0.20)", borderRadius: 14, padding: "16px 22px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08),0 4px 14px rgba(0,0,0,0.22)", minWidth: 118 }}>
                        <div style={{ color: "#F0CA7A", fontSize: 32, fontWeight: 900, lineHeight: 1, fontFamily: "'DM Sans',sans-serif", textShadow: "0 0 22px rgba(240,202,122,0.50)" }}>{stat.val}</div>
                        <div style={{ color: "rgba(255,255,255,0.50)", fontSize: 11, marginTop: 6, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.03em" }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
                    <Link to="/erp/login" style={{ background: "linear-gradient(135deg,#F0CA7A 0%,#d4a33a 100%)", color: "#4A2800", padding: "13px 30px", borderRadius: 10, fontWeight: 800, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.01em", boxShadow: "0 5px 0 rgba(100,60,0,0.55),0 8px 24px rgba(240,202,122,0.22)" }}>
                      Try It Free <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
                    </Link>
                    <Link to="/service/ai-powered-erp" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "13px 30px", borderRadius: 10, fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.01em", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14),0 4px 16px rgba(0,0,0,0.22)" }}>
                      Explore AI ERP <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
                    </Link>
                    <Link to="/contact" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "13px 30px", borderRadius: 10, fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.01em", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14),0 4px 16px rgba(0,0,0,0.22)" }}>
                      Request a Demo <i className="far fa-arrow-right" style={{ fontSize: 12 }} />
                    </Link>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.42)", fontFamily: "'DM Sans',sans-serif" }}>
                    <i className="fas fa-check-circle" style={{ color: "rgba(240,202,122,0.75)", fontSize: 11 }} />
                    Full access · No credit card · Cancel anytime
                  </span>
                </div>

                {/* Right: module links */}
                <div style={{ flex: "0 1 300px", zIndex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
                  {erpModules.map((m) => (
                    <Link
                      key={m.label} to={m.to}
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderTop: "1px solid rgba(255,255,255,0.16)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, color: "#fff", textDecoration: "none", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07),0 3px 8px rgba(0,0,0,0.18)", transition: "background 0.18s,transform 0.18s,box-shadow 0.18s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.12),0 5px 16px rgba(0,0,0,0.26)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.07),0 3px 8px rgba(0,0,0,0.18)"; }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "linear-gradient(135deg,rgba(240,202,122,0.20) 0%,rgba(240,202,122,0.07) 100%)", border: "1px solid rgba(240,202,122,0.28)", boxShadow: "inset 0 1px 0 rgba(240,202,122,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className={m.icon} style={{ color: "#F0CA7A", fontSize: 13 }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", flex: 1 }}>{m.label}</span>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: "rgba(74,222,128,0.14)", border: "1px solid rgba(74,222,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fas fa-check" style={{ color: "#4ade80", fontSize: 8 }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── OTHER SERVICES ── */}
          <div className="row g-4">
            {displayedOthers.map((service, index) => (
              <div
                key={service.id}
                className="col-xl-3 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="900"
                data-aos-easing="ease-out-cubic"
                data-aos-once="true"
              >
                <div
                  style={{ position: "relative", height: "100%", minHeight: 400, borderRadius: 18, overflow: "hidden", transition: "transform 0.26s ease,box-shadow 0.26s ease", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.28)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    <Warp
                      style={{ width: "100%", height: "100%" }}
                      proportion={0.38} softness={0.95} distortion={0.18}
                      swirl={0.75} swirlIterations={10}
                      shape={shaderShapes[service.slug] ?? "edge"}
                      shapeScale={0.1} scale={1} rotation={0} speed={0.6}
                      colors={shaderColors[service.slug] ?? ["hsl(20,60%,28%)", "hsl(35,72%,48%)", "hsl(14,55%,34%)", "hsl(42,80%,58%)"]}
                    />
                  </div>
                  {(service.slug === "quantum-computing" || service.slug === "erp-industries") && (
                    <span style={{
                      position: "absolute", top: 14, right: 14, zIndex: 2,
                      background: "linear-gradient(135deg,#F0CA7A 0%,#d4a33a 100%)", color: "#4A2800",
                      fontSize: 9, fontWeight: 800, padding: "4px 11px", borderRadius: 20,
                      letterSpacing: "0.10em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif",
                      boxShadow: "0 3px 0 rgba(120,70,0,0.50),0 4px 10px rgba(240,202,122,0.28)",
                    }}>New</span>
                  )}
                  <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", padding: "24px 24px 20px", background: "rgba(12,8,4,0.78)", border: "1px solid rgba(255,255,255,0.10)" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 18, color: "#ffffff", flexShrink: 0 }}>
                      <i className={faIcons[service.slug] ?? "fas fa-cogs"} />
                    </div>
                    <h3 style={{ marginBottom: 8, fontSize: 16, lineHeight: 1.3, fontWeight: 700, color: "#ffffff", fontFamily: "'DM Sans',sans-serif" }}>
                      <Link to={detailHref(service.slug)} style={{ color: "inherit", textDecoration: "none" }}>{service.title}</Link>
                    </h3>
                    {serviceMeta[service.slug] && (
                      <>
                        <p style={{ color: "#F0CA7A", fontSize: 12.5, fontStyle: "italic", lineHeight: 1.5, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
                          “{serviceMeta[service.slug].problem}”
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11.5, lineHeight: 1.55, marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>
                          <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.72)", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 10 }}>For:</span>
                          {" "}{serviceMeta[service.slug].audience}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                          {serviceMeta[service.slug].benefit && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.30)", borderRadius: 999, padding: "4px 10px", fontSize: 10.5, fontWeight: 700, color: "#4ade80", fontFamily: "'DM Sans',sans-serif" }}>
                              <i className="fas fa-chart-line" style={{ fontSize: 9 }} />
                              {serviceMeta[service.slug].benefit}
                            </span>
                          )}
                          {serviceMeta[service.slug].stat && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(240,202,122,0.10)", border: "1px solid rgba(240,202,122,0.30)", borderRadius: 999, padding: "4px 10px", fontSize: 10.5, fontWeight: 700, color: "#F0CA7A", fontFamily: "'DM Sans',sans-serif" }}>
                              {serviceMeta[service.slug].stat}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                    <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 12.5, lineHeight: 1.65, marginBottom: 16, flex: 1, fontFamily: "'DM Sans',sans-serif", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
                      {service.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <Link
                        to={detailHref(service.slug)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 12, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase", transition: "gap 0.2s ease" }}
                        onMouseEnter={e => (e.currentTarget.style.gap = "10px")}
                        onMouseLeave={e => (e.currentTarget.style.gap = "6px")}
                      >
                        Learn More <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
                      </Link>
                      <Link
                        to="/contact"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#F0CA7A 0%,#d4a33a 100%)", color: "#4A2800", fontWeight: 800, fontSize: 11, padding: "8px 14px", borderRadius: 8, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.03em", textTransform: "uppercase", boxShadow: "0 3px 0 rgba(100,60,0,0.45)", flexShrink: 0 }}
                      >
                        Get Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceSection3;
