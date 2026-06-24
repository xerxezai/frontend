import { Link } from "react-router-dom";

const cards = [
  {
    icon: "fas fa-brain",
    title: "AI Powered ERP",
    desc: "Intelligent ERP systems that automate operations, forecast demand, and surface real-time insights across every business unit.",
    slug: "ai-powered-erp",
  },
  {
    icon: "fas fa-shield-alt",
    title: "DevSecOps / MLOps Solutions",
    desc: "Security-embedded CI/CD pipelines and production ML infrastructure for teams that need to ship fast and stay compliant.",
    slug: "devsecops-mlops-solutions",
  },
  {
    icon: "fas fa-cloud",
    title: "Cloud Infrastructure",
    desc: "Multi-cloud architecture and cost-optimized storage solutions built for high-throughput, data-intensive enterprise workloads.",
    slug: "cloud-service-storage",
  },
  {
    icon: "fas fa-code",
    title: "Software Development & Consulting",
    desc: "Custom enterprise applications and strategic technology consulting to accelerate your digital transformation.",
    slug: "software-development",
  },
];

const ServiceSection2 = () => {
  return (
    <section className="service-section-solve fix section-padding">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Services</span>
          <h2 className="text-white char-animation">
            Enterprise Solutions for <br /> Every Business Challenge
          </h2>
        </div>

        <div className="row g-4">
          {cards.map((card, index) => (
            <div
              key={card.slug}
              className="col-xl-3 col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={index * 150}
              data-aos-duration="900"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <div
                style={{
                  background: "rgba(13,11,36,0.85)",
                  border: "1px solid rgba(108,87,210,0.25)",
                  borderRadius: 16,
                  padding: "32px 28px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(108,87,210,0.6)";
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "0 12px 36px rgba(108,87,210,0.22)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(108,87,210,0.25)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
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
                  }}
                >
                  <i className={card.icon} />
                </div>

                <h3 style={{ marginBottom: 10, fontSize: 19, lineHeight: 1.3, color: "#fff" }}>
                  <Link to={`/service/${card.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {card.title}
                  </Link>
                </h3>

                <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.8, marginBottom: 24, flex: 1 }}>
                  {card.desc}
                </p>

                <Link
                  to={`/service/${card.slug}`}
                  className="link-btn"
                  style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 8 }}
                >
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

export default ServiceSection2;
