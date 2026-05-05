import { Link } from "react-router-dom";

const CtaSection5 = () => {
  return (
    <section className="cta-section-4 section-padding fix bg-cover">
      <div className="container">
        <div className="section-title mb-0 text-center">
          <span className="text-white fade-in">Baseline SEO Report</span>
          <h2 className="text-white char-animation">
            SEOZ Offers First 15 Days Free Trial!
          </h2>
          <p className="text-white mt-4">
            Our SEO services include 4 basic SEO service packages for websites
            and Advanced SEO Plus service packages to meet the <br />{" "}
            advertising needs and budgets of almost any business operating in
            any industry.
          </p>
        </div>

        <div className="button-items fade-in">
          <Link to="/contact" className="theme-btn">
            Get Started
            <i className="far fa-arrow-right"></i>
          </Link>
          <Link to="/contact" className="theme-btn style-bg">
            Explore More
            <i className="far fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection5;
