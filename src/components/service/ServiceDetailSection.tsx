import ServiceSidebar from "./ServiceSidebar";
import type { ServiceDataType } from "../../types";
import ServiceDetailKeyFacts from "./ServiceDetailKeyFacts";
import ServiceCoreAdvantage from "../core-advantage/ServiceCoreAdvantage";
import FaqAccordion from "../faq/FaqAccordion";
import Image from "../utils/Image";

interface Props {
  serviceInfo: ServiceDataType;
}
const ServiceDetailSection = ({ serviceInfo }: Props) => {
  return (
    <section className="service-detaile-section section-padding fix">
      <div className="container">
        <div className="service-details-wrapper">
          <div className="row">
            <div className="col-lg-8">
              <div className="service-details-content">
                <div className="service-details-image">
                  <Image
                    src={serviceInfo.detailImg}
                    alt="img"
                    width={856}
                    height={406}
                  />
                </div>
                <h2 className="char-animation">
                  {serviceInfo.title}
                </h2>
                <p className="mt-2">{serviceInfo.description}</p>
                <p className="mt-3">
                  Transportation Information Modeling (BIM) is revolutionizing
                  how construction projects are designed, managed, and executed.
                  BIM allows for the creation of detailed digital building
                  construction marketing representations of buildings,
                  facilitating better planning, collaboration, and
                  decision-making.
                </p>
                <ServiceDetailKeyFacts />
                <ServiceCoreAdvantage />
                <h4 className="how-title char-animation">
                  Frequently Asked Questions
                </h4>
                <FaqAccordion />
              </div>
            </div>
            <div className="col-lg-4">
              <ServiceSidebar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailSection;
