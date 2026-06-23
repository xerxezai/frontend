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
                  <span className="text-white fade-in">Start Your Journey</span>
                  <h2 className="text-white char-animation">
                    Ready to Transform Your Enterprise with AI &amp; Cloud?
                  </h2>
                </div>

                <p className="text-white">
                  Whether you need an AI-powered ERP, a DevSecOps pipeline, cloud infrastructure,
                  or a full digital transformation roadmap â€” XERXEZ delivers end-to-end.
                </p>
                <div className="cta-card fade-in">
                  <Link to="/contact" className="theme-btn">
                    Contact Us
                    <i className="far fa-arrow-right"></i>
                  </Link>
                  <div className="phone-box">
                    <div className="icon">
                      <i className="far fa-envelope"></i>
                    </div>
                    <div className="content">
                      <p className="text-white">Mail Us</p>
                      <h5 className="text-white">xerxez.in@gmail.com</h5>
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

