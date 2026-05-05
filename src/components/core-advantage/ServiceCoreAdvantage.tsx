import { workSteps } from "../../data";

const ServiceCoreAdvantage = () => {
  return (
    <>
      <h4 className="how-title char-animation">How it Works</h4>
      {workSteps.map((step, index) => (
        <div
          key={step.number}
          className={`work-box-items ${index === 1 ? "style-2" : ""} ${
            index === 2 ? "style-3" : ""
          }`}
          data-aos="fade-up"
          data-aos-delay={index * 200} // stagger delay for each card
          data-aos-duration="1000" // smooth animation duration
          data-aos-easing="ease-out-cubic" // smooth easing
          data-aos-once="true"
        >
          {index % 2 === 0 ? (
            <>
              <div className="work-content">
                <h3>{step.title}</h3>
                <p className="mt-2">{step.description}</p>
              </div>
              <h2 className="work-number">{step.number}</h2>
            </>
          ) : (
            <>
              <h2 className="work-number">{step.number}</h2>
              <div className="work-content">
                <h3>{step.title}</h3>
                <p className="mt-2">{step.description}</p>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default ServiceCoreAdvantage;
