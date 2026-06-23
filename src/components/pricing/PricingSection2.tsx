import { useState } from "react";
import MarqueeSection from "../marquee/MarqueeSection";
import ContactSection2 from "../contact/ContactSection2";
import PricingTabpane2 from "./PricingTabpane2";

const PricingSection2 = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  return (
    <section className="pricing-section-4 style-bg fix section-padding ">
      <div className="container">
        <div className="section-title text-center">
          <span className="text-white fade-in">Our Pricing Plan</span>
          <h2 className="text-white char-animation">
            Choice Best & Reliable Pricing Plan
          </h2>
          <p className="text-white mt-3">
            Whether you are a growing startup or a global enterprise, XERXEZ has a plan
            that fits your scale. <br /> All plans include dedicated support and SLA-backed delivery.
          </p>
        </div>
        <div className="d-flex justify-content-center mt-3 mt-md-0 fade-in">
          <div className="pricing-two__tab">
            <nav>
              <div className="nav nav-tabs">
                {/* Monthly Tab Button */}
                <button
                  className={`nav-link ${isMonthly ? "active" : ""}`}
                  onClick={() => setIsMonthly(true)}
                >
                  Monthly
                </button>
                {/* Yearly Tab Button */}
                <button
                  className={`nav-link ${!isMonthly ? "active" : ""}`}
                  onClick={() => setIsMonthly(false)}
                >
                  Yearly
                </button>
              </div>
            </nav>
          </div>
        </div>
        <div className="pricing__tab-content fade-in">
          <div className="tab-content">
            {/* Monthly Tab Pane */}
            <div className={`tab-pane fade ${isMonthly ? "show active" : ""}`}>
              <PricingTabpane2 monthly={isMonthly} />
            </div>
            {/* Yearly Tab Pane */}
            <div className={`tab-pane fade ${!isMonthly ? "show active" : ""}`}>
              <PricingTabpane2 monthly={isMonthly} />
            </div>
          </div>
        </div>
      </div>
      <MarqueeSection variant />
      <ContactSection2 />
    </section>
  );
};

export default PricingSection2;
