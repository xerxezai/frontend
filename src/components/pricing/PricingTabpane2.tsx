import React from "react";
import { Link } from "react-router-dom";
import { pricingPlans } from "../../data";

interface PricingTabpaneProps {
  monthly: boolean;
}

const PricingTabpane2: React.FC<PricingTabpaneProps> = ({ monthly }) => {
  return (
    <div className="pricing-package-wrapper">
      <div className="row">
        {pricingPlans.map((plan) => (
          <div className="col-xl-4 col-lg-6 col-md-6" key={plan.id}>
            <div className="pricing-box-4">
              <div className={`icon ${plan.iconBgClass}`}>
                <i className={plan.iconClass}></i>
              </div>
              <div className="pricing-header">
                <h3>{plan.planName}</h3>
                <h2>
                  <sup>$</sup> {monthly ? plan.monthlyPrice : plan.yearlyPrice}
                  <sub>/ {monthly ? "Monthly" : " Yearly"}</sub>
                </h2>
                <p>{plan.description}</p>
              </div>
              <ul className="pricing-list">
                {plan.features.slice(2, 6).map((feature, idx) => (
                  <li key={idx} className={!feature.included ? "color-2" : ""}>
                    {feature.included ? (
                      <i className="flaticon-check"></i>
                    ) : (
                      <i className="far fa-times-circle"></i>
                    )}
                    {feature.included ? (
                      feature.text
                    ) : (
                      <del>{feature.text}</del>
                    )}
                  </li>
                ))}
              </ul>
              <Link to={plan.buttonLink} className="theme-btn">
                Join This Plan
                <i className="far fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingTabpane2;
