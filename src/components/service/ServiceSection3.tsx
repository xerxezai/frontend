import { Link } from "react-router-dom";
import { services } from "../../data";
import React, { useMemo } from "react";
import Image from "../utils/Image";

interface Props {
  mainSection?: boolean;
}

const ServiceSection3 = ({ mainSection }: Props) => {
  const renderedServices = useMemo(() => {
    return services
      .slice(0, mainSection ? services.length : 4)
      .map((service, index) => (
        <div
          key={service.id}
          className="col-xl-3 col-lg-4 col-md-6"
          data-aos="fade-up"
          data-aos-delay={index * 200} // stagger delay for each card
          data-aos-duration="1000" // smooth animation duration
          data-aos-easing="ease-out-cubic" // smooth easing
          data-aos-once="true"
        >
          <div className="service-icon-box-items-2">
            <div className="icon">
              <i className={service.iconClass}></i>
              <div className="icon-bg">
                <Image
                  src={service.iconBgImg}
                  alt="img"
                  width={service.width}
                  height={service.height}
                />
              </div>
            </div>
            <div className="content">
              <h3>
                <Link to={`/service/${service.slug}`}>
                  {service.title.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < service.title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Link>
              </h3>
              <p>{service.description}</p>
              <Link to={`/service/${service.slug}`} className="link-btn">
                More Details
                <i className="far fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      ));
  }, [mainSection]);

  return (
    <section className="service-section-2 section-padding fix">
      {!mainSection && (
        <>
          <div className="left-shape">
            <Image
              src="assets/img/service/left-shape.png"
              alt="img"
              width={30}
              height={30}
            />
          </div>
          <div className="right-shape">
            <Image
              src="assets/img/service/right-shape-3.png"
              alt="img"
              width={42}
              height={44}
            />
          </div>
        </>
      )}
      <div className="container position-relative z-1">
        <div className="section-title text-center">
          <span className="fade-in">Our Services</span>
          <h2 className="char-animation">
            Our Services Can Solve any
            <br /> Marketing Problem
          </h2>
        </div>
        <div className={`row ${mainSection ? "g-5" : ""}`}>
          {renderedServices}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection3;
