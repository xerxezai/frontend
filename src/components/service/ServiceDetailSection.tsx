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
                {serviceInfo.detailBody && (
                  <p className="mt-3">{serviceInfo.detailBody}</p>
                )}
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

