import { Link } from "react-router-dom";
import CountUp from "../utils/CountUp";
import Image from "../utils/Image";

const AboutSection6 = () => {
  return (
    <section className="about-section-5 fix section-padding">
      <div className="container">
        <div className="about-wrapper-5">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title mb-0">
                  <span className="fade-in">About Our Company</span>
                  <h2 className="char-animation">
                    Proven Results, Enterprise-Grade Delivery
                  </h2>
                </div>

                <p className="about-text">
                  XERXEZ is an AI-first technology company helping enterprises build smarter,
                  more secure, and more scalable systems â€” from intelligent ERP platforms to
                  production MLOps infrastructure and cloud-native applications.
                </p>

                <div className="about-list">
                  <ul>
                    <li>
                      <i className="flaticon-check"></i>
                      AI-Powered ERP &amp; Analytics
                    </li>
                    <li>
                      <i className="flaticon-check"></i>
                      DevSecOps &amp; MLOps Pipelines
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <i className="flaticon-check"></i>
                      Cloud Architecture &amp; Migration
                    </li>
                    <li>
                      <i className="flaticon-check"></i>
                      24/7 Enterprise Support
                    </li>
                  </ul>
                </div>

                <div className="choose-us-card">
                  <Link to="/contact" className="theme-btn">
                    Contact Us
                    <i className="far fa-arrow-right"></i>
                  </Link>
                  <div className="phone-box">
                    <div className="icon">
                      <i className="far fa-envelope"></i>
                    </div>
                    <div className="content">
                      <p>Mail Us</p>
                      <h5>xerxez.in@gmail.com</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-image">
                <Image
                  src="assets/img/about/about-05.png"
                  alt="XERXEZ Enterprise Solutions"
                  width={636}
                  height={600}
                  className="fade-in"
                />

                <div className="content">
                  <CountUp value={10} suffix="+" duration={1500} />
                  <p>Years Experience</p>
                  <div className="star">
                    <Image
                      src="assets/img/about/star-box.png"
                      alt="img"
                      width={198}
                      height={198}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection6;

