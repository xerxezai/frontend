import { Link } from "react-router-dom";
import Image from "../utils/Image";
interface Props {
  variant?: boolean;
}
const CoreAdvantageSection = ({ variant }: Props) => {
  return (
    <section
      className={`choose-us-section fix section-padding ${
        variant ? "section-bg-2" : ""
      }`}
    >
      <div className="container">
        <div className="choose-us-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="choose-us-content">
                <div className="section-title">
                  <span className="fade-in">Why Choose Us</span>
                  <h2 className="char-animation">
                    Proven Results, And Exceptional Your Services
                  </h2>
                </div>
                <p className="choose-us-text">
                  Welcome to SEOZ your trusted partner for comprehensive SEO and{" "}
                  <br /> digital marketing solutions with our proven expertise
                </p>
                <div className="icon-box-items">
                  <div
                    className="icon-box"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                    data-aos-easing="ease-out-cubic"
                    data-aos-once="true"
                  >
                    <div className="icon">
                      <i className="flaticon-mission"></i>
                    </div>
                    <div className="content">
                      <h6>Our Mission</h6>
                      <h5>
                        We strive to be more than just a service <br />{" "}
                        provider; we aim to be trusted SEOZ
                      </h5>
                    </div>
                  </div>
                  <div
                    className="icon-box style-2"
                    data-aos="fade-up"
                    data-aos-delay="400"
                    data-aos-duration="1000"
                    data-aos-easing="ease-out-cubic"
                    data-aos-once="true"
                  >
                    <div className="icon">
                      <i className="flaticon-vision"></i>
                    </div>
                    <div className="content">
                      <h6>Our Vision</h6>
                      <h5>
                        We aspire to create a world where every <br /> business
                        owner feels empowered
                      </h5>
                    </div>
                  </div>
                </div>
                <div
                  className="choose-us-card"
                  data-aos="fade-up"
                  data-aos-delay="600"
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-cubic"
                  data-aos-once="true"
                >
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
              <div className="choose-us-img agn-choose-5-img fade-in">
                <Image
                  src="assets/img/choose-us/choose-us.png"
                  alt="img"
                  width={636}
                  height={573}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreAdvantageSection;
