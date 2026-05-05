import { workingProcessData } from "../../data";

const WorkingProcessSection2 = () => {
  return (
    <section className="working-process-section-3 section-padding section-bg-2 fix">
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Working Process</span>
          <h2 className="char-animation">
            How We Work to Help Your
            <br /> Business Grow
          </h2>
        </div>
        <div className="row">
          {workingProcessData.map((step, index) => (
            <div
              className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
              key={step.number}
            >
              <div
                className="working-process-box-items-3"
                data-aos="fade-up"
                data-aos-delay={index * 200} // stagger delay for each card
                data-aos-duration="1000" // smooth animation duration
                data-aos-easing="ease-out-cubic" // smooth easing
                data-aos-once="true"
              >
                <div className={`working-icon ${step.iconStyleClass || ""}`}>
                  <span className="number">{step.number}</span>
                  <i className={step.iconClass}></i>
                </div>
                <div className="working-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkingProcessSection2;
