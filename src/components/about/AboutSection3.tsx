import { Link } from "react-router-dom";
import Image from "../utils/Image";

const AboutSection3 = () => {
  return (
    <section className="about-section-3 section-padding fix">
      <div className="container">
        <div className="about-wrapper-3">
          <div className="row g-4 align-items-end">
            <div className="col-xl-3 col-lg-6">
              <div className="about-left-image img-custom-anim-left">
                <Image
                  src="assets/img/about/about-3-left-img.png"
                  alt="img"
                  width={306}
                  height={539}
                  className="fade-in"
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="about-content-3">
                <div className="section-title mb-0">
                  <span className="fade-in">Welcome to SEOZ</span>
                  <h2 className="char-animation">
                    Generating New <br /> Customers via Online Mode
                  </h2>
                </div>

                <p className="about-text-3">
                  Welcome to SEOZ your trusted partner for comprehensive SEO and
                  digital marketing solutions. With our proven expertise.
                </p>
                <div className="about-btn">
                  <Link to="/contact" className="theme-btn">
                    Get Started
                    <i className="far fa-arrow-right"></i>
                  </Link>
                </div>
                <ul className="list-items">
                  <li>
                    <i className="flaticon-check"></i>
                    Competitive online business, the higher the position
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    Identify converted customers who reached your business
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    Analyze your chances against your competitors
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6">
              <div className="about-right-image fade-in">
                <Image
                  src="assets/img/about/about-3-right-img.png"
                  alt="img"
                  className="img-custom-anim-right fade-in"
                  width={306}
                  height={467}
                />

                <div className="about-right-image-2">
                  <Image
                    src="assets/img/about/about-3-right-img-circle.png"
                    alt="img"
                    width={216}
                    height={216}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection3;
