import ServiceSidebar from "./ServiceSidebar";
import type { ServiceDataType } from "../../types";
import ServiceDetailKeyFacts from "./ServiceDetailKeyFacts";
import ServiceCoreAdvantage from "../core-advantage/ServiceCoreAdvantage";
import FaqAccordion from "../faq/FaqAccordion";
import Image from "../utils/Image";
import { useState } from "react";

interface Props {
  serviceInfo: ServiceDataType;
}

const ServiceDetailSection = ({ serviceInfo }: Props) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                  {serviceInfo.title.replace(/\n/g, " ")}
                </h2>
                <p className="mt-2">{serviceInfo.description}</p>
                {serviceInfo.detailBody && (
                  <p className="mt-3">{serviceInfo.detailBody}</p>
                )}

                {/* Highlights */}
                {serviceInfo.highlights && serviceInfo.highlights.length > 0 && (
                  <div className="row g-2 mt-2 mb-4">
                    {serviceInfo.highlights.map((item, i) => (
                      <div className="col-sm-6" key={i}>
                        <div className="d-flex align-items-center gap-2">
                          <i className="fas fa-check-circle" style={{ color: "#6c57d2", flexShrink: 0 }}></i>
                          <span>{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Facts */}
                {serviceInfo.keyFacts && serviceInfo.keyFacts.length > 0 ? (
                  <div className="row g-4 mt-1">
                    {serviceInfo.keyFacts.map((fact, i) => (
                      <div className="col-lg-6" key={i}>
                        <div className="icon-box-items">
                          <div className="icon-box">
                            <i className={fact.icon}></i>
                          </div>
                          <div className="icon-contnet">
                            <h3>{fact.title}</h3>
                            <p>{fact.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <ServiceDetailKeyFacts />
                    <ServiceCoreAdvantage />
                  </>
                )}

                {/* FAQs */}
                <h4 className="how-title char-animation mt-5">
                  Frequently Asked Questions
                </h4>
                {serviceInfo.faqs && serviceInfo.faqs.length > 0 ? (
                  <div className="accordion mt-3" id={`faq-${serviceInfo.slug}`}>
                    {serviceInfo.faqs.map((faq, i) => (
                      <div className="accordion-item border-0 mb-3" key={i}
                        style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button${openFaq === i ? "" : " collapsed"} fw-semibold`}
                            type="button"
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            style={{ background: openFaq === i ? "#f5f3ff" : "#fff", color: openFaq === i ? "#6c57d2" : "#222", boxShadow: "none" }}
                          >
                            {faq.question}
                          </button>
                        </h2>
                        <div className={`accordion-collapse collapse${openFaq === i ? " show" : ""}`}>
                          <div className="accordion-body text-muted">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <FaqAccordion />
                )}
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
