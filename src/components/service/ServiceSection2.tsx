import { Link } from "react-router-dom";
import { Warp } from "@paper-design/shaders-react";

const SERVICES = [
  {
    icon: "fas fa-brain",
    title: "AI-Powered ERP",
    slug: "ai-powered-erp",
    desc: "Intelligent ERP systems that automate operations, forecast demand, and surface real-time insights across every business unit.",
    colors: ["hsl(16,55%,42%)", "hsl(30,70%,55%)", "hsl(8,50%,32%)", "hsl(25,65%,60%)"],
    shape: "edge" as const,
  },
  {
    icon: "fas fa-shield-alt",
    title: "DevSecOps Pipelines",
    slug: "devsecops-mlops-solutions",
    desc: "Security-embedded CI/CD pipelines and production ML infrastructure for teams that need to ship fast and stay compliant.",
    colors: ["hsl(215,60%,22%)", "hsl(210,75%,42%)", "hsl(220,65%,28%)", "hsl(200,80%,52%)"],
    shape: "stripes" as const,
  },
  {
    icon: "fas fa-cloud",
    title: "Cloud Infrastructure",
    slug: "cloud-service-storage",
    desc: "Multi-cloud architecture and cost-optimized storage solutions built for high-throughput, data-intensive enterprise workloads.",
    colors: ["hsl(185,55%,25%)", "hsl(178,70%,42%)", "hsl(192,60%,30%)", "hsl(170,75%,52%)"],
    shape: "edge" as const,
  },
  {
    icon: "fas fa-code",
    title: "Software Development",
    slug: "software-development",
    desc: "Custom enterprise applications and strategic technology consulting to accelerate your digital transformation.",
    colors: ["hsl(32,70%,32%)", "hsl(42,80%,52%)", "hsl(28,65%,38%)", "hsl(48,85%,62%)"],
    shape: "stripes" as const,
  },
  {
    icon: "fas fa-chalkboard-teacher",
    title: "AI Training & Consulting",
    slug: "ai-training-consulting",
    desc: "Corporate AI training programs to upskill teams on LLMs, MLOps, and AI-native workflows.",
    colors: ["hsl(250,55%,25%)", "hsl(262,65%,48%)", "hsl(244,60%,30%)", "hsl(268,72%,58%)"],
    shape: "edge" as const,
  },
  {
    icon: "fas fa-atom",
    title: "Quantum Computing",
    slug: "quantum-computing",
    desc: "Harness quantum algorithms for complex optimization, cryptography, and next-gen enterprise computing challenges.",
    colors: ["hsl(340,55%,30%)", "hsl(352,68%,52%)", "hsl(334,60%,36%)", "hsl(358,75%,62%)"],
    shape: "stripes" as const,
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Mobile Application",
    slug: "mobile-application",
    desc: "Native and cross-platform mobile apps built for performance, security, and seamless enterprise user experience.",
    colors: ["hsl(150,55%,20%)", "hsl(144,68%,40%)", "hsl(156,60%,26%)", "hsl(138,74%,50%)"],
    shape: "edge" as const,
  },
  {
    icon: "fas fa-server",
    title: "Web & Mobile Hosting",
    slug: "web-mobile-hosting",
    desc: "Scalable, secure hosting infrastructure with 99.9% uptime SLA across AWS, Azure, and GCP.",
    colors: ["hsl(20,60%,28%)", "hsl(28,72%,48%)", "hsl(14,55%,34%)", "hsl(35,78%,58%)"],
    shape: "stripes" as const,
  },
  {
    icon: "fas fa-comments",
    title: "Software Consulting",
    slug: "software-consulting",
    desc: "Strategic technology advisory to align your software architecture with business goals and future growth.",
    colors: ["hsl(205,58%,22%)", "hsl(198,72%,42%)", "hsl(212,63%,28%)", "hsl(192,80%,52%)"],
    shape: "edge" as const,
  },
];

const ServiceSection2 = () => (
  <section style={{ background: "#FDFCFB", padding: "100px 0" }}>
    <div className="container">
      <div className="section-title text-center" style={{ marginBottom: 56 }}>
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
            {/* Shader card wrapper */}
            <div style={{ position: "relative", height: 300, borderRadius: 20, overflow: "hidden" }}>

              {/* Warp shader background */}
              <div style={{ position: "absolute", inset: 0 }}>
                <Warp
                  style={{ width: "100%", height: "100%" }}
                  proportion={0.38}
                  softness={0.95}
                  distortion={0.18}
                  swirl={0.75}
                  swirlIterations={10}
                  shape={card.shape}
                  shapeScale={0.1}
                  scale={1}
                  rotation={0}
                  speed={0.6}
                  colors={card.colors}
                />
              </div>

              {/* Dark overlay + content */}
              <div style={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "28px 28px 24px",
                background: "rgba(12,8,4,0.72)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}>
                {/* Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20, fontSize: 20, color: "#ffffff", flexShrink: 0,
                }}>
                  <i className={card.icon} />
                </div>

                {/* Title */}
                <h3 style={{
                  marginBottom: 10, fontSize: 17, lineHeight: 1.3,
                  fontWeight: 700, color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <Link to={`/service/${card.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {card.title}
                  </Link>
                </h3>

                {/* Description */}
                <p style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 13, lineHeight: 1.7,
                  marginBottom: 20, flex: 1,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {card.desc}
                </p>

                {/* More Details link */}
                <Link
                  to={`/service/${card.slug}`}
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

export default ServiceSection2;
