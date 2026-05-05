import { Link } from "react-router-dom";
import { services } from "../../data";
import Image from "../utils/Image";

const ServiceSection4 = () => {
  return (
    <section className="service-section-3 section-padding section-bg">
      <div className="right-shape">
        <Image
          src="assets/img/service/right-shape.png"
          alt="img"
          width={91}
          height={107}
        />
      </div>
      <div className="left-shape">
        <Image
          src="assets/img/service/plane-shape.png"
          alt="img"
          width={266}
          height={121}
        />
      </div>
      <div className="container">
        <div className="service-wrapper-3">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="section-title sticky-style">
                <span className="fade-in">Our Services</span>
                <h2 className="char-animation">
                  Our Services Can <br /> Solve any Marketing
                </h2>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="service-box-items-3">
                <div className="row g-5">
                  {services.slice(0, 4).map((service, index) => (
                    <div
                      key={service.id}
                      className="col-lg-6 col-md-6 col-sm-6"
                      data-aos="fade-up"
                      data-aos-delay={index * 200} // stagger delay for each card
                      data-aos-duration="1000" // smooth animation duration
                      data-aos-easing="ease-out-cubic" // smooth easing
                      data-aos-once="true"
                    >
                      <div className="service-right-box">
                        <div className={`icon style-${index + 1}`}>
                          <i className={service.iconClass}></i>
                        </div>
                        <div className="content">
                          <h3>
                            <Link to={`/service/${service.slug}`}>
                              {service.title}
                            </Link>
                          </h3>
                          <p>{service.description.slice(0, 82)}...</p>
                        </div>
                        <Link
                          to={`/service/${service.slug}`}
                          className="link-btn"
                        >
                          More Details
                          <i className="far fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection4;
