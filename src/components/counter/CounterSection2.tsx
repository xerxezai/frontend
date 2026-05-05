import { counterData } from "../../data";
import CountUp from "../utils/CountUp";

const CounterSection2 = () => {
  return (
    <section className="counter-section-2 section-padding pt-0">
      <div className="container">
        <div className="counter-wrapper-2">
          {counterData.map((counter, index) => (
            <div
              key={counter.id}
              className="counter-box-items-2"
              data-aos="fade-up"
              data-aos-delay={index * 200} // stagger delay for each card
              data-aos-duration="1000" // smooth animation duration
              data-aos-easing="ease-out-cubic" // smooth easing
              data-aos-once="true"
            >
              <div className="counter-icon">
                <i className={counter.iconClass}></i>
              </div>
              <div className="counter-content">
                <CountUp
                  duration={1500}
                  value={counter.variantTargetValue}
                  suffix={counter.variantSuffix}
                />
                <p>{counter.variantLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection2;
