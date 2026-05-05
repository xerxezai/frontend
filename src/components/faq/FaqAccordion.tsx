import { faqData } from "../../data";
import { useState } from "react";

const FaqAccordion = () => {
  const [openItemId, setOpenItemId] = useState<number>(1);
  const handleAccordionClick = (itemId: number) => {
    setOpenItemId((prevId) => (prevId === itemId ? 0 : itemId));
  };

  return (
    <div className="faq-items style-2">
      <div className="faq-accordion">
        <div className="accordion">
          {faqData.map((item, index) => (
            <div
              key={item.id}
              className={`accordion-item ar-accordion-item ${
                index === faqData.length - 1 ? "mb-0" : ""
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
  );
};

export default FaqAccordion;
