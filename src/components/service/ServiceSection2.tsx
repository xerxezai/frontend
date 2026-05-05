import { Link } from "react-router-dom";
import { homeOneServices } from "../../data";
import Image from "../utils/Image";

const ServiceSection2 = () => {
  return (
    <section className="service-section-solve fix section-padding">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Services</span>
          <h2 className="text-white char-animation">
            Our Services Can Solve any <br /> Marketing Problem
          </h2>
        </div>

        <div className="row g-0">
          {homeOneServices.map((service, index) => (
            <div key={service.id} className="col-xl-3 col-lg-4 col-md-6">
              <div
                className={`service-card-items ${service.cardClass}`}
                data-aos="fade-up"
                data-aos-delay={index * 200} // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className="service-icon">
                  <Image
                    src={service.imageSrc}
                    alt="img"
                    width={service.width}
                    height={service.height}
                  />
                </div>
                <div className="service-content">
                  <h3>
                    <Link to="/service/advanced-data-analytics">
                      {service.title}
                    </Link>
                  </h3>
                  <p>{service.description}</p>
                  <Link
                    to="/service/advanced-data-analytics"
                    className="link-btn"
                  >
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

export default ServiceSection2;
