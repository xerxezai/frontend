import { Link } from "react-router-dom";
import { homeOneServices } from "../../data";
import Image from "../utils/Image";

const ServiceSection5 = () => {
  return (
    <section className="service-section-solve section-padding pt-0">
      <div className="right-shape-2">
        <Image
          src="assets/img/service/right-shape-2.png"
          alt="img"
          width={819}
          height={912}
        />
      </div>
      <div className="container position-relative z-1">
        <div className="section-title-area text-center text-lg-start">
          <div className="section-title">
            <span className="fade-in">Our Services</span>
            <h2 className="text-white char-animation">
              Our Services Can Solve any <br /> Marketing Problem
            </h2>
          </div>
          <p className="text-white">
            Welcome to SEOZ your trusted partner for comprehensive SEO <br />{" "}
            and digital marketing solutions. With our proven expertise.
          </p>
        </div>

        <div className="row">
          {homeOneServices.slice(0, 3).map((service, index) => (
            <div key={service.id} className="col-xl-4 col-lg-6 col-md-6">
              <div
                className="service-card-items style-2"
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
                  <h3 className="service-header-5">
                    <Link to="/service/advanced-data-analytics">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="text-white">{service.description}</p>
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

export default ServiceSection5;
