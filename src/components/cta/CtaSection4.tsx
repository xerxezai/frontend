import { Link } from "react-router-dom";
import Image from "../utils/Image";

const CtaSection4 = () => {
  return (
    <section className="cta-value-secton-3 fix section-padding pt-0">
      <div className="container">
        <div className="cta-value-wrapper-3 bg-cover">
          <div className="row align-items-center">
            <div className="col-xl-6 d-none d-xl-block">
              <div className="cta-image">
                <Image
                  src="assets/img/cta/cta-value.png"
                  alt="img"
                  width={549}
                  height={461}
                />
              </div>
            </div>
            <div className="col-xl-6 mt-4 mt-lg-0">
              <div className="cta-value-content fade-in">
                <div className="section-title mb-0">
                  <span className="text-white fade-in">Our Value</span>
                  <h2 className="text-white char-animation">
                    The Enterprise AI &amp; Cloud Partner You've Been Looking For
                  </h2>
                </div>

                <p className="text">
                  XERXEZ delivers AI-powered ERP, DevSecOps pipelines, and cloud infrastructure
                  that transform how enterprises operate â€” from day one to scale.
                </p>
                
                <Link to="/contact" className="theme-btn">
                  Get Started
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

export default CtaSection4;

