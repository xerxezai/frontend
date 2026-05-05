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
            <span className="fade-in">Your SEO Score</span>
            <h2 className="text-white char-animation">
              {"SEO Score of Your Site"}
            </h2>

            <p className="mt-3 text-white">
              Welcome to SEOZ your trusted partner for comprehensive SEO and
              digital <br />
              marketing solutions. With our proven expertise.
            </p>
          </div>

          <SeoFormSection />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
