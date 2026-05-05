import FaqAccordion from "./FaqAccordion";

interface Props {
  variant?: boolean;
}
const FaqSection = ({ variant }: Props) => {
  return (
    <section
      className={`faq-section fix section-padding ${variant ? "" : "pt-0"}`}
    >
      <div className="container">
        <div className="section-title text-center">
          <span className="fade-in">Our FAQs</span>
          <h2 className="char-animation">Frequently Asked Questions</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <FaqAccordion />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
