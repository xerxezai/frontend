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
        <div className="d-flex align-items-center justify-content-center gap-3 mt-3 mt-md-0 fade-in">
          <span
            onClick={() => setIsMonthly(true)}
            style={{ fontSize: 18, fontWeight: isMonthly ? 600 : 400, cursor: 'pointer', color: '#fff' }}
          >Monthly</span>
          <div
            onClick={() => setIsMonthly(m => !m)}
            role="switch"
            aria-checked={!isMonthly}
            style={{
              width: 75, height: 32, borderRadius: 20,
              background: '#fff', position: 'relative',
              cursor: 'pointer', flexShrink: 0,
              border: '1px solid #fff', transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#ff792e', position: 'absolute',
              top: 3,
              left: isMonthly ? 4 : 47,
              transition: 'left 0.25s cubic-bezier(.4,0,.2,1)',
            }} />
          </div>
          <span
            onClick={() => setIsMonthly(false)}
            style={{ fontSize: 18, fontWeight: !isMonthly ? 600 : 400, cursor: 'pointer', color: '#fff' }}
          >Yearly</span>
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

