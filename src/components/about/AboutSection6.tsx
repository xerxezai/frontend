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
                    Proven Results, And Exceptional Your Services
                  </h2>
                </div>

                <p className="about-text">
                  Walleye poolfish sand goby butterfly ray stream catfish
                  jewfish spanish. Stream catfish jewfish spanish ballan wrasse
                  climbing gourami amu.
                </p>

                <div className="about-list">
                  <ul>
                    <li>
                      <i className="flaticon-check"></i>
                      SEO Audit & Analysis
                    </li>
                    <li>
                      <i className="flaticon-check"></i>
                      Location based market
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <i className="flaticon-check"></i>
                      Monthly Reports
                    </li>
                    <li>
                      <i className="flaticon-check"></i>
                      24/7 Customer Service
                    </li>
                  </ul>
                </div>

                <div className="client-info">
                  <Image
                    src="assets/img/hero/client-info.png"
                    alt="img"
                    width={165}
                    height={61}
                  />
                  <Image
                    src="assets/img/hero/client-info-letter.png"
                    alt="img"
                    width={181}
                    height={61}
                  />
                </div>

                <div className="choose-us-card">
                  <Link to="/contact" className="theme-btn">
                    Contact Us
                    <i className="far fa-arrow-right"></i>
                  </Link>
                  <div className="phone-box">
                    <div className="icon">
                      <i className="far fa-phone-alt"></i>
                    </div>
                    <div className="content">
                      <p>Mail Us</p>
                      <h5>(704) 555-0127</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-image">
                <Image
                  src="assets/img/about/about-05.png"
                  alt="img"
                  width={636}
                  height={600}
                  className="fade-in"
                />

                <div className="content">
                  <CountUp value={26} suffix="+" duration={1500} />
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
