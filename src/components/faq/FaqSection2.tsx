import { faqData } from "../../data";
import { useState } from "react";

interface Props {
  variant?: boolean;
  reverse?: boolean;
  noPaddingBottom?: boolean;
}
const FaqSection2 = ({ variant, reverse, noPaddingBottom }: Props) => {
  const [openItemId, setOpenItemId] = useState<number | null>(1);
  const handleAccordionClick = (itemId: number) => {
    setOpenItemId((prevId) => (prevId === itemId ? null : itemId));
  };

  const enterpriseStats = [
    { value: "50+", label: "Enterprise Deployments", icon: "fas fa-building" },
    { value: "99.9%", label: "Uptime SLA Guarantee", icon: "fas fa-shield-alt" },
    { value: "40%", label: "Avg Cost Reduction", icon: "fas fa-chart-line" },
    { value: "8 wks", label: "Typical Go-Live Time", icon: "fas fa-rocket" },
  ];

  const capabilities = [
    "ISO 27001 & SOC 2 Type II ready",
    "Multi-cloud: AWS, Azure, GCP",
    "AI-native, not AI-bolted-on",
    "24/7 dedicated support teams",
    "Ministry & defence-grade security",
    "Zero vendor lock-in architecture",
  ];

  return (
    <section
      className={`faq-section-3 fix section-padding ${variant ? "" : "pt-0"} ${noPaddingBottom ? "pb-0" : ""}`}
    >
      <div className="container">
        <div className="faq-wrapper-3">
          <div className={`row g-4 align-items-center ${reverse ? "flex-row-reverse" : ""}`}>
            <div className="col-lg-6">
              <div className="faq-content">
                <div className="section-title mb-5">
                  <span className="fade-in">Our FAQs</span>
                  <h2 className="char-animation">Frequently Asked Questions</h2>
                </div>
                <div className="faq-items style-2">
                  <div className="faq-accordion">
                    <div className="accordion">
                      {faqData.map((item, index) => (
                        <div
                          key={item.id}
                          className={`accordion-item ar-accordion-item ${
                            item.id === faqData.length ? "mb-0" : ""
                          }`}
                          data-aos="fade-up"
                          data-aos-delay={index * 100}
                          data-aos-duration="800"
                          data-aos-easing="ease-out-cubic"
                          data-aos-once="true"
                        >
                          <h5 className="accordion-header">
                            <button
                              className={`accordion-button ${
                                openItemId === item.id ? "" : "collapsed"
                              }`}
                              type="button"
                              style={{ textTransform: "none" }}
                              onClick={() => handleAccordionClick(item.id)}
                              aria-expanded={
                                openItemId === item.id ? "true" : "false"
                              }
                            >
                              {item.question}
                            </button>
                          </h5>
                          <div
                            className={`ar-accordion-body ${
                              openItemId === item.id ? "show" : ""
                            }`}
                          >
                            <div className="accordion-body">{item.answer}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              {variant ? (
                <div
                  style={{
                    background: "linear-gradient(135deg, #0F2741 0%, #163557 80%, #1A3F6A 100%)",
                    borderRadius: 20,
                    padding: "40px 36px",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  data-aos="fade-left"
                  data-aos-duration="900"
                  data-aos-once="true"
                >
                  {/* Decorative background circles */}
                  <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(201,136,58,0.18)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: -40, left: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,121,46,0.1)", pointerEvents: "none" }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E5B460", marginBottom: 8, display: "block" }}>
                      Enterprise Credentials
                    </span>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 28, lineHeight: 1.3 }}>
                      Trusted by Enterprises Across 5+ Industries
                    </h3>

                    {/* Stats grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                      {enterpriseStats.map((stat) => (
                        <div key={stat.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 16px", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <i className={stat.icon} style={{ color: "#E5B460", fontSize: 18, marginBottom: 10, display: "block" }} />
                          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{stat.value}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Capabilities list */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#ff792e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                        Core Capabilities
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                        {capabilities.map((cap) => (
                          <div key={cap} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
                            <i className="fas fa-check-circle" style={{ color: "#C9883A", marginTop: 2, flexShrink: 0 }} />
                            {cap}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="faq-image img-custom-anim-right"
                  data-aos="fade-left"
                  data-aos-duration="900"
                  data-aos-once="true"
                >
                  <img
                    src="assets/img/faq.png"
                    alt="FAQ illustration"
                    width={596}
                    height={607}
                    className="fade-in"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection2;

