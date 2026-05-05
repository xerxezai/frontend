import { faqData } from "../../data";
import { useState } from "react";
import Image from "../utils/Image";

interface Props {
  variant?: boolean;
  reverse?: boolean;
}
const FaqSection2 = ({ variant, reverse }: Props) => {
  const [openItemId, setOpenItemId] = useState<number | null>(1);
  const handleAccordionClick = (itemId: number) => {
    setOpenItemId((prevId) => (prevId === itemId ? null : itemId));
  };

  return (
    <section
      className={`faq-section-3 fix section-padding ${variant ? "" : "pt-0"}`}
    >
      <div className="container">
        <div className="faq-wrapper-3">
          <div className={`row g-4 ${reverse ? "flex-row-reverse" : ""}`}>
            <div className="col-lg-6">
              <div className="faq-content">
                <div className="section-title mb-5">
                  <span className="fade-in">Our FAQs</span>
                  <h2 className="char-animation">Frequently Asked Questions</h2>
                </div>
                <div className="faq-items style-2">
                  <div className="faq-accordion">
                    <div className="accordion">
                      {faqData.map((item, index) => (
                        <div
                          key={item.id}
                          className={`accordion-item ar-accordion-item ${
                            item.id === faqData.length && "mb-0"
                          }`}
                          data-aos="fade-up"
                          data-aos-delay={index * 200} // stagger delay for each card
                          data-aos-duration="1000" // smooth animation duration
                          data-aos-easing="ease-out-cubic" // smooth easing
                          data-aos-once="true"
                        >
                          <h5 className="accordion-header">
                            <button
                              className={`accordion-button ${
                                openItemId === item.id ? "" : "collapsed"
                              }`}
                              type="button"
                              onClick={() => handleAccordionClick(item.id)}
                              aria-expanded={
                                openItemId === item.id ? "true" : "false"
                              }
                            >
                              {item.question}
                            </button>
                          </h5>
                          <div
                            className={`ar-accordion-body ${
                              openItemId === item.id ? "show" : ""
                            }`}
                          >
                            <div className="accordion-body">{item.answer}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className={`faq-image img-custom-anim-right ${
                  reverse ? "style-2" : ""
                }`}
              >
                {variant ? (
                  <Image
                    src="assets/img/faq-2.png"
                    alt="FAQ illustration"
                    width={596}
                    height={604}
                    className="fade-in"
                  />
                ) : (
                  <Image
                    src="assets/img/faq.png"
                    alt="FAQ illustration"
                    width={596}
                    height={607}
                    className="fade-in"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection2;
