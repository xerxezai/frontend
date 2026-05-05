import { Link } from "react-router-dom";
import Image from "../utils/Image";

const AboutCompanySection = () => {

  return (
    <section className="about-company-section fix">
      <div className="dot-shape">
        <Image
          src="assets/img/about/dot-shape.png"
          alt="img"
          width={512}
          height={487}
        />
      </div>
      <div className="vector-shape">
        <Image
          src="assets/img/about/vector-3.png"
          alt="img"
          width={183}
          height={67}
        />
      </div>
      <div className="container">
        <div className="about-company-wrapper">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-company-image">
                <Image
                  src="assets/img/about/about-company-image.jpg"
                  alt="img"
                  className="img-custom-anim-left"
                  width={920}
                  height={728}
                />

                <div className="box-items">
                  <p>
                    “Our SEO and Digital Marketing agency offers a range of
                    pricing plans tailored”
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-company-content">
                <div className="section-title mb-0 text-start">
                  <span className="fade-in">About Our Company</span>
                  <h1 className="text-white char-animation">
                    Proven Results, And Exceptional Your Services
                  </h1>
                </div>

                <p className="about-text mt-2">
                  Walleye poolfish sand goby butterfly ray stream catfish
                  jewfish spanish. Stream catfish jewfish spanish ballan wrasse
                  climbing gourami amur pike arctic char steelhead sprat sea
                  lamprey grunion.
                </p>
                <p>
                  Stream catfish jewfish spanish ballan wrasse climbing gourami
                  amur pike arctic char steelhead sprat sea lamprey grunion.
                </p>
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
                <Link to="/about" className="theme-btn mt-5">
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

export default AboutCompanySection;
