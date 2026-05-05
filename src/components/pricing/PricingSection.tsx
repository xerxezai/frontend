import { useState } from "react";
import PricingTabpane from "./PricingTabpane";

interface Props {
  variant?: boolean;
}
const PricingSection = ({ variant }: Props) => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section
      className={`pricing-section ${
        variant ? "" : "has-bg"
      } fix section-padding`}
    >
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our Pricing Plan</span>
          <h2 className="char-animation">
            Choice Best & Reliable Pricing Plan
          </h2>
          <p className="mt-3">
            Welcome to SEOZ your trusted partner for comprehensive SEO and
            digital marketing solutions. With <br /> our proven expertise and
            innovative strategies the digital landscape.
          </p>
          <div className="d-flex justify-content-center mt-3 mt-md-0">
            <div className="pricing-two__tab">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button
                    className={`nav-link ${isMonthly ? "active" : ""}`}
                    onClick={() => setIsMonthly(true)}
                    role="tab"
                    aria-selected={isMonthly}
                  >
                    Monthly
                  </button>
                  <button
                    className={`nav-link ${!isMonthly ? "active" : ""}`}
                    onClick={() => setIsMonthly(false)}
                    role="tab"
                    aria-selected={!isMonthly}
                  >
                    Yearly
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="pricing__tab-content fade-in">
          <div className="tab-content" id="nav-tabContent">
            <div
              className={`tab-pane fade ${isMonthly ? "show active" : ""}`}
              role="tabpanel"
            >
              <PricingTabpane monthly={isMonthly} />
            </div>
            <div
              className={`tab-pane fade ${!isMonthly ? "show active" : ""}`}
              role="tabpanel"
            >
              <PricingTabpane monthly={isMonthly} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
