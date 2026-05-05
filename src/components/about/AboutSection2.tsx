import Image from "../utils/Image";
interface Props {
  variant?: boolean;
}
const AboutSection2 = ({ variant }: Props) => {
  return (
    <section className="about-section-2 section-padding fix">
      <div className="plane-shape float-bob-x">
        <Image
          src="assets/img/about/plane-shape.png"
          alt="img"
          width={108}
          height={100}
        />
      </div>
      <div className="vec-shape">
        <Image
          src="assets/img/about/vector-2.png"
          alt="img"
          width={99}
          height={57}
        />
      </div>
      <div className="container">
        <div className={`about-wrapper-2 ${variant ? "m-0" : ""}`}>
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className={`about-img ${variant ? "" : "agn-choose-5-img"}`}>
                <Image
                  src="assets/img/about/about-2-01.png"
                  alt="img"
                  width={639}
                  height={669}
                  className="fade-in"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title mb-0 text-start">
                  <span className="fade-in">Welcome to SEOZ</span>
                  <h2 className="char-animation">
                    Generating New ​Customers via Online Mode
                  </h2>
                </div>

                <p className="about-text">
                  Welcome to SEOZ your trusted partner for comprehensive SEO and
                  digital marketing solutions with our proven expertise
                </p>

                <div
                  className="icon-box"
                  data-aos="fade-up"
                  data-aos-delay="200" // stagger delay for each card
                  data-aos-duration="1000" // smooth animation duration
                  data-aos-easing="ease-out-cubic" // smooth easing
                  data-aos-once="true"
                >
                  <div className="icon">
                    <i className="flaticon-research"></i>
                  </div>
                  <div className="content">
                    <h3>Market Growth Research</h3>
                    <p>
                      Welcome to SEOZ your trusted partner for comprehensive SEO
                      and digital marketing solutions.
                    </p>
                  </div>
                </div>

                <div
                  className="icon-box"
                  data-aos="fade-up"
                  data-aos-delay="400" // stagger delay for each card
                  data-aos-duration="1000" // smooth animation duration
                  data-aos-easing="ease-out-cubic" // smooth easing
                  data-aos-once="true"
                >
                  <div className="icon style-2">
                    <i className="flaticon-online-service"></i>
                  </div>

                  <div className="content">
                    <h3>Market Growth Research</h3>
                    <p>
                      Welcome to SEOZ your trusted partner for comprehensive SEO
                      and digital marketing solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-feature-wrapper-1 section-padding pb-0">
          <div
            className="about-feature-box"
            data-aos="fade-up"
            data-aos-delay="200" // stagger delay for each card
            data-aos-duration="1000" // smooth animation duration
            data-aos-easing="ease-out-cubic" // smooth easing
            data-aos-once="true"
          >
            <div className="about-icon">
              <i className="flaticon-video-marketing-1"></i>
            </div>
            <div className="about-content">
              <h3>Advanced data Analytics</h3>
              <p>
                Mauris sem ante, iaculis eget nisl placerat hendrerit.
                Suspendisse velit for
              </p>
            </div>
          </div>

          <div
            className="about-feature-box"
            data-aos="fade-up"
            data-aos-delay="400" // stagger delay for each card
            data-aos-duration="1000" // smooth animation duration
            data-aos-easing="ease-out-cubic" // smooth easing
            data-aos-once="true"
          >
            <div className="about-icon style-2">
              <i className="flaticon-market-analysis"></i>
            </div>
            <div className="about-content">
              <h3>High Performance</h3>
              <p>
                Mauris sem ante, iaculis eget nisl placerat hendrerit.
                Suspendisse velit for
              </p>
            </div>
          </div>

          <div
            className="about-feature-box"
            data-aos="fade-up"
            data-aos-delay="600" // stagger delay for each card
            data-aos-duration="1000" // smooth animation duration
            data-aos-easing="ease-out-cubic" // smooth easing
            data-aos-once="true"
          >
            <div className="about-icon style-3">
              <i className="flaticon-presentation"></i>
            </div>
            <div className="about-content">
              <h3>Increase Business Growth</h3>
              <p>
                Mauris sem ante, iaculis eget nisl placerat hendrerit.
                Suspendisse velit for
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection2;
