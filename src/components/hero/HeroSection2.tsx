import CountUp from "../utils/CountUp";
import { useCustomContext } from "../../context/context";
import { Link } from "react-router-dom";

const HeroSection2 = () => {
  const { toggleVideoModal } = useCustomContext();
  return (
    <section className="hero-section-2 hero-2">
      <div className="plane-shape">
        <img
          src="/assets/img/hero/plane-shape-2.png"
          alt="img"
          width={148}
          height={88}
        />
      </div>
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="char-animation">We're Experts in Optimizing for Your Site!</h1>
              <p className="hero-text">
                Over 10 years SEOZ helping companies reach their financial and
                branding goals for your company.
              </p>

              <div className="hero-btn fade-in">
                <Link to="/contact" className="theme-btn">
                  Get Started
                  <i className="far fa-arrow-right"></i>
                </Link>
                <Link to="/about" className="theme-btn style-2">
                  Explore More
                  <i className="far fa-arrow-right"></i>
                </Link>
              </div>

              <div className="hero-counter-item fade-in">
                <div className="counter-box">
                  <CountUp value={23} suffix="+" />
                  <p>Year Experience</p>
                </div>
                <div className="counter-box">
                  <CountUp value={498} suffix="+" />
                  <p>Project Completed</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=954&h=1041&fit=crop"
                alt="hero"
                className="img-custom-anim-right"
                width={954}
                height={1041}
                style={{ borderRadius: 16, objectFit: 'cover' }}
              />
              <button
                className="video-btn ripple video-popup"
                onClick={toggleVideoModal}
              >
                <i className="fas fa-play"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection2;