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
    <section className="service-section fix section-padding">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">What We Do</span>
          <h2 className="char-animation">
            Enterprise Solutions <br />
            Powered by AI &amp; Cloud
          </h2>
          <p className="mt-3">
            XERXEZ delivers AI-powered ERP, DevSecOps pipelines, cloud infrastructure,
            and custom software that help enterprises scale securely and intelligently.
          </p>
        </div>

        <div className="row">
          {topServices.map((service, index) => (
            <div
              key={service.id}
              className="col-xl-3 col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={index * 200}
              data-aos-duration="1000"
              data-aos-easing="ease-out-cubic"
              data-aos-once="true"
            >
              <div
                className={`service-card-items-1 ${
                  index % 2 === 0 ? "item_right_1" : "item_left_1"
                }`}
              >
                <div className={`service-icon color-${index + 1}`}>
                  <i className={faIcons[service.slug] ?? "fas fa-cogs"}></i>
                </div>
                <div className="service-content">
                  <h3>
                    <Link to={`/service/${service.slug}`}>
                      {service.title.replace(/\n/g, " ")}
                    </Link>
                  </h3>
                  <p>{service.description.slice(0, 80)}...</p>
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
