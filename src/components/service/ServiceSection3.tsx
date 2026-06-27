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
            <div style={{
              background: "linear-gradient(145deg, #081828 0%, #0F2741 35%, #132E50 70%, #0E2240 100%)",
              borderRadius: 22,
              padding: "52px 56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 40,
              flexWrap: "wrap",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: "1px solid rgba(255,255,255,0.18)",
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.10)",
                "0 8px 0 rgba(0,0,0,0.40)",
                "0 20px 60px rgba(0,0,0,0.50)",
                "0 0 100px rgba(240,202,122,0.07)",
              ].join(", "),
            }}>
              {/* Dot-grid texture */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }} />
              {/* Ambient amber glow behind stats */}
              <div style={{
                position: "absolute", bottom: -120, left: "25%", zIndex: 0,
                width: 420, height: 420, borderRadius: "50%", pointerEvents: "none",
                background: "radial-gradient(circle, rgba(240,202,122,0.10) 0%, transparent 68%)",
              }} />
              {/* Top-right soft orb */}
              <div style={{
                position: "absolute", top: -100, right: -80, zIndex: 0,
                width: 320, height: 320, borderRadius: "50%", pointerEvents: "none",
                background: "radial-gradient(circle, rgba(100,160,255,0.06) 0%, transparent 65%)",
              }} />

              {/* Left: text + CTAs */}
              <div style={{ flex: "1 1 420px", zIndex: 1, position: "relative" }}>
                {/* 3D Badges */}
                <div style={{ display: "flex", gap: 8, marginBottom: 26, flexWrap: "wrap" }}>
                  <span style={{
                    background: "linear-gradient(135deg, #F0CA7A 0%, #d4a33a 100%)",
                    color: "#4A2800", fontSize: 10, fontWeight: 800,
                    padding: "5px 14px", borderRadius: 20, letterSpacing: "0.12em",
                    textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 3px 0 rgba(120,70,0,0.55), 0 5px 12px rgba(240,202,122,0.28)",
                  }}>New</span>
                  <span style={{
                    background: "rgba(255,255,255,0.09)", color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "5px 14px", borderRadius: 20,
                    letterSpacing: "0.10em", textTransform: "uppercase",
                    border: "1px solid rgba(255,255,255,0.20)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 6px rgba(0,0,0,0.25)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>AI Powered</span>
                  <span style={{
                    background: "rgba(240,202,122,0.10)", color: "#F0CA7A",
                    fontSize: 10, fontWeight: 700, padding: "5px 14px", borderRadius: 20,
                    letterSpacing: "0.10em", textTransform: "uppercase",
                    border: "1px solid rgba(240,202,122,0.30)",
                    boxShadow: "inset 0 1px 0 rgba(240,202,122,0.15)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Flagship Service</span>
                </div>

                <h2 style={{
                  color: "#fff", fontSize: "clamp(28px, 3.8vw, 46px)",
                  fontWeight: 900, lineHeight: 1.08, marginBottom: 20,
                  fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em",
                  textShadow: "0 2px 24px rgba(240,202,122,0.10)",
                }}>
                  AI-Powered<br />
                  <span style={{ color: "#F0CA7A" }}>ERP System</span>
                </h2>

                <p style={{
                  color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.78,
                  marginBottom: 32, maxWidth: 520, fontFamily: "'DM Sans', sans-serif",
                }}>
                  Purpose-built or layered onto your existing SAP, Oracle, or Microsoft
                  Dynamics — XERXEZ delivers intelligent ERP that learns, adapts, and
                  scales with your enterprise operations.
                </p>

                {/* Stats — each a mini 3D glass panel */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
                  {erpStats.map((stat) => (
                    <div key={stat.val} style={{
                      background: "rgba(255,255,255,0.055)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderTop: "1px solid rgba(255,255,255,0.20)",
                      borderRadius: 14, padding: "16px 22px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 14px rgba(0,0,0,0.22)",
                      minWidth: 118,
                    }}>
                      <div style={{
                        color: "#F0CA7A", fontSize: 32, fontWeight: 900, lineHeight: 1,
                        fontFamily: "'DM Sans', sans-serif",
                        textShadow: "0 0 22px rgba(240,202,122,0.50)",
                      }}>{stat.val}</div>
                      <div style={{
                        color: "rgba(255,255,255,0.50)", fontSize: 11, marginTop: 6,
                        fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em",
                      }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <Link to="/service/ai-powered-erp" style={{
                    background: "linear-gradient(135deg, #F0CA7A 0%, #d4a33a 100%)",
                    color: "#4A2800", padding: "13px 30px", borderRadius: 10,
                    fontWeight: 800, fontSize: 14, display: "inline-flex",
                    alignItems: "center", gap: 10, textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.01em",
                    boxShadow: "0 5px 0 rgba(100,60,0,0.55), 0 8px 24px rgba(240,202,122,0.22)",
                  }}>
                    Explore AI ERP
                    <i className="far fa-arrow-right" style={{ fontSize: 12 }}></i>
                  </Link>
                  <Link to="/contact" style={{
                    background: "rgba(255,255,255,0.08)", color: "#fff",
                    padding: "13px 30px", borderRadius: 10,
                    fontWeight: 600, fontSize: 14, display: "inline-flex",
                    alignItems: "center", gap: 10, textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.01em",
                    border: "1px solid rgba(255,255,255,0.22)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 16px rgba(0,0,0,0.22)",
                  }}>
                    Request a Demo
                    <i className="far fa-arrow-right" style={{ fontSize: 12 }}></i>
                  </Link>
                </div>
              </div>

              {/* Right: module links — 3D glass rows */}
              <div style={{ flex: "0 1 300px", zIndex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
                {erpModules.map((m) => (
                  <Link
                    key={m.label}
                    to={m.to}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderTop: "1px solid rgba(255,255,255,0.16)",
                      borderRadius: 12, padding: "12px 16px",
                      display: "flex", alignItems: "center", gap: 12,
                      color: "#fff", textDecoration: "none",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 3px 8px rgba(0,0,0,0.18)",
                      transition: "background 0.18s, transform 0.18s, box-shadow 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.12), 0 5px 16px rgba(0,0,0,0.26)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.07), 0 3px 8px rgba(0,0,0,0.18)";
                    }}
                  >
                    {/* Icon in mini amber glass badge */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: "linear-gradient(135deg, rgba(240,202,122,0.20) 0%, rgba(240,202,122,0.07) 100%)",
                      border: "1px solid rgba(240,202,122,0.28)",
                      boxShadow: "inset 0 1px 0 rgba(240,202,122,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <i className={m.icon} style={{ color: "#F0CA7A", fontSize: 13 }}></i>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{m.label}</span>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(74,222,128,0.14)",
                      border: "1px solid rgba(74,222,128,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <i className="fas fa-check" style={{ color: "#4ade80", fontSize: 8 }}></i>
                    </div>
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

