import { Link } from "react-router-dom";
import { services } from "../../data";
import React, { useMemo } from "react";
import Image from "../utils/Image";

const faIcons: Record<string, string> = {
  "devsecops-mlops-solutions": "fas fa-shield-alt",
  "cloud-service-storage":     "fas fa-cloud",
  "software-development":      "fas fa-code",
  "software-consulting":       "fas fa-lightbulb",
  "ai-training":               "fas fa-graduation-cap",
  "quantum-computing":         "fas fa-atom",
  "mobile-application":        "fas fa-mobile-alt",
  "web-mobile-hosting":        "fas fa-server",
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

const ServiceSection3 = ({ mainSection }: Props) => {
  const displayedOthers = useMemo(
    () => (mainSection ? otherServices : otherServices.slice(0, 3)),
    [mainSection]
  );

  return (
    <section className="service-section-2 section-padding fix">
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
        <div className="section-title text-center">
          <span className="fade-in">Our Services</span>
          <h2 className="char-animation">
            End-to-End Solutions for
            <br /> Every Enterprise Challenge
          </h2>
        </div>

        {/* ── FLAGSHIP: AI-Powered ERP ── */}
        <div className="row mb-4" data-aos="fade-up" data-aos-duration="900" data-aos-once="true">
          <div className="col-12">
            <div
              className="erp-flagship-card"
              style={{
                background: "linear-gradient(135deg, #003566 0%, #1a0a5c 60%, #6c57d2 100%)",
                borderRadius: 16,
                padding: "48px 52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 32,
                flexWrap: "wrap",
                boxShadow: "0 8px 40px rgba(108,87,210,0.28)",
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
                  <span style={{ background: "#ff792e", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    New
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5, border: "1px solid rgba(255,255,255,0.35)" }}>
                    AI Powered
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.10)", color: "#d4c8ff", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5, border: "1px solid rgba(255,255,255,0.18)" }}>
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
                      <div style={{ color: "#ff792e", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{stat.val}</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA buttons — each is an independent Link */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <Link
                    to="/service/ai-powered-erp"
                    style={{
                      background: "#6c57d2", color: "#fff",
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
                    <i className={m.icon} style={{ color: "#ff792e", width: 18, textAlign: "center" }}></i>
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
              <div
                style={{
                  background: "#0d0b24",
                  border: "1px solid rgba(108,87,210,0.2)",
                  borderRadius: 16,
                  padding: "32px 28px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(108,87,210,0.55)";
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "0 12px 36px rgba(108,87,210,0.18)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(108,87,210,0.2)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  background: "rgba(108,87,210,0.15)",
                  border: "1px solid rgba(108,87,210,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  fontSize: 24,
                  color: "#ff792e",
                  flexShrink: 0,
                }}>
                  <i className={faIcons[service.slug] || "fas fa-cogs"} />
                </div>

                {/* Title */}
                <h3 style={{ marginBottom: 10, fontSize: 19, lineHeight: 1.3, color: "#fff" }}>
                  <Link to={`/service/${service.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {service.title.replace(/\n/g, " ")}
                  </Link>
                </h3>

                {/* Description */}
                <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.8, marginBottom: 24, flex: 1 }}>
                  {service.description}
                </p>

                {/* More Details link */}
                <Link to={`/service/${service.slug}`} className="link-btn" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  More Details
                  <i className="far fa-arrow-right" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection3;
