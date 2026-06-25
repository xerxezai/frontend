import { Link } from "react-router-dom";

const SERVICES = [
  {
    icon: "fas fa-brain",
    title: "AI-Powered ERP",
    slug: "ai-powered-erp",
    desc: "Intelligent ERP systems that automate operations, forecast demand, and surface real-time insights across every business unit.",
  },
  {
    icon: "fas fa-shield-alt",
    title: "DevSecOps Pipelines",
    slug: "devsecops-mlops-solutions",
    desc: "Security-embedded CI/CD pipelines and production ML infrastructure for teams that need to ship fast and stay compliant.",
  },
  {
    icon: "fas fa-cloud",
    title: "Cloud Infrastructure",
    slug: "cloud-service-storage",
    desc: "Multi-cloud architecture and cost-optimized storage solutions built for high-throughput, data-intensive enterprise workloads.",
  },
  {
    icon: "fas fa-code",
    title: "Software Development",
    slug: "software-development",
    desc: "Custom enterprise applications and strategic technology consulting to accelerate your digital transformation.",
  },
  {
    icon: "fas fa-chalkboard-teacher",
    title: "AI Training & Consulting",
    slug: "ai-training-consulting",
    desc: "Corporate AI training programs to upskill teams on LLMs, MLOps, and AI-native workflows.",
  },
  {
    icon: "fas fa-atom",
    title: "Quantum Computing",
    slug: "quantum-computing",
    desc: "Harness quantum algorithms for complex optimization, cryptography, and next-gen enterprise computing challenges.",
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Mobile Application",
    slug: "mobile-application",
    desc: "Native and cross-platform mobile apps built for performance, security, and seamless enterprise user experience.",
  },
  {
    icon: "fas fa-server",
    title: "Web & Mobile Hosting",
    slug: "web-mobile-hosting",
    desc: "Scalable, secure hosting infrastructure with 99.9% uptime SLA across AWS, Azure, and GCP.",
  },
  {
    icon: "fas fa-comments",
    title: "Software Consulting",
    slug: "software-consulting",
    desc: "Strategic technology advisory to align your software architecture with business goals and future growth.",
  },
];

const ServiceSection2 = () => (
  <section style={{ background: "#F0EEE9", padding: "100px 0" }}>
    <div className="container">
      <div className="section-title text-center" style={{ marginBottom: 48 }}>
        <span className="fade-in">Our Services</span>
        <h2 className="char-animation">
          Enterprise Solutions for <br /> Every Business Challenge
        </h2>
      </div>

      <div className="row g-4">
        {SERVICES.map((card, index) => (
          <div
            key={card.slug}
            className="col-xl-4 col-lg-4 col-md-6"
            data-aos="fade-up"
            data-aos-delay={index * 60}
            data-aos-duration="900"
            data-aos-easing="ease-out-cubic"
            data-aos-once="true"
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #DDDAD4",
                borderRadius: 16,
                padding: "32px 28px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.25s, transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#6c57d2";
                el.style.transform = "perspective(900px) rotateX(2deg) rotateY(-2deg) translateY(-8px)";
                el.style.boxShadow = "0 24px 60px rgba(108,87,210,0.13)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#DDDAD4";
                el.style.transform = "none";
                el.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "rgba(108,87,210,0.08)",
                border: "1px solid rgba(108,87,210,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24, fontSize: 22, color: "#6c57d2", flexShrink: 0,
                transition: "background 0.3s, transform 0.3s",
              }}>
                <i className={card.icon} />
              </div>

              <h3 style={{ marginBottom: 10, fontSize: 18, lineHeight: 1.3, fontWeight: 700, color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>
                <Link to={`/service/${card.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {card.title}
                </Link>
              </h3>

              <p style={{ color: "#4A4A4A", fontSize: 14, lineHeight: 1.75, marginBottom: 24, flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
                {card.desc}
              </p>

              <Link
                to={`/service/${card.slug}`}
                style={{
                  marginTop: "auto", display: "inline-flex", alignItems: "center",
                  gap: 6, color: "#6c57d2", fontWeight: 600, fontSize: 13,
                  textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                  transition: "gap 0.2s",
                }}
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

export default ServiceSection2;
