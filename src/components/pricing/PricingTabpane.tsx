import { Link } from "react-router-dom";
import React, { useMemo } from "react";
import { pricingPlans } from "../../data";

interface PricingTabpaneProps {
  monthly: boolean;
}

const PricingTabpane: React.FC<PricingTabpaneProps> = ({ monthly }) => {
  const renderedPlans = useMemo(() => {
    return pricingPlans.map((plan) => (
      <div key={plan.id} className="col-xl-4 col-lg-6 col-md-6">
        <div className={`pricing-box-items ${plan.id === 2 ? "active" : ""}`}>
          <div className="pricing-header">
            <h3>{plan.planName}</h3>
            <h2>
              <sup>$</sup>
              {monthly ? plan.monthlyPrice : plan.yearlyPrice}
              <sub>{monthly ? "Monthly" : " Yearly"}</sub>
            </h2>
          </div>
          <p>{plan.description}</p>
          <Link to={plan.buttonLink} className="theme-btn">
            Join This Plan
            <i className="far fa-arrow-right"></i>
          </Link>
          <ul className="pricing-list">
            {plan.features.map((feature, i) => (
              <li key={i}>
                <i
                  className={
                    feature.included ? "flaticon-check" : "far fa-times-circle"
                  }
                ></i>
                {feature.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ));
  }, [monthly]);

  return (
    <div className="pricing-package-wrapper">
      <div className="row">{renderedPlans}</div>
    </div>
  );
};

export default PricingTabpane;
