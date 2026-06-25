import { Link } from "react-router-dom";
import { services } from "../../data";

const faIcons: Record<string, string> = {
  "ai-powered-erp":           "fas fa-brain",
  "devsecops-mlops-solutions": "fas fa-shield-alt",
  "cloud-service-storage":    "fas fa-cloud",
  "software-development":     "fas fa-code",
};

const topServices = services.slice(0, 4);

const ServiceSection = () => {
  return (
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
          {topServices.map((service, index) => (
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
                {/* Icon */}
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
                  <i
                    className={faIcons[service.slug] ?? "fas fa-cogs"}
                    style={{ fontSize: 20, color: "#6c57d2" }}
                  />
                </div>

                {/* Title */}
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
                  <Link
                    to={`/service/${service.slug}`}
                    style={{ color: "#1A1A1A", textDecoration: "none" }}
                  >
                    {service.title.replace(/\n/g, " ")}
                  </Link>
                </h3>

                {/* Description — full text, no truncation */}
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
                  {service.description}
                </p>

                {/* Arrow link */}
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
};

export default ServiceSection;
