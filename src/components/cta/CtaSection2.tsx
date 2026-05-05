import { Link } from "react-router-dom";
import Image from "../utils/Image";

const CtaSection2 = () => {
  return (
    <section className="cta-support-section fix section-padding pt-0 cta-support-bg-style">
      <div className="container">
        <div className="cta-support-wrapper zoom-effect-style">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="cta-support-img">
                <Image
                  src="assets/img/cta/cta-left.png"
                  alt="img"
                  width={586}
                  height={485}
                />
              </div>
            </div>
            <div className="col-lg-6 mt-3 mt-lg-0">
              <div className="cta-support-content">
                <div className="section-title text-start">
                  <span className="text-white fade-in">24/7 Support</span>
                  <h2 className="text-white char-animation">
                    24/7 Customer Support Services from Our SEOZ
                  </h2>
                </div>
                <p className="cta-support-text">
                  Welcome to SEOZ your trusted partner for comprehensive SEO and
                  digital marketing solutions with our proven expertise
                </p>
                <div className="cta-support-box fade-in">
                  <Link to="/contact" className="theme-btn">
                    Contact Us
                    <i className="far fa-arrow-right"></i>
                  </Link>
                  <div className="phone-box">
                    <div className="icon">
                      <Image
                        src="assets/img/call.svg"
                        alt="img"
                        width={22}
                        height={22}
                      />
                    </div>
                    <div className="content">
                      <p>Mail Us</p>
                      <h5>(704) 555-0127</h5>
                    </div>
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

export default CtaSection2;
