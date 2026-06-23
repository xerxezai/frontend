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
        <img
          src="/assets/img/hero/shape-1.png"
          alt="img"
          width={189}
          height={311}
        />
      </div>
      <div className="shape-2">
        <img
          src="/assets/img/hero/shape-2.png"
          alt="img"
          width={86}
          height={104}
        />
      </div>
      <div className="shape-3">
        <img
          src="/assets/img/hero/shape-3.png"
          alt="img"
          width={91}
          height={113}
        />
      </div>
      <div className="shape-4">
        <img
          src="/assets/img/hero/shape-4.png"
          alt="img"
          width={100}
          height={100}
        />
      </div>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="char-animation">
                Advanced AI SEO Services Dominate Search Results
              </h1>
              <p>
                Over 10 years SEOZ helping companies reach their financial and
                branding goals for your company.
              </p>
              <div className="hero-button fade-in">
                <Link to="/faq" className="theme-btn">
                  Get Started
                  <i className="far fa-arrow-right"></i>
                </Link>
                <div className="link-btn">
                  Call Us: <a href="tel:88812345678">(888) 1234-5678</a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-image float-bob-x">
              <img
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=721&h=727&fit=crop"
                alt="hero"
                width={721}
                height={727}
                style={{ borderRadius: 16, objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection4;