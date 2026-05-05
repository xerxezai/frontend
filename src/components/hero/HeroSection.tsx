import { Link } from "react-router-dom";
import Image from "../utils/Image";

const HeroSection = () => {
  return (
    <section className="hero-section hero-1 bg-cover">
      <div className="left-shape float-bob-x">
        <Image
          src="assets/img/hero/left-shape.png"
          alt="img"
          width={98}
          height={81}
        />
      </div>
      <div className="plane-shape">
        <Image
          src="assets/img/hero/plane-shape.png"
          alt="img"
          width={266}
          height={121}
        />
      </div>
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="char-animation">
                Boost Brand with Professional SEO and Marketing
              </h1>
              <p className="">
                You can use search engine optimize and our SEO agency.
              </p>

              <div className="client-info smooth-fade-in fade-in">
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
              <div className="hero-btn smooth-fade-in fade-in">
                <Link to="/contact" className="theme-btn">
                  Get Started
                  <i className="far fa-arrow-right"></i>
                </Link>
                <Link to="/about" className="theme-btn style-2">
                  Explore More
                  <i className="far fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-img">
              <Image
                src="assets/img/hero/hero-1-img.png"
                alt="img"
                className={'smooth-fade-in fade-in'}
                width={530}
                height={755}
              />
              <div className="box-shape float-bob-y">
                <Image
                  src="assets/img/hero/box-shape-2.png"
                  alt="img"
                  width={341}
                  height={204}
                />
              </div>

              <div className="box-shape-2 float-bob-y">
                <Image
                  src="assets/img/hero/box-shape.png"
                  alt="img"
                  width={321}
                  height={230}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
