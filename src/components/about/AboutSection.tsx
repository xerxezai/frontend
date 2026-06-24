import { Link } from "react-router-dom";
import Image from "../utils/Image";

const AboutSection = () => {
  return (
    <section className="about-section fix section-padding pt-0">
      <div className="container">
        <div className="about-wrapper">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="about-img fix appear_left fade-in">
                <Image
                  src="assets/img/about/Frame.png"
                  alt="About XERXEZ"
                  width={636}
                  height={568}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title mb-0">
                  <span className="fade-in">About XERXEZ</span>
                  <h2 className="char-animation">
                    Enterprise AI, Cloud &amp; <br /> DevSecOps Solutions
                  </h2>
                </div>

                <p className="about-text">
                  XERXEZ is a technology partner for enterprises building the future — delivering
                  AI-powered ERP systems, MLOps pipelines, cloud infrastructure, and secure
                  software with end-to-end ownership.
                </p>

                <div className="icon-items">
                  <div className="icon">
                    <i className="flaticon-pie-chart"></i>
                  </div>
                  <div className="content">
                    <h3>AI-Native Engineering</h3>
                    <p>
                      From intelligent ERP modules to automated ML workflows, we embed AI at
                      every layer of your enterprise stack.
                    </p>
                  </div>
                </div>

                <ul className="list-items">
                  <li>
                    <i className="flaticon-check"></i>
                    120+ enterprise projects delivered across 15+ industries
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    Cloud-agnostic delivery on AWS, Azure, and GCP
                  </li>
                </ul>

                <Link to="/about" className="theme-btn">
                  Explore More About Us
                  <i className="far fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

