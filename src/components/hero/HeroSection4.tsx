import { Link } from "react-router-dom";

const HeroSection4 = () => {
  return (
    <section className="hero-section-4 hero-4 fix">
      <div className="hero-bg">
        <img
          src="/assets/img/hero/hero-bg-4.png"
          alt="img"
          width={1832}
          height={1037}
        />
      </div>
      <div className="shape-1">
        <img src="/assets/img/hero/shape-1.png" alt="img" width={189} height={311} />
      </div>
      <div className="shape-2">
        <img src="/assets/img/hero/shape-2.png" alt="img" width={86} height={104} />
      </div>
      <div className="shape-3">
        <img src="/assets/img/hero/shape-3.png" alt="img" width={91} height={113} />
      </div>
      <div className="shape-4">
        <img src="/assets/img/hero/shape-4.png" alt="img" width={100} height={100} />
      </div>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="char-animation">
                AI-First Enterprise Technology That Scales Securely
              </h1>
              <p>
                Over 10 years helping enterprises modernise with AI-powered ERP,
                DevSecOps pipelines, and cloud infrastructure built for production.
              </p>
              <div className="hero-button fade-in">
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
            <div className="hero-image float-bob-x">
              <img
                src="/assets/img/hero/hero-4-photo.jpg"
                alt="XERXEZ enterprise AI"
                width={721}
                height={727}
                style={{ borderRadius: 16, objectFit: 'cover', width: '100%', maxHeight: 520 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection4;

