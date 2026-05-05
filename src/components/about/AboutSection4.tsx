import { Link } from "react-router-dom";
import Image from "../utils/Image";

const AboutSection4 = () => {
  return (
    <section className="about-company-3 fix section-padding pt-0">
      <div className="container">
        <div className="about-company-wrapper-3">
          <div className="dot-shape">
            <Image
              src="assets/img/about/dot-shape-2.png"
              alt="img"
              width={648}
              height={648}
            />
          </div>
          <div className="vector-shape">
            <Image
              src="assets/img/about/vector.png"
              alt="img"
              width={136}
              height={91}
            />
          </div>
          <div className="plane-shape">
            <Image
              src="assets/img/about/plane-shape-2.png"
              alt="img"
              width={197}
              height={89}
            />
          </div>
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="about-company-image">
                <div className="row g-4">
                  <div className="col-xl-6 col-lg-6 col-sm-6">
                    <div className="about-image-1">
                      <Image
                        src="assets/img/about/01.jpg"
                        alt="img"
                        width={306}
                        height={565}
                        className="fade-in"
                      />
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-6 col-sm-6">
                    <div className="about-image-2">
                      <Image
                        src="assets/img/about/02.jpg"
                        alt="img"
                        width={286}
                        height={418}
                        className="fade-in"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-company-content">
                <div className="section-title">
                  <span className="fade-in">About Our Company</span>
                  <h2 className="char-animation">
                    Proven Results, And Exceptional Your Services
                  </h2>
                </div>

                <p className="about-text">
                  Walleye poolfish sand goby butterfly ray stream catfish
                  jewfish spanish. Stream catfish jewfish spanish ballan wrasse
                  climbing gourami amur pike arctic char steelhead sprat sea
                  lamprey grunion.
                </p>

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

                <div className="company-btn fade-in">
                  <Link to="/contact" className="theme-btn">
                    Get Started
                    <i className="far fa-arrow-right"></i>
                  </Link>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection4;
