import { Link } from "react-router-dom";
import { services } from "../../data";
import React, { useMemo } from "react";
import Image from "../utils/Image";

interface Props {
  mainSection?: boolean;
}

const otherServices = services.filter((s) => s.slug !== "ai-powered-erp");

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
            <Link
              to="/service/ai-powered-erp"
              style={{ textDecoration: "none", display: "block" }}
              className="erp-flagship-card"
            >
              <div
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
                <span
                  style={{
                    position: "absolute", top: -60, right: -60,
                    width: 220, height: 220, borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                    pointerEvents: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute", bottom: -40, left: "38%",
                    width: 160, height: 160, borderRadius: "50%",
                    background: "rgba(255,255,255,0.03)",
                    pointerEvents: "none",
                  }}
                />

                {/* Left: text */}
                <div style={{ flex: "1 1 400px", zIndex: 1 }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                    <span
                      style={{
                        background: "#ff792e", color: "#fff",
                        fontSize: 12, fontWeight: 700, padding: "4px 14px",
                        borderRadius: 20, letterSpacing: 0.5, textTransform: "uppercase",
                      }}
                    >
                      New
                    </span>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.18)", color: "#fff",
                        fontSize: 12, fontWeight: 700, padding: "4px 14px",
                        borderRadius: 20, letterSpacing: 0.5,
                        border: "1px solid rgba(255,255,255,0.35)",
                      }}
                    >
                      AI Powered
                    </span>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.10)", color: "#d4c8ff",
                        fontSize: 12, fontWeight: 600, padding: "4px 14px",
                        borderRadius: 20, letterSpacing: 0.5,
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                    >
                      Flagship Service
                    </span>
                  </div>

                  <h2
                    style={{
                      color: "#fff", fontSize: "clamp(26px, 3.5vw, 38px)",
                      fontWeight: 800, lineHeight: 1.2, marginBottom: 16,
                    }}
                  >
                    AI-Powered ERP System
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.78)", fontSize: 16,
                      lineHeight: 1.7, marginBottom: 28, maxWidth: 560,
                    }}
                  >
                    Purpose-built or layered onto your existing SAP, Oracle, or Microsoft
                    Dynamics -- XERXEZ delivers intelligent ERP that learns, adapts, and
                    scales with your enterprise operations.
                  </p>

                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
                    {[
                      { val: "40%", label: "Operations cost reduction" },
                      { val: "60%", label: "Faster decision-making" },
                      { val: "99.9%", label: "System uptime SLA" },
                    ].map((stat) => (
                      <div key={stat.val} style={{ textAlign: "left" }}>
                        <div style={{ color: "#ff792e", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                          {stat.val}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span
                      style={{
                        background: "#6c57d2", color: "#fff",
                        padding: "13px 32px", borderRadius: 8,
                        fontWeight: 700, fontSize: 15, display: "inline-flex",
                        alignItems: "center", gap: 10, border: "none",
                      }}
                    >
                      Explore AI ERP
                      <i className="far fa-arrow-right" style={{ fontSize: 13 }}></i>
                    </span>
                    <span
                      style={{
                        background: "transparent", color: "#fff",
                        padding: "13px 32px", borderRadius: 8,
                        fontWeight: 600, fontSize: 15, display: "inline-flex",
                        alignItems: "center", gap: 10,
                        border: "1px solid rgba(255,255,255,0.35)",
                      }}
                    >
                      Request a Demo
                      <i className="far fa-arrow-right" style={{ fontSize: 13 }}></i>
                    </span>
                  </div>
                </div>

                {/* Right: module pills */}
                <div
                  style={{
                    flex: "0 1 280px", zIndex: 1,
                    display: "flex", flexDirection: "column", gap: 12,
                  }}
                >
                  {[
                    { icon: "fas fa-chart-bar", label: "Finance & Accounting" },
                    { icon: "fas fa-users", label: "Human Resources" },
                    { icon: "fas fa-boxes", label: "Inventory & Supply Chain" },
                    { icon: "fas fa-handshake", label: "CRM & Sales" },
                    { icon: "fas fa-file-invoice-dollar", label: "Invoicing & Purchases" },
                    { icon: "fas fa-brain", label: "AI Analytics & Forecasting" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      style={{
                        background: "rgba(255,255,255,0.09)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 10, padding: "11px 18px",
                        display: "flex", alignItems: "center", gap: 12,
                        color: "#fff",
                      }}
                    >
                      <i className={m.icon} style={{ color: "#ff792e", width: 18, textAlign: "center" }}></i>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</span>
                      <i
                        className="fas fa-check-circle"
                        style={{ color: "#4ade80", marginLeft: "auto", fontSize: 13 }}
                      ></i>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ── OTHER SERVICES ── */}
        <div className={`row ${mainSection ? "g-5" : ""}`}>
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
              <div className="service-icon-box-items-2">
                <div className="icon">
                  <i className={service.iconClass}></i>
                  <div className="icon-bg">
                    <Image
                      src={service.iconBgImg}
                      alt="img"
                      width={service.width}
                      height={service.height}
                    />
                  </div>
                </div>
                <div className="content">
                  <h3>
                    <Link to={`/service/${service.slug}`}>
                      {service.title.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < service.title.split("\n").length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </Link>
                  </h3>
                  <p>{service.description}</p>
                  <Link to={`/service/${service.slug}`} className="link-btn">
                    More Details
                    <i className="far fa-arrow-right"></i>
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
