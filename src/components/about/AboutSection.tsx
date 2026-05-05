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
                  alt="img"
                  width={636}
                  height={568}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title mb-0">
                  <span className="fade-in">About SEOZ</span>
                  <h2 className="char-animation">
                    Why You Need SEO & <br /> Digital Marketing Services
                  </h2>
                </div>

                <p className="about-text">
                  Welcome to SEOZ your trusted partner for comprehensive SEO and
                  digital marketing solutions with our proven expertise
                </p>

                <div className="icon-items">
                  <div className="icon">
                    <i className="flaticon-pie-chart"></i>
                  </div>
                  <div className="content">
                    <h3>Media Management</h3>
                    <p>
                      Welcome to SEOZ your trusted partner for comprehensive SEO
                      and digital marketing solutions.
                    </p>
                  </div>
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
