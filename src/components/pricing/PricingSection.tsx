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
            Flexible Pricing for Every Enterprise Need
          </h2>
          <p className="mt-3">
            Whether you are a growing startup or a global enterprise, XERXEZ has a plan
            that fits your scale. <br /> All plans include dedicated support and SLA-backed delivery.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 mt-3 mt-md-0">
            <span
              onClick={() => setIsMonthly(true)}
              style={{ fontSize: 18, fontWeight: isMonthly ? 600 : 400, cursor: 'pointer', color: isMonthly ? '#6c57d2' : 'inherit' }}
            >Monthly</span>
            <div
              onClick={() => setIsMonthly(m => !m)}
              role="switch"
              aria-checked={!isMonthly}
              style={{
                width: 75, height: 32, borderRadius: 20,
                background: '#6c57d2', position: 'relative',
                cursor: 'pointer', flexShrink: 0,
                border: '1px solid #6c57d2', transition: 'background 0.2s',
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
              style={{ fontSize: 18, fontWeight: !isMonthly ? 600 : 400, cursor: 'pointer', color: !isMonthly ? '#6c57d2' : 'inherit' }}
            >Yearly</span>
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

