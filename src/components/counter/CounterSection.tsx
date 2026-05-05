import { counterData } from "../../data";
import CountUp from "../utils/CountUp";

interface Props {
  variant?: string;
}
const CounterSection = ({ variant }: Props) => {
  return (
    <section
      className={`counter-section fix section-padding pt-0 ${
        variant === "style-2"
          ? "sec-bg-4"
          : variant === "style-3"
          ? "section-bg-2 "
          : ""
      }`}
    >
      <div className="container">
        <div className="counter-wrapper">
          {counterData.map((item, index) => (
            <div
              key={item.id}
              className={`counter-items ${item.styleClass}`}
              data-aos="fade-up"
              data-aos-delay={index * 200} // stagger delay for each card
              data-aos-duration="1000" // smooth animation duration
              data-aos-easing="ease-out-cubic" // smooth easing
              data-aos-once="true"
            >
              <div className="icon">
                <i className={item.iconClass}></i>
              </div>
              <div className="content">
                <CountUp value={item.targetValue} suffix={item.suffix} />
                <p className={variant === "style-2" ? "text-white" : ""}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
