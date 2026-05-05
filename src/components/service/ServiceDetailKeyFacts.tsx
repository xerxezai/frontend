import { serviceKeyFacts } from "../../data";

const ServiceDetailKeyFacts = () => {
  return (
    <div className="row g-4">
      {serviceKeyFacts.map((item, index) => (
        <div className="col-lg-6" key={item.id}>
          <div
            className="icon-box-items"
            data-aos="fade-up"
            data-aos-delay={index * 200} // stagger delay for each card
            data-aos-duration="1000" // smooth animation duration
            data-aos-easing="ease-out-cubic" // smooth easing
            data-aos-once="true"
          >
            <div className="icon-box">
              <i className={item.icon}></i>
            </div>
            <div className="icon-contnet">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceDetailKeyFacts;
