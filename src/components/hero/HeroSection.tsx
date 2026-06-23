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
              <h1 className="char-animation">
                Boost Brand with Professional SEO and Marketing
              </h1>
              <p>You can use search engine optimize and our SEO agency.</p>

              <div className="client-info smooth-fade-in fade-in">
                {/* Google rating badge */}
                <img
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=165&h=61&fit=crop"
                  alt="client info"
                  width={165}
                  height={61}
                  style={{ borderRadius: 8 }}
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                  alt="Google reviews"
                  width={181}
                  height={61}
                  style={{ objectFit: 'contain' }}
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
              {/* Main hero image - SEO/marketing themed */}
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=530&h=755&fit=crop"
                alt="hero"
                className="smooth-fade-in fade-in"
                width={530}
                height={755}
                style={{ borderRadius: 16, objectFit: 'cover' }}
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