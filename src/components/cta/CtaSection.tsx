import SeoFormSection from "../forms/SeoFormSection";
import Image from "../utils/Image";

const CtaSection = () => {
  return (
    <section className="cta-contact-form-section fix section-padding bg-cover">
      <div className="container">
        <div className="cta-contact-form-wrapper">
          <div className="plane-shape">
            <Image
              src="assets/img/cta/plane.png"
              alt="img"
              width={141}
              height={132}
            />
          </div>
          <div className="section-title text-center mb-0">
            <span className="fade-in">Free Tech Assessment</span>
            <h2 className="text-white char-animation">
              Request a Digital Transformation Audit
            </h2>

            <p className="mt-3 text-white">
              Enter your website and email — our experts will analyse your current stack
              and <br />
              identify opportunities for AI, cloud, and DevSecOps modernisation.
            </p>
          </div>

          <SeoFormSection />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
