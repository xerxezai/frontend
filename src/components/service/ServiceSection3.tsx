import { Link } from "react-router-dom";
import { services } from "../../data";
import { useMemo } from "react";
import Image from "../utils/Image";
import { Warp } from "@paper-design/shaders-react";

const faIcons: Record<string, string> = {
  "devsecops-mlops-solutions": "fas fa-shield-alt",
  "cloud-service-storage":     "fas fa-cloud",
  "software-development":      "fas fa-code",
  "software-consulting":       "fas fa-comments",
  "ai-training-consulting":    "fas fa-chalkboard-teacher",
  "quantum-computing":         "fas fa-atom",
  "mobile-application":        "fas fa-mobile-alt",
  "web-mobile-hosting":        "fas fa-server",
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
};

interface Props {
  mainSection?: boolean;
}

const otherServices = services.filter((s) => s.slug !== "ai-powered-erp");

// Module links — redirect to /service/ai-powered-erp until individual module pages exist
const erpModules = [
  { icon: "fas fa-chart-bar",           label: "Finance & Accounting",     to: "/service/ai-powered-erp" },
  { icon: "fas fa-users",               label: "Human Resources",          to: "/service/ai-powered-erp" },
  { icon: "fas fa-boxes",               label: "Inventory & Supply Chain", to: "/service/ai-powered-erp" },
  { icon: "fas fa-handshake",           label: "CRM & Sales",              to: "/service/ai-powered-erp" },
  { icon: "fas fa-file-invoice-dollar", label: "Invoicing & Purchases",    to: "/service/ai-powered-erp" },
  { icon: "fas fa-brain",               label: "AI Analytics & Forecasting", to: "/service/ai-powered-erp" },
];

const erpStats = [
  { val: "40%",   label: "Operations cost reduction" },
  { val: "60%",   label: "Faster decision-making" },
  { val: "99.9%", label: "System uptime SLA" },
];

const headerStats = [
  { val: "8+",   label: "Services" },
  { val: "50+",  label: "Projects Delivered" },
  { val: "12+",  label: "AI Capabilities" },
];

const ServiceSection3 = ({ mainSection }: Props) => {
  const displayedOthers = useMemo(
    () => (mainSection ? otherServices : otherServices.slice(0, 3)),
    [mainSection]
  );


  return (
    <section className="service-section-2 section-padding fix" style={{ background: "#F2EFE9" }}>
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
        {/* ── Hero-style page header ── */}
        <div style={{ marginBottom: 56 }} data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
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
              <i className="fas fa-sparkles" style={{ color: "#C9883A", fontSize: 10 }}></i>
              End-to-End Enterprise Solutions
            </span>
          </div>

          {/* Title + Search row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div style={{ flex: "1 1 460px" }}>
              <h1 style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
                fontSize: "clamp(34px, 5vw, 64px)", lineHeight: 1.08,
                color: "#1A1A1A", margin: 0, letterSpacing: "-0.03em",
              }}>
                Intelligent Services<br />
                <span style={{ color: "#C9883A" }}>Built for Scale</span>
              </h1>

              <p style={{
                marginTop: 20, color: "#4B4B4B", fontSize: 16, lineHeight: 1.75,
                maxWidth: 580, fontFamily: "'DM Sans', sans-serif",
              }}>
                From AI-powered ERP to cloud infrastructure and mobile platforms —
                XERXEZ delivers enterprise-grade technology that learns, adapts,
                and grows with your business.
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 36, marginTop: 28, flexWrap: "wrap" }}>
                {headerStats.map((s) => (
                  <div key={s.val} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>{s.val}</span>
                    <span style={{ fontSize: 13, color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card — 3D raised */}
            <div style={{ flex: "0 1 300px", alignSelf: "center" }}>
              <div style={{
                borderRadius: 18,
                background: "linear-gradient(160deg, #faf7f3 0%, #e8e0d4 100%)",
                border: "1px solid rgba(210,195,175,0.6)",
                boxShadow: "0 6px 0 rgba(155,130,100,0.45), 0 12px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
                padding: "28px 26px",
              }}>
                {/* Icon badge */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: "linear-gradient(135deg, #C9883A 0%, #e8a84e 100%)",
                  boxShadow: "0 4px 0 rgba(150,95,30,0.5), 0 6px 14px rgba(201,136,58,0.30)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className="fas fa-rocket" style={{ color: "#fff", fontSize: 18 }}></i>
                </div>

                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "#C9883A",
                  fontFamily: "'DM Sans', sans-serif", marginBottom: 6,
                }}>Free Consultation</p>

                <h4 style={{
                  fontSize: 18, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.25,
                  fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
                }}>
                  Let's Build<br />Something Great
                </h4>

                <p style={{
                  fontSize: 13, color: "#6B6B6B", lineHeight: 1.65,
                  fontFamily: "'DM Sans', sans-serif", marginBottom: 20,
                }}>
                  Talk to our experts and get a tailored solution for your enterprise.
                </p>

                {/* Primary button */}
                <Link to="/contact" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #C9883A 0%, #e8a84e 100%)",
                  color: "#fff", fontWeight: 700, fontSize: 13,
                  padding: "11px 22px", borderRadius: 10, textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 0 rgba(150,95,30,0.5), 0 6px 18px rgba(201,136,58,0.30)",
                  letterSpacing: "0.02em",
                }}>
                  Book a Free Demo
                  <i className="far fa-arrow-right" style={{ fontSize: 11 }}></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── FLAGSHIP: AI-Powered ERP ── */}
        <div className="row mb-4" data-aos="fade-up" data-aos-duration="900" data-aos-once="true">
          <div className="col-12">
            <div
              className="erp-flagship-card"
              style={{
                background: "linear-gradient(135deg, #0F2741 0%, #163557 55%, #1A3F6A 100%)",
                borderRadius: 16,
                padding: "48px 52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 32,
                flexWrap: "wrap",
                boxShadow: "0 8px 40px rgba(201,136,58,0.28)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* decorative circles */}
              <span style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
              <span style={{ position: "absolute", bottom: -40, left: "38%", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

              {/* Left: text + CTAs */}
              <div style={{ flex: "1 1 400px", zIndex: 1 }}>
                {/* Badges */}
                <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                  <span style={{ background: "#F0CA7A", color: "#8B5520", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    New
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5, border: "1px solid rgba(255,255,255,0.35)" }}>
                    AI Powered
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.10)", color: "#F0CA7A", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5, border: "1px solid rgba(255,255,255,0.18)" }}>
                    Flagship Service
                  </span>
                </div>

                <h2 style={{ color: "#fff", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                  AI-Powered ERP System
                </h2>
                <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 16, lineHeight: 1.7, marginBottom: 28, maxWidth: 560 }}>
                  Purpose-built or layered onto your existing SAP, Oracle, or Microsoft
                  Dynamics — XERXEZ delivers intelligent ERP that learns, adapts, and
                  scales with your enterprise operations.
                </p>

                {/* Stats */}
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
                  {erpStats.map((stat) => (
                    <div key={stat.val} style={{ textAlign: "left" }}>
                      <div style={{ color: "#F0CA7A", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{stat.val}</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA buttons — each is an independent Link */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <Link
                    to="/service/ai-powered-erp"
                    style={{
                      background: "#ffffff", color: "#B47428",
                      padding: "13px 32px", borderRadius: 8,
                      fontWeight: 700, fontSize: 15, display: "inline-flex",
                      alignItems: "center", gap: 10, textDecoration: "none",
                      border: "none", transition: "background 0.2s",
                    }}
                  >
                    Explore AI ERP
                    <i className="far fa-arrow-right" style={{ fontSize: 13 }}></i>
                  </Link>
                  <Link
                    to="/contact"
                    style={{
                      background: "transparent", color: "#fff",
                      padding: "13px 32px", borderRadius: 8,
                      fontWeight: 600, fontSize: 15, display: "inline-flex",
                      alignItems: "center", gap: 10, textDecoration: "none",
                      border: "1px solid rgba(255,255,255,0.35)", transition: "background 0.2s",
                    }}
                  >
                    Request a Demo
                    <i className="far fa-arrow-right" style={{ fontSize: 13 }}></i>
                  </Link>
                </div>
              </div>

              {/* Right: module links — each independently navigable */}
              <div style={{ flex: "0 1 280px", zIndex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                {erpModules.map((m) => (
                  <Link
                    key={m.label}
                    to={m.to}
                    style={{
                      background: "rgba(255,255,255,0.09)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10, padding: "11px 18px",
                      display: "flex", alignItems: "center", gap: 12,
                      color: "#fff", textDecoration: "none",
                      transition: "background 0.18s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                  >
                    <i className={m.icon} style={{ color: "#F0CA7A", width: 18, textAlign: "center" }}></i>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</span>
                    <i className="fas fa-check-circle" style={{ color: "#4ade80", marginLeft: "auto", fontSize: 13 }}></i>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── OTHER SERVICES ── */}
        <div className={`row g-4`}>
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
              {/* Shader card */}
              <div style={{ position: "relative", height: 300, borderRadius: 18, overflow: "hidden" }}>
                {/* Warp shader background */}
                <div style={{ position: "absolute", inset: 0 }}>
                  <Warp
                    style={{ width: "100%", height: "100%" }}
                    proportion={0.38}
                    softness={0.95}
                    distortion={0.18}
                    swirl={0.75}
                    swirlIterations={10}
                    shape={shaderShapes[service.slug] ?? "edge"}
                    shapeScale={0.1}
                    scale={1}
                    rotation={0}
                    speed={0.6}
                    colors={shaderColors[service.slug] ?? ["hsl(20,60%,28%)", "hsl(35,72%,48%)", "hsl(14,55%,34%)", "hsl(42,80%,58%)"]}
                  />
                </div>

                {/* Dark overlay + content */}
                <div style={{
                  position: "relative", zIndex: 1, height: "100%",
                  display: "flex", flexDirection: "column",
                  padding: "26px 26px 22px",
                  background: "rgba(12,8,4,0.72)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 50, height: 50, borderRadius: 13,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 18, fontSize: 19, color: "#ffffff", flexShrink: 0,
                  }}>
                    <i className={faIcons[service.slug] ?? "fas fa-cogs"} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    marginBottom: 10, fontSize: 16, lineHeight: 1.3,
                    fontWeight: 700, color: "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <Link to={`/service/${service.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {service.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 13, lineHeight: 1.7,
                    marginBottom: 18, flex: 1,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {service.description}
                  </p>

                  {/* More Details */}
                  <Link
                    to={`/service/${service.slug}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 12,
                      textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.04em", textTransform: "uppercase",
                    }}
                  >
                    More Details
                    <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection3;

