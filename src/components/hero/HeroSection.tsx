import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-section hero-1 bg-cover">
      <div className="left-shape float-bob-x">
        <img src="/assets/img/hero/left-shape.png" alt="img" width={98} height={81} />
      </div>
      <div className="plane-shape">
        <img src="/assets/img/hero/plane-shape.png" alt="img" width={266} height={121} />
      </div>
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <span className="hero-sub-tag">
                <i className="fas fa-bolt"></i>
                Enterprise AI &amp; Cloud Solutions
              </span>
              <h1 className="char-animation">
                AI-Powered ERP, MLOps &amp; Cloud for Modern Enterprises
              </h1>
              <p>
                XERXEZ delivers intelligent enterprise software, DevSecOps pipelines,
                and cloud infrastructure that transform how your business operates at scale.
              </p>

              <div className="hero-btn smooth-fade-in fade-in">
                <Link to="/contact" className="theme-btn">
                  Get Started
                  <i className="far fa-arrow-right"></i>
                </Link>
                <Link to="/service" className="theme-btn style-2">
                  Our Services
                  <i className="far fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-img">
              <img
                src="/assets/img/hero/hero-1-img.png"
                alt="XERXEZ Enterprise Solutions"
                className="smooth-fade-in fade-in"
                width={530}
                height={755}
                style={{ borderRadius: 16, objectFit: "cover" }}
              />
              <div className="box-shape float-bob-y">
                <img src="/assets/img/hero/box-shape-2.png" alt="img" width={341} height={204} />
              </div>
              <div className="box-shape-2 float-bob-y">
                <img src="/assets/img/hero/box-shape.png" alt="img" width={321} height={230} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
