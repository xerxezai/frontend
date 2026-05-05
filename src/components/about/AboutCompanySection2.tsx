import { aboutCompanyData } from "../../data";
import React from "react";

const AboutCompanySection2 = () => {
  return (
    <section className="about-feature-section-3 section-padding bg-cover fix">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">About Our Company</span>
          <h2 className="text-white char-animation">
            More than 3000+ <br /> Projects in 120+ Countries
          </h2>
          <p className="text-white">
            Welcome to SEOZ your trusted partner for comprehensive SEO and{" "}
            <br />
            digital marketing solutions with our proven expertise
          </p>
        </div>
        <div className="about-feature-wrapper-3">
          <div className="row">
            {aboutCompanyData.map((feature, index) => (
              <div className="col-xl-4 col-lg-6 col-md-6" key={feature.id}>
                <div
                  className={`about-feature-box-3 ${feature.extraClass || ""}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 200} // stagger delay for each card
                  data-aos-duration="1000" // smooth animation duration
                  data-aos-easing="ease-out-cubic" // smooth easing
                  data-aos-once="true"
                >
                  <div className="about-feature-icon">
                    <div
                      className={`about-icon ${feature.iconStyleClass || ""}`}
                    >
                      <i className={feature.iconClass}></i>
                    </div>
                    <h3>
                      {feature.title.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < feature.title.split("\n").length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </h3>
                  </div>
                  <p className="mt-4">
                    {feature.description.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < feature.description.split("\n").length - 1 && (
                          <br />
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCompanySection2;
