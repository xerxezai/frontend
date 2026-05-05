import { Link } from "react-router-dom";
import Image from "../utils/Image";

const AboutSection5 = () => {
  return (
    <section className="about-section-4 section-padding">
      <div className="about-shape">
        <Image
          src="assets/img/about/home-4-about-shape.png"
          alt="img"
          width={639}
          height={829}
        />
      </div>
      <div className="container">
        <div className="about-wrapper-4">
          <div className="row g-4 align-items-center">
            <div className="col-xl-6">
              <div className="about-images appear_left fade-in">
                <Image
                  src="assets/img/about/home-4-about-img.png"
                  alt="img"
                  width={926}
                  height={660}
                />
              </div>
            </div>
            <div className="col-xl-6">
              <div className="about-contents">
                <div className="section-title mb-0">
                  <span className="fade-in">Welcome to SEOZ</span>
                  <h2 className="text-white char-animation">
                    Generating New <br /> Customers via Online Mode
                  </h2>
                </div>

                <p className="about-text text-white mt-3">
                  Start working with an company that can provide everything you
                  need to <br /> generate awareness, drive traffic, connect
                  with.
                </p>

                <div className="list-box">
                  <ul>
                    <li>
                      <i className="flaticon-check"></i>
                      SEO Audit & Analysis
                    </li>
                    <li>
                      <i className="flaticon-check"></i>
                      Monthly Reports
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <i className="flaticon-check"></i>
                      Google Analytics Installation
                    </li>
                    <li>
                      <i className="flaticon-check"></i>
                      24/7 Customer Service
                    </li>
                  </ul>
                </div>

                <div className="progress-wrap">
                  <div className="pro-items">
                    <div className="pro-head">
                      <h6 className="title">SEO Analysis</h6>
                      <span className="point">80%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-value"></div>
                    </div>
                  </div>
                  <div className="pro-items">
                    <div className="pro-head">
                      <h6 className="title">Engaging Content</h6>
                      <span className="point">90%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-value style-two"></div>
                    </div>
                  </div>
                </div>

                <div className="about-btn">
                  <Link to="/contact" className="theme-btn">
                    Explore More About Us
                    <i className="far fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection5;
