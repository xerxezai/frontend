import { Link } from "react-router-dom";
import Image from "../utils/Image";

const CtaSection3 = () => {
  return (
    <section className="cta-section-2 section-padding fix pb-0">
      <div className="container">
        <div className="cta-wrapper-2">
          <div className="row g-4 justify-content-between">
            <div className="col-xl-6 col-lg-6">
              <div className="cta-content">
                <div className="section-title text-lg-start">
                  <span className="text-white fade-in">Cta Contact</span>
                  <h2 className="text-white char-animation">
                    Ready to Take Your SEO to The Next Level
                  </h2>
                </div>

                <p className="text-white">
                  The time it will take for your website's search engine
                  rankings to begin improving depends on several of its
                  characteristics prior to optimization.
                </p>
                <div className="cta-card fade-in">
                  <Link to="/contact" className="theme-btn">
                    Contact Us
                    <i className="far fa-arrow-right"></i>
                  </Link>
                  <div className="phone-box">
                    <div className="icon">
                      <i className="far fa-phone-alt"></i>
                    </div>
                    <div className="content">
                      <p className="text-white">Mail Us</p>
                      <h5 className="text-white">(704) 555-0127</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div className="cta-right-image img-custom-anim-bottom">
                <Image
                  src="assets/img/cta/cta-right.png"
                  alt="img"
                  width={526}
                  height={515}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection3;
