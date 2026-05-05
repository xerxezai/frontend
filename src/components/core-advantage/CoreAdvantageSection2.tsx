import { useCustomContext } from "../../context/context";
import Image from "../utils/Image";

const CoreAdvantageSection2 = () => {
  const { toggleVideoModal } = useCustomContext();
  return (
    <section className="why-choose-us-section-2 section-padding section-bg fix">
      <div className="container">
        <div className="why-choose-us-wrapper-2">
          <div className="vec-shape">
            <Image
              src="assets/img/feature/vec-1.png"
              alt="img"
              width={159}
              height={94}
            />
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-xl-7 col-lg-6">
              <div className="choose-us-left-content">
                <div className="section-title text-start mb-0">
                  <span className="fade-in">Why Choose Us</span>
                  <h2 className="char-animation">Meet Our Pure Visibility</h2>
                </div>

                <p className="choose-us-text">
                  The time it will take for your website's search engine
                  rankings to begin improving depends on several of its
                  characteristics prior to optimization.
                </p>
                <div className="row g-5">
                  <div className="col-lg-6">
                    <div
                      className="left-content mt-4"
                      data-aos="fade-up"
                      data-aos-delay="200"
                      data-aos-duration="1000"
                      data-aos-easing="ease-out-cubic"
                      data-aos-once="true"
                    >
                      <h4>Our Mission</h4>
                      <p>
                        The time it will take for your website's search engine
                        rankings to begin improving depends on several of its
                        characteristics prior to optimization.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div
                      className="right-content mt-4"
                      data-aos="fade-up"
                      data-aos-delay="400"
                      data-aos-duration="1000"
                      data-aos-easing="ease-out-cubic"
                      data-aos-once="true"
                    >
                      <h4>Our Vision</h4>
                      <p>
                        The time it will take for your website's search engine
                        rankings to begin improving depends on several of its
                        characteristics prior to optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div className="choose-us-image fade-in">
                <Image
                  src="assets/img/choose-us/choose-us-2.png"
                  alt="img"
                  className="img-custom-anim-right"
                  width={526}
                  height={504}
                />
                <a
                  role="button"
                  onClick={toggleVideoModal}
                  className="video-btn ripple video-popup"
                >
                  <i className="fas fa-play"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreAdvantageSection2;
