import { Link } from "react-router-dom";

const CtaSection5 = () => {
  return (
    <section className="cta-section-4 section-padding fix bg-cover">
      <div className="container">
        <div className="section-title mb-0 text-center">
          <span className="text-white fade-in">Free Assessment</span>
          <h2 className="text-white char-animation">
            XERXEZ Offers a Free 15-Day Tech Assessment!
          </h2>
          <p className="text-white mt-4">
            Our enterprise technology assessment covers your current stack, architecture gaps,
            security posture, and AI readiness — delivered as an actionable roadmap with
            no commitment required for the first 15 days.
          </p>
        </div>

        <div className="button-items fade-in">
          <Link to="/contact" className="theme-btn">
            Get Started
            <i className="far fa-arrow-right"></i>
          </Link>
          <Link to="/service" className="theme-btn style-bg">
            Explore Services
            <i className="far fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection5;
