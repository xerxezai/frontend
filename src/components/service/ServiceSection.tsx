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

const ServiceSection = () => (
  <section
    className="service-section fix section-padding"
    style={{ background: "#EAE7E0" }}
  >
    <div className="container">
      <div className="section-title text-center" style={{ marginBottom: 48 }}>
        <span
          className="fade-in"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6c57d2",
            display: "block",
            marginBottom: 12,
          }}
        >
          What We Do
        </span>
        <h2
          className="char-animation"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            color: "#1A1A1A",
          }}
        >
          Enterprise Solutions <br />
          Powered by AI &amp; <em style={{ color: "#6c57d2", fontStyle: "italic" }}>Cloud</em>
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 16,
            lineHeight: 1.75,
            color: "#4A4A4A",
            maxWidth: 560,
            margin: "16px auto 0",
          }}
        >
          XERXEZ delivers AI-powered ERP, DevSecOps pipelines, cloud infrastructure,
          and custom software that help enterprises scale securely and intelligently.
        </p>
      </div>

      <div className="row g-4">
        {SERVICES.map((service, index) => (
          <div
            key={service.slug}
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
                borderRadius: 18,
                padding: "32px 28px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 400ms ease, box-shadow 400ms ease, border-color 400ms ease",
                cursor: "pointer",
                boxShadow: "0 4px 25px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
                el.style.borderColor = "#6c57d2";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "";
                el.style.boxShadow = "0 4px 25px rgba(0,0,0,0.06)";
                el.style.borderColor = "#DDDAD4";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(108,87,210,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  flexShrink: 0,
                }}
              >
                <i className={service.icon} style={{ fontSize: 20, color: "#6c57d2" }} />
              </div>

              <h3
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1.3,
                  marginBottom: 10,
                  flexShrink: 0,
                }}
              >
                <Link to={`/service/${service.slug}`} style={{ color: "#1A1A1A", textDecoration: "none" }}>
                  {service.title}
                </Link>
              </h3>

              <p
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#4A4A4A",
                  margin: 0,
                  flex: 1,
                }}
              >
                {service.desc}
              </p>

              <div style={{ marginTop: 20, flexShrink: 0 }}>
                <Link
                  to={`/service/${service.slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#6c57d2",
                    textDecoration: "none",
                  }}
                >
                  Learn more <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceSection;
